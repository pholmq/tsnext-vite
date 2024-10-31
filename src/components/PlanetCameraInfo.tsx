import { useEffect, useLayoutEffect, useRef } from "react";
import { useStore } from "../store";

import { posToDate, posToTime } from "../utils/time-date-functions";
import {
  azEl2RaDec,
  rad2lat,
  rad2lon,
  radiansToAzimuth,
} from "../utils/celestial-functions";

const PlanetCameraInfo = () => {
  const posRef = useStore((s) => s.posRef);

  const planetCamera = useStore((s) => s.planetCamera);
  const planetCameraHelper = useStore((s) => s.planetCameraHelper);
  const menuRight = useStore((s) => s.menuRight);
  const longInputRef = useRef(null);
  const { longRotationy, latRotationx, camRotationx, camRotationy } = useStore(
    (s) => s.planetCameraDirection
  );
  const latInputRef = useRef(null);
  const azimuthInputRef = useRef(null);
  const elevationInputRef = useRef(null);
  const intervalRef = useRef(null);

  useLayoutEffect(() => {
    if (planetCamera || planetCameraHelper) {
      const lat = rad2lat(latRotationx);
      const lon = rad2lon(longRotationy);
      const El = camRotationx * (180 / Math.PI);
      const Az = radiansToAzimuth(-camRotationy + Math.PI / 2);
      latInputRef.current.value = rad2lat(latRotationx);
      longInputRef.current.value = rad2lon(longRotationy);
      elevationInputRef.current.value = camRotationx * (180 / Math.PI);
      azimuthInputRef.current.value = radiansToAzimuth(
        -camRotationy + Math.PI / 2
      );
      const time = posToDate(posRef.current) + " " + posToTime(posRef.current);
      // console.log(azEl2RaDec(Az, El, lat, lon, time));
      // console.log(
      //   "Az0, El90, Lat0, Lon0, time 2000-03-20 12:00:00",
      //   azEl2RaDec(0, 90, 0, 0, "2000-03-20 12:00:00")
      // );
    }
  }, [
    longRotationy,
    latRotationx,
    camRotationx,
    camRotationy,
    planetCamera,
    planetCameraHelper,
  ]);

  function longKeyDown(e) {
    //Prevent planet camera from moving
    e.stopPropagation();

    if (e.key !== "Enter") {
      return;
    }
    (document.activeElement as HTMLElement).blur();
  }

  return (
    <>
      <p className="">Planet camera</p>
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
      <div className="flex items-center justify-center m-1">
        <label className="text-base text-white mr-2 ml-1 flex-1">
          Azimuth:
        </label>
        <input
          className="text-base text-white bg-gray-700 rounded p-1"
          ref={azimuthInputRef}
          onKeyDown={longKeyDown}
        />
      </div>
      <div className="flex items-center justify-center m-1">
        <label className="text-base text-white mr-2 ml-1 flex-1">
          Altitude:
        </label>
        <input
          className="text-base text-white bg-gray-700 rounded p-1"
          ref={elevationInputRef}
          onKeyDown={longKeyDown}
        />
      </div>
    </>
  );
};

export default PlanetCameraInfo;
