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
    Email VARCHAR(50) NOT NULL,
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
    Stock INT NOT NULL,
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

-- 9. ProductImage Table
CREATE TABLE IF NOT EXISTS ProductImage (
                                            ImageID INT AUTO_INCREMENT PRIMARY KEY,
                                            ProductID INT,
                                            ImageURL VARCHAR(255),
    Name VARCHAR(255),
    FOREIGN KEY (ProductID) REFERENCES Product(ProductID)
);

-- 10. BundleImage Table
CREATE TABLE IF NOT EXISTS BundleImage (
                                           ImageID INT AUTO_INCREMENT PRIMARY KEY,
                                           BundleID INT,
                                           ImageURL VARCHAR(255),
    Name VARCHAR(255),
    FOREIGN KEY (BundleID) REFERENCES Bundle(BundleID)
);

-- 11. DiscountCode Table

CREATE TABLE IF NOT EXISTS DiscountCode (
                              DiscountID INT AUTO_INCREMENT PRIMARY KEY,
                              code VARCHAR(255) NOT NULL UNIQUE,
                              DisRate DOUBLE NOT NULL,
                              IsActive BOOLEAN DEFAULT TRUE,
                              ExpiryDate DATE
);



-- 1. Seed Data for User (Admin Account)
INSERT INTO User (UserID, Name, Password, Phone, Email, Role, CreatedAt, IsActive)
VALUES (1, 'Admin', 'hashed_password', '9800000000', "admin@gmail.com" , 'ADMIN', NOW(), TRUE);

-- 2. Seed Data for Category
INSERT INTO Category (CategoryID, Name, Description)
VALUES
    (1, 'Puja Essentials', 'Basic items needed for pujas'),
    (2, 'Idols & Statues', 'God and Goddess idols for puja'),
    (3, 'Incense & Fragrances', 'Agarbatti, dhoop, and scents for rituals'),
    (4, 'Puja Thali Sets', 'Complete thali sets for rituals'),
    (5, 'Sacred Threads', 'Janeu, kalawa, etc.'),
    (6, 'Holy Books', 'Religious scriptures and texts'),
    (7, 'Camphor & Oils', 'Lighting and aromatics'),
    (8, 'Prayer Mats', 'Asanas and seating items for puja'),
    (9, 'Decor Items', 'Rangoli, flowers, bells, etc.'),
    (10, 'Offerings', 'Fruits, sweets, and naivedya sets');

-- 3. Seed Data for Product
INSERT INTO Product (ProductID, Name, Description, Price, Stock, CategoryID)
VALUES
    (1, 'Brass Diya', 'Traditional brass diya for aarti', 200, 50, 1),
    (2, 'Rudraksha Mala', '108-bead rudraksha mala', 500, 20, 2),
    (3, 'Sandalwood Incense', 'Premium agarbatti sticks', 100, 100, 3),
    (4, 'Copper Puja Thali', 'Engraved copper thali for rituals', 300, 25, 4),
    (5, 'Janeu Thread', 'Sacred thread for Brahmins', 50, 200, 5),
    (6, 'Bhagavad Gita', 'Sacred Hindu scripture', 450, 30, 6),
    (7, 'Pure Camphor', 'Used for aarti and purification', 120, 80, 7),
    (8, 'Woolen Prayer Mat', 'Soft asan for puja', 250, 40, 8),
    (9, 'Brass Bell', 'Used during aarti', 150, 60, 9),
    (10, 'Dry Fruit Box', 'Used for offerings', 600, 15, 10),
    (11, 'Kalash', 'Sacred pot for rituals', 350, 35, 1),
    (12, 'Laddu Pack', 'Sweet offering for God', 200, 45, 10),
    (13, 'Tulsi Mala', 'Holy basil beads necklace', 180, 20, 2),
    (14, 'Rice Grains (Akshata)', 'Used in all pujas', 20, 500, 1),
    (15, 'Panchpatra Set', 'Brass panchpatra and spoon', 275, 30, 4);

