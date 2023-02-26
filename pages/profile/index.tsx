import { ProfileInfo } from "@/interface/interface";
import { useAppStore } from "@/store/store";
import { getPrevImg } from "@/utils/getPrevIng";
import axios from "axios";
import { GetServerSideProps } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";
import styles from "../../styles/profile.module.scss";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const cookies = context.req.headers.cookie?.split("; ") || "";

  const res = await axios.get(`/profile/info`, {
    headers: { Cookie: cookies },
  });

  return {
    props: {
      profileDataSSR: res.data.data,
    },
  };
};

export default function Profile({ profileDataSSR }: { profileDataSSR: ProfileInfo }) {
  const router = useRouter();
  const isLoginChange = useAppStore((state) => state.isLoginChagne);
  const [nick, setNick] = useState<string>(profileDataSSR.MEM_NICK);
  const [profileImg, setProfileImg] = useState<string>(
    profileDataSSR.MEM_IMG === "" ? "/images/photo_add.png" : `http://localhost:4000/${profileDataSSR.MEM_IMG}`
  );
  const [profileImgFile, setProfileImgFile] = useState<FileList | null>(null);
  const alertMsgChange = useAppStore((state) => state.alertMsgChange);
  const alertTypeChange = useAppStore((state) => state.alertTypeChange);
  let doubleClickPrevent = false;

  //-------------------function----------------------------------//
  const onUpdateClick = async () => {
    if (doubleClickPrevent) {
      setTimeout(() => {
        doubleClickPrevent = false;
      }, 1000);
    } else {
      doubleClickPrevent = true;
      const form = new FormData();
      if (profileImgFile) {
        form.append("MEM_IMG", profileImgFile[0]);
      }
      form.append("MEM_NICK", `${nick}`);
      try {
        const res = await axios.patch("/profile/update", form);
        if (res.status === 200) {
          const profileImg = res.data.data.MEM_IMG !== "" ? `http://localhost:4000/${res.data.data.MEM_IMG}` : "";
          alertMsgChange("수정되었습니다.");
          alertTypeChange("Success");
          window.sessionStorage.setItem("profileImg", profileImg);
          setTimeout(() => {
            router.reload();
          }, 1000);
        }
      } catch (error) {
        console.log(error);
      }
    }
  };

  const onLogoutClick = () => {
    window.sessionStorage.clear();
    isLoginChange(false);
    router.push("/");
  };

  const onLeaveClick = async () => {
    try {
      const res = await axios.patch("/profile/withdrawl_membership");
      if (res.status === 200) {
        window.sessionStorage.clear();
        isLoginChange(false);
        router.push("/");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className={styles.profileWrapper}>
      <div onClick={onLogoutClick} className={styles.logout}>
        로그아웃
      </div>
      <div className={styles.inputArea}>
        <label>프로필 이미지</label>
        <label className={styles.profileArea}>
          <Image src={profileImg} alt="프로필 이미지" fill />
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
      </div>
      <div className={styles.inputArea2}>
        <label>이메일</label>
        <input type={"text"} value={profileDataSSR.MEM_EMAIL} disabled />
      </div>
      <div className={styles.inputArea2}>
        <label>닉네임</label>
        <input
          type={"text"}
          placeholder="닉네임을 입력해주세요"
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
      </div>
      <div className={styles.btnArea}>
        <button onClick={onUpdateClick} className={nick.length === 0 ? styles.disabledBtn : ""}>
          내 프로필 변경 완료
        </button>
        <button className={styles.leaveBtn} onClick={onLeaveClick}>
          회원탈퇴
        </button>
      </div>
    </div>
  );
}
