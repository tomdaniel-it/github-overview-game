import Visualizable from "../Visualizable.js";
import Solid from "../Solid.js";
import Screen from "../Screen.js";
import Expandable from "../Expandable.js";
import { default_settings } from "../../DefaultSettings.js";
import ViewPort from "../ViewPort.js";
import Billboard from "./Billboard.js";
import Movable from "../Movable.js";
import Button from "./Button.js";
import Game from "../Game.js";

export default class Skyscraper implements Visualizable, Solid {
    id:number;
    x:number;
    y:number;
    originalHeight:number;
    width:number = 300;
    height:number;
    button:Button|null;
    billboard:Billboard|null;
    previousSkyscraper:Skyscraper|null;
    color:String;
    viewPort:ViewPort;
    sprite:HTMLImageElement;
    spriteLoaded:boolean;

    minHeight:number;
    maxHeight:number;

    constructor(previousSkyscraper:Skyscraper|null=null, button:Button|null=null, billboard:Billboard|null=null){
        this.previousSkyscraper = previousSkyscraper;
        this.setId();
        this.defineHeightRange();
        if(this.previousSkyscraper === null){
            //First skyscraper
            this.defineRandomSize();
        }else{
            //Define x, y, width, height based on previous skyscraper so player can jump back and forth
            this.defineSizeAndPos();
        }
        this.spriteLoaded = false;
        this.defineSprite();
        this.button = button;
        this.billboard = billboard;
        if(this.button !== null) this.button.setSkyscraper(this);
        if(this.billboard !== null) this.billboard.setSkyscraper(this);
        setTimeout(this.initializePlayerCollisionListener.bind(this), 1);
    }

    private initializePlayerCollisionListener(){
        let game = Game.getInstance();
        game.player.setCollisionListener(this, (()=>{
            game.player.setY(this.y - game.player.getHeight());
        }).bind(this), (()=>{}).bind(this), true);
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

    defineHeightRange(){
        let screen = Screen.getInstance();
        if(screen.getWidth() > screen.getHeight()){
            //LANDSCAPE
            if(screen.getHeight()/screen.getWidth() <= 0.60){
                this.minHeight = 0.30 * screen.getHeight();
                this.maxHeight = 0.55 * screen.getHeight();
            }else{
                this.minHeight = 0.25 * screen.getHeight();
                this.maxHeight = 0.45 * screen.getHeight();
            }
        }else{
            //PORTRET
                this.maxHeight = 0.70 * screen.getHeight();
            if(screen.getHeight()/screen.getWidth() >= 90){
                this.minHeight = 0.30 * screen.getHeight();
            }else{
                this.minHeight = 0.40 * screen.getHeight();
            }
        }
    }

    defineRandomSize(){
        this.height = Math.floor(Math.random()*(this.maxHeight-this.minHeight+1)+this.minHeight);
        this.originalHeight = this.height;
        this.x = default_settings.game.window_margin_horizontal;
        this.y = Screen.getInstance().getHeight() - this.height;
    }

    defineSizeAndPos(){
        if(this.previousSkyscraper === null){
            this.defineRandomSize();
            return;
        }
        let previousSkyscraper = <Skyscraper> this.previousSkyscraper;
        let heightDifference = 0;
        while(true){
            heightDifference = Math.floor(Math.random()*(default_settings.game.skyscraper_max_height_difference-default_settings.game.skyscraper_min_height_difference+1)+ default_settings.game.skyscraper_min_height_difference);
            heightDifference *= Math.floor(Math.random()*2) == 1 ? 1 : -1;
            if(previousSkyscraper.height + heightDifference > this.minHeight && previousSkyscraper.height + heightDifference < this.maxHeight) break;
        }
        this.height = previousSkyscraper.height + heightDifference;
        this.originalHeight = this.height;
        this.x = previousSkyscraper.x + previousSkyscraper.width + default_settings.game.skyscraper_space_inbetween;
        this.y = Screen.getInstance().getHeight() - this.height;
    }

    draw(context:CanvasRenderingContext2D){
        if(!this.spriteLoaded) return;
        if(this.viewPort === null || this.viewPort === undefined) this.viewPort = Screen.getInstance().getViewPort();
        if(this.button !== null) this.button.draw(context);
        context.beginPath();
        context.drawImage(this.sprite, 0, 0, this.sprite.width, (this.height/(this.width/this.sprite.width)>this.sprite.height?this.sprite.height:this.height/(this.width/this.sprite.width)), this.viewPort.calculateX(this.x), this.y, this.width, this.height);
        if(this.billboard !== null) this.billboard.draw(context);
    }

    redefinePosition(widthDiff:number, heightDiff:number){
        //this.height += heightDiff;
        this.defineHeightRange();
        if(this.height < this.minHeight){
            this.height = this.minHeight;
        }else if(this.height > this.maxHeight){
            this.height = this.maxHeight;
        }else if(this.originalHeight > this.minHeight && this.originalHeight < this.maxHeight){
            this.height = this.originalHeight;
        }else{
            this.height += heightDiff;
        }
        this.y = Screen.getInstance().getHeight() - this.height;
        if(this.button !== null) this.button.redefinePosition(widthDiff, heightDiff);
        if(this.billboard !== null) this.billboard.redefinePosition();
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
        if(this.button === null) return new Array<Movable>();
        if(this.billboard === null) return new Array<Movable>();
        return this.button.getMovableElements().concat(this.billboard.getMovableElements());
    }
}