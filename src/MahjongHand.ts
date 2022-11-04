type SuitType = Honors | Simples | 'None';
type Wins = 'East' | 'South' | 'West' | 'North';
type Dragons = 'White Dragon' | 'Green Dragon' | 'Red Dragon';
type Honors = Wins | Dragons;
interface MahjongTile {
    suit: SuitType;
}
const simplesArray: SuitType[] = ['Dots', 'Bamboos', 'Characters'];
const honorArray: SuitType[] = [
    'East',
    'South',
    'West',
    'North',
    'White Dragon',
    'Green Dragon',
    'Red Dragon'
];
type Simples = 'Dots' | 'Bamboos' | 'Characters';
const HonorsMap: { [key: string]: number } = {
    'White Dragon': 1,
    'Green Dragon': 4,
    'Red Dragon': 7,
    East: 11,
    South: 14,
    West: 17,
    North: 20
};
type SetsStatus = 'CRun' | 'CTriple' | 'NCRun' | 'NCTriple' | 'Head';
type WinTilePlace = 'Tsumo' | 'Ron' | 'Quad';
type SetsComposition = {
    completed: { [key: string]: Tile[] }[];
    inCompleted: Tile[];
};
export type Context = {
    isReech?: boolean;
    isReechFirstTurn?: boolean;
    isFinalTile?: boolean;
    tilePlace: WinTilePlace;
    isAddAQuad?: boolean;
    isConcealed: boolean;
    winTile: Tile;
    isBlessingOfEarth?: boolean;
    isBlessingOfHeaven?: boolean;
    isKingsTileDraw?: boolean;
    prevalentWind: Tile;
    seatWind: Tile;
};

export class Tile {
    private suit: SuitType;
    private number: number | null;
    constructor(suit: SuitType, number: number | null = null) {
        this.suit = suit;
        this.number = number;
    }
    isSame(tile: Tile): boolean {
        return (
            tile.getSuit() == this.getSuit() &&
            tile.getNumber() == this.getNumber()
        );
    }
    isHonorsTile(): boolean {
        return honorArray.includes(this.suit);
    }
    isSimpleTile(): boolean {
        return simplesArray.includes(this.suit);
    }
    getNumber(): number | null {
        return this.number;
    }
    getSuit(): SuitType {
        return this.suit;
    }
    getNextTile(): Tile {
        if (this.isSimpleTile())
            return new Tile(this.getSuit(), ((this.number ?? 0 + 1) % 10) + 1);
        else {
            switch (this.getSuit()) {
                case 'East':
                    return new Tile('South');
                case 'South':
                    return new Tile('West');
                case 'West':
                    return new Tile('North');
                case 'North':
                    return new Tile('East');
                case 'Green Dragon':
                    return new Tile('Red Dragon');
                case 'Red Dragon':
                    return new Tile('White Dragon');
                default:
                    return new Tile('Green Dragon');
            }
        }
    }
}

const arrayToString = (array: number[]): string => {
    const res = array.map((e) => String(e)).join('');
    return res;
};

export const existArray = <T>(
    originArray: Array<T>,
    needleArray: Array<T>
): boolean => {
    const map = new Map();
    needleArray.forEach((e) => {
        map.set(e, (map.get(e) ?? 0) + 1);
    });
    let result = true;
    map.forEach((value, key) => {
        if (!(originArray.filter((e) => key == e).length >= value)) {
            result = false;
        }
    });
    return result;
};

export const exceptArray = <T>(
    originArray: Array<T>,
    subArray: Array<T>
): Array<T> => {
    const resultArray = originArray.concat();
    subArray.forEach((e) => {
        if (resultArray.includes(e))
            resultArray.splice(resultArray.indexOf(e), 1);
    });
    return resultArray;
};

type ReachState = 'Reeched' | 'None' | 'First Turn';

export class MahjongHand {
    private hand: Tile[];
    private static memo: Map<String, [number, number]> = new Map();
    private static syantenFilePath = './tarts_num.txt';
    private reechState: ReachState = 'None';

    isValidFormat(str: string) {
        return true;
    }

    declareReech() {
        this.reechState = 'First Turn';
    }

    passedFirstTurn() {
        this.reechState = 'Reeched';
    }

