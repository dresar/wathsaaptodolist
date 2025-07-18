-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 18, 2025 at 08:13 AM
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
-- Database: `todolist`
--

-- --------------------------------------------------------

--
-- Table structure for table `activity_logs`
--

CREATE TABLE `activity_logs` (
  `id` int(11) UNSIGNED NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `activity` varchar(255) NOT NULL,
  `action` varchar(50) NOT NULL,
  `details` text DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `activity_logs`
--

INSERT INTO `activity_logs` (`id`, `user_id`, `activity`, `action`, `details`, `ip_address`, `user_agent`, `created_at`) VALUES
(1, 25, '', 'login', 'User login successful', '::1', 'axios/1.10.0', '2025-07-18 06:01:43');

-- --------------------------------------------------------

--
-- Table structure for table `admins`
--

CREATE TABLE `admins` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `name` varchar(100) NOT NULL,
  `profile_photo` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admins`
--

INSERT INTO `admins` (`id`, `username`, `email`, `password`, `name`, `profile_photo`, `created_at`, `updated_at`) VALUES
(1, 'admin', 'admin@gmail.com', '$2y$10$sjnskpQ10xjdabXAQY79q.8OFnY9ujZjdtSYxYRmuCqSTTC4L49Ke', 'admin', 'profile_1_1752766563.png', '2025-07-17 08:38:18', '2025-07-17 15:36:03');

-- --------------------------------------------------------

--
-- Table structure for table `admin_tokens`
--

CREATE TABLE `admin_tokens` (
  `id` int(11) NOT NULL,
  `admin_id` int(11) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `expires_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `categories`
--

CREATE TABLE `categories` (
  `id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `description` text DEFAULT NULL,
  `color` varchar(20) DEFAULT '#3498db',
  `user_id` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `categories`
--

INSERT INTO `categories` (`id`, `name`, `description`, `color`, `user_id`, `created_at`, `updated_at`) VALUES
(11, 'Global Test Category', 'Ini adalah kategori global', '#33FF57', NULL, '2025-07-17 12:09:39', '2025-07-17 12:09:39'),
(12, 'Umum', 'Kategori untuk tugas umum', '#3498db', NULL, '2025-07-17 15:57:19', '2025-07-17 15:57:19'),
(13, 'Penting', 'Kategori untuk tugas penting', '#e74c3c', NULL, '2025-07-17 15:57:19', '2025-07-17 15:57:19'),
(14, 'Akademik1', 'Kategori untuk tugas akademik', '#2ecc71', NULL, '2025-07-17 15:57:19', '2025-07-17 16:23:08'),
(23, 'Umum', 'Kategori untuk tugas umum', '#3498db', NULL, '2025-07-17 16:00:22', '2025-07-17 16:00:22'),
(24, 'Penting', 'Kategori untuk tugas penting', '#e74c3c', NULL, '2025-07-17 16:00:22', '2025-07-17 16:00:22'),
(25, 'Akademik1', 'Kategori ', '0', 22, '2025-07-17 16:00:22', '2025-07-17 16:26:28'),
(34, 'Umum', 'Kategori untuk tugas umum', '#3498db', NULL, '2025-07-17 16:00:26', '2025-07-17 16:00:26'),
(35, 'Penting', 'Kategori untuk tugas penting', '#e74c3c', NULL, '2025-07-17 16:00:26', '2025-07-17 16:00:26'),
(36, 'Akademik2', 'Kategori 1', '0', 21, '2025-07-17 16:00:26', '2025-07-17 16:28:40'),
(45, 'Umum', 'Kategori untuk tugas umum', '#3498db', NULL, '2025-07-17 16:02:23', '2025-07-17 16:02:23'),
(46, 'Penting', 'Kategori untuk tugas penting', '#e74c3c', NULL, '2025-07-17 16:02:23', '2025-07-17 16:02:23'),
(47, 'Akademik', 'Kategori untuk tugas akademik', '#2ecc71', NULL, '2025-07-17 16:02:23', '2025-07-17 16:02:23'),
(56, 'Umum', 'Kategori untuk tugas umum', '#3498db', NULL, '2025-07-17 16:04:23', '2025-07-17 16:04:23'),
(57, 'Penting', 'Kategori untuk tugas penting', '#e74c3c', NULL, '2025-07-17 16:04:23', '2025-07-17 16:04:23'),
(58, 'Akademik', 'Kategori untuk tugas akademik', '#2ecc71', NULL, '2025-07-17 16:04:23', '2025-07-17 16:04:23'),
(67, 'Umum', 'Kategori untuk tugas umum', '#3498db', NULL, '2025-07-17 16:06:34', '2025-07-17 16:06:34'),
(68, 'Penting', 'Kategori untuk tugas penting', '#e74c3c', NULL, '2025-07-17 16:06:34', '2025-07-17 16:06:34'),
(69, 'Akademik', 'Kategori untuk tugas akademik', '#2ecc71', NULL, '2025-07-17 16:06:34', '2025-07-17 16:06:34'),
(78, 'Umum', 'Kategori untuk tugas umum', '#3498db', NULL, '2025-07-17 16:08:59', '2025-07-17 16:08:59'),
(79, 'Penting', 'Kategori untuk tugas penting', '#e74c3c', NULL, '2025-07-17 16:08:59', '2025-07-17 16:08:59'),
(80, 'Akademik', 'Kategori untuk tugas akademik', '#2ecc71', NULL, '2025-07-17 16:08:59', '2025-07-17 16:08:59'),
(89, 'Umum', 'Kategori untuk tugas umum', '#3498db', NULL, '2025-07-17 16:09:05', '2025-07-17 16:09:05'),
(90, 'Penting', 'Kategori untuk tugas penting', '#e74c3c', NULL, '2025-07-17 16:09:05', '2025-07-17 16:09:05'),
(91, 'Akademik', 'Kategori untuk tugas akademik', '#2ecc71', NULL, '2025-07-17 16:09:05', '2025-07-17 16:09:05'),
(100, 'Umum', 'Kategori untuk tugas umum', '#3498db', NULL, '2025-07-17 16:09:08', '2025-07-17 16:09:08'),
(101, 'Penting', 'Kategori untuk tugas penting', '#e74c3c', NULL, '2025-07-17 16:09:08', '2025-07-17 16:09:08'),
(102, 'Akademik', 'Kategori untuk tugas akademik', '#2ecc71', NULL, '2025-07-17 16:09:08', '2025-07-17 16:09:08'),
(111, 'Umum', 'Kategori untuk tugas umum', '#3498db', NULL, '2025-07-17 16:09:38', '2025-07-17 16:09:38'),
(112, 'Penting', 'Kategori untuk tugas penting', '#e74c3c', NULL, '2025-07-17 16:09:38', '2025-07-17 16:09:38'),
(113, 'Akademik4', 'Kategori untuk t', '0', 16, '2025-07-17 16:09:38', '2025-07-17 16:32:41'),
(122, 'dialah', 'apalah', '#fa4b00', 15, '2025-07-17 16:15:50', '2025-07-18 00:19:51'),
(123, 'Pengembangan Perangkat Lunak', NULL, '#050505', 15, '2025-07-18 00:36:20', '2025-07-18 00:36:20'),
(124, 'Data dan Analitik', NULL, '#05ff65', 15, '2025-07-18 00:36:51', '2025-07-18 00:36:51'),
(130, 'Pekerjaan', NULL, '#FF5733', 25, '2025-07-18 05:41:26', '2025-07-18 05:41:26'),
(131, 'multimedia', NULL, '#0062ff', 25, '2025-07-18 05:48:51', '2025-07-18 05:48:51'),
(132, 'matematika', ' belajar dengan giat', '#3498db', 25, '2025-07-18 06:03:09', '2025-07-18 06:03:09');

-- --------------------------------------------------------

--
-- Table structure for table `error_logs`
--

CREATE TABLE `error_logs` (
  `id` int(11) NOT NULL,
  `level` enum('error','warning','info') DEFAULT 'error',
  `message` text NOT NULL,
  `source` varchar(255) DEFAULT NULL,
  `stack` text DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `timestamp` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `settings`
--

CREATE TABLE `settings` (
  `id` int(11) NOT NULL CHECK (`id` = 1),
  `apiRateLimit` int(11) DEFAULT 60,
  `apiTokenExpiry` int(11) DEFAULT 24,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `settings`
--

INSERT INTO `settings` (`id`, `apiRateLimit`, `apiTokenExpiry`, `created_at`, `updated_at`) VALUES
(1, 60, 24, '2025-07-11 09:27:34', '2025-07-11 09:27:34');

-- --------------------------------------------------------

--
-- Table structure for table `tasks`
--

CREATE TABLE `tasks` (
  `id` int(11) NOT NULL,
  `title` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `status` enum('pending','in_progress','completed','cancelled') DEFAULT 'pending',
  `priority` enum('low','medium','high') DEFAULT 'medium',
  `due_date` date DEFAULT NULL,
  `category_id` int(11) DEFAULT NULL,
  `user_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tasks`
--

INSERT INTO `tasks` (`id`, `title`, `description`, `status`, `priority`, `due_date`, `category_id`, `user_id`, `created_at`, `updated_at`) VALUES
(452, 'Pemrograman Integratif', 'Membuat aplikasi berbasis microservices dengan integrasi API pihak ketiga.', 'pending', 'high', '2025-07-19', 123, 15, '2025-07-18 00:37:40', '2025-07-18 00:37:40'),
(456, 'tugas pak nugra', 'tugas', 'pending', 'high', '2025-07-19', 130, 25, '2025-07-18 05:48:37', '2025-07-18 05:48:37'),
(457, 'gitulah', 'sddddddddddddddd', 'pending', 'high', '2025-07-19', 131, 25, '2025-07-18 05:49:39', '2025-07-18 05:49:39');

-- --------------------------------------------------------

--
-- Table structure for table `tokens`
--

CREATE TABLE `tokens` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `token` varchar(255) NOT NULL,
  `token_type` enum('jwt','api_key') DEFAULT 'jwt',
  `description` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tokens`
--

INSERT INTO `tokens` (`id`, `user_id`, `token`, `token_type`, `description`, `created_at`) VALUES
(6, 15, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTUsInVzZXJuYW1lIjoidXNlcjEiLCJlbWFpbCI6InVzZXIxQGV4YW1wbGUuY29tIiwicm9sZSI6InVzZXIiLCJpYXQiOjE3NTI3NjY4ODYsImV4cCI6MTc1NTM1ODg4Nn0.7Q-ndTgIzhMuQTJ7b8oOKrsPBtv--QrGrbAH2r4A6uk', 'jwt', 'JWT Authentication Token', '2025-07-17 15:41:26'),
(7, 15, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTUsInVzZXJuYW1lIjoidXNlcjEiLCJlbWFpbCI6InVzZXIxQGV4YW1wbGUuY29tIiwicm9sZSI6InVzZXIiLCJpYXQiOjE3NTI3NjY5OTEsImV4cCI6MTc1NTM1ODk5MX0.vO20sXit3tiKyrci8DsuYlIYKl9KTpKp9a04MiiDbEU', 'jwt', 'JWT Authentication Token', '2025-07-17 15:43:11'),
(8, 16, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTYsInVzZXJuYW1lIjoidXNlcjIiLCJlbWFpbCI6InVzZXIyQGV4YW1wbGUuY29tIiwicm9sZSI6InVzZXIiLCJpYXQiOjE3NTI3NjcwNzEsImV4cCI6MTc1NTM1OTA3MX0.iXk0bSo1FpKgUo--uKAonfWKiyaMMMIp5dnnf0Y6Jgc', 'jwt', 'JWT Authentication Token', '2025-07-17 15:44:31'),
(9, 17, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTcsInVzZXJuYW1lIjoidXNlcjMiLCJlbWFpbCI6InVzZXIzQGV4YW1wbGUuY29tIiwicm9sZSI6InVzZXIiLCJpYXQiOjE3NTI3NjcwNzksImV4cCI6MTc1NTM1OTA3OX0.tGs3yWfo1SgMYp5qxNrAe7NuyrKJIiQ4FC1G8EQi4ws', 'jwt', 'JWT Authentication Token', '2025-07-17 15:44:39'),
(10, 18, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTgsInVzZXJuYW1lIjoidXNlcjQiLCJlbWFpbCI6InVzZXI0QGV4YW1wbGUuY29tIiwicm9sZSI6InVzZXIiLCJpYXQiOjE3NTI3NjcwODUsImV4cCI6MTc1NTM1OTA4NX0.s4wB8kiPONAXg_QpCPTpztki2PpXLw3rFbNImRdNJHQ', 'jwt', 'JWT Authentication Token', '2025-07-17 15:44:45'),
(11, 19, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTksInVzZXJuYW1lIjoidXNlcjUiLCJlbWFpbCI6InVzZXI1QGV4YW1wbGUuY29tIiwicm9sZSI6InVzZXIiLCJpYXQiOjE3NTI3NjcwOTEsImV4cCI6MTc1NTM1OTA5MX0.iFoAcI6NmCqTnyF1dzX71INBYYhyP94KanzraZ-zv2o', 'jwt', 'JWT Authentication Token', '2025-07-17 15:44:51'),
(12, 20, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjAsInVzZXJuYW1lIjoidXNlcjYiLCJlbWFpbCI6InVzZXI2QGV4YW1wbGUuY29tIiwicm9sZSI6InVzZXIiLCJpYXQiOjE3NTI3NjcwOTcsImV4cCI6MTc1NTM1OTA5N30.cHvUpIKtUVTV7nJM0wgkNPdvEAfFhxUSVrBG0AnS4Mc', 'jwt', 'JWT Authentication Token', '2025-07-17 15:44:57'),
(13, 21, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjEsInVzZXJuYW1lIjoidXNlcjciLCJlbWFpbCI6InVzZXI3QGV4YW1wbGUuY29tIiwicm9sZSI6InVzZXIiLCJpYXQiOjE3NTI3NjcxMDQsImV4cCI6MTc1NTM1OTEwNH0.aZWolGwP52sqAy_L0rNQs_6k4b92Fll_4whMhdSmaes', 'jwt', 'JWT Authentication Token', '2025-07-17 15:45:04'),
(14, 22, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjIsInVzZXJuYW1lIjoidXNlcjgiLCJlbWFpbCI6InVzZXI4QGV4YW1wbGUuY29tIiwicm9sZSI6InVzZXIiLCJpYXQiOjE3NTI3NjcxMTAsImV4cCI6MTc1NTM1OTExMH0.56h2P5IifTKk8-w57Wcve2QeXpGTMmGmwMcxpJKk-uM', 'jwt', 'JWT Authentication Token', '2025-07-17 15:45:10'),
(15, 15, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTUsInVzZXJuYW1lIjoidXNlcjEiLCJlbWFpbCI6InVzZXIxQGV4YW1wbGUuY29tIiwicm9sZSI6InVzZXIiLCJpYXQiOjE3NTI3OTg4NjksImV4cCI6MTc1NTM5MDg2OX0.S3z0t-CZO3mhfl_u2ccckfCTeWwzpPiLPi3jC52H6Uw', 'jwt', 'JWT Authentication Token', '2025-07-18 00:34:29'),
(21, 25, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjUsInVzZXJuYW1lIjoicGVuZ2d1bmF0ZXN0IiwiZW1haWwiOiJ0ZXN0QGNvbnRvaC5jb20iLCJyb2xlIjoidXNlciIsImlhdCI6MTc1MjgxNzA0MCwiZXhwIjoxNzU1NDA5MDQwfQ.DlyM0r0QV2iZufD8hOu49IxESz_bGgPqdQ-AzFQNEuw', 'jwt', 'JWT Authentication Token', '2025-07-18 05:37:20'),
(22, 25, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjUsInVzZXJuYW1lIjoicGVuZ2d1bmF0ZXN0IiwiZW1haWwiOiJ0ZXN0QGNvbnRvaC5jb20iLCJyb2xlIjoidXNlciIsImlhdCI6MTc1MjgxNzEwMiwiZXhwIjoxNzU1NDA5MTAyfQ.vLeKhnMFMG0PSF10lfoW0a2f8xZ36pAjieYI3TCoABM', 'jwt', 'JWT Authentication Token', '2025-07-18 05:38:22'),
(23, 25, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjUsInVzZXJuYW1lIjoicGVuZ2d1bmF0ZXN0IiwiZW1haWwiOiJ0ZXN0QGNvbnRvaC5jb20iLCJyb2xlIjoidXNlciIsImlhdCI6MTc1MjgxNzY5MCwiZXhwIjoxNzU1NDA5NjkwfQ.eWMWro7pyD22Kz9eIoyLXDjNt9dElSt9DjEdNrRdudQ', 'jwt', 'JWT Authentication Token', '2025-07-18 05:48:10'),
(24, 25, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjUsInVzZXJuYW1lIjoicGVuZ2d1bmF0ZXN0IiwiZW1haWwiOiJ0ZXN0QGNvbnRvaC5jb20iLCJyb2xlIjoidXNlciIsImlhdCI6MTc1MjgxODA3NiwiZXhwIjoxNzU1NDEwMDc2fQ.YPq2hLztBJHq-Z2CUsD3tWDkXLiz_TqSw_LGytQWLEc', 'jwt', 'JWT Authentication Token', '2025-07-18 05:54:36'),
(25, 25, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjUsInVzZXJuYW1lIjoicGVuZ2d1bmF0ZXN0IiwiZW1haWwiOiJ0ZXN0QGNvbnRvaC5jb20iLCJyb2xlIjoidXNlciIsImlhdCI6MTc1MjgxODMxNiwiZXhwIjoxNzU1NDEwMzE2fQ.pTKZpEq30taqKN-08mEAelKIVb7NJrQtoAj4EL-r1dw', 'jwt', 'Login token', '2025-07-18 05:58:36'),
(26, 25, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjUsInVzZXJuYW1lIjoicGVuZ2d1bmF0ZXN0IiwiZW1haWwiOiJ0ZXN0QGNvbnRvaC5jb20iLCJyb2xlIjoidXNlciIsImlhdCI6MTc1MjgxODM5NiwiZXhwIjoxNzU1NDEwMzk2fQ.-zNiP6W_kEEoZC1bhHHLUXUR4JHwwuWMBrNiFBu4XdI', 'jwt', 'Login token', '2025-07-18 05:59:56'),
(27, 25, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MjUsInVzZXJuYW1lIjoicGVuZ2d1bmF0ZXN0IiwiZW1haWwiOiJ0ZXN0QGNvbnRvaC5jb20iLCJyb2xlIjoidXNlciIsImlhdCI6MTc1MjgxODUwMywiZXhwIjoxNzU1NDEwNTAzfQ.GELYTRBr0OcMn4ZSGgSU-D-CB6F6pJ7uG_iyGveIxyY', 'jwt', 'Login token', '2025-07-18 06:01:43');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `username` varchar(50) NOT NULL,
  `email` varchar(100) NOT NULL,
  `profile_photo` varchar(255) DEFAULT NULL,
  `is_active` tinyint(1) NOT NULL DEFAULT 1,
  `password` varchar(255) NOT NULL,
  `api_key` varchar(100) DEFAULT NULL,
  `role` enum('user','admin') DEFAULT 'user',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `username`, `email`, `profile_photo`, `is_active`, `password`, `api_key`, `role`, `created_at`, `updated_at`) VALUES
(15, 'user1', 'user1@example.com', NULL, 1, 'Password123', 'ydclkzcdc7nyjpd2kz4ahrmd7k5dfl', 'user', '2025-07-17 15:41:26', '2025-07-17 15:41:26'),
(16, 'user2', 'user2@example.com', NULL, 1, 'Password123', 'omkw9yafalpt1hlabye7md7k9bzs', 'user', '2025-07-17 15:44:31', '2025-07-17 15:44:31'),
(17, 'user3', 'user3@example.com', NULL, 1, 'Password123', '19fc0h1t27hnxbbtoxu0lrmd7k9hub', 'user', '2025-07-17 15:44:39', '2025-07-17 15:44:39'),
(18, 'user4', 'user4@example.com', NULL, 1, 'Password123', 'yvbnlx6z5w5kz9h15mmukmd7k9mte', 'user', '2025-07-17 15:44:45', '2025-07-17 15:44:45'),
(19, 'user5', 'user5@example.com', NULL, 1, 'Password123', '6jvadiv4wxn7i348npnlrjmd7k9rk6', 'user', '2025-07-17 15:44:51', '2025-07-17 15:44:51'),
(20, 'user6', 'user6@example.com', NULL, 1, 'Password123', 'l9koddzynhktbbc432ggrmd7k9vwf', 'user', '2025-07-17 15:44:57', '2025-07-17 15:44:57'),
(21, 'user7', 'user7@example.com', NULL, 1, 'Password123', 'g52yo8wbmeo16ub0chedudmd7ka18f', 'user', '2025-07-17 15:45:04', '2025-07-17 15:45:04'),
(22, 'user8', 'user8@example.com', NULL, 1, 'Password123', 'i37bh76lj5nj641culqazmd7ka684', 'user', '2025-07-17 15:45:10', '2025-07-17 15:45:10'),
(25, 'penggunatest', 'test@contoh.com', NULL, 1, '$2y$10$Jqstq.ZDe9dbVgaBEHZQIuT0eluuIl74b3qbj0jiBnx9ydtmSHFQG', 'f198gd8oqquwdqn642wh6rmd8e0by1', 'user', '2025-07-18 05:37:19', '2025-07-18 05:58:09');

-- --------------------------------------------------------

--
-- Table structure for table `user_activities`
--

CREATE TABLE `user_activities` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `activity_type` varchar(50) NOT NULL,
  `description` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `activity_logs`
--
ALTER TABLE `activity_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `created_at` (`created_at`);

--
-- Indexes for table `admins`
--
ALTER TABLE `admins`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `admin_tokens`
--
ALTER TABLE `admin_tokens`
  ADD PRIMARY KEY (`id`),
  ADD KEY `admin_id` (`admin_id`);

--
-- Indexes for table `categories`
--
ALTER TABLE `categories`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `name` (`name`,`user_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `error_logs`
--
ALTER TABLE `error_logs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `settings`
--
ALTER TABLE `settings`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `tasks`
--
ALTER TABLE `tasks`
  ADD PRIMARY KEY (`id`),
  ADD KEY `category_id` (`category_id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `tokens`
--
ALTER TABLE `tokens`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indexes for table `user_activities`
--
ALTER TABLE `user_activities`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `activity_logs`
--
ALTER TABLE `activity_logs`
  MODIFY `id` int(11) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `admins`
--
ALTER TABLE `admins`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `admin_tokens`
--
ALTER TABLE `admin_tokens`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `categories`
--
ALTER TABLE `categories`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=133;

--
-- AUTO_INCREMENT for table `error_logs`
--
ALTER TABLE `error_logs`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `tasks`
--
ALTER TABLE `tasks`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=458;

--
-- AUTO_INCREMENT for table `tokens`
--
ALTER TABLE `tokens`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=28;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=26;

--
-- AUTO_INCREMENT for table `user_activities`
--
ALTER TABLE `user_activities`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `activity_logs`
--
ALTER TABLE `activity_logs`
  ADD CONSTRAINT `activity_logs_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `admin_tokens`
--
ALTER TABLE `admin_tokens`
  ADD CONSTRAINT `admin_tokens_ibfk_1` FOREIGN KEY (`admin_id`) REFERENCES `admins` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `categories`
--
ALTER TABLE `categories`
  ADD CONSTRAINT `categories_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `error_logs`
--
ALTER TABLE `error_logs`
  ADD CONSTRAINT `error_logs_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL;

--
-- Constraints for table `tasks`
--
ALTER TABLE `tasks`
  ADD CONSTRAINT `tasks_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `tasks_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `tokens`
--
ALTER TABLE `tokens`
  ADD CONSTRAINT `tokens_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `user_activities`
--
ALTER TABLE `user_activities`
  ADD CONSTRAINT `user_activities_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
