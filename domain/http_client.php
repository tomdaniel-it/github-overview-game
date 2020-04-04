<?php
    ini_set("allow_url_fopen", 1);
    ini_set('user_agent', 'Mozilla/5.0');

    class HttpClient {
        public $url;
        public $format;
        public $authHeaderValue;
        private $contextGET;
        private $contextHEAD;

        function __construct($url, $format, $authHeaderValue = NULL){
            $this->url = $url;
            $this->format = $format;
            $this->authHeaderValue = $authHeaderValue;
            $this->constructContexts();
        }

        function send(){
            $http_code = $this->get_http_response_code($this->url);
            if($http_code != 200){
                return false;
            }
            
            $json = file_get_contents($this->url, false, $this->contextGET);
            if(!$json){
                return false;
            }else{
                $obj = json_decode($json);
                return $obj;
            }
        }

        function get_http_response_code($url) {
            file_get_contents($this->url, false, $this->contextHEAD);
            return intval(explode(" ", $http_response_header[0])[1]);
        }

        private function constructContexts() {
            if ($this->authHeaderValue !== NULL) {
              $opts = array(
                'http'=>array(
                  'method'=>"GET",
                  'header'=>"Authorization: " . $this->authHeaderValue . "\r\n"
                )
              );
              $this->contextGET = stream_context_create($opts);
  
              $opts = array(
                'http'=>array(
                  'method'=>"HEAD",
                  'header'=>"Authorization: " . $this->authHeaderValue . "\r\n"
                )
              );
              $this->contextHEAD = stream_context_create($opts);
            } else {
              $opts = array(
                'http'=>array(
                  'method'=>"GET",
                )
              );
              $this->contextGET = stream_context_create($opts);
  
              $opts = array(
                'http'=>array(
                  'method'=>"HEAD",
                )
              );
              $this->contextHEAD = stream_context_create($opts);
            }
        }
    }

