import Link from "next/link";

const FinishModal = ({ gameFailed, pointGain }) => {
  return (
    <div className="modal-overlay">
      <div className="modal">
        {gameFailed ? (
          <p className="modal__result">You lost the game</p>
        ) : (
          <>
            <p className="modal__result">You won!</p>
            <p className="modal__reward">
              You have earned <span>{pointGain}</span> Game Points!
            </p>
          </>
        )}

        <Link href="/">
          <a className="modal__link">Back to menu</a>
        </Link>
      </div>
    </div>
  );
};

export default FinishModal;
