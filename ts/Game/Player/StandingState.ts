import PlayerState from "./PlayerState.js";
import Player from "./Player.js";
import { PlayerDirection } from "./PlayerDirection.js";
import WalkingState from "./WalkingState.js";
import JumpingState from "./JumpingState.js";
import Timer from "../Timer.js";
import { default_settings } from "../../DefaultSettings.js";
import Keyboard from "../Keyboard.js";
import FallingState from "./FallingState.js";
import { Direction } from "../Direction.js";

export default class StandingState implements PlayerState {
    player:Player;
    stateChecker:Timer;

    constructor(player:Player){
        this.player = player;
        this.setStateChecker();
    }

    setStateChecker(){
        this.stateChecker = new Timer(this.checkState.bind(this), 1000/default_settings.game.frame_rate);
        this.stateChecker.start();

    }

    move(direction:PlayerDirection){
        return;
    }

    checkState(){
        let keyboard:Keyboard = Keyboard.getInstance();

        //CHECK IF IN AIR, IF SO => FALLING STATE
        if(!this.player.isTouchingSolid(Direction.DOWN)){
            this.player.setState(new FallingState(this.player));
            this.stateChecker.stop();
            return;
        }

        //CHECK IF JUMP KEY PRESSED, IF SO => JUMPING STATE
        if(keyboard.isKeyDown("UP") || keyboard.isKeyDown("SPACE")){
            this .player.setState(new JumpingState(this.player));
            this.stateChecker.stop();
            return;
        }
        
        //CHECK IF LEFT OR RIGHT IS PRESSED, IF SO => WALKING STATE
        if((keyboard.isKeyDown("LEFT") || keyboard.isKeyDown("RIGHT")) && !(keyboard.isKeyDown("LEFT") && keyboard.isKeyDown("RIGHT"))){
            this.player.setState(new WalkingState(this.player));
            this.stateChecker.stop();
            return;
        }
    }
}