import { useEffect, useLayoutEffect, useRef } from "react";
import { useStore } from "../store";
const PlanetCameraInfo = () => {
  const planetCamera = useStore((s) => s.planetCamera);
  const planetCameraHelper = useStore((s) => s.planetCameraHelper);
  const menuRight = useStore((s) => s.menuRight);
  const longInputRef = useRef(null);
  const long = useStore((s) => s.planetCameraDirection.longRotationy);
  const latInputRef = useRef(null);
  const lat = useStore((s) => s.planetCameraDirection.latRotationx);
  // const lat = useStore((s) => s.planetCameraPosition.lat);
  const intervalRef = useRef(null);

  function rad2lat(rad: number) {
    // Convert radians to degrees
    let deg = (rad * 180) / Math.PI;

    // Normalize to -180 to 180 range
    deg = deg % 360;

    // Adjust for latitude range (-90 to 90)
    if (deg > 90) {
      deg = 180 - deg;
    } else if (deg < -90) {
      deg = -180 - deg;
    }

    // Round to 6 decimal places
    return Math.round(deg * 1000000) / 1000000;
  }
  function rad2lon(rad: number) {
    let deg = (rad * 180) / Math.PI;
    deg = deg % 360;

    if (deg > 180) {
      deg -= 360;
    } else if (deg < -180) {
      deg += 360;
    }

    return Math.round(deg * 1000000) / 1000000;
  }

  useLayoutEffect(() => {
    if (planetCamera || planetCameraHelper) {
      longInputRef.current.value = rad2lon(long);
      latInputRef.current.value = rad2lat(lat);
    }
  }, [long, lat, planetCamera, planetCameraHelper]);

  function longKeyDown(e) {
    //Prevent planet camera from moving
    e.stopPropagation();

    if (e.key !== "Enter") {
      return;
    }
    (document.activeElement as HTMLElement).blur();
  }

  return planetCamera || planetCameraHelper ? (
    <div
      id="controls"
      className={`flex flex-col max-h-[95vh] absolute top-0
      ${menuRight ? "left-0" : "right-0"}
      m-1 bg-gray-900 opacity-80 rounded-md select-none`}
    >
      {/* <div className="select-none pointer-events-none absolute top-4 right-4 p-4 bg-white bg-opacity-75 rounded shadow"> */}
      {/* <p>Planet Camera</p> */}
      <p className="text-sm">Change latutude and longitude with W,A,S,D</p>
      <p className="text-sm">Height with Q,E</p>
      <p>_</p>
      <div className="flex items-center justify-center m-1">
        <label className="text-base text-white mr-2 ml-1 flex-1">
          Latitude:
        </label>
        <input
          className="text-base text-white bg-gray-700 rounded p-1"
          ref={latInputRef}
          onKeyDown={longKeyDown}
        />
      </div>
      <div className="flex items-center justify-center m-1">
        <label className="text-base text-white mr-2 ml-1 flex-1">
          Longitude:
        </label>
        <input
          className="text-base text-white bg-gray-700 rounded p-1"
          ref={longInputRef}
          onKeyDown={longKeyDown}
        />
      </div>
    </div>
  ) : null;
};

export default PlanetCameraInfo;
