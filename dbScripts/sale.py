from faker import Faker

fake = Faker()

with open('populateSales.sql', 'w') as f:
    # create a temporary table that stores the coffee ids
    print(
        'CREATE TABLE temp_coffee_ids (temp_id SERIAL PRIMARY KEY, coffee_id INT);',
        file=f)
    print(
        'INSERT INTO temp_coffee_ids (coffee_id) (SELECT id FROM coffees_api_coffee);',
        file=f)

    # create a temporary table that stores the location ids
    print(
        'CREATE TABLE temp_location_ids (temp_id SERIAL PRIMARY KEY, location_id INT);',
        file=f)
    print(
        'INSERT INTO temp_location_ids (location_id) (SELECT id FROM locations_api_location);',
        file=f)

    # generate new records to insert
    for i in range(1000):
        if (i % 100 == 0):
            print(f'Generated {i * 10000} records')

        # generate a fake coffee_id
        temp_coffee_id = fake.random_int(min=i * 1000 + 1, max=(i + 1) * 1000)

        values = []
        for j in range(10000):
            # generate a fake sold_coffees that is between 1 and 1000
            sold_coffees = fake.random_int(min=1, max=1000)

            # generate a random revenue
            revenue = fake.pyfloat(left_digits=4,
                                   right_digits=2,
                                   min_value=1,
                                   max_value=1000)

            # generate a fake location_id
            temp_location_id = fake.random_int(min=j * 100 + 1,
                                               max=(j + 1) * 100)

            values.append(
                f'({sold_coffees}, {revenue}, (SELECT coffee_id FROM temp_coffee_ids WHERE temp_id = {temp_coffee_id}), (SELECT location_id FROM temp_location_ids WHERE temp_id = {temp_location_id}))'
            )

        print(
            f'INSERT INTO sales_api_sale (sold_coffees, revenue, coffee_id_id, location_id_id) VALUES {", ".join(values)};',
            file=f)

    # drop the temporary table
    print('DROP TABLE temp_coffee_ids;', file=f)
    print('DROP TABLE temp_location_ids;', file=f)