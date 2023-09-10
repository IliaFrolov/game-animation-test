import React from "react";

export default function GameHistory({ gameHistory }) {
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
