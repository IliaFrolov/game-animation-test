import React, {
  useState,
  useMemo,
  useEffect,
  isValidElement,
  useRef,
  useLayoutEffect,
} from "react";
import CoinToss, {
  EventEmit,
  BetResultEvent,
  GameResultEvent,
} from "../contract/coinToss.ts";
import "./styles.css";
export enum GameAnimationState {
  IDLE = 0,
  AWAITING = 1,
  RESULTING = 2,
  RESULT = 3,
  ERROR = 4,
  LOADING = 5,
}
function useTraceUpdate(props) {
  const prev = useRef(props);
  useEffect(() => {
    const changedProps = Object.entries(props).reduce((ps, [k, v]) => {
      if (prev.current[k] !== v) {
        ps[k] = [prev.current[k], v];
      }
      return ps;
    }, {});
    if (Object.keys(changedProps).length > 0) {
      console.log("Changed props:", changedProps);
    }
    prev.current = props;
  });
}
export default function CoinTossUx({}) {
  const [game, setGame] = useState();
  const [gameAnimationState, setGameAnimationState] = useState(
    GameAnimationState.IDLE
  );
  const [lastGameResultEvent, setLastGameResultEvent] = useState(null);
  const [gameHistory, setGameHistory] = useState([]);
  const [betHistory, setBetHistory] = useState([]);

  const triggerAwaitingState = () => {
    setGameAnimationState(GameAnimationState.AWAITING);
  };

  const triggerResultingState = async (gameResultEvent) => {
    setGameAnimationState(GameAnimationState.RESULTING);
    setLastGameResultEvent(gameResultEvent);
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Pretend resulting transition animation takes 1 second
    setGameAnimationState(GameAnimationState.RESULT);
    await new Promise((resolve) => setTimeout(resolve, 3000)); // Pretend result is displayed for  3 seconds
    setGameAnimationState(GameAnimationState.IDLE);
  };

  const callbackHandler = (event: EventEmit) => {
    if (event.eventType == "GameResult") {
      console.log("GameResult received:");
      console.log(event.eventObject);
      triggerResultingState(event.eventObject);
      addToGameHistory(event.eventObject);
    } else if (event.eventType == "BetResult") {
      console.log("BetResult received:");
      console.log(event.eventObject);
      addToBetHistory(event.eventObject);
    } else {
      console.log("Unknown EventEmit received:");
      console.log(event);
    }
  };

  useEffect(() => {
    const g = new CoinToss();
    g.subscribeToGameEvents(callbackHandler);
    setGame(g);
  }, []);

  const addToBetHistory = (betResultEvent: BetResultEvent) => {
    const bh = betHistory;
    bh.push(betResultEvent);
    setBetHistory(bh);
  };

  const addToGameHistory = (gameResultEvent: GameResultEvent) => {
    const gh = gameHistory;
    gh.push(gameResultEvent);
    setGameHistory(gh);
  };

  return (
    <div className="game">
      <div className="">
        <h1>Coin Toss</h1>
      </div>

      <BetForm game={game} triggerAwaitingState={triggerAwaitingState} />
      <GameAnimation
        gameState={gameAnimationState}
        gameResult={lastGameResultEvent}
      />
      <GameHistory gameHistory={gameHistory} />
      <BetHistory betHistory={betHistory} />
    </div>
  );
}

