<!DOCTYPE html>
<html lang="en">
<?php 
include 'assets/components/head.php';
include 'php/config.php'; // Include database connection
?>

<body class="sb-nav-fixed">

    <?php include 'assets/components/navbar.php' ?>

    <?php include 'sidebar.php' ?>
            <div id="layoutSidenav_content">
                <main>
                    <div class="container-fluid px-4">
                        <h1 class="mt-4">Dashboard</h1>
                        <ol class="breadcrumb mb-4">
                            <li class="breadcrumb-item active">Juli Cantik</li>
                        </ol>
                        
                        <?php
                        // Get latest sensor data
                        $gas_query = "SELECT Gas_Value FROM sensor_box_01 ORDER BY Record_Date DESC, Record_Time DESC LIMIT 1";
                        $temp_query = "SELECT Temperature FROM sensor_box_04 ORDER BY Record_Date DESC, Record_Time DESC LIMIT 1";
                        $humidity_query = "SELECT Humidity FROM sensor_box_05 ORDER BY Record_Date DESC, Record_Time DESC LIMIT 1";
                        $water_query = "SELECT Water_Level FROM sensor_box_03 ORDER BY Record_Date DESC, Record_Time DESC LIMIT 1";
                        
                        $gas_result = mysqli_query($conn, $gas_query);
                        $temp_result = mysqli_query($conn, $temp_query);
                        $humidity_result = mysqli_query($conn, $humidity_query);
                        $water_result = mysqli_query($conn, $water_query);
                        
                        $gas_value = $gas_result ? mysqli_fetch_array($gas_result)['Gas_Value'] ?? 'N/A' : 'N/A';
                        $temp_value = $temp_result ? mysqli_fetch_array($temp_result)['Temperature'] ?? 'N/A' : 'N/A';
                        $humidity_value = $humidity_result ? mysqli_fetch_array($humidity_result)['Humidity'] ?? 'N/A' : 'N/A';
                        $water_value = $water_result ? mysqli_fetch_array($water_result)['Water_Level'] ?? 'N/A' : 'N/A';
                        ?>
                        
                        <div class="row">
                            <div class="col-xl-3 col-md-6">
                                <div class="card bg-primary text-white mb-4">
                                    <div class="card-body">
                                        <div class="d-flex justify-content-between">
                                            <div>
                                                <div class="h5 mb-0"><?php echo $gas_value; ?> PPM</div>
                                                <div class="small">Gas Level</div>
                                            </div>
                                            <div><i class="fas fa-wind fa-2x"></i></div>
                                        </div>
                                    </div>
                                    <div class="card-footer d-flex align-items-center justify-content-between">
                                        <a class="small text-white stretched-link" href="gasLv.php">View Details</a>
                                        <div class="small text-white"><i class="fas fa-angle-right"></i></div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-xl-3 col-md-6">
                                <div class="card bg-warning text-white mb-4">
                                    <div class="card-body">
                                        <div class="d-flex justify-content-between">
                                            <div>
                                                <div class="h5 mb-0"><?php echo $temp_value; ?>°C</div>
                                                <div class="small">Temperature</div>
                                            </div>
                                            <div><i class="fas fa-thermometer-half fa-2x"></i></div>
                                        </div>
                                    </div>
                                    <div class="card-footer d-flex align-items-center justify-content-between">
                                        <a class="small text-white stretched-link" href="temp.php">View Details</a>
                                        <div class="small text-white"><i class="fas fa-angle-right"></i></div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-xl-3 col-md-6">
                                <div class="card bg-success text-white mb-4">
                                    <div class="card-body">
                                        <div class="d-flex justify-content-between">
                                            <div>
                                                <div class="h5 mb-0"><?php echo $humidity_value; ?>%</div>
                                                <div class="small">Humidity</div>
                                            </div>
                                            <div><i class="fas fa-tint fa-2x"></i></div>
                                        </div>
                                    </div>
                                    <div class="card-footer d-flex align-items-center justify-content-between">
                                        <a class="small text-white stretched-link" href="humidity.php">View Details</a>
                                        <div class="small text-white"><i class="fas fa-angle-right"></i></div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-xl-3 col-md-6">
                                <div class="card bg-info text-white mb-4">
                                    <div class="card-body">
                                        <div class="d-flex justify-content-between">
                                            <div>
                                                <div class="h5 mb-0"><?php echo $water_value; ?> cm</div>
                                                <div class="small">Water Level</div>
                                            </div>
                                            <div><i class="fas fa-water fa-2x"></i></div>
                                        </div>
                                    </div>
                                    <div class="card-footer d-flex align-items-center justify-content-between">
                                        <a class="small text-white stretched-link" href="waterLv.php">View Details</a>
                                        <div class="small text-white"><i class="fas fa-angle-right"></i></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="row">
                            <div class="col-xl-6">
                                <div class="card mb-4">
                                    <div class="card-header">
                                        <i class="fas fa-chart-area me-1"></i>
                                        Area Chart Example
                                    </div>
                                    <div class="card-body"><canvas id="myAreaChart" width="100%" height="40"></canvas></div>
                                </div>
                            </div>
                            <div class="col-xl-6">
                                <div class="card mb-4">
                                    <div class="card-header">
                                        <i class="fas fa-chart-bar me-1"></i>
                                        Bar Chart Example
                                    </div>
                                    <div class="card-body"><canvas id="myBarChart" width="100%" height="40"></canvas></div>
                                </div>
                            </div>
                        </div>
                        <div class="card mb-4">
                            <div class="card-header">
                                <i class="fas fa-table me-1"></i>
                                DataTable Example
                            </div>
                            <div class="card-body">
                                <table id="datatablesSimple">
                                    <tbody>
                                        <tr>
                                            <td>Donna Snider</td>
                                            <td>Customer Support</td>
                                            <td>New York</td>
                                            <td>27</td>
                                            <td>2011/01/25</td>
                                            <td>$112,000</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </main>
                <footer class="py-4 bg-light mt-auto">
                    <div class="container-fluid px-4">
                        <div class="d-flex align-items-center justify-content-between small">
                            <div class="text-muted">Copyright &copy; Your Website 2023</div>
                            <div>
                                <a href="#">Privacy Policy</a>
                                &middot;
                                <a href="#">Terms &amp; Conditions</a>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js" crossorigin="anonymous"></script>
        <script src="js/scripts.js"></script>
        <script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.8.0/Chart.min.js" crossorigin="anonymous"></script>
        <script src="assets/demo/chart-area-demo.js"></script>
        <script src="assets/demo/chart-bar-demo.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/simple-datatables@7.1.2/dist/umd/simple-datatables.min.js" crossorigin="anonymous"></script>
        <script src="js/datatables-simple-demo.js"></script>
    </body>
</html>
