import { useEffect, useRef, useState } from 'react';
import './App.css';
import {
    Context,
    RoleName,
    Tile,
    Simples,
    MahjongHand,
    Wins,
    SuitType
} from './lib/MahjongHand';
import mahjongOneColorAppStyle from './css/mahjongOneColorAppStyle.module.scss';
import { OneColorReadyHandGenerator } from './lib/OneColorHandGenerator';
import {
    Box,
    Button,
    List,
    ListItemButton,
    ToggleButton,
    ToggleButtonGroup
} from '@mui/material';
type PlayerInfoProps = {
    point: number;
    fieldWind: string;
    gameNo: number;
    roundNo: number;
    isLeader: boolean;
    isEnd: boolean;
    suit: SuitType;
    setSuit: any;
    handleEnter: any;
};
type HandInfoProps = {
    tiles: Tile[];
};
type InputPanelProps = {
    setInputStates: any;
    inputStates: InputState[];
    screenState: ScreenState;
    setInputStatus: any;
    handleEnter: () => void;
    toggleSelect: any;
    suit: SuitType;
};
type HandHistoryInfoProps = {
    histories: HandHistory;
};
type WinTile = {
    tile: Tile;
    Yaku: string[];
    doubles: number;
    point: number;
    highPointString: string;
};
type RoleInfoProps = {
    winTiles: WinTiles;
    hidden?: boolean;
};
type ScreenState = 'START' | 'SUBMIT' | 'QUEST' | 'FINISH';
type InputState =
    | 'SELECTED'
    | 'NON SELECTED'
    | 'COLLECT'
    | 'WRONG'
    | 'OMISSION'
    | '';
