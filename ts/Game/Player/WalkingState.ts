import PlayerState from "./PlayerState.js";
import Player from "./Player.js";
import { PlayerDirection } from "./PlayerDirection.js";
import JumpingState from "./JumpingState.js";
import Timer from "../Timer.js";
import { default_settings } from "../../DefaultSettings.js";
import Keyboard from "../Keyboard.js";
import StandingState from "./StandingState.js";
import FallingState from "./FallingState.js";

export default class WalkingState implements PlayerState {
    player:Player;
    stateChecker:Timer;

    constructor(player:Player){
        this.player = player;
        this.player.defineDirection();
        this.setStateChecker();
    }

    setStateChecker(){
        this.stateChecker = new Timer(this.checkState.bind(this), 1000/default_settings.game.frame_rate);
        this.stateChecker.start();
    }

    checkState(){
        let keyboard:Keyboard = Keyboard.getInstance();

        //CHECK IF IN AIR, IF SO => FALLING STATE
        if(!this.player.isStandingOnSolid()){
            this.player.setState(new FallingState(this.player));
            this.stateChecker.stop();
            return;
        }

        //CHECK IF NOT MOVING, IF SO WALKING STATE
        if((!keyboard.isKeyDown("LEFT") && !keyboard.isKeyDown("RIGHT")) || (keyboard.isKeyDown("LEFT") && keyboard.isKeyDown("RIGHT"))){
            this.player.setState(new StandingState(this.player));
            this.stateChecker.stop();
        }
    }

    move(direction:PlayerDirection){
        let movement;
        switch(direction){
            case PlayerDirection.LEFT:
                movement = -1*default_settings.game.player_walk_speed;
                break;
            case PlayerDirection.RIGHT:
                movement = default_settings.game.player_walk_speed;
                break;
            default:
                return;
        }
        this.player.x += movement;
    }
}