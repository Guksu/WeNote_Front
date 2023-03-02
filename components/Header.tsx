import { useAppStore } from "@/store/store";
import SearchIcon from "@mui/icons-material/Search";
import Link from "next/link";
import { useRouter } from "next/router";
import styles from "../styles/header.module.scss";
import EventNoteIcon from "@mui/icons-material/EventNote";
import WorkIcon from "@mui/icons-material/Work";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import HomeIcon from "@mui/icons-material/Home";
import { useState, useEffect, MouseEvent } from "react";
import JoinModal from "./modal/JoinModal";
import LoginModal from "./modal/LoginModal";
import Image from "next/image";

export default function Header() {
  const isLogin = useAppStore((state) => state.isLogin);
  const router = useRouter();
  const alertMsgChange = useAppStore((state) => state.alertMsgChange);
  const alertTypeChange = useAppStore((state) => state.alertTypeChange);
  const homeQuery = useAppStore((state) => state.homeQuery);
  const homeQeuryChange = useAppStore((state) => state.queryChange);
  const [loginOpen, setLoginOpen] = useState<boolean>(false);
  const [joinOpen, setJoinOpen] = useState<boolean>(false);
  const [profileImg, setProfileImg] = useState<string | null>("");

  //-------------------function----------------------------------//
  const onLoginCheck = (e: MouseEvent<HTMLAnchorElement, globalThis.MouseEvent>) => {
    if (!isLogin) {
      e.preventDefault();
      alertMsgChange("로그인 후 이용해주세요");
      alertTypeChange("Warning");
    }
  };

  useEffect(() => {
    if (sessionStorage.getItem("profileImg") !== "") {
      setProfileImg(sessionStorage.getItem("profileImg"));
    } else {
      setProfileImg("/images/default_user.png");
    }
  }, []);

  useEffect(() => {
    router.asPath !== "/" && homeQeuryChange({ keyword: "", category: "0", page: 1 });
  }, [router.asPath]);

  return (
    <>
      <div className={styles.allWrapper}>
        <div className={styles.topSection}>
          <div className={styles.mainLogo}>WeNote</div>
          <div className={styles.searchBox}>
            <input
              placeholder="키워드 검색"
              type="text"
              value={homeQuery.keyword}
              onChange={(e) => homeQeuryChange({ keyword: e.currentTarget.value, category: homeQuery.category, page: 1 })}
              onKeyUp={(e) => {
                if (e.key === "Enter") {
                  homeQeuryChange({ keyword: e.currentTarget.value, category: homeQuery.category, page: 1 });
                  router.push("/");
                }
              }}
            />
            <span>
              <SearchIcon sx={{ color: "white" }} />
            </span>
          </div>
          <div>
            {isLogin ? (
              <div className={styles.prfileImg}>
                <Image
                  src={profileImg || "/images/default_user.png"}
                  alt="프로필 이미지"
                  onClick={() => router.push(`/profile?memId=${sessionStorage.getItem("memId")}`)}
                  fill
                />
              </div>
            ) : (
              <button className={styles.loginBtn} onClick={() => setLoginOpen(true)}>
                로그인
              </button>
            )}
          </div>
        </div>
        <nav className={styles.bottomSection} style={{ paddingBottom: router.asPath.includes("/profile") ? "12px" : "0px" }}>
          <Link href={"/"} className={router.asPath === "/" ? styles.on : ""}>
            홈
          </Link>
          {/* <Link href={"/participation"} className={router.asPath.includes("/participation") ? styles.on : ""} onClick={(e) => onLoginCheck(e)}>
            참여현황
          </Link> */}
          <Link
            href={`/project?memId=${sessionStorage.getItem("memId")}`}
            className={router.asPath.includes("/project") ? styles.on : ""}
            onClick={(e) => onLoginCheck(e)}
          >
            프로젝트
          </Link>
          <Link
            href={`/note?memId=${sessionStorage.getItem("memId")}`}
            className={router.asPath.includes("/note") ? styles.on : ""}
            onClick={(e) => onLoginCheck(e)}
          >
            개인 노트
          </Link>
        </nav>
      </div>
      <nav className={styles.mobileBottomSection}>
        <Link href={"/"} className={router.asPath === "/" ? styles.on : ""}>
          <span>
            <HomeIcon />
          </span>
          <p>홈</p>
        </Link>
        {/* <Link href={"/participation"} className={router.asPath.includes("/participation") ? styles.on : ""} onClick={(e) => onLoginCheck(e)}>
          <span>
            <EventAvailableIcon />
          </span>
          <p>참여현황</p>
        </Link> */}
        <Link
          href={`/project?memId=${sessionStorage.getItem("memId")}`}
          className={router.asPath.includes("/project") ? styles.on : ""}
          onClick={(e) => onLoginCheck(e)}
        >
          <span>
            <WorkIcon />
          </span>
          <p>프로젝트</p>
        </Link>
        <Link
          href={`/note?memId=${sessionStorage.getItem("memId")}`}
          className={router.asPath.includes("/note") ? styles.on : ""}
          onClick={(e) => onLoginCheck(e)}
        >
          <span>
            <EventNoteIcon />
          </span>
          <p>개인 노트</p>
        </Link>
      </nav>
      {loginOpen && <LoginModal setLoginOpen={setLoginOpen} setJoinOpen={setJoinOpen} />}
      {joinOpen && <JoinModal setJoinOpen={setJoinOpen} />}
    </>
  );
}
