import React, { useEffect, useState } from 'react';
import logo from './logo.svg';
import './App.css';
import {
    Context,
    RoleName,
    Tile,
    Simples,
    MahjongHand
} from './lib/MahjongHand';
import mahjongOneColorAppStyle from './css/mahjongOneColorAppStyle.module.scss';
import { OneColorReadyHandGenerator } from './lib/OneColorHandGenerator';
import { arrayBuffer } from 'stream/consumers';
type PlayerInfoProps = {
    point: number;
    fieldWind: 'East' | 'South' | 'West' | 'North';
    gameNo: 1 | 2 | 3 | 4;
    roundNo: number;
    isLeader: boolean;
};
type HandInfoProps = {
    tiles: Tile[];
};
type InputPanelProps = {
    setInputStates: any;
    inputStates: InputState[];
    screenState: ScreenState;
};
type RoleInfoProps = {
    winTiles: {
        tile: Tile;
        Yaku: RoleName[];
        point: number;
        highPointString: string;
    }[];
};

const PlayerInfo = (props: PlayerInfoProps) => {
    return (
        <div className={mahjongOneColorAppStyle['player-info']}>
            <div className={mahjongOneColorAppStyle['field-info']}>
                {props.fieldWind +
                    ' ' +
                    (props.gameNo +
                        ' ' +
                        (props.isLeader ? 'Leader' : 'Non-Leader') +
                        ' Round : ' +
                        props.roundNo +
                        ' ')}
            </div>
            <div className={mahjongOneColorAppStyle['point']}>
                {props.point}点
            </div>
        </div>
    );
};

const HandInfo = (props: HandInfoProps) => {
    return (
        <div className={mahjongOneColorAppStyle['mahjong-hand']}>
            {MahjongHand.toStringPic(props.tiles)}
        </div>
    );
};

const RoleInfo = (props: RoleInfoProps) => {
    return (
        <div className={mahjongOneColorAppStyle['role-info']}>
            <table>
                <thead>
                    <tr>
                        <th className={mahjongOneColorAppStyle['tile-column']}>
                            Tile
                        </th>
                        <th className={mahjongOneColorAppStyle['point-column']}>
                            Point
                        </th>
                        <th
                            className={
                                mahjongOneColorAppStyle['win-point-column']
                            }
                        >
                            Win
                        </th>
                        <th className={mahjongOneColorAppStyle['roles-column']}>
                            Roles
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {props.winTiles
                        .sort((a, b) => a.point - b.point)
                        .map((e) => (
                            <tr>
                                <td
                                    className={
                                        mahjongOneColorAppStyle['tile-column']
                                    }
                                >
                                    {e.tile.getStringPic()}
                                </td>
                                <td
                                    className={
                                        mahjongOneColorAppStyle['point-column']
                                    }
                                >
                                    {e.point} {e.highPointString}
                                </td>
                                <td
                                    className={
                                        mahjongOneColorAppStyle[
                                            'win-point-column'
                                        ]
                                    }
                                >
                                    {e.point}
                                </td>
                                <td
                                    className={
                                        mahjongOneColorAppStyle['roles-column']
                                    }
                                >
                                    {e.Yaku.map((el) => (
                                        <li>{el}</li>
                                    ))}
                                </td>
                            </tr>
                        ))}
                </tbody>
            </table>
        </div>
    );
};

const InputPanel = (props: InputPanelProps) => {
    const toggleSelect = (num: number) => {
        return () => {
            if (props.screenState != 'QUEST') return;
            const current = props.inputStates;
            current[num] =
                current[num] == 'SELECTED' ? 'NON SELECTED' : 'SELECTED';
            props.setInputStates([...current]);
        };
    };
    const selectStyle = (state: InputState): string => {
        switch (state) {
            case 'SELECTED':
                return mahjongOneColorAppStyle['selected-input'];
            case 'OMISSION':
                return mahjongOneColorAppStyle['omission-input'];
            case 'WRONG':
                return mahjongOneColorAppStyle['wrong-input'];
            case 'COLLECT':
                return mahjongOneColorAppStyle['collect-input'];
            default:
                return mahjongOneColorAppStyle['non-selected-input'];
        }
    };
    return (
        <div className={mahjongOneColorAppStyle['input-panel']}>
            <table>
                {[...Array(3)].map((_, row) => {
                    return (
                        <tr>
                            {[...Array(3)].map((_, column) => (
                                <td
                                    className={selectStyle(
                                        props.inputStates[
                                            (2 - row) * 3 + column
                                        ]
                                    )}
                                    onClick={toggleSelect(
                                        (2 - row) * 3 + column
                                    )}
                                >
                                    {(2 - row) * 3 + column + 1}
                                </td>
                            ))}
                        </tr>
                    );
                })}
            </table>
        </div>
    );
};

