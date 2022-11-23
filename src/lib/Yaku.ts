import {
    HandInfo,
    honorArray,
    MahjongHand,
    SetsComposition,
    Tile
} from './MahjongHand';

interface YakuInterface {
    readonly roleName: string;
    readonly rolePointClose: number;
    readonly rolePointOpen?: number;
    readonly isGrandSlum: boolean;
    readonly isCloseLimited: boolean;
    judge(handInfo: HandInfo): boolean;
}

class BigDragons implements YakuInterface {
    roleName: string = 'Big Dragon';
    rolePointClose: number = 15;
    isGrandSlum = true;
    isCloseLimited = false;
    judge(handInfo: HandInfo): boolean {
        return MahjongHand.existFrom(
            handInfo.hand,
            MahjongHand.getHandFromString('555666777z')
        );
    }
}

class BlessingOfHeaven implements YakuInterface {
    roleName: string = 'Blessing of Heaven';
    rolePointClose: number = 15;
    isGrandSlum = true;
    isCloseLimited = false;
    judge(handInfo: HandInfo): boolean {
        return handInfo.context.isBlessingOfHeaven ?? false;
    }
}

class FourQuads implements YakuInterface {
    roleName: string = 'Four Quads';
    rolePointClose: number = 15;
    isGrandSlum = true;
    isCloseLimited = false;
    judge(handInfo: HandInfo): boolean {
        // TODO:実装
        return false;
    }
}

class NineGates implements YakuInterface {
    roleName: string = 'Nine Gates';
    rolePointClose: number = 15;
    isGrandSlum = true;
    isCloseLimited = true;
    judge(handInfo: HandInfo): boolean {
        const m = MahjongHand.exceptFrom(handInfo.hand, '1112345678999m');
        const p = MahjongHand.exceptFrom(handInfo.hand, '1112345678999p');
        const s = MahjongHand.exceptFrom(handInfo.hand, '1112345678999s');
        return (
            (m.length == 1 && m[0].getSuit() == 'Characters') ||
            (p.length == 1 && p[0].getSuit() == 'Dots') ||
            (s.length == 1 && s[0].getSuit() == 'Bamboos')
        );
    }
}

class AllGreen implements YakuInterface {
    roleName: string = 'All Green';
    rolePointClose: number = 15;
    isGrandSlum = true;
    isCloseLimited = false;
    judge(handInfo: HandInfo): boolean {
        return (
            MahjongHand.exceptFrom(
                handInfo.hand,
                MahjongHand.getHandFromString('22223333444466668888s6666z')
            ).length == 0
        );
    }
}

class BlessingOfEarth implements YakuInterface {
    roleName: string = 'Blessing of Earth';
    rolePointClose: number = 15;
    isGrandSlum = true;
    isCloseLimited = false;
    judge(handInfo: HandInfo): boolean {
        return handInfo.context.isBlessingOfEarth ?? false;
    }
}

class AllTerminals implements YakuInterface {
    roleName: string = 'All Terminals';
    rolePointClose: number = 15;
    isGrandSlum = true;
    isCloseLimited = false;
    judge(handInfo: HandInfo): boolean {
        return (
            MahjongHand.exceptFrom(
                handInfo.hand,
                MahjongHand.getHandFromString('11119999m11119999p11119999s')
            ).length == 0
        );
    }
}

class AllHonors implements YakuInterface {
    roleName: string = 'All Honors';
    rolePointClose: number = 15;
    isGrandSlum = true;
    isCloseLimited = false;
    judge(handInfo: HandInfo): boolean {
        return (
            MahjongHand.exceptFrom(
                handInfo.hand,
                MahjongHand.getHandFromString('1111222233334444555566667777z')
            ).length == 0
        );
    }
}

class FourWinds implements YakuInterface {
    roleName: string = 'Four Winds';
    rolePointClose: number = 15;
    isGrandSlum = true;
    isCloseLimited = false;
    judge(handInfo: HandInfo): boolean {
        return (
            [
                ...handInfo.composition['CTriple'],
                ...handInfo.composition['NCTriple'],
                ...handInfo.composition['Head']
            ].filter(
                (sets) =>
                    MahjongHand.existFrom(sets, [new Tile('East')]) ||
                    MahjongHand.existFrom(sets, [new Tile('South')]) ||
                    MahjongHand.existFrom(sets, [new Tile('West')]) ||
                    MahjongHand.existFrom(sets, [new Tile('North')])
            ).length == 4
        );
    }
}

