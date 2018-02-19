import PlayerState from "./PlayerState.js";
import Player from "./Player.js";
import { PlayerDirection } from "./PlayerDirection.js";
import Timer from "../Timer.js";
import { default_settings } from "../../DefaultSettings.js";
import FallingState from "./FallingState.js";
import Keyboard from "../Keyboard.js";

export default class JumpingState implements PlayerState {
    player:Player;
    stateChecker:Timer;

    constructor(player:Player){
        this.player = player;
        this.player.speed_y = -default_settings.game.player_jump_force;
        this.setStateChecker();
    }

    move(direction:PlayerDirection){
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

        this.player.x += speed_x;
        this.player.y += this.player.speed_y;
        
        this.player.speed_y+=0.25;
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