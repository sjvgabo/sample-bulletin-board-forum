from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views


router = DefaultRouter()
router.register(r"topic", views.TopicViewSet, basename="topic")
router.register(r"topic/board", views.BoardViewSet, basename="board")
router.register(r"topic/board/thread", views.ThreadViewSet, basename="thread")
router.register(r"topic/board/thread/post", views.PostViewSet, basename="post")


urlpatterns = [
    path("", include(router.urls)),
]
