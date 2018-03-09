<?php
    require_once __DIR__ . '/../keys.php';
    require_once __DIR__ . '/../default_settings.php';

    class ProjectCache
    {
        function __construct(){

        }

        function getProjects(){
            global $keys, $default_settings;
            $conn = new mysqli($keys->db->servername, $keys->db->username, $keys->db->password, $keys->db->dbname);
            if ($conn->connect_error) {
                die("Connection failed: " . $conn->connect_error);
            }
        
            $sql = "SELECT projects, updated_at FROM projects";
            $result = $conn->query($sql);
        
            if ($result->num_rows > 0) {
                while($row = $result->fetch_assoc()) {
                    $projects = json_decode($row["projects"]);
                    $conn->close();
                    return $projects;
                }
            }else{
                file_get_contents($default_settings->server->url . '/domain/update_cache.php');
                return $this->getProjects();
            }
        }
    }
