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
    no_of_posts = serializers.IntegerField(required=False)
    no_of_threads = serializers.IntegerField(required=False)

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

    no_of_posts = serializers.IntegerField(required=False)
    last_replied_user = serializers.CharField(required=False, allow_null=True)
    last_replied = serializers.DateTimeField(required=False, allow_null=True)

    class Meta:
        model = Thread
        fields = [
            "pk",
            "posts",
            "title",
            "is_sticky",
            "is_locked",
            "board",
            "author",
            "author_username",
            "last_replied",
            "last_replied_user",
            "no_of_posts",
        ]

        read_only_fields = [
            "pk",
            "author_username",
            "last_replied",
            "last_replied_user",
            "no_of_posts",
            "posts",
        ]


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
    avatar_url = serializers.ImageField(required=False)

    class Meta:
        model = Post
        fields = [
            "pk",
            "author",
            "message",
            "thread",
            "date_created",
            "author_username",
            "avatar_url",
        ]
        read_only_fields = ["pk", "author", "thread", "date_created", "author_username"]
