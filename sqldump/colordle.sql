-- phpMyAdmin SQL Dump
-- version 4.8.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:4307
-- Generation Time: Jul 09, 2022 at 10:35 PM
-- Server version: 10.1.34-MariaDB
-- PHP Version: 7.2.8

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `colordle`
--

-- --------------------------------------------------------

--
-- Table structure for table `custom-themes`
--

CREATE TABLE `custom-themes` (
  `id` int(20) NOT NULL,
  `creatorId` varchar(20) NOT NULL,
  `themeName` varchar(45) NOT NULL,
  `gamebgcolor` varchar(30) NOT NULL,
  `navbarbgcolor` varchar(30) NOT NULL,
  `menubgcolor` varchar(30) NOT NULL,
  `hamburgeropenbgcolor` varchar(30) NOT NULL,
  `textcolor` varchar(30) NOT NULL,
  `keyboardtextcolor` varchar(30) NOT NULL,
  `boardtextcolor` varchar(30) NOT NULL,
  `keyboardletterbackground` varchar(30) NOT NULL,
  `letterselectedrowbgcolor` varchar(30) NOT NULL,
  `letterbgcolor` varchar(30) NOT NULL,
  `lettercolorglow` varchar(30) NOT NULL,
  `lettercorrectspotbgcolor` varchar(30) NOT NULL,
  `letterbginwordcolor` varchar(30) NOT NULL,
  `letternotinwordtextcolor` varchar(30) NOT NULL,
  `notindictionarybgcolor` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `custom-themes`
--

INSERT INTO `custom-themes` (`id`, `creatorId`, `themeName`, `gamebgcolor`, `navbarbgcolor`, `menubgcolor`, `hamburgeropenbgcolor`, `textcolor`, `keyboardtextcolor`, `boardtextcolor`, `keyboardletterbackground`, `letterselectedrowbgcolor`, `letterbgcolor`, `lettercolorglow`, `lettercorrectspotbgcolor`, `letterbginwordcolor`, `letternotinwordtextcolor`, `notindictionarybgcolor`) VALUES
(1, 'O0qBhy89nhrHIOJ', 'Custom-1', 'rgba(31,41,55,1)', 'rgba(17,24,39, 1)', 'rgba(40, 67, 79, 1)', 'rgba(107, 114, 128, 1)', 'rgba(255, 255, 255, 1)', 'rgba(255, 255, 255, 1)', 'rgba(255, 255, 255, 1)', 'rgba(107, 114, 128, 1)', 'rgba(107, 114, 128, 1)', 'rgba(17,24,39, 1)', 'rgba(24,78,99, 1)', 'rgba(83,141,78, 1)', 'rgba(181,159,59, 1)', 'rgba(171, 171, 171, 1)', 'rgba(225, 29, 72, 1)'),
(2, 'O0qBhy89nhrHIOJ', 'Custom-2', 'rgba(31,41,55,1)', 'rgba(17,24,39, 1)', 'rgba(40, 67, 79, 1)', 'rgba(107, 114, 128, 1)', 'rgba(255, 255, 255, 1)', 'rgba(255, 255, 255, 1)', 'rgba(255, 255, 255, 1)', 'rgba(107, 114, 128, 1)', 'rgba(107, 114, 128, 1)', 'rgba(17,24,39, 1)', 'rgba(24,78,99, 1)', 'rgba(83,141,78, 1)', 'rgba(181,159,59, 1)', 'rgba(171, 171, 171, 1)', 'rgba(225, 29, 72, 1)');

-- --------------------------------------------------------

--
-- Table structure for table `default-themes`
--

CREATE TABLE `default-themes` (
  `id` int(20) NOT NULL,
  `gamebgcolor` varchar(30) NOT NULL,
  `navbarbgcolor` varchar(30) NOT NULL,
  `menubgcolor` varchar(30) NOT NULL,
  `hamburgeropenbgcolor` varchar(30) NOT NULL,
  `textcolor` varchar(30) NOT NULL,
  `keyboardtextcolor` varchar(30) NOT NULL,
  `boardtextcolor` varchar(30) NOT NULL,
  `keyboardletterbackground` varchar(30) NOT NULL,
  `letterselectedrowbgcolor` varchar(30) NOT NULL,
  `letterbgcolor` varchar(30) NOT NULL,
  `lettercolorglow` varchar(30) NOT NULL,
  `lettercorrectspotbgcolor` varchar(30) NOT NULL,
  `letterbginwordcolor` varchar(30) NOT NULL,
  `letternotinwordtextcolor` varchar(30) NOT NULL,
  `notindictionarybgcolor` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(9) NOT NULL,
  `userName` varchar(40) NOT NULL DEFAULT 'User',
  `currentTheme` varchar(40) NOT NULL DEFAULT 'Slate (default)',
  `sessionId` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `userName`, `currentTheme`, `sessionId`) VALUES
(1, 'User', 'Slate (default)', 'O0qBhy89nhrHIOJ');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `custom-themes`
--
ALTER TABLE `custom-themes`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `default-themes`
--
ALTER TABLE `default-themes`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `custom-themes`
--
ALTER TABLE `custom-themes`
  MODIFY `id` int(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `default-themes`
--
ALTER TABLE `default-themes`
  MODIFY `id` int(20) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(9) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
