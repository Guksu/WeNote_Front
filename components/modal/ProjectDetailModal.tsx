import styles from "../../styles/home.module.scss";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import axios from "axios";
import { ProjectDetail } from "@/interface/interface";

type Props = {
  setDetailOpen: Dispatch<SetStateAction<boolean>>;
  detailId: number;
};

export default function ProjectDetailModal({ setDetailOpen, detailId }: Props) {
  const [detailData, setDetailDate] = useState<ProjectDetail>();
  //----------------------function-----------------
  const modalClose = () => {
    setDetailOpen(false);
  };

  const getDetailData = async () => {
    try {
      const res = await axios.get(`/project/detail/${detailId}`);
      setDetailDate(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getDetailData();
    document.body.style.cssText = `
    position: fixed; 
    top: -${window.scrollY}px;
    overflow-y: auto;
    width: 100%;
    `;
    return () => {
      const scrollY = document.body.style.top;
      document.body.style.cssText = "";
      window.scrollTo(0, parseInt(scrollY || "0", 10) * -1);
    };
  }, [detailId]);

  return (
    <div className={styles.detailModalWrapper}>
      <div className={styles.modalBox}>
        <div onClick={modalClose} className={styles.closeBtn}>
          <HighlightOffIcon />
        </div>
        <div className={styles.imgArea}>
          <img src={detailData?.PRO_IMG ? detailData.PRO_IMG : "/images/default_project.jpg"} alt="프로젝트 이미지" />
        </div>
        <div className={styles.topInfo}>
          <h3>{detailData?.PRO_TITLE}</h3>
          {detailData?.MEMBER_CHECK === "Y" ? <button className={styles.on}>참여중</button> : <button>참여하기</button>}
        </div>
        <p>{detailData?.PRO_CONTENT}</p>
      </div>
    </div>
  );
}