function GameAnimation({ gameState, gameResult }) {
  //   console.log({ gameState });
  useTraceUpdate({ gameState, gameResult });
  const isIdleState = gameState === GameAnimationState.IDLE;
  const isAwaitingState =
    gameState === GameAnimationState.AWAITING ||
    gameState === GameAnimationState.RESULTING;
  const isResultingState = gameState === GameAnimationState.RESULTING;

  const isResultState = gameState === GameAnimationState.RESULT;

  const isTailResult =
    isResultState && gameResult.simulationResult.toString() === "0";
  const isHeadResult =
    isResultState && gameResult.simulationResult.toString() === "1";
  const resultString = isResultState && gameResult.simulationResult.toString();
  const coinRef = useRef<HTMLInputElement | null>(null);
  //   useLayoutEffect
  useEffect(() => {
    const oneTurnRotation = [{ transform: `rotateY(180deg)` }];
    const makeRotation = (turns = 0) => [
      { transform: `rotateY(${turns * 180}deg)` },
    ];
    const makeTimer = (
      turns = 0,
      delay = 0,
      easing = "linear",
      composite = "replace"
    ) => ({
      duration: turns * 500,
      iterations: 1,
      fill: "forwards" as FillMode,
      composite: composite as CompositeOperation,
      delay: delay,
    });

    const coinAwaiting = {
      duration: 500,
      iterations: Infinity,
    };

    if (coinRef?.current) {
      const anims = coinRef.current.getAnimations();
      console.log({ anims });
      const lastAnim = anims[anims.length - 1];
      const initialAnim = !Boolean(anims.length);

      const awaitAnimName = "awaitAnim";
      const awaitAnim = anims.find((a) => a.id === awaitAnimName);
      //   console.log({ initialAnim });
      //   const infiniteAnim = () => {
      //     coinRef.current
      //       ?.animate(makeRotation(1), makeTimer(1, 0))
      //       .finished.then(() => {
      //         isAwaitingState && infiniteAnim();
      //       });
      //   };
      if (isIdleState) {
        console.count("isIdleState");

        if (!initialAnim) {
          anims.forEach((anim) => anim.cancel());
        }
        const idleAnim = anims.find((a) => a.id === "Idle");
        if (!idleAnim) {
          coinRef.current.animate(makeRotation(3), makeTimer(3));
          if (lastAnim) {
            lastAnim.id = "Idle";
          }
          // .finished.then(() => {
          //   lastAnim.id = "Idle";
          // });
        }
        // lastAnim.id = "Idle";
      }
      if (isAwaitingState && !awaitAnim) {
        console.count("isAwaitingState");
        coinRef.current?.animate(oneTurnRotation, coinAwaiting);
        lastAnim.id = awaitAnimName;
      }
      if (isResultingState) {
        // const anim = async () => {
        //   await coinRef.current?.animate(makeRotation(5), makeTimer(5, 0));
        // };
        // anim();
        // coinRef.current?.animate(makeRotation(5), makeTimer(5, 0));
        const awaitAnim = anims.find((a) => a.id === "awaitAnim");
        console.log({ awaitAnim });

        awaitAnim?.updatePlaybackRate(0.5);
        // lastAnim.updatePlaybackRate(0.5);
      }
      //   if (isResultState) {
      //     lastAnim.cancel();
      //   }
      if (isTailResult) {
        // const anim = async () => {
        //   await coinRef.current.animate(
        //     makeRotation(2),
        //     makeTimer(4, 0, "linear")
        //   );
        //   //   lastAnim.finish();
        // };
        // anim();
        coinRef.current.animate(
          makeRotation(2),
          makeTimer(6, 0, "linear", "add")
        );
        lastAnim.id = "TailResult";
        // lastAnim.cancel();
      }
      if (isHeadResult) {
        // const anim = async () => {
        //   await coinRef.current.animate(
        //     makeRotation(1),
        //     makeTimer(2, 0, "linear")
        //   );
        //   //   lastAnim.finish();
        // };
        // anim();
        coinRef.current.animate(
          makeRotation(1),
          makeTimer(3, 0, "linear", "add")
        );
        lastAnim.id = "HeadResult";
        // lastAnim.cancel();
        // lastAnim.commitStyles();
      }
    }
  }, [
    isAwaitingState,
    isHeadResult,
    isIdleState,
    isResultState,
    isResultingState,
    isTailResult,
  ]);

  return (
    <div className="">
      <div className="">
        <h2>Game Animation</h2>
      </div>
      <div ref={coinRef} className="coin">
        <div className="tails">0</div>
        <div className="heads">1</div>
      </div>
      <div className="">{GameAnimationState[gameState].toString()}</div>
      <div className="">{resultString}</div>
    </div>
  );
}

function GameHistory({ gameHistory }) {
  return (
    <div className="">
      <div className="">
        <h2>Game History</h2>
      </div>
      {gameHistory.length == 0 ? (
        <div className="">NONE</div>
      ) : (
        gameHistory.toReversed().map((gh) => (
          <div className="" key={gh.gameId}>
            {gh.gameId} : {gh.timestamp} = {gh.simulationResult.toString()}
          </div>
        ))
      )}
    </div>
  );
}

function BetHistory({ betHistory }) {
  return (
    <div className="">
      <div className="">
        <h2>Bet History</h2>
      </div>
      {betHistory.length == 0 ? (
        <div className="">NONE</div>
      ) : (
        betHistory.toReversed().map((bh) => (
          <div className="" key={bh.betId}>
            {bh.betId} ({bh.gameId}): {bh.timestamp} = {bh.wager} | {bh.payout}
          </div>
        ))
      )}
    </div>
  );
}

