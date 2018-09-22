<?php
    require_once __DIR__ . '/../default_settings.php';
    require_once __DIR__ . '/../keys.php';
    require_once __DIR__ . '/http_client.php';
    require_once __DIR__ . '/project.php';


    class GitHubManager
    {
        private $projects;

        function __construct()
        {
            $this->projects = [];
            $this->initializeProjects();
        }

        private function initializeProjects(){
            $request = new GitHubRequest_All();
            $request->send();
            $response = $request->getResponse();

            $results = [];

            for($i=0;$i<count($response);$i++){
                $item = $response[$i];
                array_push($this->projects, new Project($item->name, $item->created_at, $item->updated_at, $item->language, null, null, $item->html_url));
                $req = new GitHubRequest_Project($item->name);
                array_push($results, $req->get());
            }

            for($i=0;$i<count($results);$i++){
                if(!is_object($this->projects[$i])||!is_object($results[$i])) continue;
                $this->projects[$i]->description = $results[$i]->description;
                $this->projects[$i]->image_url = $results[$i]->image_url;
            }

            $tmp = [];
            for($i=0;$i<count($this->projects);$i++){
                if(strlen($this->projects[$i]->description) != 0){
                    array_push($tmp, $this->projects[$i]);
                }
            }
            $this->projects = $tmp;
        }

        function getProjects(){
            return $this->projects;
        }
    }

    class GitHubRequest_All {
        private $format;
        private $url;
        private $response;
        private $status;

        function __construct()
        {
            $this->format = "JSON";
            $this->response = null;
            $this->status = false;
            $this->constructUrl();
        }

        function send(){
            $httpClient = new HttpClient($this->url, $this->format);
            $response = $httpClient->send();
            if(!$response){
                return;
            }
            $this->status = true;
            $this->response = $response;
        }

        function getStatus(){
            return $this->status;
        }

        function getResponse(){
            return $this->response;
        }

        private function constructUrl(){
            global $default_settings, $keys;
            $this->url = $default_settings->github->api_url . "/users/" . $default_settings->github->user . "/repos" . "?client_id=" . $keys->github_api_client_id . "&client_secret=" . $keys->github_api_client_secret;
        }
    }

    class GitHubRequest_Project {
        private $format;
        private $url;
        private $project_name;

        function __construct($project_name)
        {
            $this->format = "JSON";
            $this->project_name = $project_name;
            $this->constructUrl();
        }

        function get(){
            $httpClient = new HttpClient($this->url, $this->format);
            $response = $httpClient->send();
            if(!$response){
                return null;
            }
            $httpClient2 = new HttpClient($response->download_url, $this->format);
            $response2 = $httpClient2->send();
            return ($response2?$response2:null);
        }

        private function constructUrl(){
            global $default_settings, $keys;
            $this->url = $default_settings->github->api_url . "/repos/" . $default_settings->github->user . "/" . $this->project_name . "/contents/" . $default_settings->github->info_file_name . "?client_id=" . $keys->github_api_client_id . "&client_secret=" . $keys->github_api_client_secret;
        }
    }