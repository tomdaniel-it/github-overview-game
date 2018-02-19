import PlayerState from "./PlayerState.js";
import Player from "./Player.js";
import { PlayerDirection } from "./PlayerDirection.js";
import Timer from "../Timer.js";
import { default_settings } from "../../DefaultSettings.js";
import StandingState from "./StandingState.js";

export default class DeadState implements PlayerState {
    player:Player;
    stateChecker:Timer;

    constructor(player:Player){
        this.player = player;
        this.player.x = default_settings.game.player_spawn_x;
        this.player.y = default_settings.game.player_spawn_y;
        this.checkState();
    }

    move(direction:PlayerDirection){
        return;
    }

    setStateChecker(){
        return;
    }

    checkState(){
        this.player.setState(new StandingState(this.player));
    }
}