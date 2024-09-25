
export class Store {
    private readonly name = 'seawords_store';
    private data: Record<string, any>;

    constructor() {
        window.addEventListener('storage', () => {
            this.init(
                window.localStorage.getItem(this.name) ?? '{}'
            )
        });
        this.data = {};
        this.init(
            window.localStorage.getItem(this.name) ?? '{}'
        );
    }

    private init(payload: string) {
        this.data = JSON.parse(payload);
    }

    private flush() {
        window.localStorage.setItem(this.name, JSON.stringify(this.data));
    }

    public clear(): void {
        this.data = {};
        this.flush();
    }

    public getItem(key: string): string | null {
        return this.data[key];
    }

    public removeItem(key: string): void {
        delete this.data[key];
        this.flush();
    }

    public setItem(key: string, value: string | number): void {
        this.data[key] = value;
        this.flush();
    }
}
