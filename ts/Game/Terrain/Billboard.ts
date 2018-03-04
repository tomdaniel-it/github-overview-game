import Visualizable from "../Visualizable.js";
import InformationObject from "../../InformationObject.js";
import Skyscraper from "./Skyscraper.js";
import ViewPort from "../ViewPort.js";
import Screen from "../Screen.js";
import BillboardLetter from "./BIllboardLetter.js";
import { default_settings } from "../../DefaultSettings.js";
import Movable from "../Movable.js";

export default class Billboard implements Visualizable {
    x:number;
    y:number;
    width:number;
    height:number;
    informationObject:InformationObject;
    skyscraper:Skyscraper;
    viewPort:ViewPort;
    border_size: number = 2;
    billboard_letters:Array<BillboardLetter>;

    constructor(informationObject:InformationObject, skyscraper:Skyscraper|null=null){
        this.informationObject = informationObject;
        if(skyscraper !== null) this.skyscraper = skyscraper;
        this.defineLetters();
    }

    private defineLetters(){
        this.billboard_letters = new Array<BillboardLetter>();
        this.informationObject.getTitle().split("").forEach((value:string, index:number)=>{
            this.billboard_letters.push(new BillboardLetter(index, value, this));
        });
        //setTimeout((()=>{setInterval(this.moveLetters.bind(this), default_settings.game.billboard.letter_move_speed);}).bind(this), 500);
    }

    private moveLetters(){
        this.billboard_letters.forEach((letter:BillboardLetter)=>{
            letter.move();
        });
    }

    setSkyscraper(skyscraper:Skyscraper){
        this.skyscraper = skyscraper;
        this.defineDimensions();
        this.definePosition();
    }

    definePosition(){
        this.x = this.skyscraper.x + ((this.skyscraper.width-this.width)/2);
        this.y = this.skyscraper.y + ((this.skyscraper.width-this.width)/2);
    }

    defineDimensions(){
        this.width = this.skyscraper.width - 70;
        this.height = 80;
    }

    draw(context:CanvasRenderingContext2D){
        if(this.viewPort === null || this.viewPort === undefined) this.viewPort = Screen.getInstance().getViewPort();
        context.beginPath();
        context.rect(this.viewPort.calculateX(this.x), this.y, this.width, this.height);
        context.fillStyle = "#333333";
        context.fill();
        
        context.beginPath();
        context.rect(this.viewPort.calculateX(this.x+this.border_size), (this.y+this.border_size), (this.width-2*this.border_size), (this.height-2*this.border_size));
        context.fillStyle = "black";
        context.fill();

        this.billboard_letters.forEach((value:BillboardLetter)=>{
            value.draw(context);
        });
    }

    redefinePosition(){
        this.defineDimensions();
        this.definePosition();
        this.defineLetters();
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

    getPreviousLetter(letter:BillboardLetter, inCircle:boolean=false):BillboardLetter|null {
        if(letter.id === 0 && !inCircle) return null;
        let result:BillboardLetter|null = null;
        this.billboard_letters.forEach((value:BillboardLetter)=>{
            if(value.id === letter.id - 1){
                result = value;
            }
        });
        return !inCircle ? result : (result === null ? this.billboard_letters[this.billboard_letters.length-1] : result);
    }

    getMovableElements():Array<Movable>{
        let result = new Array<Movable>();
        this.billboard_letters.forEach((letter:BillboardLetter)=>{ result.push(<Movable> letter) });
        return result;
    }
}