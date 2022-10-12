from django.urls import include, path
from knox import views as knox_views
from rest_framework.routers import DefaultRouter

from .views import BanUserViewSet, LoginView, SignUpView, UserViewSet

router = DefaultRouter()
router.register(r"users", UserViewSet, basename="users")
router.register(r"ban-user", BanUserViewSet, basename="ban-user")
urlpatterns = [
    path("registration/", SignUpView.as_view(), name="sign_up"),
    path(r"login/", LoginView.as_view(), name="knox_login"),
    path(r"logout/", knox_views.LogoutView.as_view(), name="knox_logout"),
    path(r"logout-all/", knox_views.LogoutAllView.as_view(), name="knox_logout_all"),
    path("", include("rest_framework.urls", namespace="rest_framework")),
    path("", include(router.urls)),
]
