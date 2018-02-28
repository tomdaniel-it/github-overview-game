import Visualizable from "./Visualizable.js";
import { default_settings } from "../DefaultSettings.js";
import ViewPort from "./ViewPort.js";
import Player from "./Player/Player.js";
import Skyscraper from "./Terrain/Skyscraper.js";

export default class Screen {
    private static uniqueInstance:Screen;
    private context:CanvasRenderingContext2D;
    private canvas:HTMLCanvasElement;
    private visualizableElements:Array<Visualizable>;
    private viewPort:ViewPort;

    private constructor(context:CanvasRenderingContext2D, canvas:HTMLCanvasElement, visualizableElements:Array<Visualizable>|null=null){
        this.context = context;
        this.canvas = canvas;
        this.visualizableElements = (visualizableElements===null?new Array<Visualizable>():visualizableElements);
        this.createScreenResizeHandler();
        this.updateScreenSize();
        this.viewPort = new ViewPort(0,0);
    }

    public static getInstance(context:CanvasRenderingContext2D|null=null, canvas:HTMLCanvasElement|null=null, visualizableElements:Array<Visualizable>|null=null):Screen{
        if(this.uniqueInstance === null || this.uniqueInstance === undefined){
            if(context === null || canvas === null){
                throw new Error("Can't instantiate screen without context or canvas.");
            }
            this.uniqueInstance = new Screen(context, canvas, visualizableElements);
        }
        return this.uniqueInstance;
    }

    clear():void{
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    draw(elements:Array<Visualizable>):void{
        this.context.beginPath();
        this.context.rect(0,0,this.canvas.width, this.canvas.height);
        this.context.fillStyle = "lightblue";
        this.context.fill();
        for(let i=0;i<elements.length;i++){
            elements[i].draw(this.context);
        }
    }

    updateVisualizableElements(visualizableElements:Array<Visualizable>){
        this.visualizableElements = visualizableElements;
    }

    getWidth(){
        return this.canvas.width;
    }

    getHeight(){
        return this.canvas.height;
    }

    getX(){
        return 0;
    }

    getY(){
        return 0;
    }

    private createScreenResizeHandler(){
        window.onresize = this.updateScreenSize.bind(this);
    }

    updateScreenSize(){
        let widthDiff = window.innerWidth - this.canvas.width;
        let heightDiff = window.innerHeight - this.canvas.height;
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.visualizableElements.forEach((value:Visualizable)=>{
            value.redefinePosition(widthDiff, heightDiff);
        });
    }

    updateViewPort(player:Player, skyscrapers:Array<Skyscraper>){
        this.viewPort.update(player, this.getMaxTotalWidth(skyscrapers));
    }

    getMaxTotalWidth(skyscrapers:Array<Skyscraper>){
        let max_x = this.getWidth();
        skyscrapers.forEach((value:Skyscraper)=>{
            if(value.x + value.width + default_settings.game.window_margin_horizontal > max_x){
                max_x = value.x + value.width + default_settings.game.window_margin_horizontal;
            }
        });
        return max_x;
    }

    getViewPort(){
        return this.viewPort;
    }
}