//test
import { useThree } from "@react-three/fiber";
import { useControls, folder } from "leva";
import { getRaDecDistance } from "../utils/celestial-functions";
import { useFrameInterval } from "../utils/useFrameInterval";
import { useEffect, useLayoutEffect, useRef } from "react";
import { useStore, useTraceStore } from "../store";

function WritePosition({ name }) {
  const { scene, camera } = useThree();
  const intervalRef = useRef(0);
  const run = useStore((s) => s.run);
  const runPosWriter = useStore((s) => s.runPosWriter);

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

  function setPos() {
    const { ra, dec, elongation, distKm, distAU } = getRaDecDistance(
      name,
      scene,
      camera
    );

    set({
      RA: ra,
      Dec: dec,
      Elongation: elongation,
      Km: distKm,
      AU: distAU,
    });
  }

  // if (scene.ready) setPos();

  useEffect(() => {
    const timeout = setTimeout(() => {
      //Bugfix. We need to wait a little so that the
      //three object actually has moved
      setPos();
    }, 100);
    return () => clearTimeout(timeout);
  }, [runPosWriter]);

  useEffect(() => {
    // console.log("sdff");
    setPos();
    if (run) {
      intervalRef.current = setInterval(() => {
        setPos();
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
  }, [run]);

  return null;
}

export default function PositionsWriter() {
  return (
    <>
      <WritePosition name="Camera" />
      <WritePosition name="Moon" />
      <WritePosition name="Sun" />
      <WritePosition name="Mars" />
      <WritePosition name="Venus" />
      <WritePosition name="Mercury" />
    </>
  );
}
