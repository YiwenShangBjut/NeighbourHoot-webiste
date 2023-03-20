CREATE TABLE barter (
    id int NOT NULL AUTO_INCREMENT,
    name varchar(255),
    category int(10),
    condition_cat int(10),
    price int(10),
    description varchar(255),
    deal_price int(10),
    status int(1),
    user_id int(10),
    PRIMARY KEY (id)
);

CREATE TABLE user (
    id int NOT NULL AUTO_INCREMENT,
    name varchar(255),
    points int(10),
    last_login_time TIMESTAMP,
    PRIMARY KEY (id)
);