from django.contrib import admin

from .models import Topic, Thread, Post, Board


admin.site.register(Topic)
admin.site.register(Board)
admin.site.register(Post)
admin.site.register(Thread)
