import styles from "../styles/default.module.scss";

export default function NoneData({ text }: { text: string }) {
  return <div className={styles.noneData}>{text}</div>;
}
