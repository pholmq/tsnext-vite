import { useEffect, useLayoutEffect, useRef } from "react";
import { useStore } from "../store";
const PositionsInfo = () => {
  const planetCamera = useStore((s) => s.planetCamera);
  const planetCameraHelper = useStore((s) => s.planetCameraHelper);
  const menuRight = useStore((s) => s.menuRight);
  const longInputRef = useRef(null);
  const { longRotationy, latRotationx, camRotationx, camRotationy } = useStore(
    (s) => s.planetCameraDirection
  );
  return (
    <>
      <p className="">Positions</p>
      <p className="text-sm">Moon</p>
      <div className="flex items-center justify-center m-1">
        <label className="text-base text-white mr-2 ml-1 flex-1">RA:</label>
        <input className="text-base text-white bg-gray-700 rounded p-1" />
      </div>
      <div className="flex items-center justify-center m-1">
        <label className="text-base text-white mr-2 ml-1 flex-1">Dec:</label>
        <input className="text-base text-white bg-gray-700 rounded p-1" />
      </div>
      <div className="flex items-center justify-center m-1">
        <label className="text-base text-white mr-2 ml-1 flex-1">AU:</label>
        <input className="text-base text-white bg-gray-700 rounded p-1" />
      </div>
    </>
  );
};

export default PositionsInfo;