    static getHandFromString(str: string) {
        let stack: string = '';
        let res: Tile[] = [];
        const delimiter = ['m', 'p', 's', 'z'];
        const map: { [delimiter: string]: SuitType } = {
            m: 'Characters',
            p: 'Dots',
            s: 'Bamboos'
        };
        const honorsMap: { [num: number]: Honors } = {
            1: 'East',
            2: 'South',
            3: 'West',
            4: 'North',
            5: 'White Dragon',
            6: 'Green Dragon',
            7: 'Red Dragon'
        };
        for (let i = 0; i < str.length; i++) {
            if (delimiter.includes(str[i])) {
                if (str[i] == 'z') {
                    res = res = [
                        ...res,
                        ...stack
                            .split('')
                            .map((e) => new Tile(honorsMap[Number(e)]))
                    ];
                } else {
                    res = [
                        ...res,
                        ...stack
                            .split('')
                            .map((e) => new Tile(map[str[i]], Number(e)))
                    ];
                }
                stack = '';
            } else if (str[i] > '9' || str[i] < '0') {
                return [];
            } else {
                stack = stack + str[i];
            }
        }
        return res;
    }

    constructor(tileArray: Tile[]);
    constructor(tileArray: string);
    constructor(tileArray: string | Tile[]) {
        if (typeof tileArray === 'string') {
            this.hand = this.isValidFormat(tileArray)
                ? MahjongHand.getHandFromString(tileArray)
                : [];
        } else {
            this.hand = tileArray;
        }
    }
    getHand() {
        return this.hand.concat();
    }
    setHand(tiles: Tile[]) {
        this.hand = tiles;
    }

    static async loadSyantenFile() {
        const txt = await (
            await (await fetch(this.syantenFilePath)).text()
        ).split('\n');
        for (const row of txt) {
            const [str, set, tarts] = row.split(' ');
            this.memo.set(str, [Number(set), Number(tarts)]);
        }
    }
    static isReadyHand(tiles: Tile[]) {
        return MahjongHand.calcSyanten(tiles) == 0;
    }

    static getValidTilesWithYaku(
        tiles: Tile[],
        context: Context
    ): { tile: Tile; Yaku: string[] }[] {
        if (tiles.length != 13) return [];
        if (MahjongHand.calcSyanten(tiles) != 0) {
            return [];
        }
        const validTiles = MahjongHand.getValidTiles(tiles);
        return validTiles.map((tile) => {
            const examHand = tiles.concat();
            examHand.push(tile);
            context.winTile = tile;

            return { tile: tile, Yaku: MahjongHand.getYaku(examHand, context) };
        });
    }

    static getValidTiles(tiles: Tile[]) {
        if (tiles.length != 13) return [];
        const baseSyanten = this.calcSyanten(tiles);
        const validTiles = [];
        for (const suit of simplesArray) {
            for (let i = 1; i <= 9; i++) {
                const hand = tiles.concat();
                const examTile: Tile = new Tile(suit, i);
                hand.push(examTile);
                const syanten = this.calcSyanten(hand);
                if (syanten < baseSyanten) {
                    validTiles.push(examTile);
                }
            }
        }
        for (const suit of honorArray) {
            const hand = tiles.concat();
            const examTile: Tile = new Tile(suit);
            hand.push(examTile);
            const syanten = this.calcSyanten(hand);
            if (syanten < baseSyanten) {
                validTiles.push(examTile);
            }
        }
        return validTiles;
    }

    static calcSevenPairsSyanten(hand: Tile[]) {
        return (
            6 -
            hand
                .reduce((prev: Tile[], cur) => {
                    return prev.find((e) => e.isSame(cur))
                        ? prev
                        : [...prev, cur];
                }, [])
                .reduce((prev, cur, index, arr) => {
                    return (
                        prev +
                        (hand.filter((elem) => elem.isSame(cur)).length >= 2
                            ? 1
                            : 0)
                    );
                }, 0)
        );
    }

    static calcThirteenOrphansSyanten(hand: Tile[]) {
        const yaoNum = hand
            .reduce((prev: Tile[], cur) => {
                return prev.find((e) => e.isSame(cur)) ? prev : [...prev, cur];
            }, [])
            .filter(
                (e) =>
                    e.isHonorsTile() || e.getNumber() == 1 || e.getNumber() == 9
            ).length;
        return (
            13 -
            (yaoNum +
                (hand
                    .filter(
                        (e) =>
                            e.isHonorsTile() ||
                            e.getNumber() == 1 ||
                            e.getNumber() == 9
                    )
                    .reduce((prev, cur) => {
                        return (
                            prev ||
                            hand.filter((el) => el.isSame(cur)).length >= 2
                        );
                    }, false)
                    ? 1
                    : 0))
        );
    }

