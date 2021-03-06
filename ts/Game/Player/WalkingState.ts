import PlayerState from "./PlayerState.js";
import Player from "./Player.js";
import { PlayerDirection } from "./PlayerDirection.js";
import JumpingState from "./JumpingState.js";
import Timer from "../Timer.js";
import { default_settings } from "../../DefaultSettings.js";
import Keyboard from "../Keyboard.js";
import StandingState from "./StandingState.js";
import FallingState from "./FallingState.js";
import { Direction } from "../Direction.js";

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

        //CHECK IF JUMP KEY PRESSED, IF SO => JUMPING STATE
        if(keyboard.isKeyDown("UP") || keyboard.isKeyDown("SPACE")){
            this .player.setState(new JumpingState(this.player));
            this.stateChecker.stop();
            return;
        }

        //CHECK IF IN AIR, IF SO => FALLING STATE
        if(!this.player.isTouchingSolid(Direction.DOWN)){
            this.player.setState(new FallingState(this.player));
            this.stateChecker.stop();
            return;
        }

        //CHECK IF NOT MOVING, IF SO WALKING STATE
        if((!keyboard.isKeyDown("LEFT") && !keyboard.isKeyDown("RIGHT")) || (keyboard.isKeyDown("LEFT") && keyboard.isKeyDown("RIGHT"))){
            this.player.setState(new StandingState(this.player));
            this.stateChecker.stop();
            return;
        }
    }

    move(direction:PlayerDirection){
        let movement = 0;
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
        for(let i=0;i<Math.abs(movement);i++){
            if(direction === PlayerDirection.LEFT && this.player.isTouchingSolid(Direction.LEFT)) break;
            if(direction === PlayerDirection.RIGHT && this.player.isTouchingSolid(Direction.RIGHT)) break;
            this.player.x += (movement < 0 ? -1 : 1);
        }
    }
}