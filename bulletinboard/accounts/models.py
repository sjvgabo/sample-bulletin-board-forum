from django.db import models
from django.contrib.auth.models import AbstractUser


GENDER_CHOICES = [("M", "Male"), ("F", "Female"), ("O", "Others")]


class User(AbstractUser):
    first_name = models.CharField(
        "First name",
        max_length=150,
    )
    last_name = models.CharField(
        "Last name",
        max_length=150,
    )
    email = models.EmailField(
        "email address",
    )
    about_myself = models.TextField("About myself")
    date_of_birth = models.DateField("Date of Birth")
    hometown = models.CharField("Hometown", max_length=50)
    present_location = models.CharField("Present location", max_length=100)
    website = models.CharField("Website", max_length=50, blank=True)
    gender = models.CharField(
        "Gender",
        max_length=2,
        choices=GENDER_CHOICES,
        blank=True,
    )
    interests = models.TextField("Interest", max_length=200, blank=True)

    is_poster = models.BooleanField("Poster status", default=True)
    is_moderator = models.BooleanField("Moderator status", default=False)
    is_administrator = models.BooleanField("Administrator status", default=False)
    is_banned = models.BooleanField("Banned status", default=False)

    USERNAME_FIELD = "username"
    REQUIRED_FIELDS = [
        "first_name",
        "last_name",
        "email",
        "about_myself",
        "date_of_birth",
        "hometown",
        "present_location",
    ]

    def __str__(self):
        return self.first_name
