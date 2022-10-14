# Generated by Django 4.1.2 on 2022-10-14 10:54

import bulletinboard.accounts.models
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("accounts", "0004_alter_user_gender"),
    ]

    operations = [
        migrations.AddField(
            model_name="user",
            name="avatar_url",
            field=models.ImageField(
                blank=True, null=True, upload_to=bulletinboard.accounts.models.upload_to
            ),
        ),
    ]
