from bulletinboard.contents import serializers
from bulletinboard.contents.models import Board, Post, Thread, Topic
from bulletinboard.contents.permissions import (
    IsAdministratorOrReadOnly,
    IsNotBannedOrReadDeleteOnly,
)
from rest_framework import permissions, viewsets


class TopicViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Read only Topic viewset
    """

    queryset = Topic.objects.all()
    serializer_class = serializers.TopicSerializer
    pagination_class = None

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
    pagination_class = None # disable pagination to display all boards in homepage

    def get_queryset(self):
        queryset = Board.objects.with_thread_post_counts()
        topic_pk = self.request.query_params.get('topic')
        if topic_pk is not None:
            queryset = Board.objects.filter(topic=topic_pk)

        return queryset


class ThreadViewSet(viewsets.ModelViewSet):
    """
    Thread viewset
    """

    serializer_class = serializers.ThreadSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsNotBannedOrReadDeleteOnly]

    def get_queryset(self):
        queryset = Thread.objects.with_post_counts_and_last_replied().order_by("-is_sticky","-last_replied")

        # only administrators or moderators can edit threads
        if self.action in ["update", "partial_update"] and not self.request.user.is_moderator and not self.request.user.is_administrator:
            queryset = queryset.none()

        # users can only delete their own threads
        elif self.action in ["destroy"] and not self.request.user.is_moderator and not self.request.user.is_administrator:
                queryset = queryset.filter(author=self.request.user)

        # For fetching a thread's posts
        board_pk = self.request.query_params.get('board')
        if board_pk is not None:
            queryset = queryset.filter(board=board_pk)

        return queryset

    def perform_create(self, serializer):
        # Automatically assigns a new thread to the user
        kwargs = {
            'author': self.request.user
        }
        serializer.save(**kwargs)


class PostViewSet(viewsets.ModelViewSet):
    """
    Post viewset
    """

    permission_classes = [
        permissions.IsAuthenticatedOrReadOnly, 
        IsNotBannedOrReadDeleteOnly,
    ]
    serializer_class = serializers.PostSerializer

    def get_queryset(self):
        # returns all post for GET methods
        if self.action in ["retrieve", "list"]: 
            queryset = Post.objects.all()
        # return only the posts of the requesting user for other methods
        else:
            queryset = Post.objects.filter(author=self.request.user)

        # For fetching a user's posts
        username = self.request.query_params.get('username')
        if username is not None:
            queryset = queryset.filter(author_username=username).order_by("-date_created")

        # For fetching a thread's posts
        thread_pk = self.request.query_params.get('thread')
        if thread_pk is not None:
            queryset = queryset.filter(thread=thread_pk)

        return queryset

    def perform_create(self, serializer):
        # automatically assigns the author of the post to the requesting user
        kwargs = {
            'author': self.request.user
        }
        serializer.save(**kwargs)
