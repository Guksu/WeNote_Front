import { Dispatch, SetStateAction, useEffect, useState } from "react";
import styles from "../../styles/projectMemberModal.module.scss";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import Image from "next/image";
import { useRouter } from "next/router";
import axios from "axios";
import { ProjectMemberList } from "@/interface/interface";

type Props = {
  setMemberOpen: Dispatch<SetStateAction<boolean>>;
};

export default function ProjectMemberModal({ setMemberOpen }: Props) {
  const router = useRouter();
  const [memberData, setMemberData] = useState<ProjectMemberList[]>([]);

  //-------------------function----------------------------------//

  const onCloseClick = () => {
    setMemberOpen(false);
  };

  const getData = async () => {
    const res = await axios.get(`/project/project_member_list/${router.query.id}`);
    if (res.status === 200) {
      setMemberData(res.data.data);
    }
  };

  useEffect(() => {
    getData();
  }, [router.query.id]);

  return (
    <div className={styles.modalWrapper}>
      <div className={styles.modalBox}>
        <div onClick={onCloseClick} className={styles.closeBtn}>
          <HighlightOffIcon />
        </div>
        {memberData.length
          ? memberData.map((item) => {
              return (
                <div key={item.MEM_ID} className={styles.memberInfo}>
                  <div className={styles.imgBox}>
                    <Image src={item.MEM_IMG ? `${process.env.SERVER_URL}/${item.MEM_IMG}` : "/images/default_user.png"} alt={"멤버 이미지"} fill />
                  </div>
                  <div>
                    <div>{item.MEM_NICK}</div>
                    {item.PRO_MEM_ROLE !== "M" ? <span>팀장</span> : <div>멤버</div>}
                  </div>
                </div>
              );
            })
          : null}
      </div>
    </div>
  );
}
