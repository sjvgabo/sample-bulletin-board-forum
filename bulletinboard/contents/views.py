from rest_framework import viewsets, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from bulletinboard.contents.models import Topic, Board, Thread, Post
from bulletinboard.contents import serializers
from bulletinboard.contents.serializers import BoardSerializer, ThreadSerializer, PostSerializer


class TopicViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Read only Topic viewset
    """

    queryset = Topic.objects.all()
    serializer_class = serializers.TopicSerializer

    @action(detail=True)
    def boards(self, request, pk=None):
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
        Returns all the threads under the board
        """
        board = self.get_object()
        threads = Thread.objects.filter(board=board)
        threads_json = ThreadSerializer(threads, many=True)
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
        thread = self.get_object()
        posts = Post.objects.filter(thread=thread)
        posts_json = PostSerializer(posts, many=True)
        return Response(posts_json.data)


class PostViewSet(viewsets.ModelViewSet):
    """
    Post viewset
    """

    queryset = Post.objects.all()
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]
    serializer_class = serializers.PostSerializer
