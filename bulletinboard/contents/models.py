from django.db import models
from django.contrib.auth import get_user_model

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


class Thread(models.Model):
    title = models.CharField(max_length=50)
    board = models.ForeignKey(Board, related_name="threads", on_delete=models.CASCADE)
    is_sticky = models.BooleanField(default=False)
    is_locked = models.BooleanField(default=False)
    no_of_posts = models.IntegerField("Number of posts", default=0)

    def __str__(self):
        return self.title

    def toggle_sticky(self):
        self.is_sticky = not self.is_sticky
        self.save()

    def toggle_lock(self):
        self.is_locked = not self.is_locked
        self.save()


class Post(models.Model):
    author = models.ForeignKey(User, related_name="posts", on_delete=models.CASCADE)
    thread = models.ForeignKey(Thread, related_name="posts", on_delete=models.CASCADE)
    message = models.TextField(max_length=500)
    date_created = models.DateField(auto_now_add=True)

    class Meta:
        ordering = ["date_created", "author"]
        get_latest_by = ["date_created", "author"]

    def __str__(self):
        return self.message
