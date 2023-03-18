CREATE TABLE barter (
    id int NOT NULL AUTO_INCREMENT,
    name varchar(255),
    category int(10),
    condition_cat int(10),
    price int(10),
    description varchar(255),
    PRIMARY KEY (id)
);