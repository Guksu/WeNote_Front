import { Dispatch, SetStateAction, useState } from "react";
import styles from "../../styles/noteCreateModal.module.scss";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { useAppStore } from "@/store/store";
import axios from "axios";

type Props = {
  setNewBtnOpen: Dispatch<SetStateAction<boolean>>;
  dataRefresh: () => void;
};

export default function NoteCreateModal({ setNewBtnOpen, dataRefresh }: Props) {
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const alertMsgChange = useAppStore((state) => state.alertMsgChange);
  const alertTypeChange = useAppStore((state) => state.alertTypeChange);
  let doubleClickPrevent = false;

  //-------------------function----------------------------------//
  const onCloseClick = () => {
    setTitle("");
    setContent("");
    setNewBtnOpen(false);
  };

  const onCreateClick = async () => {
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
        form.append("NOTE_TITLE", `${title}`);
        form.append("NOTE_CONTENT", `${content}`);

        const res = await axios.post(`/note/create?memId=${sessionStorage.getItem("memId")}`, form);
        if (res.status === 200) {
          alertMsgChange("등록되었습니다.");
          alertTypeChange("Success");
          setTimeout(() => {
            setNewBtnOpen(false);
            dataRefresh();
          }, 1000);
        }
      } catch (error) {}
    }
  };

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
            onChange={(e) => {
              if (e.currentTarget.value.length > 2000) {
                setContent(e.currentTarget.value.slice(0, 2000));
              } else {
                setContent(e.currentTarget.value);
              }
            }}
          />
        </div>
        <div className={styles.btnArea}>
          <button onClick={onCreateClick}>등록</button>
        </div>
      </div>
    </div>
  );
}
