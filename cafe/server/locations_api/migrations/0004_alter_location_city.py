# Generated by Django 4.1.7 on 2023-04-14 08:49

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('locations_api', '0003_location_description'),
    ]

    operations = [
        migrations.AlterField(
            model_name='location',
            name='city',
            field=models.CharField(max_length=1000),
        ),
    ]
