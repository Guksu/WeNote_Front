import CommonTopFiler from "@/components/CommonTopFilter";
import { useState } from "react";
import axios from "axios";
import { GetServerSideProps } from "next";
import styles from "../../styles/home.module.scss";
import { ProjectList } from "@/interface/interface";
import NoneData from "@/components/NoneData";
import Image from "next/image";
import ProjectCreateModal from "@/components/modal/projectCreateModal";
import ProjectUpdateModal from "@/components/modal/projectUpdateModal";
import EditIcon from "@mui/icons-material/Edit";
import { useRouter } from "next/router";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const cookies = context.req.headers.cookie?.split("; ") || "";

  const allProjectRes = await axios.get(`/project/all_project_list`, { headers: { Cookie: cookies } });
  const myProjectRes = await axios.get(`/project/my_project_list`, { headers: { Cookie: cookies } });

  return {
    props: {
      allProjectListSSR: allProjectRes.data.data,
      myProjectListSSR: myProjectRes.data.data,
    },
  };
};

export default function Project({ allProjectListSSR, myProjectListSSR }: { allProjectListSSR: ProjectList[]; myProjectListSSR: ProjectList[] }) {
  const [categoryValue, setCategoryValue] = useState<string>("0");
  const [myProjectList, setMyProjectList] = useState<ProjectList[]>(myProjectListSSR || []);
  const [showProjectList, setShowProjectList] = useState<ProjectList[]>(myProjectListSSR || []);
  const category: { name: string; value: string }[] = [
    { name: "생성 프로젝트", value: "0" },
    { name: "참여 프로젝트", value: "1" },
  ];
  const [newBtnOpen, setNewBtnOpen] = useState<boolean>(false);
  const [updateOpen, setUpdateOpen] = useState<boolean>(false);
  const [projectId, setProjectId] = useState<number>(0);
  const router = useRouter();

  //-------------------function----------------------------------//
  const categoryChange = (value: string) => {
    setCategoryValue(value);
    {
      value === "0" ? setShowProjectList(myProjectList) : setShowProjectList(allProjectListSSR);
    }
  };

  const dataRefresh = async () => {
    try {
      const res = await axios.get(`/project/my_project_list`);
      setMyProjectList(res.data.data);
      setShowProjectList(res.data.data);
    } catch (error) {}
  };

  const onUpdateClick = (id: number) => {
    if (categoryValue === "0") {
      setProjectId(id);
      setUpdateOpen(true);
    }
  };

  return (
    <>
      <CommonTopFiler category={category} categoryChange={categoryChange} valueCheck={categoryValue} newBtn={true} setNewBtnOpen={setNewBtnOpen} />
      <div>
        {showProjectList.length > 0 ? (
          <div className={styles.projectListWrapper}>
            {showProjectList.map((item: ProjectList) => {
              const date = new Date(item.PRO_REG_DT).toLocaleDateString();

              return (
                <div
                  key={item.PRO_ID}
                  className={styles.projectBox}
                  style={{ cursor: "pointer" }}
                  onClick={() => router.push(`/project/${item.PRO_ID}`)}
                >
                  <div>
                    <h4>{item.PRO_TITLE}</h4>
                    {categoryValue === "1" ? (
                      <div className={styles.imgArea}>
                        <Image
                          src={item.PRO_IMG ? `http://localhost:4000/${item.PRO_IMG}` : "/images/default_project.jpg"}
                          alt={"프로젝트 이미지"}
                          fill
                        />
                      </div>
                    ) : (
                      <div onClick={() => onUpdateClick(item.PRO_ID)}>
                        <EditIcon />
                      </div>
                    )}
                  </div>
                  <div className={styles.content}>{item.PRO_CONTENT}</div>
                  <div className={styles.bottomInfo}>
                    <div className={styles.date}>{date}</div>
                    {item.PRO_STATE === "W" ? (
                      <button className={styles.progressBtn}>모집중</button>
                    ) : (
                      <button className={styles.endBtn}>모집완료</button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <NoneData text="등록된 프로젝트가 없습니다." />
        )}
      </div>
      {newBtnOpen && <ProjectCreateModal setNewBtnOpen={setNewBtnOpen} dataRefresh={dataRefresh} />}
      {updateOpen && <ProjectUpdateModal setUpdateOpen={setUpdateOpen} dataRefresh={dataRefresh} projectId={projectId} />}
    </>
  );
}
