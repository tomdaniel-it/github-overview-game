import Hint from "./Hint.js";
import { default_settings } from "../../DefaultSettings.js";

export default class ButtonHint extends Hint {
    listener: number;

    constructor(description:String=""){
        super(description);
        this.definePosition();
    }

    redefinePosition(){

    }

    draw(context:CanvasRenderingContext2D){
        if(!this.expanded) return;
        context.beginPath();
        context.font = "20px Arial";
        context.fillStyle = default_settings.game.hint_color;
        context.fillText(<string>this.description,this.x,this.y);
    }

    definePosition(){
        this.x = 30;
        this.y = 50;
    }
}