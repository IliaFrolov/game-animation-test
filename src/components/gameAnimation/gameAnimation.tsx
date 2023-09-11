import React, { useEffect, useRef } from "react";
import { GameAnimationState } from "../types.ts";
import "./gameAnimationStyles.scss";
import "../commonStyles.scss";

export default function GameAnimation({ gameState, gameResult }) {
  //   console.log({ gameState });

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
  const coinSide1 = coinRef?.current?.children[0];
  const coinSide2 = coinRef?.current?.children[1];

  //   useLayoutEffect
  useEffect(() => {
    const oneTurnRotation = [{ transform: `rotateY(180deg)` }];
    const coinAwaiting = {
      duration: 500,
      iterations: Infinity,
    };
    const makeRotationColor = (color) => [
      // {
      //   background: color,
      // },
      {
        backgroundColor: "#000",
      },
    ];
    const makeRotation = (turns = 0) => [
      {
        transform: `rotateY(${turns * 180}deg)`,
      },
    ];

    const makeTimer = (
      turns = 0,
      endDelay = 0,
      easing = "linear",
      composite = "replace"
    ) => ({
      duration: turns * 500,
      iterations: 1,
      fill: "forwards" as FillMode,
      composite: composite as CompositeOperation,
      endDelay: endDelay,
    });

    if (coinRef?.current) {
      const anims = coinRef.current.getAnimations();
      console.log({ anims });
      const lastAnim = anims[anims.length - 1];
      const initialAnim = !Boolean(anims.length);

      const awaitAnimName = "awaitAnim";
      const awaitAnim = anims.find((a) => a.id === awaitAnimName);

      if (isIdleState) {
        console.count("isIdleState");

        if (!initialAnim) {
          anims.forEach((anim) => anim.cancel());
        }
        const idleAnim = anims.find((a) => a.id === "Idle");
        if (!idleAnim) {
          const timer = makeTimer(3);
          coinRef.current.animate(makeRotation(3), timer);
          // coinSide1?.animate(makeRotationColor(), timer);
          // coinSide2?.animate(makeRotationColor(), timer);

          if (lastAnim) {
            lastAnim.id = "Idle";
          }
        }
      }
      if (isAwaitingState && !awaitAnim) {
        lastAnim.cancel();
        console.count("isAwaitingState");
        coinRef.current?.animate(oneTurnRotation, coinAwaiting);
        lastAnim.id = awaitAnimName;
      }
      if (isResultingState) {
        console.count("isResultingState");
        awaitAnim?.updatePlaybackRate(0.3);
      }
      // if (isResultState) {
      //   lastAnim.cancel();
      // }
      if (isTailResult) {
        console.count("isTailResult");

        coinRef.current.animate(makeRotation(2), makeTimer(4, 4000, "linear"));
      }
      if (isHeadResult) {
        console.count("isHeadResult");
        coinRef.current.animate(makeRotation(1), makeTimer(2, 4000, "linear"));
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
    <div className="coinAnimation">
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
