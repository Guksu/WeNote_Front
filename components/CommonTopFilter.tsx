import styles from "../styles/commonTopFilter.module.scss";
import PostAddIcon from "@mui/icons-material/PostAdd";
import { Dispatch, SetStateAction } from "react";

type Category = {
  name: string;
  value: string;
};

type Props = {
  category: Category[];
  categoryChange: (value: string) => Promise<void> | void;
  valueCheck: string;
  newBtn: boolean;
  setNewBtnOpen?: Dispatch<SetStateAction<boolean>>;
};

export default function CommonTopFiler({ category, categoryChange, valueCheck, newBtn, setNewBtnOpen }: Props) {
  return (
    <ul className={styles.categoryArea}>
      {category.map((item: Category) => {
        return (
          <li
            key={item.value}
            value={item.value}
            onClick={() => categoryChange(item.value.toString())}
            className={valueCheck === item.value ? styles.on : ""}
          >
            {item.name}
          </li>
        );
      })}
      <button
        style={{ display: newBtn ? "" : "none" }}
        onClick={() => {
          setNewBtnOpen && setNewBtnOpen(true);
        }}
      >
        <PostAddIcon />
      </button>
    </ul>
  );
}
