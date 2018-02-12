import {HttpClient, HttpClientResponse} from "./HttpClient.js";
import {default_settings} from "../DefaultSettings.js";
import Project from "../Project.js";
import {keys} from "../Keys.js";

export default class GitHubManager {
    projects:Array<Project>;

    constructor(){
        this.projects = new Array<Project>();
        this.initializeProjects();
    }

    private async initializeProjects(){
        let request = new GitHubRequest_All();
        request.send();
        let responseText = request.getResponseText();
        let response:Array<GitHub_All_Response> = JSON.parse(responseText);
        
        let projectInfoRequests = [];

        for(let i=0;i<response.length;i++){
            let item = response[i];
            this.projects.push(new Project(item.name, item.created_at, item.updated_at, item.language, undefined, undefined, item.html_url));
            let request = new GitHubRequest_Project(item.name);
            projectInfoRequests.push(()=>request.get());
        }
        let results = await Promise.all(projectInfoRequests.map(request => request()));
        for(let i=0;i<this.projects.length;i++){
            let response:GitHub_Project_Info = JSON.parse(results[i]);
            this.projects[i].description = response.description;
            this.projects[i].image_url = response.image_url;
        }
    }

    getProjects():Array<Project>{
        return this.projects;
    }
}

abstract class GitHubRequest {
    url:string;
    format:string;
    async:boolean;
    callback:Function;

    constructor(){
        this.format = "JSON";
    }
}

class GitHubRequest_All extends GitHubRequest{
    status:number;
    responseText:string;

    constructor(){
        super();
        this.async = false;
        this.constructUrl();
    }

    send(){
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
        this.url = default_settings.github.api_url + "/users/" + default_settings.github.user + "/repos" + "?client_id=" + keys.github_api_client_id + "&client_secret="+keys.github_api_client_secret;
    }
}

class GitHubRequest_Project extends GitHubRequest {
    project_name:string;

    constructor(project_name:string){
        super();
        this.project_name = project_name;
        this.async = true;
        this.constructFileUrl();
    }

    get():Promise<string>{
        return new Promise((resolve, reject) => {
            let httpClientCallback = (status:number, responseText:string)=>{
                if(status === 404){
                    resolve(JSON.stringify({description:"", image_url:""}));
                    return;
                }
                let response:GitHub_Project_Response = JSON.parse(responseText);
                let httpClientCallback = (status:number, responseText:string)=>{
                    resolve(responseText);
                };
                let httpClient = new HttpClient(response.download_url + "?client_id=" + keys.github_api_client_id + "&client_secret="+keys.github_api_client_secret, httpClientCallback, this.format, this.async);
                httpClient.send();
            };

            let httpClient = new HttpClient(this.url, httpClientCallback, this.format, this.async);
            httpClient.send();
        });
    }

    private constructFileUrl(){
        this.url = default_settings.github.api_url + "/repos/" + default_settings.github.user + "/" + this.project_name + "/contents/" + default_settings.github.info_file_name + "?client_id=" + keys.github_api_client_id + "&client_secret="+keys.github_api_client_secret;
        //https://api.github.com/repos/tomdaniel-it/discordbot/contents/tmp.txt
    }
}

class Request_Test extends GitHubRequest {
    project_name:string;

    constructor(project_name:string){
        super();
        this.project_name = project_name;
        this.async = true;
        this.constructFileUrl();
    }

    get():Promise<string>{
        return new Promise((resolve, reject) => {
            let httpClientCallback = (status:number, responseText:string)=>{
                resolve(responseText);
            };

            let httpClient = new HttpClient(this.url, httpClientCallback, this.format, this.async);
            httpClient.send();
        });
    }

    private constructFileUrl(){
        this.url = default_settings.github.api_url + "/repos/" + default_settings.github.user + "/" + this.project_name + "/contents/" + default_settings.github.info_file_name + "?client_id=" + keys.github_api_client_id + "&client_secret="+keys.github_api_client_secret;
        //https://api.github.com/repos/tomdaniel-it/discordbot/contents/tmp.txt
        this.url = "https://jsonplaceholder.typicode.com/posts/"+this.project_name;
    }
}


interface GitHub_All_Response{
    name:string;
    created_at:Date;
    updated_at:Date;
    language:string;
    html_url:string;
}

interface GitHub_Project_Response{
    name:string;
    download_url:string;
}

interface GitHub_Project_Info{
    description:string;
    image_url:string;
}

interface Test_Response{
    userId:number;
    id:number;
    title:string;
    body:string;
}