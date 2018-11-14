/*
 Navicat Premium Data Transfer

 Source Server         : remote Mysql
 Source Server Type    : MySQL
 Source Server Version : 50633
 Source Host           : 192.168.0.46:3306
 Source Schema         : manipuladores

 Target Server Type    : MySQL
 Target Server Version : 50633
 File Encoding         : 65001

 Date: 14/11/2018 14:07:28
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for ausencias
-- ----------------------------
DROP TABLE IF EXISTS `ausencias`;
CREATE TABLE `ausencias`  (
  `idausencia` int(11) NOT NULL AUTO_INCREMENT,
  `idmanipulador` int(11) NOT NULL,
  `fecha` date NULL DEFAULT NULL,
  `esdiacompleto` tinyint(1) NULL DEFAULT 0,
  `hora_inicio` time(0) NULL DEFAULT NULL,
  `hora_fin` time(0) NULL DEFAULT NULL,
  `observaciones` varchar(200) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`idausencia`) USING BTREE,
  INDEX `asusencias_idmanipulador_fk_idx`(`idmanipulador`) USING BTREE,
  CONSTRAINT `asusencias_idmanipulador_fk` FOREIGN KEY (`idmanipulador`) REFERENCES `manipuladores` (`idmanipulador`) ON DELETE NO ACTION ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 31 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of ausencias
-- ----------------------------
INSERT INTO `ausencias` VALUES (1, 1, '2018-10-12', 0, '10:05:00', '12:05:00', 'cambio');
INSERT INTO `ausencias` VALUES (2, 3, '2018-10-04', 0, '09:00:00', '13:00:00', 'justificado');
INSERT INTO `ausencias` VALUES (3, 2, '2018-10-10', 0, '10:00:00', '15:30:00', 'justificado');
INSERT INTO `ausencias` VALUES (4, 2, '2018-10-02', 1, NULL, NULL, 'justificado');
INSERT INTO `ausencias` VALUES (5, 3, '2018-07-10', 0, '14:20:00', '14:20:00', 'reqw');
INSERT INTO `ausencias` VALUES (6, 1, '2018-06-09', 0, '10:25:00', '10:25:00', 'dasda');
INSERT INTO `ausencias` VALUES (22, 1, '2018-10-18', 1, NULL, NULL, 'asdadas');
INSERT INTO `ausencias` VALUES (23, 4, '2018-10-19', 1, NULL, NULL, 'aadsd');
INSERT INTO `ausencias` VALUES (25, 6, '2018-10-29', 0, '18:15:00', '18:15:00', 'cambio');
INSERT INTO `ausencias` VALUES (26, 6, '2018-10-29', 0, '18:15:00', '18:15:00', 'cambio');
INSERT INTO `ausencias` VALUES (27, 7, '2018-10-30', 0, '18:10:00', '18:10:00', 'tttttt');
INSERT INTO `ausencias` VALUES (28, 2, '2018-10-29', 1, NULL, NULL, 'tttttttt');
INSERT INTO `ausencias` VALUES (29, 9, '2018-06-01', 1, NULL, NULL, '1 del 6');
INSERT INTO `ausencias` VALUES (30, 29, '2018-11-13', 1, NULL, NULL, '1321321');

-- ----------------------------
-- Table structure for descansos
-- ----------------------------
DROP TABLE IF EXISTS `descansos`;
CREATE TABLE `descansos`  (
  `iddescanso` int(11) NOT NULL AUTO_INCREMENT,
  `idmanipulador` int(11) NOT NULL,
  `fecha_inicio` date NULL DEFAULT NULL,
  `fecha_fin` date NULL DEFAULT NULL,
  `tipo` varchar(45) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`iddescanso`) USING BTREE,
  INDEX `descansos_idmanipulador_fk_idx`(`idmanipulador`) USING BTREE,
  CONSTRAINT `descansos_idmanipulador_fk` FOREIGN KEY (`idmanipulador`) REFERENCES `manipuladores` (`idmanipulador`) ON DELETE NO ACTION ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 10 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of descansos
-- ----------------------------
INSERT INTO `descansos` VALUES (4, 5, '2018-11-02', '2018-11-05', 'aaaaaa');
INSERT INTO `descansos` VALUES (5, 3, '2018-10-18', '2018-10-27', 'rwrwerew');
INSERT INTO `descansos` VALUES (6, 6, '2018-10-18', '2018-10-18', '333');
INSERT INTO `descansos` VALUES (7, 1, '2018-10-18', '2018-10-18', 'adasda');
INSERT INTO `descansos` VALUES (8, 1, '2018-10-19', '2018-10-19', 'qweqweqweqw');
INSERT INTO `descansos` VALUES (9, 3, '2018-10-19', '2018-10-19', 'asdasd');

-- ----------------------------
-- Table structure for grupos_manipuladores
-- ----------------------------
DROP TABLE IF EXISTS `grupos_manipuladores`;
CREATE TABLE `grupos_manipuladores`  (
  `idgrupos_manipuladores` int(11) NOT NULL AUTO_INCREMENT,
  `nombre_grupo` varchar(45) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `dias_maximos_seguidos` int(11) NULL DEFAULT NULL,
  PRIMARY KEY (`idgrupos_manipuladores`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Table structure for lineas
-- ----------------------------
DROP TABLE IF EXISTS `lineas`;
CREATE TABLE `lineas`  (
  `idlinea` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `idnave` int(11) NOT NULL,
  `idtipolinea` int(11) NOT NULL,
  `estadisponible` tinyint(1) NULL DEFAULT 0,
  `puestos_maximos` int(11) NULL DEFAULT NULL,
  `fiabilidad` int(1) NULL DEFAULT NULL,
  `velocidad` int(1) NULL DEFAULT NULL,
  `disponibilidad` int(1) NULL DEFAULT NULL,
  PRIMARY KEY (`idlinea`) USING BTREE,
  INDEX `lineas_idnave_fk_idx`(`idnave`) USING BTREE,
  INDEX `lineas_idtipolinea_fk_idx`(`idtipolinea`) USING BTREE,
  CONSTRAINT `lineas_idnave_fk` FOREIGN KEY (`idnave`) REFERENCES `naves` (`idnave`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `lineas_idtipolinea_fk` FOREIGN KEY (`idtipolinea`) REFERENCES `tipo_linea` (`idtipolinea`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE = InnoDB AUTO_INCREMENT = 12 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of lineas
-- ----------------------------
INSERT INTO `lineas` VALUES (2, 'linea 1', 2, 1, 1, 20, 1, 0, 0);
INSERT INTO `lineas` VALUES (3, 'linea 2', 3, 1, 1, 30, 0, 1, 0);
INSERT INTO `lineas` VALUES (4, 'linea 3', 1, 1, 1, 40, 0, 0, 1);
INSERT INTO `lineas` VALUES (9, 'linea 4', 4, 1, 1, 11, 0, 0, 0);
INSERT INTO `lineas` VALUES (11, 'linea 5', 9, 1, 0, 9, 0, 1, 1);

-- ----------------------------
-- Table structure for manipuladores
-- ----------------------------
DROP TABLE IF EXISTS `manipuladores`;
CREATE TABLE `manipuladores`  (
  `idmanipulador` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `apellidos` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `dni` varchar(9) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `telefono` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `direccion` varchar(200) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `dias_seguidos_trabajados` int(11) NULL DEFAULT 0,
  `email` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `tlf_familiar` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `fiabilidad` tinyint(1) NULL DEFAULT 0,
  `velocidad` tinyint(1) NULL DEFAULT 0,
  `disponibilidad` tinyint(1) NULL DEFAULT 0,
  `observaciones` varchar(200) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`idmanipulador`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 125 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of manipuladores
-- ----------------------------
INSERT INTO `manipuladores` VALUES (1, 'Julio', 'Gomez Restrepo', '78945612o', '987654123', 'adif adifjaijf di oapsdofij 6', 5, 'regisof_viveros@app.com', '456123789', 5, 3, 1, 'observaciones');
INSERT INTO `manipuladores` VALUES (2, 'Silvia', 'Gil Piñero', '45871243b', '987654123', 'adsadaddadsdsaqwe', 7, 'prueba@prueba.com', '951236478', 2, 3, 9, 'observaciones');
INSERT INTO `manipuladores` VALUES (3, 'Tamara', 'Gonzalez Prieto', '46798241j', '102345687', 'iuyt uttb y ytuyiuytyt', 12, 'asdfasdfasdf@oppijdfio', '989879877', 1, 5, 8, 'poiu');
INSERT INTO `manipuladores` VALUES (4, 'Lidia', 'Gomez Garcia lorca', '4821741b', '111223344', 'kgkg kj jhk kjg kj kjghk', 22, 'kjhgkug7u8', '999887755', 7, 4, 6, 'Lidia');
INSERT INTO `manipuladores` VALUES (5, 'Manuela', 'Garcia', '98765341c', '312457451', 'Calle Larga 210', 19, 'prueba@prueba.com', '951236478', 3, 5, 8, 'observaciones');
INSERT INTO `manipuladores` VALUES (6, 'Antonio', 'Gines Copano', '48569654l', '147741442', 'adsadaddadsdsaqwe', 15, 'prueba@prueba.com', '951236478', 4, 7, 6, 'observaciones');
INSERT INTO `manipuladores` VALUES (7, 'Rafaela', 'Carra Suarez', '35775335l', '987654123', 'adsadaddadsdsaqwe', 9, 'prueba@prueba.com', '951236478', 2, 8, 6, 'observaciones');
INSERT INTO `manipuladores` VALUES (8, 'Pilar', 'Jimenez Guijarro', '14774110s', '987654123', 'adsadaddadsdsaqwe', 7, 'prueba@prueba.com', '951236478', 8, 5, 4, 'observaciones');
INSERT INTO `manipuladores` VALUES (9, 'Carles', 'Baixdemont Casamenó', '54321234w', '987654123', 'adsadaddadsdsaqwe', 12, 'prueba@prueba.com', '951236478', 9, 3, 6, 'observaciones');
INSERT INTO `manipuladores` VALUES (10, 'Poncio', 'Pilatos Bahamonte', '96989778z', '987654123', 'adsadaddadsdsaqwe', 11, 'prueba@prueba.com', '951236478', 6, 4, 5, 'observaciones');
INSERT INTO `manipuladores` VALUES (11, 'Juan', 'Perez Galdos', '87965412x', '963258741', 'lelelelepdlepdepd', 20, 'fefefe@gadasdasds.com', '951236478', 6, 6, 7, '3addwqeqew');
INSERT INTO `manipuladores` VALUES (12, 'Manuela', 'Sanchez  Jimeno', '89745213x', '159951595', 'adsadaddadsdsaqwe', 16, 'prueba@prueba.com', '951236478', 4, 4, 8, 'observaciones');
INSERT INTO `manipuladores` VALUES (13, 'Manuel', 'Antonio carrero', '5471254a', '999555777', 'adsadaddadsdsaqwe', 14, 'prueba@prueba.com', '951236478', 6, 5, 4, 'observaciones');
INSERT INTO `manipuladores` VALUES (14, 'Andres', 'Antonio carrero', '5671254a', '999555777', 'adsadaddadsdsaqwe', 14, 'prueba@prueba.com', '951236478', 6, 5, 4, 'observaciones');
INSERT INTO `manipuladores` VALUES (15, 'Jordi', 'Antonio carrero', '5475254a', '999555777', 'adsadaddadsdsaqwe', 14, 'prueba@prueba.com', '951236478', 6, 5, 4, 'observaciones');
INSERT INTO `manipuladores` VALUES (16, 'Roberto', 'Antonio carrero', '5423454a', '999555777', 'adsadaddadsdsaqwe', 14, 'prueba@prueba.com', '951236478', 6, 5, 4, 'observaciones');
INSERT INTO `manipuladores` VALUES (17, 'Pedro', 'Antonio carrero', '5471554a', '999555777', 'adsadaddadsdsaqwe', 14, 'prueba@prueba.com', '951236478', 6, 5, 4, 'observaciones');
INSERT INTO `manipuladores` VALUES (18, 'Prueba', 'Antonio carrero', '5475324a', '999555777', 'adsadaddadsdsaqwe', 14, 'prueba@prueba.com', '951236478', 6, 5, 4, 'observaciones');
INSERT INTO `manipuladores` VALUES (19, 'test', 'Antonio carrero', '5471287b', '999555777', 'adsadaddadsdsaqwe', 14, 'prueba@prueba.com', '951236478', 6, 5, 4, 'observaciones');
INSERT INTO `manipuladores` VALUES (20, 'Carles', 'Antonio carrero', '5471299q', '999555777', 'adsadaddadsdsaqwe', 14, 'prueba@prueba.com', '951236478', 6, 5, 4, 'observaciones');
INSERT INTO `manipuladores` VALUES (21, 'Rodrigo', 'Antonio carrero', '5471232r', '999555777', 'adsadaddadsdsaqwe', 14, 'prueba@prueba.com', '951236478', 6, 5, 4, 'observaciones');
INSERT INTO `manipuladores` VALUES (22, 'pepe', 'Antonio carrero', '5471276y', '999555777', 'adsadaddadsdsaqwe', 14, 'prueba@prueba.com', '951236478', 6, 5, 4, 'observaciones');
INSERT INTO `manipuladores` VALUES (23, 'Andreu', 'Antonio carrero', '5471444m', '999555777', 'adsadaddadsdsaqwe', 14, 'prueba@prueba.com', '951236478', 6, 5, 4, 'observaciones');
INSERT INTO `manipuladores` VALUES (24, 'Maria', 'Antonio carrero', '5471923g', '999555777', 'adsadaddadsdsaqwe', 14, 'prueba@prueba.com', '951236478', 6, 5, 4, 'observaciones');
INSERT INTO `manipuladores` VALUES (25, 'Odacow', 'Xojepuv Zafaledoxigano', '59002275Q', NULL, NULL, 5, NULL, NULL, 2, 5, 0, NULL);
INSERT INTO `manipuladores` VALUES (26, 'Ulojoj', 'Aro Waceyoxejenacu', '81549285P', NULL, NULL, 5, NULL, NULL, 3, 2, 9, NULL);
INSERT INTO `manipuladores` VALUES (27, 'Exojin', 'Riyevabe Dubozavoz', '28002973R', NULL, NULL, 1, NULL, NULL, 8, 8, 4, NULL);
INSERT INTO `manipuladores` VALUES (28, 'Yapo', 'Imihun Josu', '80931438G', NULL, NULL, 7, NULL, NULL, 7, 5, 7, NULL);
INSERT INTO `manipuladores` VALUES (29, 'Vodarur', 'Fareh Ihuketavu', '70958703I', NULL, NULL, 3, NULL, NULL, 0, 5, 6, NULL);
INSERT INTO `manipuladores` VALUES (30, 'Musifoha', 'Rago Upumeluf', '82543757K', NULL, NULL, 6, NULL, NULL, 0, 8, 9, NULL);
INSERT INTO `manipuladores` VALUES (31, 'Amagey', 'Owowibebodipe Hif', '32463317Q', NULL, NULL, 5, NULL, NULL, 6, 5, 5, NULL);
INSERT INTO `manipuladores` VALUES (32, 'Nemoriyije', 'Payuwali Ovum', '15060113B', NULL, NULL, 3, NULL, NULL, 0, 1, 7, NULL);
INSERT INTO `manipuladores` VALUES (33, 'Jebuhilef', 'Isutute Bamosipigele', '79938838S', NULL, NULL, 2, NULL, NULL, 6, 7, 8, NULL);
INSERT INTO `manipuladores` VALUES (34, 'Veji', 'Udukubopul Igix', '17060794A', NULL, NULL, 5, NULL, NULL, 5, 3, 2, NULL);
INSERT INTO `manipuladores` VALUES (35, 'Unafiz', 'Ekuwoxunegihu Zexododovi', '25290064Q', NULL, NULL, 4, NULL, NULL, 4, 2, 1, NULL);
INSERT INTO `manipuladores` VALUES (36, 'Zenepafuso', 'Ixiri Hozonuwox', '32320102P', NULL, NULL, 4, NULL, NULL, 4, 6, 3, NULL);
INSERT INTO `manipuladores` VALUES (37, 'Bimok', 'Iduwiguxefi Yixuzu', '80247220X', NULL, NULL, 0, NULL, NULL, 9, 4, 1, NULL);
INSERT INTO `manipuladores` VALUES (38, 'Imuw', 'Akeg Enasoya', '89074929M', NULL, NULL, 3, NULL, NULL, 1, 9, 4, NULL);
INSERT INTO `manipuladores` VALUES (39, 'Revijih', 'Ura Yunetetifif', '88129847P', NULL, NULL, 6, NULL, NULL, 2, 9, 3, NULL);
INSERT INTO `manipuladores` VALUES (40, 'Ugeloriv', 'Yibewi Suxepofufuze', '51142798I', NULL, NULL, 4, NULL, NULL, 4, 6, 5, NULL);
INSERT INTO `manipuladores` VALUES (41, 'Awivew', 'Isubuyejus Iputarayom', '37713113G', NULL, NULL, 2, NULL, NULL, 5, 1, 0, NULL);
INSERT INTO `manipuladores` VALUES (42, 'Aname', 'Ehuwahowivuge Xahodizuvopogu', '20213720H', NULL, NULL, 0, NULL, NULL, 0, 3, 4, NULL);
INSERT INTO `manipuladores` VALUES (43, 'Pasawibe', 'Volitogi Xun', '27627950G', NULL, NULL, 6, NULL, NULL, 5, 1, 4, NULL);
INSERT INTO `manipuladores` VALUES (44, 'Gudoma', 'Orifuhitakimiv Iwulikuh', '37770743L', NULL, NULL, 6, NULL, NULL, 4, 2, 7, NULL);
INSERT INTO `manipuladores` VALUES (45, 'Usuzokaxu', 'Usopetebeci Ediloloficula', '39107082V', NULL, NULL, 1, NULL, NULL, 5, 5, 0, NULL);
INSERT INTO `manipuladores` VALUES (46, 'Uvezosih', 'Ajijesab Pov', '62716677U', NULL, NULL, 7, NULL, NULL, 9, 1, 0, NULL);
INSERT INTO `manipuladores` VALUES (47, 'Xusesex', 'Ujopenow Opoged', '93030636N', NULL, NULL, 1, NULL, NULL, 6, 7, 3, NULL);
INSERT INTO `manipuladores` VALUES (48, 'Cuzamexe', 'Ejemaw Azuxapozavado', '45805795Z', NULL, NULL, 0, NULL, NULL, 1, 5, 9, NULL);
INSERT INTO `manipuladores` VALUES (49, 'Lacolo', 'Arehiwuwediri Romelaluwaji', '59421351M', NULL, NULL, 1, NULL, NULL, 7, 1, 3, NULL);
INSERT INTO `manipuladores` VALUES (50, 'Ohax', 'Cuwixov Libubur', '93351467H', NULL, NULL, 2, NULL, NULL, 2, 8, 3, NULL);
INSERT INTO `manipuladores` VALUES (51, 'Iyaviduzon', 'Ihibuzu Rar', '18612875V', NULL, NULL, 0, NULL, NULL, 1, 0, 4, NULL);
INSERT INTO `manipuladores` VALUES (52, 'Rujalubom', 'Najis Xunivitusavata', '60584119H', NULL, NULL, 2, NULL, NULL, 1, 9, 3, NULL);
INSERT INTO `manipuladores` VALUES (53, 'Apeg', 'Sad Ruwud', '89004825A', NULL, NULL, 4, NULL, NULL, 2, 2, 2, NULL);
INSERT INTO `manipuladores` VALUES (54, 'Akohu', 'Tora Ohewisuzusalu', '10742015B', NULL, NULL, 0, NULL, NULL, 0, 9, 8, NULL);
INSERT INTO `manipuladores` VALUES (55, 'Akoredoz', 'Ohewa Avomojiput', '57641203S', NULL, NULL, 6, NULL, NULL, 2, 9, 4, NULL);
INSERT INTO `manipuladores` VALUES (56, 'Humeveme', 'Esicibe Yaxecuf', '28039179N', NULL, NULL, 2, NULL, NULL, 3, 1, 0, NULL);
INSERT INTO `manipuladores` VALUES (57, 'Ifur', 'Poru Akiguloc', '62313458N', NULL, NULL, 3, NULL, NULL, 1, 1, 5, NULL);
INSERT INTO `manipuladores` VALUES (58, 'Ipunagemap', 'Nanaza Kajefe', '76394533L', NULL, NULL, 6, NULL, NULL, 2, 2, 5, NULL);
INSERT INTO `manipuladores` VALUES (59, 'Makoviwof', 'Ijahij Lowuciwihisimo', '68673835C', NULL, NULL, 2, NULL, NULL, 4, 8, 5, NULL);
INSERT INTO `manipuladores` VALUES (60, 'Obokudor', 'Naho Edopacexew', '13804469G', NULL, NULL, 1, NULL, NULL, 3, 2, 7, NULL);
INSERT INTO `manipuladores` VALUES (61, 'Huzi', 'Linakotahi Cakojuva', '92323327R', NULL, NULL, 7, NULL, NULL, 3, 9, 2, NULL);
INSERT INTO `manipuladores` VALUES (62, 'Obufenuxo', 'Idalinimefi Yet', '11868752O', NULL, NULL, 7, NULL, NULL, 6, 7, 2, NULL);
INSERT INTO `manipuladores` VALUES (63, 'Wocokag', 'Cisazirunoloxa Vusamoperedome', '31706564Y', NULL, NULL, 4, NULL, NULL, 9, 7, 8, NULL);
INSERT INTO `manipuladores` VALUES (64, 'Ufexa', 'Ikubizilo Ihalefodifad', '24038882Q', NULL, NULL, 4, NULL, NULL, 3, 9, 1, NULL);
INSERT INTO `manipuladores` VALUES (65, 'Tizi', 'Sidipefuju Dikotu', '90379774V', NULL, NULL, 7, NULL, NULL, 0, 8, 5, NULL);
INSERT INTO `manipuladores` VALUES (66, 'Asaxid', 'Yedolediji Moragowukiya', '31008972J', NULL, NULL, 1, NULL, NULL, 1, 9, 6, NULL);
INSERT INTO `manipuladores` VALUES (67, 'Adux', 'Iyikobojaw Ijasi', '29205236X', NULL, NULL, 4, NULL, NULL, 3, 0, 3, NULL);
INSERT INTO `manipuladores` VALUES (68, 'Disu', 'Isocato Uda', '64633323X', NULL, NULL, 7, NULL, NULL, 1, 2, 4, NULL);
INSERT INTO `manipuladores` VALUES (69, 'Ovuzibefoy', 'Atepedagikorad Mofucodiyimit', '65653389N', NULL, NULL, 0, NULL, NULL, 6, 9, 2, NULL);
INSERT INTO `manipuladores` VALUES (70, 'Ehacavo', 'Ivoro Adimeyocuveyu', '96092881T', NULL, NULL, 6, NULL, NULL, 3, 0, 2, NULL);
INSERT INTO `manipuladores` VALUES (71, 'Tutoxizan', 'Deyaca Bucumipaji', '82110970W', NULL, NULL, 5, NULL, NULL, 7, 0, 5, NULL);
INSERT INTO `manipuladores` VALUES (72, 'Zufawa', 'Ewe Jugihucayipibu', '29778086A', NULL, NULL, 6, NULL, NULL, 4, 3, 7, NULL);
INSERT INTO `manipuladores` VALUES (73, 'Fejuzuvofu', 'Ijecen Inipiw', '37939936V', NULL, NULL, 2, NULL, NULL, 4, 5, 4, NULL);
INSERT INTO `manipuladores` VALUES (74, 'Owiwusugo', 'Ocigomaxaxihuv Ecixihubije', '84704256T', NULL, NULL, 2, NULL, NULL, 0, 1, 8, NULL);
INSERT INTO `manipuladores` VALUES (75, 'Hixozu', 'Xuxodiroj Tidewede', '47715461Q', NULL, NULL, 4, NULL, NULL, 0, 1, 6, NULL);
INSERT INTO `manipuladores` VALUES (76, 'Icutaxob', 'Esiz Rorij', '70683591U', NULL, NULL, 6, NULL, NULL, 3, 5, 3, NULL);
INSERT INTO `manipuladores` VALUES (77, 'Uziligicab', 'Exudutumu Uno', '49944919P', NULL, NULL, 5, NULL, NULL, 2, 8, 0, NULL);
INSERT INTO `manipuladores` VALUES (78, 'Zepiyi', 'Ohakisihoj Egusocu', '42946744Y', NULL, NULL, 6, NULL, NULL, 5, 9, 9, NULL);
INSERT INTO `manipuladores` VALUES (79, 'Ufuwak', 'Oyemori Upenimugorugob', '12313689G', NULL, NULL, 7, NULL, NULL, 4, 9, 0, NULL);
INSERT INTO `manipuladores` VALUES (80, 'Agutoyi', 'Tuzeterino Futijakibusixo', '18021493P', NULL, NULL, 6, NULL, NULL, 8, 3, 0, NULL);
INSERT INTO `manipuladores` VALUES (81, 'Xujifuxozo', 'Lox Roludopopelew', '35921025C', NULL, NULL, 4, NULL, NULL, 7, 3, 3, NULL);
INSERT INTO `manipuladores` VALUES (82, 'Ecex', 'Ekiyibunez Duxubepesijofu', '11020247C', NULL, NULL, 7, NULL, NULL, 9, 1, 6, NULL);
INSERT INTO `manipuladores` VALUES (83, 'Imicuzil', 'Ega Ozedapoxucay', '61772033J', NULL, NULL, 4, NULL, NULL, 4, 0, 1, NULL);
INSERT INTO `manipuladores` VALUES (84, 'Adinomuwu', 'Uhugitocare Acagihev', '84875677R', NULL, NULL, 4, NULL, NULL, 8, 3, 6, NULL);
INSERT INTO `manipuladores` VALUES (85, 'Kegub', 'Ohofolov Labehelagutew', '91590420L', NULL, NULL, 6, NULL, NULL, 2, 2, 6, NULL);
INSERT INTO `manipuladores` VALUES (86, 'Ured', 'Daxezutinixuza Zuriwor', '42988432O', NULL, NULL, 0, NULL, NULL, 4, 3, 5, NULL);
INSERT INTO `manipuladores` VALUES (87, 'Amafuk', 'Sukubatiyo Vinunex', '17273287E', NULL, NULL, 5, NULL, NULL, 2, 1, 3, NULL);
INSERT INTO `manipuladores` VALUES (88, 'Ofebirafe', 'Imuripayeyajof Kizugoyij', '11012918I', NULL, NULL, 2, NULL, NULL, 6, 0, 1, NULL);
INSERT INTO `manipuladores` VALUES (89, 'Wukevih', 'Ubuzobizibumu Obamureb', '79912643W', NULL, NULL, 7, NULL, NULL, 4, 6, 0, NULL);
INSERT INTO `manipuladores` VALUES (90, 'Luzevane', 'Ofe Ixutuw', '26961023O', NULL, NULL, 3, NULL, NULL, 3, 2, 3, NULL);
INSERT INTO `manipuladores` VALUES (91, 'Igale', 'Suyab Lelipoxuy', '48405813Y', NULL, NULL, 7, NULL, NULL, 6, 3, 9, NULL);
INSERT INTO `manipuladores` VALUES (92, 'Lijugu', 'Zuxak Usu', '36614333I', NULL, NULL, 4, NULL, NULL, 6, 9, 4, NULL);
INSERT INTO `manipuladores` VALUES (93, 'Otefes', 'Cecasukeyigu Ugap', '77239739E', NULL, NULL, 0, NULL, NULL, 8, 0, 4, NULL);
INSERT INTO `manipuladores` VALUES (94, 'Ilosofugo', 'Matuh Tucutecetug', '69352003I', NULL, NULL, 2, NULL, NULL, 8, 8, 5, NULL);
INSERT INTO `manipuladores` VALUES (95, 'Hapove', 'Sepocuhej Ime', '38995973K', NULL, NULL, 2, NULL, NULL, 3, 6, 0, NULL);
INSERT INTO `manipuladores` VALUES (96, 'Ijigahiy', 'Ajuyajumulut Ijohomu', '42925185R', NULL, NULL, 0, NULL, NULL, 0, 2, 1, NULL);
INSERT INTO `manipuladores` VALUES (97, 'Abon', 'Atagucib Icek', '58630272U', NULL, NULL, 7, NULL, NULL, 6, 4, 4, NULL);
INSERT INTO `manipuladores` VALUES (98, 'Meyusevo', 'Oxupovobupo Ukomozacohizul', '82924208Z', NULL, NULL, 0, NULL, NULL, 5, 9, 9, NULL);
INSERT INTO `manipuladores` VALUES (99, 'Ufagezuzig', 'Ufujawi Esitohocex', '49730163S', NULL, NULL, 5, NULL, NULL, 6, 6, 0, NULL);
INSERT INTO `manipuladores` VALUES (100, 'Varatix', 'Imulecurizo Wonoyisox', '64307790L', NULL, NULL, 0, NULL, NULL, 7, 0, 4, NULL);
INSERT INTO `manipuladores` VALUES (101, 'Yagowam', 'Cohusoyajax Oranak', '63366475N', NULL, NULL, 7, NULL, NULL, 3, 6, 8, NULL);
INSERT INTO `manipuladores` VALUES (102, 'Ayemikimom', 'Vubalu Jehasazay', '20437223K', NULL, NULL, 7, NULL, NULL, 7, 1, 4, NULL);
INSERT INTO `manipuladores` VALUES (103, 'Goxu', 'Golomedimore Xipopewuv', '42703055I', NULL, NULL, 1, NULL, NULL, 2, 8, 1, NULL);
INSERT INTO `manipuladores` VALUES (104, 'Ayeg', 'Moxuhegaca Vajusaterosez', '52155047G', NULL, NULL, 1, NULL, NULL, 3, 3, 5, NULL);
INSERT INTO `manipuladores` VALUES (105, 'Ozewo', 'Esihalux Lugawugi', '69787637V', NULL, NULL, 0, NULL, NULL, 3, 0, 6, NULL);
INSERT INTO `manipuladores` VALUES (106, 'Bofunamiza', 'Fubuluzurukod Voseroyip', '11430820N', NULL, NULL, 7, NULL, NULL, 5, 5, 8, NULL);
INSERT INTO `manipuladores` VALUES (107, 'Zuwicucubo', 'Owucazatam Ohomur', '93846029N', NULL, NULL, 6, NULL, NULL, 2, 1, 4, NULL);
INSERT INTO `manipuladores` VALUES (108, 'Exal', 'Iresa Nojovit', '43924802Y', NULL, NULL, 0, NULL, NULL, 5, 2, 1, NULL);
INSERT INTO `manipuladores` VALUES (109, 'Oximanur', 'Alijidetufak Ado', '49332889Y', NULL, NULL, 3, NULL, NULL, 0, 0, 4, NULL);
INSERT INTO `manipuladores` VALUES (110, 'Omiga', 'Ilu Awusasizuluhev', '70073909O', NULL, NULL, 4, NULL, NULL, 5, 4, 3, NULL);
INSERT INTO `manipuladores` VALUES (111, 'Usebepo', 'Wuhusar Ezemigokayatuz', '22280195G', NULL, NULL, 0, NULL, NULL, 2, 5, 8, NULL);
INSERT INTO `manipuladores` VALUES (112, 'Viwatel', 'Xagaguvaz Igipopezod', '17846037H', NULL, NULL, 7, NULL, NULL, 3, 4, 6, NULL);
INSERT INTO `manipuladores` VALUES (113, 'Suzaduka', 'Opehavopotul Ibogecigi', '85860557Y', NULL, NULL, 0, NULL, NULL, 3, 4, 1, NULL);
INSERT INTO `manipuladores` VALUES (114, 'Uyumibe', 'Ovuri Tonimabub', '98099442E', NULL, NULL, 4, NULL, NULL, 1, 5, 4, NULL);
INSERT INTO `manipuladores` VALUES (115, 'Acepera', 'Kudocucoxapo Abenobuco', '94103704H', NULL, NULL, 7, NULL, NULL, 5, 6, 3, NULL);
INSERT INTO `manipuladores` VALUES (116, 'Fosibucesa', 'Axabof Losexokoyi', '57113535L', NULL, NULL, 1, NULL, NULL, 0, 6, 1, NULL);
INSERT INTO `manipuladores` VALUES (117, 'Cajiwozo', 'Zejodavav Wumitikiyumofa', '38697719L', NULL, NULL, 3, NULL, NULL, 8, 9, 2, NULL);
INSERT INTO `manipuladores` VALUES (118, 'Dofemiy', 'Nupemibayanev Epuya', '26791755M', NULL, NULL, 5, NULL, NULL, 8, 3, 5, NULL);
INSERT INTO `manipuladores` VALUES (119, 'Hexoniy', 'Ragano Afubosozevowi', '54515338A', NULL, NULL, 6, NULL, NULL, 1, 3, 4, NULL);
INSERT INTO `manipuladores` VALUES (120, 'Kusotab', 'Utozenohu Voxicijobat', '81530339K', NULL, NULL, 1, NULL, NULL, 6, 6, 9, NULL);
INSERT INTO `manipuladores` VALUES (121, 'Fuyovaj', 'Dalo Fuvomutoz', '76274493R', NULL, NULL, 4, NULL, NULL, 4, 8, 7, NULL);
INSERT INTO `manipuladores` VALUES (122, 'Umafoxox', 'Afukoduke Cigu', '14836391O', NULL, NULL, 2, NULL, NULL, 0, 2, 9, NULL);
INSERT INTO `manipuladores` VALUES (123, 'Kotino', 'Kuhuzi Yewahimatic', '82932537T', NULL, NULL, 5, NULL, NULL, 8, 0, 4, NULL);
INSERT INTO `manipuladores` VALUES (124, 'Sofu', 'Hinepab Idir', '77208180Y', NULL, NULL, 2, NULL, NULL, 3, 2, 6, NULL);

-- ----------------------------
-- Table structure for naves
-- ----------------------------
DROP TABLE IF EXISTS `naves`;
CREATE TABLE `naves`  (
  `idnave` int(11) NOT NULL AUTO_INCREMENT,
  `designacion` varchar(45) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`idnave`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 14 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of naves
-- ----------------------------
INSERT INTO `naves` VALUES (1, 'test');
INSERT INTO `naves` VALUES (2, 'Nave 2');
INSERT INTO `naves` VALUES (3, 'Garage');
INSERT INTO `naves` VALUES (4, 'Criadero');
INSERT INTO `naves` VALUES (9, 'Oficinas');
INSERT INTO `naves` VALUES (10, 'Nave 1');
INSERT INTO `naves` VALUES (13, 't');

-- ----------------------------
-- Table structure for puestos
-- ----------------------------
DROP TABLE IF EXISTS `puestos`;
CREATE TABLE `puestos`  (
  `idpuestos` int(11) NOT NULL AUTO_INCREMENT,
  `esta_asignado` tinyint(4) NOT NULL,
  `idlinea` int(11) NOT NULL,
  `numero` int(11) NOT NULL,
  PRIMARY KEY (`idpuestos`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Table structure for registro_manipuladores
-- ----------------------------
DROP TABLE IF EXISTS `registro_manipuladores`;
CREATE TABLE `registro_manipuladores`  (
  `idregistro_manipulador` int(11) NOT NULL AUTO_INCREMENT,
  `idmanipulador` int(11) NOT NULL,
  `idpuesto` varchar(50) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `idturno` int(11) NOT NULL,
  `fecha` date NULL DEFAULT NULL,
  `hora_inicio` time(0) NULL DEFAULT NULL,
  `hora_fin` time(0) NULL DEFAULT NULL,
  `idlinea` int(11) NOT NULL,
  PRIMARY KEY (`idregistro_manipulador`) USING BTREE,
  INDEX `registroManipuladores_idmanipulador_fk_idx`(`idmanipulador`) USING BTREE,
  INDEX `registroManipuladores_idturno_fk_idx`(`idturno`) USING BTREE,
  INDEX `registroManipuladores_idlinea_fk_idx`(`idlinea`) USING BTREE,
  CONSTRAINT `registroManipuladores_idlinea_fk` FOREIGN KEY (`idlinea`) REFERENCES `lineas` (`idlinea`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `registroManipuladores_idmanipulador_fk` FOREIGN KEY (`idmanipulador`) REFERENCES `manipuladores` (`idmanipulador`) ON DELETE NO ACTION ON UPDATE CASCADE,
  CONSTRAINT `registroManipuladores_idturno_fk` FOREIGN KEY (`idturno`) REFERENCES `turnos` (`idturno`) ON DELETE NO ACTION ON UPDATE CASCADE
) ENGINE = InnoDB AUTO_INCREMENT = 11 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of registro_manipuladores
-- ----------------------------
INSERT INTO `registro_manipuladores` VALUES (1, 1, '2', 8, '2018-10-17', '03:00:00', '04:00:00', 11);
INSERT INTO `registro_manipuladores` VALUES (2, 2, '2', 5, '2018-10-17', '15:11:00', '13:11:00', 3);
INSERT INTO `registro_manipuladores` VALUES (3, 4, '4', 6, '2018-10-22', '07:00:00', '09:00:00', 9);
INSERT INTO `registro_manipuladores` VALUES (4, 4, '3', 6, '2018-10-22', '09:00:00', '13:30:00', 9);
INSERT INTO `registro_manipuladores` VALUES (5, 4, '3', 6, '2018-10-22', '13:30:00', '14:30:00', 3);
INSERT INTO `registro_manipuladores` VALUES (10, 4, NULL, 6, '2018-10-22', '14:30:00', '17:00:00', 3);

-- ----------------------------
-- Table structure for reparto
-- ----------------------------
DROP TABLE IF EXISTS `reparto`;
CREATE TABLE `reparto`  (
  `idmanipulador` int(11) NOT NULL,
  `nombre` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `apellidos` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `dias_seguidos_trabajados` tinyint(1) NULL DEFAULT 0,
  `fiabilidad` int(11) NULL DEFAULT NULL,
  `velocidad` int(11) NULL DEFAULT 0,
  `disponibilidad` int(11) NULL DEFAULT 0,
  PRIMARY KEY (`idmanipulador`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of reparto
-- ----------------------------
INSERT INTO `reparto` VALUES (40, 'Ugeloriv', 'Yibewi Suxepofufuze', 4, 4, 6, 5);
INSERT INTO `reparto` VALUES (55, 'Akoredoz', 'Ohewa Avomojiput', 6, 2, 9, 4);
INSERT INTO `reparto` VALUES (59, 'Makoviwof', 'Ijahij Lowuciwihisimo', 2, 4, 8, 5);
INSERT INTO `reparto` VALUES (63, 'Wocokag', 'Cisazirunoloxa Vusamoperedome', 4, 9, 7, 8);
INSERT INTO `reparto` VALUES (73, 'Fejuzuvofu', 'Ijecen Inipiw', 2, 4, 5, 4);
INSERT INTO `reparto` VALUES (78, 'Zepiyi', 'Ohakisihoj Egusocu', 6, 5, 9, 9);
INSERT INTO `reparto` VALUES (91, 'Igale', 'Suyab Lelipoxuy', 7, 6, 3, 9);
INSERT INTO `reparto` VALUES (92, 'Lijugu', 'Zuxak Usu', 4, 6, 9, 4);
INSERT INTO `reparto` VALUES (94, 'Ilosofugo', 'Matuh Tucutecetug', 2, 8, 8, 5);
INSERT INTO `reparto` VALUES (97, 'Abon', 'Atagucib Icek', 7, 6, 4, 4);
INSERT INTO `reparto` VALUES (98, 'Meyusevo', 'Oxupovobupo Ukomozacohizul', 0, 5, 9, 9);
INSERT INTO `reparto` VALUES (101, 'Yagowam', 'Cohusoyajax Oranak', 7, 3, 6, 8);
INSERT INTO `reparto` VALUES (104, 'Ayeg', 'Moxuhegaca Vajusaterosez', 1, 3, 3, 5);
INSERT INTO `reparto` VALUES (106, 'Bofunamiza', 'Fubuluzurukod Voseroyip', 7, 5, 5, 8);
INSERT INTO `reparto` VALUES (111, 'Usebepo', 'Wuhusar Ezemigokayatuz', 0, 2, 5, 8);
INSERT INTO `reparto` VALUES (112, 'Viwatel', 'Xagaguvaz Igipopezod', 7, 3, 4, 6);
INSERT INTO `reparto` VALUES (118, 'Dofemiy', 'Nupemibayanev Epuya', 5, 8, 3, 5);
INSERT INTO `reparto` VALUES (120, 'Kusotab', 'Utozenohu Voxicijobat', 1, 6, 6, 9);
INSERT INTO `reparto` VALUES (121, 'Fuyovaj', 'Dalo Fuvomutoz', 4, 4, 8, 7);

-- ----------------------------
-- Table structure for tipo_linea
-- ----------------------------
DROP TABLE IF EXISTS `tipo_linea`;
CREATE TABLE `tipo_linea`  (
  `idtipolinea` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  PRIMARY KEY (`idtipolinea`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 10 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of tipo_linea
-- ----------------------------
INSERT INTO `tipo_linea` VALUES (1, 'FlowPack');
INSERT INTO `tipo_linea` VALUES (2, 'Solo Pesado');
INSERT INTO `tipo_linea` VALUES (3, 'Pesado y Tapado');
INSERT INTO `tipo_linea` VALUES (7, 'Pesado, Tapado y Careado');
INSERT INTO `tipo_linea` VALUES (8, 'Solo Tapado');
INSERT INTO `tipo_linea` VALUES (9, 'Solo Careado');

-- ----------------------------
-- Table structure for turnos
-- ----------------------------
DROP TABLE IF EXISTS `turnos`;
CREATE TABLE `turnos`  (
  `idturno` int(11) NOT NULL AUTO_INCREMENT,
  `franja` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `hora_inicio` time(0) NULL DEFAULT NULL,
  `hora_fin` time(0) NULL DEFAULT NULL,
  PRIMARY KEY (`idturno`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 11 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of turnos
-- ----------------------------
INSERT INTO `turnos` VALUES (4, 'Turno de Dia', '08:00:00', '14:30:00');
INSERT INTO `turnos` VALUES (5, 'Turno de Tarde', '14:30:00', '21:00:00');
INSERT INTO `turnos` VALUES (6, 'Turno de Noche', '21:00:00', '03:30:00');
INSERT INTO `turnos` VALUES (8, 'asdñfloaidsfj', '14:30:00', '14:30:00');
INSERT INTO `turnos` VALUES (9, 'prueba', '09:50:00', '09:50:00');
INSERT INTO `turnos` VALUES (10, 'Turno de día', '08:00:00', '14:30:00');

SET FOREIGN_KEY_CHECKS = 1;
