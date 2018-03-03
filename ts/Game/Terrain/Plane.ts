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

    title_font_size:number = -1; //IN xPT (PX IS INACCURATE)
    title_start_x_percentage:number = 71.105;
    title_stop_x_percentage:number = 84.021;
    title_start_y_percentage:number = 48.496;
    title_stop_y_percentage:number = 54.225;

    description_font_size:number = -1; //IN xPT (PX IS INACCURATE)
    description_start_x_percentage:number = 1.598;
    description_stop_x_percentage:number = 52.730;
    description_start_y_percentage:number = 8.451;
    description_stop_y_percentage:number = 91.549;

    description_lines:Array<string>;
    

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

        //PLANE
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
        this.sprite.onload = ((()=>{ this.definePosAndDimensions(); this.spriteLoaded = true; }).bind(this));
    }

    draw(context:CanvasRenderingContext2D){
        if(!this.spriteLoaded) return;
        if(!this.opened && !this.transforming) return;
        if(this.viewPort === undefined || this.viewPort === null) this.viewPort = Screen.getInstance().getViewPort();

        //DRAW IMAGE
        context.beginPath();
        context.drawImage(this.sprite, (this.sprite.width/this.spriteCount)*this.spriteAnimation, 0, this.sprite.width/this.spriteCount-1, this.sprite.height, this.viewPort.calculateX(this.x), this.y, this.width, this.height);

        //DRAW TITLE
        if(this.title_font_size === -1) this.defineTitleFont(context);
        context.beginPath();
        context.font = "bold " + this.title_font_size + "pt Arial";
        context.fillStyle = default_settings.game.plane.title_color;
        context.fillText(<string>this.informationObject.getTitle(), this.viewPort.calculateX(this.x + (this.title_start_x_percentage*this.width/100)), this.y + (this.title_start_y_percentage*this.height/100) + this.title_font_size);
        

        //DRAW DESCRIPTION
        if(this.description_font_size === -1) this.defineDescriptionFont(context);
        this.description_lines.forEach((line:string, index:number)=>{
            context.beginPath();
            context.font = this.description_font_size + "pt Arial";
            context.fillStyle = default_settings.game.plane.description_color;
            context.fillText(line, this.viewPort.calculateX(this.x + (this.description_start_x_percentage*this.width/100)), this.y + (this.description_start_y_percentage*this.height/100) + index*this.description_font_size + this.description_font_size + index*(this.description_font_size/1.5));
        });

    }

    private defineDescriptionLines(context:CanvasRenderingContext2D, font_size:number=this.description_font_size){
        let result = new Array<string>();
        let words = this.informationObject.getDescription().split(" ");
        let text_field_size = this.description_stop_x_percentage*this.width/100 - this.description_start_x_percentage*this.width/100;
        context.beginPath();
        context.font = font_size + "pt Arial";
        words.forEach((word:string, index:number)=>{
            if(result.length === 0 || result[result.length-1].length === 0){
                //FIRST WORD
                result.push(word);
                return;
            }else{
                //OTHER
                result[result.length-1] += " " + word;
            }
            if(context.measureText(result[result.length-1]).width > text_field_size){
                let line = "";
                let word_length = result[result.length-1].split(" ").length;
                result[result.length-1].split(" ").forEach((value:String, index:number)=>{
                    if(index === word_length-1) return;
                    line += (index===word_length-1?"":" ") + value;
                });
                result[result.length-1] = line;
                result.push(word);
            }
        });
        result.forEach((line:String, index:number)=>{
            result[index] = line.trim();
        });
        this.description_lines = result;
    }

    private defineTitleFont(context:CanvasRenderingContext2D){
        for(let size=Math.floor(this.title_stop_y_percentage*this.height/100 - this.title_start_y_percentage*this.height/100);size>0;size--){
            context.font = "bold " + size + "pt Arial";
            if(context.measureText(<string>this.informationObject.getTitle()).width > Math.floor(this.title_stop_x_percentage*this.width/100 - this.title_start_x_percentage*this.width/100)){
                continue;
            }else{
                this.title_font_size = size;
                return;
            }
        }
        console.log("something went wrong... couldn't define title font size");
    }

    private defineDescriptionFont(context:CanvasRenderingContext2D){
        //INCOMPLETE ! ! !
        this.description_font_size = 15;
        while(this.description_font_size>0){
            this.defineDescriptionLines(context);
            let total_height = this.description_lines.length*this.description_font_size + (this.description_lines.length-1)*(this.description_font_size/1.5);
            console.log(total_height + " < " + ((this.description_stop_y_percentage*this.height/100) - (this.description_start_y_percentage*this.height/100)));
            if(total_height < (this.description_stop_y_percentage*this.height/100) - (this.description_start_y_percentage*this.height/100)){
                return;
            }
            this.description_font_size--;
        }
    }

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