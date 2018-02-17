import Visualizable from "../Visualizable.js";
import Solid from "../Solid.js";
import Screen from "../Screen.js";
import Expandable from "../Expandable.js";
import Crate from "./Crate.js";
import { default_settings } from "../../DefaultSettings.js";
import ViewPort from "../ViewPort.js";

export default class Skyscraper implements Visualizable, Solid {
    x:number;
    y:number;
    width:number;
    height:number;
    crate:Crate|null;
    previousSkyscraper:Skyscraper|null;
    color:String;
    viewPort:ViewPort;

    constructor(previousSkyscraper:Skyscraper|null=null, crate:Crate|null=null){
        this.previousSkyscraper = previousSkyscraper;
        if(this.previousSkyscraper === null){
            //First skyscraper
            this.defineRandomSize();
        }else{
            //Define x, y, width, height based on previous skyscraper so player can jump back and forth
            this.defineSize();
        }
        this.defineColor();
        this.crate = crate;
        if(this.crate !== null) this.crate.setSkyscraper(this);
    }

    defineRandomSize(){
        this.width = 200;
        this.height = 400;
        this.x = default_settings.game.window_margin_horizontal;
        this.y = Screen.getInstance().getHeight() - this.height;
    }

    defineSize(){
        if(this.previousSkyscraper === null){
            this.defineRandomSize();
            return;
        }
        let previousSkyscraper = <Skyscraper> this.previousSkyscraper;
        this.width =200;
        let heightDifference = Math.floor(Math.random()*(default_settings.game.skyscraper_max_height_difference-default_settings.game.skyscraper_min_height_difference+1)+ default_settings.game.skyscraper_min_height_difference);
        heightDifference *= Math.floor(Math.random()*2) == 1 ? 1 : -1;
        this.height = previousSkyscraper.height + heightDifference;
        this.x = previousSkyscraper.x + previousSkyscraper.width + default_settings.game.skyscraper_space_inbetween;
        this.y = Screen.getInstance().getHeight() - this.height;
    }

    draw(context:CanvasRenderingContext2D){
        if(this.viewPort === null || this.viewPort === undefined) this.viewPort = Screen.getInstance().getViewPort();
        context.beginPath();
        context.rect(this.viewPort.calculateX(this.x), this.y, this.width, this.height);
        context.fillStyle = <string> this.color;
        context.fill();
        if(this.crate !== null) this.crate.draw(context);
    }

    redefinePosition(){
        this.y = Screen.getInstance().getHeight() - this.height;
    }

    private defineColor() {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
          color += letters[Math.floor(Math.random() * 16)];
        }
        this.color = color;
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