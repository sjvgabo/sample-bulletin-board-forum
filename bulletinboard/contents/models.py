from django.contrib.auth import get_user_model
from django.db import models

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

    class Meta:
        ordering = ("-is_sticky",)

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        self.author_username = self.author.username
        super().save(*args, **kwargs)

    def update_no_of_posts(self):
        self.no_of_posts = Post.objects.filter(thread__pk=self.pk).count()
        self.save()


class Post(models.Model):
    author = models.ForeignKey(User, related_name="posts", on_delete=models.CASCADE)
    thread = models.ForeignKey(Thread, related_name="posts", on_delete=models.CASCADE)
    message = models.TextField(max_length=500)
    date_created = models.DateField(auto_now_add=True, editable=False)
    author_username = models.CharField(
        "Author username", max_length=150, blank=True, editable=False
    )

    class Meta:
        ordering = ["date_created"]
        get_latest_by = ["date_created"]

    def __str__(self):
        return self.message

    def save(self, *args, **kwargs):
        self.author_username = self.author.username
        super().save(*args, **kwargs)
        thread = Thread.objects.get(pk=self.thread.pk)
        thread.update_no_of_posts()

    def delete(self, *args, **kwargs):
        super(Post, self).delete(*args, **kwargs)
        thread = Thread.objects.get(pk=self.thread.pk)
        thread.update_no_of_posts()
