import Movable from "./Movable.js";

export default interface Visualizable {
    draw(context:CanvasRenderingContext2D):void;
    redefinePosition(widthDiff:number, heightDiff:number):void;
    getX():number;
    getY():number;
    getWidth():number;
    getHeight():number;
    getMovableElements():Array<Movable>;
}