from faker import Faker

fake = Faker()

with open('populateBlends.sql', 'w') as f:
    # delete all the existing records
    print('TRUNCATE TABLE blends_api_blend RESTART IDENTITY CASCADE;', file=f)

    generated_name_set = set()
    # generate new records to insert
    for i in range(1000):
        if (i % 100 == 0):
            print(f'Generated {i * 1000} records')

        values = []
        for j in range(1000):
            # generate a new fake name that has a length between 1 and 50
            name = fake.name()[:10] + " Blend"
            if name in generated_name_set:
                name += f"- {i * 10000 + j} limited edition"
            else:
                generated_name_set.add(name)
            name = name.replace("'", "''")

            # generate a fake description that has a length between 1 and 1000
            description = fake.text()[:30]
            description = description.replace("'", "''")

            # generate a fake country of origin that has a length between 1 and 50
            country_of_origin = fake.country()[:10]
            country_of_origin = country_of_origin.replace("'", "''")

            # generate a fake level that is between 1 and 5
            level = fake.random_int(min=1, max=5)

            # generate a fake in stock value
            in_stock = fake.boolean()

            values.append(
                f'(\'{name}\', \'{description}\', \'{country_of_origin}\', {level}, {in_stock})'
            )

        print(
            f'INSERT INTO blends_api_blend (name, description, country_of_origin, level, in_stock) VALUES {", ".join(values)};',
            file=f)
