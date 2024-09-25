import * as PIXI from "pixi.js";
import backgroundType1 from "./assets/cell.svg";
import backgroundType2 from "./assets/cell-active.svg";
import backgroundType3 from "./assets/cell-sm.svg";

export default {
    backgroundType1: await PIXI.Assets.load(backgroundType1),
    backgroundType2: await PIXI.Assets.load(backgroundType2),
    backgroundType3: await PIXI.Assets.load(backgroundType3)
}
