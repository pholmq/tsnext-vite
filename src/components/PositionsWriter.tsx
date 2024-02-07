//test
import { useThree } from "@react-three/fiber";
import { useControls, folder } from "leva";
import { getRaDecDistance } from "../utils/celestial-functions";
import { useFrameInterval } from "../utils/useFrameInterval";

export default function PositionsWriter() {
  const { scene } = useThree();

  const [{ RA, Dec, Elongation, Km, AU }, setMoon] = useControls(
    "Positions",
    () => ({
      Moon: folder({
        RA: " ",
        Dec: " ",
        Elongation: " ",
        Km: { value: " ", label: "Kilometers" },
        AU: " ",
      }),
    })
  );

  useFrameInterval(() => {
    const { ra, dec, elongation, distKm, distAU } = getRaDecDistance(
      "Moon",
      scene
    );
    // console.log(getRaDecDistance("Moon", scene));
    setMoon({
      RA: ra,
      Dec: dec,
      Elongation: elongation,
      Km: distKm,
      AU: distAU,
    });
  }, 100);

  return null;
}
