import React, { useState, useMemo } from "react";
import Input, { Info, PlayButton, RangeInput } from "../input/input.tsx";
import "./betFromStyles.scss";

const BetForm = ({ game, triggerAwaitingState }) => {
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
    <div className="form">
      {/* <div className="">
        <h2>Bet Form</h2>
      </div> */}

      <div className="">
        {/* <label>Wager</label> */}
        <Input
          valuePrefix="$"
          label="Wager"
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
        ></Input>
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

      <RangeInput
        label="Number of Coins"
        id="numberOfCoins"
        name="numberOfCoins"
        min="1"
        max="10"
        step="1"
        placeholder="1"
        value={numberOfCoins}
        onChange={updateNumberOfCoins}
      ></RangeInput>
      <RangeInput
        disabled={numberOfCoins <= 1}
        label="Number Correct"
        id="numberCorrect"
        name="numberCorrect"
        min="1"
        max={numberOfCoins}
        step="1"
        placeholder="1"
        value={numberCorrect}
        onChange={updateNumberCorrect}
      ></RangeInput>

      {validBet ? (
        <>
          <Info
            value={`${multiplier.toFixed(2)} (${(probability * 100).toFixed(
              2
            )}%)`}
            label="Multiplier"
          />
          <Info label="Potential Payout" value={potentialPayout.toFixed(2)} />
        </>
      ) : (
        <Info label="Invalid bet" value={invalidReason} />
      )}

      <PlayButton onClick={validBet ? placeBet : () => {}} disabled={!validBet}>
        Place Bet
      </PlayButton>
    </div>
  );
};
export default BetForm;
