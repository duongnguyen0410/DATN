CREATE TABLE product(
    id INT AUTO_INCREMENT NOT NULL,
    name VARCHAR(255) NOT NULL,
    price INT NOT NULL DEFAULT 0,
    size VARCHAR(255) NOT NULL,
    delete_flag BOOLEAN NOT NULL DEFAULT FALSE,
    
    UNIQUE (name),
    PRIMARY KEY (id)
);

CREATE TABLE bill(
    id INT AUTO_INCREMENT NOT NULL,
    time_check_in DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    cashier_id VARCHAR(255) NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    
    PRIMARY KEY (id),
    FOREIGN KEY (cashier_id) REFERENCES users(ID)
);

CREATE TABLE bill_info(
    id INT AUTO_INCREMENT NOT NULL,
    bill_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,

    PRIMARY KEY (id),
    FOREIGN KEY (bill_id) REFERENCES bill(id),
    FOREIGN KEY (product_id) REFERENCES product(id)
);



INSERT INTO `product`(`name`, `price`, `size`) VALUES ('Cafe sữa (M)', 19000, 'M');
INSERT INTO `product`(`name`, `price`, `size`) VALUES ('Cafe sữa (L)', 25000, 'L');
INSERT INTO `product`(`name`, `price`, `size`) VALUES ('Cafe phin', 22000, 'M');

INSERT INTO `users`(`Username`, `ID`, `Password`) VALUES ('user','2WEKaVNO','user');
INSERT INTO `employee`(`ID`, `Name`, `IDCreated`, `DateCreated`, `DateUpdated`, `Sex`, `IDRole`, `Email`)
VALUES ('2WEKaVNO','Giap Duong','PPBqWA9','2020-12-12 21:00:00','2020-12-12 21:00:00','Male','NV', 'giapduong@gmail.com');
