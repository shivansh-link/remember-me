import { useState, useEffect, useRef } from "react";
import Card from "../../components/Card";
import Link from "next/link";
import Head from "next/head";
import FinishModal from "../../components/FinishModal";

import { usePointsContext } from "../../context/context";

const cardImages = [
  { src: "/static/icons/bitcoin.png", matched: false },
  { src: "/static/icons/ethereum.png", matched: false },
  { src: "/static/icons/cardano.png", matched: false },
  { src: "/static/icons/xrp.png", matched: false },
  { src: "/static/icons/bnb.png", matched: false },
  { src: "/static/icons/stellar.png", matched: false },
  { src: "/static/icons/solana.png", matched: false },
  { src: "/static/icons/polkadot.png", matched: false },
];

const MediumMode = () => {
  const [cards, setCards] = useState([]);
  const [choiceOne, setChoiceOne] = useState(null);
  const [choiceTwo, setChoiceTwo] = useState(null);
  const [disabled, setDisabled] = useState(false);
  const [countdown, setCountdown] = useState(75);
  const [isCountdownOn, setIsCountdownOn] = useState(false);
  const [isGameFinished, setIsGameFinished] = useState(false);
  const [cardLeft, setCardLeft] = useState(true);
  const countdownRef = useRef();
  const countdownTimerRef = useRef();
  const cardsRef = useRef();

  useEffect(() => {
    // Check if choices match
    if (choiceOne && choiceTwo) {
      setDisabled(true);

      if (choiceOne.src === choiceTwo.src) {
        setCards((prev) => {
          return prev.map((card) => {
            if (card.src === choiceOne.src) {
              return { ...card, matched: true };
            } else {
              return card;
            }
          });
        });
        resetTurn();
      } else {
        setTimeout(resetTurn, 1000);
      }
    }
  }, [choiceOne, choiceTwo]);


  useEffect(() => {
    shuffleCards();
    setIsCountdownOn(true);
  }, []);

  useEffect(() => {
    // Set up countdown
    if (isCountdownOn) {
      countdownTimerRef.current = setInterval(checkCountdown, 1000);
    }

    return () => clearInterval(countdownTimerRef.current);
  }, [isCountdownOn]);

  useEffect(() => {
    countdownRef.current = countdown;
  }, [countdown]);

  useEffect(() => {
    cardsRef.current = cards;

    // At every move, check if the game is successfully completed
    const checkCardLeft = cards.map((card) => card.matched).includes(false);

    if (!checkCardLeft && cards.length !== 0) {
      updatePoints((prev) => prev + 10);
      finishGame();
    }
  }, [cards]);

  const { updatePoints } = usePointsContext();

  const resetTurn = () => {
    setChoiceOne(null);
    setChoiceTwo(null);
    setDisabled(false);
  };

  const finishGame = () => {
    setIsCountdownOn(false);
    setIsGameFinished(true);

    const checkCardLeft = cardsRef.current
      .map((card) => card.matched)
      .includes(false);

    // Check if all cards are matched
    if (!checkCardLeft) {
      setCardLeft(false);
    }
  };

  return (
    <>
    <Head>
    <title>Remember Me < /title>
      < /Head>
  { isGameFinished && <FinishModal gameFailed={ cardLeft } pointGain = { 10} />}
  {
    cards && (
      <section className="card-grid--medium" >
      {
        cards.map((card) => (
          <Card
              key= { card.id }
              card = { card }
              handleChoice = { handleChoice }
              flipped = { card === choiceOne || card === choiceTwo || card.matched}
    disabled = { disabled }
    level = { "medium"}
    finished = { isGameFinished }
      />
          ))}
</section>
      )}
</>
  );
};

export default MediumMode;
