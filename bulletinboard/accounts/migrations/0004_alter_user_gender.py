# Generated by Django 4.1.2 on 2022-10-10 22:11

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("accounts", "0003_alter_user_about_myself_alter_user_date_of_birth_and_more"),
    ]

    operations = [
        migrations.AlterField(
            model_name="user",
            name="gender",
            field=models.CharField(blank=True, max_length=10, verbose_name="Gender"),
        ),
    ]