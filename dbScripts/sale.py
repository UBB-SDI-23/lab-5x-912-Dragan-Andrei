from faker import Faker

fake = Faker()

with open('populateSales.sql', 'w') as f:
    # delete all the existing records from the table
    print('TRUNCATE TABLE sales_api_sale RESTART IDENTITY CASCADE;', file=f)

    # disable the unique constraint on coffee_id_id and location_id_id
    print(
        'ALTER TABLE sales_api_sale DROP CONSTRAINT sales_api_sale_coffee_id_id_location_id_id_key;',
        file=f)

    # disable coffee_id_id and location_id_id foreign key constraints
    print(
        'ALTER TABLE sales_api_sale DROP CONSTRAINT sales_api_sale_coffee_id_id_fk_coffees_api_coffee_id;',
        file=f)
    print(
        'ALTER TABLE sales_api_sale DROP CONSTRAINT sales_api_sale_location_id_id_fk_locations_api_location_id;',
        file=f)

    # disable the index on coffee_id_id
    print('DROP INDEX sales_api_sale_coffee_id_id;', file=f)

    # disable the index on location_id_id
    print('DROP INDEX sales_api_sale_location_id_id;', file=f)

    # generate new records to insert
    for i in range(10000):
        if (i % 1000 == 0):
            print(f'Generated {i * 10000} records')
            print(f'PRINT({i * 10000} records generated)', file=f)

        # generate a random coffee_id
        coffee_id = fake.random_int(min=i * 100 + 1, max=(i + 1) * 100)

        values = []
        for j in range(1000):
            # generate a fake sold_coffees that is between 1 and 1000
            sold_coffees = fake.random_int(min=1, max=1000)

            # generate a random revenue
            revenue = fake.pyfloat(left_digits=4,
                                   right_digits=2,
                                   min_value=1,
                                   max_value=1000)

            # generate a random location_id
            location_id = fake.random_int(min=j * 1000 + 1, max=(j + 1) * 1000)

            # add it to the batch of inserts
            values.append(
                f'({sold_coffees}, {revenue}, {coffee_id}, {location_id})')

        # execute the batch of inserts
        print(
            f'INSERT INTO sales_api_sale (sold_coffees, revenue, coffee_id_id, location_id_id) VALUES {", ".join(values)};',
            file=f)

    # enable the unique constraint on coffee_id_id and location_id_id
    print(
        'ALTER TABLE sales_api_sale ADD CONSTRAINT sales_api_sale_coffee_id_id_location_id_id_key UNIQUE (coffee_id_id, location_id_id);',
        file=f)

    # enable coffee_id_id and location_id_id foreign key constraints
    print(
        'ALTER TABLE sales_api_sale ADD CONSTRAINT sales_api_sale_coffee_id_id_fk_coffees_api_coffee_id FOREIGN KEY (coffee_id_id) REFERENCES coffees_api_coffee (id);',
        file=f)
    print(
        'ALTER TABLE sales_api_sale ADD CONSTRAINT sales_api_sale_location_id_id_fk_locations_api_location_id FOREIGN KEY (location_id_id) REFERENCES locations_api_location (id);',
        file=f)

    # enable the index on coffee_id_id
    print(
        'CREATE INDEX sales_api_sale_coffee_id_id ON sales_api_sale (coffee_id_id);',
        file=f)

    # enable the index on location_id_id
    print(
        'CREATE INDEX sales_api_sale_location_id_id ON sales_api_sale (location_id_id);',
        file=f)