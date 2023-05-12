from faker import Faker

fake = Faker()

with open('populateProfiles.sql', 'w') as f:
    # delete all the existing records
    print('TRUNCATE TABLE accounts_api_profile RESTART IDENTITY CASCADE;',
          file=f)

    generated_name_set = set()
    # generate new records to insert
    for i in range(10000):
        if (i % 100 == 0):
            print(f'Generated {i} records')

        # generate a fake bio
        bio = fake.text()
        bio = bio.replace("'", "''")

        # genereate a fake age above 18 and below 100
        age = fake.random_int(min=18, max=100)

        # generate a gender that is between 1 and 3
        gender = fake.random_int(min=1, max=3)
        if gender == 1:
            gender = 'M'
        elif gender == 2:
            gender = 'F'
        else:
            gender = 'O'

        # generate a fake nationality
        nationality = fake.country()
        nationality = nationality.replace("'", "''")

        # generate a fake favourite flavour
        favourite_flavour = "sweet " + fake.word()
        favourite_flavour = favourite_flavour.replace("'", "''")

        # generate a fake confirmation code
        confirmation_code = fake.text(max_nb_chars=12)
        confirmation_code = confirmation_code.replace("'", "''")

        # generate a fake confirmation code valid until
        confirmation_code_valid_until = fake.date_time_between(
            start_date='-1y', end_date='+1y')

        # generate a user id to associate with the profile
        user_id = i + 1

        print(
            f'INSERT INTO accounts_api_profile (bio, age, gender, nationality, favourite_flavour, confirmation_code, confirmation_code_valid_until, user_id_id) VALUES (\'{bio}\', {age}, \'{gender}\', \'{nationality}\', \'{favourite_flavour}\', \'{confirmation_code}\', \'{confirmation_code_valid_until}\', {user_id});',
            file=f)
