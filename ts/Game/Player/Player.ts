import PlayerState from "./PlayerState.js";
import {PlayerDirection} from "./PlayerDirection.js";
import Visualizable from "../Visualizable.js";
import StandingState from "./StandingState.js";
import Movable from "../Movable.js";
import Keyboard from "../Keyboard.js";
import Screen from "../Screen.js";
import ViewPort from "../ViewPort.js";

export default class Player implements Visualizable, Movable {
    x:number;
    y:number;
    width:number;
    height:number;
    state:PlayerState;
    direction:PlayerDirection;
    viewPort:ViewPort;

    constructor(x:number, y:number, direction:PlayerDirection=PlayerDirection.RIGHT){
        this.setLocation(x, y);
        this.initializeState();
        this.setDirection(direction);
        this.initializeDimensions();
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
}