const generateOneColorHand = (numSeries: string, suit: Simples) => {
    const str =
        suit == 'Bamboos' ? 's' : 'Characters' ? 'm' : 'Dots' ? 'p' : 'z';
    return MahjongHand.getHandFromString(numSeries + str);
};

type ScreenState = 'START' | 'SUBMIT' | 'QUEST' | 'FINISH';
type InputState =
    | 'SELECTED'
    | 'NON SELECTED'
    | 'COLLECT'
    | 'WRONG'
    | 'OMISSION'
    | '';

const MahjongOneColorApp = () => {
    const [handGenerator, setHandGenerator] =
        useState<OneColorReadyHandGenerator>();
    const [hand, setHand] = useState<Tile[]>();
    const [context, setContext] = useState<Context>();
    const [suit, setSuit] = useState<Simples>('Characters');
    const [screenState, setScreenState] = useState<ScreenState>('START');
    const [inputStates, setInputStates] = useState<InputState[]>(
        [...Array(9)].fill('NON SELECTED')
    );
    const submitAnswer = () => {
        const answerNumbers = MahjongHand.getValidTiles(hand ?? []).map(
            (e) => e.getNumber() - 1
        );
        const newInputStates: InputState[] = inputStates.map((v, i) => {
            if (answerNumbers.includes(i) && v == 'SELECTED') return 'COLLECT';
            else if (answerNumbers.includes(i) && v == 'NON SELECTED')
                return 'OMISSION';
            else if (!answerNumbers.includes(i) && v == 'SELECTED')
                return 'WRONG';
            else return '';
        });
        setInputStates(newInputStates);
        setScreenState('SUBMIT');
    };
    const startGame = () => {
        setScreenState('QUEST');
    };
    const resetHand = () => {
        setScreenState('QUEST');
        setInputStates([...Array(9)].fill('NON SELECTED'));
        setHand(
            generateOneColorHand(
                handGenerator?.getRandomOne() ?? '1112345678999',
                suit
            )
        );
    };
    useEffect(() => {
        const initialize = async () => {
            const oneColorReadyHandGenerator =
                await OneColorReadyHandGenerator.build();
            setHandGenerator(oneColorReadyHandGenerator);
            setContext({
                tilePlace: 'Tsumo',
                isConcealed: true,
                winTile: new Tile('Dots', 5),
                prevalentWind: new Tile('East'),
                seatWind: new Tile('East')
            });
            setHand(MahjongHand.getHandFromString('1112345678999m'));
        };
        initialize();
    }, []);

    return (
        <>
            <div className={mahjongOneColorAppStyle['page-top']}>
                <PlayerInfo
                    fieldWind={'East'}
                    gameNo={1}
                    roundNo={2}
                    point={25000}
                    isLeader={true}
                />
                {hand && <HandInfo tiles={hand} />}
            </div>
            <div className={mahjongOneColorAppStyle['page-bottom']}>
                {hand && context && (
                    <RoleInfo
                        winTiles={MahjongHand.getValidTilesWithYaku(
                            hand,
                            context
                        )}
                    />
                )}
                <InputPanel
                    setInputStates={setInputStates}
                    inputStates={inputStates}
                    screenState={screenState}
                />
                <input type={'button'} onClick={resetHand}></input>
                <input type={'button'} onClick={submitAnswer}></input>
                <input type={'button'} onClick={startGame}></input>
            </div>
        </>
    );
};

const Page = () => {
    return <MahjongOneColorApp />;
};

export default Page;