    static calcSyanten(hand: Tile[]): number {
        const thirteenOrphansSyanten = this.calcThirteenOrphansSyanten(hand);
        const sevenPairsSyanten = this.calcSevenPairsSyanten(hand);

        const char = hand
            .filter((e) => e.getSuit() == 'Characters')
            .map((e) => e.getNumber() ?? 0)
            .sort();
        const dots = hand
            .filter((e) => e.getSuit() == 'Dots')
            .map((e) => e.getNumber() ?? 0)
            .sort();
        const bamboo = hand
            .filter((e) => e.getSuit() == 'Bamboos')
            .map((e) => e.getNumber() ?? 0)
            .sort();
        const honors = hand
            .filter((e) => e.isHonorsTile())
            .map((e) => HonorsMap[e.getSuit()] ?? 0)
            .sort();

        const groupBySuit = [char, dots, bamboo, honors];
        const points: number[] = [];
        for (let i = 0; i < groupBySuit.length; i++) {
            const uniqueNumber = new Set(groupBySuit[i]);
            for (const elem of uniqueNumber) {
                if (existArray(groupBySuit[i], [elem, elem])) {
                    const exceptedArray = exceptArray(groupBySuit[i], [
                        elem,
                        elem
                    ]);

                    const [set, tarts] = [
                        exceptedArray,
                        ...groupBySuit.filter((v, index) => {
                            return i != index;
                        })
                    ].reduce(
                        (prev, cur) => {
                            const [m, t] = this.calcReadyPoint({
                                inCompleted: cur
                            });
                            return [prev[0] + m, prev[1] + t];
                        },
                        [0, 0]
                    );
                    const sub = set + tarts - 4;
                    points.push(
                        8 - (2 * set + tarts - (sub >= 0 ? sub : 0) + 1)
                    );
                }
            }
        }
        const [set, tarts] = groupBySuit.reduce(
            (prev: any, cur: any) => {
                const [m, t] = this.calcReadyPoint({
                    inCompleted: cur
                });
                return [prev[0] + m, prev[1] + t];
            },
            [0, 0]
        );

        const sub = set + tarts - 4;
        points.push(8 - 2 * set - tarts + (sub >= 0 ? sub : 0));
        points.sort();
        return Math.min(points[0], thirteenOrphansSyanten, sevenPairsSyanten);
    }

    static exceptFrom(targetTiles: Tile[], exceptTiles: Tile[] | string) {
        const handTiles = targetTiles.concat();
        if (typeof exceptTiles == 'string') {
            const exceptTilesFromString = this.getHandFromString(exceptTiles);
            for (const e of exceptTilesFromString) {
                const index = handTiles.findIndex((elem) => e.isSame(elem));
                if (index != -1) handTiles.splice(index, 1);
            }
        } else {
            for (const e of exceptTiles) {
                const index = handTiles.findIndex((elem) => e.isSame(elem));
                if (index != -1) handTiles.splice(index, 1);
            }
        }
        return handTiles;
    }

    static existFrom(
        targetTiles: Tile[],
        needleTiles: Tile[] | string
    ): boolean {
        return typeof needleTiles == 'string'
            ? targetTiles.length -
                  this.exceptFrom(
                      targetTiles,
                      this.getHandFromString(needleTiles)
                  ).length ==
                  this.getHandFromString(needleTiles).length
            : targetTiles.length -
                  this.exceptFrom(targetTiles, needleTiles).length ==
                  needleTiles.length;
    }

    except(exceptTiles: Tile[] | string): Tile[] {
        const handTiles = this.getHand();
        if (typeof exceptTiles == 'string') {
            const exceptTilesFromString =
                MahjongHand.getHandFromString(exceptTiles);
            for (const e of exceptTilesFromString) {
                const index = handTiles.findIndex((elem) => e.isSame(elem));
                if (index != -1) handTiles.splice(index, 1);
            }
        } else {
            for (const e of exceptTiles) {
                const index = handTiles.findIndex((elem) => e.isSame(elem));
                if (index != -1) handTiles.splice(index, 1);
            }
        }
        return handTiles;
    }

    exist(exceptTiles: Tile[] | string): boolean {
        return typeof exceptTiles == 'string'
            ? this.getHand().length -
                  this.except(MahjongHand.getHandFromString(exceptTiles))
                      .length ==
                  MahjongHand.getHandFromString(exceptTiles).length
            : this.getHand().length - this.except(exceptTiles).length ==
                  exceptTiles.length;
    }

    getAllVariableTiles(): Tile[] {
        const res: Tile[] = [];
        for (const suit of simplesArray)
            for (let i = 1; i < 9; i++) res.push(new Tile(suit, i));
        for (const suit of honorArray) res.push(new Tile(suit));
        return res;
    }

