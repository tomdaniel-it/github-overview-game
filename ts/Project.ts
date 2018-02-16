import InformationObject from "./InformationObject.js";

export default class Project implements InformationObject {
    title:string;
    created_at: Date;
    updated_at: Date;
    language: string;
    description: string;
    image_url: string;
    project_url: string;

    constructor(title:string, created_at:Date, updated_at:Date, language:string, description:string="", image_url:string="", project_url:string){
        this.title = title;
        this.created_at = created_at;
        this.updated_at = updated_at;
        this.language = language;
        this.description = description;
        this.image_url = image_url;
        this.project_url = project_url;
    }

    setDescription(description:string){
        this.description = description;
    }

    setImageUrl(image_url:string){
        this.image_url = image_url;
    }

    getTitle(){
        return this.title;
    }

    getDescription(){
        return this.description;
    }

    getImageUrl(){
        return this.image_url;
    }
}