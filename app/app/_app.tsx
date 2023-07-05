import { AmplifyProvider } from "../components/amplifyProvider";
import AppContext from "../lib/appContext";
import "../styles/globals.css";
import type { AppProps } from "next/app";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <AppContext>
      <AmplifyProvider>
        <Component {...pageProps} />
      </AmplifyProvider>
    </AppContext>
  );
}

export default MyApp;
