from django.db import models


class GlobalConfig(models.Model):
    page_size = models.IntegerField(default=10)
