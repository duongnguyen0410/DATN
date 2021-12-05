-- ------------------------------- Create table for Users ---------------------------
ALTER DATABASE internship CHARACTER SET utf8 COLLATE utf8_unicode_ci;

-- ID = shortid.generate => shortid module in nodejs
CREATE TABLE users(
    Username varchar(255) not null,
    ID varchar(255) not null,
    Password varchar(255) not null,
    PRIMARY KEY (ID, Username)
);

-- ------------------------------- Create table for Role ---------------------------
CREATE TABLE role(
    ID varchar(255) not null,
    Name varchar(255) not null,
    IDCreated varchar(255) not null,
    PRIMARY KEY (ID),
    FOREIGN KEY (IDCreated) REFERENCES users(ID)
);

-- ------------------------------- Create table for Employee ---------------------------

CREATE TABLE employee(
    ID varchar(255) not null,
    Name varchar(255) not null,
    IDCreated varchar(255) not null,
    DateCreated datetime not null,
    DateUpdated datetime not null,
    Sex varchar(255) not null,
    IDRole varchar(255) not null,
    Email varchar(255) null,
    PRIMARY KEY (ID),
    FOREIGN KEY (IDCreated) REFERENCES users(ID),
    FOREIGN KEY (ID) REFERENCES users(ID),
    FOREIGN KEY (IDRole) REFERENCES role(ID)
);

-- ------------------------------- Create table for Asset ---------------------------

CREATE TABLE asset(
    AssetCode varchar(255) not null,
    AssetType varchar(255) not null,
    IDCreated varchar(255) not null,
    AssetInfo varchar(255) not null,
    AssetInfoJP varchar(255) not null,
    MacAddress varchar(255) not null,
    StartedDate date not null,
    PRIMARY KEY (AssetCode),
    FOREIGN KEY (IDCreated) REFERENCES users(ID)
);

INSERT INTO `users`(`Username`, `ID`, `Password`) VALUES ('giapdong','PPBqWA9','giapdong');

INSERT INTO `role`(`ID`, `Name`, `IDCreated`) VALUES ('ACTO','Admin','PPBqWA9');
INSERT INTO `role`(`ID`, `Name`, `IDCreated`) VALUES ('SD','Software developer','PPBqWA9');

INSERT INTO `employee`(`ID`, `Name`, `IDCreated`, `DateCreated`, `DateUpdated`, `Sex`, `IDRole`, `Email`) VALUES ('PPBqWA9','Giap Dong','PPBqWA9','2019-03-26 21:00:00','2019-03-26 21:00:00','Male','ACTO', 'giapdong991@gmail.com');

DROP TABLE IF EXISTS assetmanager;
DROP TABLE IF EXISTS asset;
DROP TABLE IF EXISTS company;
DROP TABLE IF EXISTS department;
DROP TABLE IF EXISTS purpose;

CREATE TABLE asset(
    id INT AUTO_INCREMENT NOT NULL,
    name VARCHAR(255) NOT NULL,
    count DECIMAL(19,2) NOT NULL DEFAULT 0,
    unit VARCHAR(255) NOT NULL,
    
    UNIQUE (name),
    PRIMARY KEY (id)
);

CREATE TABLE import_warehouse(
    id INT AUTO_INCREMENT NOT NULL,
    company VARCHAR(255) NOT NULL,
    phone VARCHAR(255) NOT NULL,
    data VARCHAR(255) NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    PRIMARY KEY (id)
);

CREATE TABLE export_warehouse(
    id INT AUTO_INCREMENT NOT NULL,
    data VARCHAR(255) NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    
    PRIMARY KEY (id)
);

UPDATE `role` SET `Name`='Admin'WHERE `ID`="ACTO";
INSERT INTO `role`(`ID`, `Name`, `IDCreated`) VALUES ('NV','Nhan vien','PPBqWA9');

INSERT INTO `asset`(`name`, `count`, `unit`) VALUES ('Trà xanh', 22, 'l');
INSERT INTO `asset`(`name`, `count`, `unit`) VALUES ('Trân châu', 22, 'kg');
INSERT INTO `asset`(`name`, `count`, `unit`) VALUES ('Đỗ đen', 11, 'kg');
INSERT INTO `asset`(`name`, `count`, `unit`) VALUES ('Bột cafe phin', 100, 'g');

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
