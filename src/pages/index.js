import Head from "next/head";
import Link from "next/link";

import Anchor from "../components/Anchor";

import { useEffect } from "react";

import { usePointsContext } from "../context/context";

import { contractAddress, contractABI } from "../abi/contract";

import axios from "axios";

import { ethers } from "ethers";

import {
  useAccountContext,
  checkIfWalletIsConnected,
  connectWallet,
} from "../context/accountContext";

export default function Home() {
  const { points, updatePoints } = usePointsContext();

  const [accountState, accountDispatch] = useAccountContext();

  useEffect(() => {
    checkIfWalletIsConnected(accountDispatch);
  }, []);

  /*
  =========
  FUNCTIONS
  =========
  */

  // Button text
  let buttonText;

  if (accountState.metamaskNotFound) {
    buttonText = "Please install metamask";
  } else if (accountState.isAppDisabled) {
    buttonText = "Switch Network";
  } else {
    buttonText = "Connect Wallet";
  }

  async function insertTransaction(
    transactionID,
    tokenToClaim,
    transactionType,
    from,
    to,
    game,
    date
  ) {
    const newTransaction = {
      transactionId: transactionID,
      date: date,
      transactionType: transactionType,
      from: from,
      to: to,
      game: game,
      tokenToClaim: tokenToClaim,
    };

    axios.post("http://localhost:3001/makeTransaction", newTransaction);
  }

  const claimTile = async () => {
    try {
      const { ethereum } = window;

      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const connectedContract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
      );

      const tokenToClaim = points / 10000;

      let transaction = await connectedContract.claimTile(
        ethers.utils.parseUnits(tokenToClaim.toString(), "ether")
      );

      /*
      ==============================================
      VARIABLES THAT SHOULD BE INSERTED TO
      DATABASE ALONG WITH tokenToClaim WHICH'S ABOVE
      ==============================================
      */

      const transactionType = "Reward";

      const transactionID = transaction.hash;

      // I'm confused about this, transaction.to seems to be the address Dominic provided,
      // and transaction.from is my wallet address, isn't it supposed to be the other way around?
      // For now, I'm switching them up, please correct any mistakes
      const from = transaction.to;
      const to = transaction.from;

      const game = "Crypto Cards";

      const d = new Date();
      const date = d.toLocaleDateString() + "-" + d.toLocaleTimeString();

      await transaction.wait();

      insertTransaction(
        transactionID,
        tokenToClaim,
        transactionType,
        from,
        to,
        game,
        date
      );

      const consoleMsg =
        "**********************************\n" +
        "\nTransaction ID: " +
        transactionID +
        "\n\nFrom: " +
        from +
        "\n\nTo: " +
        to +
        "\n\nTransaction Type: " +
        transactionType +
        "\n\nTILE Amount: " +
        tokenToClaim +
        "\n\nGame: " +
        game +
        "\n\nDate: " +
        date +
        "\n\n**********************************";

      /*
      ===================================================
      INSERT THE FOLLOWING DATA TO THE TRANSACTIONS TABLE

      string transactionID

      double tokenToClaim: Amount of TILE tokens claimed
      
      string transactionType: Type of transaction processed

      string from: User wallet address

      string to: Wallet address from which TILE is withdrawn 

      string game: The game in which the TILE is earned

      string date: Local date and time of transaction
      ===================================================
      */

      updatePoints(0);

      console.log(transaction);
      console.log(consoleMsg);
    } catch (error) {
      console.log(error);
    }
  };

  /*
  ======
  RETURN
  ======
  */

  return (
    <>
      <Head>
        <title>Crypto Cards | TILE Games</title>
        <meta name="description" content="Crypto Cards game by TILE Games." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header>
        <h2 className="points">Game Points: {points}</h2>
        <div className="conversion">
          <div className="conversion__btn-container">
            <button
              className="conversion__wallet-btn"
              onClick={() => connectWallet(accountDispatch)}
            >
              {accountState.account
                ? `${formatAccount(accountState?.account.address)} | $ROSE : ${
                    accountState?.account.balance
                  }`
                : buttonText}
            </button>
            <button className="conversion__btn" onClick={claimTile}>
              Convert Game <br /> Points
            </button>
          </div>
          <p className="conversion__exchange-info">
            10000 Game Points = 1 TILE Token
          </p>
        </div>
      </header>

      <h1 className="title">Crypto Cards</h1>

      <div className="btn-container">
        <Anchor
          destination={"/game-modes/easy-mode"}
          img={"/static/images/easy-splash.jpg"}
          level={"Easy"}
          pairNo={6}
          reward={5}
        />
        <Anchor
          destination={"/game-modes/medium-mode"}
          img={"/static/images/medium-splash.jpg"}
          level={"Medium"}
          pairNo={10}
          reward={10}
        />
        <Anchor
          destination={"/game-modes/hard-mode"}
          img={"/static/images/hard-splash.jpg"}
          level={"Hard"}
          pairNo={15}
          reward={20}
        />
      </div>
    </>
  );
}

export const formatAccount = (str) =>
  str && str.substr(0, 5) + "..." + str.substr(str.length - 5, str.length);
