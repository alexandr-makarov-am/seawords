import * as PIXI from "pixi.js";
import background from "./assets/bg1.svg";

export default {
    background: await PIXI.Assets.load(background),
}
