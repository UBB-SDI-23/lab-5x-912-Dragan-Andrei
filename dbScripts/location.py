from faker import Faker

fake = Faker()

with open('populateLocations.sql', 'w') as f:
    # delete all the existing records
    print('TRUNCATE TABLE locations_api_location RESTART IDENTITY CASCADE;',
          file=f)

    generated_name_set = set()
    # generate new records to insert
    for i in range(1000):
        if (i % 100 == 0):
            print(f'Generated {i * 1000} records')

        values = []
        for j in range(1000):
            # generate a new fake name that has a length between 1 and 50
            name = fake.name()[:10] + " Coffee Shop"

            # generate a fake address that has a length between 1 and 1000
            address = fake.address()[:30]
            address = address.replace("'", "''")

            # generate a fake city that has a length between 1 and 50
            city = fake.city()[:10]
            city = city.replace("'", "''")

            # generate a fake postal code that has a length of 5
            postal_code = fake.postcode()[:5]
            postal_code = postal_code.replace("'", "''")

            # generate a fake profit that is between 0 and 100000
            profit = fake.random_int(min=0, max=100000)

            # generate a fake description
            description = fake.paragraphs(nb=2)
            description = description.replace("'", "''")

            values.append(
                f'(\'{name}\', \'{address}\', \'{city}\', \'{postal_code}\', {profit}, \'{description}\')'
            )

        print(
            f'INSERT INTO locations_api_location (name, address, city, postal_code, profit, description) VALUES {", ".join(values)};',
            file=f)
