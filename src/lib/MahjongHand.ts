type SuitType = Honors | Simples | 'None';
type Wins = 'East' | 'South' | 'West' | 'North';
type Dragons = 'White Dragon' | 'Green Dragon' | 'Red Dragon';
type Honors = Wins | Dragons;
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
export type Simples = 'Dots' | 'Bamboos' | 'Characters';
const HonorsMap: { [key: string]: number } = {
    'White Dragon': 1,
    'Green Dragon': 4,
    'Red Dragon': 7,
    East: 11,
    South: 14,
    West: 17,
    North: 20
};
type WinTilePlace = 'Tsumo' | 'Ron' | 'Quad';
type RoleInfo = {
    rolePoint: number;
    roleName: RoleName;
};
type SetsComposition = {
    CRun: Tile[][];
    CTriple: Tile[][];
    Head: Tile[][];
    NCRun: Tile[][];
    NCTriple: Tile[][];
};
export type RoleName =
    | 'Four Winds'
    | 'Blessing of Heaven'
    | 'Four Quads'
    | 'Nine Gates'
    | 'All Green'
    | 'Blessing of Earth'
    | 'All Terminals'
    | 'All Honors'
    | 'Big Dragons'
    | 'Thirteen Orphans'
    | 'Four Concealed Triples'
    | 'Full Flush'
    | 'Two Double Runs'
    | 'Pure Outside Hand'
    | 'Half Flush'
    | 'Three Quads'
    | 'Three Color Triples'
    | 'All Terminals And Honors'
    | 'Little Dragons'
    | 'Three Concealed Triples'
    | 'Mixed Outside Hand'
    | 'Full Straight'
    | 'Seven Pairs'
    | 'Three Color Runs'
    | 'All Triples'
    | 'Add A Quad'
    | 'Double Reech'
    | "King's Tile Draw"
    | 'Final Tile Win'
    | 'Double Run'
    | 'First Turn Win'
    | 'Concealed Self Draw'
    | 'All Runs'
    | 'All Simples'
    | 'Reech'
    | 'East'
    | 'South'
    | 'West'
    | 'North'
    | 'Green Dragon'
    | 'Red Dragon'
    | 'White Dragon'
    | 'Field East'
    | 'Field South'
    | 'Field West'
    | 'Field North';

