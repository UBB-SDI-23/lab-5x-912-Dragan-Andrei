# Generated by Django 4.1.7 on 2023-04-14 08:49

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('blends_api', '0003_alter_blend_name'),
    ]

    operations = [
        migrations.AlterField(
            model_name='blend',
            name='country_of_origin',
            field=models.CharField(max_length=1000),
        ),
    ]