type MessageZoneProps = {
    hidden: boolean;
    messageComponent: JSX.Element;
};
type FieldState = {
    turn: number;
    round: number;
    win: Wins | 'END';
    isLeader: boolean;
    isEnd: boolean;
};
type WinTiles = WinTile[];
type HandHistory = {
    isCollect: boolean;
    winTiles: WinTile[];
    hand: Tile[];
}[];
const PlayerInfo = (props: PlayerInfoProps) => {
    return props.isEnd ? (
        <div className={mahjongOneColorAppStyle['end-message']}>
            <Button
                variant="contained"
                onClick={props.handleEnter}
                sx={{ width: '100%', height: '60%', fontSize: '20px' }}
            >
                CONTINUE
            </Button>
            <div style={{ padding: '10px' }}>GAME OVER</div>

            <div className={mahjongOneColorAppStyle['point']}>
                {props.point} Point
            </div>
        </div>
    ) : (
        <div className={mahjongOneColorAppStyle['player-info']}>
            <div className={mahjongOneColorAppStyle['field-info']}>
                <div className={mahjongOneColorAppStyle['field-zone']}>
                    {props.fieldWind}
                </div>
                <div className={mahjongOneColorAppStyle['turn-zone']}>
                    {props.gameNo}
                </div>
                <div className={mahjongOneColorAppStyle['round-zone']}>
                    {'Round ' + props.roundNo}
                </div>
                <div className={mahjongOneColorAppStyle['is-leader-zone']}>
                    {props.isLeader ? 'Leader' : 'Non-Leader'}
                </div>
                <div className={mahjongOneColorAppStyle['point-zone']}>
                    {props.point + ' Point'}
                </div>
            </div>
            <ToggleButtonGroup
                className={mahjongOneColorAppStyle['suit-selector']}
                color="primary"
                value={props.suit}
                exclusive
                onChange={(e) => {
                    props.setSuit(
                        (e.currentTarget as HTMLInputElement)[
                            'value'
                        ] as Simples
                    );
                }}
                aria-label="Platform"
            >
                <ToggleButton
                    className={mahjongOneColorAppStyle['suit-selector-button']}
                    value="Characters"
                >
                    <span
                        className={
                            mahjongOneColorAppStyle['suit-selector-string']
                        }
                    >
                        🀇
                    </span>
                </ToggleButton>
                <ToggleButton
                    className={mahjongOneColorAppStyle['suit-selector-button']}
                    value="Dots"
                >
                    <span
                        className={
                            mahjongOneColorAppStyle['suit-selector-string']
                        }
                    >
                        🀙
                    </span>
                </ToggleButton>
                <ToggleButton
                    className={mahjongOneColorAppStyle['suit-selector-button']}
                    value="Bamboos"
                >
                    <span
                        className={
                            mahjongOneColorAppStyle['suit-selector-string']
                        }
                    >
                        🀐
                    </span>
                </ToggleButton>
            </ToggleButtonGroup>
        </div>
    );
};
const MessageZone = (props: MessageZoneProps) => {
    return (
        <div className={mahjongOneColorAppStyle['message-zone']}>
            {!props.hidden && (
                <p className={mahjongOneColorAppStyle['message-zone-content']}>
                    {props.messageComponent}
                </p>
            )}
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
            {!props.hidden && (
                <table>
                    <thead>
                        <tr>
                            <th
                                className={
                                    mahjongOneColorAppStyle['tile-column']
                                }
                            >
                                Tile
                            </th>
                            <th
                                className={
                                    mahjongOneColorAppStyle['point-column']
                                }
                            >
                                Point
                            </th>
                            <th
                                className={
                                    mahjongOneColorAppStyle['win-point-column']
                                }
                            >
                                Win
                            </th>
                            <th
                                className={
                                    mahjongOneColorAppStyle['roles-column']
                                }
                            >
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
                                            mahjongOneColorAppStyle[
                                                'tile-column'
                                            ]
                                        }
                                    >
                                        {e.tile.getStringPic()}
                                    </td>
                                    <td
                                        className={
                                            mahjongOneColorAppStyle[
                                                'point-column'
                                            ]
                                        }
                                    >
                                        {e.highPointString}
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
                                            mahjongOneColorAppStyle[
                                                'roles-column'
                                            ]
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
            )}
        </div>
    );
};
const HandHistoryInfo = (props: HandHistoryInfoProps) => {
    const [selectedElem, setSelectedElem] = useState(0);
    return (
        <>
            <HandInfo tiles={props.histories[selectedElem].hand}></HandInfo>
            <div className={mahjongOneColorAppStyle['history-info']}>
                <Box>
                    <List component="nav">
                        {props.histories.map((history, index) => {
                            return (
                                <ListItemButton
                                    sx={{
                                        fontSize: 24,
                                        verticalAlign: 'center'
                                    }}
                                    selected={selectedElem == index}
                                    onClick={(e) => setSelectedElem(index)}
                                >
                                    <span
                                        className={`${
                                            history.isCollect
                                                ? mahjongOneColorAppStyle[
                                                      'collect'
                                                  ]
                                                : mahjongOneColorAppStyle[
                                                      'wrong'
                                                  ]
                                        } ${
                                            mahjongOneColorAppStyle[
                                                'history-list-item'
                                            ]
                                        }`}
                                    >
                                        {MahjongHand.toStringPic(history.hand)}
                                    </span>
                                </ListItemButton>
                            );
                        })}
                    </List>
                </Box>
                <RoleInfo
                    winTiles={props.histories[selectedElem].winTiles}
                ></RoleInfo>
            </div>
        </>
    );
};
const InputPanel = (props: InputPanelProps) => {
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
                                    onClick={() =>
                                        props.toggleSelect(
                                            (2 - row) * 3 + column
                                        )
                                    }
                                >
                                    {new Tile(
                                        props.suit,
                                        (2 - row) * 3 + column + 1
                                    ).getStringPic()}
                                </td>
                            ))}
                        </tr>
                    );
                })}
                <tr>
                    <td
                        className={mahjongOneColorAppStyle['enter-button']}
                        colSpan={3}
                    >
                        <Button
                            variant="contained"
                            onClick={props.handleEnter}
                            sx={{ width: '100%', height: '60%' }}
                        >
                            ENTER
                        </Button>
                    </td>
                </tr>
            </table>
        </div>
    );
};

const generateOneColorHand = (numSeries: string, suit: Simples) => {
    const str =
        suit == 'Bamboos'
            ? 's'
            : suit == 'Characters'
            ? 'm'
            : suit == 'Dots'
            ? 'p'
            : suit == 'z';
    return MahjongHand.getHandFromString(numSeries + str);
};

