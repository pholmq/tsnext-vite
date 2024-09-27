import React from "react";
import { useStore } from "../store";
const PlanetCameraInfo = () => {
  const planetCamera = useStore((s) => s.planetCamera);

  return planetCamera ? (
    <div className="absolute top-4 right-4 p-4 bg-white bg-opacity-75 rounded shadow">
      <p>Planet Camera</p>
      <p>Change latutude and longitude with W,A,S,D</p>
      <p>Height with Q,E</p>
      <p>
        {" "}
        Longitude:&nbsp;
        <input
          type="text"
          className="border border-gray-300 rounded px-2 py-1"
          placeholder="Enter text"
        />
      </p>
    </div>
  ) : null;
};

export default PlanetCameraInfo;
