<?php
    require_once __DIR__ . '/../keys.php';

    $servername = $keys->db->servername;
    $username = $keys->db->username;
    $password = $keys->db->password;
    $dbname = $keys->db->dbname;

    require_once __DIR__ . '/github_manager.php';

    $conn = new mysqli($servername, $username, $password, $dbname);
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    $sql = "SELECT projects, updated_at FROM projects";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {
            $date = new DateTime((string)$row["updated_at"]);
            $now = new DateTime((string)date("Y-m-d H:i:s"));
            $diff = $date->diff($now);
            if($diff->y > 0 || $diff->m > 0 || $diff->d > 0 || $diff->h > 0 || $diff->i > 2 || true){
                $manager = new GitHubManager();
                $str = json_encode($manager->getProjects());
                updateData($str);
            }
            break;
        }
    }else{
        $manager = new GitHubManager();
        $str = json_encode($manager->getProjects());
        insertData($str);
    }
    $conn->close();

    function updateData($str){
        global $conn;
        $stmt = $conn->prepare("UPDATE projects SET projects=?, updated_at=NOW() WHERE 1=1");
        $stmt->bind_param("s", $str);
        $stmt->execute();
    }

    function insertData($str){
        global $conn;
        $stmt = $conn->prepare("INSERT INTO projects (projects, updated_at) VALUES (?, NOW())");
        $stmt->bind_param("s", $str);
        $stmt->execute();
    }
?>






















