# Generated by Django 4.1.1 on 2023-07-01 12:54

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0005_address'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='userprofile',
            name='date_of_birth',
        ),
    ]