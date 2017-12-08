DROP DATABASE IF EXISTS bamazon_db;
CREATE DATABASE bamazon_db;

USE bamazon_db;

CREATE TABLE products(
  item_id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(100) NOT NULL,
  department_name VARCHAR(45) NOT NULL,
  price INT default 0,
  quantity INT default 100,

  PRIMARY KEY (item_id)
);


INSERT INTO products (product_name, department_name, price)
VALUE ('Xbox ONE', 'electronics', 300),
('Love Seat', 'furniture', 150),
('coffee table','furniture', 175),
('Fender Guitar', 'instruments', 400),
('Marshal Amp', 'instruments', 200),
('Pearl Drumset','instruments', 600),
('Bar Stool', 'furniture', 65),
('Bluetooth Speaker', 'electronics', 50),
('Samsung Smart TV', 'electronics', 600),
('bookshelf', 'furniture', 275)