class ThirteenOrphans implements YakuInterface {
    roleName: string = 'Thirteen Orphans';
    rolePointClose: number = 15;
    isGrandSlum = true;
    isCloseLimited = false;
    judge(handInfo: HandInfo): boolean {
        const rest = MahjongHand.exceptFrom(
            handInfo.hand,
            MahjongHand.getHandFromString('19m19p19s1234567z')
        );
        if (rest.length == 1) {
            if (
                rest[0].getNumber() === 1 ||
                honorArray.includes(rest[0].getSuit())
            )
                return true;
        }
        return false;
    }
}

class FourConcealedTriples implements YakuInterface {
    roleName: string = 'Four Concealed Triples';
    rolePointClose: number = 15;
    isGrandSlum = true;
    isCloseLimited = false;
    judge(handInfo: HandInfo): boolean {
        return handInfo.composition['CTriple'].length == 4;
    }
}

class FullFlush implements YakuInterface {
    roleName: string = 'Full Flush';
    rolePointClose: number = 6;
    rolePointOpen: number = 5;
    isGrandSlum = false;
    isCloseLimited = false;
    judge(handInfo: HandInfo): boolean {
        return (
            MahjongHand.exceptFrom(
                handInfo.hand,
                MahjongHand.getHandFromString(
                    '111122223333444455556666777788889999m'
                )
            ).length == 0 ||
            MahjongHand.exceptFrom(
                handInfo.hand,
                MahjongHand.getHandFromString(
                    '111122223333444455556666777788889999p'
                )
            ).length == 0 ||
            MahjongHand.exceptFrom(
                handInfo.hand,
                MahjongHand.getHandFromString(
                    '111122223333444455556666777788889999s'
                )
            ).length == 0
        );
    }
}

class TwoDoubleRuns implements YakuInterface {
    roleName: string = 'Two Double Runs';
    rolePointClose: number = 3;
    isGrandSlum = false;
    isCloseLimited = true;
    judge(handInfo: HandInfo): boolean {
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
        return checkTwoDoubleRun(handInfo.composition);
    }
}

class PureOutsideHand implements YakuInterface {
    roleName: string = 'Pure Outside Hand';
    rolePointClose: number = 3;
    rolePointOpen: number = 2;
    isGrandSlum = false;
    isCloseLimited = false;
    judge(handInfo: HandInfo): boolean {
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
        return (
            handInfo.composition['CRun'].filter((el) =>
                pureOutsideSets.find((mos) => MahjongHand.existFrom(mos, el))
            ).length +
                handInfo.composition['CTriple'].filter((el) =>
                    pureOutsideSets.find((mos) =>
                        MahjongHand.existFrom(mos, el)
                    )
                ).length +
                handInfo.composition['NCRun'].filter((el) =>
                    pureOutsideSets.find((mos) =>
                        MahjongHand.existFrom(mos, el)
                    )
                ).length +
                handInfo.composition['NCTriple'].filter((el) =>
                    pureOutsideSets.find((mos) =>
                        MahjongHand.existFrom(mos, el)
                    )
                ).length +
                handInfo.composition['Head'].filter((el) =>
                    pureOutsideTarts.find((mot) =>
                        MahjongHand.existFrom(mot, el)
                    )
                ).length ==
            5
        );
    }
}

class HalfFlush implements YakuInterface {
    roleName: string = 'Half Flush';
    rolePointClose: number = 3;
    rolePointOpen: number = 2;
    isGrandSlum = false;
    isCloseLimited = false;
    judge(handInfo: HandInfo): boolean {
        const m = MahjongHand.exceptFrom(
            handInfo.hand,
            MahjongHand.getHandFromString(
                '11112222333344445555666677778888999m1111222233334444555566667777z'
            )
        );
        const p = MahjongHand.exceptFrom(
            handInfo.hand,
            MahjongHand.getHandFromString(
                '11112222333344445555666677778888999p1111222233334444555566667777z'
            )
        );
        const s = MahjongHand.exceptFrom(
            handInfo.hand,
            MahjongHand.getHandFromString(
                '11112222333344445555666677778888999s1111222233334444555566667777z'
            )
        );
        return (
            !new FullFlush().judge(handInfo) &&
            (m.length == 0 || p.length == 0 || s.length == 0)
        );
    }
}

