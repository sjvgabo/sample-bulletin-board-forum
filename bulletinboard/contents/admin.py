from django.contrib import admin

from .models import Board, Post, Thread, Topic

admin.site.register(Topic)
admin.site.register(Board)
admin.site.register(Post)
admin.site.register(Thread)
