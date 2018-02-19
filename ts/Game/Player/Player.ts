import PlayerState from "./PlayerState.js";
import {PlayerDirection} from "./PlayerDirection.js";
import Visualizable from "../Visualizable.js";
import StandingState from "./StandingState.js";
import Movable from "../Movable.js";
import Keyboard from "../Keyboard.js";
import Screen from "../Screen.js";
import ViewPort from "../ViewPort.js";
import { default_settings } from "../../DefaultSettings.js";
import Game from "../Game.js";
import Solid from "../Solid.js";

export default class Player implements Visualizable, Movable {
    x:number;
    y:number;
    width:number;
    height:number;
    state:PlayerState;
    direction:PlayerDirection;
    viewPort:ViewPort;
    collidingElements:Array<Visualizable>;

    JUMP_FORCE:number;
    GRAVITY:number;
    speed_y:number;

    constructor(x:number, y:number, direction:PlayerDirection=PlayerDirection.RIGHT){
        this.JUMP_FORCE = default_settings.game.player_jump_force;
        this.GRAVITY = default_settings.game.player_gravity;
        this.setLocation(x, y);
        this.initializeState();
        this.setDirection(direction);
        this.initializeDimensions();
        this.collidingElements = new Array<Visualizable>();
        this.initializeSpeedY();
    }

    initializeSpeedY(){
        this.speed_y = -this.GRAVITY;
    }

    setLocation(x:number, y:number){
        this.x = x;
        this.y = y;
    }

    initializeDimensions(){
        this.width = 30;
        this.height = 30;
    }

    private initializeState(){
        this.state = new StandingState(this);
    }

    setState(state:PlayerState){
        this.state = state;
    }

    setDirection(direction:PlayerDirection){
        this.direction = direction;
    }

    defineDirection(){
        let keyboard:Keyboard = Keyboard.getInstance();
        if(keyboard.isKeyDown("LEFT") && !keyboard.isKeyDown("RIGHT")){
            this.direction = PlayerDirection.LEFT;
        }
        if(keyboard.isKeyDown("RIGHT") && !keyboard.isKeyDown("LEFT")){
            this.direction = PlayerDirection.RIGHT;
        }
    }

    move(){
        this.defineDirection();
        this.state.move(this.direction);
    }

    draw(context:CanvasRenderingContext2D){
        if(this.viewPort === null || this.viewPort === undefined) this.viewPort = Screen.getInstance().getViewPort();
        context.beginPath();
        context.rect(this.viewPort.calculateX(this.x), this.y, this.width, this.height);
        context.fillStyle = "blue";
        context.fill();
    }

    redefinePosition(){

    }

    setCollisionListener(element:Visualizable, onCollision:Function, onRelease:Function){
        setInterval((()=>{
            let leftA = element.getX();
            let leftB = this.getX();
            let rightA = element.getX() + element.getWidth();
            let rightB = this.getX() + this.getWidth();
            let topA = element.getY();
            let topB = this.getY();
            let bottomA = element.getY() + element.getHeight();
            let bottomB = this.getY() + this.getHeight();
            if (leftA < rightB && rightA > leftB && topA < bottomB && bottomA > topB){
                if(this.collidingElements.indexOf(element) === -1){
                    this.collidingElements.push(element);
                    onCollision();
                }
            }else{
                if(this.collidingElements.indexOf(element) !== -1){
                    this.collidingElements.splice(this.collidingElements.indexOf(element));
                    onRelease();
                }
            }
        }).bind(this), 1000/default_settings.game.frame_rate);
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

    isStandingOnSolid():boolean{
        let result = false;
        Game.getInstance().getSolidElements().forEach(((value:Solid)=>{
            let diff = this.y + this.height - value.getY();
            diff = diff < 0 ? diff*-1 : diff;
            if(diff < 1){
                if(!(this.x > value.getX() + value.getWidth()) && !(this.x + this.width < value.getX())){
                    result = true;
                }
            }
        }).bind(this));
        return result;
    }

    getFloor():Solid|null{
        let result:Solid|null = null;
        Game.getInstance().getSolidElements().forEach(((value:Solid)=>{
            let diff = this.y + this.height - value.getY();
            diff = diff < 0 ? diff*-1 : diff;
            if(diff < 1){
                if(!(this.x > value.getX() + value.getWidth()) && !(this.x + this.width < value.getX())){
                    result = value;
                }
            }
        }).bind(this));
        return result;
    }
}