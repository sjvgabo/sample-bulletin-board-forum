from ast import Sub
from datetime import datetime
from django.db import models
from django.db.models.functions import Coalesce
from django.db.models import Subquery, OuterRef


class BoardManager(models.Manager):
    def with_thread_post_counts(self):
        return self.annotate(
            no_of_threads=Coalesce(models.Count("threads", distinct=True), 0),
            no_of_posts=Coalesce(models.Count("threads__posts", distinct=True), 0),
        )
