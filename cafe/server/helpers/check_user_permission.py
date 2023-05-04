import jwt, os
from django.contrib.auth import get_user_model

secret_key = os.environ.get('secret')
User = get_user_model()


def check_user_permission(request, role):
    try:
        decoded_token = jwt.decode(
            request.headers['Authorization'].split(' ')[1],
            secret_key,
            algorithms=['HS256'])

        username = decoded_token['username']
        is_active = decoded_token['is_active']
        is_admin = decoded_token['is_superuser']
        is_moderator = decoded_token['is_staff']

        user = User.objects.get(username=username)

        if not user or not is_active:
            return False
        if role == 'regular':
            return True

        if role == 'moderator':
            return is_moderator
        if role == 'admin':
            return is_admin

    except:
        return False

    return False


def get_username(request):
    try:
        decoded_token = jwt.decode(
            request.headers['Authorization'].split(' ')[1],
            secret_key,
            algorithms=['HS256'])

        username = decoded_token['username']
        return username
    except:
        return None


def get_user_id(request):
    try:
        decoded_token = jwt.decode(
            request.headers['Authorization'].split(' ')[1],
            secret_key,
            algorithms=['HS256'])

        user_id = decoded_token['user_id']
        return user_id
    except:
        return None