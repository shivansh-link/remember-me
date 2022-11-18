import Link from "next/link";

import { useState } from "react";

const Anchor = ({ destination, img, level, pairNo, reward }) => {
  const [flipped, setFlipped] = useState(false);

  const handleEnter = () => {
    if (!flipped) setFlipped(true);
  };

  const handleLeave = () => {
    if (flipped) setFlipped(false);
  };

  return (
    <Link href={destination}>
      <a
        className="anchor"
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
      >
        <div className={`${flipped && "anchor--flipped"}`}>
          <div className="anchor__front">
            <h3 className="anchor__level">{level}</h3>
            <p className="anchor__pair-number">{pairNo} Pairs of Cards</p>
            <p className="anchor__reward">Reward: {reward} Game Points</p>
          </div>
          <img src={img} alt="game mode image" className="anchor__back" />
        </div>
      </a>
    </Link>
  );
};

export default Anchor;
