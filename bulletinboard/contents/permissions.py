from email import message
from rest_framework import permissions
import logging


class IsModeratorOrAdministratorOrReadOnly(permissions.BasePermission):
    """
    Custom permission to check whether the user is at least a moderator or an administrator. Allows permission to administrators as well.
    """

    message = "Only moderators and administrators are allowed to perform this action."

    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True

        return request.user.is_moderator or request.user.is_administrator


class IsModeratorOrAdministrator(permissions.BasePermission):
    """
    Custom permission to check whether the user is at least a moderator or an administrator. Allows permission to administrators as well.
    """

    message = "Only moderators and administrators are allowed to perform this action."

    def has_permission(self, request, view):

        return request.user.is_moderator or request.user.is_administrator


class IsNotBannedOrReadOnly(permissions.BasePermission):
    """
    Custom permission to check whether the user is at least a moderator or an administrator
    """

    message = "Action is not allowed for banned users"

    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True

        return not request.user.is_banned


class IsNotBanned(permissions.BasePermission):
    """
    Custom permission to check whether the user is at least a moderator or an administrator
    """

    message = "Action is not allowed for banned users"

    def has_permission(self, request, view):
        return not request.user.is_banned


class IsAdministratorOrReadOnly(permissions.BasePermission):
    """
    Custom permission to check whether the user is at least a moderator or an administrator
    """

    message = "Only administrators are allowed to perform this action."

    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True

        return request.user.is_administrator


class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Object-level permission to only allow owners of an object to edit it.
    Assumes the model instance has an `owner` attribute.
    """

    message = "Modifying/creating non-owner content is not allowed"

    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True

        # Users can only create posts/threads under their own name. Assumes object has field called author
        if request.method == "POST":
            print(request.data)
            return request.user.pk == int(request.data["author"])

        return True

    def has_object_permission(self, request, view, obj):
        print(obj.author_id)
        if request.method in permissions.SAFE_METHODS:
            return True

        return request.user == obj.author
