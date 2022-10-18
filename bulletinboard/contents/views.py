import logging
from bulletinboard.contents import serializers
from bulletinboard.contents.models import Board, Post, Thread, Topic
from bulletinboard.contents.permissions import (
    IsAdministratorOrReadOnly,
    IsModeratorOrAdministrator,
    IsNotBanned,
    IsNotBannedOrReadOnly,
    IsOwnerOrReadOnly,
    IsModeratorOrAdministratorOrReadOnly,
)
from bulletinboard.contents.serializers import (
    BoardSerializer,
    PostSerializer,
    ThreadSerializer,
)
from rest_framework import permissions, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response


class TopicViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Read only Topic viewset
    """

    queryset = Topic.objects.all()
    serializer_class = serializers.TopicSerializer
    pagination_class = None

    @action(detail=True)
    def boards(self, request, pk=None):
        """
        Returns all boards under a topic
        """
        topic = self.get_object()
        board_list = Board.objects.with_thread_post_counts().filter(topic=topic)
        board_json = BoardSerializer(board_list, many=True)
        return Response(board_json.data)


class BoardViewSet(viewsets.ModelViewSet):
    """
    Board viewset. Allows for creating, retrieving, listing, and deleting boards. Only administrators can
    """

    queryset = Board.objects.with_thread_post_counts()
    permission_classes = [
        permissions.IsAuthenticatedOrReadOnly,
        IsAdministratorOrReadOnly,
    ]
    serializer_class = serializers.BoardSerializer

    @action(detail=True)
    def threads(self, request, pk=None):
        """
        Returns paginated threads under the board (Default: 20 items)
        """
        board = self.get_object()
        threads = (
            Thread.objects.with_post_counts_and_latest_replied()
            .filter(board=board)
            .order_by("-is_sticky", "-last_replied")
        )
        paginated_threads = self.paginate_queryset(threads)
        threads_json = ThreadSerializer(paginated_threads, many=True)
        return Response(threads_json.data)

    def get_permissions(self):
        """
        Instantiates and returns the list of permissions that this view requires.
        """
        if self.action in ["create", "delete", "update", "partial_update"]:
            permission_classes = [
                permissions.IsAuthenticatedOrReadOnly,
                IsAdministratorOrReadOnly,
            ]
        else:
            permission_classes = [permissions.IsAuthenticatedOrReadOnly]
        return [permission() for permission in permission_classes]


class ThreadViewSet(viewsets.ModelViewSet):
    """
    Thread viewset
    """

    queryset = Thread.objects.with_post_counts_and_latest_replied().order_by(
        "-last_replied"
    )
    serializer_class = serializers.ThreadSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    @action(detail=True)
    def posts(self, request, pk=None):
        """_summary_
          Returns a paginated queryset of a the thread's posts (Default: 20 items)
        Args:
            request (_type_): _description_
            pk (_type_, optional): _description_. Defaults to None.

        Returns:
            _type_: _description_
        """
        thread = self.get_object()
        posts = Post.objects.filter(thread=thread)
        paginated_posts = self.paginate_queryset(posts)
        posts_json = PostSerializer(paginated_posts, many=True, context={'request': request})
        return Response(posts_json.data)

    def get_permissions(self):
        """
        Instantiates and returns the list of permissions that this view requires.

        """
        if self.action == "destroy":
            permission_classes = [
                permissions.IsAuthenticatedOrReadOnly,
                (IsOwnerOrReadOnly | IsModeratorOrAdministrator),
            ]
        elif self.action in ["update", "partial_update"]:
            permission_classes = [IsModeratorOrAdministratorOrReadOnly]
        elif self.action == "create":
            permission_classes = [
                permissions.IsAuthenticatedOrReadOnly,
                IsNotBanned,
                IsOwnerOrReadOnly,
            ]
        else:
            permission_classes = [permissions.IsAuthenticatedOrReadOnly]
        return [permission() for permission in permission_classes]


class PostViewSet(viewsets.ModelViewSet):
    """
    Post viewset
    """

    queryset = Post.objects.all()
    permission_classes = [
        permissions.IsAuthenticatedOrReadOnly,
        IsOwnerOrReadOnly,
        IsNotBannedOrReadOnly,
    ]
    serializer_class = serializers.PostSerializer
