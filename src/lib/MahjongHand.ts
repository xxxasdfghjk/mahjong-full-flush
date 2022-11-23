import { number } from 'yargs';
import { allRoles } from './Yaku';
export const WinsArray = ['East', 'South', 'West', 'North'] as const;
export const DragonsArray = [
    'White Dragon',
    'Green Dragon',
    'Red Dragon'
] as const;
export type SuitType = Honors | Simples | 'None';
export type Wins = typeof WinsArray[number];
export type Dragons = typeof DragonsArray[number];
export type Honors = Wins | Dragons;
const simplesArray: SuitType[] = ['Dots', 'Bamboos', 'Characters'];
export const honorArray: SuitType[] = [
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
    roleName: string;
};

export type HandInfo = {
    composition: SetsComposition;
    hand: Tile[];
    context: Context;
    isElementHand: boolean;
};

export type SetsComposition = {
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
    isLeader?: boolean;
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
    getSuitNumber(): number {
        switch (this.suit) {
            case 'Characters':
                return 0;
            case 'Dots':
                return 1;
            case 'Bamboos':
                return 2;
            case 'East':
                return 3;
            case 'South':
                return 4;
            case 'West':
                return 5;
            case 'North':
                return 6;
            case 'White Dragon':
                return 7;
            case 'Green Dragon':
                return 8;
            case 'Red Dragon':
                return 9;
            default:
                return -1;
        }
    }
    static sortTiles(hand: Tile[]) {
        return hand
            .sort((a, b) => (a.getNumber() ?? 0) - (b.getNumber() ?? 0))
            .sort((a, b) => a.getSuitNumber() - b.getSuitNumber());
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
        Yaku: string[];
        doubles: number;
        point: number;
        highPointString: string;
    }[] {
        if (tiles.length != 13) return [];
        if (MahjongHand.calcSyanten(tiles) != 0) {
            return [];
        }
        const validTiles = MahjongHand.getValidTiles(tiles);
        return validTiles
            .map((tile) => {
                const examHand = tiles.concat();
                examHand.push(tile);
                context.winTile = tile;
                const roleInfo = MahjongHand.getYaku(
                    Tile.sortTiles(examHand),
                    context
                );
                const doubles = roleInfo.reduce(
                    (prev, cur) => prev + cur.rolePoint,
                    0
                );
                const getPoint = (doubles: number) => {
                    switch (doubles) {
                        case 6:
                        case 7:
                            return 12000;
                        case 8:
                        case 9:
                        case 10:
                            return 16000;
                        case 11:
                        case 12:
                            return 24000;
                        default:
                            return 32000;
                    }
                };
                return {
                    tile: tile,
                    Yaku: roleInfo.map((e) => e.roleName),
                    doubles: doubles,
                    point: getPoint(doubles) * (context.isLeader ? 1.5 : 1),
                    highPointString: this.highPointWinToString(doubles)
                };
            })
            .sort((e1, e2) => e1.doubles - e2.doubles);
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
            .map((e) => HonorsMap[e.getSuit() as string] ?? 0)
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

    static getValueTiles(context: Context) {
        return [
            new Tile('White Dragon'),
            new Tile('Green Dragon'),
            new Tile('Red Dragon'),
            context.seatWind,
            context.prevalentWind
        ];
    }

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
                    const uniqueTile = unsettledTile.reduce(
                        (prev: Tile[], cur) => {
                            return prev.find((e) => e.isSame(cur))
                                ? prev
                                : [...prev, cur];
                        },
                        []
                    );
                    for (const tile of uniqueTile) {
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
                    const tile = unsettledTile[0];
                    const creatableSets = MahjongHand.getCreatableSet(tile);
                    let existSet = false;
                    for (const needleSet of creatableSets) {
                        if (MahjongHand.existFrom(unsettledTile, needleSet)) {
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
                                const name = needleSet[0].isSame(needleSet[1])
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
        const compositionList = this.getSetsComposition(hand);
        const rolesListByComposition = compositionList.map((composition) => {
            const roles: (RoleInfo & { isGrandSlum: boolean })[] =
                allRoles.flatMap((role) =>
                    role.judge({
                        composition: composition.completed,
                        hand: hand,
                        context,
                        isElementHand: true
                    })
                        ? [
                              {
                                  roleName: role.roleName,
                                  rolePoint: role.rolePointClose,
                                  isGrandSlum: role.isGrandSlum
                              }
                          ]
                        : []
                );
            const isGrandSlum = roles.find((e) => e.isGrandSlum);
            return {
                roles: roles.filter((e) => !isGrandSlum || e.isGrandSlum),
                totalPoint: roles.reduce((prev, cur) => prev + cur.rolePoint, 0)
            };
        });
        const sevenPairs = allRoles.flatMap((role) =>
            role.judge({
                composition: {
                    CRun: [],
                    CTriple: [],
                    Head: [],
                    NCRun: [],
                    NCTriple: []
                },
                hand: hand,
                context,
                isElementHand: false
            })
                ? {
                      roleName: role.roleName,
                      rolePoint: role.rolePointClose
                  }
                : []
        );

        return [
            ...rolesListByComposition,
            {
                roles: sevenPairs,
                totalPoint: sevenPairs.reduce(
                    (prev, cur) => prev + cur.rolePoint,
                    0
                )
            }
        ].sort((e1, e2) => e2.totalPoint - e1.totalPoint)[0].roles;
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
            .map((e) => map[e.getSuit() as string] ?? 0)
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

    private static syantenMemoUrl =
        'https://raw.githubusercontent.com/xxxasdfghjk/mahjong-full-flush/main/public/calcSyantenMemo.txt';
    static async importMap() {
        const data = (await (await fetch(this.syantenMemoUrl)).text()).split(
            '\n'
        );
        for (const i of data) {
            const [key, value] = i.split('&');
            const arr = value?.split(',')?.map((e) => Number(e)) ?? [0, 0];
            this.memo.set(key, [arr[0], arr[1]]);
        }
    }

    static dumpMap() {
        for (const key of this.memo.keys()) {
            console.log(key + '&' + this.memo.get(key));
        }
    }
}
