import { useAppStore } from "@/store/store";
import styles from "../styles/home.module.scss";
import { useState, useRef, useCallback, useEffect } from "react";
import { HomeProjectList } from "@/interface/interface";
import NoneData from "@/components/NoneData";
import axios from "axios";
import ProjectDetailModal from "@/components/modal/ProjectDetailModal";

export const getServerSideProps = async () => {
  const res = await axios.get("/project/all_list?KEYWORD&PRO_CATEGORY=0&PAGE=1");

  return {
    props: {
      projectListSSR: res.data.data,
    },
  };
};

export default function Home({ projectListSSR }: { projectListSSR: HomeProjectList[] }) {
  const homeQuery = useAppStore((state) => state.homeQuery);
  const homeQeuryChange = useAppStore((state) => state.queryChange);
  const [detailOpen, setDetailOpen] = useState<boolean>(false);
  const [detailId, setDetailId] = useState<number>(0);
  const [projectList, setProjectList] = useState<HomeProjectList[]>(projectListSSR);
  const [page, setPage] = useState<string | number>(homeQuery.page);
  const [scrollCheck, setScrollCheck] = useState<boolean>(true);
  const observer = useRef<null | IntersectionObserver>(null);
  const category: { name: string; value: string }[] = [
    { name: "전체", value: "0" },
    { name: "스터디", value: "1" },
    { name: "운동", value: "2" },
    { name: "취미", value: "3" },
    { name: "기타", value: "4" },
  ];

  //-------------------function----------------------------------//
  const categoryChange = useCallback(async (value: string) => {
    homeQeuryChange({ keyword: homeQuery.keyword, category: value, page: 1 });
    try {
      const res = await axios.get(`/project/all_list?KEYWORD=${homeQuery.keyword}&PRO_CATEGORY=${value}&PAGE=1`);
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
    if (window.sessionStorage.getItem("token")) {
      setDetailOpen(true);
      setDetailId(detialId);
    } else {
      alert("로그인 후 이용해주세요");
    }
  };

  useEffect(() => {
    if (scrollCheck && page !== 1) {
      getProjectList();
    }
  }, [page]);

  return (
    <>
      <div className={styles.alleWrapper}>
        <ul className={styles.categoryArea}>
          {category.map((item) => {
            return (
              <li
                key={item.value}
                value={item.value}
                onClick={(e) => categoryChange(e.currentTarget.value.toString())}
                className={homeQuery.category === item.value ? styles.on : ""}
              >
                {item.name}
              </li>
            );
          })}
        </ul>
        <div>
          {projectList.length > 0 ? (
            <div className={styles.projectListWrapper}>
              {projectList.map((item: HomeProjectList, index: number) => {
                return (
                  <div key={item.PRO_ID} className={styles.projectBox} ref={projectList.length === index + 1 ? lastDataRef : null}>
                    <div>
                      <h4>{item.PRO_TITLE}</h4>
                      <img src={item.PRO_IMG ? item.PRO_IMG : "/images/default_project.jpg"} alt={"프로젝트 이미지"} />
                    </div>
                    <p>{item.PRO_CONTENT}</p>
                    <button onClick={() => onDetailClick(item.PRO_ID)}>상세보기</button>
                  </div>
                );
              })}
            </div>
          ) : (
            <NoneData text="등록된 프로젝트가 없습니다." />
          )}
        </div>
      </div>
      {detailOpen && <ProjectDetailModal detailId={detailId} setDetailOpen={setDetailOpen} />}
    </>
  );
}
