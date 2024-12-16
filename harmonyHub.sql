-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 16-12-2024 a las 20:38:56
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `g8-elsublime`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `emparejamientos`
--

CREATE TABLE `emparejamientos` (
  `IdEmparejamientos` int(11) NOT NULL,
  `IdUsuario1` int(11) NOT NULL,
  `IdUsuario2` int(11) NOT NULL,
  `Compatibilidad` decimal(6,4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `gustos_musicales`
--

CREATE TABLE `gustos_musicales` (
  `idGustos` int(11) NOT NULL,
  `gustos_IdUsuario` int(11) NOT NULL,
  `Afinidad_Rock` decimal(2,0) NOT NULL,
  `Afinidad_Pop` decimal(2,0) NOT NULL,
  `Afinidad_Hip_Hop` decimal(2,0) NOT NULL,
  `Afinidad_Jazz` decimal(2,0) NOT NULL,
  `Afinidad_Blues` decimal(2,0) NOT NULL,
  `Afinidad_Reggae` decimal(2,0) NOT NULL,
  `Afinidad_Salsa` decimal(2,0) NOT NULL,
  `Afinidad_Country` decimal(2,0) NOT NULL,
  `Afinidad_Electronica` decimal(2,0) NOT NULL,
  `Afinidad_Funk` decimal(2,0) NOT NULL,
  `Afinidad_R_B` decimal(2,0) NOT NULL,
  `Afinidad_Metal` decimal(2,0) NOT NULL,
  `Afinidad_Clasica` decimal(2,0) NOT NULL,
  `Afinidad_Punk` decimal(2,0) NOT NULL,
  `Afinidad_Ska` decimal(2,0) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Volcado de datos para la tabla `gustos_musicales`
--

INSERT INTO `gustos_musicales` (`idGustos`, `gustos_IdUsuario`, `Afinidad_Rock`, `Afinidad_Pop`, `Afinidad_Hip_Hop`, `Afinidad_Jazz`, `Afinidad_Blues`, `Afinidad_Reggae`, `Afinidad_Salsa`, `Afinidad_Country`, `Afinidad_Electronica`, `Afinidad_Funk`, `Afinidad_R_B`, `Afinidad_Metal`, `Afinidad_Clasica`, `Afinidad_Punk`, `Afinidad_Ska`) VALUES
(18, 9, 0, 10, 8, 7, 7, 8, 9, 6, 8, 1, 8, 7, 0, 8, 8),
(19, 10, 0, 10, 8, 7, 7, 8, 9, 6, 8, 1, 8, 7, 0, 8, 8),
(20, 11, 1, 6, 6, 8, 5, 6, 8, 6, 9, 7, 7, 5, 2, 9, 7),
(21, 12, 2, 5, 8, 6, 8, 7, 9, 7, 10, 9, 8, 6, 1, 7, 6),
(22, 13, 3, 4, 7, 9, 6, 5, 8, 5, 8, 6, 7, 8, 2, 6, 9),
(23, 14, 0, 6, 6, 7, 9, 7, 8, 8, 7, 8, 8, 9, 3, 5, 7),
(24, 15, 2, 4, 7, 8, 4, 6, 9, 6, 9, 8, 7, 5, 0, 9, 6),
(25, 16, 1, 3, 8, 9, 7, 8, 7, 8, 6, 5, 9, 6, 4, 8, 8),
(26, 17, 2, 4, 6, 7, 8, 9, 8, 7, 9, 8, 6, 5, 2, 7, 5),
(27, 18, 3, 5, 9, 8, 5, 5, 9, 6, 7, 7, 7, 6, 1, 8, 7);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuario`
--

CREATE TABLE `usuario` (
  `IdUsuario` int(11) NOT NULL,
  `Nombre` varchar(45) NOT NULL,
  `Apellido` varchar(45) NOT NULL,
  `Correo` varchar(45) NOT NULL,
  `Contrasenia` varchar(45) NOT NULL,
  `Sexo` varchar(1) DEFAULT NULL,
  `FotoDePerfil` blob DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Volcado de datos para la tabla `usuario`
--

INSERT INTO `usuario` (`IdUsuario`, `Nombre`, `Apellido`, `Correo`, `Contrasenia`, `Sexo`, `FotoDePerfil`) VALUES
(9, 'Federico', 'Vega', 'vega@gmail.com', '1235', NULL, NULL),
(10, 'Vera', 'Scarafoni', 'vera@gmail.com', '1235', NULL, NULL),
(11, 'Martin', 'Perez', 'martin@gmail.com', '1235', NULL, NULL),
(12, 'Camila', 'Lopez', 'camila@gmail.com', '1235', NULL, NULL),
(13, 'Mateo', 'Diaz', 'mateo@gmail.com', '1235', NULL, NULL),
(14, 'Valentina', 'Rodriguez', 'valentina@gmail.com', '1235', NULL, NULL),
(15, 'Santiago', 'Fernandez', 'santiago@gmail.com', '1235', NULL, NULL),
(16, 'Sofia', 'Martinez', 'sofia@gmail.com', '1235', NULL, NULL),
(17, 'Joaquin', 'Torres', 'joaquin@gmail.com', '1235', NULL, NULL),
(18, 'Mia', 'Suarez', 'mia@gmail.com', '1235', NULL, NULL);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `emparejamientos`
--
ALTER TABLE `emparejamientos`
  ADD PRIMARY KEY (`IdEmparejamientos`);

--
-- Indices de la tabla `gustos_musicales`
--
ALTER TABLE `gustos_musicales`
  ADD PRIMARY KEY (`idGustos`),
  ADD KEY `fk_gustos_musicales_usuario_idx` (`gustos_IdUsuario`);

--
-- Indices de la tabla `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`IdUsuario`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `emparejamientos`
--
ALTER TABLE `emparejamientos`
  MODIFY `IdEmparejamientos` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `gustos_musicales`
--
ALTER TABLE `gustos_musicales`
  MODIFY `idGustos` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT de la tabla `usuario`
--
ALTER TABLE `usuario`
  MODIFY `IdUsuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `gustos_musicales`
--
ALTER TABLE `gustos_musicales`
  ADD CONSTRAINT `fk_gustos_musicales_usuario` FOREIGN KEY (`gustos_IdUsuario`) REFERENCES `usuario` (`IdUsuario`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
