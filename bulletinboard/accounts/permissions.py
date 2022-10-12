from email import message
from rest_framework import permissions


class IsUserOrReadOnly(permissions.BasePermission):
    """
    Object-level permission to only allow owners to edit their own profile
    """

    message = "Editing other users is not allowed"

    def has_object_permission(self, request, view, obj):
        print("Went here")
        if request.method in permissions.SAFE_METHODS:
            return True

        print(obj)
        return request.user == obj


class IsOtherUserOrReadOnly(permissions.BasePermission):
    """
    Object-level permission to only allow moderators and administrators to only modify other users
    """

    message = "Editing self is not allowed"

    def has_permission(self, request, view):
        return True

    def has_object_permission(self, request, view, obj):
        print("Went here")
        if request.method in permissions.SAFE_METHODS:
            return True

        print(obj)
        return request.user != obj
