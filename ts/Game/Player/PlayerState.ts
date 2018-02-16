import Player from "./Player.js";
import { PlayerDirection } from "./PlayerDirection";

export default interface PlayerState {
    player:Player;

    move(direction:PlayerDirection):void;
}