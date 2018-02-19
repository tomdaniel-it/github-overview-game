import PlayerState from "./PlayerState.js";
import Player from "./Player.js";
import { PlayerDirection } from "./PlayerDirection.js";
import Timer from "../Timer.js";
import { default_settings } from "../../DefaultSettings.js";
import StandingState from "./StandingState.js";
import Keyboard from "../Keyboard.js";

export default class FallingState implements PlayerState {
    player:Player;
    stateChecker:Timer;

    constructor(player:Player){
        this.player = player;
        this.player.speed_y = this.player.GRAVITY;
        this.setStateChecker();
    }

    move(direction:PlayerDirection){
        //MOVEMENT Y
        if(this.player.speed_y !== default_settings.game.player_max_fall_speed)
            this.player.speed_y += 1;
        
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

        //CHECK Y
        let standing = false;
        if(this.player.isStandingOnSolid()){
            standing = true;
            console.log("first standing!");
        }else{
            for(let i=0;i<Math.abs(this.player.speed_y);i++){
                this.player.y++;
                if(this.player.isStandingOnSolid()){
                    console.log("standing!");
                    standing = true;
                    break;
                }
            }
        }
        this.player.x += speed_x;
    }

    setStateChecker(){
        this.stateChecker = new Timer(this.checkState.bind(this), 1000/default_settings.game.frame_rate);
        this.stateChecker.start();
    }

    checkState(){

        //CHECK FOR LANDING
        if(this.player.isStandingOnSolid()){
            this.player.setState(new StandingState(this.player));
            this.stateChecker.stop();
            return;
        }

        //CHECK FOR DEAD STATE
    }
}