from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views


router = DefaultRouter()
router.register(r"topic", views.TopicViewSet, basename="topic")
router.register(r"board", views.BoardViewSet, basename="board")
router.register(r"thread", views.ThreadViewSet, basename="thread")
router.register(r"post", views.PostViewSet, basename="post")


urlpatterns = [
    path("", include(router.urls)),
]
