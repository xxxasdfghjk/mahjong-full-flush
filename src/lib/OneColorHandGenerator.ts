import { MahjongHand, Tile } from './MahjongHand';

export class OneColorReadyHandGenerator {
    private dumpFilePath =
        'https://raw.githubusercontent.com/xxxasdfghjk/mahjong-full-flush/main/public/readyHands.txt';
    private readyPattern: string[];
    static generateAllHand(currentNumber: number, restCount: number): string[] {
        if (restCount == 0) return [''];
        if (currentNumber <= 0 || currentNumber >= 10) return [];
        const st = String(currentNumber);
        const add0 = this.generateAllHand(currentNumber + 1, restCount);
        const add1 = this.generateAllHand(currentNumber + 1, restCount - 1).map(
            (e) => st + e
        );
        const add2 = this.generateAllHand(currentNumber + 1, restCount - 2).map(
            (e) => st + st + e
        );
        const add3 = this.generateAllHand(currentNumber + 1, restCount - 3).map(
            (e) => st + st + st + e
        );
        const add4 = this.generateAllHand(currentNumber + 1, restCount - 4).map(
            (e) => st + st + st + st + e
        );
        return [...add0, ...add1, ...add2, ...add3, ...add4];
    }

    public getRandomOne(): string {
        return this.readyPattern[
            Math.floor(Math.random() * this.readyPattern.length)
        ];
    }

    async importReadyHand() {
        const rawData = await (await fetch(this.dumpFilePath)).text();
        this.readyPattern = rawData.split('\n');
    }
    public static dumpReadyHand() {
        const readyPattern = OneColorReadyHandGenerator.generateAllHand(
            1,
            13
        ).filter((e) => {
            const hand = MahjongHand.getHandFromString(e + 'm');
            const readyNum = MahjongHand.calcSyanten(hand);
            const validTileCount = MahjongHand.getValidTileCount(hand).filter(
                (e) => e.count != 0
            );
            return readyNum == 0 && validTileCount.length != 0;
        });
        readyPattern.forEach((e) => console.log(e));
    }

    public static async build() {
        const oneColorReadyHandGenerator = new OneColorReadyHandGenerator();
        await oneColorReadyHandGenerator.importReadyHand();
        return oneColorReadyHandGenerator;
    }

    constructor() {
        this.readyPattern = [];
    }
}
