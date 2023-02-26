import styles from "../styles/scrollTop.module.scss";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

export default function ScrollTop() {
  const onScrollTopClick = () => {
    window.scrollTo(0, 0);
  };

  return (
    <div className={styles.scrollTop} onClick={onScrollTopClick}>
      <KeyboardArrowUpIcon />
    </div>
  );
}
