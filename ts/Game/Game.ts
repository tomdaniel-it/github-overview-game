import Timer from "./Timer.js";
import Screen from "./Screen.js";
import Visualizable from "./Visualizable.js";
import Player from "./Player/Player.js";
import { PlayerDirection } from "./Player/PlayerDirection.js";
import Movable from "./Movable.js";
import { default_settings } from "../DefaultSettings.js";
import TerrainBuilder from "./TerrainBuilder.js";
import Skyscraper from "./Terrain/Skyscraper.js";
import Hint from "./Hint/Hint.js";
import CrateHint from "./Hint/CrateHint.js";
import Solid from "./Solid.js";

export default class Game {
    static uniqueInstance:Game;

    canvas:HTMLCanvasElement;
    context:CanvasRenderingContext2D;
    timer:Timer;
    screen:Screen;
    visualizableElements:Array<Visualizable>;
    movableElements:Array<Movable>;
    player:Player;
    terrainBuilder:TerrainBuilder;
    crateHint:CrateHint;

    private constructor(){
        this.canvas = <HTMLCanvasElement> document.querySelector("canvas");
        this.context = <CanvasRenderingContext2D> this.canvas.getContext("2d");
        this.screen = Screen.getInstance(this.context, this.canvas);
        this.initializeVisualizableElements();
        this.screen.updateVisualizableElements(this.visualizableElements);
        this.retrieveMovableElements();
        this.createMovementLoop();
    }

    public static getInstance():Game{
        if(this.uniqueInstance === null || this.uniqueInstance === undefined){
            this.uniqueInstance = new Game();
        }
        return this.uniqueInstance;
    }

    start(){
        let thisObj = this;
        this.updateScreen(thisObj);
    }

    updateScreen(game:Game){
        requestAnimationFrame(()=>{game.updateScreen(game);});
        this.screen.clear();
        this.screen.draw(this.visualizableElements);
    }

    private initializeVisualizableElements(){
        this.visualizableElements = new Array<Visualizable>();
        this.terrainBuilder = new TerrainBuilder();
        this.terrainBuilder.build();
        this.visualizableElements = this.visualizableElements.concat(this.terrainBuilder.getTerrainElements());
        this.initializePlayer();
        this.createHints();
    }

    initializePlayer(){
        this.player = new Player(default_settings.game.player_spawn_x, default_settings.game.player_spawn_y, PlayerDirection.RIGHT);
        this.visualizableElements.push(this.player);
    }

    retrieveMovableElements(){
        this.movableElements = new Array<Movable>();
        this.visualizableElements.forEach((value:Visualizable)=>{
            try{
                let obj = <Movable> value;
                if(typeof obj.move === 'function'){
                    this.movableElements.push(obj);
                }
            }catch(e){}
        });
    }

    createMovementLoop(){
        this.timer = new Timer((()=>{
            this.retrieveMovableElements();
            this.movableElements.forEach((value:Movable)=>{
                value.move();
            });
            this.screen.updateViewPort(this.player, this.getSkyscrapers());
        }).bind(this), 1000/default_settings.game.frame_rate);
        this.timer.start();
    }

    getSkyscrapers():Array<Skyscraper>{
        let skyscrapers = new Array<Skyscraper>();
        this.visualizableElements.forEach((value:Visualizable)=>{
            if(value instanceof Skyscraper) skyscrapers.push(value);
        });
        return skyscrapers;
    }

    createHints(){
        this.crateHint = new CrateHint("Press E for more information.");
        this.visualizableElements.push(this.crateHint);
        this.visualizableElements.forEach((value:Visualizable)=>{
            if(value instanceof Skyscraper){
                if(value.crate !== null){
                    this.player.setCollisionListener(value.crate, (()=>{
                        this.crateHint.expand();
                    }).bind(this), (()=>{
                        this.crateHint.close();
                    }).bind(this));
                }
            }
        });
    }

    getSolidElements():Array<Solid>{
        let arr = new Array<Solid>();
        this.visualizableElements.forEach((value:Visualizable)=>{
            if(typeof (<Solid> value).isSolid === 'function'){
                arr.push(<Solid> value);
            }
        });
        return arr;
    }
}