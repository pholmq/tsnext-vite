import { useEffect, useLayoutEffect, useRef } from "react";
import { useStore } from "../store";
const PlanetCameraInfo = () => {
  const planetCamera = useStore((s) => s.planetCamera);
  const planetCameraHelper = useStore((s) => s.planetCameraHelper);
  const menuRight = useStore((s) => s.menuRight);
  const longInputRef = useRef(null);
  const { longRotationy, latRotationx, camRotationx, camRotationy } = useStore(
    (s) => s.planetCameraDirection
  );
  return (
    <>
      <p className="text-sm">Positions</p>
    </>
  );
};

export default PlanetCameraInfo;
