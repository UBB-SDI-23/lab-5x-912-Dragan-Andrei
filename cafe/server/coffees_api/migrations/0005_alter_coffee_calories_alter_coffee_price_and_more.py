# Generated by Django 4.1.7 on 2023-03-23 18:49

import coffees_api.models
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('coffees_api', '0004_rename_blend_coffee_blend_id'),
    ]

    operations = [
        migrations.AlterField(
            model_name='coffee',
            name='calories',
            field=models.IntegerField(validators=[coffees_api.models.validate_positive]),
        ),
        migrations.AlterField(
            model_name='coffee',
            name='price',
            field=models.FloatField(validators=[coffees_api.models.validate_positive]),
        ),
        migrations.AlterField(
            model_name='coffee',
            name='quantity',
            field=models.FloatField(validators=[coffees_api.models.validate_positive]),
        ),
    ]
