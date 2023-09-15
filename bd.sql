CREATE DATABASE IF NOT EXISTS `MYSQL` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;

USE `MYSQL`;

CREATE TABLE IF NOT EXISTS `usuarios` (
    `id` int(11) NOT NULL AUTO_INCREMENT,
    `name` varchar(255) NOT NULL,
    `apellido` varchar(255) NOT NULL,
    `usuario` varchar(255) NOT NULL,
    `password` varchar(255) NOT NULL,
    `correo` varchar(255) NOT NULL,
    PRIMARY KEY (`id`)
);
