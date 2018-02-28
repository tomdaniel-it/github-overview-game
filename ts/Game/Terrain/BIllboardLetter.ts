import Visualizable from "../Visualizable.js";
import Billboard from "./Billboard.js";
import ViewPort from "../ViewPort.js";
import Screen from "../Screen.js";
import Movable from "../Movable.js";
import { default_settings } from "../../DefaultSettings.js";

export default class BillboardLetter implements Visualizable, Movable {
    id:number;
    x:number;
    y:number;
    width:number;
    height:number = default_settings.game.billboard.letter_height;
    sprite:HTMLImageElement;
    letter:string;
    billboard:Billboard;
    isEmpty:boolean = false;
    spriteLoaded:boolean = false;
    viewPort:ViewPort;
    letterDistance:number = default_settings.game.billboard.letter_distance;
    spaceWidth:number = default_settings.game.billboard.letter_space_width;

    constructor(id:number, letter:string, billboard:Billboard){
        this.id = id;
        if(/^[a-zA-Z]$/.test(letter)){
            this.letter = letter.toUpperCase();
        }else{
            this.letter = " ";
            this.isEmpty = true;
        }
        this.billboard = billboard;
        this.defineSprite();
    }

    private defineSprite() {
        let loadPosAndSizes = ()=>{
            if(this.id === 0){
                if(!this.isEmpty) this.spriteLoaded = true;
                this.width = this.isEmpty ? this.spaceWidth : (this.height / this.sprite.height) * this.sprite.width;
                this.x = Math.round(this.billboard.getX() + default_settings.game.billboard.letter_start_margin);
                this.y = Math.round(this.billboard.getY() + ((this.billboard.getHeight() - this.height) / 2));
            }else{
                let interval = setInterval(()=>{
                    let previousLetter = <BillboardLetter>this.billboard.getPreviousLetter(this);
                    if(previousLetter.getX() === undefined || previousLetter.getX() === null || previousLetter.getWidth() === undefined || previousLetter.getWidth() === null) return;
                    clearInterval(interval);
                    if(!this.isEmpty) this.spriteLoaded = true;
                    this.width = this.isEmpty ? this.spaceWidth : (this.height / this.sprite.height) * this.sprite.width;
                    this.x = Math.round(previousLetter.getX() + previousLetter.getWidth() + this.letterDistance);
                    this.y = Math.round(this.billboard.getY() + ((this.billboard.getHeight() - this.height) / 2));
                }, 10);
            }
        };
        if(!this.isEmpty){
            this.sprite = new Image();
            this.sprite.src = "Images/BillboardFont/" + this.letter + ".png";
            this.sprite.onload = (() => {
                loadPosAndSizes();
            }).bind(this);
        }else{
            loadPosAndSizes();
        }
    }

    draw(context:CanvasRenderingContext2D){
        if(this.isEmpty) return;
        if(this.x + this.width < this.billboard.getX() || this.x > this.billboard.getX() + this.billboard.getWidth()) return;
        if(this.viewPort === null || this.viewPort === undefined) this.viewPort = Screen.getInstance().getViewPort();
        context.beginPath();
        let startClipx = (this.x < this.billboard.getX() + this.billboard.border_size ? this.sprite.width - (((this.x+this.width)-(this.billboard.x+this.billboard.border_size)) / this.width) * this.sprite.width : 0);
        let startClipy = 0;
        let widthClip = (this.x + this.width > this.billboard.x + this.billboard.width - this.billboard.border_size ? (((this.billboard.x+this.billboard.width-this.billboard.border_size) - this.x) / this.width) * this.sprite.width : this.sprite.width);
        let heightClip = this.sprite.height;
        let x = this.viewPort.calculateX(this.x < this.billboard.getX() + this.billboard.border_size ? this.billboard.x + this.billboard.border_size : this.x);
        let y = this.y;
        let width = this.x + this.width > this.billboard.x + this.billboard.width - this.billboard.border_size ? (this.billboard.x + this.billboard.width - this.billboard.border_size) - this.x : this.width;
        let height = this.height;
        context.drawImage(this.sprite, startClipx, startClipy, widthClip, heightClip, x, y, width, height);
    }

    move(){
        this.x--;
        if(this.x + this.width < this.billboard.x + this.billboard.border_size){
            let previousLetter = (<BillboardLetter>this.billboard.getPreviousLetter(this, true));
            this.x = previousLetter.x + previousLetter.width + (this.id === 0 ? default_settings.game.billboard.letter_repeat_loop_margin : default_settings.game.billboard.letter_distance);
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

    equals(otherLetter:BillboardLetter):boolean{
        return this.id === otherLetter.id;
    }
}