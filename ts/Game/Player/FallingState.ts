import PlayerState from "./PlayerState.js";
import Player from "./Player.js";
import { PlayerDirection } from "./PlayerDirection.js";
import Timer from "../Timer.js";
import { default_settings } from "../../DefaultSettings.js";
import StandingState from "./StandingState.js";
import Keyboard from "../Keyboard.js";
import { Direction } from "../Direction.js";
import DeadState from "./DeadState.js";

export default class FallingState implements PlayerState {
    player:Player;
    stateChecker:Timer;

    constructor(player:Player){
        this.player = player;
        this.player.speed_y = 0;
        this.setStateChecker();
    }

    move(direction:PlayerDirection){
        
        //MOVEMENT X
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

        //MOVEMENT Y
        this.player.speed_y += 0.25;
        if(this.player.speed_y > default_settings.game.player_max_fall_speed) this.player.speed_y = default_settings.game.player_max_fall_speed;

        for(let i=0;i<Math.abs(this.player.speed_y);i++){
            if(this.player.isTouchingSolid(Direction.DOWN)) break;
            this.player.y += (this.player.speed_y < 0 ? -1 : 1);
        }

        //X
        for(let i=0;i<Math.abs(speed_x);i++){
            if(direction === PlayerDirection.LEFT && this.player.isTouchingSolid(Direction.LEFT)) break;
            if(direction === PlayerDirection.RIGHT && this.player.isTouchingSolid(Direction.RIGHT)) break;
            this.player.x += (speed_x < 0 ? -1 : 1);
        }
    }

    setStateChecker(){
        this.stateChecker = new Timer(this.checkState.bind(this), 1000/default_settings.game.frame_rate);
        this.stateChecker.start();
    }

    checkState(){

        //CHECK FOR LANDING
        if(this.player.isTouchingSolid(Direction.DOWN)){
            this.player.setState(new StandingState(this.player));
            this.stateChecker.stop();
            return;
        }

        //CHECK FOR DEAD STATE
        if(this.player.isOutOfScreenExceptTop()){
            this.player.setState(new DeadState(this.player));
            this.stateChecker.stop();
            return;
        }
    }
}