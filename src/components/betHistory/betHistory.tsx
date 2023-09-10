import React from "react";

export default function BetHistory({ betHistory }) {
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
