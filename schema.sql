-- Disable foreign key checks to avoid constraint issues
SET FOREIGN_KEY_CHECKS = 0;

-- Drop tables in reverse dependency order
DROP TABLE IF EXISTS `Order`;    -- Drop the most dependent table first
DROP TABLE IF EXISTS Stock;      
DROP TABLE IF EXISTS Item;
DROP TABLE IF EXISTS Client;     
DROP TABLE IF EXISTS Manager;    
DROP TABLE IF EXISTS User;       

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;

-- Create the User table
CREATE TABLE IF NOT EXISTS User (
    User_Name VARCHAR(50) PRIMARY KEY,
    Fname VARCHAR(50),
    Lname VARCHAR(50),
    Mail VARCHAR(100) NOT NULL,
    Phone_No VARCHAR(15) NOT NULL,
    Password VARCHAR(255) NOT NULL
);

-- Create the Manager table with a foreign key referencing User
CREATE TABLE IF NOT EXISTS Manager(
    Manager_ID INT AUTO_INCREMENT PRIMARY KEY,
    User_Name VARCHAR(50) NOT NULL,      
    DOJ DATE DEFAULT NULL,               
    FOREIGN KEY (User_Name) REFERENCES User(User_Name) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Client(
    Client_ID INT AUTO_INCREMENT PRIMARY KEY,
    User_Name VARCHAR(50) NOT NULL,    
    Order_Count INT DEFAULT 0,
    ORG_Name VARCHAR(100) DEFAULT NULL,         
    FOREIGN KEY (User_Name) REFERENCES User(User_Name) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Item (
    Item_ID INT PRIMARY KEY,
    Name VARCHAR(100),
    Quantity INT,
    Price DECIMAL(10, 2)
);


CREATE TABLE IF NOT EXISTS Stock (
    Stock_ID INT PRIMARY KEY,
    Item_ID INT,
    Stock_Quantity INT,
    EXP_Date DATE,
    FOREIGN KEY (Item_ID) REFERENCES Item(Item_ID) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS `Order` (
    Order_ID INT PRIMARY KEY,
    Client_ID INT,
    Stock_ID INT,
    Item_ID INT,
    Amount_Payed DECIMAL(10, 2),
    Quantity INT,
    Date DATE,
    Payment_Method VARCHAR(50),
    FOREIGN KEY (Client_ID) REFERENCES Client(Client_ID) ON DELETE CASCADE,
    FOREIGN KEY (Stock_ID) REFERENCES Stock(Stock_ID) ON DELETE CASCADE,
    FOREIGN KEY (Item_ID) REFERENCES Item(Item_ID) ON DELETE CASCADE
);

SHOW TABLES;

INSERT INTO User (User_Name, Fname, Lname, Mail, Phone_No, Password) VALUES
('alice.j', 'Alice', 'Johnson', 'alice.j@example.com', '1234567890', 'pass123'),
('bob.s', 'Bob', 'Smith', 'bob.s@example.com', '9876543210', 'pass456'),
('charlie.b', 'Charlie', 'Brown', 'charlie.b@example.com', '4567891230', 'pass789'),
('diana.p', 'Diana', 'Prince', 'diana.p@example.com', '3216549870', 'pass111'),
('eve.a', 'Eve', 'Adams', 'eve.a@example.com', '7894561230', 'pass222'),
('frank.c', 'Frank', 'Castle', 'frank.c@example.com', '2589631470', 'pass333'),
('grace.h', 'Grace', 'Hopper', 'grace.h@example.com', '3698521470', 'pass444'),
('henry.f', 'Henry', 'Ford', 'henry.f@example.com', '1472583690', 'pass555'),
('ivy.w', 'Ivy', 'Watson', 'ivy.w@example.com', '1593574860', 'pass666'),
('jack.r', 'Jack', 'Reacher', 'jack.r@example.com', '7531594560', 'pass777');


INSERT INTO Manager (User_Name, DOJ) VALUES
('alice.j', '2023-01-15'),
('bob.s', '2022-12-10'),
('charlie.b', '2023-05-20'),
('diana.p', '2021-07-30'),
('eve.a', '2024-02-14');


INSERT INTO Client (User_Name, Order_Count, ORG_Name) VALUES
('frank.c', 5, 'TechCorp Ltd'),
('grace.h', 3, 'HealthPlus Inc.'),
('henry.f', 7, 'AutoPro LLC'),
('ivy.w', 2, 'GreenGrocers'),
('jack.r', 4, 'FastDelivery Co.');


INSERT INTO Item (Item_ID, Name, Quantity, Price) VALUES
(1, 'Laptop', 50, 999.99),
(2, 'Smartphone', 100, 499.49),
(3, 'Tablet', 75, 299.99),
(4, 'Monitor', 40, 199.99),
(5, 'Keyboard', 150, 49.99),
(6, 'Mouse', 200, 29.99),
(7, 'Headphones', 120, 89.99),
(8, 'Speaker', 60, 150.00),
(9, 'External HDD', 30, 120.00),
(10, 'USB Flash Drive', 300, 20.00);

INSERT INTO Stock (Stock_ID, Item_ID, Stock_Quantity, EXP_Date) VALUES
(1, 1, 30, '2026-12-31'),
(2, 2, 50, '2026-11-30'),
(3, 3, 25, '2026-10-15'),
(4, 4, 40, '2026-09-20'),
(5, 5, 100, '2026-08-10'),
(6, 6, 150, '2026-07-05'),
(7, 7, 75, '2026-06-01'),
(8, 8, 90, '2026-05-12'),
(9, 9, 20, '2026-04-25'),
(10, 10, 200, '2026-03-30');

INSERT INTO `Order` (Order_ID, Client_ID, Stock_ID, Item_ID, Amount_Payed, Quantity, Date, Payment_Method) VALUES
(1, 1, 1, 1, 2999.97, 3, '2025-03-20', 'Credit Card'),
(2, 2, 2, 2, 998.98, 2, '2025-03-21', 'PayPal'),
(3, 3, 3, 3, 899.97, 3, '2025-03-22', 'Debit Card'),
(4, 4, 4, 4, 399.98, 2, '2025-03-23', 'Cash'),
(5, 5, 5, 5, 499.90, 10, '2025-03-24', 'UPI'),
(6, 1, 6, 6, 89.97, 3, '2025-03-25', 'Credit Card'),
(7, 2, 7, 7, 269.97, 3, '2025-03-26', 'PayPal'),
(8, 3, 8, 8, 450.00, 3, '2025-03-27', 'Debit Card'),
(9, 4, 9, 9, 240.00, 2, '2025-03-28', 'Cash'),
(10, 5, 10, 10, 400.00, 20, '2025-03-29', 'UPI');

SELECT * FROM `order`;

ALTER TABLE Item
ADD Description VARCHAR(255) NOT NULL DEFAULT 'No description available';

UPDATE Item 
SET Description = 'Powerful laptop with 16GB RAM and 512GB SSD'
WHERE Item_ID = 1;

UPDATE Item 
SET Description = 'Latest smartphone with OLED display and 5G support'
WHERE Item_ID = 2;

UPDATE Item 
SET Description = 'Lightweight tablet with 10.5-inch display and stylus support'
WHERE Item_ID = 3;

UPDATE Item 
SET Description = '24-inch Full HD monitor with adjustable stand'
WHERE Item_ID = 4;

UPDATE Item 
SET Description = 'Mechanical keyboard with RGB backlighting'
WHERE Item_ID = 5;

UPDATE Item 
SET Description = 'Ergonomic wireless mouse with high precision'
WHERE Item_ID = 6;

UPDATE Item 
SET Description = 'Noise-cancelling headphones with Bluetooth connectivity'
WHERE Item_ID = 7;

UPDATE Item 
SET Description = 'Portable Bluetooth speaker with 12-hour battery life'
WHERE Item_ID = 8;

UPDATE Item 
SET Description = '1TB external hard disk drive with USB 3.0 support'
WHERE Item_ID = 9;

UPDATE Item 
SET Description = '32GB USB flash drive with fast read/write speeds'
WHERE Item_ID = 10;

SELECT * FROM Item;

DESCRIBE User;
DESCRIBE Manager;
DESCRIBE Client;
DESCRIBE Item;
DESCRIBE Stock;
DESCRIBE `Order`;