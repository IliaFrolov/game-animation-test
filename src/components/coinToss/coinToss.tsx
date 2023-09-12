import React, { useState, useEffect } from "react";
import CoinToss, {
  EventEmit,
  BetResultEvent,
  GameResultEvent,
} from "../../contract/coinToss.ts";
import BetForm from "../../components/betForm/betForm.tsx";
import GameAnimation from "../../components/gameAnimation/gameAnimation.tsx";
import GameHistory from "../../components/gameHistory/gameHistory.tsx";
import BetHistory from "../../components/betHistory/betHistory.tsx";
import { GameAnimationState } from "../../components/types.ts";
import "./coinTossStyles.scss";

export default function CoinTossUx({}) {
  const [game, setGame] = useState();
  const [coinsNumber, setCoinsNumber] = useState(1);
  const coinsArr = new Array(coinsNumber).fill("");

  const [gameAnimationState, setGameAnimationState] = useState(
    GameAnimationState.LOADING
  );
  const [lastGameResultEvent, setLastGameResultEvent] = useState(null);
  const [gameHistory, setGameHistory] = useState([]);
  const [betHistory, setBetHistory] = useState([]);

  useEffect(() => {
    const ready = () =>
      setTimeout(() => {
        setGameAnimationState(GameAnimationState.IDLE);
      }, 1000);
    ready();
    // return clearTimeout(ready());
  }, []);
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
      <div className="">
        {GameAnimationState[gameAnimationState].toString()}
      </div>
      <div className="">
        <span>{`Result: `}</span>
        {lastGameResultEvent?.simulationResult.map((r) => `${r},`)}
      </div>
      <div className="coinsWrapper">
        {coinsArr.map((el, idx) => {
          return (
            <GameAnimation
              key={el + idx}
              gameState={gameAnimationState}
              coinResult={lastGameResultEvent?.simulationResult?.[idx]}
            />
          );
        })}
      </div>
      {gameAnimationState !== GameAnimationState.LOADING && (
        <>
          <BetForm
            game={game}
            coinsNumber={coinsNumber}
            setCoinsNumber={setCoinsNumber}
            triggerAwaitingState={triggerAwaitingState}
            gameAvailable={gameAnimationState === GameAnimationState.IDLE}
          />
          <GameHistory gameHistory={gameHistory} />
          <BetHistory betHistory={betHistory} />
        </>
      )}
    </div>
  );
}
