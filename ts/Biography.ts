import Expandable from "./Game/Expandable.js";
import Visualizable from "./Game/Visualizable.js";
import InformationObject from "./InformationObject.js";

export default class Biography implements InformationObject {
    title:String;
    description:String;
    image_url:String;
    
    constructor(title:String="", description:String="", image_url:String=""){
        this.title = title;
        this.description = description;
        this.image_url = image_url;
    }

    setTitle(title:String=""){
        this.title = title;
    }

    setDescription(description:String){
        this.description = description;
    }

    setImageUrl(image_url:String){
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