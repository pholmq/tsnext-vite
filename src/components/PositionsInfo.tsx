import { useEffect, useLayoutEffect, useRef } from "react";
import { usePosStore } from "../store";
export default function PositionsInfo() {
  const trackedObjects = usePosStore((s) => s.trackedObjects);

  return (
    <>
      <p className="">Positions</p>

      {trackedObjects.map((item, index) => (
        <Position key={index} name={item} />
      ))}
    </>
  );
}

function Position({ name }) {
  const raRef = useRef(null);
  const positions = usePosStore((s) => s.positions);
  useEffect(() => {
    const { [name]: position } = positions;
    if (!position) return;
    const { ra, dec, elongation, distKm, distAU, x, y, z } = position;
    raRef.current.value = ra;
  }, [positions]);

  return (
    <>
      <p className="text-sm">{name}</p>
      <div className="flex items-center justify-center m-1">
        <label className="text-base text-white mr-2 ml-1 flex-1">RA:</label>
        <input
          className="text-base text-white bg-gray-700 rounded p-1"
          ref={raRef}
        />
      </div>
      <div className="flex items-center justify-center m-1">
        <label className="text-base text-white mr-2 ml-1 flex-1">Dec:</label>
        <input className="text-base text-white bg-gray-700 rounded p-1" />
      </div>
      <div className="flex items-center justify-center m-1">
        <label className="text-base text-white mr-2 ml-1 flex-1">Dist:</label>
        <input className="text-base text-white bg-gray-700 rounded p-1" />
      </div>
    </>
  );
}