    static isValueTiles(hand: Tile[], context: Context) {
        const setsComposition = MahjongHand.getSetsComposition(
            MahjongHand.exceptFrom(hand, [context.winTile])
        );
        const variableTiles = MahjongHand.getValueTiles(context);
        return (
            setsComposition.filter((comp) => {
                return (
                    comp.completed.find(
                        (e) =>
                            (Object.keys(e)[0] == 'CTriple' ||
                                Object.keys(e)[0] == 'NCTriple') &&
                            MahjongHand.existFrom(variableTiles, [
                                e[Object.keys(e)[0]][0]
                            ])
                    ) ||
                    (comp.inCompleted.length == 2 &&
                        comp.inCompleted[0].isSame(comp.inCompleted[1]) &&
                        MahjongHand.existFrom(variableTiles, [
                            comp.inCompleted[0]
                        ]) &&
                        comp.inCompleted[0].isSame(context.winTile))
                );
            }).length > 0
        );
    }

    static isHalfFlush(hand: Tile[], context: Context) {
        const m = MahjongHand.exceptFrom(
            hand,
            MahjongHand.getHandFromString(
                '11112222333344445555666677778888999m1111222233334444555566667777z'
            )
        );
        const p = MahjongHand.exceptFrom(
            hand,
            MahjongHand.getHandFromString(
                '11112222333344445555666677778888999p1111222233334444555566667777z'
            )
        );
        const s = MahjongHand.exceptFrom(
            hand,
            MahjongHand.getHandFromString(
                '11112222333344445555666677778888999s1111222233334444555566667777z'
            )
        );
        return (
            !this.isFullFlush(hand, context) &&
            (m.length == 0 || p.length == 0 || s.length == 0)
        );
    }

    static isFullFlush(hand: Tile[], context: Context) {
        return (
            MahjongHand.exceptFrom(
                hand,
                MahjongHand.getHandFromString(
                    '111122223333444455556666777788889999m'
                )
            ).length == 0 ||
            MahjongHand.exceptFrom(
                hand,
                MahjongHand.getHandFromString(
                    '111122223333444455556666777788889999p'
                )
            ).length == 0 ||
            MahjongHand.exceptFrom(
                hand,
                MahjongHand.getHandFromString(
                    '111122223333444455556666777788889999s'
                )
            ).length == 0
        );
    }

    static isAllHonors(hand: Tile[], context: Context) {
        return (
            MahjongHand.exceptFrom(
                hand,
                MahjongHand.getHandFromString('1111222233334444555566667777z')
            ).length == 0
        );
    }

    static isAllTerminals(hand: Tile[], context: Context) {
        return (
            MahjongHand.exceptFrom(
                hand,
                MahjongHand.getHandFromString('11119999m11119999p11119999s')
            ).length == 0
        );
    }

    static isBigDragons(hand: Tile[], context: Context) {
        return MahjongHand.existFrom(
            hand,
            MahjongHand.getHandFromString('555666777z')
        );
    }
    static isAllRuns(hand: Tile[], context: Context) {
        const setsComposition = MahjongHand.getSetsComposition(
            MahjongHand.exceptFrom(hand, [context.winTile])
        );
        return (
            setsComposition.filter((comp) => {
                const head = comp.completed.find(
                    (e) => Object.keys(e)[0] == 'Head'
                );
                if (
                    !head ||
                    MahjongHand.getValueTiles(context).filter((e) =>
                        e.isSame(head['Head'][0])
                    ).length >= 1
                )
                    return false;
                if (
                    comp.completed.filter((e) => Object.keys(e)[0] == 'CRun')
                        .length != 3
                ) {
                    return false;
                }
                if (
                    MahjongHand.getWinTileFromTarts(comp.inCompleted).length ==
                    2
                )
                    return true;
                else return false;
            }).length > 0
        );
    }

    static isFourConcealedTriples(hand: Tile[], context: Context) {
        const setsComposition = MahjongHand.getSetsComposition(
            MahjongHand.exceptFrom(hand, [context.winTile])
        );

        if (context.tilePlace == 'Tsumo') {
            return (
                setsComposition.filter((e) => {
                    return (
                        e.completed.filter(
                            (el) =>
                                Object.keys(el)[0] == 'Head' ||
                                Object.keys(el)[0] == 'CTriple'
                        ).length == 4 &&
                        ((e.inCompleted.length == 2 &&
                            e.inCompleted[0].isSame(e.inCompleted[1]) &&
                            e.inCompleted[0].isSame(context.winTile)) ||
                            (e.inCompleted.length == 1 &&
                                e.inCompleted[0].isSame(context.winTile)))
                    );
                }).length > 0
            );
        } else {
            return (
                setsComposition.filter((e) => {
                    e.completed.filter((el) => Object.keys(el)[0] == 'CTriple')
                        .length == 4 && e.inCompleted.length == 1;
                }).length > 0
            );
        }
    }

