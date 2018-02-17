import Visualizable from "../Visualizable.js";
import Expandable from "../Expandable.js";
import InformationObject from "../../InformationObject.js";
import Skyscraper from "./Skyscraper.js";
import { default_settings } from "../../DefaultSettings.js";
import ViewPort from "../ViewPort.js";
import Screen from "../Screen.js";

export default class Crate implements Visualizable, Expandable {
    x:number;
    y:number;
    width:number;
    height:number;
    skyscraper:Skyscraper;
    viewPort:ViewPort;

    informationObject:InformationObject;

    constructor(informationObject:InformationObject){
        this.informationObject = informationObject;
        this.width = 40;
        this.height = 24;
    }

    setSkyscraper(skyscraper:Skyscraper){
        this.skyscraper = skyscraper;
        this.initializePosition();
    }

    initializePosition(){
        this.x = this.skyscraper.x + this.skyscraper.width - this.width - default_settings.game.crate_margin_right_of_edge;
        this.y = this.skyscraper.y - this.height;
    }

    draw(context:CanvasRenderingContext2D){
        if(this.viewPort === null || this.viewPort === undefined) this.viewPort = Screen.getInstance().getViewPort();
        context.beginPath();
        context.rect(this.viewPort.calculateX(this.x), this.y, this.width, this.height);
        context.fillStyle = "blue";
        context.fill();
    }

    expand(){

    }

    close(){

    }

    redefinePosition(){

    }

    getInformationObject(){
        return this.informationObject;
    }

    getX(){
        return this.x;
    }

    getY(){
        return this.y;
    }

    getWidth(){
        return this.width;
    }

    getHeight(){
        return this.height;
    }
}