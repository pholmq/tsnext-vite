import { useEffect, useLayoutEffect, useRef } from "react";
import { useStore, usePosStore } from "../store";
import PlanetCameraInfo from "./PlanetCameraInfo";
import PositionsInfo from "./PositionsInfo";
const InfoPanel = () => {
  const menuRight = useStore((s) => s.menuRight);
  const planetCamera = useStore((s) => s.planetCamera);
  const planetCameraHelper = useStore((s) => s.planetCameraHelper);
  const showPositions = useStore((s) => s.showPositions);
  return (
    <>
      <div
        id=""
        className={`overflow-auto flex flex-col max-h-[99vh] absolute top-0
      ${menuRight ? "left-0" : "right-0"}
      m-1 bg-gray-900 opacity-80 rounded-md select-none`}
      >
        {planetCamera || planetCameraHelper ? <PlanetCameraInfo /> : null}
        {showPositions ? <PositionsInfo /> : null}
      </div>
    </>
  );
};

export default InfoPanel;
