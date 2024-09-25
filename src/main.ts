import './style.css';
import * as PIXI from 'pixi.js';
import {Keyboard} from "./components/keyboard";
import {Store} from "./store.ts";
import utils from "./utils.ts";
import {Display} from "./components/display";
import {GameProcess} from "./game-process.ts";
import {Helper} from "./components/helper";
import {Button} from "./components/button";
import {Popup} from "./components/popup";

const uid = Math.floor(Math.random() * (9999 - 1000) ) + 1000;
const store = new Store();
const root =  document.querySelector<HTMLDivElement>('#app');
const config = {
    width: window.outerWidth * 1.25,
    height: window.outerHeight * 1.25,
    background: '#2B344B',
    resolution: 1,
    antialias : true
};

const main = async (level = 0) => {
    const app = new PIXI.Application();
    await app.init(config);

    const game = new GameProcess(level, store, uid);
    const keyboard = (symbols: string[], x: number, y: number, onChange?: (e: any) => void, onData?: (e: any) => void) => {
        const component = new Keyboard(x, y, 294, 294);
        for (const symbol of symbols) {
            component.addButton(symbol);
        }
        component.on('change', (e) => onChange && onChange(e));
        component.on('data', (e) => onData && onData(e));
        return component.render();
    }
    const success = async (level: number, nextLevel: number) => {
        const app = new PIXI.Application();
        await app.init(config);

        const text = new PIXI.Text({
            text: `Уровень ${level} пройден`,
            style: new PIXI.TextStyle({
                fill: '#FFF'
            })
        })
        text.x = utils.crd(app.canvas.width, 50, text.width / 2);
        text.y = utils.crd(app.canvas.height, 10, text.height / 2);
        app.stage.addChild(text);

        const button = new Button(
            utils.crd(app.canvas.width, 50, 330 / 2),
            utils.crd(app.canvas.height, 50, 95 / 2),
        );
        button.setText(`Уровень ${nextLevel}`);
        button.setCallback(() => {
            main(nextLevel);
        })

        app.stage.addChild(await button.render());

        if (root?.firstChild) {
            root.replaceChild(app.canvas, root?.firstChild);
        } else {
            root?.appendChild(app.canvas);
        }
    }
    const display = (x: number, y: number, lines = [4]) => {
        const component = new Display(x, y, 425, 425);
        for (const size of lines) {
            component.addLine(size);
        }
        const ticker = new PIXI.Ticker();
        ticker.maxFPS = 5;
        ticker.add(() => {
            const answers = game.getAnswers();
            Object.keys(answers).forEach((key) => {
                const i = Number(key);
                const value = answers[i];
                component.setValue(i, value);
            })
        });
        ticker.start();
        return component.render();
    }

    // render display
    app.stage.addChild(
        display(
            utils.crd(app.canvas.width, 50, 425 / 2),
            utils.crd(app.canvas.height, 25, 425 / 2),
            game.getWordSizes()
        )
    )

    // render helper
    const helper = new Helper(
        utils.crd(app.canvas.width, 50, 425 / 2),
        utils.crd(app.canvas.height, 73, 425 / 2),
        425,
        42
    );
    app.stage.addChild(helper.render());

    // render controls
    app.stage.addChild(
        keyboard(
            game.getAlphabet(),
            utils.crd(app.canvas.width, 50, 294 / 2),
            utils.crd(app.canvas.height, 75, 294 / 2),
            (text) => {
                helper.setText(text);
            },
            (text) => {
                helper.clear();
                game.checkAnswer(text).then((index) => {
                    game.addAnswer(index as number, text);
                    if (game.isDone()) {
                        success(level, game.nextLevel());
                    }
                })
            }
        )
    );

    // render popup
    const popup = new Popup(
        utils.crd(app.canvas.width, 50, 530 / 2),
        utils.crd(app.canvas.height, 50, 447 / 2),
        530,
        447
    );

    popup.setCallback(() => {
        window.location.reload();
    });

    app.ticker.add((e) => {
        e.maxFPS = 1;
        const savedUid = Number(store.getItem('uid') ?? 0);
        if (savedUid !== uid) {
            app.stage.addChild(popup.render());
            e.stop();
        }
    })


    if (root?.firstChild) {
        root.replaceChild(app.canvas, root?.firstChild);
    } else {
        root?.appendChild(app.canvas);
    }
}

main(Number(store.getItem('level') ?? 0));
