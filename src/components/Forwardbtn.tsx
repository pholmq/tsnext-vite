import styles from "./Forwardbtn.module.css";
export default function Forwardbtn() {
  return (
      <div className={styles.forward}>
        <input type="checkbox" value="None" id="forward" name="check" />
        <label htmlFor="forward"></label>
      </div>
  );
}
