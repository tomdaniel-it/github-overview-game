<?php

    class Project
    {
        function __construct($title, $created_at, $updated_at, $language, $description="", $image_url="", $project_url)
        {
            $this->title = $title;
            $this->created_at = $created_at;
            $this->updated_at = $updated_at;
            $this->language = $language;
            $this->description = $description;
            $this->image_url = $image_url;
            $this->project_url = $project_url;
        }

        function setDescription($description){
            $this->description = $description;
        }

        function setImageUrl($image_url){
            $this->image_url = $image_url;
        }

        function getTitle(){
            return $this->title;
        }

        function getDescription(){
            return $this->description;
        }

        function getImageUrl(){
            return $this->image_url;
        }
    }