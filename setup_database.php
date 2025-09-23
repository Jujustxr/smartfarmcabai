<?php
// Include database connection
include 'php/config.php';

// Create all required tables for the Smart Farm system
$tables = [
    // Gas sensor (already exists in gasLv.php)
    "CREATE TABLE IF NOT EXISTS `sensor_box_01` (
        `Record_ID` INT AUTO_INCREMENT PRIMARY KEY,
        `Record_Date` DATE NOT NULL,
        `Record_Time` TIME NOT NULL,
        `Gas_Value` FLOAT NOT NULL COMMENT 'Nilai gas dalam PPM',
        `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX `idx_date_time` (`Record_Date`, `Record_Time`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci",

    // Soil Moisture sensor
    "CREATE TABLE IF NOT EXISTS `sensor_box_02` (
        `Record_ID` INT AUTO_INCREMENT PRIMARY KEY,
        `Record_Date` DATE NOT NULL,
        `Record_Time` TIME NOT NULL,
        `Soil_Moisture` FLOAT NOT NULL COMMENT 'Kelembaban tanah dalam %',
        `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX `idx_date_time` (`Record_Date`, `Record_Time`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci",

    // Water Level sensor
    "CREATE TABLE IF NOT EXISTS `sensor_box_03` (
        `Record_ID` INT AUTO_INCREMENT PRIMARY KEY,
        `Record_Date` DATE NOT NULL,
        `Record_Time` TIME NOT NULL,
        `Water_Level` FLOAT NOT NULL COMMENT 'Level air dalam cm',
        `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX `idx_date_time` (`Record_Date`, `Record_Time`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci",

    // Temperature sensor
    "CREATE TABLE IF NOT EXISTS `sensor_box_04` (
        `Record_ID` INT AUTO_INCREMENT PRIMARY KEY,
        `Record_Date` DATE NOT NULL,
        `Record_Time` TIME NOT NULL,
        `Temperature` FLOAT NOT NULL COMMENT 'Suhu dalam Celsius',
        `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX `idx_date_time` (`Record_Date`, `Record_Time`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci",

    // Humidity sensor
    "CREATE TABLE IF NOT EXISTS `sensor_box_05` (
        `Record_ID` INT AUTO_INCREMENT PRIMARY KEY,
        `Record_Date` DATE NOT NULL,
        `Record_Time` TIME NOT NULL,
        `Humidity` FLOAT NOT NULL COMMENT 'Kelembaban udara dalam %',
        `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX `idx_date_time` (`Record_Date`, `Record_Time`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci",

    // Heat Index sensor
    "CREATE TABLE IF NOT EXISTS `sensor_box_06` (
        `Record_ID` INT AUTO_INCREMENT PRIMARY KEY,
        `Record_Date` DATE NOT NULL,
        `Record_Time` TIME NOT NULL,
        `Heat_Index` FLOAT NOT NULL COMMENT 'Indeks panas',
        `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX `idx_date_time` (`Record_Date`, `Record_Time`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci"
];

echo "<h2>Creating Database Tables...</h2>";

// Create each table
foreach ($tables as $index => $sql) {
    if (mysqli_query($conn, $sql)) {
        echo "<p style='color: green;'>✓ Table " . ($index + 1) . " created successfully.</p>";
    } else {
        echo "<p style='color: red;'>✗ Error creating table " . ($index + 1) . ": " . mysqli_error($conn) . "</p>";
    }
}

// Insert sample data
$sample_data = [
    // Gas sensor data
    "INSERT IGNORE INTO `sensor_box_01` (`Record_Date`, `Record_Time`, `Gas_Value`) VALUES
    (CURDATE(), '08:00:00', 45.5),
    (CURDATE(), '08:15:00', 47.2),
    (CURDATE(), '08:30:00', 44.8),
    (CURDATE(), '08:45:00', 46.1),
    (CURDATE(), '09:00:00', 48.3)",

    // Soil moisture data
    "INSERT IGNORE INTO `sensor_box_02` (`Record_Date`, `Record_Time`, `Soil_Moisture`) VALUES
    (CURDATE(), '08:00:00', 65.5),
    (CURDATE(), '08:15:00', 67.2),
    (CURDATE(), '08:30:00', 64.8),
    (CURDATE(), '08:45:00', 66.1),
    (CURDATE(), '09:00:00', 68.3)",

    // Water level data
    "INSERT IGNORE INTO `sensor_box_03` (`Record_Date`, `Record_Time`, `Water_Level`) VALUES
    (CURDATE(), '08:00:00', 75.5),
    (CURDATE(), '08:15:00', 73.2),
    (CURDATE(), '08:30:00', 25.1),
    (CURDATE(), '08:45:00', 85.8),
    (CURDATE(), '09:00:00', 95.3)",

    // Temperature data
    "INSERT IGNORE INTO `sensor_box_04` (`Record_Date`, `Record_Time`, `Temperature`) VALUES
    (CURDATE(), '08:00:00', 26.5),
    (CURDATE(), '08:15:00', 27.2),
    (CURDATE(), '08:30:00', 28.1),
    (CURDATE(), '08:45:00', 29.0),
    (CURDATE(), '09:00:00', 28.7)",

    // Humidity data
    "INSERT IGNORE INTO `sensor_box_05` (`Record_Date`, `Record_Time`, `Humidity`) VALUES
    (CURDATE(), '08:00:00', 68.5),
    (CURDATE(), '08:15:00', 70.2),
    (CURDATE(), '08:30:00', 69.8),
    (CURDATE(), '08:45:00', 71.1),
    (CURDATE(), '09:00:00', 72.3)",

    // Heat index data
    "INSERT IGNORE INTO `sensor_box_06` (`Record_Date`, `Record_Time`, `Heat_Index`) VALUES
    (CURDATE(), '08:00:00', 28.5),
    (CURDATE(), '08:15:00', 29.2),
    (CURDATE(), '08:30:00', 30.1),
    (CURDATE(), '08:45:00', 31.0),
    (CURDATE(), '09:00:00', 30.7)"
];

echo "<h2>Inserting Sample Data...</h2>";

// Insert sample data
foreach ($sample_data as $index => $sql) {
    if (mysqli_query($conn, $sql)) {
        echo "<p style='color: green;'>✓ Sample data " . ($index + 1) . " inserted successfully.</p>";
    } else {
        echo "<p style='color: red;'>✗ Error inserting sample data " . ($index + 1) . ": " . mysqli_error($conn) . "</p>";
    }
}

// Create admin_users table
$createAdminUsersTable = "CREATE TABLE IF NOT EXISTS admin_users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
)";

if ($conn->query($createAdminUsersTable) === TRUE) {
    echo "Table admin_users created successfully.";
} else {
    echo "Error creating admin_users table: " . $conn->error;
}

// Insert default admin user
$defaultAdminUsername = 'admin';
$defaultAdminPassword = password_hash('admin123', PASSWORD_DEFAULT);

$insertAdminUser = "INSERT IGNORE INTO admin_users (username, password) VALUES (?, ?)";
$stmt = $conn->prepare($insertAdminUser);
$stmt->bind_param('ss', $defaultAdminUsername, $defaultAdminPassword);
$stmt->execute();

echo "<h2>Database Setup Complete!</h2>";
echo "<p><a href='index.php'>Go to Dashboard</a></p>";

mysqli_close($conn);
?>