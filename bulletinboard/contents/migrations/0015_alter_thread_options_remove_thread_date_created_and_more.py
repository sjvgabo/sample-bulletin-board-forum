# Generated by Django 4.1.2 on 2022-10-17 07:59

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("contents", "0014_alter_board_options_alter_thread_options_and_more"),
    ]

    operations = [
        migrations.AlterModelOptions(
            name="thread",
            options={"ordering": ["-is_sticky", "-last_replied"]},
        ),
        migrations.RemoveField(
            model_name="thread",
            name="date_created",
        ),
        migrations.AddField(
            model_name="thread",
            name="last_replied",
            field=models.DateTimeField(auto_now_add=True, null=True),
        ),
        migrations.AddField(
            model_name="thread",
            name="last_replied_user",
            field=models.CharField(blank=True, editable=False, max_length=150),
        ),
    ]
