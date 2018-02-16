import Player from "./Player/Player.js";
import Screen from "./Screen.js";

export default class ViewPort {
    x:number;
    y:number;
    screen:Screen;

    constructor(x:number, y:number){
        this.x = x;
        this.y = y;
    }

    update(player:Player, max_x:number){
        if(this.screen === null || this.screen === undefined) this.screen = Screen.getInstance();
        this.x = player.x + player.width/2 - this.screen.getWidth()/2;
        if(this.x < 0) this.x = 0;
        if(this.x + this.screen.getWidth() > max_x) this.x = max_x - this.screen.getWidth();
    }

    calculateX(x:number){
        return x - this.x;
    }
}