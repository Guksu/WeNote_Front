import { useAppStore } from "@/store/store";
import SearchIcon from "@mui/icons-material/Search";
import Link from "next/link";
import { useRouter } from "next/router";
import styles from "../styles/header.module.scss";
import EventNoteIcon from "@mui/icons-material/EventNote";
import WorkIcon from "@mui/icons-material/Work";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import HomeIcon from "@mui/icons-material/Home";

export default function Header() {
  const isLogin = useAppStore((state) => state.isLogin);
  const router = useRouter();
  const homeQuery = useAppStore((state) => state.homeQuery);
  const homeQeuryChange = useAppStore((state) => state.queryChange);

  function queryChange() {
    console.log(homeQuery);
  }
  return (
    <>
      <div className={styles.allWrapper}>
        <div className={styles.topSection}>
          <Link href={"/"} className={styles.mainLogo}>
            WeNote
          </Link>
          <div className={styles.searchBox}>
            <input
              placeholder="키워드 검색"
              type="text"
              value={homeQuery.keyword}
              onChange={(e) => homeQeuryChange({ keyword: e.currentTarget.value, category: homeQuery.category, page: 1 })}
              onKeyUp={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  queryChange();
                }
              }}
            />
            <span>
              <SearchIcon sx={{ color: "white" }} />
            </span>
          </div>
          <div>
            {isLogin ? (
              <img src="/images/default_user.png" alt="프로필 이미지" onClick={() => router.push("/profile")} className={styles.prfileImg} />
            ) : (
              <button className={styles.loginBtn}>로그인</button>
            )}
          </div>
        </div>
        <nav className={styles.bottomSection} style={{ paddingBottom: router.asPath.includes("/profile") ? "12px" : "0px" }}>
          <Link href={"/"} className={router.asPath === "/" ? styles.on : ""}>
            홈
          </Link>
          <Link href={"/participation"} className={router.asPath.includes("/participation") ? styles.on : ""}>
            참가현황
          </Link>
          <Link href={"/project"} className={router.asPath.includes("/project") ? styles.on : ""}>
            프로젝트
          </Link>
          <Link href={"/note"} className={router.asPath.includes("/note") ? styles.on : ""}>
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
        <Link href={"/participation"} className={router.asPath.includes("/participation") ? styles.on : ""}>
          <span>
            <EventAvailableIcon />
          </span>
          <p>참가현황</p>
        </Link>
        <Link href={"/project"} className={router.asPath.includes("/project") ? styles.on : ""}>
          <span>
            <WorkIcon />
          </span>
          <p>프로젝트</p>
        </Link>
        <Link href={"/note"} className={router.asPath.includes("/note") ? styles.on : ""}>
          <span>
            <EventNoteIcon />
          </span>
          <p>개인 노트</p>
        </Link>
      </nav>
    </>
  );
}