function BetForm({ game, triggerAwaitingState }) {
  const [wager, setWager] = useState(1);
  const [side, setSide] = useState(0);
  const [numberOfCoins, setNumberOfCoins] = useState(1);
  const [numberCorrect, setNumberCorrect] = useState(1);
  const [probability, setProbability] = useState(0);
  const [multiplier, setMultiplier] = useState(0);
  const [potentialPayout, setPotentialPayout] = useState(0);
  const [validBet, setValidBet] = useState(false);
  const [invalidReason, setInvalidReason] = useState(null);

  const placeBet = async () => {
    game.placeBet(
      1234, // userId: ,
      wager, // wager: number,
      side, // side: Side,
      numberOfCoins, // numberOfCoins: number,
      numberCorrect // numberCorrect: number
    );
    triggerAwaitingState();
  };

  useMemo(() => {
    if (game) {
      if (numberOfCoins > game.maxNumberOfCoins) {
        setProbability(0);
        setMultiplier(1);
        setPotentialPayout(0);
        setValidBet(false);
        setInvalidReason(
          `Number of Coins (${numberOfCoins}) exceeds the game maximum (${game.maxNumberOfCoins})`
        );
      } else if (wager > game.maxWager) {
        setProbability(0);
        setMultiplier(1);
        setPotentialPayout(0);
        setValidBet(false);
        setInvalidReason(`Wager (${wager}) excced max of ${game.maxWager}`);
      } else if (numberOfCoins < numberCorrect) {
        setProbability(0);
        setMultiplier(1);
        setPotentialPayout(0);
        setValidBet(false);
        setInvalidReason(
          `Number Correct (${numberCorrect}) must be <= Number of Coins (${numberOfCoins})`
        );
      } else {
        const p = game.getProbability(numberOfCoins, numberCorrect);
        const m = game.getMultiplier(numberOfCoins, numberCorrect);
        const po = wager * m;
        setProbability(p);
        setMultiplier(m);
        setPotentialPayout(po);
        setValidBet(true);
        setInvalidReason(null);
      }
    }
  }, [wager, game, numberOfCoins, numberCorrect]);

  const updateWager = (event) => {
    const target = event.target;
    const value = target.value;
    setWager(Number(value));
  };

  const updateNumberCorrect = (event) => {
    const target = event.target;
    const value = target.value;
    setNumberCorrect(Number(value));
  };

  const updateNumberOfCoins = (event) => {
    const target = event.target;
    const value = target.value;
    setNumberOfCoins(Number(value));
  };

  const updateSide = (event) => {
    const target = event.target;
    const value = target.checked;
    setSide(value ? 0 : 1);
  };

  return (
    <div className="">
      <div className="">
        <h2>Bet Form</h2>
      </div>

      <div className="">
        <label>Wager</label>
        <input
          className=""
          id="wager"
          name="wager"
          type="number"
          min="1"
          max="10"
          step="1"
          placeholder="1"
          value={wager}
          onChange={updateWager}
        ></input>
      </div>

      <div className="">
        <label>Side (is heads)</label>
        <input
          className=""
          id="isHeads"
          name="isHeads"
          type="checkbox"
          placeholder="true"
          checked={side === 0}
          onChange={updateSide}
        ></input>
      </div>

      <div className="">
        <label>Number of Coins</label>
        <input
          className=""
          id="numberOfCoins"
          name="numberOfCoins"
          type="number"
          min="1"
          max="10"
          step="1"
          placeholder="1"
          value={numberOfCoins}
          onChange={updateNumberOfCoins}
        ></input>
      </div>

      <div className="">
        <label>Number Correct</label>
        <input
          className=""
          id="numberCorrect"
          name="numberCorrect"
          type="number"
          min="1"
          max="10"
          step="1"
          placeholder="1"
          value={numberCorrect}
          onChange={updateNumberCorrect}
        ></input>
      </div>

      {validBet ? (
        <>
          <div className="">
            <label>Multiplier:</label>
            <span className="">
              {multiplier.toFixed(2)} ({(probability * 100).toFixed(2)}%)
            </span>
          </div>

          <div className="">
            <label>Potential Payout:</label>
            <span className="">{potentialPayout.toFixed(2)}</span>
          </div>
        </>
      ) : (
        <div className="">Invalid bet: {invalidReason}</div>
      )}

      <div className="">
        <input
          type="button"
          value="Place Bet"
          onClick={validBet ? placeBet : () => {}}
          disabled={!validBet}
        ></input>
      </div>
    </div>
  );
}
