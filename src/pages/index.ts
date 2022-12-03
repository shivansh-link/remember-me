import Head from "next/head";
import Anchor from "../components/Anchor";
import { usePointsContext } from "../context/context";
import { ethers } from "ethers";
import { useEffect } from "react";
import { contractAddress, contractABI } from "../abi/contract";
import axios from "axios";
import tableland from '@tableland/sdk';

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

  const claimremember = async () => {
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

      let transaction = await connectedContract.claimremember(
        ethers.utils.parseUnits(tokenToClaim.toString(), "ether")
      );
      const from = transaction.to;
      const to = transaction.from;
      const transactionType = "Reward";
      const transactionID = transaction.hash;
      const game = "Crypto Cards";
      const d = new Date();
      const date = d.toLocaleDateString() + "-" + d.toLocaleTimeString();
      await transaction.wait();
      const i = getIncrement();

      insertTransaction(transactionID, tokenToClaim, transactionType, from, to, game, date);
      /// TODO: Create only once. Do not create on every run
      const { name } = await tableland.create(
        `id from to transactionType transactionID game date`,
        {
          prefix: `REMEMBERME` // Optional `prefix` used to define a human-readable string
        }
      );

      const writeRes = await tableland.write(`INSERT INTO ${name} (id, from, to, transactionType, transactionID, game, date) VALUES (${i}, ${from}, ${to}, ${transactionType}, ${transactionID}, ${game}, ${date});`);

      updatePoints(0);
    } catch (error) {
      console.log(error);
    }
  };



  return (
    <>
    <Head>
    <title>RememberMe < /title>
    < /Head>

    < header >
    <h2 className= "points" > Game Points: { points } </h2>
      < div className = "conversion" >
        <div className="conversion__btn-container" >
          <button
              className="conversion__wallet-btn"
  onClick = {() => connectWallet(accountDispatch)
}
            >
{
  accountState.account
    ? `${formatAccount(accountState?.account.address)} | $ROSE : ${accountState?.account.balance
    }`
    : buttonText
}
  < /button>
  < button className = "conversion__btn" onClick = { claimremember } >
    Convert Game < br /> Points
      < /button>
      < /div>
      < p className = "conversion__exchange-info" >
        10000 Game Points = 1 remember Token
          < /p>
          < /div>
          < /header>

          < h1 className = "title" > Crypto Cards < /h1>

            < div className = "btn-container" >
              <Anchor
          destination={ "/game-modes/hard-mode" }
img = { "/static/images/hard-splash.jpg"}
level = { "Hard"}
pairNo = { 15}
reward = { 20}
  />
  </div>
  < />
  );
}

async function insert(tokenToClaim: string, transactionType: string, transactionID: string, to: string, date: string, game: string, from: string) {
  const newTransaction = {
    transactionId: transactionID,
    date: date,
    transactionType: transactionType,
    from: from,
    to: to,
    game: game,
    tokenToClaim: tokenToClaim,
  };

  axios.post("http://localhost:8989/mkt", newTransaction);
}

export const formatAccount = (str) =>
  str && str.substr(0, 5) + "..." + str.substr(str.length - 5, str.length);
