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
    IsActive BOOLEAN DEFAULT TRUE,
    isEmailVerified BOOLEAN DEFAULT FALSE
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


-- 12. BundleCaste Table
CREATE TABLE IF NOT EXISTS BundleCaste (
                                           BundleCasteID INT AUTO_INCREMENT PRIMARY KEY,
                                           BundleID INT NOT NULL,
                                           CasteID INT NOT NULL,
                                           FOREIGN KEY (BundleID) REFERENCES Bundle(BundleID) ON DELETE CASCADE,
    FOREIGN KEY (CasteID) REFERENCES Caste(CasteID) ON DELETE CASCADE
    );


-- 1. Seed Data for User (Admin Account)
INSERT INTO User (UserID, Name, Password, Phone, Email, Role, CreatedAt, IsActive,isEmailVerified)
VALUES
    (1, 'Admin', '$2a$10$B1moCDmGpi/98VEnPaS9uOewfrGrc9/7qJSy2io11vvgb7Y0mjXfe', '9816166132', "aditkarki@gmail.com" , 'ADMIN', NOW(), TRUE, TRUE);


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

-- Seed Data for Puja
INSERT INTO Puja (PujaID, Name, Description) VALUES
                                                 (1, 'Griha Pravesh', 'A housewarming ceremony performed to sanctify a new home, invoking divine blessings for prosperity and peace. Typically conducted before moving in, it involves rituals like Vastu Puja and Hawan.'),
                                                 (2, 'Lakshmi Puja', 'A significant puja dedicated to Goddess Lakshmi for wealth, prosperity, and good fortune. Widely celebrated during Tihar (Deepawali) in Nepal, it involves lighting diyas and offering sweets.'),
                                                 (3, 'Saraswati Puja', 'A puja to honor Goddess Saraswati, the deity of knowledge, wisdom, and arts. Commonly performed by students during Basanta Panchami, it involves placing books and instruments before the deity.'),
                                                 (4, 'Ganesh Chaturthi', 'A festival celebrating Lord Ganesha, the remover of obstacles. This puja is performed to seek success in new ventures, with offerings of modak and durva grass.'),
                                                 (5, 'Navratri', 'A nine-day festival dedicated to Goddess Durga, celebrating her victory over evil. Each day involves worshipping a different form of the goddess, culminating in Vijayadashami.'),
                                                 (6, 'Satyanarayan Puja', 'A monthly or occasional puja for Lord Vishnu in his Satyanarayan form, seeking blessings for success, health, and prosperity. It includes storytelling and offerings of prasad.'),
                                                 (7, 'Durga Puja', 'A major festival, especially in eastern Nepal, honoring Goddess Durga. It involves elaborate rituals, pandal decorations, and community celebrations during Navratri.'),
                                                 (8, 'Hanuman Jayanti', 'Celebrates the birth of Lord Hanuman, the devotee of Lord Rama. Devotees perform puja and recite Hanuman Chalisa for strength and protection.'),
                                                 (9, 'Raksha Bandhan', 'A festival celebrating the bond between siblings. Sisters tie a rakhi on brothers’ wrists, and puja is performed for mutual protection and love.'),
                                                 (10, 'Shraddha Ceremony', 'An ancestral worship ritual to honor deceased family members, typically performed annually or during Pitru Paksha, involving pind daan and offerings.'),
                                                 (11, 'Bratabandha', 'A sacred thread ceremony marking the transition of young boys into adulthood, primarily among Brahmin and Chhetri communities. It involves Vedic rituals and mantra recitation.'),
                                                 (12, 'Pasni', 'A rice-feeding ceremony for infants, usually performed at 6 months, marking their introduction to solid food. It is a joyous family event with specific rituals.'),
                                                 (13, 'Mundan', 'A hair-shaving ceremony for children, typically performed between 1–3 years, to purify and bless the child. It is common across various Nepali communities.'),
                                                 (14, 'Janku', 'A Newar-specific ceremony celebrating longevity, performed at specific age milestones (e.g., 77 years, 7 months, 7 days). It involves elaborate rituals and community participation.'),
                                                 (15, 'Naamkaran', 'A naming ceremony for newborns, usually performed on the 11th day after birth, to formally name the child with Vedic blessings.'),
                                                 (16, 'Teej', 'A women’s festival involving fasting and prayers to Lord Shiva for marital bliss and family well-being. It includes singing, dancing, and puja rituals.'),
                                                 (17, 'Chhath Puja', 'A four-day festival dedicated to the Sun God, primarily celebrated by the Madhesi community in Nepal, involving rigorous fasting and offerings at water bodies.'),
                                                 (18, 'Kartik Snan', 'A ritual bath and puja during the holy month of Kartik, performed for spiritual purification and devotion, often at sacred rivers or home.'),
                                                 (19, 'Maha Shivaratri', 'A major festival dedicated to Lord Shiva, involving night-long vigils, fasting, and offerings of bel leaves and milk at Shiva temples.'),
                                                 (20, 'Tulsi Vivah', 'A ceremonial marriage of the Tulsi plant to Lord Vishnu, marking the beginning of the marriage season, performed with devotion and offerings.'),
                                                 (21, 'Yartung Puja', 'Traditional rituals performed during the Yartung Festival in Mustang.'),
                                                 (22, 'Lhosar Rituals', 'Rituals and cultural offerings for celebrating Lhosar, the Sherpa New Year.');
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

