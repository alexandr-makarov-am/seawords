import dictionary from "./dictionary";
import {Store} from "./store.ts";


export class GameProcess {

    private readonly stack: string[];
    private readonly answers: Record<number, string>;
    private readonly alphabet: string[];
    private readonly store: Store;
    private readonly level: number;
    private readonly uid: number;

    constructor(level: number, store: Store, uid: number) {
        this.store = store;
        this.level = level;
        this.uid = uid
        this.stack = dictionary[level % 3].words.sort((a, b) => a.length - b.length);
        this.alphabet = [];
        this.answers = JSON.parse(this.store.getItem('answers') ?? '{}');

        let stats: Record<string, number>[] = [];
        let i = 0;
        for(const word of this.stack) {
            stats[i] = {};
            for (const s of word) {
                if (stats[i][s]) {
                    stats[i][s] +=1;
                }else {
                    stats[i][s] = 1;
                }
                const found = this.alphabet.filter((el) => el === s);
                if (stats[i][s] > found.length) {
                    this.alphabet.push(s);
                }
            }
            i += 1;
        }

        this.alphabet = this.alphabet.sort(() => Math.random() - 0.5);
        this.store.setItem('level', this.level);
        this.store.setItem('uid', this.uid);

    }

    public checkAnswer(str: string) {
        return new Promise((resolve, reject) => {
            const foundIndex = this.stack.findIndex((s) => s.toUpperCase() === str.toUpperCase());
            if (foundIndex > -1) {
                resolve(foundIndex);
            } else {
                reject(-1);
            }
        })
    }

    public addAnswer(i: number, str: string) {
        this.answers[i] = str;
        this.store.setItem('answers', JSON.stringify(this.answers));
    }

    public getAnswers() {
        return this.answers;
    }

    public isDone() {
        return this.stack.length === Object.values(this.answers).length;
    }

    public getAlphabet() {
        return this.alphabet;
    }

    public getWordSizes() {
        return this.stack.map((str) => str.length);
    }

    public nextLevel() {
        const level =  this.level + 1;
        this.store.clear();
        this.store.setItem('level', level);
        this.store.setItem('uid', this.uid);
        return level;
    }
}
