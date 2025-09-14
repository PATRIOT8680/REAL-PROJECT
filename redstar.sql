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

 Date: 04/09/2025 23:00:42
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
) ENGINE = InnoDB AUTO_INCREMENT = 22 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_uca1400_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of accounts
-- ----------------------------
INSERT INTO `accounts` VALUES (20, 'jonson', 'mr.vistas86@mail.ru', '$2b$10$5duRt2LsTCdYEceL5r90F.saCzrbHyCzlSE6oxdzxutxgVO/7SjpS', 'HaseNRP', 1);
INSERT INTO `accounts` VALUES (21, 'dripstill', 'anaken.sk@gmail.com', '$2b$10$AlBhtBaeutcCA46iLCVcwOuCseIgzh6QRSRkIFc00fHbXQuFMS2si', 'Anaken74', 2);

-- ----------------------------
-- Table structure for chars
-- ----------------------------
DROP TABLE IF EXISTS `chars`;
CREATE TABLE `chars`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `sid` int(11) NULL DEFAULT NULL,
  `numberslot` int(11) NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 59 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_uca1400_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of chars
-- ----------------------------
INSERT INTO `chars` VALUES (54, 1, 2);
INSERT INTO `chars` VALUES (55, 1, 2);
INSERT INTO `chars` VALUES (56, 1, 2);
INSERT INTO `chars` VALUES (57, 1, 2);
INSERT INTO `chars` VALUES (58, 1, 2);

-- ----------------------------
-- Table structure for rent
-- ----------------------------
DROP TABLE IF EXISTS `rent`;
CREATE TABLE `rent`  (
  `id` int(11) NOT NULL,
  `pedname` text CHARACTER SET utf8mb4 COLLATE utf8mb4_uca1400_ai_ci NULL DEFAULT NULL,
  `modelname` text CHARACTER SET utf8mb4 COLLATE utf8mb4_uca1400_ai_ci NULL DEFAULT NULL,
  `pedpos` text CHARACTER SET utf8mb4 COLLATE utf8mb4_uca1400_ai_ci NULL DEFAULT NULL,
  `vehiclesdata` text CHARACTER SET utf8mb4 COLLATE utf8mb4_uca1400_ai_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb4 COLLATE = utf8mb4_uca1400_ai_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of rent
-- ----------------------------
INSERT INTO `rent` VALUES (1, 'Joseph Wilson', 'a_m_y_beach_02', '{\"x\":\"1950.923\",\"y\":\"3846.438\",\"z\":\"32.183\",\"heading\":\"-57.330\"}', '[{\"vehName\":\"kanjo\",\"price\":300,\"x\":\"1977.094\",\"y\":\"3836.809\",\"z\":\"31.453\",\"heading\":\"29.714\"},{\"vehName\":\"issi2\",\"price\":350,\"x\":\"1974.288\",\"y\":\"3834.907\",\"z\":\"31.690\",\"heading\":\"33.336\"},{\"vehName\":\"prairie\",\"price\":600,\"x\":\"1971.950\",\"y\":\"3832.783\",\"z\":\"31.567\",\"heading\":\"33.383\"},{\"vehName\":\"kanjosj\",\"price\":800,\"x\":\"1964.718\",\"y\":\"3832.471\",\"z\":\"31.326\",\"heading\":\"28.042\"},{\"vehName\":\"astron\",\"price\":800,\"x\":\"1969.359\",\"y\":\"3831.324\",\"z\":\"31.399\",\"heading\":\"29.767\"},{\"vehName\":\"manchez2\",\"price\":350,\"x\":\"1972.326\",\"y\":\"3851.041\",\"z\":\"31.500\",\"heading\":\"119.820\"},{\"vehName\":\"bf400\",\"price\":450,\"x\":\"1971.320\",\"y\":\"3852.607\",\"z\":\"31.490\",\"heading\":\"119.391\"},{\"vehName\":\"sanchez2\",\"price\":200,\"x\":\"1970.487\",\"y\":\"3854.015\",\"z\":\"31.500\",\"heading\":\"118.854\"},{\"vehName\":\"blazer2\",\"price\":50,\"x\":\"1969.368\",\"y\":\"3855.896\",\"z\":\"31.312\",\"heading\":\"123.079\"}]');
INSERT INTO `rent` VALUES (2, 'Paul Garcia', 'a_m_o_beach_01', '{\"x\":\"1410.173\",\"y\":\"3603.875\",\"z\":\"34.992\",\"heading\":\"-158.165\"}', '[{\"vehName\":\"kanjo\",\"price\":300,\"x\":\"1423.455\",\"y\":\"3625.638\",\"z\":\"34.285\",\"heading\":\"-161.049\"},{\"vehName\":\"issi2\",\"price\":350,\"x\":\"1420.264\",\"y\":\"3624.562\",\"z\":\"34.519\",\"heading\":\"-160.375\"},{\"vehName\":\"prairie\",\"price\":600,\"x\":\"1416.734\",\"y\":\"3623.533\",\"z\":\"34.410\",\"heading\":\"-163.001\"},{\"vehName\":\"kanjosj\",\"price\":800,\"x\":\"1413.346\",\"y\":\"3621.958\",\"z\":\"34.191\",\"heading\":\"-163.054\"},{\"vehName\":\"astron\",\"price\":800,\"x\":\"1434.562\",\"y\":\"3617.929\",\"z\":\"34.333\",\"heading\":\"108.077\"},{\"vehName\":\"sanchez2\",\"price\":200,\"x\":\"1412.905\",\"y\":\"3615.158\",\"z\":\"34.371\",\"heading\":\"-71.388\"},{\"vehName\":\"manchez2\",\"price\":350,\"x\":\"1413.689\",\"y\":\"3613.184\",\"z\":\"34.389\",\"heading\":\"-70.753\"},{\"vehName\":\"bf400\",\"price\":450,\"x\":\"1414.222\",\"y\":\"3611.374\",\"z\":\"34.431\",\"heading\":\"-67.596\"},{\"vehName\":\"blazer2\",\"price\":50,\"x\":\"1415.057\",\"y\":\"3609.092\",\"z\":\"34.261\",\"heading\":\"-72.405\"}]');

SET FOREIGN_KEY_CHECKS = 1;
