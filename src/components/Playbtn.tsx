import styles from "./Playbtn.module.css";
import { FaBeer } from "react-icons/fa";
export default function Playbtn() {
  return (
    <>
      <div  className={styles.play_pause}>
        <button>
          <FaBeer />
        </button>
      </div>

      {/* <div className={styles.playpause}>
        <FaBeer />
        <input type="checkbox" value="None" id="playpause" name="check" />
        <label htmlFor="playpause"></label>
      </div> */}
    </>
  );
}
