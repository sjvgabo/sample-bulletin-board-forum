from django.contrib.auth import login
from knox.views import LoginView as KnoxLoginView
from rest_framework import permissions, status, viewsets, mixins
from rest_framework.authentication import BasicAuthentication
from rest_framework.authtoken.serializers import AuthTokenSerializer
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.views import APIView
from bulletinboard.accounts.permissions import IsOtherUserOrReadOnly, IsUserOrReadOnly
from bulletinboard.contents.permissions import (
    IsModeratorOrAdministratorOrReadOnly,
)
from bulletinboard.contents.serializers import PostSerializer

from .serializers import BanUserSerializer, SignUpSerializer, UserSerializer
from .models import User


class SignUpView(APIView):
    """
    Creates new user. Requires no authentication or permission.
    """

    def post(self, request):
        serializer = SignUpSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()

            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(KnoxLoginView):
    """
    Logs a user in the API. Uses Knox token authentication.
    """

    permission_classes = (permissions.AllowAny,)
    authentication_classes = [BasicAuthentication]

    def post(self, request, format=None):
        serializer = AuthTokenSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data["user"]
        login(request, user)
        return super(LoginView, self).post(request, format=None)

    def get_post_response_data(self, request, token, instance):
        user_serializer = self.get_user_serializer_class()

        data = {
            "key": token,
            "expiry": self.format_expiry_datetime(instance.expiry),
        }

        if user_serializer is not None:
            data["user"] = user_serializer(
                request.user, context=self.get_context()
            ).data

        return data


class UserViewSet(
    viewsets.GenericViewSet, mixins.UpdateModelMixin, mixins.RetrieveModelMixin
):
    """
    User viewset for users which allows updating their own profile (except for their user status such as is_poster and is_moderator)
    """

    queryset = User.objects.with_post_counts()
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsUserOrReadOnly]
    serializer_class = UserSerializer
    parser_classes = (MultiPartParser, FormParser, JSONParser)

    @action(detail=True, methods=["PATCH"])
    def remove_avatar(self, request, pk=None):
        try:
            user = self.get_object()
            user.avatar_url.delete()
            user.save()
            serializer = UserSerializer(user)

            return Response(serializer.data, status=status.HTTP_206_PARTIAL_CONTENT)
        except Exception as e:
            return Response(status=status.HTTP_400_BAD_REQUEST)


class BanUserViewSet(
    viewsets.GenericViewSet,
    mixins.UpdateModelMixin,
    mixins.RetrieveModelMixin,
    mixins.ListModelMixin,
):
    """
    User viewset for moderators and administrators which allows them to list all users and their ban status. Allows them to ban / unban users except for their own.
    """

    queryset = User.objects.all()
    permission_classes = [
        permissions.IsAuthenticatedOrReadOnly,
        IsOtherUserOrReadOnly,
        IsModeratorOrAdministratorOrReadOnly,
    ]
    serializer_class = BanUserSerializer
