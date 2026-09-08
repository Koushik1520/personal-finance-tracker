-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: localhost    Database: finance_tracker
-- ------------------------------------------------------
-- Server version	8.0.43

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `budgets`
--

DROP TABLE IF EXISTS `budgets`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `budgets` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `amount` decimal(10,2) NOT NULL,
  `category` varchar(255) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `month` int NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `year` int NOT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKln0tm5tgf3f9q3sp9sa5m8m7b` (`user_id`),
  CONSTRAINT `FKln0tm5tgf3f9q3sp9sa5m8m7b` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `expenses`
--

DROP TABLE IF EXISTS `expenses`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `expenses` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `amount` decimal(10,2) NOT NULL,
  `category` varchar(255) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `date` date NOT NULL,
  `description` text,
  `payment_method` varchar(255) NOT NULL,
  `receipt` varchar(255) DEFAULT NULL,
  `title` varchar(255) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKhpk0n2cbnfiuu5nrgl0ika3hq` (`user_id`),
  CONSTRAINT `FKhpk0n2cbnfiuu5nrgl0ika3hq` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `incomes`
--

DROP TABLE IF EXISTS `incomes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `incomes` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `amount` decimal(10,2) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `date` date NOT NULL,
  `description` varchar(255) DEFAULT NULL,
  `source` varchar(255) NOT NULL,
  `title` varchar(255) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKfq6qeso6vbt9wu7dyhnx8tpu9` (`user_id`),
  CONSTRAINT `FKfq6qeso6vbt9wu7dyhnx8tpu9` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `notifications`
--

DROP TABLE IF EXISTS `notifications`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `notifications` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL,
  `is_read` bit(1) NOT NULL,
  `message` text,
  `title` varchar(255) NOT NULL,
  `type` varchar(255) NOT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK9y21adhxn0ayjhfocscqox7bh` (`user_id`),
  CONSTRAINT `FK9y21adhxn0ayjhfocscqox7bh` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `password_reset_tokens`
--

DROP TABLE IF EXISTS `password_reset_tokens`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `password_reset_tokens` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL,
  `expiry_date` datetime(6) NOT NULL,
  `token` varchar(255) NOT NULL,
  `used` bit(1) NOT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_71lqwbwtklmljk3qlsugr1mig` (`token`),
  KEY `FKk3ndxg5xp6v7wd4gjyusp15gq` (`user_id`),
  CONSTRAINT `FKk3ndxg5xp6v7wd4gjyusp15gq` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `reports`
--

DROP TABLE IF EXISTS `reports`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reports` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `file_path` varchar(255) DEFAULT NULL,
  `generated_at` datetime(6) NOT NULL,
  `period` varchar(255) NOT NULL,
  `type` varchar(255) NOT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK2o32rer9hfweeylg7x8ut8rj2` (`user_id`),
  CONSTRAINT `FK2o32rer9hfweeylg7x8ut8rj2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `savings_goals`
--

DROP TABLE IF EXISTS `savings_goals`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `savings_goals` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL,
  `current_amount` decimal(10,2) NOT NULL,
  `deadline` date NOT NULL,
  `description` text,
  `name` varchar(255) NOT NULL,
  `target_amount` decimal(10,2) NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `user_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKcxl8rfkv17sumgm83nx0pl2x8` (`user_id`),
  CONSTRAINT `FKcxl8rfkv17sumgm83nx0pl2x8` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `budget_alerts` bit(1) DEFAULT NULL,
  `created_at` datetime(6) NOT NULL,
  `email` varchar(255) NOT NULL,
  `email_notifications` bit(1) DEFAULT NULL,
  `enabled` bit(1) NOT NULL,
  `name` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `phone` varchar(255) DEFAULT NULL,
  `preferred_currency` varchar(255) DEFAULT NULL,
  `profile_picture` varchar(255) DEFAULT NULL,
  `role` varchar(255) NOT NULL,
  `theme` varchar(255) DEFAULT NULL,
  `updated_at` datetime(6) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_6dotkott2kjsp8vw4d0m25fb7` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping routines for database 'finance_tracker'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-07-24 12:11:53
