-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 25, 2024 at 05:36 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `soen287`
--

-- --------------------------------------------------------

--
-- Table structure for table `activeservices`
--

CREATE TABLE `activeservices` (
  `appointmentID` int(11) NOT NULL,
  `clientID` int(11) NOT NULL,
  `date` varchar(150) NOT NULL,
  `time` varchar(150) NOT NULL,
  `service` varchar(150) NOT NULL,
  `address` varchar(150) NOT NULL,
  `price` varchar(150) NOT NULL,
  `paid` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `activeservices`
--

INSERT INTO `activeservices` (`appointmentID`, `clientID`, `date`, `time`, `service`, `address`, `price`, `paid`) VALUES
(20, 17, '2021-06-15', '', 'Major interior cleaning', 'dcsdsc', '$60', 1);

-- --------------------------------------------------------

--
-- Table structure for table `businessinfo`
--

CREATE TABLE `businessinfo` (
  `ID` int(11) NOT NULL,
  `companyName` varchar(150) NOT NULL,
  `email` varchar(150) NOT NULL,
  `phoneNumber` varchar(150) NOT NULL,
  `location` varchar(150) NOT NULL,
  `companyDescription` varchar(1000) NOT NULL,
  `logo` varchar(150) NOT NULL,
  `password` varchar(150) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `businessprovidedservices`
--

CREATE TABLE `businessprovidedservices` (
  `serviceID` int(11) NOT NULL,
  `name` varchar(150) NOT NULL,
  `description` varchar(1000) NOT NULL,
  `price` varchar(150) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `businessprovidedservices`
--

INSERT INTO `businessprovidedservices` (`serviceID`, `name`, `description`, `price`) VALUES
(1, 'Regular interior cleaning', 'Get your time back by letting us take care of your weekly, biweekly, or monthly cleaning needs.', '$50'),
(2, 'Major interior cleaning', 'Revitalize your space with our renowned deep cleaning service.\r\n\r\n', '$60'),
(3, 'Exterior Cleaning', 'Deep cleaning to renew the exterior of all appliance types.', '$70'),
(5, 'Kitchen Cleaning', 'Imma clean yo kitchen', '$500');

-- --------------------------------------------------------

--
-- Table structure for table `clientinfo`
--

CREATE TABLE `clientinfo` (
  `clientID` int(11) NOT NULL,
  `firstName` varchar(150) NOT NULL,
  `lastName` varchar(150) NOT NULL,
  `email` varchar(150) NOT NULL,
  `password` varchar(150) NOT NULL,
  `address` varchar(150) NOT NULL,
  `phoneNumber` varchar(150) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `clientinfo`
--

INSERT INTO `clientinfo` (`clientID`, `firstName`, `lastName`, `email`, `password`, `address`, `phoneNumber`) VALUES
(17, 'Kakyoin', 'Noriaki', 'kakyoin123@gmail.com', 'wgsahdfagshd', 'in hell', '1234567890');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `activeservices`
--
ALTER TABLE `activeservices`
  ADD PRIMARY KEY (`appointmentID`);

--
-- Indexes for table `businessinfo`
--
ALTER TABLE `businessinfo`
  ADD PRIMARY KEY (`ID`);

--
-- Indexes for table `businessprovidedservices`
--
ALTER TABLE `businessprovidedservices`
  ADD PRIMARY KEY (`serviceID`);

--
-- Indexes for table `clientinfo`
--
ALTER TABLE `clientinfo`
  ADD PRIMARY KEY (`clientID`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `activeservices`
--
ALTER TABLE `activeservices`
  MODIFY `appointmentID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `businessinfo`
--
ALTER TABLE `businessinfo`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `businessprovidedservices`
--
ALTER TABLE `businessprovidedservices`
  MODIFY `serviceID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `clientinfo`
--
ALTER TABLE `clientinfo`
  MODIFY `clientID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