    static isNineGates(hand: Tile[], context: Context) {
        const m = MahjongHand.exceptFrom(hand, '1112345678999m');
        const p = MahjongHand.exceptFrom(hand, '1112345678999p');
        const s = MahjongHand.exceptFrom(hand, '1112345678999s');
        return (
            (m.length == 1 && m[0].getSuit() == 'Characters') ||
            (p.length == 1 && p[0].getSuit() == 'Dots') ||
            (s.length == 1 && s[0].getSuit() == 'Bamboos')
        );
    }

    static isThirteenOrphans(hand: Tile[], context: Context) {
        const rest = MahjongHand.exceptFrom(
            hand,
            MahjongHand.getHandFromString('19m19p19s1234567z')
        );
        if (rest.length == 1) {
            if (
                rest[0].getNumber() === 1 ||
                honorArray.includes(rest[0].getSuit())
            )
                return true;
        }
    }

    static isSevenPairs(hand: Tile[], context: Context) {
        return (
            7 ==
            hand
                .reduce((prev: Tile[], cur) => {
                    return prev.find((e) => e.isSame(cur))
                        ? prev
                        : [...prev, cur];
                }, [])
                .reduce((prev, cur, index, arr) => {
                    return (
                        prev +
                        (hand.filter((elem) => elem.isSame(cur)).length >= 2
                            ? 1
                            : 0)
                    );
                }, 0)
        );
    }
    static isReech(hand: Tile[], context: Context) {
        return context.isReech;
    }
    static isFirstTurnWin(hand: Tile[], context: Context) {
        return context.isReechFirstTurn;
    }
    static isAllGreen(hand: Tile[], context: Context) {
        return (
            MahjongHand.exceptFrom(
                hand,
                MahjongHand.getHandFromString('22223333444466668888s6666z')
            ).length == 0
        );
    }
    static isAllSimples(hand: Tile[], context: Context) {
        return (
            MahjongHand.exceptFrom(
                hand,
                MahjongHand.getHandFromString(
                    '2222333344445555666677778888p2222333344445555666677778888m2222333344445555666677778888s'
                )
            ).length == 0
        );
    }
    static isKingsTileDraw(hand: Tile[], context: Context) {
        return context.isKingsTileDraw;
    }

    static isFinalTurnWin(hand: Tile[], context: Context) {
        return context.isFinalTile;
    }

    static isConcealedSelfDraw(hand: Tile[], context: Context) {
        return context.isConcealed && context.tilePlace == 'Tsumo';
    }

    static isDoubleRun(hand: Tile[], context:Context) {
        const setsComposition = MahjongHand.getSetsComposition(
            hand
        );
        const checkDoubleRun = (sets:{[key:string]:Tile[]}[]) => {
            const map = new Map<String,number>
            sets.filter(e => Object.keys(e)[0] == 'CRun')
            .map(e => Object.keys(e)[0]+e[Object.keys(e)[0]].map(el =>  String(el.getSuit()) +  String(el.getNumber())))
            .forEach(e => {
                map.set(e,(map.get(e) ?? 0) + 1)
            })
            for(const value of map.values()){
                if(value == 2){
                    return true
                }
            }
            return false
        }
        return setsComposition.filter(e => checkDoubleRun(e.completed)).length > 0
    }

