# Generated by Django 4.1.2 on 2022-10-14 03:54

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ("contents", "0008_post_author_username_thread_author_username"),
    ]

    operations = [
        migrations.AlterModelOptions(
            name="post",
            options={"get_latest_by": ["-date_created"], "ordering": ["date_created"]},
        ),
        migrations.AlterModelOptions(
            name="thread",
            options={"ordering": ["-is_sticky"]},
        ),
        migrations.AlterField(
            model_name="post",
            name="author",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name="user_posts",
                to=settings.AUTH_USER_MODEL,
            ),
        ),
        migrations.AlterField(
            model_name="thread",
            name="author",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name="threads",
                to=settings.AUTH_USER_MODEL,
            ),
        ),
        migrations.AlterField(
            model_name="thread",
            name="board",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                related_name="threads",
                to="contents.board",
            ),
        ),
    ]
