# Generated by Django 4.1.7 on 2023-04-10 07:14

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('locations_api', '0002_alter_location_postal_code'),
    ]

    operations = [
        migrations.AddField(
            model_name='location',
            name='description',
            field=models.TextField(default='nothing'),
            preserve_default=False,
        ),
    ]