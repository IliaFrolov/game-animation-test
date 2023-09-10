import { useEffect, useRef } from "react";
import { GameAnimationState } from "../types.ts";
import "./gameAnimationStyles.scss";

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
  //   useLayoutEffect
  useEffect(() => {
    const oneTurnRotation = [{ transform: `rotateY(180deg)` }];
    const coinAwaiting = {
      duration: 500,
      iterations: Infinity,
    };

    const makeRotation = (turns = 0) => [
      { transform: `rotateY(${turns * 180}deg)` },
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
        lastAnim.cancel();
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
        // const awaitAnim = anims.find((a) => a.id === "awaitAnim");
        console.count("isResultingState");

        console.log({ awaitAnim });

        awaitAnim?.updatePlaybackRate(0.3);
        // lastAnim.updatePlaybackRate(0.5);
      }
      if (isResultState) {
        lastAnim.cancel();
      }
      if (isTailResult) {
        // const anim = async () => {
        //   await coinRef.current.animate(
        //     makeRotation(2),
        //     makeTimer(4, 0, "linear")
        //   );
        //   //   lastAnim.finish();
        // };
        // anim();
        console.count("isTailResult");

        coinRef.current.animate(
          makeRotation(2),
          makeTimer(4, 3000, "linear", "add")
        );
        // lastAnim.id = "TailResult";
        // awaitAnim?.finish();
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
        console.count("isHeadResult");
        coinRef.current.animate(
          makeRotation(1),
          makeTimer(2, 3000, "linear", "add")
        );

        // lastAnim.id = "HeadResult";
        // awaitAnim?.finish();
        // awaitAnim?.commitStyles();
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