    static isMixedOutsideHand(hand: Tile[], context: Context) {
        const mixedOutsideSets = [
            MahjongHand.getHandFromString('111m'),
            MahjongHand.getHandFromString('111s'),
            MahjongHand.getHandFromString('111p'),
            MahjongHand.getHandFromString('123m'),
            MahjongHand.getHandFromString('123s'),
            MahjongHand.getHandFromString('123p'),
            MahjongHand.getHandFromString('999m'),
            MahjongHand.getHandFromString('999s'),
            MahjongHand.getHandFromString('999p'),
            MahjongHand.getHandFromString('789m'),
            MahjongHand.getHandFromString('789s'),
            MahjongHand.getHandFromString('789p'),
            MahjongHand.getHandFromString('111z'),
            MahjongHand.getHandFromString('222z'),
            MahjongHand.getHandFromString('333z'),
            MahjongHand.getHandFromString('444z'),
            MahjongHand.getHandFromString('555z'),
            MahjongHand.getHandFromString('666z'),
            MahjongHand.getHandFromString('777z')
        ];
        const mixedOutsideTarts = [
            MahjongHand.getHandFromString('11m'),
            MahjongHand.getHandFromString('11p'),
            MahjongHand.getHandFromString('11s'),
            MahjongHand.getHandFromString('99m'),
            MahjongHand.getHandFromString('99p'),
            MahjongHand.getHandFromString('99s'),
            MahjongHand.getHandFromString('11z'),
            MahjongHand.getHandFromString('22z'),
            MahjongHand.getHandFromString('33z'),
            MahjongHand.getHandFromString('44z'),
            MahjongHand.getHandFromString('55z'),
            MahjongHand.getHandFromString('66z'),
            MahjongHand.getHandFromString('77z')
        ];
        const setsComposition = MahjongHand.getSetsComposition(hand);
        return (
            setsComposition.filter(
                (e) =>
                    e.completed.filter((el) =>
                        Object.keys(el)[0] == 'Head'
                            ? mixedOutsideTarts.find((mot) =>
                                  MahjongHand.existFrom(
                                      mot,
                                      el[Object.keys(el)[0]]
                                  )
                              )
                            : mixedOutsideSets.find((mos) =>
                                  MahjongHand.existFrom(
                                      mos,
                                      el[Object.keys(el)[0]]
                                  )
                              )
                    ).length == 5
            ).length > 0 && !this.isPureOutsideHand(hand, context)
        );
    }
    static isPureOutsideHand(hand: Tile[], context: Context) {
        const pureOutsideSets = [
            MahjongHand.getHandFromString('111m'),
            MahjongHand.getHandFromString('111s'),
            MahjongHand.getHandFromString('111p'),
            MahjongHand.getHandFromString('123m'),
            MahjongHand.getHandFromString('123s'),
            MahjongHand.getHandFromString('123p'),
            MahjongHand.getHandFromString('999m'),
            MahjongHand.getHandFromString('999s'),
            MahjongHand.getHandFromString('999p'),
            MahjongHand.getHandFromString('789m'),
            MahjongHand.getHandFromString('789s'),
            MahjongHand.getHandFromString('789p')
        ];
        const pureOutsideTarts = [
            MahjongHand.getHandFromString('11m'),
            MahjongHand.getHandFromString('11p'),
            MahjongHand.getHandFromString('11s'),
            MahjongHand.getHandFromString('99m'),
            MahjongHand.getHandFromString('99p'),
            MahjongHand.getHandFromString('99s')
        ];
        const setsComposition = MahjongHand.getSetsComposition(hand);
        return (
            setsComposition.filter(
                (e) =>
                    e.completed.filter((el) =>
                        Object.keys(el)[0] == 'Head'
                            ? pureOutsideTarts.find((mot) =>
                                  MahjongHand.existFrom(
                                      mot,
                                      el[Object.keys(el)[0]]
                                  )
                              )
                            : pureOutsideSets.find((mos) =>
                                  MahjongHand.existFrom(
                                      mos,
                                      el[Object.keys(el)[0]]
                                  )
                              )
                    ).length == 5
            ).length > 0
        );
    }

    static getValueTiles(context: Context) {
        return [
            new Tile('White Dragon'),
            new Tile('White Dragon'),
            new Tile('Red Dragon'),
            context.seatWind,
            context.prevalentWind
        ];
    }

    static isSameComposition(a: SetsComposition, b: SetsComposition) {}

    static getCreatableTarts(minNumTile: Tile) {
        return minNumTile.isHonorsTile()
            ? [[minNumTile], [minNumTile, minNumTile]]
            : (minNumTile.getNumber() ?? 0) <= 7
            ? [
                  [minNumTile],
                  [minNumTile, minNumTile],
                  [minNumTile, minNumTile.getNextTile()],
                  [minNumTile, minNumTile.getNextTile().getNextTile()]
              ]
            : (minNumTile.getNumber() ?? 0) <= 8
            ? [
                  [minNumTile],
                  [minNumTile, minNumTile],
                  [minNumTile, minNumTile.getNextTile()]
              ]
            : [[minNumTile], [minNumTile, minNumTile]];
    }

    static getCreatableSet(minNumTile: Tile) {
        return minNumTile.isHonorsTile()
            ? [[minNumTile, minNumTile, minNumTile]]
            : minNumTile.getNumber() ?? 0 <= 7
            ? [
                  [minNumTile, minNumTile, minNumTile],
                  [
                      minNumTile,
                      minNumTile.getNextTile(),
                      minNumTile.getNextTile().getNextTile()
                  ]
              ]
            : [[minNumTile, minNumTile, minNumTile]];
    }

    static getCreatablePair(minNumTile: Tile): Tile[] {
        return [minNumTile, minNumTile];
    }

