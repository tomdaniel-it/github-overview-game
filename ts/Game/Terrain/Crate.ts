import Visualizable from "../Visualizable.js";
import Expandable from "../Expandable.js";
import InformationObject from "../../InformationObject.js";
import Skyscraper from "./Skyscraper.js";
import { default_settings } from "../../DefaultSettings.js";
import ViewPort from "../ViewPort.js";
import Screen from "../Screen.js";
import CrateHint from "../Hint/CrateHint.js";
import Game from "../Game.js";
import Keyboard from "../Keyboard.js";
import KeyListener from "../KeyListener.js";
import Plane from "./Plane.js";
import Movable from "../Movable.js";

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

    plane:Plane;

    constructor(informationObject:InformationObject){
        this.spriteLoaded = false;
        this.transformation = 0;
        this.transforming = false;
        this.opened = false;
        this.informationObject = informationObject;
        this.plane = new Plane(informationObject);
        this.width = 60;
        this.height = 45;
        this.initializeSprite();
        setTimeout(this.initializeCrateHint.bind(this), 1);
        this.setKeyListener();
    }

    setKeyListener(){
        Keyboard.getInstance().addKeyListener(new KeyListener("e", (()=>{
            if(Game.getInstance().player.collidingElements.indexOf(this) !== -1){
                if(this.transforming) return;
                Game.getInstance().getCrates().forEach(((crate:Crate)=>{
                    if(crate === this){
                        return;
                    }
                    if(crate.transforming && !crate.opened){
                        crate.close();
                    }
                    if(crate.opened && !crate.transforming){
                        crate.close();
                    }
                }).bind(this));
                if(this.opened){
                    //CLOSING
                    this.plane.close();
                    this.setTransformation();
                }else{
                    //OPENING
                    this.plane.expand();
                    this.setTransformation();
                }
            }
        }).bind(this)));
    }

    setTransformation(){
        this.transforming = true;
        setTimeout((()=>{
            if(this.opened){
                //CLOSING
                this.transformation--;
                if(this.transformation === 0){
                    //Transformation done
                    this.transforming = false;
                    this.opened = false;
                }
            }else{
                //OPENING
                this.transformation++;
                if(this.transformation === 3){
                    //Transformation done
                    this.transforming = false;
                    this.opened = true;
                }
            }

            if(this.transforming)
                this.setTransformation();
        }).bind(this), 100);
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
        let spriteWidth = this.sprite.width / 4;
        context.drawImage(this.sprite, this.transformation*spriteWidth, 0, spriteWidth, this.sprite.height, this.viewPort.calculateX(this.x), this.y, this.width, this.height);

        this.crateHint.draw(context);
        this.plane.draw(context);
    }

    expand(){
        if(this.transforming){
            return;
        }else{
            if(this.opened) return;
            this.plane.expand();
            this.setTransformation();
        }
    }

    close(){
        if(this.transforming){
            if(this.opened) return;
            this.opened = true;
            this.plane.close();
        }else{
            if(!this.opened) return;
            this.setTransformation();
            this.plane.close();
        }
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