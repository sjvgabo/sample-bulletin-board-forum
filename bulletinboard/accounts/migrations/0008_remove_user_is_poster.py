# Generated by Django 4.1.2 on 2022-10-21 11:50

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ("accounts", "0007_alter_user_managers"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="user",
            name="is_poster",
        ),
    ]