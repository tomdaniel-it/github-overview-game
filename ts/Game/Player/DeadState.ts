import PlayerState from "./PlayerState.js";
import Player from "./Player.js";
import { PlayerDirection } from "./PlayerDirection.js";
import Timer from "../Timer.js";
import { default_settings } from "../../DefaultSettings.js";
import StandingState from "./StandingState.js";
import Game from "../Game.js";

export default class DeadState implements PlayerState {
    player:Player;
    stateChecker:Timer;

    constructor(player:Player){
        this.player = player;
        let spawnpoint = Game.getInstance().getPlayerSpawnpoint();
        this.player.x = spawnpoint.x;
        this.player.y = spawnpoint.y;
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