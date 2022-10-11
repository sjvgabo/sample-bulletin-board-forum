from django.urls import include, path
from knox import views as knox_views

from .views import LoginView, SignUpView

urlpatterns = [
    path("registration/", SignUpView.as_view(), name="sign_up"),
    path(r"login/", LoginView.as_view(), name="knox_login"),
    path(r"logout/", knox_views.LogoutView.as_view(), name="knox_logout"),
    path(r"logout-all/", knox_views.LogoutAllView.as_view(), name="knox_logout_all"),
    path("", include("rest_framework.urls", namespace="rest_framework")),
]