-- 4. Seed Data for Puja
INSERT INTO Puja (PujaID, Name, Description)
VALUES
    (1, 'Griha Pravesh', 'Housewarming puja for new homes'),
    (2, 'Lakshmi Puja', 'Puja for wealth and prosperity'),
    (3, 'Saraswati Puja', 'For knowledge and education'),
    (4, 'Ganesh Chaturthi', 'Celebration of Lord Ganesha'),
    (5, 'Navratri', '9-day puja of Goddess Durga'),
    (6, 'Satyanarayan Puja', 'For success and prosperity'),
    (7, 'Durga Puja', 'Major festival in eastern India'),
    (8, 'Hanuman Jayanti', 'Birthday of Lord Hanuman'),
    (9, 'Raksha Bandhan', 'Festival of sibling love'),
    (10, 'Shraddha Ceremony', 'Ancestral worship rituals');

-- 5. Seed Data for Caste
INSERT INTO Caste (CasteID, Name)
VALUES
    (1, 'Brahmin'),
    (2, 'Chhetri'),
    (3, 'Newar'),
    (4, 'Thakuri'),
    (5, 'Magar'),
    (6, 'Tamang'),
    (7, 'Rai'),
    (8, 'Gurung'),
    (9, 'Sherpa'),
    (10, 'Madhesi');

-- 6. Seed Data for Guide
INSERT INTO Guide (GuideID, Name, Description, Content, PujaID)
VALUES
    (1, 'Griha Pravesh Guide', 'Steps for Griha Pravesh', 'Detailed steps...', 1),
    (2, 'Lakshmi Puja Guide', 'Steps for Lakshmi Puja', 'Detailed steps...', 2),
    (3, 'Saraswati Puja Guide', 'Guide for students', 'Steps...', 3),
    (4, 'Ganesh Puja Guide', 'Steps for Ganesh Chaturthi', 'Steps...', 4),
    (5, 'Navratri Guide', 'Day-wise puja guide', 'Content...', 5),
    (6, 'Satyanarayan Puja Guide', 'For monthly rituals', 'Full guide...', 6),
    (7, 'Durga Puja Guide', 'Durga puja steps', 'Content...', 7),
    (8, 'Hanuman Puja Guide', 'Hanuman Jayanti special', 'Content...', 8),
    (9, 'Raksha Bandhan Guide', 'Simple guide for rakhi tying', 'Steps...', 9),
    (10, 'Shraddha Guide', 'Annual rituals for ancestors', 'Full procedure...', 10);

-- 7. Seed Data for Bundle
INSERT INTO Bundle (BundleID, Name, Description, Price, Stock, GuideID, PujaID)
VALUES
    (1, 'Lakshmi Puja Kit', 'Complete puja essentials for Lakshmi Puja', 1000, 20, 2, 2),
    (2, 'Griha Pravesh Kit', 'Complete puja essentials for Griha Pravesh', 1500, 15, 1, 1),
    (3, 'Saraswati Kit', 'Kit for education puja', 900,24, 3, 3),
    (4, 'Ganesh Chaturthi Kit', 'Everything for Ganesh puja', 1300, 12, 4, 4),
    (5, 'Navratri Kit', '9-day ritual combo pack', 1800, 29, 5, 5),
    (6, 'Satyanarayan Kit', 'Monthly puja pack', 1200, 30, 6, 6),
    (7, 'Durga Puja Kit', 'Durga Puja essentials', 2000, 11, 7, 7),
    (8, 'Hanuman Kit', 'Special Hanuman Jayanti pack', 1100, 19,8, 8),
    (9, 'Rakhi Rituals Kit', 'All items for Raksha Bandhan', 850, 31, 9, 9),
    (10, 'Shraddha Kit', 'Items for Shraddha puja', 950, 23,10, 10);

