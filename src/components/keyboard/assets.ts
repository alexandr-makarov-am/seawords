import * as PIXI from "pixi.js";
import background from "./assets/bg.svg";
import button from "./assets/btn.svg";
import buttonActive from "./assets/btn-active.svg";

export default {
    background: await PIXI.Assets.load(background),
    buttonType1: await PIXI.Assets.load(button),
    buttonType2: await PIXI.Assets.load(buttonActive)
}
