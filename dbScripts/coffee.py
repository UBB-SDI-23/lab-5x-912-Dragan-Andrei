from faker import Faker

fake = Faker()

with open('populateCoffees.sql', 'w') as f:
    # delete all the existing records and foreign key relations
    print('DELETE FROM sales_api_sale;', file=f)
    print('DELETE FROM coffees_api_coffee;', file=f)

    # create a temporary table that stores the blend ids
    print(
        'CREATE TABLE temp_blend_ids (temp_id SERIAL PRIMARY KEY, blend_id INT);',
        file=f)
    print(
        'INSERT INTO temp_blend_ids (blend_id) (SELECT id FROM blends_api_blend);',
        file=f)

    generated_name_set = set()

    # generate new records to insert
    for i in range(1):
        if (i % 100 == 0):
            print(f'Generated {i * 100} records')

        values = []
        for j in range(20):
            # generate a new fake name that has a length between 1 and 50
            name = fake.name()[:10] + " Coffee"
            if name in generated_name_set:
                name += f"- {i * 10000 + j} limited edition"
            else:
                generated_name_set.add(name)
            name = name.replace("'", "''")

            # generate a fake price that is between 1 and 10
            price = fake.pyfloat(left_digits=2,
                                 right_digits=2,
                                 min_value=1,
                                 max_value=10)

            # generate a fake calories that is between 1 and 1000
            calories = fake.random_int(min=1, max=1000)

            # generate a fake quantity that is between 1 and 400
            quantity = fake.pyfloat(left_digits=3,
                                    right_digits=2,
                                    min_value=1,
                                    max_value=400)

            # generate a fake vegan value
            vegan = fake.boolean()

            values.append(
                f'(\'{name}\', {price}, {calories}, {quantity}, {vegan}, (SELECT blend_id FROM temp_blend_ids ORDER BY RANDOM() LIMIT 1))'
            )

        print(
            f'INSERT INTO coffees_api_coffee (name, price, calories, quantity, vegan, blend_id_id) VALUES {", ".join(values)};',
            file=f)

    # drop the temporary table
    print('DROP TABLE temp_blend_ids;', file=f)