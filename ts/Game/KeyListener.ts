export default class KeyListener {
    key:String;
    callback:Function;

    constructor(key:String, callback:Function){
        this.key = key;
        this.callback = callback;
    }
}