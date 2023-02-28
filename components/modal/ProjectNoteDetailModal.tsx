import { Dispatch, SetStateAction, useState, useEffect } from "react";
import styles from "../../styles/noteCreateModal.module.scss";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { useAppStore } from "@/store/store";
import axios from "axios";

type Props = {
  setDetailOpen: Dispatch<SetStateAction<boolean>>;
  dataRefresh: () => void;
  detailId: number;
};

export default function ProjectNoteDetailModal({ setDetailOpen, dataRefresh, detailId }: Props) {
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [isOwner, setIsOwner] = useState<string>("N");
  const alertMsgChange = useAppStore((state) => state.alertMsgChange);
  const alertTypeChange = useAppStore((state) => state.alertTypeChange);
  let doubleClickPrevent = false;

  //-------------------function----------------------------------//
  const onCloseClick = () => {
    setTitle("");
    setContent("");
    setDetailOpen(false);
  };

  const onUpdateClick = async () => {
    if (doubleClickPrevent) {
      setTimeout(() => {
        doubleClickPrevent = false;
      }, 1000);
    } else if (title === "" || content === "") {
      alertMsgChange("제목 및 내용을 입력해 주세요.");
      alertTypeChange("Warning");
    } else {
      try {
        const form = new FormData();
        form.append("PRO_NOTE_TITLE", `${title}`);
        form.append("PRO_NOTE_CONTENT", `${content}`);

        const res = await axios.patch(`/project_note/update/${detailId}`, form);
        if (res.status === 200) {
          alertMsgChange("수정되었습니다.");
          alertTypeChange("Success");
          setTimeout(() => {
            setDetailOpen(false);
            dataRefresh();
          }, 1000);
        }
      } catch (error) {}
    }
  };

  const getDetailData = async (id: number) => {
    try {
      const res = await axios.get(`/project_note/detail/${id}`);
      if (res.status === 200) {
        setTitle(res.data.data[0].PRO_NOTE_TITLE);
        setContent(res.data.data[0].PRO_NOTE_CONTENT);
        setIsOwner(res.data.data[1].ISOWNER);
      }
    } catch (error) {}
  };

  useEffect(() => {
    getDetailData(detailId);
  }, [detailId]);

  return (
    <div className={styles.modalWrapper}>
      <div className={styles.modalBox}>
        <span className={styles.closeBtn}>
          <HighlightOffIcon onClick={onCloseClick} />
        </span>
        <div className={styles.inputArea}>
          <label>제목</label>
          <input
            type={"text"}
            value={title}
            placeholder="제목을 입력해주세요"
            disabled={isOwner === "N"}
            maxLength={50}
            onChange={(e) => {
              if (e.currentTarget.value.length > 50) {
                setTitle(e.currentTarget.value.slice(0, 50));
              } else {
                setTitle(e.currentTarget.value);
              }
            }}
          />
        </div>
        <div className={styles.inputArea}>
          <label>내용</label>
          <textarea
            value={content}
            placeholder="내용을 입력해주세요"
            maxLength={2000}
            disabled={isOwner === "N"}
            onChange={(e) => {
              if (e.currentTarget.value.length > 2000) {
                setContent(e.currentTarget.value.slice(0, 2000));
              } else {
                setContent(e.currentTarget.value);
              }
            }}
          />
        </div>
        {isOwner === "Y" && (
          <div className={styles.btnArea}>
            <button onClick={onUpdateClick}>수정</button>
          </div>
        )}
      </div>
    </div>
  );
}
