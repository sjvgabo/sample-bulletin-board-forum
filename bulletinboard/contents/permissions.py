from rest_framework import permissions


class IsModeratorOrAdministratorOrReadOnly(permissions.BasePermission):
    """
    Custom permission to check whether the user is at least a moderator or an administrator. Allows permission to administrators as well.
    """

    message = "Only moderators and administrators are allowed to perform this action."

    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True

        return request.user.is_moderator or request.user.is_administrator


class IsNotBannedOrReadDeleteOnly(permissions.BasePermission):
    """
    Custom permission to check whether the user is banned. Also allows delete
    """

    message = "Action is not allowed for banned users"

    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS or request.method == "DELETE":
            return True

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
