from django.contrib.auth import password_validation
from knox.serializers import UserSerializer as BaseUserSerializer
from rest_framework import serializers
from rest_framework.validators import UniqueValidator

from .models import User


class SignUpSerializer(serializers.ModelSerializer):
    """
    Serializer for user registration
    """

    username = serializers.CharField(
        validators=[UniqueValidator(queryset=User.objects.all())]
    )
    password = serializers.CharField(
        write_only=True,
        style={"input_type": "password"},
    )
    email = serializers.EmailField(
        validators=[UniqueValidator(queryset=User.objects.all())]
    )
    about_myself = serializers.CharField()
    date_of_birth = serializers.DateField()
    hometown = serializers.CharField()
    present_location = serializers.CharField()
    gender = serializers.CharField(allow_blank=True)
    interests = serializers.CharField(allow_blank=True)
    website = serializers.CharField(allow_blank=True)

    class Meta:
        model = User
        fields = [
            "username",
            "password",
            "first_name",
            "last_name",
            "email",
            "date_of_birth",
            "about_myself",
            "hometown",
            "present_location",
            "gender",
            "interests",
            "website",
        ]

    def validate(self, data):
        errors = {}

        password_validation.validate_password(data["password"])

        for value in data:
            if value in ["gender", "website", "interests"]:
                continue
            elif not data[value]:
                errors[value] = ["This field is required."]

        if errors:
            raise serializers.ValidationError(errors)

        return super(SignUpSerializer, self).validate(data)

    def create(self, validate_data):
        password = validate_data.pop("password")
        user = super().create(validate_data)
        user.set_password(password)
        user.save()
        return user


class UserSerializer(BaseUserSerializer):
    """
    Serializes the user data upon logging in / fetching data from UserViewSet
    """

    user_posts = serializers.PrimaryKeyRelatedField(many=True, read_only=True)
    avatar_url = serializers.ImageField(required=False)

    class Meta:
        model = User
        fields = [
            "pk",
            "user_posts",
            "username",
            "first_name",
            "last_name",
            "email",
            "date_of_birth",
            "about_myself",
            "hometown",
            "present_location",
            "gender",
            "interests",
            "website",
            "is_poster",
            "is_moderator",
            "is_administrator",
            "is_banned",
            "avatar_url",
        ]

        read_only_fields = [
            "pk",
            "username",
            "first_name",
            "last_name",
            "email",
            "is_poster",
            "is_moderator",
            "is_administrator",
            "is_banned",
            "user_posts",
        ]


class BanUserSerializer(BaseUserSerializer):
    """
    Serializer for administrators and moderators to ban/unban users
    """

    class Meta:
        model = User
        fields = [
            "username",
            "is_banned",
        ]
        read_only_fields = ["username"]
