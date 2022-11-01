<?php
    //header('Access-Control-Allow-Origin: https://yann.wysigot.com/');
    $host = $_SERVER['HTTP_HOST'];
    if ('yann.wysigot.com' == 'yann.wysigot.com') {
        $con = mysqli_connect("host","username","password","table");
        if (isset($_GET['add'])) {
            $w1 = $_GET['w1'];
            $w2 = $_GET['w2'];
            $w3 = $_GET['w3'];
            $w4 = $_GET['w4'];
            $w5 = $_GET['w5'];
            $sql = "INSERT INTO `undernou`(`word1`, `word2`, `word3`, `word4`, `word5`, `isFromUser`) VALUES ('$w1', '$w2', '$w3', '$w4', '$w5', 1)";
            mysqli_query($con,$sql);
        } else if (isset($_GET['get'])) {
            $list = array();
            $result = mysqli_query($con, "SELECT * FROM `undernou` WHERE 1");
            while($row = mysqli_fetch_array($result)) {
                $words = '{"word1":"'.$row['word1'].'","word2":"'.$row['word2'].'","word3":"'.$row['word3'].'","word4":"'.$row['word4'].'","word5":"'.$row['word5'].'"}';
                array_push($list, $words);
            }
            echo json_encode($list);
        } else if (isset($_GET['rand'])) {
            $imax = $_GET['rand'];
            for ($i = 0; $i < $imax; $i++) {
                $result = mysqli_query($con, "SELECT * FROM undernou WHERE `dis` = 0 ORDER BY RAND() LIMIT 1");
                while($row = mysqli_fetch_array($result)) {
                    $words = utf8_encode($row['word1'])."||//".utf8_encode($row['word2'])."||//".utf8_encode($row['word3'])."||//".utf8_encode($row['word4'])."||//".utf8_encode($row['word5']);
                    echo $words.'&&';
                }
            }
        } else if (isset($_GET['ping'])) {
            echo "pong";
        }
    } else {
        if (isset($_GET['rand'])) {
            $imax = $_GET['rand'];
            for ($i = 0; $i < $imax; $i++) {
            echo "Noix||//Amande||//Pistache||//Noisette||//Noix de cajou&&";
            }
        } 
    }
?>