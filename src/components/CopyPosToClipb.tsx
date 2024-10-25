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
      result += "Date: " + posToDate(posRef.current) + "\n";
      result += "Time: " + posToTime(posRef.current) + "\n";

      planetsArr.forEach((e) => {
        const v = getRaDecDistance(e, scene, camera);
        result += "\n" + e + "\n";
        result += "RA: " + v.ra + "\n";
        result += "Dec: " + v.dec + "\n";
        result += "Dist: " + v.dist + "\n";
        result += "AU: " + v.distAU + "\n";
        result += "Elongation: " + v.elongation + "\n";
      });
      navigator.clipboard.writeText(result);
    }),
  });

  return null;
}