class ThreeQuads implements YakuInterface {
    roleName: string = 'Three Quads';
    rolePointClose: number = 2;
    rolePointOpen: number = 2;
    isGrandSlum = false;
    isCloseLimited = true;
    judge(handInfo: HandInfo): boolean {
        // TODO:実装
        return false;
    }
}

class ThreeColorTriples implements YakuInterface {
    roleName: string = 'Three Color Triples';
    rolePointClose: number = 2;
    rolePointOpen: number = 2;
    isGrandSlum = false;
    isCloseLimited = false;
    judge(handInfo: HandInfo): boolean {
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
        return isThreeColors([
            ...handInfo.composition['CTriple'],
            ...handInfo.composition['NCTriple']
        ]);
    }
}

class AllTerminalsAndHonors implements YakuInterface {
    roleName: string = 'All Terminals And Honors';
    rolePointClose: number = 2;
    rolePointOpen: number = 2;
    isGrandSlum = false;
    isCloseLimited = false;
    judge(handInfo: HandInfo): boolean {
        return (
            MahjongHand.exceptFrom(
                handInfo.hand,
                MahjongHand.getHandFromString(
                    '11119999m11119999p11119999s1111222233334444555566667777z'
                )
            ).length == 0 && !new AllTerminals().judge(handInfo)
        );
    }
}

class LittleDragons implements YakuInterface {
    roleName: string = 'Little Dragons';
    rolePointClose: number = 2;
    rolePointOpen: number = 2;
    isGrandSlum = false;
    isCloseLimited = false;
    judge(handInfo: HandInfo): boolean {
        return ([
            ...handInfo.composition['CTriple'],
            ...handInfo.composition['NCTriple']
        ].find((el) =>
            MahjongHand.existFrom(el, MahjongHand.getHandFromString('555z'))
        ) &&
            [
                ...handInfo.composition['CTriple'],
                ...handInfo.composition['NCTriple']
            ].find((el) =>
                MahjongHand.existFrom(el, MahjongHand.getHandFromString('666z'))
            ) &&
            handInfo.composition['Head'].find((el) =>
                MahjongHand.existFrom(el, MahjongHand.getHandFromString('77z'))
            )) ||
            ([
                ...handInfo.composition['CTriple'],
                ...handInfo.composition['NCTriple']
            ].find((el) =>
                MahjongHand.existFrom(el, MahjongHand.getHandFromString('555z'))
            ) &&
                [
                    ...handInfo.composition['CTriple'],
                    ...handInfo.composition['NCTriple']
                ].find((el) =>
                    MahjongHand.existFrom(
                        el,
                        MahjongHand.getHandFromString('777z')
                    )
                ) &&
                handInfo.composition['Head'].find((el) =>
                    MahjongHand.existFrom(
                        el,
                        MahjongHand.getHandFromString('66z')
                    )
                )) ||
            ([
                ...handInfo.composition['CTriple'],
                ...handInfo.composition['NCTriple']
            ].find((el) =>
                MahjongHand.existFrom(el, MahjongHand.getHandFromString('666z'))
            ) &&
                [
                    ...handInfo.composition['CTriple'],
                    ...handInfo.composition['NCTriple']
                ].find((el) =>
                    MahjongHand.existFrom(
                        el,
                        MahjongHand.getHandFromString('777z')
                    )
                ) &&
                handInfo.composition['Head'].find((el) =>
                    MahjongHand.existFrom(
                        el,
                        MahjongHand.getHandFromString('55z')
                    )
                ))
            ? true
            : false;
    }
}

class ThreeConcealedTriples implements YakuInterface {
    roleName: string = 'Three Concealed Triples';
    rolePointClose: number = 2;
    isGrandSlum = false;
    isCloseLimited = true;
    judge(handInfo: HandInfo): boolean {
        return handInfo.composition['CTriple'].length == 3;
    }
}

