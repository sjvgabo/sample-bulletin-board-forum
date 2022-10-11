from django.contrib.auth import login
from knox.views import LoginView as KnoxLoginView
from rest_framework import permissions, status
from rest_framework.authentication import BasicAuthentication
from rest_framework.authtoken.serializers import AuthTokenSerializer
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import SignUpSerializer


class SignUpView(APIView):
    """
    Creates new user
    """

    def post(self, request):
        serializer = SignUpSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()

            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(KnoxLoginView):
    """
    Logs a user in the API
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
            data["user"] = user_serializer(request.user, context=self.get_context()).data

        return data
