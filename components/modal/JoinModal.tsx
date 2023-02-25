import styles from "../../styles/login.module.scss";
import { Dispatch, SetStateAction, useState } from "react";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import axios, { AxiosError } from "axios";
import { getPrevImg } from "@/utils/getPrevIng";

type Props = {
  setJoinOpen: Dispatch<SetStateAction<boolean>>;
};

export default function JoinModal({ setJoinOpen }: Props) {
  const emailRegex = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/;
  const [id, setId] = useState<string>("");
  const [pw, setPw] = useState<string>("");
  const [nick, setNick] = useState<string>("");
  const [profileImg, setProfileImg] = useState<string>("/images/photo_add.png");
  const [profileImgFile, setProfileImgFile] = useState<FileList | null>(null);
  /**더블클릭 방지*/
  let doubleClickPrevent = false;

  //-------------------function----------------------------------//
  const onCloseClick = () => {
    setId("");
    setPw("");
    setNick("");
    setProfileImg("");
    setProfileImgFile(null);
    setJoinOpen(false);
  };

  const onJoinClick = async () => {
    if (doubleClickPrevent) {
      setTimeout(() => {
        doubleClickPrevent = false;
      }, 1000);
    } else if (!emailRegex.test(id)) {
      alert("올바른 형식의 이메일을 입력해주세요");
    } else {
      doubleClickPrevent = true;
      const form = new FormData();
      if (profileImgFile) {
        form.append("MEM_IMG", profileImgFile[0]);
      }
      form.append("MEM_EMAIL", `${id}`);
      form.append("MEM_NICK", `${nick}`);
      form.append("MEM_PW", `${pw}`);
      try {
        const res = await axios.post("/account/join", form);
        if (res.status === 200) {
          alert("회원가입 성공 !");
          onCloseClick();
        }
      } catch (error) {
        const { response } = error as unknown as AxiosError;
        if (response?.status === 400) {
          alert("이미 등록된 이메일입니다.");
        }
      }
    }
  };

  return (
    <div className={styles.loginModalWrapper}>
      <div className={`${styles.modalBox} ${styles.joinModal}`}>
        <div onClick={onCloseClick} className={styles.closeBtn}>
          <HighlightOffIcon />
        </div>
        <div className={styles.inputArea}>
          <label className={styles.imgBox}>
            <img src={profileImg} alt="프로필 이미지" />
            <input
              accept="image/*"
              type="file"
              style={{ display: "none" }}
              onClick={(e) => {
                if (doubleClickPrevent) {
                  e.preventDefault();
                  setTimeout(() => {
                    doubleClickPrevent = false;
                  }, 1000);
                } else {
                  doubleClickPrevent = true;
                  setTimeout(() => {
                    doubleClickPrevent = false;
                  }, 1000);
                }
              }}
              onChange={(e) => {
                if (e.currentTarget.files && e.currentTarget.files.length > 0) {
                  setProfileImgFile(e.currentTarget.files);
                  getPrevImg(e.currentTarget.files, setProfileImg);
                }
              }}
            />
          </label>
          <input type={"text"} placeholder="이메일" maxLength={100} onChange={(e) => setId(e.currentTarget.value)} />
          <input
            type={"text"}
            placeholder="닉네임"
            maxLength={20}
            value={nick}
            onChange={(e) => {
              if (e.currentTarget.value.length > 20) {
                setNick(e.currentTarget.value.slice(0, 20));
              } else {
                setNick(e.currentTarget.value);
              }
            }}
          />
          <input type={"password"} placeholder="비밀번호" maxLength={255} onChange={(e) => setPw(e.currentTarget.value)} />
          <button onClick={onJoinClick}>회원가입</button>
        </div>
      </div>
    </div>
  );
}
