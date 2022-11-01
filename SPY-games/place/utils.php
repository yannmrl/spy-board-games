<?php
    header('Access-Control-Allow-Origin: https://yann.wysigot.com/');

    $con = mysqli_connect("host","username","password","table");
    if (isset($_GET['add'])) {
        $w = $_GET['add'];
        $sql = "INSERT INTO `places`(`word`) VALUES ('$w')";
        mysqli_query($con,$sql);
    } else if (isset($_GET['rand'])) {
        $imax = $_GET['rand'];
        for ($i = 0; $i < $imax; $i++) {
            $result = mysqli_query($con, "SELECT `word` FROM places ORDER BY RAND() LIMIT 1");
            while($row = mysqli_fetch_array($result)) {
                echo utf8_encode($row['word']);
            }
        }
    } else if (isset($_GET['ping'])) {
        echo "pong";
    }
?>