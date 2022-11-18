import "../styles/style.scss";
import { PointsProvider } from "../context/context";
import { AccountContextProvider } from "../context/accountContext";

function MyApp({ Component, pageProps }) {
  return (
    <AccountContextProvider>
      <PointsProvider>
        <Component {...pageProps} />
      </PointsProvider>
    </AccountContextProvider>
  );
}

export default MyApp;
