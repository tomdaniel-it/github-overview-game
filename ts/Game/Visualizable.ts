export default interface Visualizable {
    draw(context:CanvasRenderingContext2D):void;
    redefinePosition():void;
    getX():number;
    getY():number;
    getWidth():number;
    getHeight():number;
}