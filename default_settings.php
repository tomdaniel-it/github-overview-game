<?php
    $default_settings = new stdClass();

    $default_settings->github = new stdClass();
    $default_settings->github->user = "tomdaniel-it";
    $default_settings->github->api_url = "https://api.github.com";
    $default_settings->github->info_file_name = "GitHub-Overview-Info.json"; //THE NAME OF THE FILE REQUIRED IN THE ROOT OF EACH REPOSITORY

    $default_settings->server = new stdClass();
    $default_settings->server->url = "http://localhost/github-overview-game"; //"http:" required!
    $default_settings->server->use_cache = true;
    //USING CACHE REQUIRES A DATABASE CONNECTION (CONFIGURED IN keys.php)
    //THIS PREVENTS SPAM ON GITHUB API ACCOUNT (ANY USER COULD SPAM REQUESTS TO REACH THE GITHUB API RATE LIMIT, BLOCKING THE API ACCOUNT FOR A CERTAIN TIME)