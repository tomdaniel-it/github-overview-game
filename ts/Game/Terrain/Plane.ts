import Visualizable from "../Visualizable.js";
import Movable from "../Movable.js";
import Expandable from "../Expandable.js";
import InformationObject from "../../InformationObject.js";
import ViewPort from "../ViewPort.js";
import Screen from "../Screen.js";
import { default_settings } from "../../DefaultSettings.js";
import Timer from "../Timer.js";
import Game from "../Game.js";

export default class Plane implements Visualizable, Movable, Expandable {
    x:number;
    y:number;
    width:number;
    height:number;
    informationObject:InformationObject;
    sprite:HTMLImageElement;
    spriteLoaded:boolean = false;
    viewPort:ViewPort;
    opened:boolean = false;
    transforming:boolean = false;
    spriteAnimation:number = 0;
    spriteCount:number = 4;
    spriteChanger:Timer;
    stopFlyX:number;
    restart:boolean = false;

    title_font_size:number = -1;
    title_start_x_percentage:number = 71.105;
    title_end_x_percentage:number = 84.021;
    title_start_y_percentage:number = 49.296;
    title_stop_y_percentage:number = 54.225;

    description_font_size:number = -1;
    description_start_x_percentage:number = 1.598;
    description_end_x_percentage:number = 52.730;
    description_start_y_percentage:number = 8.451;
    description_end_y_percentage:number = 91.549;
    

    constructor(informationObject:InformationObject){
        this.informationObject = informationObject;
        this.defineSprite();
        this.defineSpriteChanger();
    }

    private defineSpriteChanger(){
        this.spriteChanger = new Timer((()=>{
            if(!this.transforming) return;
            this.spriteAnimation++;
            if(this.spriteAnimation > this.spriteCount - 1) this.spriteAnimation = 0;
        }).bind(this), default_settings.game.plane.sprite_change_delay);
        this.spriteChanger.start();
    }

    private definePosAndDimensions(){
        this.height = default_settings.game.plane.height;
        this.width = (this.sprite.width / this.spriteCount) * (this.height / this.sprite.height);
        this.x = 0 - this.width - default_settings.game.plane.starting_pos_margin_from_screen;
        this.y = default_settings.game.plane.margin_top;
    }

    private resetPosition(){
        this.x = 0 - this.width - default_settings.game.plane.starting_pos_margin_from_screen;
    }

    private defineSprite(){
        this.sprite = new Image();
        this.sprite.src = "Images/Plane/plane_sprite.png";
        this.sprite.onload = ((()=>{ this.spriteLoaded = true; this.definePosAndDimensions() }).bind(this));
    }

    draw(context:CanvasRenderingContext2D){
        if(!this.spriteLoaded) return;
        if(!this.opened && !this.transforming) return;
        if(this.viewPort === undefined || this.viewPort === null) this.viewPort = Screen.getInstance().getViewPort();

        //DRAW IMAGE
        context.beginPath();
        context.drawImage(this.sprite, (this.sprite.width/this.spriteCount)*this.spriteAnimation, 0, this.sprite.width/this.spriteCount-1, this.sprite.height, this.viewPort.calculateX(this.x), this.y, this.width, this.height);

        //DRAW TITLE
        /*if(this.title_font_size === -1) this.defineTitleFont();
        context.font = "50px Arial";*/

        //DRAW DESCRIPTION
    }

    /*private defineTitleFont(){

    }*/

    move(){
        if(!this.transforming) return;
        if(this.opened){
            //LEAVING
            this.x += default_settings.game.plane.speed;
            let screen = Screen.getInstance();
            if(this.x > Game.getInstance().getWidth()){
                this.resetPosition();
                if(!this.restart){
                    this.transforming = false;
                }
                this.opened = false;
            }
        }else{
            //COMING UP
            if(this.x + this.width/2 + default_settings.game.plane.speed >= this.stopFlyX){
                this.x = this.stopFlyX - this.width/2;
                if(!this.restart){
                    this.restart = false;
                }
                this.transforming = false;
                this.opened = true;
            }else{
                this.x += default_settings.game.plane.speed;
            }
        }
        //Move A TON (calculate it) when off screen til on screen
    }

    expand(){
        if(!this.transforming){
            if(this.opened) return;
            this.transforming = true;
            let screen = Screen.getInstance();
            this.stopFlyX = screen.getViewPort().x + (screen.getWidth()/2);
        }else{
            if(this.opened){
                this.restart = true;
                let screen = Screen.getInstance();
                this.stopFlyX = screen.getViewPort().x + (screen.getWidth()/2);
            }else{
                return;
            }
        }
    }

    close(){
        this.restart = false;
        if(!this.transforming){
            if(!this.opened) return;
            this.transforming = true;
        }else{
            if(this.opened){
                return;
            }else{
                this.opened = true;
            }
        }
    }

    redefinePosition(){

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

    getMovableElements(){
        return new Array<Movable>();
    }
}