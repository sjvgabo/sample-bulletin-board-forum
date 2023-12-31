# Generated by Django 4.1.2 on 2022-10-07 13:22

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name="Board",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("name", models.CharField(max_length=50)),
                ("description", models.TextField(max_length=500)),
                (
                    "no_of_threads",
                    models.IntegerField(default=0, verbose_name="Number of threads"),
                ),
                (
                    "no_of_posts",
                    models.IntegerField(default=0, verbose_name="Number of posts"),
                ),
            ],
        ),
        migrations.CreateModel(
            name="Topic",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("name", models.CharField(max_length=50)),
            ],
        ),
        migrations.CreateModel(
            name="Thread",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("title", models.CharField(max_length=50)),
                ("is_sticky", models.BooleanField(default=False)),
                ("is_locked", models.BooleanField(default=False)),
                (
                    "no_of_posts",
                    models.IntegerField(default=0, verbose_name="Number of posts"),
                ),
                (
                    "board",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="threads",
                        to="contents.board",
                    ),
                ),
            ],
        ),
        migrations.CreateModel(
            name="Post",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("message", models.TextField(max_length=500)),
                ("date_created", models.DateField(auto_now_add=True)),
                (
                    "author",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        related_name="posts",
                        to=settings.AUTH_USER_MODEL,
                    ),
                ),
            ],
            options={
                "ordering": ["date_created", "author"],
                "get_latest_by": ["date_created", "author"],
            },
        ),
        migrations.AddField(
            model_name="board",
            name="topic",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name="boards",
                to="contents.topic",
            ),
        ),
    ]
