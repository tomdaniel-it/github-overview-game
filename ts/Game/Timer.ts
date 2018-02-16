export default class Timer {
    callback:Function;
    interval:Number;
    refresher:number;

    constructor(callback:Function, interval:Number){
        this.callback = callback;
        this.interval = interval;
    }

    start(){
        this.refresher = setInterval(this.callback, this.interval);
    }

    stop(){
        clearInterval(this.refresher);
    }
}