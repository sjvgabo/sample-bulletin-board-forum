from rest_framework import serializers

from .models import Post, Thread, Board, Topic


class TopicSerializer(serializers.ModelSerializer):
    """
    Serializer for Topics
    """

    boards = serializers.PrimaryKeyRelatedField(many=True, read_only=True)

    class Meta:
        model = Topic
        fields = ["pk", "name", "boards"]


class BoardSerializer(serializers.ModelSerializer):
    """
    Serializer for Boards
    """

    topic = serializers.PrimaryKeyRelatedField(queryset=Topic.objects.all(), many=False)
    threads = serializers.PrimaryKeyRelatedField(many=True, read_only=True)

    class Meta:
        model = Board
        fields = [
            "threads",
            "pk",
            "name",
            "description",
            "no_of_threads",
            "no_of_posts",
            "topic",
        ]


class ThreadSerializer(serializers.ModelSerializer):
    """
    Serializer for Threads
    """

    board = serializers.PrimaryKeyRelatedField(
        queryset=Board.objects.all(),
        many=False,
    )
    posts = serializers.PrimaryKeyRelatedField(many=True, read_only=True)

    class Meta:
        model = Thread
        fields = [
            "pk",
            "posts",
            "title",
            "is_sticky",
            "is_locked",
            "no_of_posts",
            "board",
        ]


class PostSerializer(serializers.ModelSerializer):
    """
    Serializer for posts
    """

    thread = serializers.PrimaryKeyRelatedField(
        queryset=Thread.objects.all(),
        many=False,
    )

    class Meta:
        model = Post
        fields = ["pk", "author", "message", "thread"]
