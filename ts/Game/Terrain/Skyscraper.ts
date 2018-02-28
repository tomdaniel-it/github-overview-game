import Visualizable from "../Visualizable.js";
import Solid from "../Solid.js";
import Screen from "../Screen.js";
import Expandable from "../Expandable.js";
import Crate from "./Crate.js";
import { default_settings } from "../../DefaultSettings.js";
import ViewPort from "../ViewPort.js";
import Billboard from "./Billboard.js";
import Movable from "../Movable.js";

export default class Skyscraper implements Visualizable, Solid {
    id:number;
    x:number;
    y:number;
    width:number;
    height:number;
    crate:Crate|null;
    billboard:Billboard|null;
    previousSkyscraper:Skyscraper|null;
    color:String;
    viewPort:ViewPort;
    sprite:HTMLImageElement;
    spriteLoaded:boolean;

    constructor(previousSkyscraper:Skyscraper|null=null, crate:Crate|null=null, billboard:Billboard|null=null){
        this.previousSkyscraper = previousSkyscraper;
        this.setId();
        if(this.previousSkyscraper === null){
            //First skyscraper
            this.defineRandomSize();
        }else{
            //Define x, y, width, height based on previous skyscraper so player can jump back and forth
            this.defineSize();
        }
        this.spriteLoaded = false;
        this.defineSprite();
        this.crate = crate;
        this.billboard = billboard;
        if(this.crate !== null) this.crate.setSkyscraper(this);
        if(this.billboard !== null) this.billboard.setSkyscraper(this);
    }

    private setId():void{
        if(this.previousSkyscraper === null){
            this.id = 1;
        }else{
            this.id = this.previousSkyscraper.getId() + 1;
        }
    }

    getId():number{
        return this.id;
    }

    defineRandomSize(){
        this.width = 300;
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
        this.width = 300;
        let heightDifference = Math.floor(Math.random()*(default_settings.game.skyscraper_max_height_difference-default_settings.game.skyscraper_min_height_difference+1)+ default_settings.game.skyscraper_min_height_difference);
        heightDifference *= Math.floor(Math.random()*2) == 1 ? 1 : -1;
        this.height = previousSkyscraper.height + heightDifference;
        this.x = previousSkyscraper.x + previousSkyscraper.width + default_settings.game.skyscraper_space_inbetween;
        this.y = Screen.getInstance().getHeight() - this.height;
    }

    draw(context:CanvasRenderingContext2D){
        if(!this.spriteLoaded) return;
        if(this.viewPort === null || this.viewPort === undefined) this.viewPort = Screen.getInstance().getViewPort();
        context.beginPath();
        context.drawImage(this.sprite, 0, 0, this.sprite.width, (this.height/(this.width/this.sprite.width)>this.sprite.height?this.sprite.height:this.height/(this.width/this.sprite.width)), this.viewPort.calculateX(this.x), this.y, this.width, this.height);
        if(this.crate !== null) this.crate.draw(context);
        if(this.billboard !== null) this.billboard.draw(context);
    }

    redefinePosition(widthDiff:number, heightDiff:number){
        this.y = Screen.getInstance().getHeight() - this.height;
        if(this.crate !== null) this.crate.redefinePosition(widthDiff, heightDiff);
    }

    private defineSprite() {
        this.sprite = new Image();
        this.sprite.src = "Images/Skyscraper/skyscraper" + (this.id%default_settings.images.skyscraper_amount) + ".png";
        this.sprite.onload = (() => { this.spriteLoaded = true; }).bind(this);
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

    isSolid(){
        return true;
    }

    getMovableElements():Array<Movable>{
        if(this.crate === null) return new Array<Movable>();
        if(this.billboard === null) return new Array<Movable>();
        return this.crate.getMovableElements().concat(this.billboard.getMovableElements());
    }
}