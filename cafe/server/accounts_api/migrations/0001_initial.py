# Generated by Django 4.1.7 on 2023-05-01 18:53

import accounts_api.models
from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Profile',
            fields=[
                ('id', models.AutoField(primary_key=True, serialize=False)),
                ('bio', models.TextField(blank=True, max_length=500, validators=[accounts_api.models.validate_no_profanity])),
                ('age', models.IntegerField(blank=True, null=True, validators=[accounts_api.models.validate_positive])),
                ('gender', models.CharField(blank=True, max_length=1, validators=[accounts_api.models.validate_gender])),
                ('nationality', models.CharField(blank=True, max_length=100)),
                ('favourite_flavour', models.CharField(blank=True, max_length=100)),
                ('confirmation_code', models.CharField(blank=True, max_length=12)),
                ('confirmation_code_valid_until', models.DateTimeField(blank=True, null=True)),
                ('user_id', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
