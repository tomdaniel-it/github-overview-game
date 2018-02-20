import Game from "./Game.js";
import { default_settings } from "../DefaultSettings.js";
import KeyListener from "./KeyListener.js";

export default class Keyboard {
    private static uniqueInstance:Keyboard;
    private keysPresses:Map<String, boolean>;
    private keys:Map<String, number>;
    private keyListeners:Array<KeyListener>;

    private constructor(){
        this.initializeKeys();
        this.initializeKeyPresses();
        this.setKeyListeners();
        this.keyListeners = new Array<KeyListener>();
    }

    private initializeKeys(){
        this.keys = new Map<String, number>();
        this.keys.set("SPACE", 32);
        this.keys.set("LEFT", 37);
        this.keys.set("UP", 38);
        this.keys.set("RIGHT", 39);
        this.keys.set("DOWN", 40);
        this.keys.set("e", 69);
    }

    private initializeKeyPresses(){
        this.keysPresses = new Map<String, boolean>();
        this.keys.forEach((value:number, key:String)=>{
            this.keysPresses.set(key, false);
        });
    }

    private setKeyListeners(){
        document.onkeydown = this.onKeyDown.bind(this);
        document.onkeyup = this.onKeyUp.bind(this);
    }

    private onKeyDown(e:KeyboardEvent){
        this.keys.forEach((value:number, key:String)=>{
            this.keyListeners.forEach((keyListener:KeyListener)=>{
                if(e.keyCode === value && key === keyListener.key) keyListener.callback();
            });
            if(value === e.keyCode){
                this.keysPresses.set(key, true);
            }
        });
        Game.getInstance().player.state.checkState();
    }

    private onKeyUp(e:KeyboardEvent){
        this.keys.forEach((value:number, key:String)=>{
            if(value === e.keyCode){
                this.keysPresses.set(key, false);
            }
        });
    }

    static getInstance():Keyboard{
        if(this.uniqueInstance === null || this.uniqueInstance === undefined){
            this.uniqueInstance = new Keyboard();
        }
        return this.uniqueInstance;
    }

    isKeyDown(key:String):boolean{
        if(!this.keys.has(key)){
            throw new Error("Status of key requested which is not being monitored by Keyboard.");
        }
        return <boolean> this.keysPresses.get(key);
    }

    amountKeysDown():number{
        let count:number = 0;
        this.keysPresses.forEach((value:boolean, key:String)=>{
            if(value) count++;
        });
        return count;
    }

    addKeyListener(keyListener:KeyListener){
        this.keyListeners.push(keyListener);
    }
}