class MixedOutsideHand implements YakuInterface {
    roleName: string = 'Mixed Outside Hand';
    rolePointClose: number = 2;
    rolePointOpen: number = 1;
    isGrandSlum = false;
    isCloseLimited = false;
    judge(handInfo: HandInfo): boolean {
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
        return (
            handInfo.composition['CRun'].filter((el) =>
                mixedOutsideSets.find((mos) => MahjongHand.existFrom(mos, el))
            ).length +
                handInfo.composition['CTriple'].filter((el) =>
                    mixedOutsideSets.find((mos) =>
                        MahjongHand.existFrom(mos, el)
                    )
                ).length +
                handInfo.composition['NCRun'].filter((el) =>
                    mixedOutsideSets.find((mos) =>
                        MahjongHand.existFrom(mos, el)
                    )
                ).length +
                handInfo.composition['NCTriple'].filter((el) =>
                    mixedOutsideSets.find((mos) =>
                        MahjongHand.existFrom(mos, el)
                    )
                ).length +
                handInfo.composition['Head'].filter((el) =>
                    mixedOutsideTarts.find((mot) =>
                        MahjongHand.existFrom(mot, el)
                    )
                ).length ==
            5
        );
    }
}

class FullStraight implements YakuInterface {
    roleName: string = 'Full Straight';
    rolePointClose: number = 2;
    rolePointOpen: number = 1;
    isGrandSlum = false;
    isCloseLimited = false;
    judge(handInfo: HandInfo): boolean {
        return (handInfo.composition['CRun'].find((el) =>
            MahjongHand.existFrom(el, MahjongHand.getHandFromString('123m'))
        ) &&
            handInfo.composition['CRun'].find((el) =>
                MahjongHand.existFrom(el, MahjongHand.getHandFromString('456m'))
            ) &&
            handInfo.composition['CRun'].find((el) =>
                MahjongHand.existFrom(el, MahjongHand.getHandFromString('789m'))
            )) ||
            (handInfo.composition['CRun'].find((el) =>
                MahjongHand.existFrom(el, MahjongHand.getHandFromString('123p'))
            ) &&
                handInfo.composition['CRun'].find((el) =>
                    MahjongHand.existFrom(
                        el,
                        MahjongHand.getHandFromString('456p')
                    )
                ) &&
                handInfo.composition['CRun'].find((el) =>
                    MahjongHand.existFrom(
                        el,
                        MahjongHand.getHandFromString('789p')
                    )
                )) ||
            (handInfo.composition['CRun'].find((el) =>
                MahjongHand.existFrom(el, MahjongHand.getHandFromString('123s'))
            ) &&
                handInfo.composition['CRun'].find((el) =>
                    MahjongHand.existFrom(
                        el,
                        MahjongHand.getHandFromString('456s')
                    )
                ) &&
                handInfo.composition['CRun'].find((el) =>
                    MahjongHand.existFrom(
                        el,
                        MahjongHand.getHandFromString('789s')
                    )
                ))
            ? true
            : false;
    }
}

class SevenPairs implements YakuInterface {
    roleName: string = 'Seven Pairs';
    rolePointClose: number = 2;
    isGrandSlum = false;
    isCloseLimited = true;
    judge(handInfo: HandInfo): boolean {
        if (handInfo.isElementHand) return false;
        return (
            7 ==
            handInfo.hand
                .reduce((prev: Tile[], cur) => {
                    return prev.find((e) => e.isSame(cur))
                        ? prev
                        : [...prev, cur];
                }, [])
                .reduce((prev, cur) => {
                    return (
                        prev +
                        (handInfo.hand.filter((elem) => elem.isSame(cur))
                            .length >= 2
                            ? 1
                            : 0)
                    );
                }, 0)
        );
    }
}

class ThreeColorRuns implements YakuInterface {
    roleName: string = 'Three Color Runs';
    rolePointClose: number = 2;
    rolePointOpen: number = 1;
    isGrandSlum = false;
    isCloseLimited = false;
    judge(handInfo: HandInfo): boolean {
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
        return isThreeColors([
            ...handInfo.composition['CRun'],
            ...handInfo.composition['NCRun']
        ]);
    }
}

