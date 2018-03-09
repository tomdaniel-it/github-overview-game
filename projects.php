<?php
    require_once __DIR__ . '/default_settings.php';
    if($default_settings->server->use_cache){
        require_once __DIR__ . '/domain/project_cache.php';
        $cache = new ProjectCache();
        $projects = $cache->getProjects();
        echo(json_encode($projects));
    }else{
        require_once __DIR__ . '/domain/github_manager.php';
        $manager = new GitHubManager();
        $projects = $manager->getProjects();
        echo(json_encode($projects));
    }
?>