/*
 Navicat Premium Data Transfer

 Source Server         : GTA5
 Source Server Type    : MariaDB
 Source Server Version : 110702 (11.7.2-MariaDB)
 Source Host           : localhost:3306
 Source Schema         : redstar

 Target Server Type    : MariaDB
 Target Server Version : 110702 (11.7.2-MariaDB)
 File Encoding         : 65001

 Date: 10/08/2025 21:39:33
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for accounts
-- ----------------------------
DROP TABLE IF EXISTS `accounts`;
CREATE TABLE `accounts`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `login` text CHARACTER SET utf8mb4 COLLATE utf8mb4_uca1400_ai_ci NOT NULL,
  `email` text CHARACTER SET utf8mb4 COLLATE utf8mb4_uca1400_ai_ci NOT NULL,
  `password` text CHARACTER SET utf8mb4 COLLATE utf8mb4_uca1400_ai_ci NOT NULL,
  `socialClubName` text CHARACTER SET utf8mb4 COLLATE utf8mb4_uca1400_ai_ci NOT NULL,
  `sid` int(11) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 20 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_uca1400_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of accounts
-- ----------------------------
INSERT INTO `accounts` VALUES (19, 'jonson', 'kolomoez86@yandex.ru', '$2a$10$TVFyXFxsysVkCKLenkGrxu/V33r6QbxzXxnXANI.ff9HrADq11V5W', 'HaseNRP', 1);

SET FOREIGN_KEY_CHECKS = 1;
