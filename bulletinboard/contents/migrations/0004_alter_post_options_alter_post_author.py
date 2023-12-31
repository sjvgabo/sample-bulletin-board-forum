# Generated by Django 4.1.2 on 2022-10-12 02:47

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ("contents", "0003_alter_post_author_alter_thread_board"),
    ]

    operations = [
        migrations.AlterModelOptions(
            name="post",
            options={"get_latest_by": ["date_created"], "ordering": ["date_created"]},
        ),
        migrations.AlterField(
            model_name="post",
            name="author",
            field=models.ForeignKey(
                editable=False,
                on_delete=django.db.models.deletion.CASCADE,
                related_name="authors",
                to=settings.AUTH_USER_MODEL,
            ),
        ),
    ]