class MahjongRound {
    // <round>本場 ,<wins> <turn>局
    private round: number;
    private wins: FieldWin;
    private turn: number;
    constructor() {
        this.round = 0;
        this.wins = new FieldWin();
        this.turn = 1;
    }
    setRound(round: number) {
        this.round = round;
    }
    setTurn(turn: number) {
        this.turn = turn;
    }
    nextWin() {
        this.wins.nextWin();
    }
    nextRound() {
        this.round++;
    }
    getRound() {
        return this.round;
    }
    getWin() {
        return this.wins.getWin();
    }
    getTurn() {
        return this.turn;
    }
    init() {
        this.round = 0;
        this.wins = new FieldWin();
        this.turn = 1;
    }
}

class FieldWin {
    private win: Wins | 'END';
    constructor() {
        this.win = 'East';
    }
    nextWin() {
        switch (this.win) {
            case 'East':
                this.win = 'South';
                break;
            case 'South':
                this.win = 'West';
                break;
            case 'West':
                this.win = 'North';
                break;
            case 'North':
                this.win = 'END';
        }
    }
    getWin() {
        return this.win;
    }
}

class HalfGame extends MahjongRound {
    progressTurn() {
        this.setRound(0);
        const endWin = this.getTurn() == 4;
        this.setTurn((this.getTurn() % 4) + 1);
        if (endWin) this.nextWin();
    }
    isEndGame() {
        return !(this.getWin() == 'East' || this.getWin() == 'South');
    }
    isAuras() {
        return this.getWin() == 'South' && this.getTurn() == 4;
    }
}
const INITIAL_POINT = 25000;
const INITIAL_CONTEXT: Context = {
    tilePlace: 'Tsumo',
    isConcealed: true,
    winTile: new Tile('Dots', 5),
    prevalentWind: new Tile('East'),
    seatWind: new Tile('East')
};
const INITIAL_HAND: Tile[] = MahjongHand.getHandFromString('1234566677788p');
const INITIAL_FIELD: FieldState = {
    turn: 1,
    round: 0,
    win: 'East',
    isLeader: true,
    isEnd: false
};
const fieldClass = new HalfGame();
const MahjongOneColorApp = () => {
    const [handGenerator, setHandGenerator] =
        useState<OneColorReadyHandGenerator>();
    const [hand, setHand] = useState<Tile[]>(INITIAL_HAND);
    const [context, setContext] = useState<Context>(INITIAL_CONTEXT);
    const [suit, setSuit] = useState<Simples>('Characters');
    const [screenState, setScreenState] = useState<ScreenState>('START');
    const [inputStates, setInputStates] = useState<InputState[]>(
        [...Array(9)].fill('NON SELECTED')
    );
    const [winTiles, setWinTiles] = useState<WinTiles>();
    const [point, setPoint] = useState<number>(INITIAL_POINT);
    const [fieldState, setFieldState] = useState<FieldState>(INITIAL_FIELD);
    const [message, setMessage] = useState<JSX.Element>(<></>);
    const [history, setHistory] = useState<HandHistory>([]);
    const screenStateRef = useRef('');
    const inputStatesRef = useRef(['NO SELECTED']);
    const fieldStateRef = useRef(INITIAL_FIELD);
    const suitRef = useRef('Characters');
    const handGeneratorRef = useRef(new OneColorReadyHandGenerator());
    const handRef = useRef(INITIAL_HAND);
    const contextRef = useRef(INITIAL_CONTEXT);
    const pointRef = useRef(INITIAL_POINT);
    const winTilesRef = useRef({} as WinTiles);
    const messageRef = useRef(<></>);
    const historyRef = useRef([] as HandHistory);
    screenStateRef.current = screenState;
    inputStatesRef.current = inputStates;
    suitRef.current = suit;
    handGeneratorRef.current = handGenerator as OneColorReadyHandGenerator;
    handRef.current = hand as Tile[];
    contextRef.current = context as Context;
    fieldStateRef.current = fieldState;
    pointRef.current = point;
    winTilesRef.current = winTiles as WinTiles;
    messageRef.current = message;
    historyRef.current = history;
    const submitAnswer = () => {
        const answerNumbers = MahjongHand.getValidTiles(
            handRef.current ?? []
        ).map((e) => e.getNumber() - 1);
        const newInputStates: InputState[] = inputStatesRef.current
            .concat()
            .map((v, i) => {
                if (answerNumbers.includes(i) && v == 'SELECTED')
                    return 'COLLECT';
                else if (answerNumbers.includes(i) && v == 'NON SELECTED')
                    return 'OMISSION';
                else if (!answerNumbers.includes(i) && v == 'SELECTED')
                    return 'WRONG';
                else return '';
            });
        setInputStates(newInputStates);
        const isCollect = newInputStates.every((e) =>
            ['', 'COLLECT'].includes(e)
        );
        const addPoint = winTilesRef.current.sort(
            (a, b) => b.point - a.point
        )[0].point;

        setMessage(
            isCollect ? <>GOOD! ^^ +{addPoint} Point</> : <>{'WRONG! ><'}</>
        );
        setScreenState('SUBMIT');
    };
    const resetHand = () => {
        setInputStates([...Array(9)].fill('NON SELECTED'));
        const newHand = generateOneColorHand(
            handGeneratorRef.current?.getRandomOne() ?? '1112345678999',
            suitRef.current as Simples
        );
        setHand(newHand);
    };
    useEffect(() => {
        setWinTiles(
            MahjongHand.getValidTilesWithYaku(handRef.current, {
                ...contextRef.current,
                isLeader: fieldStateRef.current.isLeader
            })
        );
    }, [handRef.current, fieldStateRef.current]);
    useEffect(() => {
        resetHand();
    }, [historyRef.current]);

    useEffect(() => {
        setHand((prev) =>
            prev.map(
                (e) => new Tile(suitRef.current as SuitType, e.getNumber())
            )
        );
    }, [suitRef.current]);
    useEffect(() => {
        const initialize = async () => {
            document.addEventListener('keydown', handleKeyDown);
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
            const hand = generateOneColorHand(
                oneColorReadyHandGenerator.getRandomOne(),
                suitRef.current as Simples
            );
            setHand(hand);
            setWinTiles(
                MahjongHand.getValidTilesWithYaku(hand, {
                    ...contextRef.current,
                    isLeader: fieldClass.getTurn() == 1
                })
            );
            await MahjongHand.importMap();
        };
        initialize();
    }, []);

    const updateField = (field: HalfGame) => {
        setFieldState({
            turn: field.getTurn(),
            round: field.getRound(),
            win: field.getWin(),
            isLeader: field.getTurn() == 1,
            isEnd: field.isEndGame()
        });
    };

    const handleEnter = () => {
        switch (screenStateRef.current) {
            case 'SUBMIT':
                const isCollect = inputStatesRef.current.every((e) =>
                    ['', 'COLLECT'].includes(e)
                );
                if (isCollect) {
                    if (fieldStateRef.current.isLeader) fieldClass.nextRound();
                    else fieldClass.progressTurn();
                    const addPoint = winTilesRef.current.sort(
                        (a, b) => b.point - a.point
                    )[0].point;
                    setPoint((prev) => {
                        return prev + addPoint;
                    });
                } else {
                    fieldClass.progressTurn();
                }
                setHistory((prev) => [
                    ...prev,
                    {
                        winTiles: winTilesRef.current,
                        isCollect: isCollect,
                        hand: handRef.current
                    }
                ]);
                if (fieldClass.isEndGame()) {
                    setScreenState('FINISH');
                } else {
                    setScreenState('QUEST');
                }
                break;
            case 'START':
                setScreenState('QUEST');
                break;
            case 'FINISH':
                setScreenState('QUEST');
                setPoint(INITIAL_POINT);
                setHistory([]);
                fieldClass.init();
                resetHand();
                break;
            default:
                setScreenState('QUEST');
                submitAnswer();
                break;
        }
        updateField(fieldClass);
    };
    const toggleSelect = (num: number) => {
        if (screenStateRef.current != 'QUEST') return;
        const newInputStates = inputStatesRef.current;
        newInputStates[num] =
            'SELECTED' == newInputStates[num] ? 'NON SELECTED' : 'SELECTED';
        setInputStates([...newInputStates] as InputState[]);
    };
    const handleKeyDown = (event: KeyboardEvent) => {
        switch (event.code) {
            case 'Digit1':
                toggleSelect(0);
                break;
            case 'Digit2':
                toggleSelect(1);
                break;
            case 'Digit3':
                toggleSelect(2);
                break;
            case 'Digit4':
                toggleSelect(3);
                break;
            case 'Digit5':
                toggleSelect(4);
                break;
            case 'Digit6':
                toggleSelect(5);
                break;
            case 'Digit7':
                toggleSelect(6);
                break;
            case 'Digit8':
                toggleSelect(7);
                break;
            case 'Digit9':
                toggleSelect(8);
                break;
            case 'Enter':
                handleEnter();
                break;
            default:
                break;
        }
    };
    const makeScreen = (screenState: ScreenState): JSX.Element => {
        switch (screenState) {
            case 'FINISH':
                return (
                    <>
                        <div className={mahjongOneColorAppStyle['page-top']}>
                            <PlayerInfo
                                fieldWind={fieldStateRef.current.win}
                                gameNo={fieldStateRef.current.turn}
                                roundNo={fieldStateRef.current.round}
                                point={pointRef.current}
                                isLeader={fieldStateRef.current.isLeader}
                                isEnd={fieldStateRef.current.isEnd}
                                suit={suitRef.current as SuitType}
                                setSuit={setSuit}
                                handleEnter={handleEnter}
                            />
                        </div>

                        <HandHistoryInfo histories={historyRef.current} />
                    </>
                );
            case 'QUEST':
                return (
                    <>
                        <div className={mahjongOneColorAppStyle['page-top']}>
                            <PlayerInfo
                                fieldWind={fieldStateRef.current.win}
                                gameNo={fieldStateRef.current.turn}
                                roundNo={fieldStateRef.current.round}
                                point={pointRef.current}
                                isLeader={fieldStateRef.current.isLeader}
                                isEnd={fieldStateRef.current.isEnd}
                                suit={suitRef.current as SuitType}
                                setSuit={setSuit}
                                handleEnter={handleEnter}
                            />
                            {handRef.current && (
                                <HandInfo tiles={handRef.current} />
                            )}
                            <MessageZone
                                hidden={true}
                                messageComponent={messageRef.current}
                            />
                        </div>
                        <div className={mahjongOneColorAppStyle['page-bottom']}>
                            {handRef.current && context && (
                                <RoleInfo
                                    winTiles={winTilesRef.current}
                                    hidden={true}
                                />
                            )}
                            <InputPanel
                                setInputStates={setInputStates}
                                inputStates={inputStates}
                                screenState={screenState}
                                handleEnter={handleEnter}
                                setInputStatus={setInputStates}
                                toggleSelect={toggleSelect}
                                suit={suitRef.current as SuitType}
                            />
                        </div>
                    </>
                );
            case 'START':
                return (
                    <div className={mahjongOneColorAppStyle['start-message']}>
                        <Button
                            variant="contained"
                            onClick={handleEnter}
                            sx={{
                                width: '100%',
                                height: '60%',
                                fontSize: '20px'
                            }}
                        >
                            START
                        </Button>
                    </div>
                );
            case 'SUBMIT':
                return (
                    <>
                        <div className={mahjongOneColorAppStyle['page-top']}>
                            <PlayerInfo
                                fieldWind={fieldStateRef.current.win}
                                gameNo={fieldStateRef.current.turn}
                                roundNo={fieldStateRef.current.round}
                                point={pointRef.current}
                                isLeader={fieldStateRef.current.isLeader}
                                isEnd={fieldStateRef.current.isEnd}
                                suit={suitRef.current as SuitType}
                                setSuit={setSuit}
                                handleEnter={handleEnter}
                            />
                            {handRef.current && (
                                <HandInfo tiles={handRef.current} />
                            )}
                            <MessageZone
                                hidden={false}
                                messageComponent={messageRef.current}
                            />
                        </div>
                        <div className={mahjongOneColorAppStyle['page-bottom']}>
                            {handRef.current && context && (
                                <RoleInfo winTiles={winTilesRef.current} />
                            )}
                            <InputPanel
                                setInputStates={setInputStates}
                                inputStates={inputStates}
                                screenState={screenState}
                                handleEnter={handleEnter}
                                setInputStatus={setInputStates}
                                toggleSelect={toggleSelect}
                                suit={suitRef.current as SuitType}
                            />
                        </div>
                    </>
                );
            default:
                return <></>;
        }
    };
    return makeScreen(screenState);
};

const Page = () => {
    return <MahjongOneColorApp />;
};

export default Page;
