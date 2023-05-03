from faker import Faker
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', "cafe.settings")
django.setup()

fake = Faker()

usernames = []

from django.contrib.auth import get_user_model

User = get_user_model()

usernames = []
for i in range(10000):
    print(i)
    username = fake.user_name()
    while username in usernames:
        username = fake.user_name()

    usernames.append(username)
    password = "Apassword!"

    user = User.objects.create_user(username=username,
                                    password=password,
                                    is_active=True)
    user.save()