import PlayerState from "./PlayerState.js";
import Player from "./Player.js";
import { PlayerDirection } from "./PlayerDirection";

export default class JumpingState implements PlayerState {
    player:Player;

    constructor(player:Player){
        this.player = player;
    }

    move(direction:PlayerDirection){

    }
}