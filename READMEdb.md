CREATE TABLE users (
id INT PRIMARY KEY AUTO_INCREMENT,
email VARCHAR(100) UNIQUE NOT NULL,
password VARCHAR(100) NOT NULL,
username VARCHAR(50),
avatar VARCHAR(50),
active BOOLEAN DEFAULT false,
deleted BOOLEAN DEFAULT false,
role ENUM("admin", "normal") DEFAULT "normal" NOT NULL,
registrationCode VARCHAR(100),
recoverCode VARCHAR(100),
createdAt DATETIME NOT NULL,
modifiedAt DATETIME
);
CREATE TABLE business (
id INT PRIMARY KEY AUTO_INCREMENT,
email VARCHAR(100) UNIQUE NOT NULL,
password VARCHAR(100) NOT NULL,
username VARCHAR(50),
avatar VARCHAR(50),
active BOOLEAN DEFAULT false,
deleted BOOLEAN DEFAULT false,
registrationCode VARCHAR(100),
recoverCode VARCHAR(100),
place VARCHAR(75) NOT NULL,
sector VARCHAR(50) NOT NULL,
jobs ENUM("Informatica","Administrativo","Legal","Comercio"),
createdAt DATETIME NOT NULL,
modifiedAt DATETIME
);
CREATE TABLE votes (
id INT PRIMARY KEY AUTO_INCREMENT,
FOREIGN KEY (id) REFERENCES business (id) ON DELETE CASCADE,
FOREIGN KEY (id) REFERENCES users (id) ON DELETE CASCADE,
createdAt DATETIME NOT NULL,
modifiedAt DATETIME,
salary INT,
enviroment INT,
conciliation INT,
oportunitys INT  
 );
CREATE TABLE comments (
id INT PRIMARY KEY AUTO_INCREMENT,
FOREIGN KEY (id) REFERENCES business (id) ON DELETE CASCADE,
FOREIGN KEY (id) REFERENCES users (id) ON DELETE CASCADE,
createdAt DATETIME NOT NULL,
modifiedAt DATETIME,
title VARCHAR (50) NOT NULL,
body VARCHAR (500) NOT NULL
);