-- Seed Data for Guide
INSERT INTO Guide (GuideID, Name, Description, Content, PujaID) VALUES
    (1, 'Griha Pravesh Guide', 'Comprehensive guide for performing Griha Pravesh puja to sanctify a new home.',
    '### Griha Pravesh Puja Guide\n\n**Introduction**\nGriha Pravesh is a sacred Hindu ceremony performed to sanctify a new home and invite divine blessings for peace, prosperity, and happiness. It is typically conducted before moving into a new house, involving rituals like Vastu Puja, Hawan, and the symbolic entry of the family. This guide provides a detailed A-Z procedure for performing Griha Pravesh, tailored for Nepali households.\n\n**Preparation**\n1. **Items Needed** (Available in Griha Pravesh Kit):\n  - Brass Diya, Pure Camphor, Copper Puja Thali, Kalash, Rice Grains (Akshata), Sandalwood Incense, Dry Fruit Box, Mango leaves, Coconut, Red cloth, Havan samagri, Ghee, Wooden sticks, Turmeric, Kumkum, Flowers, Sweets, Betel nuts.\n2. **Cleansing**: Clean the entire house thoroughly. Sprinkle Gangajal (holy water) in all rooms to purify the space.\n3. **Setup**:\n  - Choose an auspicious muhurta (consult a priest or calendar).\n  - Decorate the main entrance with mango leaves and rangoli.\n  - Set up a puja altar in the northeast corner with a red cloth, idol of Lord Ganesha, and a kalash filled with water, topped with a coconut.\n4. **Personal Preparation**: Family members should bathe and wear clean traditional clothes.\n\n**Main Ritual**\n1. **Sankalpa (Resolve)**:\n  - Sit facing east with the priest or family elder.\n  - Take water in your right hand and recite:\n   ```\n   Om Vishnu Vishnu Vishnu, Tithi [mention date], Gotra [family gotra], Nama [your name], Griha Pravesh Puja Karishye.\n   ```\n   Translation: I, [your name], of [gotra], on [date], resolve to perform Griha Pravesh Puja.\n  - Release the water onto the ground.\n2. **Ganesh Puja**:\n  - Light the diya with camphor and incense.\n  - Offer flowers, turmeric, and kumkum to Lord Ganesha’s idol.\n  - Chant:\n   ```\n   Om Gan Ganapataye Namah (108 times)\n   ```\n   Translation: Salutations to Lord Ganesha, remover of obstacles.\n  - Offer modak or laddus.\n3. **Vastu Puja**:\n  - Place the kalash on rice grains and invoke Vastu Devta.\n  - Chant:\n   ```\n   Om Vastu Devaya Namah\n   ```\n   Translation: Salutations to the deity of Vastu.\n  - Offer betel nuts and flowers.\n4. **Hawan**:\n  - Prepare a small fire pit with wooden sticks and ghee.\n  - Offer hawan samagri into the fire while chanting:\n   ```\n   Om Agnaye Swaha (9 times per offering)\n   ```\n   Translation: Offering to the fire god.\n  - Include offerings for Ganesha, Lakshmi, and Vastu Devta.\n5. **Kalash Puja**:\n  - Worship the kalash as a symbol of prosperity.\n  - Chant:\n   ```\n   Om Kalashaya Namah\n   ```\n   Translation: Salutations to the sacred pot.\n  - Sprinkle kalash water in all rooms.\n6. **Aarti**:\n  - Perform Ganesha and Lakshmi aarti using the diya on the puja thali.\n  - Sing:\n   ```\n   Jai Ganesh Jai Ganesh Jai Ganesh Deva\n   ```\n   and\n   ```\n   Om Jai Lakshmi Mata\n   ```\n7. **Entry Ritual**:\n  - The family head carries the kalash and diya, entering the house with the right foot first.\n  - Chant:\n   ```\n   Om Shanti Shanti Shanti\n   ```\n   Translation: Peace, peace, peace.\n\n**Conclusion**\n1. **Prasad Distribution**: Share sweets, dry fruits, and prasad with family and neighbors.\n2. **Cleanup**: Dispose of hawan ash in a flowing river or under a tree.\n3. **Blessings**: Seek blessings from elders and priests.\n4. **Move-In**: Begin living in the house, maintaining a positive environment.\n\n**Notes**\n- Consult a local priest for regional variations, especially for specific mantras.\n- Ensure all items are sourced from Pujakriti for authenticity (e.g., Griha Pravesh Kit).', 1),

    (2, 'Lakshmi Puja Guide', 'Step-by-step guide for Lakshmi Puja during Tihar.',
    '### Lakshmi Puja Guide\n\n**Introduction**\nLakshmi Puja, performed during Tihar (Deepawali), is a revered ritual to honor Goddess Lakshmi, the deity of wealth and prosperity. This puja is central to Nepali households, involving lighting diyas, drawing rangoli, and offering sweets. This guide provides a detailed procedure for a traditional Lakshmi Puja.\n\n**Preparation**\n1. **Items Needed** (Available in Lakshmi Puja Kit):\n  - Brass Diya, Sandalwood Incense, Copper Puja Thali, Dry Fruit Box, Laddus, Rice Grains, Kumkum, Turmeric, Flowers, Betel nuts, Coins, Red cloth, Lotus flowers, Ghee, Wicks, Rangoli colors.\n2. **Cleansing**: Clean the house, especially the puja room and entrance. Sprinkle Gangajal for purification.\n3. **Setup**:\n  - Choose an auspicious evening muhurta during Tihar.\n  - Draw rangoli at the entrance and puja area.\n  - Set up an altar with a red cloth, idols of Lakshmi and Ganesha, and a silver coin.\n  - Place diyas around the house and at the altar.\n4. **Personal Preparation**: Bathe and wear clean traditional attire (e.g., saree or kurta).\n\n**Main Ritual**\n1. **Sankalpa**:\n  - Sit facing north or east.\n  - Take rice and water in your hand and recite:\n   ```\n   Om Vishnu Vishnu Vishnu, Tithi [Tihar date], Gotra [family gotra], Nama [your name], Lakshmi Puja Karishye.\n   ```\n   Translation: I, [your name], of [gotra], on [Tihar date], resolve to perform Lakshmi Puja.\n  - Release the rice and water.\n2. **Ganesh Puja**:\n  - Light diyas and incense.\n  - Offer kumkum, turmeric, and flowers to Ganesha.\n  - Chant:\n   ```\n   Om Gan Ganapataye Namah (21 times)\n   ```\n   Translation: Salutations to Lord Ganesha.\n  - Offer laddus.\n3. **Lakshmi Invocation**:\n  - Place a lotus flower before Lakshmi’s idol.\n  - Chant:\n   ```\n   Om Shreem Mahalakshmyai Namah\n   ```\n   Translation: Salutations to the great Goddess Lakshmi.\n  - Offer coins and betel nuts.\n4. **Offering Ritual**:\n  - Offer sweets, dry fruits, and flowers to Lakshmi.\n  - Chant:\n   ```\n   Om Lakshmi Devyai Namah\n   ```\n   Translation: Salutations to Goddess Lakshmi.\n5. **Aarti**:\n  - Perform Lakshmi aarti with the diya on the puja thali.\n  - Sing:\n   ```\n   Om Jai Lakshmi Mata, Maiya Jai Lakshmi Mata\n   ```\n6. **Mantra Japa**:\n  - Chant the Lakshmi mantra 108 times using a Tulsi Mala:\n   ```\n   Om Shreem Hreem Shreem Kamale Kamalalaye Praseeda Praseeda\n   ```\n   Translation: O Lakshmi, seated on a lotus, please be gracious.\n7. **Deep Dan**:\n  - Light diyas around the house and at the entrance to welcome prosperity.\n\n**Conclusion**\n1. **Prasad Distribution**: Share laddus and dry fruits with family and neighbors.\n2. **Cleanup**: Store puja items carefully for reuse.\n3. **Blessings**: Seek blessings from elders.\n4. **Maintain Positivity**: Keep the house well-lit and clean during Tihar.\n\n**Notes**\n- Use authentic Pujakriti products for the puja.\n- Regional variations may include additional rituals; consult a priest if needed.', 2),

    (3, 'Saraswati Puja Guide', 'Guide for Saraswati Puja during Basanta Panchami.',
    '### Saraswati Puja Guide\n\n**Introduction**\nSaraswati Puja, performed during Basanta Panchami, honors Goddess Saraswati, the deity of knowledge, wisdom, and arts. Students and educators perform this puja to seek blessings for academic success. This guide provides a detailed procedure for a traditional Saraswati Puja.\n\n**Preparation**\n1. **Items Needed** (Available in Saraswati Puja Kit):\n  - Brass Diya, Sandalwood Incense, Copper Puja Thali, Rice Grains, White flowers, Kumkum, Turmeric, Books, Pen, Inkpot, White cloth, Sweets, Fruits.\n2. **Cleansing**: Clean the puja area, preferably a study room. Sprinkle Gangajal.\n3. **Setup**:\n  - Choose Basanta Panchami or an auspicious muhurta.\n  - Set up an altar with a white cloth, Saraswati’s idol, and books/instruments.\n  - Place diyas and incense sticks.\n4. **Personal Preparation**: Students should bathe and wear white or yellow clothes.\n\n**Main Ritual**\n1. **Sankalpa**:\n  - Sit facing east.\n  - Take rice and water and recite:\n   ```\n   Om Vishnu Vishnu Vishnu, Tithi [Basanta Panchami date], Gotra [family gotra], Nama [your name], Saraswati Puja Karishye.\n   ```\n   Translation: I, [your name], of [gotra], on [date], resolve to perform Saraswati Puja.\n2. **Ganesh Puja**:\n  - Light diya and incense.\n  - Offer flowers and kumkum to Ganesha.\n  - Chant:\n   ```\n   Om Gan Ganapataye Namah (11 times)\n   ```\n3. **Saraswati Invocation**:\n  - Place books and instruments before Saraswati’s idol.\n  - Chant:\n   ```\n   Om Aim Saraswatyai Namah\n   ```\n   Translation: Salutations to Goddess Saraswati.\n  - Offer white flowers and sweets.\n4. **Offering Ritual**:\n  - Offer fruits and prasad.\n  - Chant:\n   ```\n   Om Saraswati Devyai Namah\n   ```\n5. **Aarti**:\n  - Perform Saraswati aarti.\n  - Sing:\n   ```\n   Jai Saraswati Mata, Maiya Jai Saraswati Mata\n   ```\n6. **Mantra Japa**:\n  - Chant 108 times:\n   ```\n   Om Aim Hreem Kleem Maha Saraswatyai Namah\n   ```\n   Translation: Salutations to the great Saraswati.\n\n**Conclusion**\n1. **Prasad Distribution**: Share sweets and fruits.\n2. **Cleanup**: Store books and instruments respectfully.\n3. **Blessings**: Seek blessings for knowledge.\n\n**Notes**\n- Use Saraswati Puja Kit for all items.\n- Avoid touching books during the puja day.', 3),

    (4, 'Ganesh Chaturthi Guide', 'Guide for Ganesh Chaturthi celebrations.',
    '### Ganesh Chaturthi Guide\n\n**Introduction**\nGanesh Chaturthi celebrates Lord Ganesha, the remover of obstacles. This festival involves installing Ganesha’s idol, performing daily pujas, and immersing the idol after 1, 3, or 10 days. This guide covers the puja for the installation day.\n\n**Preparation**\n1. **Items Needed** (Available in Ganesh Puja Kit):\n  - Brass Diya, Sandalwood Incense, Copper Puja Thali, Modak, Durva grass, Red flowers, Kumkum, Turmeric, Rice Grains, Ganesha idol, Red cloth.\n2. **Cleansing**: Clean the puja area and sprinkle Gangajal.\n3. **Setup**:\n  - Choose an auspicious muhurta on Chaturthi.\n  - Set up an altar with a red cloth and Ganesha idol.\n4. **Personal Preparation**: Bathe and wear clean clothes.\n\n**Main Ritual**\n1. **Sankalpa**:\n  - Recite:\n   ```\n   Om Vishnu Vishnu Vishnu, Tithi [Chaturthi date], Gotra [family gotra], Nama [your name], Ganesh Puja Karishye.\n   ```\n2. **Ganesh Invocation**:\n  - Light diya and incense.\n  - Chant:\n   ```\n   Om Gan Ganapataye Namah\n   ```\n  - Offer durva grass and modak.\n3. **Aarti**:\n  - Sing:\n   ```\n   Jai Ganesh Jai Ganesh Jai Ganesh Deva\n   ```\n4. **Mantra Japa**:\n  - Chant 108 times:\n   ```\n   Om Shri Ganeshaya Namah\n   ```\n\n**Conclusion**\n1. **Prasad Distribution**: Share modak and sweets.\n2. **Daily Worship**: Continue puja until immersion.\n3. **Immersion**: Immerse the idol in water with chants.\n\n**Notes**\n- Use eco-friendly idols from Pujakriti.', 4),

    (5, 'Navratri Guide', 'Day-wise guide for Navratri puja.',
    '### Navratri Guide\n\n**Introduction**\nNavratri is a nine-day festival worshipping Goddess Durga’s nine forms. Each day involves specific rituals, offerings, and mantras. This guide provides a framework for daily puja.\n\n**Preparation**\n1. **Items Needed** (Available in Navratri Kit):\n  - Brass Diya, Sandalwood Incense, Copper Puja Thali, Red flowers, Kumkum, Turmeric, Rice Grains, Sweets, Fruits, Red cloth, Durga idol.\n2. **Cleansing**: Clean the puja area daily.\n3. **Setup**:\n  - Set up an altar with Durga’s idol or picture.\n  - Place a kalash with water and mango leaves.\n4. **Personal Preparation**: Wear vibrant clothes, preferably red or yellow.\n\n**Main Ritual (Daily)**\n1. **Sankalpa**:\n  - Recite:\n   ```\n   Om Vishnu Vishnu Vishnu, Tithi [Navratri day], Gotra [family gotra], Nama [your name], Durga Puja Karishye.\n   ```\n2. **Invocation**:\n  - Light diya and incense.\n  - Chant for the day’s goddess (e.g., Shailputri on Day 1):\n   ```\n   Om Aim Hreem Kleem Shailputryai Namah\n   ```\n3. **Offerings**:\n  - Offer specific flowers and sweets for each goddess.\n4. **Aarti**:\n  - Sing:\n   ```\n   Jai Ambe Gauri, Maiya Jai Shyama Gauri\n   ```\n5. **Mantra Japa**:\n  - Chant Durga mantra 108 times:\n   ```\n   Om Dum Durgayai Namah\n   ```\n\n**Conclusion**\n1. **Prasad Distribution**: Share daily prasad.\n2. **Vijayadashami**: Conclude with special puja and community celebrations.\n\n**Notes**\n- Follow the Navratri Kit for day-wise items.', 5),



    (6, 'Satyanarayan Puja Guide', 'Guide for monthly Satyanarayan Puja.',
    '### Satyanarayan Puja Guide\n\n**Introduction**\nSatyanarayan Puja is performed to Lord Vishnu for prosperity and success. It includes storytelling and offerings of prasad. This guide covers the full ritual.\n\n**Preparation**\n1. **Items Needed** (Available in Satyanarayan Kit):\n  - Brass Diya, Sandalwood Incense, Copper Puja Thali, Banana leaves, Sweets, Fruits, Rice Grains, Kumkum, Turmeric, Vishnu idol, Tulsi leaves.\n2. **Cleansing**: Clean the puja area.\n3. **Setup**:\n  - Set up an altar with Vishnu’s idol and banana leaves.\n4. **Personal Preparation**: Wear clean clothes.\n\n**Main Ritual**\n1. **Sankalpa**:\n  - Recite:\n   ```\n   Om Vishnu Vishnu Vishnu, Tithi [date], Gotra [family gotra], Nama [your name], Satyanarayan Puja Karishye.\n   ```\n2. **Invocation**:\n  - Chant:\n   ```\n   Om Namo Bhagavate Vasudevaya\n   ```\n3. **Storytelling**:\n  - Narrate the Satyanarayan Katha (included in the kit).\n4. **Aarti**:\n  - Sing:\n   ```\n   Om Jai Jagdish Hare\n   ```\n\n**Conclusion**\n1. **Prasad Distribution**: Share sweets and fruits.\n2. **Cleanup**: Dispose of banana leaves respectfully.\n\n**Notes**\n- Use the Satyanarayan Kit for all items.', 6),

    (7, 'Durga Puja Guide', 'Guide for Durga Puja during Navratri.',
    '### Durga Puja Guide\n\n**Introduction**\nDurga Puja is a grand celebration of Goddess Durga, especially in eastern Nepal. This guide covers the main rituals for the festival.\n\n**Preparation**\n1. **Items Needed** (Available in Durga Puja Kit):\n  - Brass Diya, Sandalwood Incense, Copper Puja Thali, Red flowers, Kumkum, Turmeric, Rice Grains, Sweets, Durga idol.\n2. **Cleansing**: Clean the pandal or puja area.\n3. **Setup**:\n  - Set up a pandal with Durga’s idol.\n4. **Personal Preparation**: Wear traditional attire.\n\n**Main Ritual**\n1. **Sankalpa**:\n  - Recite:\n   ```\n   Om Vishnu Vishnu Vishnu, Tithi [Navratri date], Gotra [family gotra], Nama [your name], Durga Puja Karishye.\n   ```\n2. **Invocation**:\n  - Chant:\n   ```\n   Om Dum Durgayai Namah\n   ```\n3. **Aarti**:\n  - Sing:\n   ```\n   Jai Ambe Gauri\n   ```\n\n**Conclusion**\n1. **Prasad Distribution**: Share prasad with the community.\n2. **Immersion**: Immerse the idol on Vijayadashami.\n\n**Notes**\n- Use eco-friendly idols.', 7),

    (8, 'Hanuman Jayanti Guide', 'Guide for Hanuman Jayanti puja.',
    '### Hanuman Jayanti Guide\n\n**Introduction**\nHanuman Jayanti celebrates Lord Hanuman’s birth. Devotees seek strength and protection through this puja.\n\n**Preparation**\n1. **Items Needed** (Available in Hanuman Kit):\n  - Brass Diya, Sandalwood Incense, Red flowers, Kumkum, Rice Grains, Sweets, Hanuman idol.\n2. **Cleansing**: Clean the puja area.\n3. **Setup**:\n  - Set up an altar with Hanuman’s idol.\n4. **Personal Preparation**: Wear red or orange clothes.\n\n**Main Ritual**\n1. **Sankalpa**:\n  - Recite:\n   ```\n   Om Vishnu Vishnu Vishnu, Tithi [Hanuman Jayanti date], Gotra [family gotra], Nama [your name], Hanuman Puja Karishye.\n   ```\n2. **Invocation**:\n  - Chant:\n   ```\n   Om Han Hanumate Namah\n   ```\n3. **Hanuman Chalisa**:\n  - Recite the Hanuman Chalisa 11 times.\n4. **Aarti**:\n  - Sing:\n   ```\n   Aarti Kije Hanuman Lala Ki\n   ```\n\n**Conclusion**\n1. **Prasad Distribution**: Share sweets.\n2. **Blessings**: Seek strength and protection.\n\n**Notes**\n- Use the Hanuman Kit for authenticity.', 8),

    (9, 'Raksha Bandhan Guide', 'Guide for Raksha Bandhan rituals.',
    '### Raksha Bandhan Guide\n\n**Introduction**\nRaksha Bandhan celebrates sibling love, with sisters tying a rakhi on brothers’ wrists. This guide covers the puja.\n\n**Preparation**\n1. **Items Needed** (Available in Rakhi Kit):\n  - Copper Puja Thali, Rakhi, Kumkum, Rice Grains, Sweets, Diya.\n2. **Cleansing**: Clean the puja area.\n3. **Setup**:\n  - Prepare a thali with rakhi, kumkum, and sweets.\n4. **Personal Preparation**: Wear traditional clothes.\n\n**Main Ritual**\n1. **Sankalpa**:\n  - Recite:\n   ```\n   Om Vishnu Vishnu Vishnu, Tithi [Raksha Bandhan date], Gotra [family gotra], Nama [your name], Raksha Bandhan Puja Karishye.\n   ```\n2. **Rakhi Tying**:\n  - Sister applies kumkum tilak and ties rakhi on brother’s wrist.\n  - Chant:\n   ```\n   Om Raksha Raksha\n   ```\n   Translation: Protect, protect.\n3. **Aarti**:\n  - Perform aarti with the diya.\n\n**Conclusion**\n1. **Gift Exchange**: Brother gives gifts to sister.\n2. **Prasad**: Share sweets.\n\n**Notes**\n- Use the Rakhi Kit for all items.', 9),

    (10, 'Shraddha Ceremony Guide', 'Guide for ancestral Shraddha rituals.',
    '### Shraddha Ceremony Guide\n\n**Introduction**\nShraddha is performed to honor deceased ancestors, typically during Pitru Paksha. This guide covers the ritual.\n\n**Preparation**\n1. **Items Needed** (Available in Shraddha Kit):\n  - Black sesame seeds, Rice Grains, Ghee, Barley, Pind ingredients, Diya, Incense.\n2. **Cleansing**: Clean the puja area.\n3. **Setup**:\n  - Set up an altar facing south.\n4. **Personal Preparation**: Wear simple clothes.\n\n**Main Ritual**\n1. **Sankalpa**:\n  - Recite:\n   ```\n   Om Vishnu Vishnu Vishnu, Tithi [Pitru Paksha date], Gotra [family gotra], Nama [your name], Shraddha Karishye.\n   ```\n2. **Pind Daan**:\n  - Prepare pinds (rice balls) and offer to ancestors.\n  - Chant:\n   ```\n   Om Pitru Devaya Namah\n   ```\n3. **Tarpan**:\n  - Offer water with sesame seeds.\n\n**Conclusion**\n1. **Offerings**: Feed Brahmins or crows.\n2. **Cleanup**: Dispose of offerings respectfully.\n\n**Notes**\n- Consult a priest for specific mantras.', 10),

    (11, 'Bratabandha Guide', 'Guide for the sacred thread ceremony.',
    '### Bratabandha Guide\n\n**Introduction**\nBratabandha is a Vedic rite of passage for young boys, marking their entry into adulthood. This guide provides a detailed procedure.\n\n**Preparation**\n1. **Items Needed** (Available in Bratabandha Kit):\n  - Janeu Thread, Diya, Incense, Rice Grains, Kumkum, Turmeric, Saffron, Sweets.\n2. **Cleansing**: Clean the venue.\n3. **Setup**:\n  - Set up a Vedic altar with a priest.\n4. **Personal Preparation**: The boy wears a dhoti.\n\n**Main Ritual**\n1. **Sankalpa**:\n  - Recite:\n   ```\n   Om Vishnu Vishnu Vishnu, Tithi [date], Gotra [family gotra], Nama [boy’s name], Bratabandha Karishye.\n   ```\n2. **Janeu Ceremony**:\n  - The boy receives the sacred thread.\n  - Chant:\n   ```\n   Om Yagyopavita Dharanaya Namah\n   ```\n   Translation: Salutations to the sacred thread.\n3. **Mantra Initiation**:\n  - The priest whispers the Gayatri Mantra:\n   ```\n   Om Bhur Bhuvah Swah, Tat Savitur Varenyam...\n   ```\n\n**Conclusion**\n1. **Blessings**: Seek blessings from elders.\n2. **Feast**: Share prasad and food.\n\n**Notes**\n- Requires a priest’s guidance.', 11),

    (12, 'Pasni Guide', 'Guide for the rice-feeding ceremony.',
    '### Pasni Guide\n\n**Introduction**\nPasni is a joyful ceremony introducing infants to solid food at 6 months. This guide covers the ritual.\n\n**Preparation**\n1. **Items Needed** (Available in Pasni Kit):\n  - Rice, Ghee, Sweets, Diya, Incense, Kumkum, Gold spoon.\n2. **Cleansing**: Clean the venue.\n3. **Setup**:\n  - Prepare a small altar.\n4. **Personal Preparation**: Dress the baby in new clothes.\n\n**Main Ritual**\n1. **Sankalpa**:\n  - Recite:\n   ```\n   Om Vishnu Vishnu Vishnu, Tithi [date], Gotra [family gotra], Nama [baby’s name], Pasni Karishye.\n   ```\n2. **Feeding**:\n  - The mother or elder feeds rice to the baby.\n  - Chant:\n   ```\n   Om Annapurnayai Namah\n   ```\n   Translation: Salutations to Goddess Annapurna.\n3. **Blessings**:\n  - Elders bless the baby.\n\n**Conclusion**\n1. **Feast**: Share food with guests.\n2. **Gifts**: Present gifts to the baby.\n\n**Notes**\n- Use the Pasni Kit for all items.', 12),

    (13, 'Mundan Guide', 'Guide for the hair-shaving ceremony.',
    '### Mundan Guide\n\n**Introduction**\nMundan is a purification ritual involving the shaving of a child’s first hair. This guide covers the procedure.\n\n**Preparation**\n1. **Items Needed** (Available in Mundan Kit):\n  - Diya, Incense, Rice Grains, Kumkum, Sweets, Razor, Cloth.\n2. **Cleansing**: Clean the venue.\n3. **Setup**:\n  - Prepare an altar.\n4. **Personal Preparation**: Dress the child simply.\n\n**Main Ritual**\n1. **Sankalpa**:\n  - Recite:\n   ```\n   Om Vishnu Vishnu Vishnu, Tithi [date], Gotra [family gotra], Nama [child’s name], Mundan Karishye.\n   ```\n2. **Shaving**:\n  - A barber shaves the child’s hair.\n  - Chant:\n   ```\n   Om Shuddhi Karaya Namah\n   ```\n   Translation: Salutations to purification.\n3. **Offering**:\n  - Offer the hair to a river or tree.\n\n**Conclusion**\n1. **Blessings**: Seek blessings for the child.\n2. **Feast**: Share prasad.\n\n**Notes**\n- Use the Mundan Kit.', 13),

    (14, 'Janku Guide', 'Guide for the Newar Janku ceremony.',
    '### Janku Guide\n\n**Introduction**\nJanku is a Newar longevity ceremony performed at specific age milestones. This guide covers the ritual.\n\n**Preparation**\n1. **Items Needed** (Available in Janku Kit):\n  - Diya, Incense, Rice Grains, Kumkum, Sweets, Traditional Newar items.\n2. **Cleansing**: Clean the venue.\n3. **Setup**:\n  - Prepare an altar with Newar deities.\n4. **Personal Preparation**: Wear traditional Newar attire.\n\n**Main Ritual**\n1. **Sankalpa**:\n  - Recite:\n   ```\n   Om Vishnu Vishnu Vishnu, Tithi [date], Gotra [family gotra], Nama [person’s name], Janku Karishye.\n   ```\n2. **Puja**:\n  - Perform puja for longevity.\n  - Chant:\n   ```\n   Om Ayushya Devaya Namah\n   ```\n   Translation: Salutations to the deity of longevity.\n3. **Community Ritual**:\n  - Include Newar-specific rituals (consult a priest).\n\n**Conclusion**\n1. **Feast**: Share food with the community.\n2. **Blessings**: Seek blessings for long life.\n\n**Notes**\n- Requires Newar priest guidance.', 14),


    (15, 'Naamkaran Guide', 'Guide for the naming ceremony.',
    '### Naamkaran Guide\n\n**Introduction**\nNaamkaran is a ceremony to name a newborn, typically on the 11th day. This guide covers the ritual.\n\n**Preparation**\n1. **Items Needed** (Available in Naamkaran Kit):\n   - Diya, Incense, Rice Grains, Kumkum, Sweets, Cradle.\n2. **Cleansing**: Clean the venue.\n3. **Setup**:\n   - Prepare an altar.\n4. **Personal Preparation**: Dress the baby in new clothes.\n\n**Main Ritual**\n1. **Sankalpa**:\n   - Recite:\n     ```\n     Om Vishnu Vishnu Vishnu, Tithi [date], Gotra [family gotra], Nama [baby’s name], Naamkaran Karishye.\n     ```\n2. **Naming**:\n   - The priest or elder whispers the name to the baby.\n   - Chant:\n     ```\n     Om Namah Shivaya\n     ```\n3. **Blessings**:\n   - Elders bless the baby.\n\n**Conclusion**\n1. **Feast**: Share sweets.\n2. **Gifts**: Present gifts to the baby.\n\n**Notes**\n- Use the Naamkaran Kit.', 15),

    (16, 'Teej Guide', 'Guide for Teej fasting and puja.',
    '### Teej Guide\n\n**Introduction**\nTeej is a women’s festival involving fasting and prayers to Lord Shiva for marital bliss. This guide covers the puja.\n\n**Preparation**\n1. **Items Needed** (Available in Teej Kit):\n   - Diya, Incense, Red flowers, Kumkum, Sweets, Shiva idol.\n2. **Cleansing**: Clean the puja area.\n3. **Setup**:\n   - Set up an altar with Shiva’s idol.\n4. **Personal Preparation**: Wear red sarees.\n\n**Main Ritual**\n1. **Sankalpa**:\n   - Recite:\n     ```\n     Om Vishnu Vishnu Vishnu, Tithi [Teej date], Gotra [family gotra], Nama [your name], Teej Puja Karishye.\n     ```\n2. **Puja**:\n   - Offer bel leaves to Shiva.\n   - Chant:\n     ```\n     Om Namah Shivaya\n     ```\n3. **Fasting**:\n   - Fast until evening.\n\n**Conclusion**\n1. **Breaking Fast**: Share sweets.\n2. **Celebration**: Sing and dance.\n\n**Notes**\n- Use the Teej Kit.', 16),

    (17, 'Chhath Puja Guide', 'Guide for Chhath Puja rituals.',
    '### Chhath Puja Guide\n\n**Introduction**\nChhath Puja is a four-day festival for the Sun God, celebrated by the Madhesi community. This guide covers the rituals.\n\n**Preparation**\n1. **Items Needed** (Available in Chhath Puja Kit):\n   - Bamboo baskets, Fruits, Sweets, Diya, Rice Grains.\n2. **Cleansing**: Clean the puja area near a water body.\n3. **Setup**:\n   - Prepare offerings in baskets.\n4. **Personal Preparation**: Wear clean clothes.\n\n**Main Ritual**\n1. **Sankalpa**:\n   - Recite:\n     ```\n     Om Vishnu Vishnu Vishnu, Tithi [Chhath date], Gotra [family gotra], Nama [your name], Chhath Puja Karishye.\n     ```\n2. **Offerings**:\n   - Offer fruits and sweets to the Sun God.\n   - Chant:\n     ```\n     Om Suryaya Namah\n     ```\n3. **Arghya**:\n   - Offer water to the setting and rising sun.\n\n**Conclusion**\n1. **Breaking Fast**: Share prasad.\n2. **Cleanup**: Dispose of offerings in the river.\n\n**Notes**\n- Use the Chhath Puja Kit.', 17),

    (18, 'Kartik Snan Guide', 'Guide for Kartik Snan rituals.',
    '### Kartik Snan Guide\n\n**Introduction**\nKartik Snan involves a holy bath and puja during the month of Kartik for purification. This guide covers the ritual.\n\n**Preparation**\n1. **Items Needed** (Available in Kartik Snan Kit):\n   - Diya, Incense, Rice Grains, Kumkum, Sweets.\n2. **Cleansing**: Clean the bathing area.\n3. **Setup**:\n   - Prepare an altar near the bath.\n4. **Personal Preparation**: Wear clean clothes.\n\n**Main Ritual**\n1. **Sankalpa**:\n   - Recite:\n     ```\n     Om Vishnu Vishnu Vishnu, Tithi [Kartik date], Gotra [family gotra], Nama [your name], Kartik Snan Karishye.\n     ```\n2. **Bath**:\n   - Take a holy bath chanting:\n     ```\n     Om Gange Namah\n     ```\n3. **Puja**:\n   - Offer flowers and rice.\n\n**Conclusion**\n1. **Prasad**: Share sweets.\n2. **Blessings**: Seek purification.\n\n**Notes**\n- Use the Kartik Snan Kit.', 18),

    (19, 'Maha Shivaratri Guide', 'Guide for Maha Shivaratri puja.',
    '### Maha Shivaratri Guide\n\n**Introduction**\nMaha Shivaratri is dedicated to Lord Shiva, involving fasting and night-long vigils. This guide covers the puja.\n\n**Preparation**\n1. **Items Needed** (Available in Maha Shivaratri Kit):\n   - Diya, Incense, Bel leaves, Milk, Sweets, Shiva lingam.\n2. **Cleansing**: Clean the puja area.\n3. **Setup**:\n   - Set up an altar with a Shiva lingam.\n4. **Personal Preparation**: Wear simple clothes.\n\n**Main Ritual**\n1. **Sankalpa**:\n   - Recite:\n     ```\n     Om Vishnu Vishnu Vishnu, Tithi [Shivaratri date], Gotra [family gotra], Nama [your name], Shivaratri Puja Karishye.\n     ```\n2. **Abhishek**:\n   - Pour milk and water on the lingam.\n   - Chant:\n     ```\n     Om Namah Shivaya\n     ```\n3. **Aarti**:\n   - Sing:\n     ```\n     Om Jai Shiv Omkara\n     ```\n\n**Conclusion**\n1. **Prasad**: Share sweets.\n2. **Vigil**: Stay awake chanting mantras.\n\n**Notes**\n- Use the Maha Shivaratri Kit.', 19),

    (20, 'Tulsi Vivah Guide', 'Guide for Tulsi Vivah rituals.',
    '### Tulsi Vivah Guide\n\n**Introduction**\nTulsi Vivah is the ceremonial marriage of the Tulsi plant to Lord Vishnu. This guide covers the ritual.\n\n**Preparation**\n1. **Items Needed** (Available in Tulsi Vivah Kit):\n   - Diya, Incense, Tulsi plant, Sweets, Red cloth, Vishnu idol.\n2. **Cleansing**: Clean the Tulsi area.\n3. **Setup**:\n   - Decorate the Tulsi plant like a bride.\n4. **Personal Preparation**: Wear festive clothes.\n\n**Main Ritual**\n1. **Sankalpa**:\n   - Recite:\n     ```\n     Om Vishnu Vishnu Vishnu, Tithi [Tulsi Vivah date], Gotra [family gotra], Nama [your name], Tulsi Vivah Karishye.\n     ```\n2. **Marriage Ritual**:\n   - Tie a thread between Tulsi and Vishnu’s idol.\n   - Chant:\n     ```\n     Om Vishnave Namah\n     ```\n3. **Aarti**:\n   - Sing:\n     ```\n     Om Jai Jagdish Hare\n     ```\n\n**Conclusion**\n1. **Prasad**: Share sweets.\n2. **Celebration**: Treat it as a wedding feast.\n\n**Notes**\n- Use the Tulsi Vivah Kit.', 20),

    (21, 'Yartung Festival Guide', 'A comprehensive guide for performing puja rituals during the Yartung Festival, tailored for Gurung and Thakali communities.',
    '### Yartung Festival Guide\n\n**Introduction**\nThe Yartung Festival, celebrated by the Gurung and Thakali communities in Mustang and surrounding areas, is a vibrant blend of cultural and spiritual traditions. Held annually in August or September, Yartung features horse racing, archery, dances, and puja rituals to honor local deities, such as mountain gods and ancestral spirits, for prosperity and community harmony. This guide provides a detailed A-Z procedure for the puja component, tailored for Nepali households using the Yartung Festival Kit from Pujakriti.\n\n**Preparation**\n1. **Items Needed** (Available in Yartung Festival Kit):\n   - Brass Diya, Sandalwood Incense, Copper Puja Thali, Rice Grains (Akshata), Barley grains, Butter lamps, Khada (ceremonial scarf), Juniper branches, Local herbs, Tsampa (roasted barley flour), Yak butter, Red and white cloth, Flowers, Sweets, Dry Fruit Box, Local liquor (for offerings, if permitted).\n2. **Cleansing**:\n   - Clean the puja area, typically an outdoor space or community shrine near the festival ground.\n   - Sprinkle water mixed with turmeric for purification.\n3. **Setup**:\n   - Choose an auspicious day during the Yartung festival (consult a local lama or priest).\n   - Set up a small altar with a red and white cloth, images or idols of local deities (e.g., mountain gods), and butter lamps.\n   - Place a small cairn or stone pile to represent the deity, adorned with khada and juniper branches.\n   - Prepare a fire pit for burning juniper as an offering.\n4. **Personal Preparation**:\n   - Participants should bathe and wear traditional Gurung or Thakali attire (e.g., chuba or gunyu-cholo).\n   - Community elders or a lama may lead the puja, but families can perform it at home.\n\n**Main Ritual**\n1. **Sankalpa (Resolve)**:\n   - Sit facing the altar, preferably in the direction of the local sacred mountain.\n   - Take rice grains and water in your right hand and recite:\n     ```\n     Om Vishnu Vishnu Vishnu, Tithi [festival date], Gotra [family gotra], Nama [your name], Yartung Puja Karishye.\n     ```\n     Translation: I, [your name], of [gotra], on [date], resolve to perform Yartung Puja.\n   - Release the water and rice onto the ground.\n2. **Ganesh Puja (Optional)**:\n   - As Yartung blends Hindu and indigenous practices, some families begin with a Ganesha invocation.\n   - Light the diya and incense, offer flowers and kumkum to a Ganesha idol (if used).\n   - Chant:\n     ```\n     Om Gan Ganapataye Namah (21 times)\n     ```\n     Translation: Salutations to Lord Ganesha, remover of obstacles.\n3. **Invocation of Local Deities**:\n   - Light butter lamps and burn juniper branches in the fire pit to create sacred smoke.\n   - Offer tsampa, barley, and yak butter to the fire while chanting:\n     ```\n     Om Yartung Devaya Namah\n     ```\n     Translation: Salutations to the deities of Yartung.\n     Note: This is a placeholder; consult a local lama for specific deity names (e.g., Muktinath or mountain gods).\n   - Drape khada over the stone pile or deity image.\n4. **Offerings**:\n   - Place sweets, dry fruits, and local liquor (if culturally appropriate) on the puja thali.\n   - Sprinkle rice grains and herbs as offerings to the deities.\n   - Chant:\n     ```\n     Om Sarva Devata Namah\n     ```\n     Translation: Salutations to all deities.\n5. **Community Ritual**:\n   - Involve the community by circling the altar, singing traditional Gurung/Thakali songs (e.g., Rodhi or folk hymns).\n   - Offer prayers for prosperity, good harvests, and protection from natural calamities.\n   - If a lama is present, they may perform a smoke offering (sang) or chant protective mantras.\n6. **Aarti**:\n   - Perform a simple aarti using the diya on the puja thali, circling it before the altar.\n   - Sing a local hymn or chant:\n     ```\n     Om Shanti Shanti Shanti\n     ```\n     Translation: Peace, peace, peace.\n7. **Mantra Japa (Optional)**:\n   - For Hindu-influenced families, chant a mantra 108 times using a Rudraksha Mala:\n     ```\n     Om Namah Shivaya\n     ```\n     Translation: Salutations to Lord Shiva, revered in Mustang.\n\n**Conclusion**\n1. **Prasad Distribution**:\n   - Share sweets, dry fruits, and tsampa-based prasad with the community.\n   - Offer small portions to the fire or sacred site as a final offering.\n2. **Cleanup**:\n   - Dispose of juniper ash and biodegradable offerings in a river or sacred site.\n   - Store reusable items (e.g., puja thali, diya) for future rituals.\n3. **Blessings**:\n   - Seek blessings from elders and lamas for community well-being.\n4. **Festival Participation**:\n   - Join the horse racing, archery, and dances to complete the Yartung celebrations.\n\n**Notes**\n- The Yartung Festival blends Hindu, Buddhist, and indigenous practices. Consult a local lama or elder for specific mantras or deity names (e.g., for Muktinath or local spirits).\n- Use the Yartung Festival Kit for authentic, locally sourced items.\n- Respect community traditions, especially regarding offerings like liquor, which may vary by village.', 21),


    (22, 'Lhosar Ritual Guide', 'A detailed guide for performing rituals during Lhosar, the Himalayan New Year festival.',
    '### Lhosar Ritual Guide\n\n**Introduction**\nLhosar, meaning "New Year" in Tibetan, is celebrated by Sherpa, Tamang, Gurung, and other Himalayan communities in Nepal. Rooted in Tibetan Buddhist traditions, Lhosar (e.g., Gyalpo Lhosar for Sherpas, Tamu Lhosar for Gurungs) marks the renewal of the lunar calendar with rituals to purify the past year and welcome prosperity. This guide provides a comprehensive A-Z procedure for the puja rituals, tailored for home and monastery settings using the Lhosar Ritual Kit from Pujakriti.\n\n**Preparation**\n1. **Items Needed** (Available in Lhosar Ritual Kit):\n   - Brass Diya, Sandalwood Incense, Butter lamps, Khada (ceremonial scarf), Tsampa (roasted barley flour), Yak butter, Rice Grains, Juniper branches, Prayer flags, Images of Guru Rinpoche or Green Tara, Sweets, Dry Fruit Box, White and red cloth, Saffron water, Bell and dorje.\n2. **Cleansing**:\n   - Clean the house thoroughly, especially the puja room or family shrine.\n   - Burn juniper branches to purify the space with sacred smoke.\n3. **Setup**:\n   - Choose the first day of Lhosar (consult a Tibetan calendar for exact date, typically February/March).\n   - Set up an altar with a white and red cloth, images of Guru Rinpoche or Green Tara, butter lamps, and prayer flags.\n   - Place a small stupa or Buddha statue, if available, and drape with khada.\n   - Prepare a tray with tsampa, yak butter, and saffron water for offerings.\n4. **Personal Preparation**:\n   - Family members should bathe and wear traditional attire (e.g., chuba for Sherpas, traditional dresses for Tamangs).\n   - Invite a lama for monastery rituals or perform a simplified version at home.\n\n**Main Ritual**\n1. **Sankalpa (Resolve)**:\n   - Sit facing the altar, preferably in the direction of a sacred mountain or monastery.\n   - Take tsampa and water in your right hand and recite:\n     ```\n     Om Mani Padme Hum, Tithi [Lhosar date], Gotra [family lineage], Nama [your name], Lhosar Puja Karishye.\n     ```\n     Translation: With the mantra Om Mani Padme Hum, I, [your name], of [lineage], on [Lhosar date], resolve to perform Lhosar Puja.\n   - Release the tsampa and water onto the altar.\n2. **Lighting Butter Lamps**:\n   - Light butter lamps and incense to symbolize wisdom and purification.\n   - Chant:\n     ```\n     Om Ah Hum\n     ```\n     Translation: Purify body, speech, and mind.\n   - Offer light to Guru Rinpoche or Green Tara.\n3. **Invocation of Deities**:\n   - Invoke Guru Rinpoche (Padmasambhava), the protector of Himalayan Buddhists.\n   - Chant:\n     ```\n     Om Ah Hum Vajra Guru Padma Siddhi Hum (21 times)\n     ```\n     Translation: O Guru Rinpoche, grant us spiritual accomplishments.\n   - Alternatively, for Green Tara (common in Sherpa rituals):\n     ```\n     Om Tare Tuttare Ture Soha\n     ```\n     Translation: Salutations to Tara, who liberates from suffering.\n   - Drape khada over the deity image and sprinkle saffron water.\n4. **Offerings**:\n   - Offer tsampa, yak butter, sweets, and dry fruits on the puja thali.\n   - Create a torma (ritual cake) from tsampa, if possible, and place it on the altar.\n   - Chant:\n     ```\n     Om Sarva Tathagata Puja Ho\n     ```\n     Translation: Offering to all enlightened beings.\n5. **Purification Ritual**:\n   - Burn juniper branches and walk through the smoke to cleanse negative energies.\n   - Chant:\n     ```\n     Om Mani Padme Hum (108 times)\n     ```\n     Translation: The jewel is in the lotus (mantra of compassion).\n   - Hang new prayer flags around the house or community stupa to spread blessings.\n6. **Monastery Offering (Optional)**:\n   - If visiting a monastery, offer butter lamps, khada, and donations to lamas.\n   - Participate in the Gutor ritual (pre-Lhosar purification) if performed.\n7. **Aarti and Bell Ringing**:\n   - Ring the bell and dorje while circling the diya before the altar.\n   - Chant:\n     ```\n     Om Shanti Shanti Shanti\n     ```\n     Translation: Peace, peace, peace.\n\n**Conclusion**\n1. **Prasad Distribution**:\n   - Share tsampa-based prasad, sweets, and dry fruits with family and neighbors.\n   - Offer small portions to the altar as a final offering.\n2. **Cleanup**:\n   - Dispose of juniper ash and biodegradable offerings in a river or sacred site.\n   - Store reusable items (e.g., bell, dorje, diya) carefully.\n3. **Blessings**:\n   - Seek blessings from lamas and elders for a prosperous New Year.\n4. **Celebration**:\n   - Join family gatherings, cultural dances (e.g., Sherpa dances, Tamang selo), and feasts with traditional foods like khapse and chang.\n\n**Notes**\n- Lhosar varies by community (e.g., Gyalpo Lhosar for Sherpas, Tamu Lhosar for Gurungs). Consult a lama for specific rituals or dates.\n- Use the Lhosar Ritual Kit for authentic Buddhist ritual items.\n- Respect Buddhist traditions, such as avoiding non-vegetarian food during rituals.', 22);



