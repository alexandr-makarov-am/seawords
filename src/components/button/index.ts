import * as PIXI from "pixi.js";
import {SpriteComponent} from "../sprite-component.ts";
import assets from "./assets.ts";

export class Button extends SpriteComponent {

    private cb?: () => void;

    constructor(x: number, y: number, width = 330, height = 95) {
        super(PIXI.Sprite.from(assets.buttonType1));
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

    public setText(str: string) {
        const text = new PIXI.Text({
            text: str,
            style: new PIXI.TextStyle({
                fill: '#FFF'
            })
        });
        text.y = 15;
        text.x = 15;
        text.anchor = -.5;
        this.addChild(text);
    }

    public setCallback(cb: () => void) {
        this.cb = cb;
    }
}
