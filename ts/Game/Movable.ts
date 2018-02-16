import Visualizable from "./Visualizable.js";

export default interface Movable extends Visualizable {
    move():void;
}