-- 8. Seed Data for FAQ
INSERT INTO FAQ (FAQID, Question, Answer)
VALUES
    (1, 'What is Pujakriti?', 'Pujakriti is an e-commerce platform for puja essentials.'),
    (2, 'Do you deliver nationwide?', 'Yes, we deliver across Nepal.'),
    (3, 'How are products packed?', 'All items are safely packed in eco-friendly materials.'),
    (4, 'Is there a return policy?', 'Returns are accepted within 7 days of delivery.'),
    (5, 'Do kits include manuals?', 'Yes, all bundles come with printed guides.'),
    (6, 'Can I customize a bundle?', 'Currently, we offer pre-packed bundles only.'),
    (7, 'Do you provide same-day delivery?', 'Same-day delivery is available in major cities.'),
    (8, 'Are products made in Nepal?', 'Most of our items are locally sourced.'),
    (9, 'Do you sell original rudrakshas?', 'Yes, our rudrakshas are verified and original.'),
    (10, 'Is COD available?', 'Yes, Cash on Delivery is available in select areas.');


INSERT INTO ProductImage (ImageID, ProductID, ImageURL, Name)
VALUES
(1, 1, 'brassdiya_1.jpg', 'Brass Diya'),
(2, 2, 'rudrakshamala_2.jpg', 'Rudraksha Mala'),
(3, 3, 'sandalwoodincense_3.jpg', 'Sandalwood Incense'),
(4, 4, 'copperpujathali_4.jpg', 'Copper Puja Thali'),
(5, 5, 'janeuthread_5.jpg', 'Janeu Thread'),
(6, 6, 'bhagavadgita_6.jpg', 'Bhagavad Gita'),
(7, 7, 'purecamphor_7.jpg', 'Pure Camphor'),
(8, 8, 'woolenprayermat_8.jpg', 'Woolen Prayer Mat'),
(9, 9, 'brassbell_9.jpg', 'Brass Bell'),
(10, 10, 'dryfruitbox_10.jpg', 'Dry Fruit Box'),
(11, 11, 'kalash_11.jpg', 'Kalash'),
(12, 12, 'laddupack_12.jpg', 'Laddu Pack'),
(13, 13, 'tulsimala_13.jpg', 'Tulsi Mala'),
(14, 14, 'ricegrainsakshata_14.jpg', 'Rice Grains (Akshata)'),
(15, 15, 'panchpatraset_15.jpg', 'Panchpatra Set');


INSERT INTO BundleImage (ImageID, BundleID, ImageURL, Name) VALUES
(1, 1, 'lakshmipujakit_1.jpg', 'Lakshmi Puja Kit'),
(2, 2, 'grihapraveshkit_2.jpg', 'Griha Pravesh Kit'),
(3, 3, 'saraswatikit_3.jpg', 'Saraswati Kit'),
(4, 4, 'ganeshchaturthikit_4.jpg', 'Ganesh Chaturthi Kit'),
(5, 5, 'navratrikit_5.jpg', 'Navratri Kit'),
(6, 6, 'satyanarayankit_6.jpg', 'Satyanarayan Kit'),
(7, 7, 'durgapujakit_7.jpg', 'Durga Puja Kit'),
(8, 8, 'hanumankit_8.jpg', 'Hanuman Kit'),
(9, 9, 'rakhiritualskit_9.jpg', 'Rakhi Rituals Kit'),
(10, 10, 'shraddhakit_10.jpg', 'Shraddha Kit');

INSERT INTO DiscountCode (code, DisRate, IsActive, ExpiryDate) VALUES
-- Dashain (September/October)
('DASHAIN2025', 0.15, TRUE, '2025-10-15'),

-- Tihar (October/November)
('TIHAR2025', 0.10, TRUE, '2025-11-10'),

-- Chhath (November)
('CHHATH2025', 0.05, TRUE, '2025-11-20'),

-- Nepali New Year Sankranti
('MAGHE2025', 0.15, TRUE, '2025-04-20'),

-- Holi (March)
('HOLI2025', 0.05, TRUE, '2025-03-25'),

-- Buddha Jayanti (May)
('BUDDHA2025', 0.05, TRUE, '2025-05-15'),

-- Teej (August)
('TEEJ2025', 0.05, TRUE, '2025-08-30');
