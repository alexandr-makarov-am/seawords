import {SpriteComponent} from "../sprite-component.ts";
import * as PIXI from "pixi.js";
import assets from "./assets.ts";

export class Popup extends SpriteComponent {

    private cb?: () => void;

    constructor(x: number, y: number, width = 530, height = 447) {
        super(PIXI.Sprite.from(assets.background));
        this.layer.x = x;
        this.layer.y = y;
        this.layer.width = width;
        this.layer.height = height;
        this.layer.interactive = true;
        this.layer.cursor = "pointer";
        this.layer.on("pointerdown", () => {
            if (this.cb) this.cb();
        })
    }

    public setCallback(cb: () => void) {
        this.cb = cb;
    }
}
