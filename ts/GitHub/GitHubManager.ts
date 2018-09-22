import {default_settings} from "../DefaultSettings.js";
import Project from "../Project.js";
import { HttpClient } from "./HttpClient.js";
let counter = 0;

export default class GitHubManager {
    projects:Array<Project>;
    projectsLoaded:boolean = false;

    constructor(){
        this.projects = new Array<Project>();
        this.initializeProjects();
    }

    private initializeProjects(){
        if (counter > 0) return;
        let request3 = new GitHubRequest();
        request3.send();
        (<Array<Object>>JSON.parse(request3.getResponseText())).forEach(((value:Object)=>{
            let res = <GitHubResponse> value;
            this.projects.push(new Project(res.title, new Date(res.created_at), new Date(res.updated_at), res.language, res.description, res.image_url, res.project_url));
        }).bind(this));
        this.projectsLoaded = true;
    }

    getProjectsLoaded():boolean{
        return this.projectsLoaded;
    }

    getProjects():Array<Project>{
        return this.projects;
    }
}

class GitHubRequest{
    status:number;
    responseText:string;
    format:string;
    async:boolean;
    url:string;
    callback:Function;

    constructor(){
        this.format = "JSON";
        this.async = false;
        this.constructUrl();
        this.callback = ()=>{};
    }

    send(){
        ++counter;
        let httpClient = new HttpClient(this.url, this.callback, this.format, this.async);
        let httpClientResponse = httpClient.send();
        this.responseText = httpClientResponse.responseText;
        this.status = httpClientResponse.status;
    }

    getResponseText():string{
        return this.responseText;
    }

    getStatus():number{
        return this.status;
    }

    private constructUrl(){
        if(default_settings.server.url === "localhost" || default_settings.server.url === "localhost/"){
            this.url = "/projects.php";
        }else{
            this.url = default_settings.server.url + "/projects.php";
            this.url = this.url.replace(/\\\/\\\//g, '/');
            this.url = "http://" + this.url;
        }
    }
}

interface GitHubResponse {
    created_at:string;
    description:string;
    title:string;
    language:string;
    image_url:string;
    project_url:string;
    updated_at:string;
}