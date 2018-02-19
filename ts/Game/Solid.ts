import Visualizable from "./Visualizable.js";

export default interface Solid extends Visualizable {
    isSolid():boolean;
}