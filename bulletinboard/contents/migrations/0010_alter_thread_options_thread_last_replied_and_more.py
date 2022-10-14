# Generated by Django 4.1.2 on 2022-10-14 08:45

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("contents", "0009_alter_post_options_alter_thread_options_and_more"),
    ]

    operations = [
        migrations.AlterModelOptions(
            name="thread",
            options={"ordering": ["-is_sticky", "-last_replied"]},
        ),
        migrations.AddField(
            model_name="thread",
            name="last_replied",
            field=models.DateTimeField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name="thread",
            name="last_replied_user",
            field=models.CharField(blank=True, max_length=150),
        ),
        migrations.AlterField(
            model_name="post",
            name="date_created",
            field=models.DateTimeField(auto_now_add=True),
        ),
    ]