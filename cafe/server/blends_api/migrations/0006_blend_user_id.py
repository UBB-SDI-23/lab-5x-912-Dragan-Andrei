# Generated by Django 4.1.7 on 2023-05-03 20:05

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('blends_api', '0005_alter_blend_country_of_origin_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='blend',
            name='user_id',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
    ]
