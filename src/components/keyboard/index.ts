import * as PIXI from 'pixi.js';
import assets from "./assets.ts";
import {Button} from "./button.ts";

export class Keyboard {
    public  readonly layer: PIXI.Sprite;
    private readonly ticker: PIXI.Ticker;
    private readonly events: Record<string, (e:any) => void>;
    private buttons: Button[];
    private mouse: number[];
    private state: { uid: number, text: string, x: number, y: number }[];

    constructor(x: number, y: number, width = 294, height = 294) {
        this.buttons = [];
        this.state = [];
        this.mouse = [];
        this.events = {};
        this.ticker = new PIXI.Ticker();
        this.layer = PIXI.Sprite.from(assets.background);
        this.layer.interactive = true;
        this.layer.x = x;
        this.layer.y = y;
        this.layer.width = width;
        this.layer.height = height;
        this.layer.on('pointerdown', this.onPointerDown.bind(this));
        this.layer.on('pointermove', this.onPointerMove.bind(this));
        this.layer.on('pointerup', this.onPointerUp.bind(this));
    }

    private getValue() {
        return this.state.map((e) => e.text).join('');
    }

    private onPointerDown(e: PIXI.FederatedPointerEvent) {
        this.findIntersections(e);
    }

    private onPointerMove(e: PIXI.FederatedPointerEvent) {
        if (this.mouse.length > 0) {
            this.findIntersections(e);
        }
    }

    private onPointerUp() {
        const callback = this.events['data'];
        if (callback && this.state.length > 0) {
            callback(this.getValue());
        }
        this.mouse = [];
        this.state = [];
    }

    private findIntersections(e: PIXI.FederatedPointerEvent){
        const x = e.nativeEvent.offsetX - this.layer.x;
        const y = e.nativeEvent.offsetY - this.layer.y;
        this.mouse = [x, y];
        const found = this.buttons.find((button) => {
            const { layer: child} = button;
            const x2 = (child.position.x + child.width) - (child.width * .5);
            const x1 = x2 - child.width;
            const y2 = (child.position.y + child.height) - (child.height * .5);
            const y1 = y2 - child.height;
            return (x > x1 && x < x2) && (y > y1 && y < y2);
        });
        if (found) {
            const layer = found.layer;
            const exists = this.state.find((el) => el.uid === found.layer.uid);
            const callback = this.events['change'];
            if (!exists) {
                this.state.push({
                    uid: layer.uid,
                    text: found.label.text,
                    x: layer.position.x,
                    y: layer.position.y
                });
                if (callback) callback(this.getValue());
            } else if (this.state[this.state.length-2]?.uid === found.layer.uid) {
                this.state.splice(this.state.length-1, 1);
                if (callback) callback(this.getValue());
            }
        }
    }

    public addButton(text: string) {
        const button = new Button(0, 0,);
        button.setText(text);
        const payload = [...this.buttons, button];
        const angle = 360 / payload.length;
        const x0 = this.layer.width / 2;
        const y0 = this.layer.height / 2;
        const radius = this.layer.width / 2;
        this.buttons = payload.map((el, i) => {
            const a = (angle * i) / 180 * Math.PI;
            el.layer.x = Math.round(x0 + radius * Math.cos(a));
            el.layer.y = Math.round(y0 + radius * Math.sin(a));
            el.layer.anchor = .5;
            return el;
        });
        this.layer.addChild(...this.buttons.map(({ layer }) => layer));
    }

    public on(event: 'change' | 'data', cb: (e: any) => void) {
        this.events[event] = cb;
    }

    public render() {
        const graphics = new PIXI.Graphics();
        this.ticker.add(() => {
            this.buttons = this.buttons.map((button) => {
                const found = this.state.find((el) => el.uid === button.layer.uid)
                button.setEffect(found ? 'hover' : 'default')
                return button;
            });
            graphics.clear();
            for (const it in this.state) {
                const i = Number(it);
                const child = this.state[i];
                if (i === 0) {
                    graphics.moveTo(child.x, child.y);
                } else {
                    graphics.lineTo(child.x, child.y);
                }
                graphics.circle(child.x, child.y, 1);
            }
            if (this.mouse.length > 0) {
                graphics.lineTo(this.mouse[0], this.mouse[1]);
                graphics.circle(this.mouse[0], this.mouse[1], 1);
            }
            graphics.stroke({ width: 21, color: '#638EC4' });
            graphics.fill('#638EC4');
        })
        this.layer.addChild(graphics);
        this.ticker.start();
        return this.layer;
    }
}
