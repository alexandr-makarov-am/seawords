import * as PIXI from "pixi.js";
import {SpriteComponent} from "../sprite-component.ts";
import assets from "./assets.ts";

export class Button extends SpriteComponent {

    public label: PIXI.Text;
    public labelStyle: Record<string, any>;

    constructor(x: number, y: number, width = 90, height = 95) {
        super(PIXI.Sprite.from(assets.buttonType1));
        this.layer.interactive = true;
        this.layer.x = x;
        this.layer.y = y;
        this.layer.width = width;
        this.layer.height = height;
        this.layer.cursor = "pointer";
        this.labelStyle = {
            fontFamily: 'Inter',
            fontWeight: 'bold',
            fontSize: 48,
            fill: '#58595B',
            align: 'center',
        }
        this.label = new PIXI.Text({
            style: new PIXI.TextStyle(this.labelStyle)
        });
        this.label.anchor = .53;
        this.layer.addChild(this.label);
    }

    public setText(str: string) {
        this.label.text = str.toUpperCase();
    }

    public setEffect(type: 'default' | 'hover') {
        switch (type) {
            case "hover":
                this.label.style = {
                    ...this.labelStyle,
                    fill: '#FFF',
                };
                this.layer.texture = assets.buttonType2;
                break;
            default:
            case "default":
                this.label.style = { ...this.labelStyle };
                this.layer.texture = assets.buttonType1;
                break;
        }
    }
}
