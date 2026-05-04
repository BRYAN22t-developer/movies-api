-- MySQL dump 10.13  Distrib 8.0.33, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: movies
-- ------------------------------------------------------
-- Server version	8.0.17

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Dumping data for table `genres`
--

LOCK TABLES `genres` WRITE;
/*!40000 ALTER TABLE `genres` DISABLE KEYS */;
INSERT INTO `genres` VALUES (1,'Action'),(2,'Adventure'),(3,'Animation'),(4,'Comedy'),(5,'Crime'),(17,'Documentary'),(6,'Drama'),(13,'Family'),(7,'Fantasy'),(20,'Historical'),(8,'Horror'),(25,'Martial Arts'),(14,'Musical'),(9,'Mystery'),(19,'Psychological'),(10,'Romance'),(11,'Science Fiction'),(18,'Superhero'),(12,'Thriller'),(15,'War'),(16,'Western');
/*!40000 ALTER TABLE `genres` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `movies`
--

LOCK TABLES `movies` WRITE;
/*!40000 ALTER TABLE `movies` DISABLE KEYS */;
INSERT INTO `movies` VALUES (1,'Inception 2','Two imprisoned men bond over a number of years, finding solace and eventual redemption through acts of common decency.','https://devsapihub.com/img-movies/1.jpg',142,NULL),(2,'Jumanji','In Jumanji: The Next Level, the gang is back but the game has changed.','https://devsapihub.com/img-movies/2.jpg',123,NULL),(3,'The Godfather','The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant son','https://devsapihub.com/img-movies/3.jpg',175,NULL),(4,'The Godfather: Part II','The early life and career of Vito Corleone in 1920s New York City is portrayed, while his son, Michael, expands and tightens his grip on the family crime syndicate.','https://devsapihub.com/img-movies/4.jpg',200,NULL),(5,'The Dark Knight','When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.','https://devsapihub.com/img-movies/5.jpg',152,NULL),(6,'12 Angry Men','A jury holdout attempts to prevent a miscarriage of justice by forcing his colleagues to reconsider the evidence.','https://devsapihub.com/img-movies/6.jpg',96,NULL),(7,'No Hard Feelings','On the brink of losing her home, a woman agrees to date a wealthy couple\'s introverted son before he leaves for college.','https://devsapihub.com/img-movies/7.jpg',103,NULL),(8,'The Lord of the Rings: The Return of the King','Gandalf and Aragorn lead the World of Men against Sauron\'s army to draw his gaze from Frodo and Sam as they approach Mount Doom with the One Ring.','https://devsapihub.com/img-movies/8.jpg',201,NULL),(9,'Pulp Fiction','The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption.','https://devsapihub.com/img-movies/9.jpg',154,NULL),(10,'The Good, the Bad and the Ugly','A bounty hunting scam joins two men in an uneasy alliance against a third in a race to find a fortune in gold buried in a remote cemetery.','https://devsapihub.com/img-movies/10.jpg',161,NULL),(11,'The Lord of the Rings: The Fellowship of the Ring','A meek Hobbit from the Shire and eight companions set out on a journey to destroy the powerful One Ring and save Middle-earth from the Dark Lord Sauron.','https://devsapihub.com/img-movies/11.jpg',178,NULL),(12,'Fight Club','An insomniac office worker and a devil-may-care soapmaker form an underground fight club that evolves into something much, much more.','https://devsapihub.com/img-movies/12.jpg',139,NULL),(13,'Dune: Part Two','Paul Atreides unites with Chani and the Fremen to exact revenge against the conspirators who destroyed his family.','https://devsapihub.com/img-movies/13.jpg',166,NULL),(14,'Oppenheimer','The story of American scientist J. Robert Oppenheimer and his role in the development of the atomic bomb.','https://devsapihub.com/img-movies/14.jpg',180,NULL),(15,'Barbie','Barbie suffers a crisis that leads her to question her world and her existence.','https://devsapihub.com/img-movies/15.jpg',114,NULL),(16,'Spider-Man: No Way Home','With Spider-Man\'s identity revealed, Peter asks Doctor Strange for help, leading to multiverse chaos.','https://devsapihub.com/img-movies/16.jpg',148,NULL),(17,'Avatar: The Way of Water','Jake Sully lives with his newfound family formed on the planet of Pandora, facing new threats.','https://devsapihub.com/img-movies/17.jpg',192,NULL),(18,'The Batman','Batman uncovers corruption in Gotham City that connects to his own family while facing the Riddler.','https://devsapihub.com/img-movies/18.jpg',176,NULL),(19,'Everything Everywhere All at Once','An aging Chinese immigrant is swept up in a wild adventure where she alone can save the world by exploring other universes.','https://devsapihub.com/img-movies/19.jpg',139,NULL),(20,'The Matrix','A computer hacker learns from mysterious rebels about the true nature of his reality and his role in the war against its controllers.','https://devsapihub.com/img-movies/20.jpg',136,NULL),(27,'Inception 2','A skilled thief enters people\'s dreams to steal secrets, but is offered a chance at redemption through one last mission.','https://example.com/posters/inception.jpg',148,NULL),(28,'Inception','A skilled thief enters people\'s dreams to steal secrets, but is offered a chance at redemption through one last mission.','https://example.com/posters/inception.jpg',148,NULL),(29,'Inception 5','A skilled thief enters people\'s dreams to steal secrets, but is offered a chance at redemption through one last mission.','https://example.com/posters/inception.jpg',148,NULL);
/*!40000 ALTER TABLE `movies` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `movies_genres`
--

LOCK TABLES `movies_genres` WRITE;
/*!40000 ALTER TABLE `movies_genres` DISABLE KEYS */;
INSERT INTO `movies_genres` VALUES (1,1),(2,1),(16,1),(20,1),(27,1),(28,1),(29,1),(2,2),(8,2),(10,2),(11,2),(13,2),(15,2),(16,2),(17,2),(19,2),(2,4),(7,4),(9,4),(15,4),(19,4),(3,5),(4,5),(5,5),(9,5),(18,5),(3,6),(4,6),(6,6),(12,6),(13,6),(14,6),(2,7),(8,7),(11,7),(15,7),(16,7),(19,7),(1,8),(27,8),(18,9),(7,10),(15,10),(1,11),(13,11),(16,11),(17,11),(19,11),(20,11),(27,11),(28,11),(29,11),(1,12),(5,12),(18,12),(27,12),(28,12),(29,12),(10,16),(5,18),(16,18),(18,18),(12,19),(14,20);
/*!40000 ALTER TABLE `movies_genres` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `permissions`
--

LOCK TABLES `permissions` WRITE;
/*!40000 ALTER TABLE `permissions` DISABLE KEYS */;
INSERT INTO `permissions` VALUES (1,'movies:create'),(4,'movies:delete'),(2,'movies:read'),(3,'movies:update'),(15,'reservations:cancel'),(13,'reservations:create'),(21,'reservations:delete'),(14,'reservations:read'),(20,'reservations:update'),(5,'rooms:create'),(8,'rooms:delete'),(6,'rooms:read'),(7,'rooms:update'),(9,'schedules:create'),(12,'schedules:delete'),(10,'schedules:read'),(11,'schedules:update'),(16,'users:create'),(19,'users:delete'),(17,'users:read'),(18,'users:update');
/*!40000 ALTER TABLE `permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `reservation_states`
--

LOCK TABLES `reservation_states` WRITE;
/*!40000 ALTER TABLE `reservation_states` DISABLE KEYS */;
INSERT INTO `reservation_states` VALUES (1,'cancelled'),(3,'confirmed'),(2,'pending');
/*!40000 ALTER TABLE `reservation_states` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `reservations`
--

LOCK TABLES `reservations` WRITE;
/*!40000 ALTER TABLE `reservations` DISABLE KEYS */;
INSERT INTO `reservations` VALUES (1,1,5,13,3,'2026-05-01 16:01:32'),(11,2,5,13,3,'2026-05-01 16:04:07'),(21,16,3,13,3,'2026-05-01 16:04:29'),(22,3,5,13,3,'2026-05-01 16:05:20'),(72,5,5,13,3,'2026-05-02 16:23:35'),(102,6,5,13,3,'2026-05-02 17:05:50');
/*!40000 ALTER TABLE `reservations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,'admin'),(2,'customer'),(3,'ticket_seller');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `roles_permissions`
--

LOCK TABLES `roles_permissions` WRITE;
/*!40000 ALTER TABLE `roles_permissions` DISABLE KEYS */;
INSERT INTO `roles_permissions` VALUES (1,1),(1,2),(2,2),(3,2),(1,3),(1,4),(1,5),(1,6),(3,6),(1,7),(1,8),(1,9),(1,10),(2,10),(3,10),(1,11),(1,12),(1,13),(2,13),(3,13),(1,14),(2,14),(3,14),(1,15),(2,15),(3,15),(1,16),(1,17),(1,18),(1,19),(1,20),(1,21);
/*!40000 ALTER TABLE `roles_permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `rooms`
--

LOCK TABLES `rooms` WRITE;
/*!40000 ALTER TABLE `rooms` DISABLE KEYS */;
INSERT INTO `rooms` VALUES (1,'room 1',NULL),(2,'room 2',NULL),(3,'room 3',NULL);
/*!40000 ALTER TABLE `rooms` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `schedules`
--

LOCK TABLES `schedules` WRITE;
/*!40000 ALTER TABLE `schedules` DISABLE KEYS */;
INSERT INTO `schedules` VALUES (1,1,1,2,'15:00:00','2026-03-12'),(2,5,1,2,'18:00:00','2026-03-12'),(3,14,1,2,'21:00:00','2026-03-12'),(4,6,2,2,'14:30:00','2026-03-12'),(5,15,2,2,'17:00:00','2026-03-12'),(6,16,2,2,'19:30:00','2026-03-12'),(7,6,3,2,'16:00:00','2026-03-12'),(8,12,3,2,'18:00:00','2026-03-12'),(9,20,3,2,'20:45:00','2026-03-12'),(10,3,1,2,'14:00:00','2026-03-13'),(11,8,1,2,'18:00:00','2026-03-13'),(12,7,2,2,'15:30:00','2026-03-13'),(13,19,2,2,'18:00:00','2026-03-13'),(14,13,2,2,'21:00:00','2026-03-13'),(15,9,3,2,'16:00:00','2026-03-13'),(16,18,3,2,'19:00:00','2026-03-13'),(19,2,2,1,'14:30:00','2027-03-12'),(21,2,2,1,'14:30:00','2028-03-12'),(22,2,2,1,'14:30:00','2029-03-12'),(23,2,2,1,'14:30:00','2030-03-12'),(24,2,2,1,'14:30:00','2031-03-12'),(25,6,2,1,'14:30:00','2032-03-12'),(27,2,2,1,'14:30:00','2032-03-12');
/*!40000 ALTER TABLE `schedules` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `schedules_states`
--

LOCK TABLES `schedules_states` WRITE;
/*!40000 ALTER TABLE `schedules_states` DISABLE KEYS */;
INSERT INTO `schedules_states` VALUES (2,'confirmed'),(4,'hj'),(1,'pending'),(5,'random'),(7,'test1'),(9,'test2');
/*!40000 ALTER TABLE `schedules_states` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `seats`
--

LOCK TABLES `seats` WRITE;
/*!40000 ALTER TABLE `seats` DISABLE KEYS */;
INSERT INTO `seats` VALUES (1,1,'A',NULL,1),(2,1,'A',NULL,2),(3,1,'A',NULL,3),(4,1,'A',NULL,4),(5,1,'A',NULL,5),(6,1,'B',NULL,1),(7,1,'B',NULL,2),(8,1,'B',NULL,3),(9,1,'B',NULL,4),(10,1,'B',NULL,5),(11,1,'C',NULL,1),(12,1,'C',NULL,2),(13,1,'C',NULL,3),(14,1,'C',NULL,4),(15,1,'C',NULL,5),(16,2,'A',NULL,1),(17,2,'A',NULL,2),(18,2,'A',NULL,3),(19,2,'A',NULL,4),(20,2,'A',NULL,5),(21,2,'B',NULL,1),(22,2,'B',NULL,2),(23,2,'B',NULL,3),(24,2,'B',NULL,4),(25,2,'B',NULL,5),(26,2,'C',NULL,1),(27,2,'C',NULL,2),(28,2,'C',NULL,3),(29,2,'C',NULL,4),(30,2,'C',NULL,5),(31,3,'A',NULL,1),(32,3,'A',NULL,2),(33,3,'A',NULL,3),(34,3,'A',NULL,4),(35,3,'A',NULL,5),(36,3,'B',NULL,1),(37,3,'B',NULL,2),(38,3,'B',NULL,3),(39,3,'B',NULL,4),(40,3,'B',NULL,5),(41,3,'C',NULL,1),(42,3,'C',NULL,2),(43,3,'C',NULL,3),(44,3,'C',NULL,4),(45,3,'C',NULL,5),(46,1,'D',NULL,1),(48,1,'E',NULL,1),(49,1,'E',NULL,2),(50,1,'D',NULL,3);
/*!40000 ALTER TABLE `seats` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` (`id`, `username`, `password`, `deleted_at`) VALUES
(1, 'admin', '$2b$10$52Ihcxec3X3K7ZOldj9BT.TqT46N/xNxzorEiSA1hejTRIBwxS.iS', NULL),
(2, 'customer', '$2b$10$mfHbZHR6YVVVe1B2Dih9P.99pal8bDPseKeNhBaI/OR8TwcvQ5jRG', NULL),
(3, 'ticket_seller', '$2b$10$LDKExoe3y1clTcSzWanx9OmLaQ4EEbs5l8TfONRBSnRQyUAqfVTAm', NULL);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `users_roles`
--

LOCK TABLES `users_roles` WRITE;
/*!40000 ALTER TABLE `users_roles` DISABLE KEYS */;
INSERT INTO `users_roles` (`user_id`, `role_id`) VALUES
(1, 1),   -- admin
(2, 2),  -- customer
(3, 3);  -- ticket_seller
/*!40000 ALTER TABLE `users_roles` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-05-02 17:25:41
