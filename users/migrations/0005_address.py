# Generated by Django 4.1.1 on 2023-03-29 13:38

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0004_userprofile_avatar'),
    ]

    operations = [
        migrations.CreateModel(
            name='Address',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('receiver', models.CharField(max_length=10, verbose_name='收件人')),
                ('address', models.CharField(max_length=100, verbose_name='收件地址')),
                ('postcode', models.CharField(max_length=3, verbose_name='郵遞區號')),
                ('receiver_mobile', models.CharField(max_length=10, verbose_name='手機號碼')),
                ('tag', models.CharField(max_length=10, verbose_name='標籤')),
                ('is_default', models.BooleanField(default=False, verbose_name='默認地址')),
                ('is_active', models.BooleanField(default=True, verbose_name='驗證用戶')),
                ('created_time', models.DateTimeField(auto_now_add=True)),
                ('updated_time', models.DateTimeField(auto_now=True)),
                ('user_profile', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='users.userprofile')),
            ],
            options={
                'db_table': 'user_address',
            },
        ),
    ]