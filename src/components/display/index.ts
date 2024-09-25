import * as PIXI from 'pixi.js';
import assets from "./assets.ts";
import {TextStyle} from "pixi.js";

export class Display {

    private readonly layer: PIXI.Container;
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

    public addLine(size: number, options = { cellSize: 40, mx: 10, my: 10 }) {
        const { cellSize, mx, my } = options;
        const length = this.layer.children.length;
        const container = new PIXI.Container();
        container.x = (this.width - ((cellSize + mx) * size)) / 2;
        container.y = (cellSize + my) * length;
        for (let i= 0; i < size; i++) {
            const sprite = PIXI.Sprite.from(assets.backgroundType1);
            sprite.width = cellSize;
            sprite.height = cellSize;
            sprite.y = 0;
            sprite.x = (i * cellSize) + (mx * i);
            container.addChild(sprite);
        }
        this.layer.addChild(container);
    }

    public setValue(line: number, text: string) {
        const container = this.layer.children[line] as PIXI.Container;
        container.children.map((child, index) => {
            const sprite = child as PIXI.Sprite;
            const label = new PIXI.Text({
                text: (text[index] ?? '').toUpperCase(),
                style: new TextStyle({
                    fontFamily: 'Inter',
                    fontWeight: 'bold',
                    fontSize: 48,
                    fill: '#58595B',
                    align: 'center',
                })
            });
            label.x = 14;
            label.anchor = -0.1;
            if (label.text.length > 0) {
                sprite.texture = assets.backgroundType2;
                label.style.fill = '#FFFFFF';
            } else {
                sprite.texture = assets.backgroundType1;
                label.style.fill = '#58595B';
            }
            sprite.removeChild(...sprite.children);
            sprite.addChildAt(label, 0)
        })
    }

    public render () {
        return this.layer;
    }
}
