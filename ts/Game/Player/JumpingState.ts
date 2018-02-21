import PlayerState from "./PlayerState.js";
import Player from "./Player.js";
import { PlayerDirection } from "./PlayerDirection.js";
import Timer from "../Timer.js";
import { default_settings } from "../../DefaultSettings.js";
import FallingState from "./FallingState.js";
import Keyboard from "../Keyboard.js";
import { Direction } from "../Direction.js";

export default class JumpingState implements PlayerState {
    player:Player;
    stateChecker:Timer;
    speed_y_initialized:boolean = false;

    constructor(player:Player){
        this.player = player;
        this.player.speed_y = -default_settings.game.player_jump_force;
        this.speed_y_initialized = true;
        this.setStateChecker();
    }

    move(direction:PlayerDirection){
        if(!this.speed_y_initialized) return;
        let speed_x = 0;
        let keyboard = Keyboard.getInstance();
        switch(direction){
            case PlayerDirection.LEFT:
                if((keyboard.isKeyDown("LEFT") && keyboard.isKeyDown("RIGHT"))|| (!keyboard.isKeyDown("LEFT") && !keyboard.isKeyDown("RIGHT"))) break;
                speed_x = -1*default_settings.game.player_walk_speed;
                break;
            case PlayerDirection.RIGHT:
                if((keyboard.isKeyDown("LEFT") && keyboard.isKeyDown("RIGHT"))|| (!keyboard.isKeyDown("LEFT") && !keyboard.isKeyDown("RIGHT"))) break;
                speed_x = default_settings.game.player_walk_speed;
                break;
            default:
                break;
        }

        for(let i=0;i<Math.abs(speed_x);i++){
            if(direction === PlayerDirection.LEFT && this.player.isTouchingSolid(Direction.LEFT)) break;
            if(direction === PlayerDirection.RIGHT && this.player.isTouchingSolid(Direction.RIGHT)) break;
            this.player.x += (speed_x < 0 ? -1 : 1);
        }


        for(let i=0;i<Math.abs(this.player.speed_y);i++){
            if(this.player.isTouchingSolid(Direction.UP)) break;
            this.player.y += -1;
        }
        this.player.speed_y += 0.25;
    }

    setStateChecker(){
        this.stateChecker = new Timer((()=>{
            this.checkState.bind(this)();
        }).bind(this), 1000/default_settings.game.frame_rate);
        this.stateChecker.start();
    }

    checkState(){
        //CHECK FOR START OF FALL
        if(this.player.speed_y >= 0){
            this.player.setState(new FallingState(this.player));
            this.stateChecker.stop();
            return;
        }
    }


}