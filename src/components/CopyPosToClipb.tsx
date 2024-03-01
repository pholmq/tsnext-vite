import { button, useControls } from "leva";
import { getRaDecDistance } from "../utils/celestial-functions";
import { useThree } from "@react-three/fiber";
import { posToDate, posToTime } from "../utils/time-date-functions";
import { useStore } from "../store";
import { Quaternion, Vector3 } from "three";

export function CopyPosToClipb() {
  const { scene, camera } = useThree();
  const posRef = useStore((s) => s.posRef);

  useControls("Positions", {
    "Copy all positions to the clipboard": button(() => {
      const planetsArr = [
        "Moon",
        "Sun",
        "Mars",
        "Venus",
        "Mercury",
        "Jupiter",
        "Saturn",
        "Uranus",
        "Neptune",
      ];
      let result = "The Tychosium" + "\n";
      // getAllPositions()
      // result += "Pos: " + posRef.current + "\n";
      result += "Date: " + posToDate(posRef.current) + "\n";
      result += "Time: " + posToTime(posRef.current) + "\n";

      // const earth = scene.getObjectByName("Earth");
      // const objectPos = new Vector3();

      // earth.getWorldPosition(objectPos);
      // result += "\n" + "Earth" + "\n";
      // result += "X: " + objectPos.x + "\n";
      // result += "Y: " + objectPos.y + "\n";
      // result += "Z: " + objectPos.z + "\n\n";

      // let q = new Quaternion();
      // earth.getWorldQuaternion(q);
      // result += "Earth orientation: " + "\n";
      // result += "W: " + q.w + "\n";
      // result += "X: " + q.x + "\n";
      // result += "Y: " + q.y + "\n";
      // result += "Z: " + q.z + "\n";

      planetsArr.forEach((e) => {
        const v = getRaDecDistance(e, scene, camera);
        result += "\n" + e + "\n";
        result += "RA: " + v.ra + "\n";
        result += "Dec: " + v.dec + "\n";
        result += "Km: " + v.distKm + "\n";
        result += "AU: " + v.distAU + "\n";
        result += "Elongation: " + v.elongation + "\n";

        // result += "X: " + v.x + "\n";
        // result += "Y: " + v.y + "\n";
        // result += "Z: " + v.z + "\n";
      });
      navigator.clipboard.writeText(result);
    }),
  });

  return null;
}
