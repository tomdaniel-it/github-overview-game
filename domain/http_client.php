<?php
    ini_set("allow_url_fopen", 1);
    ini_set('user_agent', 'Mozilla/5.0');

    class HttpClient {
        public $url;
        public $format;

        function __construct($url, $format){
            $this->url = $url;
            $this->format = $format;
        }

        function send(){
            $http_code = $this->get_http_response_code($this->url);
            if($http_code != 200){
                return false;
            }
            $json = file_get_contents($this->url);
            if(!$json){
                return false;
            }else{
                $obj = json_decode($json);
                return $obj;
            }
        }

        function get_http_response_code($url) {
            $headers = get_headers($url, 1);
            return substr($headers[0], 9, 3);
        }
    }

