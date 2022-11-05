import { stringify } from 'querystring';
import { MahjongHand, Tile, Context } from './MahjongHand';
import { OneColorReadyHandGenerator } from './OneColorHandGenerator';
const fs = require('graceful-fs');

const test: { hand: MahjongHand; context: Context }[] = [
    {
        hand: new MahjongHand('234567s12345666p'),
        context: {
            tilePlace: 'Tsumo',
            isConcealed: true,
            winTile: new Tile('Dots', 4),
            prevalentWind: new Tile('East'),
            seatWind: new Tile('East')
        }
    },
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
    },
    {
        hand: new MahjongHand('1122338p112233m'),
        context: {
            tilePlace: 'Tsumo',
            isConcealed: true,
            winTile: new Tile('Dots', 5),
            prevalentWind: new Tile('East'),
            seatWind: new Tile('East')
        }
    },
    {
        hand: new MahjongHand('1112233p111222m'),
        context: {
            tilePlace: 'Tsumo',
            isConcealed: true,
            winTile: new Tile('Dots', 5),
            prevalentWind: new Tile('East'),
            seatWind: new Tile('East')
        }
    },
    {
        hand: new MahjongHand('1114445p111345m'),
        context: {
            tilePlace: 'Tsumo',
            isConcealed: true,
            winTile: new Tile('Dots', 5),
            prevalentWind: new Tile('East'),
            seatWind: new Tile('East')
        }
    },
    {
        hand: new MahjongHand('11144466p11345m'),
        context: {
            tilePlace: 'Tsumo',
            isConcealed: true,
            winTile: new Tile('Dots', 5),
            prevalentWind: new Tile('East'),
            seatWind: new Tile('East')
        }
    },
    {
        hand: new MahjongHand('123p12399m22334s'),
        context: {
            tilePlace: 'Tsumo',
            isConcealed: true,
            winTile: new Tile('Dots', 5),
            prevalentWind: new Tile('East'),
            seatWind: new Tile('East')
        }
    },
    {
        hand: new MahjongHand('12399m55566677z'),
        context: {
            tilePlace: 'Tsumo',
            isConcealed: true,
            winTile: new Tile('Dots', 5),
            prevalentWind: new Tile('East'),
            seatWind: new Tile('East')
        }
    },
    {
        hand: new MahjongHand('1m111222333444z'),
        context: {
            tilePlace: 'Tsumo',
            isConcealed: true,
            winTile: new Tile('Dots', 5),
            prevalentWind: new Tile('East'),
            seatWind: new Tile('East')
        }
    },
    {
        hand: new MahjongHand('11m11122233355z'),
        context: {
            tilePlace: 'Tsumo',
            isConcealed: true,
            winTile: new Tile('Dots', 5),
            prevalentWind: new Tile('East'),
            seatWind: new Tile('East')
        }
    },
    {
        hand: new MahjongHand('222m22245677p22s'),
        context: {
            tilePlace: 'Tsumo',
            isConcealed: true,
            winTile: new Tile('Dots', 5),
            prevalentWind: new Tile('East'),
            seatWind: new Tile('East')
        }
    },
    {
        hand: new MahjongHand('2234455566777s'),
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

// test.forEach((e) => {
//     const context: Context = {
//         tilePlace: 'Tsumo',
//         isConcealed: true,
//         winTile: new Tile('East'),
//         prevalentWind: new Tile('East'),
//         seatWind: new Tile('East')
//     };
//     MahjongHand.getSetsComposition(e.hand.getHand()).forEach((e) => {
//         Object.keys(e.completed).forEach((el) =>
//             console.log(e.completed['CRun'])
//         );
//         console.log(e.inCompleted);
//     });
// });
function HandUtilTest() {
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
}
async function GenerateHandTest() {
    const oneColorReadyHandGenerator = await OneColorReadyHandGenerator.build();
    console.log(oneColorReadyHandGenerator.getRandomOne());
    console.log(oneColorReadyHandGenerator.getRandomOne());
    console.log(oneColorReadyHandGenerator.getRandomOne());
    console.log(oneColorReadyHandGenerator.getRandomOne());
    console.log(oneColorReadyHandGenerator.getRandomOne());
}
GenerateHandTest();
