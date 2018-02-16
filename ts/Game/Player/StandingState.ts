import PlayerState from "./PlayerState.js";
import Player from "./Player.js";
import { PlayerDirection } from "./PlayerDirection.js";
import WalkingState from "./WalkingState.js";
import JumpingState from "./JumpingState.js";
import Timer from "../Timer.js";
import { default_settings } from "../../DefaultSettings.js";
import Keyboard from "../Keyboard.js";

export default class StandingState implements PlayerState {
    player:Player;

    constructor(player:Player){
        this.player = player;
        this.setStateChecker();
    }

    private setStateChecker(){
        let timer = new Timer(()=>{
            let keyboard:Keyboard = Keyboard.getInstance();
            if((keyboard.isKeyDown("LEFT") || keyboard.isKeyDown("RIGHT")) && !(keyboard.isKeyDown("LEFT") && keyboard.isKeyDown("RIGHT"))){
                this.player.setState(new WalkingState(this.player));
                timer.stop();
            }
        }, 1000/default_settings.game.frame_rate);
        timer.start();

    }

    move(direction:PlayerDirection){
        return;
    }
}