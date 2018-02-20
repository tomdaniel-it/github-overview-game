import Visualizable from "../Visualizable.js";
import Expandable from "../Expandable.js";
import InformationObject from "../../InformationObject.js";
import Skyscraper from "./Skyscraper.js";
import { default_settings } from "../../DefaultSettings.js";
import ViewPort from "../ViewPort.js";
import Screen from "../Screen.js";
import CrateHint from "../Hint/CrateHint.js";
import Game from "../Game.js";

export default class Crate implements Visualizable, Expandable {
    x:number;
    y:number;
    width:number;
    height:number;
    skyscraper:Skyscraper;
    viewPort:ViewPort;

    crateHint:CrateHint;

    sprite:HTMLImageElement;
    spriteLoaded:boolean;

    opened:boolean;
    transforming:boolean;
    transformation:number;

    informationObject:InformationObject;

    constructor(informationObject:InformationObject){
        this.spriteLoaded = false;
        this.transformation = 0;
        this.transforming = false;
        this.opened = false;
        this.informationObject = informationObject;
        this.width = 60;
        this.height = 45;
        this.initializeSprite();
        setTimeout(this.initializeCrateHint.bind(this), 1);
    }

    initializeCrateHint(){
        this.crateHint = new CrateHint("Press E for more information.");
        let game = Game.getInstance();
        game.player.setCollisionListener(this, (()=>{
            this.crateHint.expand();
        }).bind(this), (()=>{
            this.crateHint.close();
        }).bind(this));
    }

    initializeSprite(){
        this.sprite = new Image();
        this.sprite.src = "Images/Crate/crateOpeningSprite.png";
        this.sprite.onload = (()=>{ this.spriteLoaded = true; }).bind(this);
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
        if(!this.spriteLoaded) return;
        if(this.viewPort === null || this.viewPort === undefined) this.viewPort = Screen.getInstance().getViewPort();
        context.beginPath();
        context.drawImage(this.sprite, 0, 0, this.sprite.width/4, this.sprite.height, this.viewPort.calculateX(this.x), this.y, this.width, this.height);

        this.crateHint.draw(context);

    }

    expand(){

    }

    close(){

    }

    redefinePosition(widthDiff:number, heightDiff:number){
        this.initializePosition();
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