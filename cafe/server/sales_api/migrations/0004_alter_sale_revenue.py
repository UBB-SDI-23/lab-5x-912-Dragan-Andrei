# Generated by Django 4.1.7 on 2023-03-15 11:49

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('sales_api', '0003_alter_sale_revenue'),
    ]

    operations = [
        migrations.AlterField(
            model_name='sale',
            name='revenue',
            field=models.FloatField(null=True),
        ),
    ]
