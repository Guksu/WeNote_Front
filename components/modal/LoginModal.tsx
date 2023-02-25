import styles from "../../styles/login.module.scss";
import { Dispatch, SetStateAction, useState } from "react";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/router";

type Props = {
  setLoginOpen: Dispatch<SetStateAction<boolean>>;
  setJoinOpen: Dispatch<SetStateAction<boolean>>;
  setProfileImg: Dispatch<SetStateAction<string | null>>;
};

export default function LoginModal({ setLoginOpen, setJoinOpen, setProfileImg }: Props) {
  const router = useRouter();
  const [id, setId] = useState<string>("");
  const [pw, setPw] = useState<string>("");

  //-------------------function----------------------------------//
  const onCloseClick = () => {
    setId("");
    setPw("");
    setLoginOpen(false);
  };

  const onLoginClick = async () => {
    try {
      const res = await axios.patch("/account/login", { MEM_EMAIL: id, MEM_PW: pw });
      if (res.status === 202) {
        alert("탈퇴회원입니다.");
      } else if (res.status === 200) {
        onCloseClick();
        const profileImg = res.data.data.MEM_IMG !== "" ? `http://localhost:4000/${res.data.data.MEM_IMG}` : "";
        window.sessionStorage.setItem("token", res.data.data.accessToken);
        window.sessionStorage.setItem("profileImg", profileImg);
        router.reload();
      }
    } catch (error) {
      const { response } = error as unknown as AxiosError;
      if (response?.status === 401) {
        alert("아이디 및 비밀번호가 일치하지 않습니다.");
      }
    }
  };

  const onJoinClick = () => {
    onCloseClick();
    setJoinOpen(true);
  };

  return (
    <div className={styles.loginModalWrapper}>
      <div className={styles.modalBox}>
        <div onClick={onCloseClick} className={styles.closeBtn}>
          <HighlightOffIcon />
        </div>
        <div className={styles.inputArea}>
          <input type={"text"} placeholder="이메일" maxLength={100} onChange={(e) => setId(e.currentTarget.value)} />
          <input
            type={"password"}
            placeholder="비밀번호"
            maxLength={255}
            onChange={(e) => setPw(e.currentTarget.value)}
            onKeyUp={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                onLoginClick();
              }
            }}
          />
          <button onClick={onLoginClick}>로그인</button>
        </div>
        <div className={styles.registerArea}>
          아직 회원이 아니세요? <span onClick={onJoinClick}>회원가입</span>
        </div>
      </div>
    </div>
  );
}
