import * as PIXI from "pixi.js";

export abstract class SpriteComponent {
    public readonly layer: PIXI.Sprite;

    constructor(layer: PIXI.Sprite) {
        this.layer = layer;
    }

    public addChild(node: PIXI.ContainerChild) {
        this.layer.addChild(node);
        return node.uid;
    }

    public updateChildById(uid: number, node: PIXI.Sprite) {
        const foundIndex = this.layer.children.findIndex((n) => n.uid === uid);
        if (foundIndex) {
            this.layer.children[foundIndex] = node;
            return node.uid;
        }
        return -1;
    }

    public removeAllChildren() {
        this.layer.removeChild(
            ...this.layer.children,
        );
    }

    public render() {
        return this.layer;
    }
}
