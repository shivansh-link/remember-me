const Card = ({ card, handleChoice, flipped, disabled, level, finished }) => {
  const handleClick = () => {
    if (!disabled && !flipped && !finished) handleChoice(card);
  };

  return (
    <article className="card">
      <div className={`${flipped && "flipped"}`}>
        <img src={card.src} className="card__front" alt="card front" />
        <div
          className={`card__back card__back--${level}`}
          onClick={handleClick}
        />
      </div>
    </article>
  );
};

export default Card;
