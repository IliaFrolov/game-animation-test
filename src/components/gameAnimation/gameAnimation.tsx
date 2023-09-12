import React, { useEffect, useRef } from "react";
import { GameAnimationState } from "../types.ts";
import "./gameAnimationStyles.scss";
import "../commonStyles.scss";

export default function GameAnimation({ gameState, coinResult }) {
  const isLoadingState = gameState === GameAnimationState.LOADING;
  const isErrorState = gameState === GameAnimationState.ERROR;
  const isIdleState = gameState === GameAnimationState.IDLE;
  const isAwaitingState = gameState === GameAnimationState.AWAITING;
  const isResultingState = gameState === GameAnimationState.RESULTING;
  const isResultState = gameState === GameAnimationState.RESULT;
  const isTailResult = isResultState && coinResult?.toString() === "0";
  const isHeadResult = isResultState && coinResult?.toString() === "1";

  const coinRef = useRef<HTMLInputElement | null>(null);
  const coinEL = coinRef.current;
  const currentAnimationRef = useRef<Animation | null>(null);

  useEffect(() => {
    const animate = (keyframes, iterations, fromPrev = false) => {
      if (coinEL) {
        currentAnimationRef?.current?.pause();
        let transformStart = getComputedStyle(coinEL).transform;

        currentAnimationRef?.current?.cancel();
        currentAnimationRef.current = coinEL.animate(
          [fromPrev ? { transform: transformStart } : null, ...keyframes],
          {
            duration: 1000,
            easing: "linear",
            fill: "forwards",
            iterations: iterations,
          }
        );
      }
    };

    if (isErrorState) {
    }
    if (isLoadingState) {
      animate([{ opacity: 0 }], Infinity);
    }
    if (isIdleState) {
      animate([{ transform: "rotateY(360deg)" }], 1);
    }
    if (isAwaitingState) {
      animate([{ transform: "rotateY(360deg)" }], Infinity);
    }
    if (isResultingState) {
      currentAnimationRef.current?.updatePlaybackRate(0.5);
    }
    if (isTailResult) {
      animate([{ transform: `rotateY(${180 * 2}deg)` }], 1, true);
    }
    if (isHeadResult) {
      animate([{ transform: `rotateY(${180 * 3}deg)` }], 1, true);
    }
  }, [
    isErrorState,
    isIdleState,
    isLoadingState,
    isTailResult,
    isResultingState,
    isHeadResult,
    isAwaitingState,
    coinEL,
  ]);

  return (
    <div className="coinAnimation">
      {/* <div className="">
        <h2>Game Animation</h2>
      </div> */}
      <div ref={coinRef} className="coin">
        <div className="tails">0</div>
        <div className="heads">1</div>
      </div>
      {/* <div className="">{GameAnimationState[gameState].toString()}</div> */}
      {/* <div className="">{resultString}</div>  */}
    </div>
  );
}