-- 7. Seed Data for Bundle
INSERT INTO Bundle (BundleID, Name, Description, Price, Stock, GuideID, PujaID)
VALUES
   (1, 'Lakshmi Puja Kit', 'Includes all essential items for worshipping Goddess Lakshmi during Tihar, focusing on prosperity, wealth, and household harmony.', 1000, 20, 2, 2),
    (2, 'Griha Pravesh Kit', 'Complete set of puja samagri used during housewarming ceremonies to purify the home and invoke blessings for prosperity and peace.', 1500, 15, 1, 1),
    (3, 'Saraswati Puja Kit', 'Includes books, pens, incense, and offerings for Basanta Panchami, seeking wisdom and blessings from Goddess Saraswati.', 900, 24, 3, 3),
    (4, 'Ganesh Puja Kit', 'Essential items for invoking Lord Ganesh to remove obstacles, ideal for Ganesh Chaturthi or daily worship.', 1300, 12, 4, 4),
    (5, 'Navratri Kit', 'Nine-day Durga Puja kit with items for each day of Navratri, including kalash setup, sindoor, and durga idols.', 1800, 29, 5, 5),
    (6, 'Satyanarayan Kit', 'Monthly puja essentials for worshipping Lord Vishnu through the Satyanarayan Katha, ideal for family well-being.', 1200, 30, 6, 6),
    (7, 'Durga Puja Kit', 'Complete set of ritual items for the worship of Goddess Durga during Dashain and Durga Puja festivals.', 2000, 11, 7, 7),
    (8, 'Hanuman Kit', 'Items for devotion and strength during Hanuman Jayanti or personal Hanuman worship, including sindoor, oil, and betel leaves.', 1100, 19, 8, 8),
    (9, 'Rakhi Kit', 'Includes rakhi, sweets, diya, and roli-chawal for celebrating Raksha Bandhan and sibling bonding rituals.', 850, 31, 9, 9),
    (10, 'Shraddha Kit', 'Puja kit for honoring ancestors during Shraddha rituals, with pind daan items, darbha grass, and sesame offerings.', 950, 23, 10, 10),
    (11, 'Bratabandha Kit', 'Sacred thread ceremony essentials for Bratabandha, including yajnopavit, havan samagri, and ritual clothes.', 2500, 10, 11, 11),
    (12, 'Pasni Kit', 'Ceremonial rice feeding kit for babies, including silver bowls, sweets, and traditional gifts.', 1300, 17, 12, 12),
    (13, 'Mundan Kit', 'Items for the first head-shaving ceremony of a child, including shaving accessories and havan materials.', 950, 20, 13, 13),
    (14, 'Janku Kit', 'Specialized ritual kit for celebrating longevity during the Janku ceremony among Newars, includes sacred threads and fruit offerings.', 2200, 7, 14, 14),
    (15, 'Naamkaran Kit', 'Baby naming ceremony puja items, with havan samagri, flower garlands, and sacred water for blessings.', 800, 18, 15, 15),
    (16, 'Teej Kit', 'Fasting and prayer essentials for women celebrating Teej, includes red bangles, sweets, and ritual items.', 850, 30, 16, 16),
    (17, 'Chhath Puja Kit', 'Items for worshipping the Sun God during Chhath, including bamboo baskets, thekua, and fruits.', 1700, 22, 17, 17),
    (18, 'Kartik Snan Kit', 'Puja samagri for the holy bath ritual during Kartik month, including diya, ghee, and tulsi leaves.', 750, 25, 18, 18),
    (19, 'Maha Shivaratri Kit', 'Kit for night-long worship of Lord Shiva, including bael leaves, milk, incense, and shivalinga offerings.', 1350, 16, 19, 19),
    (20, 'Tulsi Vivah Kit', 'Sacred items for performing Tulsi Vivah, symbolizing the ceremonial marriage of Tulsi to Lord Vishnu.', 950, 14, 20, 20),
    (21, 'Yartung Festival Kit', 'A culturally rich kit for Yartung festival celebrated in Mustang, including offerings, traditional attire elements, and puja items for community blessing rituals.', 1600, 10, 21, 21),
    (22, 'Lhosar Ritual Kit', 'Comprehensive kit for Lhosar, the Tibetan New Year, includes incense, torma (ritual cakes), barley flour, and prayer flags for Sherpa and Himalayan communities.', 1800, 14, 22, 22);


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
                                                                (3, 3, 'saraswatipujakit_3.jpg', 'Saraswati Puja Kit'),
                                                                (4, 4, 'ganeshpujakit_4.jpg', 'Ganesh Puja Kit'),
                                                                (5, 5, 'navratrikit_5.jpg', 'Navratri Kit'),
                                                                (6, 6, 'satyanarayanpujakit_6.jpg', 'Satyanarayan Kit'),
                                                                (7, 7, 'durgapujakit_7.jpg', 'Durga Puja Kit'),
                                                                (8, 8, 'hanumankit_8.jpg', 'Hanuman Kit'),
                                                                (9, 9, 'rakhikit_9.jpg', 'Rakhi Kit'),
                                                                (10, 10, 'shraddhakit_10.jpg', 'Shraddha Kit'),
                                                                (11, 11, 'bratabandhakit_11.jpg', 'Bratabandha Kit'),
                                                                (12, 12, 'pasnikit_12.jpg', 'Pasni Kit'),
                                                                (13, 13, 'mundankit_13.jpg', 'Mundan Kit'),
                                                                (14, 14, 'jankukit_14.jpg', 'Janku Kit'),
                                                                (15, 15, 'naamkarankit_15.jpg', 'Naamkaran Kit'),
                                                                (16, 16, 'teejkit_16.jpg', 'Teej Kit'),
                                                                (17, 17, 'chhathkit_17.jpg', 'Chhath Puja Kit'),
                                                                (18, 18, 'kartiksnankit_18.jpg', 'Kartik Snan Kit'),
                                                                (19, 19, 'shivaratritkit_19.jpg', 'Maha Shivaratri Kit'),
                                                                (20, 20, 'tulsivivahkit_20.jpg', 'Tulsi Vivah Kit'),
                                                                (21, 21, 'yartungfestivalkit_21.jpg', 'Yartung Festival Kit'),
                                                                (22, 22, 'lhosarRitualkit_22.jpg', 'Lhosar Ritual Kit');


