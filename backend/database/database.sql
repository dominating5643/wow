create TABLE person(
    id SERIAL PRIMARY KEY,
    email VARCHAR(200),
    nickname VARCHAR(30),
    tlg VARCHAR(200),
    pass VARCHAR(100),
    roole VARCHAR(10),
    token VARCHAR(250), 
    code VARCHAR(7)
);

create TABLE person_bufer(
    email VARCHAR(200),
    nickname VARCHAR(30),
    tlg VARCHAR(200),
    pass VARCHAR(100),
    roole VARCHAR(10),
    code VARCHAR(10)
);

create TABLE price_formation(
    price_name VARCHAR(200),
    price_data VARCHAR(5000)
);

create TABLE orders(
    order_number VARCHAR(8),
    id BIGINT,
    email VARCHAR(200),
    nickname VARCHAR(30),
    tlg VARCHAR(200),
    title VARCHAR(250),
    order_description VARCHAR(2000),
    price REAL
);

create TABLE current_order_number(
    order_number BIGINT
);

create TABLE products(
    order_number VARCHAR(8),
    id BIGINT,
    email VARCHAR(200),
    nickname VARCHAR(30),
    tlg VARCHAR(200),
    title VARCHAR(250),
    order_description VARCHAR(2000),
    price REAL,
    create_date  VARCHAR(20)
);
create TABLE other_products(
    order_number VARCHAR(8),
    id BIGINT,
    email VARCHAR(200),
    nickname VARCHAR(30),
    tlg VARCHAR(200),
    title VARCHAR(30),
    order_description VARCHAR(2000),
    price VARCHAR(200),
    create_date  VARCHAR(20)
);