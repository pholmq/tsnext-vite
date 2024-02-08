//test
import { useThree } from "@react-three/fiber";
import { useControls, folder } from "leva";
import { getRaDecDistance } from "../utils/celestial-functions";
import { useFrameInterval } from "../utils/useFrameInterval";

function WritePosition({ name }) {
  const { scene } = useThree();
  const [{ RA, Dec, Elongation, Km, AU }, set] = useControls(
    "Positions",
    () => ({
      [name]: folder(
        {
          RA: " ",
          Dec: " ",
          Elongation: " ",
          Km: { value: " ", label: "Kilometers" },
          AU: " ",
        },
        { collapsed: true }
      ),
    })
  );

  useFrameInterval(() => {
    const { ra, dec, elongation, distKm, distAU } = getRaDecDistance(
      name,
      scene
    );

    set({
      RA: ra,
      Dec: dec,
      Elongation: elongation,
      Km: distKm,
      AU: distAU,
    });
  }, 200);

  return null;
}

export default function PositionsWriter() {
  return (
    <>
      <WritePosition name="Moon" />
      <WritePosition name="Sun" />
      <WritePosition name="Mars" />
      <WritePosition name="Venus" />
      <WritePosition name="Mercury" />
    </>
  );
}
