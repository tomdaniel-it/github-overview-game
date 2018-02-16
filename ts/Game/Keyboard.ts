export default class Keyboard {
    private static uniqueInstance:Keyboard;
    private keysPresses:Map<String, boolean>;
    private keys:Map<String, number>;

    private constructor(){
        this.initializeKeys();
        this.initializeKeyPresses();
        this.setKeyListeners();
    }

    private initializeKeys(){
        this.keys = new Map<String, number>();
        this.keys.set("SPACE", 32);
        this.keys.set("LEFT", 37);
        this.keys.set("UP", 38);
        this.keys.set("RIGHT", 39);
        this.keys.set("DOWN", 40);
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
            if(value === e.keyCode){
                this.keysPresses.set(key, true);
            }
        });
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
}