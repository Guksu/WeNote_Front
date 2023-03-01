import { Dispatch, SetStateAction, useEffect, useState } from "react";
import styles from "../../styles/projectCreateModal.module.scss";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { useAppStore } from "@/store/store";
import axios from "axios";
import { getPrevImg } from "@/utils/getPrevIng";
import Image from "next/image";

type Props = {
  setUpdateOpen: Dispatch<SetStateAction<boolean>>;
  dataRefresh: () => void;
  projectId: number;
};

export default function ProjectUpdateModal({ setUpdateOpen, dataRefresh, projectId }: Props) {
  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [projectImg, setProjectImg] = useState<string>("/images/photo_add.png");
  const [projectImgFile, setProjectImgFile] = useState<FileList | null>(null);
  const [projectCategroy, setProjectCategory] = useState<string>("1");
  const [projectState, setProjectState] = useState<string>("W");
  const alertMsgChange = useAppStore((state) => state.alertMsgChange);
  const alertTypeChange = useAppStore((state) => state.alertTypeChange);
  let doubleClickPrevent = false;

  //-------------------function----------------------------------//
  const onReset = () => {
    setTitle("");
    setContent("");
    setProjectImg("/images/photo_add.png");
    setProjectImgFile(null);
    setProjectState("W");
    setProjectCategory("0");
  };

  const onCloseClick = () => {
    onReset();
    setUpdateOpen(false);
  };

  const getData = async () => {
    try {
      const res = await axios.get(`/project/detail/${projectId}`);
      if (res.status === 200) {
        setTitle(res.data.data.PRO_TITLE);
        setContent(res.data.data.PRO_CONTENT);
        setProjectImg(res.data.data.PRO_IMG ? `${process.env.SERVER_URL}/${res.data.data.PRO_IMG}` : "/images/photo_add.png");
        setProjectState(res.data.data.PRO_STATE);
        setProjectCategory(res.data.data.PRO_CATEGORY);
      }
    } catch (error) {}
  };

  const onUpdateClick = async () => {
    if (doubleClickPrevent) {
      setTimeout(() => {
        doubleClickPrevent = false;
      }, 1000);
    } else if (title === "" || content === "") {
      alertMsgChange("필수항목을 입력해 주세요.");
      alertTypeChange("Warning");
    } else {
      try {
        doubleClickPrevent = true;
        const form = new FormData();
        if (projectImgFile) {
          form.append("PRO_IMG", projectImgFile[0]);
        }
        form.append("PRO_CATEGORY", projectCategroy);
        form.append("PRO_TITLE", title);
        form.append("PRO_CONTENT", content);
        form.append("PRO_STATE", projectState);

        const res = await axios.patch(`/project/update/${projectId}`, form);
        if (res.status === 200) {
          alertMsgChange("수정되었습니다.");
          alertTypeChange("Success");
          setTimeout(() => {
            onCloseClick();
            dataRefresh();
          }, 1000);
        }
      } catch (error) {}
    }
  };

  useEffect(() => {
    getData();
  }, [projectId]);

  return (
    <div className={styles.modalWrapper}>
      <div className={styles.modalBox}>
        <span className={styles.closeBtn}>
          <HighlightOffIcon onClick={onCloseClick} />
        </span>
        <div className={styles.imgArea}>
          <label className={styles.imgBox}>
            <Image src={projectImg} alt="프로필 이미지" fill />
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
                  setProjectImgFile(e.currentTarget.files);
                  getPrevImg(e.currentTarget.files, setProjectImg);
                }
              }}
            />
          </label>
        </div>
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
        <div className={`${styles.inputArea} ${styles.stateArea}`}>
          <div>
            <input type={"radio"} name="projectCategory" id="1" checked={projectCategroy === "1"} onClick={() => setProjectCategory("1")} />
            <label>스터디</label>
          </div>
          <div>
            <input type={"radio"} name="projectCategory" id="2" checked={projectCategroy === "2"} onClick={() => setProjectCategory("2")} />
            <label>운동</label>
          </div>
          <div>
            <input type={"radio"} name="projectCategory" id="3" checked={projectCategroy === "3"} onClick={() => setProjectCategory("3")} />
            <label>취미</label>
          </div>
          <div>
            <input type={"radio"} name="projectCategory" id="4" checked={projectCategroy === "4"} onClick={() => setProjectCategory("4")} />
            <label>기타</label>
          </div>
        </div>
        <div className={`${styles.inputArea} ${styles.stateArea}`}>
          <div>
            <input type={"radio"} name="projectState" id="W" checked={projectState === "W"} onClick={() => setProjectState("W")} />
            <label>모집 중</label>
          </div>
          <div>
            <input type={"radio"} name="projectState" id="F" checked={projectState === "F"} onClick={() => setProjectState("F")} />
            <label>모집 완료</label>
          </div>
        </div>
        <div className={styles.btnArea}>
          <button onClick={onUpdateClick}>수정</button>
        </div>
      </div>
    </div>
  );
}
