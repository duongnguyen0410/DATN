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