    static getSetsComposition(hand: Tile[]): SetsComposition[] {
        const devideBySet = (
            unsettledTile: Tile[],
            headExcepted: boolean
        ): { [key: string]: Tile[] }[][] | null => {
            let res: { [key: string]: Tile[] }[][] = [];
            if (unsettledTile.length == 0) return [[]];
            else {
                if (!headExcepted) {
                    for (const tile of unsettledTile) {
                        const pair = MahjongHand.getCreatablePair(tile);
                        if (MahjongHand.existFrom(unsettledTile, pair)) {
                            const result = devideBySet(
                                MahjongHand.exceptFrom(unsettledTile, pair),
                                true
                            );
                            if (result == null) {
                                continue;
                            } else {
                                res = [
                                    ...res,
                                    ...result.map((e) => [
                                        { ['Head']: pair },
                                        ...e
                                    ])
                                ];
                            }
                        }
                    }
                }
                for (const tile of unsettledTile) {
                    const creatableSets = MahjongHand.getCreatableSet(tile);
                    let existSet = false;
                    for (const needleSet of creatableSets) {
                        if (MahjongHand.existFrom(unsettledTile, needleSet)) {
                            existSet = true;
                            const result = devideBySet(
                                MahjongHand.exceptFrom(
                                    unsettledTile,
                                    needleSet
                                ),
                                headExcepted
                            );
                            if (result == null) continue;
                            else {
                                const name = needleSet[0].isSame(needleSet[1])
                                    ? 'CTriple'
                                    : 'CRun';
                                res = [
                                    ...res,
                                    ...result.map((e) => [
                                        { [name]: needleSet },
                                        ...e
                                    ])
                                ];
                            }
                        }
                    }
                }
            }
            if (res.length == 0) return null;
            return res;
        };

        const getSetsComposition = (
            unsettledTile: Tile[]
        ): SetsComposition[] => {
            let res: SetsComposition[] = [];
            for (const tile of unsettledTile) {
                const creatableTarts = MahjongHand.getCreatableTarts(tile);
                for (const needleTart of creatableTarts) {
                    if (MahjongHand.existFrom(unsettledTile, needleTart)) {
                        const sets = devideBySet(
                            MahjongHand.exceptFrom(unsettledTile, needleTart),
                            false
                        );
                        if (sets == null) {
                            continue;
                        } else {
                            if (
                                needleTart.length == 2 &&
                                !sets.find((e) => {
                                    return (
                                        e.filter((el) => {
                                            return Object.keys(el)[0] == 'Head';
                                        }).length > 0
                                    );
                                })
                            ) {
                                continue;
                            }
                            res = [
                                ...res,
                                ...sets.map((e) => {
                                    return {
                                        inCompleted: needleTart,
                                        completed: e
                                    };
                                })
                            ];
                        }
                    }
                }
            }
            return res;
        };
        if (hand.length == 14) {
            return (
                devideBySet(hand, false)?.map((e) => {
                    return {
                        inCompleted: [],
                        completed: e
                    };
                }) ?? []
            );
        } else return getSetsComposition(hand);
    }

    static getYaku(hand: Tile[], context: Context) {
        if (MahjongHand.exceptFrom(hand, [context.winTile]).length != 13)
            return [];
        if (MahjongHand.calcSyanten(hand) != -1) return [];
        const res = [];
        if (this.isNineGates(hand, context)) {
            return ['NineGates'];
        }
        if (this.isThirteenOrphans(hand, context)) {
            return ['ThirteenOrphans'];
        }
        if (this.isAllGreen(hand, context)) {
            return ['AllGreen'];
        }
        if (this.isBigDragons(hand, context)) {
            return ['Big Dragons'];
        }
        if (this.isFourConcealedTriples(hand, context)) {
            return ['Four Concealed Triples'];
        }
        if (this.isFullFlush(hand, context)) {
            res.push('Full Flush');
        }
        if (this.isSevenPairs(hand, context)) {
            res.push('SevenPairs');
        }
        if (this.isReech(hand, context)) {
            res.push('Reech');
        }
        if (this.isValueTiles(hand, context)) {
            res.push('ValueTiles');
        }
        if (this.isFirstTurnWin(hand, context)) {
            res.push('First Turn Win');
        }
        if (this.isAllSimples(hand, context)) {
            res.push('All Simples');
        }
        if (this.isKingsTileDraw(hand, context)) {
            res.push("King's Tile Draw");
        }
        if (this.isFinalTurnWin(hand, context)) {
            res.push('Final Turn Win');
        }
        if (this.isConcealedSelfDraw(hand, context)) {
            res.push('ConcealedSelfDraw');
        }
        if (this.isHalfFlush(hand, context)) {
            res.push('Half Flush');
        }
        if (this.isPureOutsideHand(hand, context)) {
            res.push('Pure Outside Hand');
        }
        if (this.isMixedOutsideHand(hand, context)) {
            res.push('Mixed Outside Hand');
        }
        if(this.isDoubleRun(hand,context)){
            res.push('Double Run')
        }

        if (this.isAllRuns(hand, context)) {
            res.push('All Runs');
        }
        return res;
    }

