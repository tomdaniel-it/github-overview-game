import Player from "./Player.js";
import { PlayerDirection } from "./PlayerDirection";
import Timer from "../Timer.js";

export default interface PlayerState {
    player:Player;
    stateChecker:Timer;

    move(direction:PlayerDirection):void;
    setStateChecker():void;
    checkState():void;
}