INSERT INTO DiscountCode (code, DisRate, IsActive, ExpiryDate) VALUES
-- Dashain (September/October)
('DASHAIN2025', 0.15, TRUE, '2025-10-15'),

-- Tihar (October/November)
('TIHAR2025', 0.10, TRUE, '2025-11-10'),

-- Chhath (November)
('CHHATH2025', 0.05, TRUE, '2025-11-20'),

-- Nepali New Year Sankranti
('NEWYEAR2025', 0.15, TRUE, '2025-04-19'),

-- Holi (March)
('HOLI2025', 0.05, TRUE, '2025-03-25'),

-- Buddha Jayanti (May)
('BUDDHA2025', 0.05, TRUE, '2025-05-15'),

-- Teej (August)
('TEEJ2025', 0.05, TRUE, '2025-08-30');


-- BundleCaste Seed Data
INSERT INTO BundleCaste (BundleID, CasteID) VALUES
-- 1. Lakshmi Puja Kit
(1, 1), (1, 2), (1, 3), (1, 10),

-- 2. Griha Pravesh Kit
(2, 1), (2, 2), (2, 3), (2, 4), (2, 10),

-- 3. Saraswati Kit
(3, 1), (3, 2), (3, 3), (3, 5), (3, 6),

-- 4. Ganesh Chaturthi Kit
(4, 1), (4, 2), (4, 3), (4, 4), (4, 6),

