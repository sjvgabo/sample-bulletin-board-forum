from rest_framework import permissions


class IsModeratorOrReadOnly(permissions.BasePermission):
    """
    Custom permission to check whether the user is at least a moderator or an administrator
    """

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True

        return request.user.is_moderator or request.user.is_administrator


class IsAdministratorOrReadOnly(permissions.BasePermission):
    """
    Custom permission to check whether the user is at least a moderator or an administrator
    """

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True

        return request.user.is_administrator
