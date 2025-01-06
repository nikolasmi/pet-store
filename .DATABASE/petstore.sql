-- --------------------------------------------------------
-- Host:                         localhost
-- Server version:               8.0.40 - MySQL Community Server - GPL
-- Server OS:                    Win64
-- HeidiSQL Version:             12.8.0.6908
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Dumping database structure for petstore
DROP DATABASE IF EXISTS `petstore`;
CREATE DATABASE IF NOT EXISTS `petstore` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `petstore`;

-- Dumping structure for table petstore.admin
DROP TABLE IF EXISTS `admin`;
CREATE TABLE IF NOT EXISTS `admin` (
  `admin_id` int unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`admin_id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table petstore.admin: ~4 rows (approximately)
DELETE FROM `admin`;
INSERT INTO `admin` (`admin_id`, `username`, `password`) VALUES
	(1, 'admin', 'C7AD44CBAD762A5DA0A452F9E854FDC1E0E7A52A38015F23F3EAB1D80B931DD472634DFAC71CD34EBC35D16AB7FB8A90C81F975113D6C7538DC69DD8DE9077EC'),
	(2, 'adminPostman', '0F1CBF02510B6714C483462190F2059666D6A024693072E610F99EAE63572F671A1427DAB7AB1400EC727520CECF6E38F0DFAFDD21548A0050D362C833AF2BE9'),
	(3, 'adminPostman2', '27CE6CB1AFD8A610C10DB36D67B627AAED5DB9CD57AA58717EAE2271BCB68A7B67474BC41FCAEDA7078A777FB9D480397F6269F295230D19731391086A16689C'),
	(4, 'adminPostmanPost', 'DF1FB90ECACB8B51C060C1D390A3C46AC283AD74B9C263BB87A15738987C69B7B20A45DFA7CB8671C6565B6417D49E15ADC1011353FEB6BE95B27B7E815F5629'),
	(5, 'admin', 'C7AD44CBAD762A5DA0A452F9E854FDC1E0E7A52A38015F23F3EAB1D80B931DD472634DFAC71CD34EBC35D16AB7FB8A90C81F975113D6C7538DC69DD8DE9077EC');

-- Dumping structure for table petstore.order
DROP TABLE IF EXISTS `order`;
CREATE TABLE IF NOT EXISTS `order` (
  `order_id` int unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int unsigned NOT NULL,
  `status` enum('u toku','pristiglo','otkazano') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'u toku',
  `total_price` int unsigned NOT NULL,
  PRIMARY KEY (`order_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table petstore.order: ~0 rows (approximately)
DELETE FROM `order`;

-- Dumping structure for table petstore.order_items
DROP TABLE IF EXISTS `order_items`;
CREATE TABLE IF NOT EXISTS `order_items` (
  `order_items_id` int unsigned NOT NULL AUTO_INCREMENT,
  `order_id` int unsigned NOT NULL,
  `pet_id` int unsigned NOT NULL,
  `price` int unsigned NOT NULL,
  PRIMARY KEY (`order_items_id`),
  KEY `fk_order_items_order_id` (`order_id`),
  KEY `fk_order_items_pet_id` (`pet_id`),
  CONSTRAINT `fk_order_items_order_id` FOREIGN KEY (`order_id`) REFERENCES `order` (`order_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_order_items_pet_id` FOREIGN KEY (`pet_id`) REFERENCES `pet` (`pet_id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table petstore.order_items: ~0 rows (approximately)
DELETE FROM `order_items`;

-- Dumping structure for table petstore.pet
DROP TABLE IF EXISTS `pet`;
CREATE TABLE IF NOT EXISTS `pet` (
  `pet_id` int unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `type` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `age` int unsigned NOT NULL,
  `size` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `origin` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `price` int unsigned NOT NULL,
  `availabe` enum('dostupno','nedostupno') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'dostupno',
  `image_path` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`pet_id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table petstore.pet: ~0 rows (approximately)
DELETE FROM `pet`;
INSERT INTO `pet` (`pet_id`, `name`, `description`, `type`, `age`, `size`, `origin`, `price`, `availabe`, `image_path`) VALUES
	(1, 'prob', 'proba', 'proba', 1, 'small', 'proba', 123, 'dostupno', 'slika.jpeg'),
	(2, 'postman pet', 'opis iz postmana', 'ribice', 2, 'mala', 'brazil', 700, 'dostupno', 'slika-ribica.jpeg');

-- Dumping structure for table petstore.review
DROP TABLE IF EXISTS `review`;
CREATE TABLE IF NOT EXISTS `review` (
  `review_id` int unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int unsigned NOT NULL,
  `pet_id` int unsigned NOT NULL,
  `rating` int unsigned NOT NULL,
  `comment` text COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`review_id`),
  KEY `fk_review_user_id` (`user_id`),
  KEY `fk_review_pet_id` (`pet_id`),
  CONSTRAINT `fk_review_pet_id` FOREIGN KEY (`pet_id`) REFERENCES `pet` (`pet_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_review_user_id` FOREIGN KEY (`user_id`) REFERENCES `user` (`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table petstore.review: ~0 rows (approximately)
DELETE FROM `review`;

-- Dumping structure for table petstore.user
DROP TABLE IF EXISTS `user`;
CREATE TABLE IF NOT EXISTS `user` (
  `user_id` int unsigned NOT NULL AUTO_INCREMENT,
  `email` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `pasword` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(15) COLLATE utf8mb4_unicode_ci NOT NULL,
  `address` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `favorite_type` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dumping data for table petstore.user: ~2 rows (approximately)
DELETE FROM `user`;
INSERT INTO `user` (`user_id`, `email`, `pasword`, `name`, `phone`, `address`, `favorite_type`) VALUES
	(1, 'user@gmail.com', 'sifraa', 'user1', '123123123', 'nepoznata 1', 'ribice'),
	(2, 'editpostman@gmail.com', 'AEAFE031E997B3A92E10AF351ECA88E674B826F83B841DF927C55445D40F28CE8667F23147BE3809EF3230316B0624E5B84D3286B01063B031C7654DD47AF20C', 'editPostmanUser', '012345678', 'postman adresa', 'ribice'),
	(3, 'postman@gmail.com', 'AEAFE031E997B3A92E10AF351ECA88E674B826F83B841DF927C55445D40F28CE8667F23147BE3809EF3230316B0624E5B84D3286B01063B031C7654DD47AF20C', 'novmetoduser', '12345678', 'postman nova', 'macke'),
	(4, 'user@gmail.com', 'user', 'user', '123456789', 'nebitna', 'pas');

/*!40103 SET TIME_ZONE=IFNULL(@OLD_TIME_ZONE, 'system') */;
/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IFNULL(@OLD_FOREIGN_KEY_CHECKS, 1) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=IFNULL(@OLD_SQL_NOTES, 1) */;
