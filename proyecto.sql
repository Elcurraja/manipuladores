/*
 Navicat Premium Data Transfer

 Source Server         : local mysql
 Source Server Type    : MySQL
 Source Server Version : 100135
 Source Host           : localhost:3306
 Source Schema         : proyecto

 Target Server Type    : MySQL
 Target Server Version : 100135
 File Encoding         : 65001

 Date: 24/10/2018 14:05:32
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for clientes
-- ----------------------------
DROP TABLE IF EXISTS `clientes`;
CREATE TABLE `clientes`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `denominacionSocial` varchar(255) CHARACTER SET utf8 COLLATE utf8_spanish_ci NULL DEFAULT NULL,
  `nombre` varchar(255) CHARACTER SET utf8 COLLATE utf8_spanish_ci NULL DEFAULT NULL,
  `apellidos` varchar(255) CHARACTER SET utf8 COLLATE utf8_spanish_ci NULL DEFAULT NULL,
  `direccion` varchar(255) CHARACTER SET utf8 COLLATE utf8_spanish_ci NULL DEFAULT NULL,
  `telefono` int(9) NULL DEFAULT NULL,
  `poblacion` varchar(255) CHARACTER SET utf8 COLLATE utf8_spanish_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 5 CHARACTER SET = utf8 COLLATE = utf8_spanish_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of clientes
-- ----------------------------
INSERT INTO `clientes` VALUES (1, 'Energy S.L', 'julio', 'gomez', 'Alameda,12', 123456789, 'Huelva');
INSERT INTO `clientes` VALUES (2, 'El marinero', 'Andres', 'martin', 'avenida del oceano,10', 123123123, 'Huelva');
INSERT INTO `clientes` VALUES (3, 'come y calla', 'Paco', 'gutierrez', 'torre,4', 789789789, 'Huelva');
INSERT INTO `clientes` VALUES (4, 'Ledin', 'Marta', 'palma', 'virgen clara,2', 852852852, 'Punta umbria');

-- ----------------------------
-- Table structure for empleados
-- ----------------------------
DROP TABLE IF EXISTS `empleados`;
CREATE TABLE `empleados`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(255) CHARACTER SET utf8 COLLATE utf8_spanish_ci NULL DEFAULT NULL,
  `apellidos` varchar(255) CHARACTER SET utf8 COLLATE utf8_spanish_ci NULL DEFAULT NULL,
  `dni` varchar(9) CHARACTER SET utf8 COLLATE utf8_spanish_ci NULL DEFAULT NULL,
  `fecha_nacimiento` date NULL DEFAULT NULL,
  `fecha_contratacion` date NULL DEFAULT NULL,
  `fecha_fin_contrato` date NULL DEFAULT NULL,
  `puesto` varchar(255) CHARACTER SET utf8 COLLATE utf8_spanish_ci NULL DEFAULT NULL,
  `telefono` int(10) NULL DEFAULT NULL,
  `direccion` varchar(255) CHARACTER SET utf8 COLLATE utf8_spanish_ci NULL DEFAULT NULL,
  `poblacion` varchar(255) CHARACTER SET utf8 COLLATE utf8_spanish_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8 COLLATE = utf8_spanish_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of empleados
-- ----------------------------
INSERT INTO `empleados` VALUES (1, 'julio', 'gomez palma', '48945574x', '1992-06-20', '2018-10-03', '2019-10-03', 'ceo', 625617932, 'Almendro 15', 'San Bartolome');
INSERT INTO `empleados` VALUES (2, 'antonio', 'angulo', '96321458a', '1990-08-14', '2018-08-08', '2019-06-12', 'repartidor', 666778899, 'Arboleda 1', 'San juan');
INSERT INTO `empleados` VALUES (3, 'maria', 'diaz', '741258963', '1993-12-12', '2018-10-19', '2018-12-22', 'administrativa', 951753654, 'camilo 38', 'Punta umbria');

-- ----------------------------
-- Table structure for historico_almacen
-- ----------------------------
DROP TABLE IF EXISTS `historico_almacen`;
CREATE TABLE `historico_almacen`  (
  `id_historico` int(11) NOT NULL,
  `id_item` int(11) NULL DEFAULT NULL,
  `fecha` timestamp(6) NULL DEFAULT NULL,
  `entrada` tinyint(45) NULL DEFAULT NULL,
  `salida` tinyint(45) NULL DEFAULT NULL,
  PRIMARY KEY (`id_historico`) USING BTREE,
  INDEX `id_item`(`id_item`) USING BTREE,
  CONSTRAINT `historico_almacen_ibfk_1` FOREIGN KEY (`id_item`) REFERENCES `productos` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_spanish_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Table structure for pedidos_clientes
-- ----------------------------
DROP TABLE IF EXISTS `pedidos_clientes`;
CREATE TABLE `pedidos_clientes`  (
  `id_pedido` int(11) NOT NULL AUTO_INCREMENT,
  `id_cliente` int(11) NULL DEFAULT NULL,
  `observaciones` varchar(255) CHARACTER SET utf8 COLLATE utf8_spanish_ci NULL DEFAULT '',
  `fecha` timestamp(6) NULL DEFAULT NULL,
  PRIMARY KEY (`id_pedido`) USING BTREE,
  INDEX `id_cliente`(`id_cliente`) USING BTREE,
  CONSTRAINT `pedidos_clientes_ibfk_1` FOREIGN KEY (`id_cliente`) REFERENCES `clientes` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 5 CHARACTER SET = utf8 COLLATE = utf8_spanish_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of pedidos_clientes
-- ----------------------------
INSERT INTO `pedidos_clientes` VALUES (1, 1, 'Ninguna', '2018-10-05 09:45:27.000000');
INSERT INTO `pedidos_clientes` VALUES (2, 1, 'Tarde', '2018-10-05 09:45:33.000000');
INSERT INTO `pedidos_clientes` VALUES (3, 2, '', '2018-10-12 11:18:12.000000');
INSERT INTO `pedidos_clientes` VALUES (4, 3, '', '2018-10-06 11:19:43.000000');

-- ----------------------------
-- Table structure for pedidos_clientes_det
-- ----------------------------
DROP TABLE IF EXISTS `pedidos_clientes_det`;
CREATE TABLE `pedidos_clientes_det`  (
  `id_detPedido` int(255) NOT NULL,
  `id_pedido` int(255) NULL DEFAULT NULL,
  `id_item` int(255) NULL DEFAULT NULL,
  `cantidad` int(255) NULL DEFAULT NULL,
  `precio` int(255) NULL DEFAULT NULL,
  PRIMARY KEY (`id_detPedido`) USING BTREE,
  INDEX `id_pedido`(`id_pedido`) USING BTREE,
  INDEX `id_item`(`id_item`) USING BTREE,
  CONSTRAINT `pedidos_clientes_det_ibfk_1` FOREIGN KEY (`id_pedido`) REFERENCES `pedidos_clientes` (`id_pedido`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `pedidos_clientes_det_ibfk_2` FOREIGN KEY (`id_item`) REFERENCES `productos` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_spanish_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of pedidos_clientes_det
-- ----------------------------
INSERT INTO `pedidos_clientes_det` VALUES (0, 1, 2, 5, NULL);

-- ----------------------------
-- Table structure for pedidos_proveedores
-- ----------------------------
DROP TABLE IF EXISTS `pedidos_proveedores`;
CREATE TABLE `pedidos_proveedores`  (
  `id_pedido` int(11) NOT NULL,
  `id_proveedores` int(11) NOT NULL,
  `id_item` int(11) NULL DEFAULT NULL,
  `cantidad` varchar(45) CHARACTER SET utf8 COLLATE utf8_spanish_ci NULL DEFAULT NULL,
  `fecha` timestamp(6) NULL DEFAULT NULL,
  PRIMARY KEY (`id_pedido`) USING BTREE,
  INDEX `id_proveedores`(`id_proveedores`) USING BTREE,
  CONSTRAINT `pedidos_proveedores_ibfk_1` FOREIGN KEY (`id_proveedores`) REFERENCES `proveedores` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_spanish_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Table structure for pedidos_proveedores_det
-- ----------------------------
DROP TABLE IF EXISTS `pedidos_proveedores_det`;
CREATE TABLE `pedidos_proveedores_det`  (
  `id_detPedido` int(255) NOT NULL,
  `id_pedido` int(255) NULL DEFAULT NULL,
  `id_item` int(255) NULL DEFAULT NULL,
  `cantidad` int(255) NULL DEFAULT NULL,
  `precio` int(255) NULL DEFAULT NULL,
  PRIMARY KEY (`id_detPedido`) USING BTREE,
  INDEX `id_pedido`(`id_pedido`) USING BTREE,
  INDEX `id_item`(`id_item`) USING BTREE,
  CONSTRAINT `pedidos_proveedores_det_ibfk_1` FOREIGN KEY (`id_pedido`) REFERENCES `pedidos_proveedores` (`id_pedido`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `pedidos_proveedores_det_ibfk_2` FOREIGN KEY (`id_item`) REFERENCES `productos` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_spanish_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Table structure for productos
-- ----------------------------
DROP TABLE IF EXISTS `productos`;
CREATE TABLE `productos`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(55) CHARACTER SET utf8 COLLATE utf8_spanish_ci NULL DEFAULT NULL,
  `cantidad` int(10) NULL DEFAULT NULL,
  `descripcion` varchar(255) CHARACTER SET utf8 COLLATE utf8_spanish_ci NULL DEFAULT NULL,
  `precio` int(255) NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 6 CHARACTER SET = utf8 COLLATE = utf8_spanish_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of productos
-- ----------------------------
INSERT INTO `productos` VALUES (1, 'cafe', 5, '', 20);
INSERT INTO `productos` VALUES (2, 'azucar', 50, NULL, 10);
INSERT INTO `productos` VALUES (3, 'te', 20, NULL, 15);
INSERT INTO `productos` VALUES (4, 'cola co', 65, 'original', 15);
INSERT INTO `productos` VALUES (5, 'donuts', 40, 'glaseados', 23);

-- ----------------------------
-- Table structure for proveedores
-- ----------------------------
DROP TABLE IF EXISTS `proveedores`;
CREATE TABLE `proveedores`  (
  `id` int(11) NOT NULL,
  `denominacion social` varchar(55) CHARACTER SET utf8 COLLATE utf8_spanish_ci NULL DEFAULT NULL,
  `nombre` varchar(55) CHARACTER SET utf8 COLLATE utf8_spanish_ci NULL DEFAULT NULL,
  `direccion` varchar(55) CHARACTER SET utf8 COLLATE utf8_spanish_ci NULL DEFAULT NULL,
  `telefono` int(11) NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_spanish_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Table structure for usuarios
-- ----------------------------
DROP TABLE IF EXISTS `usuarios`;
CREATE TABLE `usuarios`  (
  `id` int(11) NOT NULL,
  `user` varchar(255) CHARACTER SET utf8 COLLATE utf8_spanish_ci NULL DEFAULT NULL,
  `pass` varchar(255) CHARACTER SET utf8 COLLATE utf8_spanish_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8 COLLATE = utf8_spanish_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of usuarios
-- ----------------------------
INSERT INTO `usuarios` VALUES (0, 'admin', 'admin');

SET FOREIGN_KEY_CHECKS = 1;
