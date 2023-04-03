import { useAppStore } from "@/store/store";
import styles from "../styles/home.module.scss";
import { useState, useRef, useCallback, useEffect } from "react";
import { ProjectList } from "@/interface/interface";
import NoneData from "@/components/NoneData";
import axios from "axios";
import ProjectDetailModal from "@/components/modal/ProjectDetailModal";
import Image from "next/image";
import { GetServerSideProps } from "next";
import CommonTopFiler from "@/components/CommonTopFilter";

export const getServerSideProps: GetServerSideProps = async () => {
  axios.defaults.baseURL = `${process.env.NEXT_PUBLIC_SERVER_URL}`;
  const res = await axios.get(`/project/all_list?KEYWORD&PRO_CATEGORY=0&PAGE=1`);

  return {
    props: {
      projectListSSR: res.data.data,
    },
  };
};

export default function Home({ projectListSSR }: { projectListSSR: ProjectList[] }) {
  const isLogin = useAppStore((state) => state.isLogin);
  const homeQuery = useAppStore((state) => state.homeQuery);
  const homeQeuryChange = useAppStore((state) => state.queryChange);
  const [detailOpen, setDetailOpen] = useState<boolean>(false);
  const [detailId, setDetailId] = useState<number>(0);
  const [projectList, setProjectList] = useState<ProjectList[]>(projectListSSR || []);
  const [page, setPage] = useState<string | number>(homeQuery.page);
  const [scrollCheck, setScrollCheck] = useState<boolean>(true);
  const observer = useRef<null | IntersectionObserver>(null);
  const alertMsgChange = useAppStore((state) => state.alertMsgChange);
  const alertTypeChange = useAppStore((state) => state.alertTypeChange);
  const category: { name: string; value: string }[] = [
    { name: "전체", value: "0" },
    { name: "스터디", value: "1" },
    { name: "운동", value: "2" },
    { name: "취미", value: "3" },
    { name: "기타", value: "4" },
  ];

  //-------------------function----------------------------------//
  const categoryChange = useCallback(async (value: string) => {
    homeQeuryChange({ keyword: "", category: value, page: 1 });
    try {
      const res = await axios.get(`/project/all_list?KEYWORD&PRO_CATEGORY=${value}&PAGE=1`);
      setProjectList(res.data.data);
    } catch (error) {
      console.log(error);
    }
  }, []);

  const getProjectList = async () => {
    try {
      const res = await axios.get(`/project/all_list?KEYWORD=${homeQuery.keyword}&PRO_CATEGORY=${homeQuery.category}&PAGE=${page}`);
      setProjectList((prev) => [...prev, ...res.data.data]);
      setScrollCheck(res.data.data.length === 10);
    } catch (error) {
      console.log(error);
    }
  };

  const lastDataRef = useCallback(
    (node: any) => {
      if (observer.current) observer.current?.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && scrollCheck) {
          setPage((prevPage) => +prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [scrollCheck]
  );

  const onDetailClick = (detialId: number) => {
    if (isLogin) {
      setDetailOpen(true);
      setDetailId(detialId);
    } else {
      alertMsgChange("로그인 후 이용해주세요");
      alertTypeChange("Warning");
    }
  };

  useEffect(() => {
    if (scrollCheck && page !== 1) {
      getProjectList();
    }
  }, [page]);

  useEffect(() => {
    axios
      .get(`/project/all_list?KEYWORD=${homeQuery.keyword}&PRO_CATEGORY=${homeQuery.category}&PAGE=1`)
      .then((res) => {
        if (res.data.data) {
          setProjectList(res.data.data);
        }
      })
      .catch((error) => console.log(error));
  }, [homeQuery.keyword]);

  return (
    <>
      <div>
        <CommonTopFiler category={category} categoryChange={categoryChange} valueCheck={homeQuery.category} newBtn={false} />
        <article>
          {projectList.length > 0 ? (
            <div className={styles.projectListWrapper}>
              {projectList.map((item: ProjectList, index: number) => {
                const date = new Date(item.PRO_REG_DT).toLocaleDateString();

                return (
                  <div key={item.PRO_ID} className={styles.projectBox} ref={projectList.length === index + 1 ? lastDataRef : null}>
                    <div>
                      <h4>{item.PRO_TITLE}</h4>
                      <div className={styles.imgArea}>
                        <Image
                          src={item.PRO_IMG ? `${process.env.NEXT_PUBLIC_SERVER_URL}/${item.PRO_IMG}` : "/images/default_project.jpg"}
                          alt={"프로젝트 이미지"}
                          fill
                        />
                      </div>
                    </div>
                    <div className={styles.content}>{item.PRO_CONTENT}</div>
                    <div className={styles.bottomInfo}>
                      <div className={styles.date}>{date}</div>
                      <button onClick={() => onDetailClick(item.PRO_ID)}>상세보기</button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <NoneData text="등록된 프로젝트가 없습니다." />
          )}
        </article>
      </div>
      {detailOpen && <ProjectDetailModal detailId={detailId} setDetailOpen={setDetailOpen} />}
    </>
  );
}
