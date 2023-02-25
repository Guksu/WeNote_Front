import Layout from "@/components/Layout";
import type { AppProps } from "next/app";
import { useEffect, useState } from "react";
import { Hydrate, QueryClient, QueryClientProvider } from "react-query";
import axios from "axios";
import Head from "next/head";
import "../styles/global.scss";
import { useAppStore } from "../store/store";

export default function App({ Component, pageProps }: AppProps) {
  const [queryClient] = useState<QueryClient>(() => new QueryClient());
  const isLoginChange = useAppStore((state) => state.isLoginChagne);

  axios.defaults.baseURL = "http://localhost:4000";
  axios.defaults.withCredentials = true;

  useEffect(() => {
    if (window.sessionStorage.getItem("token")) {
      isLoginChange(true);
    }
  }, []);

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Hydrate state={pageProps.dehydratedState}>
          <Head>
            <title>WeNote</title>
            <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
            <link rel="shortcut icon" href="favicon.ico" />
          </Head>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </Hydrate>
      </QueryClientProvider>
    </>
  );
}
