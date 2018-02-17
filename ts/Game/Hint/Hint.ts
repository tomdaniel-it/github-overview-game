import Visualizable from "../Visualizable.js";
import Expandable from "../Expandable.js";

export default abstract class Hint implements Visualizable, Expandable {
    description:String;
    expanded:boolean;

    x:number;
    y:number;
    width:number;
    height:number;

    constructor(description:String=""){
        this.description = description;
    }

    setDescription(description:String){
        this.description = description;
    }

    setExpanded(expanded:boolean){
        this.expanded = expanded;
    }

    expand(){
        this.setExpanded(true);
    }

    close(){
        this.setExpanded(false);
    }

    abstract redefinePosition():void;

    abstract draw(context:CanvasRenderingContext2D):void;

    abstract definePosition():void;

    getX(){
        return this.x;
    }

    getY(){
        return this.y;
    }

    getWidth(){
        return this.width;
    }

    getHeight(){
        return this.height;
    }
}