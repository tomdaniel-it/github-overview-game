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
import {Direction} from "../Direction.js";
import Vector from "../Vector.js";

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

    constructor(spawnLocation:Vector, direction:PlayerDirection=PlayerDirection.RIGHT){
        this.JUMP_FORCE = default_settings.game.player_jump_force;
        this.GRAVITY = default_settings.game.player_gravity;
        this.setLocation(spawnLocation.x, spawnLocation.y);
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

    redefinePosition(widthDiff:number, heightDiff:number){
        this.y += heightDiff;
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

    isTouchingSolid(direction:Direction|null=null):boolean{
        let result = false;

        Game.getInstance().getSolidElements().forEach(((value:Solid)=>{
            if(result) return;
            let diff;
            
            //DOWN CHECK
            if(direction === Direction.DOWN){
                diff = Math.abs(this.y + this.height - value.getY());
                if(diff < 1){
                    if(!(this.x > value.getX() + value.getWidth()) && !(this.x + this.width < value.getX())){
                        result = true;
                    }
                }
                return;
            }

            //UP CHECK
            if(direction === Direction.UP){
                diff = Math.abs(this.y - value.getY() - value.getHeight());
                if(diff < 1){
                    if(!(this.x > value.getX() + value.getWidth()) && !(this.x + this.width < value.getX())){
                        result = true;
                    }
                }
                return;
            }

            //LEFT CHECK
            if(direction === Direction.LEFT){
                diff = Math.abs(this.x - value.getX() - value.getWidth());
                if(diff < 1){
                    if(!(this.y + this.height <= value.getY()) && !(this.y >= value.getY() + value.getHeight())){
                        result = true;
                    }
                }
                return;
            }

            //RIGHT CHECK
            if(direction === Direction.RIGHT){
                diff = Math.abs(value.getX() - this.x - this.getWidth());
                if(diff < 1){
                    if(!(this.y + this.height <= value.getY()) && !(this.y >= value.getY() + value.getHeight())){
                        result = true;
                    }
                }
                return;
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

    isOutOfScreen():boolean{
        let screen = Screen.getInstance();

        let outTop = this.y + this.height < screen.getY();
        return outTop || this.isOutOfScreenExceptTop();
    }

    isOutOfScreenExceptTop():boolean{
        let screen = Screen.getInstance();

        let outLeft = this.x + this.width < screen.getX() + screen.getViewPort().x; 
        let outRight = this.x > screen.getX() + screen.getWidth() + screen.getViewPort().x;
        let outBottom = this.y > screen.getY() + screen.getHeight();
        return outLeft || outRight || outBottom;
    }

    getMovableElements(){
        return new Array<Movable>();
    }
}