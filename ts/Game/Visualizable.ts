export default interface Visualizable {
    draw(context:CanvasRenderingContext2D):void;
    redefinePosition():void;
}