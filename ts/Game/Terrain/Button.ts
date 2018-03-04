import Visualizable from "../Visualizable.js";
import Expandable from "../Expandable.js";
import InformationObject from "../../InformationObject.js";
import Skyscraper from "./Skyscraper.js";
import { default_settings } from "../../DefaultSettings.js";
import ViewPort from "../ViewPort.js";
import Screen from "../Screen.js";
import Game from "../Game.js";
import Keyboard from "../Keyboard.js";
import KeyListener from "../KeyListener.js";
import Plane from "./Plane.js";
import Movable from "../Movable.js";
import ButtonHint from "../Hint/ButtonHint.js";

export default class Button implements Visualizable, Expandable {
    x:number;
    y:number;
    width:number;
    height:number;
    skyscraper:Skyscraper;
    viewPort:ViewPort;

    buttonHint:ButtonHint;

    spriteOn:HTMLImageElement;
    spriteOff:HTMLImageElement;
    spritesLoaded:number;

    opened:boolean;

    informationObject:InformationObject;

    plane:Plane;

    constructor(informationObject:InformationObject){
        this.spritesLoaded = 0;
        this.opened = false;
        this.informationObject = informationObject;
        this.plane = new Plane(informationObject);
        this.width = 38;
        this.height = 60;
        this.initializeSprite();
        setTimeout(this.initializeCrateHint.bind(this), 1);
        this.setKeyListener();
    }

    setKeyListener(){
        Keyboard.getInstance().addKeyListener(new KeyListener("e", (()=>{
            if(Game.getInstance().player.collidingElements.indexOf(this) !== -1){
                Game.getInstance().getButtons().forEach(((button:Button)=>{
                    if(button === this){
                        return;
                    }
                    if(button.opened){
                        button.close();
                    }
                }).bind(this));
                if(this.opened){
                    //CLOSING
                    this.close();
                }else{
                    //OPENING
                    this.expand();
                }
            }
        }).bind(this)));
    }

    initializeCrateHint(){
        this.buttonHint = new ButtonHint("Press E for more information");
        let game = Game.getInstance();
        game.player.setCollisionListener(this, (()=>{
            this.buttonHint.expand();
        }).bind(this), (()=>{
            this.buttonHint.close();
        }).bind(this));
    }

    initializeSprite(){
        this.spriteOn = new Image();
        this.spriteOn.src = "Images/Button/buttonOn.png";
        this.spriteOn.onload = (()=>{ this.spritesLoaded++; }).bind(this);
        this.spriteOff = new Image();
        this.spriteOff.src = "Images/Button/buttonOff.png";
        this.spriteOff.onload = (()=>{ this.spritesLoaded++; }).bind(this);
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
        if(this.spritesLoaded < 2) return;
        if(this.viewPort === null || this.viewPort === undefined) this.viewPort = Screen.getInstance().getViewPort();
        this.plane.draw(context);
        context.beginPath();
        context.drawImage((this.opened ? this.spriteOn : this.spriteOff), 0, 0, (this.opened ? this.spriteOn.width : this.spriteOff.width), (this.opened ? this.spriteOn.height : this.spriteOff.height), this.viewPort.calculateX(this.x), this.y, this.width, this.height);

        this.buttonHint.draw(context);
    }

    expand(){
        this.plane.expand();
        this.buttonHint.setDescription("Press E to hide information");
        this.opened = true;
    }

    close(){
        this.plane.close();
        this.buttonHint.setDescription("Press E for more information");
        this.opened = false;
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

    getMovableElements():Array<Movable>{
        let result = new Array<Movable>();
        result.push(<Movable>this.plane);
        return result;
    }
}