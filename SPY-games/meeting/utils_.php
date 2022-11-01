<?php
    header('Access-Control-Allow-Origin: https://yann.wysigot.com/');

    $con = mysqli_connect("host","username","password","table");
    if (isset($_GET['add'])) {
        $w1 = $_GET['w1'];
        $w2 = $_GET['w2'];
        $w3 = $_GET['w3'];
        $w4 = $_GET['w4'];
        $w5 = $_GET['w5'];
        $w6 = $_GET['w6'];
        $sql = "INSERT INTO `insider`(`word1`, `word2`, `word3`, `word4`, `word5`, `word6`) VALUES ('$w1', '$w2', '$w3', '$w4', '$w5', '$w6')";
        mysqli_query($con,$sql);
    } else if (isset($_GET['rand'])) {
        $imax = $_GET['rand'];
        for ($i = 0; $i < $imax; $i++) {
            $result = mysqli_query($con, "SELECT * FROM insider ORDER BY RAND() LIMIT 1");
            while($row = mysqli_fetch_array($result)) {
                $words = utf8_encode($row['word1'])."||//".utf8_encode($row['word2'])."||//".utf8_encode($row['word3'])."||//".utf8_encode($row['word4'])."||//".utf8_encode($row['word5'])."||//".utf8_encode($row['word6']);
                echo $words.'&&';
            }
        }
    } else if (isset($_GET['ping'])) {
        echo "pong";
    }
?>