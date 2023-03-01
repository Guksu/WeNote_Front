import CommonTopFiler from "@/components/CommonTopFilter";
import { useState, useEffect } from "react";
import axios from "axios";
import { GetServerSideProps } from "next";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import styles from "../../styles/note.module.scss";
import NoneData from "@/components/NoneData";
import Swal from "sweetalert2";
import { ProjectNoteList } from "@/interface/interface";
import { useRouter } from "next/router";
import ProjectNoteCreateModal from "@/components/modal/ProjectNoteCreateModal";
import ProjectNoteDetailModal from "@/components/modal/ProjectNoteDetailModal";
import Image from "next/image";
import ProjectMemberModal from "@/components/modal/projectMemberModal";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const cookies = context.req.headers.cookie?.split("; ") || "";

  const res = await axios.get(`/project_note/all_list/${context.query.id}`, {
    headers: { Cookie: cookies },
  });

  return {
    props: {
      noteDataSRR: res.data.data,
    },
  };
};

export default function projectDetail({ noteDataSRR }: { noteDataSRR: ProjectNoteList[] }) {
  const router = useRouter();
  const [noteData, setNoteData] = useState<ProjectNoteList[]>(noteDataSRR || []);
  const [showData, setShowDate] = useState<ProjectNoteList[]>(noteDataSRR.filter((item) => item.PRO_NOTE_STATE === "W") || []);
  const category: { name: string; value: string }[] = [
    { name: "진행 예정", value: "W" },
    { name: "진행 중", value: "P" },
    { name: "완료", value: "F" },
  ];
  const noteStateList: { name: string; value: string }[] = [
    { name: "진행 예정", value: "W" },
    { name: "진행 중", value: "P" },
    { name: "완료", value: "F" },
    { name: "삭제", value: "D" },
  ];
  const [categoryValue, setCategoryValue] = useState<string>("W");
  const [stateChangeOpen, setStateChangeOpen] = useState<number>(0);
  const [newBtnOpen, setNewBtnOpen] = useState<boolean>(false);
  const [detailOpen, setDetailOpen] = useState<boolean>(false);
  const [detailId, setDetailId] = useState<number>(0);
  const [memberOpen, setMemberOpen] = useState<boolean>(false);
  //-------------------function----------------------------------//
  const categoryChange = (value: string) => {
    setCategoryValue(value);
    setStateChangeOpen(0);
  };

  const dataRefresh = async () => {
    try {
      const res = await axios.get(`/project_note/all_list/${router.query.id}`);
      if (res.status === 200) {
        setNoteData(res.data.data);
        setShowDate(res.data.data.filter((item: ProjectNoteList) => item.PRO_NOTE_STATE === categoryValue));
      }
    } catch (error) {}
  };

  const stateChangeRefresh = (id: number, state: string) => {
    axios.patch(`/project_note/state_change/${id}`, { PRO_NOTE_STATE: state }).then((res1) => {
      dataRefresh();
    });
  };

  const onNoteStateChange = (id: number, state: string) => {
    if (state === "D") {
      Swal.fire({
        text: "해당 노트를 삭제하시겠습니까?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#535457",
        cancelButtonColor: "#d33",
        confirmButtonText: "삭제",
        cancelButtonText: "취소",
      }).then((result) => {
        if (result.isConfirmed) {
          stateChangeRefresh(id, state);
        }
      });
    } else {
      stateChangeRefresh(id, state);
    }
  };

  useEffect(() => {
    setShowDate(noteData.filter((item) => item.PRO_NOTE_STATE === categoryValue));
  }, [categoryValue]);

  return (
    <>
      <div className={styles.projectTitle}>
        <span>{router.query.title}</span> <button onClick={() => setMemberOpen(true)}>팀원목록</button>
      </div>
      <CommonTopFiler category={category} categoryChange={categoryChange} valueCheck={categoryValue} newBtn={true} setNewBtnOpen={setNewBtnOpen} />
      <div onClick={(e) => setStateChangeOpen(0)}>
        {showData.length > 0 ? (
          <div className={styles.allWrapper}>
            {showData.map((item) => {
              const date = new Date(item.PRO_NOTE_REG_DT).toLocaleDateString();
              return (
                <div className={styles.noteBox} key={item.PRO_NOTE_ID}>
                  <div className={styles.topInfo}>
                    <h4>{item.PRO_NOTE_ID}</h4>
                    {item.ISOWNER === "Y" ? (
                      <span>
                        <MoreHorizIcon
                          onClick={(e) => {
                            setStateChangeOpen(item.PRO_NOTE_ID);
                            e.stopPropagation();
                          }}
                        />
                        <ul style={{ display: stateChangeOpen === item.PRO_NOTE_ID ? "" : "none" }}>
                          {noteStateList
                            .filter((state) => state.value !== categoryValue)
                            .map((item2) => {
                              return (
                                <li
                                  key={item2.value}
                                  value={item2.value}
                                  onClick={() => {
                                    onNoteStateChange(item.PRO_NOTE_ID, item2.value);
                                  }}
                                >
                                  {item2.name}
                                </li>
                              );
                            })}
                        </ul>
                      </span>
                    ) : (
                      <div className={styles.imgArea}>
                        <Image
                          src={item.MEM_IMG ? `${process.env.SERVER_URL}/${item.MEM_IMG}` : "/images/default_user.png"}
                          alt={"유저 이미지"}
                          fill
                        />
                      </div>
                    )}
                  </div>
                  <div className={styles.content}>{item.PRO_NOTE_CONTENT}</div>
                  <div className={styles.bottomInfo}>
                    <div className={styles.date}>{date}</div>
                    <button
                      onClick={() => {
                        setDetailOpen(true);
                        setDetailId(item.PRO_NOTE_ID);
                      }}
                    >
                      상세보기
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <NoneData text="등록된 노트가 없습니다" />
        )}
      </div>
      {newBtnOpen && <ProjectNoteCreateModal setNewBtnOpen={setNewBtnOpen} dataRefresh={dataRefresh} />}
      {detailOpen && <ProjectNoteDetailModal setDetailOpen={setDetailOpen} dataRefresh={dataRefresh} detailId={detailId} />}
      {memberOpen && <ProjectMemberModal setMemberOpen={setMemberOpen} />}
    </>
  );
}
