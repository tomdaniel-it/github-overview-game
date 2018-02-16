import PlayerState from "./PlayerState.js";
import Player from "./Player.js";
import { PlayerDirection } from "./PlayerDirection.js";
import JumpingState from "./JumpingState.js";
import Timer from "../Timer.js";
import { default_settings } from "../../DefaultSettings.js";
import Keyboard from "../Keyboard.js";
import StandingState from "./StandingState.js";

export default class WalkingState implements PlayerState {
    player:Player;

    constructor(player:Player){
        this.player = player;
        this.player.defineDirection();
        this.setStateChecker();
    }

    private setStateChecker(){
        let timer:Timer = new Timer(()=>{
            let keyboard:Keyboard = Keyboard.getInstance();
            if((!keyboard.isKeyDown("LEFT") && !keyboard.isKeyDown("RIGHT")) || (keyboard.isKeyDown("LEFT") && keyboard.isKeyDown("RIGHT"))){
                this.player.setState(new StandingState(this.player));
                timer.stop();
            }else{
                this.player.defineDirection();
            }
        }, 1000/default_settings.game.frame_rate);
        timer.start();
    }

    move(direction:PlayerDirection){
        let movement;
        switch(direction){
            case PlayerDirection.LEFT:
                movement = -10;
                break;
            case PlayerDirection.RIGHT:
                movement = 10;
                break;
            default:
                return;
        }
        this.player.x += movement;
    }
}