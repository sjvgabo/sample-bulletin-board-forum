from rest_framework import serializers

from .models import Board, Post, Thread, Topic, User


class TopicSerializer(serializers.ModelSerializer):
    """
    Serializer for Topics
    """

    # boards = serializers.PrimaryKeyRelatedField(many=True, read_only=True)

    class Meta:
        model = Topic
        fields = ["pk", "name"]


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
        read_only_fields = ["pk", "board", "title", "no_of_posts", "no_of_threads"]


class ThreadSerializer(serializers.ModelSerializer):
    """
    Serializer for Threads
    """

    board = serializers.PrimaryKeyRelatedField(
        queryset=Board.objects.all(),
        many=False,
    )
    posts = serializers.PrimaryKeyRelatedField(many=True, read_only=True)

    author = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(),
        many=False,
    )

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
            "author",
            "author_username",
            "last_replied",
            "last_replied_user",
        ]

        read_only_fields = ["pk", "board", "no_of_posts", "author_username", "last_replied", "last_replied_user"]


class PostSerializer(serializers.ModelSerializer):
    """
    Serializer for posts
    """

    thread = serializers.PrimaryKeyRelatedField(
        queryset=Thread.objects.all(),
        many=False,
    )
    author = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(),
        many=False,
    )

    class Meta:
        model = Post
        fields = [
            "pk",
            "author",
            "message",
            "thread",
            "date_created",
            "author_username",
        ]
        read_only_fields = ["pk", "author", "thread", "date_created", "author_username"]
