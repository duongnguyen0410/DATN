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