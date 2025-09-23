<?php

include('php/config.php');

$SQL = "SELECT * FROM `sensor_box_04` ORDER BY Record_Date DESC, Record_Time DESC LIMIT 5;";

$stmt = $conn->prepare($SQL);

$stmt->execute();

$sensor_data = $stmt->get_result();

?>

<!DOCTYPE html>
<html lang="en">
<?php include 'assets/components/head.php' ?>

<body class="sb-nav-fixed">
    <?php include 'assets/components/navbar.php' ?>
    <?php include 'sidebar.php' ?>

    <div id="layoutSidenav_content">
        <main>
            <div class="container-fluid px-4">
                <h1 class="mt-4">Temperature</h1>
                <ol class="breadcrumb mb-4">
                    <li class="breadcrumb-item"><a href="index.php">Dashboard</a></li>
                    <li class="breadcrumb-item active">Temperature</li>
                </ol>
                <div class="card mb-4">
                    <div class="card-body">
                        This dashboard uses line charts, pie charts, and bar charts to display Temperature statistics for the given time period. Using datatable, you may view more information
                    </div>
                </div>
                
                <!-- Area Chart -->
                <div class="card mb-4">
                    <div class="card-header">
                        <i class="fas fa-chart-area me-1"></i>
                        Temperature Area Chart
                    </div>
                    <div class="card-body"><canvas id="areaChart" width="100%" height="30"></canvas></div>
                    <div class="card-footer small text-muted">Last Updated <?php echo date("Y.m.d") ?></div>
                </div>
                
                <!-- Bar and Pie Charts -->
                <div class="row">
                    <div class="col-lg-6">
                        <div class="card mb-4">
                            <div class="card-header">
                                <i class="fas fa-chart-bar me-1"></i>
                                Temperature Bar Chart
                            </div>
                            <div class="card-body"><canvas id="myChart2" style="width:100%; max-width:600px"></canvas></div>
                            <div class="card-footer small text-muted">Last Updated <?php echo date("Y.m.d") ?></div>
                        </div>
                    </div>
                    <div class="col-lg-6">
                        <div class="card mb-4">
                            <div class="card-header">
                                <i class="fas fa-chart-pie me-1"></i>
                                Temperature Pie Chart
                            </div>
                            <div class="card-body"><canvas id="myChart" style="width:100%;max-width:600px"></canvas></div>
                            <div class="card-footer small text-muted">Last Updated <?php echo date("Y.m.d") ?></div>
                        </div>
                    </div>
                </div>

                <!-- Data Table -->
                <?php
                $SQL = "SELECT * FROM `sensor_box_04` ORDER BY Record_Date DESC, Record_Time DESC;";
                $stmt = $conn->prepare($SQL);
                $stmt->execute();
                $all_data = $stmt->get_result();
                ?>

                <div class="card mb-4">
                    <div class="card-header">
                        <i class="fas fa-table me-1"></i>
                        Temperature DataTable
                    </div>
                    <div class="card-body">
                        <table id="datatablesSimple">
                            <thead>
                                <tr>
                                    <th>Record ID</th>
                                    <th>Record Date</th>
                                    <th>Record Time</th>
                                    <th>Temperature (°C)</th>
                                </tr>
                            </thead>
                            <tfoot>
                                <tr>
                                    <th>Record ID</th>
                                    <th>Record Date</th>
                                    <th>Record Time</th>
                                    <th>Temperature (°C)</th>
                                </tr>
                            </tfoot>
                            <tbody>
                                <?php foreach ($all_data as $row) { ?>
                                    <tr>
                                        <td><?php echo htmlspecialchars($row['Record_ID']) ?></td>
                                        <td><?php echo htmlspecialchars($row['Record_Date']) ?></td>
                                        <td><?php echo htmlspecialchars($row['Record_Time']) ?></td>
                                        <td><?php echo htmlspecialchars($row['Temperature']) . '°C' ?></td>
                                    </tr>
                                <?php } ?>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </main>

        <?php include 'assets/components/footer.php' ?>
    </div>
    </div>

    <!-- Scripts -->
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/js/bootstrap.bundle.min.js" crossorigin="anonymous"></script>
    <script src="js/scripts.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.9.4/Chart.js"></script>

    <!-- Pie Chart Script -->
    <script>
        var yValues = [];
        var xValues = [];

        <?php foreach ($sensor_data as $row) {
            $temperature = (float)$row['Temperature'];
            $record_time = $row['Record_Time'];
        ?>
            yValues.push(<?php echo $temperature; ?>);
            xValues.push('<?php echo $record_time; ?>');
        <?php } ?>

        var barColors = [
            "#b91d47",
            "#00aba9",
            "#2b5797",
            "#e8c3b9",
            "#1e7145"
        ];

        new Chart("myChart", {
            type: "pie",
            data: {
                labels: xValues,
                datasets: [{
                    backgroundColor: barColors,
                    data: yValues
                }]
            },
            options: {
                title: {
                    display: true,
                    text: "Latest Temperature (°C) Comparison Chart"
                }
            }
        });
    </script>

    <!-- Bar Chart Script -->
    <script>
        var yValues2 = [];
        var xValues2 = [];

        <?php foreach ($sensor_data as $row) {
            $temperature = (float)$row['Temperature'];
            $time = $row['Record_Time'];
        ?>
            yValues2.push(<?php echo $temperature; ?>);
            xValues2.push('<?php echo $time; ?>');
        <?php } ?>

        var barColors = ["red", "green", "blue", "orange", "brown"];

        new Chart("myChart2", {
            type: "bar",
            data: {
                labels: xValues2,
                datasets: [{
                    backgroundColor: barColors,
                    data: yValues2
                }]
            },
            options: {
                legend: {
                    display: false
                },
                title: {
                    display: true,
                    text: "Latest Temperature (°C) Bar Chart"
                },
                scales: {
                    yAxes: [{
                        scaleLabel: {
                            display: true,
                            labelString: 'Temperature (°C)'
                        }
                    }],
                    xAxes: [{
                        display: true,
                        scaleLabel: {
                            display: true,
                            labelString: 'Capture Time'
                        }
                    }]
                }
            }
        });
    </script>

    <!-- Line Chart Script -->
    <script>
        var xValues3 = [];
        var yValues3 = [];

        <?php foreach ($sensor_data as $row) {
            $temperature = (float)$row['Temperature'];
            $time = $row['Record_Time'];
        ?>
            xValues3.push('<?php echo $time; ?>');
            yValues3.push(<?php echo $temperature; ?>);
        <?php } ?>

        new Chart("areaChart", {
            type: "line",
            data: {
                labels: xValues3,
                datasets: [{
                    fill: false,
                    lineTension: 0,
                    backgroundColor: "rgba(255,99,132,1.0)",
                    borderColor: "rgba(255,99,132,0.8)",
                    data: yValues3
                }]
            },
            options: {
                legend: {
                    display: false
                },
                scales: {
                    yAxes: [{
                        ticks: {
                            min: 0,
                            max: 50
                        },
                        scaleLabel: {
                            display: true,
                            labelString: 'Temperature (°C)'
                        }
                    }],
                    xAxes: [{
                        display: true,
                        scaleLabel: {
                            display: true,
                            labelString: 'Capture Time'
                        }
                    }]
                }
            }
        });
    </script>

    <!-- DataTables Scripts -->
    <script src="https://cdn.jsdelivr.net/npm/simple-datatables@7.1.2/dist/umd/simple-datatables.min.js" crossorigin="anonymous"></script>
    <script src="js/datatables-simple-demo.js"></script>

</body>
</html>