class AllTriples implements YakuInterface {
    roleName: string = 'All Triples';
    rolePointClose: number = 2;
    rolePointOpen: number = 2;
    isGrandSlum = false;
    isCloseLimited = false;
    judge(handInfo: HandInfo): boolean {
        // TODO:実装
        return false;
    }
}
class DoubleReech implements YakuInterface {
    roleName: string = 'Double Reech';
    rolePointClose: number = 2;
    isGrandSlum = false;
    isCloseLimited = true;
    judge(handInfo: HandInfo): boolean {
        return handInfo.context.isDoubleReech ?? false;
    }
}
// point 1
class AddAQuad implements YakuInterface {
    roleName: string = 'Add A Quad';
    rolePointClose: number = 1;
    rolePointOpen: number = 1;
    isGrandSlum = false;
    isCloseLimited = false;
    judge(handInfo: HandInfo): boolean {
        return handInfo.context.isAddAQuad ?? false;
    }
}

class KingsTileDraw implements YakuInterface {
    roleName: string = "King's Tile Draw";
    rolePointClose: number = 1;
    rolePointOpen: number = 1;
    isGrandSlum = false;
    isCloseLimited = false;
    judge(handInfo: HandInfo): boolean {
        return handInfo.context.isKingsTileDraw ?? false;
    }
}

class FinalTileWin implements YakuInterface {
    roleName: string = 'Final Tile Win';
    rolePointClose: number = 1;
    rolePointOpen: number = 1;
    isGrandSlum = false;
    isCloseLimited = false;
    judge(handInfo: HandInfo): boolean {
        return handInfo.context.isFinalTile ?? false;
    }
}

class DoubleRun implements YakuInterface {
    roleName: string = 'Double Run';
    rolePointClose: number = 1;
    rolePointOpen: number = 1;
    isGrandSlum = false;
    isCloseLimited = true;
    judge(handInfo: HandInfo): boolean {
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
            checkDoubleRun(handInfo.composition) &&
            !new TwoDoubleRuns().judge(handInfo)
        );
    }
}

class FirstTurnWin implements YakuInterface {
    roleName: string = 'Final Turn Win';
    rolePointClose: number = 1;
    isGrandSlum = false;
    isCloseLimited = true;
    judge(handInfo: HandInfo): boolean {
        return handInfo.context.isReechFirstTurn ?? false;
    }
}

class ConcealedSelfDraw implements YakuInterface {
    roleName: string = 'Concealed Self-Draw';
    rolePointClose: number = 1;
    isGrandSlum = false;
    isCloseLimited = true;
    judge(handInfo: HandInfo): boolean {
        return (
            handInfo.context.isConcealed &&
            handInfo.context.tilePlace == 'Tsumo'
        );
    }
}

class AllRuns implements YakuInterface {
    roleName: string = 'All Runs';
    rolePointClose: number = 1;
    isGrandSlum = false;
    isCloseLimited = true;
    judge(handInfo: HandInfo): boolean {
        const head = handInfo.composition['Head'][0];
        if (
            !head ||
            MahjongHand.getValueTiles(handInfo.context).filter((e) =>
                e.isSame(head[0])
            ).length >= 1
        )
            return false;
        if (handInfo.composition['CRun'].length != 4) {
            return false;
        }
        return handInfo.composition['CRun'].find((e) => {
            return (
                MahjongHand.getWinTileFromTarts(
                    MahjongHand.exceptFrom(e, [handInfo.context.winTile])
                ).length == 2
            );
        })
            ? true
            : false;
    }
}

class AllSimples implements YakuInterface {
    roleName: string = 'All Simples';
    rolePointClose: number = 1;
    rolePointOpen: number = 1;
    isGrandSlum = false;
    isCloseLimited = false;
    judge(handInfo: HandInfo): boolean {
        return (
            MahjongHand.exceptFrom(
                handInfo.hand,
                MahjongHand.getHandFromString(
                    '2222333344445555666677778888p2222333344445555666677778888m2222333344445555666677778888s'
                )
            ).length == 0
        );
    }
}

class FieldEast implements YakuInterface {
    roleName: string = 'Field East';
    rolePointClose: number = 1;
    rolePointOpen: number = 1;
    isGrandSlum = false;
    isCloseLimited = false;
    judge(handInfo: HandInfo): boolean {
        return (handInfo.composition['CTriple'].find((el) =>
            MahjongHand.existFrom(el, [new Tile('East')])
        ) ||
            handInfo.composition['NCTriple'].find((el) =>
                MahjongHand.existFrom(el, [new Tile('East')])
            )) &&
            MahjongHand.existFrom(
                [handInfo.context.prevalentWind],
                [new Tile('East')]
            )
            ? true
            : false;
    }
}