type HandComposition = {
    completed: SetsComposition;
    inCompleted: Tile[];
};
export type Context = {
    isReech?: boolean;
    isReechFirstTurn?: boolean;
    isFinalTile?: boolean;
    tilePlace: WinTilePlace;
    isAddAQuad?: boolean;
    isConcealed: boolean;
    isDoubleReech?: boolean;
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
    public static um1 = '🀇';
    public static us1 = '🀐';
    public static up1 = '🀙';
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
    getNumber(): number {
        return this.number ?? 0;
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
    getStringPic(): string {
        switch (this.getSuit()) {
            case 'Bamboos':
                return String.fromCodePoint(
                    (Tile.us1.codePointAt(0) ?? 0) + this.getNumber() - 1
                );
            case 'Characters':
                return String.fromCodePoint(
                    (Tile.um1.codePointAt(0) ?? 0) + this.getNumber() - 1
                );
            case 'Dots':
                return String.fromCodePoint(
                    (Tile.up1.codePointAt(0) ?? 0) + this.getNumber() - 1
                );
            case 'White Dragon':
                return '🀆';
            case 'Green Dragon':
                return '🀅';
            case 'Red Dragon':
                return '🀄';
            case 'East':
                return '🀀';
            case 'South':
                return '🀁';
            case 'West':
                return '🀂';
            case 'North':
                return '🀃';
            default:
                return '';
        }
    }
}

const existArray = <T>(
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

const exceptArray = <T>(
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
    private static memo: Map<String, [number, number]> = new Map();

    isValidFormat(str: string) {
        return true;
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

    private constructor() {}

    static isReadyHand(tiles: Tile[]) {
        return MahjongHand.calcSyanten(tiles) == 0;
    }

    static highPointWinToString(point: number) {
        if (point < 4) return '';
        else if (point < 6) {
            return 'Slum';
        } else if (point < 8) {
            return 'One and a Half of the Slum';
        } else if (point < 11) {
            return 'Double Slum';
        } else if (point < 13) {
            return 'Three Times of the Slum';
        } else {
            return 'Grand Slum';
        }
    }

    static getValidTilesWithYaku(
        tiles: Tile[],
        context: Context
    ): {
        tile: Tile;
        Yaku: RoleName[];
        point: number;
        highPointString: string;
    }[] {
        if (tiles.length != 13) return [];
        if (MahjongHand.calcSyanten(tiles) != 0) {
            return [];
        }
        const validTiles = MahjongHand.getValidTiles(tiles);
        return validTiles.map((tile) => {
            const examHand = tiles.concat();
            examHand.push(tile);
            context.winTile = tile;
            const roleInfo = MahjongHand.getYaku(examHand, context);
            const point = roleInfo.reduce(
                (prev, cur) => prev + cur.rolePoint,
                0
            );

            return {
                tile: tile,
                Yaku: roleInfo.map((e) => e.roleName),
                point: point,
                highPointString: this.highPointWinToString(point)
            };
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
                if (MahjongHand.getIncludeTileCount(hand, examTile) == 4)
                    continue;
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
        const variety = hand.reduce((prev: Tile[], cur) => {
            return prev.find((e) => e.isSame(cur)) ? prev : [...prev, cur];
        }, []);
        const pairNum = variety.filter(
            (e) => MahjongHand.getIncludeTileCount(hand, e) >= 2
        ).length;
        if (pairNum == 6) {
            if (
                variety.filter(
                    (e) => MahjongHand.getIncludeTileCount(hand, e) == 2
                ).length == 6
            )
                return 0;
            else return 1;
        } else {
            return 6 - pairNum;
        }
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

    static isGreenDragon(hand: Tile[], context: Context) {
        const setsComposition = MahjongHand.getSetsComposition(hand);
        return (
            setsComposition.filter(
                (comp) =>
                    comp.completed['CTriple'].find((el) =>
                        MahjongHand.existFrom(el, [new Tile('Green Dragon')])
                    ) ||
                    comp.completed['NCTriple'].find((el) =>
                        MahjongHand.existFrom(el, [new Tile('Green Dragon')])
                    )
            ).length > 0
        );
    }

    static isWhiteDragon(hand: Tile[], context: Context) {
        const setsComposition = MahjongHand.getSetsComposition(hand);
        return (
            setsComposition.filter(
                (comp) =>
                    comp.completed['CTriple'].find((el) =>
                        MahjongHand.existFrom(el, [new Tile('White Dragon')])
                    ) ||
                    comp.completed['NCTriple'].find((el) =>
                        MahjongHand.existFrom(el, [new Tile('White Dragon')])
                    )
            ).length > 0
        );
    }

    static isRedDragon(hand: Tile[], context: Context) {
        const setsComposition = MahjongHand.getSetsComposition(hand);
        return (
            setsComposition.filter(
                (comp) =>
                    comp.completed['CTriple'].find((el) =>
                        MahjongHand.existFrom(el, [new Tile('Red Dragon')])
                    ) ||
                    comp.completed['NCTriple'].find((el) =>
                        MahjongHand.existFrom(el, [new Tile('Red Dragon')])
                    )
            ).length > 0
        );
    }

    static isEast(hand: Tile[], context: Context) {
        const setsComposition = MahjongHand.getSetsComposition(hand);
        return (
            setsComposition.filter(
                (comp) =>
                    comp.completed['CTriple'].find((el) =>
                        MahjongHand.existFrom(el, [new Tile('East')])
                    ) ||
                    comp.completed['NCTriple'].find((el) =>
                        MahjongHand.existFrom(el, [new Tile('East')])
                    )
            ).length > 0 &&
            MahjongHand.existFrom([context.seatWind], [new Tile('East')])
        );
    }

    static isSouth(hand: Tile[], context: Context) {
        const setsComposition = MahjongHand.getSetsComposition(hand);
        return (
            setsComposition.filter(
                (comp) =>
                    comp.completed['CTriple'].find((el) =>
                        MahjongHand.existFrom(el, [new Tile('South')])
                    ) ||
                    comp.completed['NCTriple'].find((el) =>
                        MahjongHand.existFrom(el, [new Tile('South')])
                    )
            ).length > 0 &&
            MahjongHand.existFrom([context.seatWind], [new Tile('South')])
        );
    }

    static isWest(hand: Tile[], context: Context) {
        const setsComposition = MahjongHand.getSetsComposition(hand);
        return (
            setsComposition.filter(
                (comp) =>
                    comp.completed['CTriple'].find((el) =>
                        MahjongHand.existFrom(el, [new Tile('West')])
                    ) ||
                    comp.completed['NCTriple'].find((el) =>
                        MahjongHand.existFrom(el, [new Tile('West')])
                    )
            ).length > 0 &&
            MahjongHand.existFrom([context.seatWind], [new Tile('West')])
        );
    }

    static isNorth(hand: Tile[], context: Context) {
        const setsComposition = MahjongHand.getSetsComposition(hand);
        return (
            setsComposition.filter(
                (comp) =>
                    comp.completed['CTriple'].find((el) =>
                        MahjongHand.existFrom(el, [new Tile('North')])
                    ) ||
                    comp.completed['NCTriple'].find((el) =>
                        MahjongHand.existFrom(el, [new Tile('North')])
                    )
            ).length > 0 &&
            MahjongHand.existFrom([context.seatWind], [new Tile('North')])
        );
    }

    static isFieldNorth(hand: Tile[], context: Context) {
        const setsComposition = MahjongHand.getSetsComposition(hand);
        return (
            setsComposition.filter(
                (comp) =>
                    comp.completed['CTriple'].find((el) =>
                        MahjongHand.existFrom(el, [new Tile('North')])
                    ) ||
                    comp.completed['NCTriple'].find((el) =>
                        MahjongHand.existFrom(el, [new Tile('North')])
                    )
            ).length > 0 &&
            MahjongHand.existFrom([context.prevalentWind], [new Tile('North')])
        );
    }

    static isFieldEast(hand: Tile[], context: Context) {
        const setsComposition = MahjongHand.getSetsComposition(hand);
        return (
            setsComposition.filter(
                (comp) =>
                    comp.completed['CTriple'].find((el) =>
                        MahjongHand.existFrom(el, [new Tile('East')])
                    ) ||
                    comp.completed['NCTriple'].find((el) =>
                        MahjongHand.existFrom(el, [new Tile('East')])
                    )
            ).length > 0 &&
            MahjongHand.existFrom([context.prevalentWind], [new Tile('East')])
        );
    }

    static isFieldWest(hand: Tile[], context: Context) {
        const setsComposition = MahjongHand.getSetsComposition(hand);
        return (
            setsComposition.filter(
                (comp) =>
                    comp.completed['CTriple'].find((el) =>
                        MahjongHand.existFrom(el, [new Tile('West')])
                    ) ||
                    comp.completed['NCTriple'].find((el) =>
                        MahjongHand.existFrom(el, [new Tile('West')])
                    )
            ).length > 0 &&
            MahjongHand.existFrom([context.prevalentWind], [new Tile('West')])
        );
    }

    static isFieldSouth(hand: Tile[], context: Context) {
        const setsComposition = MahjongHand.getSetsComposition(hand);
        return (
            setsComposition.filter(
                (comp) =>
                    comp.completed['CTriple'].find((el) =>
                        MahjongHand.existFrom(el, [new Tile('South')])
                    ) ||
                    comp.completed['NCTriple'].find((el) =>
                        MahjongHand.existFrom(el, [new Tile('South')])
                    )
            ).length > 0 &&
            MahjongHand.existFrom([context.prevalentWind], [new Tile('South')])
        );
    }

    static isValueTiles(hand: Tile[], context: Context) {
        const setsComposition = MahjongHand.getSetsComposition(hand);
        const variableTiles = MahjongHand.getValueTiles(context);
        return (
            setsComposition.filter(
                (comp) =>
                    comp.completed['CTriple'].find((el) =>
                        variableTiles.includes(el[0])
                    ) ||
                    comp.completed['NCTriple'].find((el) =>
                        variableTiles.includes(el[0])
                    )
            ).length > 0
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
    static isAllHonors(hand: Tile[]) {
        return (
            MahjongHand.exceptFrom(
                hand,
                MahjongHand.getHandFromString('1111222233334444555566667777z')
            ).length == 0
        );
    }
    static isAllTerminals(hand: Tile[]) {
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
                const head = comp.completed['Head'][0];
                if (
                    !head ||
                    MahjongHand.getValueTiles(context).filter((e) =>
                        e.isSame(head[0])
                    ).length >= 1
                )
                    return false;
                if (comp.completed['CRun'].length != 3) {
                    return false;
                }
                if (
                    MahjongHand.getWinTileFromTarts(comp.inCompleted).length ==
                        2 &&
                    MahjongHand.existFrom(
                        MahjongHand.getWinTileFromTarts(comp.inCompleted),
                        [context.winTile]
                    )
                )
                    return true;
                else return false;
            }).length > 0
        );
    }
    static isFourConcealedTriples(hand: Tile[], context: Context) {
        const setsComposition = MahjongHand.getSetsComposition(hand);
        if (context.tilePlace == 'Tsumo') {
            return (
                setsComposition.filter(
                    (e) => e.completed['CTriple'].length == 4
                ).length > 0
            );
        } else {
            return (
                setsComposition.filter((e) => {
                    e.completed['CTriple'].length == 4 &&
                        e.completed['Head'][0][0].isSame(context.winTile);
                }).length > 0
            );
        }
    }
    static isThreeConcealedTriples(hand: Tile[], context: Context) {
        const setsComposition = MahjongHand.getSetsComposition(hand);
        if (context.tilePlace == 'Tsumo') {
            return (
                setsComposition.filter(
                    (e) => e.completed['CTriple'].length == 3
                ).length > 0
            );
        } else {
            return (
                setsComposition.filter((e) => {
                    return (
                        Object.keys(e.completed)
                            .filter((name) => name != 'CTriple')
                            .filter((el) =>
                                e.completed[
                                    el as keyof typeof e.completed
                                ].find((sets) =>
                                    MahjongHand.existFrom(sets, [
                                        context.winTile
                                    ])
                                )
                            ).length > 0
                    );
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
    static isLittleDragons(hand: Tile[], context: Context) {
        const setsComposition = MahjongHand.getSetsComposition(hand);
        return (
            setsComposition.filter(
                (e) =>
                    ([
                        ...e.completed['CTriple'],
                        ...e.completed['NCTriple']
                    ].find((el) =>
                        MahjongHand.existFrom(
                            el,
                            MahjongHand.getHandFromString('555z')
                        )
                    ) &&
                        [
                            ...e.completed['CTriple'],
                            ...e.completed['NCTriple']
                        ].find((el) =>
                            MahjongHand.existFrom(
                                el,
                                MahjongHand.getHandFromString('666z')
                            )
                        ) &&
                        e.completed['Head'].find((el) =>
                            MahjongHand.existFrom(
                                el,
                                MahjongHand.getHandFromString('77z')
                            )
                        )) ||
                    ([
                        ...e.completed['CTriple'],
                        ...e.completed['NCTriple']
                    ].find((el) =>
                        MahjongHand.existFrom(
                            el,
                            MahjongHand.getHandFromString('555z')
                        )
                    ) &&
                        [
                            ...e.completed['CTriple'],
                            ...e.completed['NCTriple']
                        ].find((el) =>
                            MahjongHand.existFrom(
                                el,
                                MahjongHand.getHandFromString('777z')
                            )
                        ) &&
                        e.completed['Head'].find((el) =>
                            MahjongHand.existFrom(
                                el,
                                MahjongHand.getHandFromString('66z')
                            )
                        )) ||
                    ([
                        ...e.completed['CTriple'],
                        ...e.completed['NCTriple']
                    ].find((el) =>
                        MahjongHand.existFrom(
                            el,
                            MahjongHand.getHandFromString('666z')
                        )
                    ) &&
                        [
                            ...e.completed['CTriple'],
                            ...e.completed['NCTriple']
                        ].find((el) =>
                            MahjongHand.existFrom(
                                el,
                                MahjongHand.getHandFromString('777z')
                            )
                        ) &&
                        e.completed['Head'].find((el) =>
                            MahjongHand.existFrom(
                                el,
                                MahjongHand.getHandFromString('55z')
                            )
                        ))
            ).length > 0
        );
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
                    .reduce((prev, cur) => {
                        return (
                            prev +
                            (hand.filter((elem) => elem.isSame(cur)).length >= 2
                                ? 1
                                : 0)
                        );
                    }, 0) && !this.isTwoDoubleRun(hand, context)
        );
    }
    static isReech(hand: Tile[], context: Context) {
        return context.isReech && !this.isDoubleReech(hand, context);
    }
    static isFirstTurnWin(context: Context) {
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
    static isFinalTileWin(hand: Tile[], context: Context) {
        return context.isFinalTile;
    }
    static isConcealedSelfDraw(hand: Tile[], context: Context) {
        return context.isConcealed && context.tilePlace == 'Tsumo';
    }
    static isDoubleRun(hand: Tile[], context: Context) {
        const setsComposition = MahjongHand.getSetsComposition(hand);
        const checkDoubleRun = (sets: SetsComposition) => {
            const map = new Map<string, number>();
            sets['CRun']
                .map((e) =>
                    e
                        .map(
                            (el) =>
                                String(el.getSuit()) + String(el.getNumber())
                        )
                        .join('')
                )
                .forEach((e) => {
                    map.set(e, (map.get(e) ?? 0) + 1);
                });
            for (const value of map.values()) {
                if (value == 2) {
                    return true;
                }
            }
            return false;
        };
        return (
            setsComposition.filter((e) => checkDoubleRun(e.completed)).length >
                0 && !this.isTwoDoubleRun(hand, context)
        );
    }
    static isTwoDoubleRun(hand: Tile[], context: Context) {
        const setsComposition = MahjongHand.getSetsComposition(hand);
        const checkTwoDoubleRun = (sets: SetsComposition) => {
            const map = new Map<string, number>();
            sets['CRun']
                .map((e) =>
                    e
                        .map(
                            (el) =>
                                String(el.getSuit()) + String(el.getNumber())
                        )
                        .join('')
                )
                .forEach((e) => {
                    map.set(e, (map.get(e) ?? 0) + 1);
                });

            let count = 0;
            for (const value of map.values()) {
                if (value == 2) {
                    count++;
                    if (count >= 2) return true;
                }
            }
            return false;
        };
        return (
            setsComposition.filter((e) => checkTwoDoubleRun(e.completed))
                .length > 0
        );
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
                    e.completed['CRun'].filter((el) =>
                        mixedOutsideSets.find((mos) =>
                            MahjongHand.existFrom(mos, el)
                        )
                    ).length +
                        e.completed['CTriple'].filter((el) =>
                            mixedOutsideSets.find((mos) =>
                                MahjongHand.existFrom(mos, el)
                            )
                        ).length +
                        e.completed['NCRun'].filter((el) =>
                            mixedOutsideSets.find((mos) =>
                                MahjongHand.existFrom(mos, el)
                            )
                        ).length +
                        e.completed['NCTriple'].filter((el) =>
                            mixedOutsideSets.find((mos) =>
                                MahjongHand.existFrom(mos, el)
                            )
                        ).length +
                        e.completed['Head'].filter((el) =>
                            mixedOutsideTarts.find((mot) =>
                                MahjongHand.existFrom(mot, el)
                            )
                        ).length ==
                    5
            ).length > 0 && !this.isPureOutsideHand(hand, context)
        );
    }
    static isPureOutsideHand(hand: Tile[], context: Context): boolean {
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
                    e.completed['CRun'].filter((el) =>
                        pureOutsideSets.find((mos) =>
                            MahjongHand.existFrom(mos, el)
                        )
                    ).length +
                        e.completed['CTriple'].filter((el) =>
                            pureOutsideSets.find((mos) =>
                                MahjongHand.existFrom(mos, el)
                            )
                        ).length +
                        e.completed['NCRun'].filter((el) =>
                            pureOutsideSets.find((mos) =>
                                MahjongHand.existFrom(mos, el)
                            )
                        ).length +
                        e.completed['NCTriple'].filter((el) =>
                            pureOutsideSets.find((mos) =>
                                MahjongHand.existFrom(mos, el)
                            )
                        ).length +
                        e.completed['Head'].filter((el) =>
                            pureOutsideTarts.find((mot) =>
                                MahjongHand.existFrom(mot, el)
                            )
                        ).length ==
                    5
            ).length > 0
        );
    }
    static isFullStraight(hand: Tile[], context: Context): boolean {
        const setsComposition = this.getSetsComposition(hand);
        return (
            setsComposition.filter(
                (e) =>
                    e.completed['CRun'].find((el) =>
                        MahjongHand.existFrom(
                            el,
                            MahjongHand.getHandFromString('123m')
                        )
                    ) &&
                    e.completed['CRun'].find((el) =>
                        MahjongHand.existFrom(
                            el,
                            MahjongHand.getHandFromString('456m')
                        )
                    ) &&
                    e.completed['CRun'].find((el) =>
                        MahjongHand.existFrom(
                            el,
                            MahjongHand.getHandFromString('789m')
                        )
                    )
            ).length > 0 ||
            setsComposition.filter(
                (e) =>
                    e.completed['CRun'].find((el) =>
                        MahjongHand.existFrom(
                            el,
                            MahjongHand.getHandFromString('123p')
                        )
                    ) &&
                    e.completed['CRun'].find((el) =>
                        MahjongHand.existFrom(
                            el,
                            MahjongHand.getHandFromString('456p')
                        )
                    ) &&
                    e.completed['CRun'].find((el) =>
                        MahjongHand.existFrom(
                            el,
                            MahjongHand.getHandFromString('789p')
                        )
                    )
            ).length > 0 ||
            setsComposition.filter(
                (e) =>
                    e.completed['CRun'].find((el) =>
                        MahjongHand.existFrom(
                            el,
                            MahjongHand.getHandFromString('123s')
                        )
                    ) &&
                    e.completed['CRun'].find((el) =>
                        MahjongHand.existFrom(
                            el,
                            MahjongHand.getHandFromString('456s')
                        )
                    ) &&
                    e.completed['CRun'].find((el) =>
                        MahjongHand.existFrom(
                            el,
                            MahjongHand.getHandFromString('789s')
                        )
                    )
            ).length > 0
        );
    }
    static isDoubleReech(hand: Tile[], context: Context): boolean {
        return context.isDoubleReech ?? false;
    }
    static isThreeColorRuns(hand: Tile[], context: Context): boolean {
        const isThreeColors = (tiles: Tile[][]) => {
            for (let startRun = 1; startRun <= 7; startRun++) {
                const mSets: Tile[] = MahjongHand.getHandFromString(
                    String(startRun) +
                        String(startRun + 1) +
                        String(startRun + 2) +
                        'm'
                );
                const pSets: Tile[] = MahjongHand.getHandFromString(
                    String(startRun) +
                        String(startRun + 1) +
                        String(startRun + 2) +
                        'p'
                );
                const sSets: Tile[] = MahjongHand.getHandFromString(
                    String(startRun) +
                        String(startRun + 1) +
                        String(startRun + 2) +
                        's'
                );
                const existingThreeColors =
                    tiles.find((t) => MahjongHand.existFrom(mSets, t)) &&
                    tiles.find((t) => MahjongHand.existFrom(pSets, t)) &&
                    tiles.find((t) => MahjongHand.existFrom(sSets, t));
                if (existingThreeColors) return true;
            }
            return false;
        };
        const setsComposition = MahjongHand.getSetsComposition(hand);
        return (
            setsComposition.filter((e) =>
                isThreeColors([...e.completed['CRun'], ...e.completed['NCRun']])
            ).length > 0
        );
    }
    static isBlessingOfEarth(hand: Tile[], context: Context): boolean {
        return context.isBlessingOfEarth ?? false;
    }
    static isBlessingOfHeaven(hand: Tile[], context: Context): boolean {
        return context.isBlessingOfHeaven ?? false;
    }
    static isFourWinds(hand: Tile[], context: Context): boolean {
        const setsComposition = MahjongHand.getSetsComposition(hand);
        return (
            setsComposition.filter(
                (e) =>
                    [
                        ...e.completed['CTriple'],
                        ...e.completed['NCTriple'],
                        ...e.completed['Head']
                    ].filter(
                        (sets) =>
                            MahjongHand.existFrom(sets, [new Tile('East')]) ||
                            MahjongHand.existFrom(sets, [new Tile('South')]) ||
                            MahjongHand.existFrom(sets, [new Tile('West')]) ||
                            MahjongHand.existFrom(sets, [new Tile('North')])
                    ).length == 4
            ).length > 0
        );
    }
    static isThreeColorTriples(hand: Tile[], context: Context): boolean {
        const isThreeColors = (tiles: Tile[][]) => {
            for (let triple = 1; triple <= 9; triple++) {
                const mSets: Tile[] = MahjongHand.getHandFromString(
                    String(triple) + String(triple) + String(triple) + 'm'
                );
                const pSets: Tile[] = MahjongHand.getHandFromString(
                    String(triple) + String(triple) + String(triple) + 'p'
                );
                const sSets: Tile[] = MahjongHand.getHandFromString(
                    String(triple) + String(triple) + String(triple) + 's'
                );
                const existingThreeColors =
                    tiles.find((t) => MahjongHand.existFrom(mSets, t)) &&
                    tiles.find((t) => MahjongHand.existFrom(pSets, t)) &&
                    tiles.find((t) => MahjongHand.existFrom(sSets, t));
                if (existingThreeColors) return true;
            }
            return false;
        };
        const setsComposition = MahjongHand.getSetsComposition(hand);
        return (
            setsComposition.filter((e) =>
                isThreeColors([
                    ...e.completed['CTriple'],
                    ...e.completed['NCTriple']
                ])
            ).length > 0
        );
    }
    static isAllTerminalsAndHonors(hand: Tile[], context: Context): boolean {
        return (
            MahjongHand.exceptFrom(
                hand,
                MahjongHand.getHandFromString(
                    '11119999m11119999p11119999s1111222233334444555566667777z'
                )
            ).length == 0 && !this.isAllTerminals(hand)
        );
    }
    static getValueTiles(context: Context) {
        return [
            new Tile('White Dragon'),
            new Tile('Green Dragon'),
            new Tile('Red Dragon'),
            context.seatWind,
            context.prevalentWind
        ];
    }

    static isSameComposition() {}

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

    static getInitSetsStatus = (): SetsComposition => {
        return {
            CRun: [],
            CTriple: [],
            Head: [],
            NCRun: [],
            NCTriple: []
        };
    };

    static getSetsComposition(hand: Tile[]): HandComposition[] {
        const divideBySet = (
            unsettledTile: Tile[],
            headExcepted: boolean
        ): SetsComposition[] | null => {
            let res: SetsComposition[] = [];
            if (unsettledTile.length == 0) return [this.getInitSetsStatus()];
            else {
                if (!headExcepted) {
                    for (const tile of unsettledTile) {
                        const pair = MahjongHand.getCreatablePair(tile);
                        if (MahjongHand.existFrom(unsettledTile, pair)) {
                            const result = divideBySet(
                                MahjongHand.exceptFrom(unsettledTile, pair),
                                true
                            );
                            if (result == null) {
                                continue;
                            } else {
                                res = [
                                    ...res,
                                    ...result.map((e) => {
                                        e['Head'].push(pair);
                                        return e;
                                    })
                                ];
                            }
                        }
                    }
                } else {
                    for (const tile of unsettledTile) {
                        const creatableSets = MahjongHand.getCreatableSet(tile);
                        let existSet = false;
                        for (const needleSet of creatableSets) {
                            if (
                                MahjongHand.existFrom(unsettledTile, needleSet)
                            ) {
                                existSet = true;
                                const result = divideBySet(
                                    MahjongHand.exceptFrom(
                                        unsettledTile,
                                        needleSet
                                    ),
                                    headExcepted
                                );
                                if (result == null) continue;
                                else {
                                    const name = needleSet[0].isSame(
                                        needleSet[1]
                                    )
                                        ? 'CTriple'
                                        : 'CRun';
                                    res = [
                                        ...res,
                                        ...result.map((e) => {
                                            e[name].push(needleSet);
                                            return e;
                                        })
                                    ];
                                }
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
        ): HandComposition[] => {
            let res: HandComposition[] = [];
            for (const tile of unsettledTile) {
                const creatableTarts = MahjongHand.getCreatableTarts(tile);
                for (const needleTart of creatableTarts) {
                    if (MahjongHand.existFrom(unsettledTile, needleTart)) {
                        const sets = divideBySet(
                            MahjongHand.exceptFrom(unsettledTile, needleTart),
                            false
                        );
                        if (sets == null) {
                            continue;
                        } else {
                            if (
                                needleTart.length == 2 &&
                                !sets.find((e) => e['Head'].length > 0)
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
                divideBySet(hand, false)?.map((e) => {
                    return {
                        inCompleted: [],
                        completed: e
                    };
                }) ?? []
            );
        } else return getSetsComposition(hand);
    }
    static getIncludeTileCount(hand: Tile[], needleTile: Tile): number {
        return hand.filter((t) => needleTile.isSame(t)).length;
    }

    static getValidTileCount(hand: Tile[]): { tile: Tile; count: number }[] {
        const validTiles = this.getValidTiles(hand);
        return validTiles.map((e) => {
            return { tile: e, count: 4 - this.getIncludeTileCount(hand, e) };
        });
    }

    static getYaku(hand: Tile[], context: Context): RoleInfo[] {
        if (MahjongHand.exceptFrom(hand, [context.winTile]).length != 13)
            return [];
        if (MahjongHand.calcSyanten(hand) != -1) return [];
        const res: RoleInfo[] = [];
        if (this.isBlessingOfEarth(hand, context)) {
            return [{ roleName: 'Blessing of Earth', rolePoint: 15 }];
        }
        if (this.isBlessingOfHeaven(hand, context)) {
            return [{ roleName: 'Blessing of Heaven', rolePoint: 15 }];
        }
        if (this.isNineGates(hand, context)) {
            return [{ roleName: 'Nine Gates', rolePoint: 15 }];
        }
        if (this.isThirteenOrphans(hand, context)) {
            return [{ roleName: 'Thirteen Orphans', rolePoint: 15 }];
        }
        if (this.isAllGreen(hand, context)) {
            return [{ roleName: 'All Green', rolePoint: 15 }];
        }
        if (this.isBigDragons(hand, context)) {
            return [{ roleName: 'Big Dragons', rolePoint: 15 }];
        }
        if (this.isFourConcealedTriples(hand, context)) {
            return [{ roleName: 'Four Concealed Triples', rolePoint: 15 }];
        }
        if (this.isFourWinds(hand, context)) {
            return [{ roleName: 'Four Winds', rolePoint: 15 }];
        }
        if (this.isThreeColorTriples(hand, context)) {
            res.push({ roleName: 'Three Color Triples', rolePoint: 2 });
        }
        if (this.isAllTerminalsAndHonors(hand, context)) {
            res.push({ roleName: 'All Terminals And Honors', rolePoint: 2 });
        }
        if (this.isThreeColorRuns(hand, context)) {
            res.push({ roleName: 'Three Color Runs', rolePoint: 2 });
        }
        if (this.isThreeConcealedTriples(hand, context)) {
            res.push({ roleName: 'Three Concealed Triples', rolePoint: 2 });
        }
        if (this.isDoubleReech(hand, context)) {
            res.push({ roleName: 'Double Reech', rolePoint: 2 });
        }
        if (this.isFullFlush(hand, context)) {
            res.push({ roleName: 'Full Flush', rolePoint: 6 });
        }
        if (this.isSevenPairs(hand, context)) {
            res.push({ roleName: 'Seven Pairs', rolePoint: 2 });
        }
        if (this.isReech(hand, context)) {
            res.push({ roleName: 'Three Concealed Triples', rolePoint: 1 });
        }
        if (this.isLittleDragons(hand, context)) {
            res.push({ roleName: 'Little Dragons', rolePoint: 2 });
        }
        if (this.isFullStraight(hand, context)) {
            res.push({ roleName: 'Full Straight', rolePoint: 2 });
        }
        if (this.isWhiteDragon(hand, context)) {
            res.push({ roleName: 'White Dragon', rolePoint: 1 });
        }
        if (this.isGreenDragon(hand, context)) {
            res.push({ roleName: 'Green Dragon', rolePoint: 1 });
        }
        if (this.isRedDragon(hand, context)) {
            res.push({ roleName: 'Red Dragon', rolePoint: 1 });
        }
        if (this.isEast(hand, context)) {
            res.push({ roleName: 'East', rolePoint: 1 });
        }
        if (this.isSouth(hand, context)) {
            res.push({ roleName: 'South', rolePoint: 1 });
        }
        if (this.isWest(hand, context)) {
            res.push({ roleName: 'West', rolePoint: 1 });
        }
        if (this.isNorth(hand, context)) {
            res.push({ roleName: 'North', rolePoint: 1 });
        }
        if (this.isFieldEast(hand, context)) {
            res.push({ roleName: 'Field East', rolePoint: 1 });
        }
        if (this.isFieldSouth(hand, context)) {
            res.push({ roleName: 'Field South', rolePoint: 1 });
        }
        if (this.isFieldWest(hand, context)) {
            res.push({ roleName: 'Field West', rolePoint: 1 });
        }
        if (this.isFieldNorth(hand, context)) {
            res.push({ roleName: 'Field North', rolePoint: 1 });
        }
        if (this.isAllSimples(hand, context)) {
            res.push({ roleName: 'All Simples', rolePoint: 1 });
        }
        if (this.isKingsTileDraw(hand, context)) {
            res.push({ roleName: "King's Tile Draw", rolePoint: 1 });
        }
        if (this.isFinalTileWin(hand, context)) {
            res.push({ roleName: 'Final Tile Win', rolePoint: 1 });
        }
        if (this.isConcealedSelfDraw(hand, context)) {
            res.push({ roleName: 'Concealed Self Draw', rolePoint: 1 });
        }
        if (this.isHalfFlush(hand, context)) {
            res.push({ roleName: 'Half Flush', rolePoint: 3 });
        }
        if (this.isPureOutsideHand(hand, context)) {
            res.push({ roleName: 'Pure Outside Hand', rolePoint: 3 });
        }
        if (this.isMixedOutsideHand(hand, context)) {
            res.push({ roleName: 'Mixed Outside Hand', rolePoint: 2 });
        }
        if (this.isDoubleRun(hand, context)) {
            res.push({ roleName: 'Double Run', rolePoint: 1 });
        }
        if (this.isAllRuns(hand, context)) {
            res.push({ roleName: 'All Runs', rolePoint: 1 });
        }
        if (this.isTwoDoubleRun(hand, context)) {
            res.push({ roleName: 'Two Double Runs', rolePoint: 3 });
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

    static toString(hand: Tile[]) {
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

    static toStringPic(hand: Tile[]): string {
        return MahjongHand.getHandFromString(MahjongHand.toString(hand))
            .map((e) => e.getStringPic())
            .join('');
    }

    static async importMap() {}

    static dumpMap() {
        for (const key of this.memo.keys()) {
            console.log(key + '&' + this.memo.get(key));
        }
    }
}
