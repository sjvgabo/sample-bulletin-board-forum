from django.contrib.auth import get_user_model
from django.db import models
from traitlets import default

User = get_user_model()


class Topic(models.Model):
    name = models.CharField(max_length=50)

    def __str__(self):
        return self.name


class Board(models.Model):
    topic = models.ForeignKey(Topic, related_name="boards", on_delete=models.CASCADE)
    name = models.CharField(max_length=50)
    description = models.TextField(max_length=500)
    no_of_threads = models.IntegerField("Number of threads", default=0)
    no_of_posts = models.IntegerField("Number of posts", default=0)

    def __str__(self):
        return self.name

    def update_no_of_threads(self):
        self.no_of_threads = Thread.objects.filter(board__pk=self.pk).count()
        self.save()

    def update_no_of_posts(self):
        number_of_posts = sum(
            thread.no_of_posts for thread in Thread.objects.filter(board__pk=self.pk)
        )
        self.no_of_posts = number_of_posts
        self.save()


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
    )
    is_sticky = models.BooleanField(default=False)
    is_locked = models.BooleanField(default=False)
    no_of_posts = models.IntegerField("Number of posts", default=0)
    author_username = models.CharField(
        "Author username", max_length=150, blank=True, editable=False
    )
    last_replied = models.DateTimeField(
        auto_now_add=True, blank=True, null=True, editable=False
    )
    last_replied_user = models.CharField(blank=True, max_length=150, editable=False)

    class Meta:
        ordering = ["-is_sticky", "-last_replied"]

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        self.author_username = self.author.username
        super().save(*args, **kwargs)
        board = Board.objects.get(pk=self.board.pk)
        board.update_no_of_threads()

    def delete(self, *args, **kwargs):
        super(Thread, self).delete(*args, **kwargs)
        board = Board.objects.get(pk=self.board.pk)
        board.update_no_of_threads()

    def update_no_of_posts(self):
        self.no_of_posts = Post.objects.filter(thread__pk=self.pk).count()
        self.save()


class Post(models.Model):
    author = models.ForeignKey(
        User, related_name="user_posts", on_delete=models.CASCADE
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
        thread = Thread.objects.get(pk=self.thread.pk)
        thread.last_replied = self.date_created
        thread.last_replied_user = self.author.username
        board = Board.objects.get(pk=thread.board.pk)
        thread.update_no_of_posts()
        board.update_no_of_posts()

    def delete(self, *args, **kwargs):
        super(Post, self).delete(*args, **kwargs)
        thread = Thread.objects.get(pk=self.thread.pk)
        board = Board.objects.get(pk=thread.board.pk)
        thread.update_no_of_posts()
        board.update_no_of_posts()
