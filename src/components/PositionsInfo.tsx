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
  const posRefs = usePosStore((s) => s.positionRefs);

  const posRef = posRefs.find((item) => item.name === name);
  console.log(
    "name: ",
    name,
    "posRef.name: ",
    posRef.name,
    "posRef.ref.current.ra: " + posRef.ref.current.ra
  );
  const raRef = useRef(null);
  const trackedIntervalRef = useRef(null);
  useEffect(() => {
    trackedIntervalRef.current = setInterval(() => {
      if (raRef.current) {
        const { ra, dec, elongation, distKm, distAU, x, y, z } =
          posRef.ref.current;
        raRef.current.value = ra;
      }
    }, 100);
    return () => {
      // Cleanup code
      clearInterval(trackedIntervalRef.current);
    };
  }, []);

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
