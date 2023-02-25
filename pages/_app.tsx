import Layout from "@/components/Layout";
import type { AppProps } from "next/app";
import { useEffect, useState } from "react";
import axios from "axios";
import Head from "next/head";
import "../styles/global.scss";
import { useAppStore } from "../store/store";
import Progress from "@/components/Progress";
import SuccessAlert from "@/components/alert/SuccessAlert";
import WarningAlert from "@/components/alert/WarningAlert";
import { useRouter } from "next/router";

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const [isProgress, setIsProgress] = useState<boolean>(false);
  const isLoginChange = useAppStore((state) => state.isLoginChagne);
  const alertMsgChange = useAppStore((state) => state.alertMsgChange);
  const alertTypeChange = useAppStore((state) => state.alertTypeChange);

  useEffect(() => {
    axios.defaults.baseURL = "http://localhost:4000";
    axios.defaults.withCredentials = true;

    // 요청 인터셉터
    axios.interceptors.request.use(function (config) {
      setIsProgress(true);
      return config;
    });
    // 응답 인터셉터
    axios.interceptors.response.use(
      function (response) {
        setIsProgress(false);
        return response;
      },
      function (error) {
        setIsProgress(false);
        if (error.response.status === 401) {
          alertMsgChange("로그인 후 이용해주세요");
          alertTypeChange("Warning");
          router.push("/");
        } else {
          alertMsgChange("죄송합니다. 현재 서비스가 원활하지 않습니다. 잠시 후에 다시 시도해 주세요 ");
          alertTypeChange("Warning");
        }
        return Promise.reject(error);
      }
    );

    if (window.sessionStorage.getItem("token")) {
      isLoginChange(true);
    }
  }, []);

  return (
    <>
      <Head>
        <title>WeNote</title>
        <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width" />
        <link rel="shortcut icon" href="favicon.ico" />
      </Head>
      <Layout>
        <Component {...pageProps} />
        {isProgress && <Progress />}
        <SuccessAlert />
        <WarningAlert />
      </Layout>
    </>
  );
}
