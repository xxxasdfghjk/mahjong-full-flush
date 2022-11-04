import { stringify } from 'querystring';
import { MahjongHand, Tile, Context } from './MahjongHand';
const fs = require('graceful-fs');

function generateAllHand(currentNumber: number, restCount: number): string[] {
    if (restCount == 0) return [''];
    if (currentNumber <= 0 || currentNumber >= 10) return [];
    const st = String(currentNumber);
    const add0 = generateAllHand(currentNumber + 1, restCount);
    const add1 = generateAllHand(currentNumber + 1, restCount - 1).map(
        (e) => st + e
    );
    const add2 = generateAllHand(currentNumber + 1, restCount - 2).map(
        (e) => st + st + e
    );
    const add3 = generateAllHand(currentNumber + 1, restCount - 3).map(
        (e) => st + st + st + e
    );
    const add4 = generateAllHand(currentNumber + 1, restCount - 4).map(
        (e) => st + st + st + st + e
    );
    return [...add0, ...add1, ...add2, ...add3, ...add4];
}

const test: { hand: MahjongHand; context: Context }[] = [
    // {
    //     hand: new MahjongHand('234567s12345666p'),
    //     context: {
    //         tilePlace: 'Tsumo',
    //         isConcealed: true,
    //         winTile: new Tile('Dots', 4),
    //         prevalentWind: new Tile('East'),
    //         seatWind: new Tile('East')
    //     }
    // },
    {
        hand: new MahjongHand('1234566677788p'),
        context: {
            tilePlace: 'Tsumo',
            isConcealed: true,
            winTile: new Tile('Dots', 8),
            prevalentWind: new Tile('East'),
            seatWind: new Tile('East')
        }
    },
    {
        hand: new MahjongHand('11122233344455p'),
        context: {
            tilePlace: 'Tsumo',
            isConcealed: true,
            winTile: new Tile('Dots', 5),
            prevalentWind: new Tile('East'),
            seatWind: new Tile('East')
        }
    },
    {
        hand: new MahjongHand('1112345678899p'),
        context: {
            tilePlace: 'Tsumo',
            isConcealed: true,
            winTile: new Tile('Dots', 5),
            prevalentWind: new Tile('East'),
            seatWind: new Tile('East')
        }
    },
    {
        hand: new MahjongHand('11123456789p11z'),
        context: {
            tilePlace: 'Tsumo',
            isConcealed: true,
            winTile: new Tile('Dots', 5),
            prevalentWind: new Tile('East'),
            seatWind: new Tile('East')
        }
    },
    {
        hand: new MahjongHand('11123789p11122z'),
        context: {
            tilePlace: 'Tsumo',
            isConcealed: true,
            winTile: new Tile('Dots', 5),
            prevalentWind: new Tile('East'),
            seatWind: new Tile('East')
        }
    },
    {
        hand: new MahjongHand('11123789p11223m'),
        context: {
            tilePlace: 'Tsumo',
            isConcealed: true,
            winTile: new Tile('Dots', 5),
            prevalentWind: new Tile('East'),
            seatWind: new Tile('East')
        }
    }

    // new MahjongHand('123456789m55s67p'),
    // new MahjongHand('1245p1267m5689s1z'),
    // new MahjongHand('1245p1267m5689s1z'),
    // new MahjongHand('1245p1267m5689s1z'),
    // new MahjongHand('114455p3366m77s1z'),
    // new MahjongHand('114455p3366m77s11z'),
    // new MahjongHand('114455p3466m77s1z'),
    // new MahjongHand('19p119m19s1234567z'),
    // new MahjongHand('234p23466m234567s')
];

test.forEach((e) => {
    const context: Context = {
        tilePlace: 'Tsumo',
        isConcealed: true,
        winTile: new Tile('East'),
        prevalentWind: new Tile('East'),
        seatWind: new Tile('East')
    };
    console.log(e.hand.toString());
    console.log(MahjongHand.calcSyanten(e.hand.getHand()));
    if (MahjongHand.isReadyHand(e.hand.getHand())) {
        console.log(
            MahjongHand.getValidTilesWithYaku(e.hand.getHand(), context)
        );
    } else if (MahjongHand.calcSyanten(e.hand.getHand()) == -1) {
        console.log(MahjongHand.getYaku(e.hand.getHand(), e.context));
    }
});

// const testClass = test.map((e) => new MahjongHand(e));
// testClass.forEach((e) => {
//     console.log(e.calcSyanten(e.getHand()));
//     console.log(e.getValidTiles());
// });
