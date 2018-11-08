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

 Date: 08/11/2018 14:10:28
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
) ENGINE = InnoDB AUTO_INCREMENT = 30 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Compact;

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
) ENGINE = InnoDB AUTO_INCREMENT = 17 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of descansos
-- ----------------------------
INSERT INTO `descansos` VALUES (4, 5, '2018-10-16', '2018-10-22', 'aaaaaa');
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
) ENGINE = InnoDB AUTO_INCREMENT = 14 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of lineas
-- ----------------------------
INSERT INTO `lineas` VALUES (2, 'linea 1', 2, 1, 1, 20, 1, 0, 0);
INSERT INTO `lineas` VALUES (3, 'linea 2', 3, 1, 1, 30, 0, 1, 0);
INSERT INTO `lineas` VALUES (4, 'linea 3', 1, 1, 1, 40, 0, 0, 1);
INSERT INTO `lineas` VALUES (9, 'linea 4', 4, 3, 0, 11, 1, 1, 0);
INSERT INTO `lineas` VALUES (11, 'linea 5', 9, 9, 1, 9, 0, 1, 1);

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
  `dias_seguidos_trabajados` tinyint(1) NULL DEFAULT 0,
  `email` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `tlf_familiar` varchar(20) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  `fiabilidad` int(11) NULL DEFAULT 0,
  `velocidad` int(11) NULL DEFAULT 0,
  `disponibilidad` int(11) NULL DEFAULT 0,
  `observaciones` varchar(200) CHARACTER SET utf8 COLLATE utf8_general_ci NULL DEFAULT NULL,
  PRIMARY KEY (`idmanipulador`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 31 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Compact;

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
INSERT INTO `manipuladores` VALUES (9, 'Carles', 'Baixdemont Casamajó', '54321234w', '987654123', 'adsadaddadsdsaqwe', 12, 'prueba@prueba.com', '951236478', 9, 3, 6, 'observaciones');
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
INSERT INTO `reparto` VALUES (1, 'Julio', 'Gomez Restrepo', 5, 5, 3, 1);
INSERT INTO `reparto` VALUES (2, 'Silvia', 'Gil Piñero', 7, 2, 3, 9);
INSERT INTO `reparto` VALUES (3, 'Tamara', 'Gonzalez Prieto', 12, 1, 5, 8);
INSERT INTO `reparto` VALUES (6, 'Antonio', 'Gines Copano', 15, 4, 7, 6);
INSERT INTO `reparto` VALUES (7, 'Rafaela', 'Carra Suarez', 9, 2, 8, 6);
INSERT INTO `reparto` VALUES (8, 'Pilar', 'Jimenez Guijarro', 7, 8, 5, 4);
INSERT INTO `reparto` VALUES (9, 'Carles', 'Baixdemont Casamajó', 12, 9, 3, 6);
INSERT INTO `reparto` VALUES (10, 'Poncio', 'Pilatos Bahamonte', 11, 6, 4, 5);
INSERT INTO `reparto` VALUES (13, 'Manuel', 'Antonio carrero', 14, 6, 5, 4);
INSERT INTO `reparto` VALUES (14, 'Andres', 'Antonio carrero', 14, 6, 5, 4);
INSERT INTO `reparto` VALUES (15, 'Jordi', 'Antonio carrero', 14, 6, 5, 4);
INSERT INTO `reparto` VALUES (16, 'Roberto', 'Antonio carrero', 14, 6, 5, 4);
INSERT INTO `reparto` VALUES (17, 'Pedro', 'Antonio carrero', 14, 6, 5, 4);
INSERT INTO `reparto` VALUES (18, 'Prueba', 'Antonio carrero', 14, 6, 5, 4);
INSERT INTO `reparto` VALUES (19, 'test', 'Antonio carrero', 14, 6, 5, 4);
INSERT INTO `reparto` VALUES (20, 'Carles', 'Antonio carrero', 14, 6, 5, 4);
INSERT INTO `reparto` VALUES (21, 'Rodrigo', 'Antonio carrero', 14, 6, 5, 4);
INSERT INTO `reparto` VALUES (22, 'pepe', 'Antonio carrero', 14, 6, 5, 4);
INSERT INTO `reparto` VALUES (23, 'Andreu', 'Antonio carrero', 14, 6, 5, 4);
INSERT INTO `reparto` VALUES (24, 'Maria', 'Antonio carrero', 14, 6, 5, 4);

-- ----------------------------
-- Table structure for tipo_linea
-- ----------------------------
DROP TABLE IF EXISTS `tipo_linea`;
CREATE TABLE `tipo_linea`  (
  `idtipolinea` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) CHARACTER SET utf8 COLLATE utf8_general_ci NOT NULL,
  PRIMARY KEY (`idtipolinea`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 13 CHARACTER SET = utf8 COLLATE = utf8_general_ci ROW_FORMAT = Compact;

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
