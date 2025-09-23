-- Pilih database terlebih dahulu
USE `smartfarm_cabai`;

-- Buat tabel sensor_box_03 untuk Water Level Sensor
CREATE TABLE IF NOT EXISTS `sensor_box_03` (
    `Record_ID` INT AUTO_INCREMENT PRIMARY KEY,
    `Record_Date` DATE NOT NULL,
    `Record_Time` TIME NOT NULL,
    `Water_Level` FLOAT NOT NULL COMMENT 'Level air dalam cm',
    `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX `idx_date_time` (`Record_Date`, `Record_Time`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert sample data untuk testing
INSERT INTO `sensor_box_03` (`Record_Date`, `Record_Time`, `Water_Level`) VALUES
(CURDATE(), '08:00:00', 75.5),
(CURDATE(), '08:15:00', 73.2),
(CURDATE(), '08:30:00', 25.1),
(CURDATE(), '08:45:00', 85.8),
(CURDATE(), '09:00:00', 95.3),
(CURDATE(), '09:15:00', 67.4),
(CURDATE(), '09:30:00', 82.1),
(CURDATE(), '09:45:00', 15.3),
(CURDATE(), '10:00:00', 90.7),
(CURDATE(), '10:15:00', 78.9),
(CURDATE(), '10:30:00', 45.2),
(CURDATE(), '10:45:00', 88.6),
(CURDATE(), '11:00:00', 92.1);