    static getWinTileFromTarts(tarts: Tile[]) {
        if (tarts.length == 1) return tarts;
        else if (tarts.length == 2) {
            const res = [];
            if (tarts[0].getNextTile().isSame(tarts[1])) {
                res.push(
                    new Tile(
                        tarts[0].getSuit(),
                        (tarts[0].getNumber() ?? 0) - 1
                    )
                );
                res.push(
                    new Tile(
                        tarts[1].getSuit(),
                        (tarts[1].getNumber() ?? 0) + 1
                    )
                );
            } else if (tarts[0].getNextTile().getNextTile().isSame(tarts[1])) {
                res.push(
                    new Tile(
                        tarts[0].getSuit(),
                        (tarts[0].getNumber() ?? 0) + 1
                    )
                );
            } else res.push(new Tile(tarts[0].getSuit(), tarts[0].getNumber()));
            return res.filter(
                (e) => (e.getNumber() ?? 0) <= 9 && (e.getNumber() ?? 0) >= 1
            );
        }
        return [];
    }

    toString() {
        const hand = this.getHand();
        const res = '';

        const map: { [key: string]: number } = {
            'White Dragon': 5,
            'Green Dragon': 6,
            'Red Dragon': 7,
            East: 1,
            South: 2,
            West: 3,
            North: 4
        };
        const char = hand
            .filter((e) => e.getSuit() == 'Characters')
            .map((e) => e.getNumber() ?? 0)
            .sort()
            .join('');
        const dots = hand
            .filter((e) => e.getSuit() == 'Dots')
            .map((e) => e.getNumber() ?? 0)
            .sort()
            .join('');
        const bamboo = hand
            .filter((e) => e.getSuit() == 'Bamboos')
            .map((e) => e.getNumber() ?? 0)
            .sort()
            .join('');
        const honors = hand
            .filter((e) => e.isHonorsTile())
            .map((e) => map[e.getSuit()] ?? 0)
            .sort()
            .join('');
        return (
            char +
            ((char.length >= 1 && 'm') || '') +
            dots +
            ((dots.length >= 1 && 'p') || '') +
            bamboo +
            ((bamboo.length >= 1 && 's') || '') +
            honors +
            ((honors.length >= 1 && 'z') || '')
        );
    }

    static calcReadyPoint(res: { inCompleted: number[] }): [number, number] {
        if (this.memo.has(res.inCompleted.map((e) => String(e)).join(' '))) {
            return (
                this.memo.get(
                    res.inCompleted.map((e) => String(e)).join(' ')
                ) ?? [0, 0]
            );
        }
        const points: Array<[number, number]> = [];
        const uniqueNumber = new Set(res.inCompleted);
        // ターツを抜く
        for (const elem of uniqueNumber) {
            const tartsCandidate = [
                [elem, elem],
                [elem, elem + 1],
                [elem, elem + 2],
                [elem, elem, elem],
                [elem, elem + 1, elem + 2]
            ];
            for (const tarts of tartsCandidate) {
                const tartsIncrement = tarts.length == 2 ? 1 : 0;
                const setIncrement = tarts.length == 3 ? 1 : 0;
                if (existArray(res.inCompleted, tarts)) {
                    const [setN, tartsN] = this.calcReadyPoint({
                        inCompleted: exceptArray(res.inCompleted, tarts)
                    });
                    const setNum = setN + setIncrement;
                    const tartsNum = tartsN + tartsIncrement;
                    const sub = setNum + tartsNum - 4;
                    points.push([setNum, tartsNum - (sub >= 0 ? sub : 0)]);
                }
            }
        }
        points.sort((e1, e2) => {
            const calc = e1[0] * 2 + e1[1] - e2[0] * 2 - e2[1];
            if (calc == 0) return e1[0] >= e2[0] ? 1 : -1;
            else {
                return calc;
            }
        });

        this.memo.set(
            res.inCompleted.map((e) => String(e)).join(' '),
            points.length == 0 ? [0, 0] : points[points.length - 1]
        );
        return points.length == 0 ? [0, 0] : points[points.length - 1];
    }
}
