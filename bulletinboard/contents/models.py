from django.contrib.auth import get_user_model
from django.db import models
from django.db.models.functions import Coalesce
from django.db.models import Subquery, OuterRef
from bulletinboard.contents.managers import BoardManager

User = get_user_model()


class ThreadQuerySet(models.QuerySet):
    def with_post_counts(self):
        return self.annotate(no_of_posts=Coalesce(models.Count("posts"), 0))

    def with_last_replied(self):
        latest = Post.objects.filter(thread=OuterRef("pk")).order_by("-date_created")
        return self.annotate(
            last_replied=Subquery(latest.values("date_created")[:1]),
            last_replied_user=Subquery(latest.values("author_username")[:1]),
        )

    def with_post_counts_and_last_replied(self):
        return self.with_post_counts().with_last_replied()


class Topic(models.Model):
    name = models.CharField(max_length=50)

    def __str__(self):
        return self.name


class Board(models.Model):
    topic = models.ForeignKey(Topic, related_name="boards", on_delete=models.CASCADE)
    name = models.CharField(max_length=50)
    description = models.TextField(max_length=500)

    objects = BoardManager()

    class Meta:
        ordering = ["pk"]

    def __str__(self):
        return self.name


class Thread(models.Model):
    title = models.CharField(max_length=50)
    board = models.ForeignKey(
        Board,
        related_name="threads",
        on_delete=models.CASCADE,
    )
    author = models.ForeignKey(
        User,
        related_name="threads",
        on_delete=models.CASCADE,
        editable=False,
    )
    is_sticky = models.BooleanField(default=False)
    is_locked = models.BooleanField(default=False)
    author_username = models.CharField(
        "Author username", max_length=150, blank=True, editable=False, null=True
    )

    objects = ThreadQuerySet.as_manager()

    class Meta:
        ordering = [
            "-is_sticky",
        ]

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        self.author_username = self.author.username
        super().save(*args, **kwargs)


class Post(models.Model):
    author = models.ForeignKey(
        User,
        related_name="user_posts",
        on_delete=models.CASCADE,
        editable=False,
    )
    thread = models.ForeignKey(Thread, related_name="posts", on_delete=models.CASCADE)
    message = models.TextField(max_length=500)
    date_created = models.DateTimeField(auto_now_add=True, editable=False)
    author_username = models.CharField(
        "Author username", max_length=150, blank=True, editable=False
    )

    class Meta:
        ordering = ["date_created"]

    def __str__(self):
        return self.message

    def save(self, *args, **kwargs):
        self.author_username = self.author.username
        super().save(*args, **kwargs)

    def avatar_url(self):
        return self.author.avatar_url
