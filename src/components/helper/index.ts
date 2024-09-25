import * as PIXI from "pixi.js";
import assets from "../display/assets.ts";

export class Helper {
    private readonly layer: PIXI.Container;
    // @ts-ignore
    private readonly width;
    // @ts-ignore
    private readonly height;

    constructor(x: number, y: number, width: number, height: number) {
        this.layer =  new PIXI.Container();
        this.layer.x = x;
        this.layer.y = y;
        this.layer.width = this.width = width;
        this.layer.height = this.height = height;
    }

    public setText(str: string) {
        const length = str.length;
        const container = new PIXI.Container();
        container.x = (this.width - (length * 46)) / 2;
        for (let i=0; i<length; i++) {
            const sprite = PIXI.Sprite.from(assets.backgroundType3);
            sprite.width = 42;
            sprite.height = 42;
            sprite.x = (sprite.width + 4) * i;
            sprite.anchor = .2;
            sprite.addChild(new PIXI.Text({
                text: str[i]
            }))
            container.addChild(sprite);
        }
        this.clear();
        this.layer.addChild(container);
    }

    public clear() {
        this.layer.removeChild(...this.layer.children);
    }

    public render() {
        return this.layer;
    }
}
