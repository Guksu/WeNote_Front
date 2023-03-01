import styles from "../../styles/login.module.scss";
import { Dispatch, SetStateAction, useState } from "react";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import axios from "axios";
import { useRouter } from "next/router";
import { useAppStore } from "@/store/store";

type Props = {
  setLoginOpen: Dispatch<SetStateAction<boolean>>;
  setJoinOpen: Dispatch<SetStateAction<boolean>>;
};

export default function LoginModal({ setLoginOpen, setJoinOpen }: Props) {
  const router = useRouter();
  const alertMsgChange = useAppStore((state) => state.alertMsgChange);
  const alertTypeChange = useAppStore((state) => state.alertTypeChange);
  const [id, setId] = useState<string>("");
  const [pw, setPw] = useState<string>("");

  //-------------------function----------------------------------//
  const onCloseClick = () => {
    setId("");
    setPw("");
    setLoginOpen(false);
  };

  const onLoginClick = async () => {
    if (id === "" && pw === "") {
      alertMsgChange("아이디 및 비밀번호를 입력해 주세요.");
      alertTypeChange("Warning");
    } else {
      try {
        const res = await axios.patch("/account/login", { MEM_EMAIL: id, MEM_PW: pw });
        if (res.status === 202) {
          alertMsgChange("해당 계정은 탈퇴되었습니다.");
          alertTypeChange("Warning");
        } else if (res.status === 200) {
          onCloseClick();
          const profileImg = res.data.data.MEM_IMG !== "" ? `${process.env.SERVER_URL}/${res.data.data.MEM_IMG}` : "";
          window.sessionStorage.setItem("token", res.data.data.accessToken);
          window.sessionStorage.setItem("profileImg", profileImg);
          router.reload();
        }
      } catch (error) {}
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
          <input
            type={"text"}
            placeholder="이메일"
            maxLength={100}
            onChange={(e) => setId(e.currentTarget.value)}
            onKeyUp={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                onLoginClick();
              }
            }}
          />
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
