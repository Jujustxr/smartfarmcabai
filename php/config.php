<?php
// Database configuration
$user = 'root';
$password = '';
$db = 'smartfarm_cabai';
$host = 'localhost';
$port = 3306;

// First, connect without specifying database to create it if it doesn't exist
$temp_conn = mysqli_connect($host, $user, $password, '', $port);

if (!$temp_conn) {
    die("Failed to connect to MySQL server: " . mysqli_connect_error());
}

// Create database if it doesn't exist
$create_db_sql = "CREATE DATABASE IF NOT EXISTS `$db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci";
if (!mysqli_query($temp_conn, $create_db_sql)) {
    die("Error creating database: " . mysqli_error($temp_conn));
}

// Close temporary connection
mysqli_close($temp_conn);

// Now connect to the specific database
$conn = mysqli_connect($host, $user, $password, $db, $port);

if (!$conn) {
    die("Failed to connect to database: " . mysqli_connect_error());
}

// Set charset to UTF-8
mysqli_set_charset($conn, "utf8mb4");

// Optional: Display success message (remove in production)
// echo "Successfully connected to database: $db";

?>