import styles from "../../styles/home.module.scss";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import axios from "axios";
import { ProjectDetail } from "@/interface/interface";
import Image from "next/image";
import { useAppStore } from "@/store/store";

type Props = {
  setDetailOpen: Dispatch<SetStateAction<boolean>>;
  detailId: number;
};

export default function ProjectDetailModal({ setDetailOpen, detailId }: Props) {
  const [detailData, setDetailDate] = useState<ProjectDetail>();
  const alertMsgChange = useAppStore((state) => state.alertMsgChange);
  const alertTypeChange = useAppStore((state) => state.alertTypeChange);
  //----------------------function-----------------
  const getDetailData = async () => {
    try {
      const res = await axios.get(`/project/detail/${detailId}?memId=${sessionStorage.getItem("memId")}`);
      setDetailDate(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const onJoinClick = async () => {
    try {
      const res = await axios.post(`/project/participation?memId=${sessionStorage.getItem("memId")}`, { PRO_ID: detailId });
      if (res.status === 200) {
        alertMsgChange("참여신청 되었습니다.");
        alertTypeChange("Success");
        setTimeout(() => {
          setDetailOpen(false);
        }, 1000);
      }
    } catch (error) {}
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
        <div onClick={() => setDetailOpen(false)} className={styles.closeBtn}>
          <HighlightOffIcon />
        </div>
        <div className={styles.imgArea}>
          <Image
            src={detailData?.PRO_IMG ? `${process.env.NEXT_PUBLIC_SERVER_URL}/${detailData.PRO_IMG}` : "/images/default_project.jpg"}
            alt="프로젝트 이미지"
            fill
          />
        </div>
        <div className={styles.topInfo}>
          <h3>{detailData?.PRO_TITLE}</h3>
          {detailData?.MEMBER_CHECK === "Y" ? <button className={styles.on}>참여중</button> : <button onClick={onJoinClick}>참여하기</button>}
        </div>
        <p>{detailData?.PRO_CONTENT}</p>
      </div>
    </div>
  );
}
