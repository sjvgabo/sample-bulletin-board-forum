# Generated by Django 4.1.2 on 2022-10-13 02:34

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("contents", "0007_thread_author_alter_post_author"),
    ]

    operations = [
        migrations.AddField(
            model_name="post",
            name="author_username",
            field=models.CharField(
                blank=True,
                editable=False,
                max_length=150,
                verbose_name="Author username",
            ),
        ),
        migrations.AddField(
            model_name="thread",
            name="author_username",
            field=models.CharField(
                blank=True,
                editable=False,
                max_length=150,
                verbose_name="Author username",
            ),
        ),
    ]
