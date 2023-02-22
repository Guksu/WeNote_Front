import { useAppStore } from "@/store/store";
import SearchIcon from "@mui/icons-material/Search";
import Link from "next/link";
import { useRouter } from "next/router";
import styles from "../styles/header.module.scss";

export default function Header() {
  const isLogin = useAppStore((state) => state.isLogin);
  const router = useRouter();

  return (
    <div className={styles.allWrapper}>
      <div className={styles.topSection}>
        <Link href={"/"} className={styles.mainLogo}>
          WeNote
        </Link>
        <div className={styles.searchBox}>
          <input placeholder="키워드 검색" type="text" />
          <span>
            <SearchIcon sx={{ color: "white" }} />
          </span>
        </div>
        <div>
          {!isLogin ? (
            <img src="/images/default_user.png" onClick={() => router.push("/profile")} className={styles.prfileImg} />
          ) : (
            <button className={styles.loginBtn}>로그인</button>
          )}
        </div>
      </div>
      <nav className={styles.bottomSection} style={{ paddingBottom: router.asPath.includes("/profile") ? "12px" : "" }}>
        <Link href={"/"} className={router.asPath === "/" ? styles.on : ""}>
          홈
        </Link>
        <Link href={"/project"} className={router.asPath.includes("/project") ? styles.on : ""}>
          프로젝트
        </Link>
        <Link href={"/participation"} className={router.asPath.includes("/participation") ? styles.on : ""}>
          프로젝트 참가 현황
        </Link>
        <Link href={"/note"} className={router.asPath.includes("/note") ? styles.on : ""}>
          개인 노트
        </Link>
      </nav>
    </div>
  );
}