class FieldSouth implements YakuInterface {
    roleName: string = 'Field South';
    rolePointClose: number = 1;
    rolePointOpen: number = 1;
    isGrandSlum = false;
    isCloseLimited = false;
    judge(handInfo: HandInfo): boolean {
        return (handInfo.composition['CTriple'].find((el) =>
            MahjongHand.existFrom(el, [new Tile('South')])
        ) ||
            handInfo.composition['NCTriple'].find((el) =>
                MahjongHand.existFrom(el, [new Tile('South')])
            )) &&
            MahjongHand.existFrom(
                [handInfo.context.prevalentWind],
                [new Tile('South')]
            )
            ? true
            : false;
    }
}
class FieldWest implements YakuInterface {
    roleName: string = 'Field West';
    rolePointClose: number = 1;
    rolePointOpen: number = 1;
    isGrandSlum = false;
    isCloseLimited = false;
    judge(handInfo: HandInfo): boolean {
        return (handInfo.composition['CTriple'].find((el) =>
            MahjongHand.existFrom(el, [new Tile('West')])
        ) ||
            handInfo.composition['NCTriple'].find((el) =>
                MahjongHand.existFrom(el, [new Tile('West')])
            )) &&
            MahjongHand.existFrom(
                [handInfo.context.prevalentWind],
                [new Tile('West')]
            )
            ? true
            : false;
    }
}
class FieldNorth implements YakuInterface {
    roleName: string = 'Field North';
    rolePointClose: number = 1;
    rolePointOpen: number = 1;
    isGrandSlum = false;
    isCloseLimited = false;
    judge(handInfo: HandInfo): boolean {
        return (handInfo.composition['CTriple'].find((el) =>
            MahjongHand.existFrom(el, [new Tile('North')])
        ) ||
            handInfo.composition['NCTriple'].find((el) =>
                MahjongHand.existFrom(el, [new Tile('North')])
            )) &&
            MahjongHand.existFrom(
                [handInfo.context.prevalentWind],
                [new Tile('North')]
            )
            ? true
            : false;
    }
}

class East implements YakuInterface {
    roleName: string = 'East';
    rolePointClose: number = 1;
    rolePointOpen: number = 1;
    isGrandSlum = false;
    isCloseLimited = false;
    judge(handInfo: HandInfo): boolean {
        return (handInfo.composition['CTriple'].find((el) =>
            MahjongHand.existFrom(el, [new Tile('East')])
        ) ||
            handInfo.composition['NCTriple'].find((el) =>
                MahjongHand.existFrom(el, [new Tile('East')])
            )) &&
            MahjongHand.existFrom(
                [handInfo.context.seatWind],
                [new Tile('East')]
            )
            ? true
            : false;
    }
}

