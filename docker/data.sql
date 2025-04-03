-- Create the Pujakriti Database
CREATE DATABASE IF NOT EXISTS Pujakriti;

-- Use the Pujakriti Database
USE Pujakriti;

-- 1. User Table
CREATE TABLE IF NOT EXISTS User (
                                    UserID INT AUTO_INCREMENT PRIMARY KEY,
                                    Name VARCHAR(255) NOT NULL,
    Password VARCHAR(255) NOT NULL,
    Phone VARCHAR(15) NOT NULL,
    Role ENUM('ADMIN', 'USER') NOT NULL,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    IsActive BOOLEAN DEFAULT TRUE
    );

-- 2. Category Table
CREATE TABLE IF NOT EXISTS Category (
                                        CategoryID INT AUTO_INCREMENT PRIMARY KEY,
                                        Name VARCHAR(255) NOT NULL,
    Description TEXT
    );

-- 3. Product Table
CREATE TABLE IF NOT EXISTS Product (
                                       ProductID INT AUTO_INCREMENT PRIMARY KEY,
                                       Name VARCHAR(255) NOT NULL,
    Description TEXT,
    Price DECIMAL(10, 2) NOT NULL,
    Stock INT NOT NULL,
    CategoryID INT,
    FOREIGN KEY (CategoryID) REFERENCES Category(CategoryID)
    );

-- 4. Puja Table
CREATE TABLE IF NOT EXISTS Puja (
                                    PujaID INT AUTO_INCREMENT PRIMARY KEY,
                                    Name VARCHAR(255) NOT NULL,
    Description TEXT
    );

-- 5. Caste Table
CREATE TABLE IF NOT EXISTS Caste (
                                     CasteID INT AUTO_INCREMENT PRIMARY KEY,
                                     Name VARCHAR(255) NOT NULL
    );

-- 6. Guide Table
CREATE TABLE IF NOT EXISTS Guide (
                                     GuideID INT AUTO_INCREMENT PRIMARY KEY,
                                     Name VARCHAR(255) NOT NULL,
    Description TEXT,
    Content TEXT,
    PujaID INT,
    FOREIGN KEY (PujaID) REFERENCES Puja(PujaID)
    );

-- 7. Bundle Table
CREATE TABLE IF NOT EXISTS Bundle (
                                      BundleID INT AUTO_INCREMENT PRIMARY KEY,
                                      Name VARCHAR(255) NOT NULL,
    Description TEXT,
    Price DECIMAL(10, 2) NOT NULL,
    GuideID INT,
    PujaID INT,
    FOREIGN KEY (GuideID) REFERENCES Guide(GuideID),
    FOREIGN KEY (PujaID) REFERENCES Puja(PujaID)
    );

-- 8. FAQ Table
CREATE TABLE IF NOT EXISTS FAQ (
                                   FAQID INT AUTO_INCREMENT PRIMARY KEY,
                                   Question TEXT NOT NULL,
                                   Answer TEXT NOT NULL
);


-- 1. Seed Data for User (Admin Account)
INSERT INTO User (UserID, Name, Password, Phone, Role, CreatedAt, IsActive)
VALUES (1, 'Admin', 'hashed_password', '9800000000', 'ADMIN', NOW(), TRUE);

-- 2. Seed Data for Category
INSERT INTO Category (CategoryID, Name, Description)
VALUES
    (1, 'Puja Essentials', 'Basic items needed for pujas'),
    (2, 'Idols & Statues', 'God and Goddess idols for puja');

-- 3. Seed Data for Product
INSERT INTO Product (ProductID, Name, Description, Price, Stock, CategoryID)
VALUES
    (1, 'Brass Diya', 'Traditional brass diya for aarti', 200, 50, 1),
    (2, 'Rudraksha Mala', '108-bead rudraksha mala', 500, 20, 2);

-- 4. Seed Data for Puja
INSERT INTO Puja (PujaID, Name, Description)
VALUES
    (1, 'Griha Pravesh', 'Housewarming puja for new homes'),
    (2, 'Lakshmi Puja', 'Puja for wealth and prosperity');

-- 5. Seed Data for Caste
INSERT INTO Caste (CasteID, Name)
VALUES
    (1, 'Brahmin'),
    (2, 'Chhetri'),
    (3, 'Newar');

-- 6. Seed Data for Guide
INSERT INTO Guide (GuideID, Name, Description, Content, PujaID)
VALUES
    (1, 'Griha Pravesh Guide', 'Steps for Griha Pravesh', 'Detailed steps...', 1),
    (2, 'Lakshmi Puja Guide', 'Steps for Lakshmi Puja', 'Detailed steps...', 2);

-- 7. Seed Data for Bundle
INSERT INTO Bundle (BundleID, Name, Description, Price, GuideID, PujaID)
VALUES
    (1, 'Lakshmi Puja Kit', 'Complete puja essentials for Lakshmi Puja', 1000, 2, 2),
    (2, 'Griha Pravesh Kit', 'Complete puja essentials for Griha Pravesh', 1500, 1, 1);

-- 8. Seed Data for FAQ
INSERT INTO FAQ (FAQID, Question, Answer)
VALUES
    (1, 'What is Pujakriti?', 'Pujakriti is an e-commerce platform for puja essentials.');
