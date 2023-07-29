import { useRef, useState, useEffect, useLayoutEffect } from "react";
import { useFrame, extend, useThree } from "@react-three/fiber";
import { useStore } from "../store";
import { Line } from "@react-three/drei";
import { Vector3 } from "three";
import { MeshLineGeometry, MeshLineMaterial } from "meshline";
import { Object3DNode, MaterialNode } from "@react-three/fiber";
declare module "@react-three/fiber" {
  interface ThreeElements {
    meshLineGeometry: Object3DNode<MeshLineGeometry, typeof MeshLineGeometry>;
    meshLineMaterial: MaterialNode<MeshLineMaterial, typeof MeshLineMaterial>;
  }
}

extend({ MeshLineGeometry, MeshLineMaterial });

function TraceLine({ points }) {
  return (
    <>
      <Line points={points} linewidth={3} color="red" />
    </>
  );
}

export default function TraceController() {
  const traceOn = useStore((s) => s.trace);
  // const [points, setPoints] = useState([[0, 0, 0]]);
  // const { scene } = useThree();
  const positions = useRef([]);
  // const marsObj = useRef(null);

  const lineRef = useRef(null);

  // const plotPos = useStore.getState().plotPos;
  // const traceStep = useStore.getState().traceStep;
  // const posRef = useStore.getState().posRef;
  // const tracePosRef = useStore.getState().tracePosRef;
  // const plotPosRef = useStore.getState().plotPosRef;
  const { traceStep, posRef, tracePosRef, plotPosRef, plotObjects } =
    useStore.getState();
  let deltaSum = 0;

  // let index = 0;
  // const pointsArr = [];
  const objectPos = new Vector3();
  const objMars = plotObjects.find((item) => item.name === "Mars");
  const objVenus = plotObjects.find((item) => item.name === "Venus");
  let pointsTest = [new Vector3()];
  // console.log(plotObjects)
  useFrame((state, delta) => {
    // console.log("blblblb")
    // deltaSum += delta;
    if (traceOn) {
      if (useStore.getState().traceInit) {
        useStore.setState({ traceInit: false });
        tracePosRef.current = posRef.current;
        plotPosRef.current = tracePosRef.current;
        pointsArrRef.current = [];
      }
      if (tracePosRef.current + traceStep < posRef.current) {
        while (tracePosRef.current + traceStep < posRef.current) {
          tracePosRef.current = tracePosRef.current + traceStep;
          // useStore.setState({ plotPos: tracePosRef.current });
          plotPosRef.current = tracePosRef.current;
          objMars.obj.getWorldPosition(objectPos);
          pointsArrRef.current.push(objectPos);
          // console.log(pointsArrRef.current);
          // setPoints([...pointsArrRef.current]);
          // pointsTest = [...pointsArrRef.current]
          // objVenus.obj.getWorldPosition(objectPos);
          // pointsArrRefV.current.push(objectPos);
          // setPointsVenus([...pointsArrRefV.current]);
          setPoints([...pointsArrRef.current]);
        }
      }

      // while (tracePosRef.current + traceStep < posRef.current) {
      //   tracePosRef.current = tracePosRef.current + traceStep;
      //   useStore.setState({ plotPos: tracePosRef.current });
      //   obj.obj.getWorldPosition(objectPos);
      //   pointsArrRef.current.push(objectPos);
      //   setPoints([...pointsArrRef.current]);
      // }
    }
  });
  // const points = [new Vector3(0, 0, 0), new Vector3(10, 0, 0)];
  const [points, setPoints] = useState([new Vector3(-1, -1, -1)]);
  const [pointsVenus, setPointsVenus] = useState([new Vector3()]);
  const pointsRef = useRef([new Vector3(0, 0, 0)]);
  const pointsArrRef = useRef([]);
  const pointsArrRefV = useRef([]);
  const mlRef = useRef();
  // if (traceOn) {
  //   console.log("hello");
  // pointsRef.current = [
  //   new Vector3(0, 0, 0),
  //   new Vector3(-10, 0, 0),
  //   new Vector3(0, 10, 0),
  // ];
  // }

  // lineRef.geometry.attributes.position.needsUpdate = true
  return (
    <>
      <TraceLine points={points} />
      {/* <TraceLine points={pointsVenus} /> */}
      {/* <mesh>
        <meshLineGeometry ref={mlRef}  />
        <meshLineMaterial lineWidth={0.05} color={"red"} sizeAttenuation={0} />
      </mesh> */}

      {/* <Line ref={lineRef} points={points} linewidth={3} color="red" /> */}
    </>
  );
  // <TraceLine points={points} />;
}
