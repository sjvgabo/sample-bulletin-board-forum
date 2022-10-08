from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from bulletinboard.contents.models import Topic, Board, Thread, Post
from bulletinboard.contents import serializers
from bulletinboard.contents.serializers import (
    BoardSerializer,
    ThreadSerializer,
    PostSerializer,
)


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
        board_list = Board.objects.filter(topic=topic)
        board_json = BoardSerializer(board_list, many=True)
        return Response(board_json.data)


class BoardViewSet(viewsets.ModelViewSet):
    """
    Board viewset
    """

    queryset = Board.objects.all()
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    serializer_class = serializers.BoardSerializer

    @action(detail=True)
    def threads(self, request, pk=None):
        """
        Returns paginated threads under the board (Default: 20 items)
        """
        board = self.get_object()
        threads = Thread.objects.filter(board=board)
        paginated_threads = self.paginate_queryset(threads)
        threads_json = ThreadSerializer(paginated_threads, many=True)
        return Response(threads_json.data)


class ThreadViewSet(viewsets.ModelViewSet):
    """
    Thread viewset
    """

    queryset = Thread.objects.all()
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    serializer_class = serializers.ThreadSerializer

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
        posts_json = PostSerializer(paginated_posts, many=True)
        return Response(posts_json.data)


class PostViewSet(viewsets.ModelViewSet):
    """
    Post viewset
    """

    queryset = Post.objects.all()
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    serializer_class = serializers.PostSerializer
