import Visualizable from "../Visualizable.js";
import Billboard from "./Billboard.js";
import ViewPort from "../ViewPort.js";
import Screen from "../Screen.js";

export default class BillboardLetter implements Visualizable {
    id:number;
    x:number;
    y:number;
    width:number;
    height:number;
    sprite:HTMLImageElement;
    letter:string;
    billboard:Billboard;
    isEmpty:boolean = false;
    spriteLoaded:boolean = false;
    viewPort:ViewPort;
    letterDistance:number = 5;

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
        if(this.isEmpty) return;
        this.sprite = new Image();
        this.sprite.src = "Images/BillboardFont/" + this.letter + ".png";
        this.sprite.onload = (() => {
            this.height = 40;
            if(this.id === 0){
                this.spriteLoaded = true;
                this.width = this.isEmpty ? 40 : (this.height / this.sprite.height) * this.sprite.width;
                this.x = Math.round(this.billboard.getX() + 20);
                this.y = Math.round(this.billboard.getY() + ((this.billboard.getHeight() - this.height) / 2));
            }else{
                let interval = setInterval(()=>{
                    let previousLetter = <BillboardLetter>this.billboard.getPreviousLetter(this);
                    if(previousLetter.getX() === undefined || previousLetter.getX() === null || previousLetter.getWidth() === undefined || previousLetter.getWidth() === null) return;
                    clearInterval(interval);
                    this.spriteLoaded = true;
                    this.width = this.isEmpty ? 40 : (this.height / this.sprite.height) * this.sprite.width;
                    this.x = Math.round(previousLetter.getX() + previousLetter.getWidth() + this.letterDistance);
                    this.y = Math.round(this.billboard.getY() + ((this.billboard.getHeight() - this.height) / 2));
                }, 10);
            }
        }).bind(this);
    }

    draw(context:CanvasRenderingContext2D){
        if(this.isEmpty) return;
        if(this.viewPort === null || this.viewPort === undefined) this.viewPort = Screen.getInstance().getViewPort();
        context.beginPath();
        context.drawImage(this.sprite, 0, 0, this.sprite.width, this.sprite.height, this.viewPort.calculateX(this.x), this.y, this.width, this.height);
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