-- 5. Navratri Kit
(5, 1), (5, 2), (5, 3), (5, 10),

-- 6. Satyanarayan Kit
(6, 1), (6, 2), (6, 3), (6, 4), (6, 10),

-- 7. Durga Puja Kit
(7, 1), (7, 3), (7, 10), (7, 6),

-- 8. Hanuman Kit
(8, 1), (8, 2), (8, 3), (8, 7), (8, 6),

-- 9. Rakhi Rituals Kit
(9, 1), (9, 2), (9, 10), (9, 5),

-- 10. Shraddha Kit
(10, 1), (10, 2), (10, 3), (10, 4), (10, 5),

-- 11. Bratabandha Kit
(11, 1), (11, 2), (11, 3), (11, 4),

-- 12. Pasni Kit
(12, 1), (12, 2), (12, 3), (12, 5), (12, 6),

-- 13. Mundan Kit
(13, 1), (13, 2), (13, 3), (13, 6), (13, 10),

-- 14. Janku Kit
(14, 3), (14, 1), (14, 2),

-- 15. Naamkaran Kit
(15, 1), (15, 2), (15, 3), (15, 5), (15, 10),

-- 16. Teej Kit
(16, 1), (16, 2), (16, 4), (16, 5), (16, 6), (16, 10),

-- 17. Chhath Puja Kit
(17, 10), (17, 5), (17, 6),

-- 18. Bala Chaturdashi Kit
(18, 1), (18, 2), (18, 3), (18, 4), (18, 6),

-- 19. Kojagrat Purnima Kit
(19, 1), (19, 2), (19, 3), (19, 10),

-- 20. Tihar Full Set
(20, 1), (20, 2), (20, 3), (20, 4), (20, 10),



(21, 8), (21, 4), (22, 9),  (22, 6),  (22, 8);