class South implements YakuInterface {
    roleName: string = 'South';
    rolePointClose: number = 1;
    rolePointOpen: number = 1;
    isGrandSlum = false;
    isCloseLimited = false;
    judge(handInfo: HandInfo): boolean {
        return (handInfo.composition['CTriple'].find((el) =>
            MahjongHand.existFrom(el, [new Tile('South')])
        ) ||
            handInfo.composition['NCTriple'].find((el) =>
                MahjongHand.existFrom(el, [new Tile('South')])
            )) &&
            MahjongHand.existFrom(
                [handInfo.context.seatWind],
                [new Tile('South')]
            )
            ? true
            : false;
    }
}
class West implements YakuInterface {
    roleName: string = 'West';
    rolePointClose: number = 1;
    rolePointOpen: number = 1;
    isGrandSlum = false;
    isCloseLimited = false;
    judge(handInfo: HandInfo): boolean {
        return (handInfo.composition['CTriple'].find((el) =>
            MahjongHand.existFrom(el, [new Tile('West')])
        ) ||
            handInfo.composition['NCTriple'].find((el) =>
                MahjongHand.existFrom(el, [new Tile('West')])
            )) &&
            MahjongHand.existFrom(
                [handInfo.context.seatWind],
                [new Tile('West')]
            )
            ? true
            : false;
    }
}
class North implements YakuInterface {
    roleName: string = 'North';
    rolePointClose: number = 1;
    rolePointOpen: number = 1;
    isGrandSlum = false;
    isCloseLimited = false;
    judge(handInfo: HandInfo): boolean {
        return (handInfo.composition['CTriple'].find((el) =>
            MahjongHand.existFrom(el, [new Tile('North')])
        ) ||
            handInfo.composition['NCTriple'].find((el) =>
                MahjongHand.existFrom(el, [new Tile('North')])
            )) &&
            MahjongHand.existFrom(
                [handInfo.context.seatWind],
                [new Tile('North')]
            )
            ? true
            : false;
    }
}
class WhiteDragon implements YakuInterface {
    roleName: string = 'White Dragon';
    rolePointClose: number = 1;
    rolePointOpen: number = 1;
    isGrandSlum = false;
    isCloseLimited = false;
    judge(handInfo: HandInfo): boolean {
        return handInfo.composition['CTriple'].find((el) =>
            MahjongHand.existFrom(el, [new Tile('White Dragon')])
        ) ||
            handInfo.composition['NCTriple'].find((el) =>
                MahjongHand.existFrom(el, [new Tile('White Dragon')])
            )
            ? true
            : false;
    }
}
class GreenDragon implements YakuInterface {
    roleName: string = 'Green Dragon';
    rolePointClose: number = 1;
    rolePointOpen: number = 1;
    isGrandSlum = false;
    isCloseLimited = false;
    judge(handInfo: HandInfo): boolean {
        return handInfo.composition['CTriple'].find((el) =>
            MahjongHand.existFrom(el, [new Tile('Green Dragon')])
        ) ||
            handInfo.composition['NCTriple'].find((el) =>
                MahjongHand.existFrom(el, [new Tile('Green Dragon')])
            )
            ? true
            : false;
    }
}
class RedDragon implements YakuInterface {
    roleName: string = 'Red Dragon';
    rolePointClose: number = 1;
    rolePointOpen: number = 1;
    isGrandSlum = false;
    isCloseLimited = false;
    judge(handInfo: HandInfo): boolean {
        return handInfo.composition['CTriple'].find((el) =>
            MahjongHand.existFrom(el, [new Tile('Red Dragon')])
        ) ||
            handInfo.composition['NCTriple'].find((el) =>
                MahjongHand.existFrom(el, [new Tile('Red Dragon')])
            )
            ? true
            : false;
    }
}

class Reech implements YakuInterface {
    roleName: string = 'Reech';
    rolePointClose: number = 1;
    isGrandSlum = false;
    isCloseLimited = true;
    judge(handInfo: HandInfo): boolean {
        return (
            (handInfo.context.isReech ?? false) &&
            !new DoubleReech().judge(handInfo)
        );
    }
}

export const yakumanRoles = [
    new BigDragons(),
    new BlessingOfHeaven(),
    new BlessingOfEarth(),
    new AllGreen(),
    new AllTerminals(),
    new AllHonors(),
    new FourWinds(),
    new ThirteenOrphans(),
    new FourConcealedTriples(),
    new FourQuads(),
    new NineGates()
];

export const allRoles = [
    new BigDragons(),
    new BlessingOfHeaven(),
    new BlessingOfEarth(),
    new AllGreen(),
    new AllTerminals(),
    new AllHonors(),
    new FourWinds(),
    new ThirteenOrphans(),
    new FourConcealedTriples(),
    new FourQuads(),
    new NineGates(),
    new FullFlush(),

    new TwoDoubleRuns(),
    new PureOutsideHand(),
    new HalfFlush(),

    new ThreeQuads(),
    new ThreeColorTriples(),
    new AllTerminalsAndHonors(),
    new LittleDragons(),
    new ThreeConcealedTriples(),
    new MixedOutsideHand(),
    new FullStraight(),
    new SevenPairs(),
    new ThreeColorRuns(),
    new AllTriples(),
    new DoubleReech(),

    new AddAQuad(),
    new KingsTileDraw(),
    new FinalTileWin(),
    new DoubleRun(),
    new FirstTurnWin(),
    new ConcealedSelfDraw(),
    new AllRuns(),
    new AllSimples(),
    new East(),
    new South(),
    new West(),
    new North(),
    new WhiteDragon(),
    new GreenDragon(),
    new RedDragon(),
    new FieldEast(),
    new FieldSouth(),
    new FieldWest(),
    new FieldNorth(),
    new Reech()
];
