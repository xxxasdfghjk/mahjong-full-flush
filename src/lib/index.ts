import { MahjongHand, Tile, Context } from './MahjongHand';
import { OneColorReadyHandGenerator } from './OneColorHandGenerator';
const fs = require('graceful-fs');

const test: { hand: Tile[]; context: Context }[] = [
    {
        hand: MahjongHand.getHandFromString('1113344557778p'),
        context: {
            tilePlace: 'Tsumo',
            isConcealed: true,
            winTile: new Tile('Dots', 4),
            prevalentWind: new Tile('East'),
            seatWind: new Tile('East')
        }
    },
    {
        hand: MahjongHand.getHandFromString('1133445566779p'),
        context: {
            tilePlace: 'Tsumo',
            isConcealed: true,
            winTile: new Tile('Dots', 4),
            prevalentWind: new Tile('East'),
            seatWind: new Tile('East')
        }
    },
    {
        hand: MahjongHand.getHandFromString('1222333444789p'),
        context: {
            tilePlace: 'Tsumo',
            isConcealed: true,
            winTile: new Tile('Dots', 4),
            prevalentWind: new Tile('East'),
            seatWind: new Tile('East')
        }
    }
    // {
    //     hand: MahjongHand.getHandFromString('1234566677788p'),
    //     context: {
    //         tilePlace: 'Tsumo',
    //         isConcealed: true,
    //         winTile: new Tile('Dots', 8),
    //         prevalentWind: new Tile('East'),
    //         seatWind: new Tile('East')
    //     }
    // },
    // {
    //     hand: MahjongHand.getHandFromString('11122233344455p'),
    //     context: {
    //         tilePlace: 'Tsumo',
    //         isConcealed: true,
    //         winTile: new Tile('Dots', 5),
    //         prevalentWind: new Tile('East'),
    //         seatWind: new Tile('East')
    //     }
    // },
    // {
    //     hand: MahjongHand.getHandFromString('1112345678899p'),
    //     context: {
    //         tilePlace: 'Tsumo',
    //         isConcealed: true,
    //         winTile: new Tile('Dots', 5),
    //         prevalentWind: new Tile('East'),
    //         seatWind: new Tile('East')
    //     }
    // },
    // {
    //     hand: MahjongHand.getHandFromString('11123456789p11z'),
    //     context: {
    //         tilePlace: 'Tsumo',
    //         isConcealed: true,
    //         winTile: new Tile('Dots', 5),
    //         prevalentWind: new Tile('East'),
    //         seatWind: new Tile('East')
    //     }
    // },
    // {
    //     hand: MahjongHand.getHandFromString('11123789p11122z'),
    //     context: {
    //         tilePlace: 'Tsumo',
    //         isConcealed: true,
    //         winTile: new Tile('Dots', 5),
    //         prevalentWind: new Tile('East'),
    //         seatWind: new Tile('East')
    //     }
    // },
    // {
    //     hand: MahjongHand.getHandFromString('11123789p11223m'),
    //     context: {
    //         tilePlace: 'Tsumo',
    //         isConcealed: true,
    //         winTile: new Tile('Dots', 5),
    //         prevalentWind: new Tile('East'),
    //         seatWind: new Tile('East')
    //     }
    // },
    // {
    //     hand: MahjongHand.getHandFromString('1122338p112233m'),
    //     context: {
    //         tilePlace: 'Tsumo',
    //         isConcealed: true,
    //         winTile: new Tile('Dots', 5),
    //         prevalentWind: new Tile('East'),
    //         seatWind: new Tile('East')
    //     }
    // },
    // {
    //     hand: MahjongHand.getHandFromString('1112233p111222m'),
    //     context: {
    //         tilePlace: 'Tsumo',
    //         isConcealed: true,
    //         winTile: new Tile('Dots', 5),
    //         prevalentWind: new Tile('East'),
    //         seatWind: new Tile('East')
    //     }
    // },
    // {
    //     hand: MahjongHand.getHandFromString('1114445p111345m'),
    //     context: {
    //         tilePlace: 'Tsumo',
    //         isConcealed: true,
    //         winTile: new Tile('Dots', 5),
    //         prevalentWind: new Tile('East'),
    //         seatWind: new Tile('East')
    //     }
    // },
    // {
    //     hand: MahjongHand.getHandFromString('11144466p11345m'),
    //     context: {
    //         tilePlace: 'Tsumo',
    //         isConcealed: true,
    //         winTile: new Tile('Dots', 5),
    //         prevalentWind: new Tile('East'),
    //         seatWind: new Tile('East')
    //     }
    // },
    // {
    //     hand: MahjongHand.getHandFromString('123p12399m22334s'),
    //     context: {
    //         tilePlace: 'Tsumo',
    //         isConcealed: true,
    //         winTile: new Tile('Dots', 5),
    //         prevalentWind: new Tile('East'),
    //         seatWind: new Tile('East')
    //     }
    // },
    // {
    //     hand: MahjongHand.getHandFromString('12399m55566677z'),
    //     context: {
    //         tilePlace: 'Tsumo',
    //         isConcealed: true,
    //         winTile: new Tile('Dots', 5),
    //         prevalentWind: new Tile('East'),
    //         seatWind: new Tile('East')
    //     }
    // },
    // {
    //     hand: MahjongHand.getHandFromString('1m111222333444z'),
    //     context: {
    //         tilePlace: 'Tsumo',
    //         isConcealed: true,
    //         winTile: new Tile('Dots', 5),
    //         prevalentWind: new Tile('East'),
    //         seatWind: new Tile('East')
    //     }
    // },
    // {
    //     hand: MahjongHand.getHandFromString('11m11122233355z'),
    //     context: {
    //         tilePlace: 'Tsumo',
    //         isConcealed: true,
    //         winTile: new Tile('Dots', 5),
    //         prevalentWind: new Tile('East'),
    //         seatWind: new Tile('East')
    //     }
    // },
    // {
    //     hand: MahjongHand.getHandFromString('222m22245677p22s'),
    //     context: {
    //         tilePlace: 'Tsumo',
    //         isConcealed: true,
    //         winTile: new Tile('Dots', 5),
    //         prevalentWind: new Tile('East'),
    //         seatWind: new Tile('East')
    //     }
    // },
    // {
    //     hand: MahjongHand.getHandFromString('2234455566777s'),
    //     context: {
    //         tilePlace: 'Tsumo',
    //         isConcealed: true,
    //         winTile: new Tile('Dots', 5),
    //         prevalentWind: new Tile('East'),
    //         seatWind: new Tile('East')
    //     }
    // },
    // {
    //     hand: MahjongHand.getHandFromString('1122334566777s'),
    //     context: {
    //         tilePlace: 'Tsumo',
    //         isConcealed: true,
    //         winTile: new Tile('Dots', 5),
    //         prevalentWind: new Tile('East'),
    //         seatWind: new Tile('East')
    //     }
    // },
    // {
    //     hand: MahjongHand.getHandFromString('1112444666999s'),
    //     context: {
    //         tilePlace: 'Tsumo',
    //         isConcealed: true,
    //         winTile: new Tile('Dots', 5),
    //         prevalentWind: new Tile('East'),
    //         seatWind: new Tile('East')
    //     }
    // }

    // MahjongHand.getHandFromString('123456789m55s67p'),
    // MahjongHand.getHandFromString('1245p1267m5689s1z'),
    // MahjongHand.getHandFromString('1245p1267m5689s1z'),
    // MahjongHand.getHandFromString('1245p1267m5689s1z'),
    // MahjongHand.getHandFromString('114455p3366m77s1z'),
    // MahjongHand.getHandFromString('114455p3366m77s11z'),
    // MahjongHand.getHandFromString('114455p3466m77s1z'),
    // MahjongHand.getHandFromString('19p119m19s1234567z'),
    // MahjongHand.getHandFromString('234p23466m234567s')
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
        console.log(MahjongHand.toString(e.hand));
        console.log(MahjongHand.toStringPic(e.hand));
        console.log(MahjongHand.calcSyanten(e.hand));
        if (MahjongHand.isReadyHand(e.hand)) {
            console.log(MahjongHand.getValidTilesWithYaku(e.hand, context));
        } else if (MahjongHand.calcSyanten(e.hand) == -1) {
            console.log(MahjongHand.getYaku(e.hand, e.context));
        }
    });
}
async function GenerateHandTest() {
    const oneColorReadyHandGenerator = await OneColorReadyHandGenerator.build();
    OneColorReadyHandGenerator.dumpReadyHand();
    MahjongHand.dumpMap();
}
HandUtilTest();
const hand = [
    new Tile('Dots', 1),
    new Tile('Dots', 1),
    new Tile('Dots', 3),
    new Tile('Dots', 3),
    new Tile('Dots', 4),
    new Tile('Dots', 4),
    new Tile('Dots', 5),
    new Tile('Dots', 5),
    new Tile('Dots', 7),
    new Tile('Dots', 7),
    new Tile('Dots', 7),
    new Tile('Dots', 8),
    new Tile('Dots', 6)
];
console.log(Tile.sortTiles(hand));
// GenerateHandTest();
