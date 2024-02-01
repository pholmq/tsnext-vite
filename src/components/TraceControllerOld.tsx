import { useRef, useState, useEffect, useLayoutEffect } from "react";
import { useFrame, extend, useThree } from "@react-three/fiber";
import { useStore } from "../store";
import { Line } from "@react-three/drei";
import { Vector3, CatmullRomCurve3 } from "three";
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

function moveModel(plotObjects: any, plotPos: any) {
  const objectPos = new Vector3();
  plotObjects.forEach((pObj) => {
    pObj.pivotRef.current.getWorldPosition(objectPos);
    console.log(pObj.name, " ", objectPos);
    pObj.orbitRef.current.rotation.y =
      pObj.speed * plotPos - pObj.startPos * (Math.PI / 180);
    console.log(pObj, "pObj.speed * plotPos: ", pObj.speed * plotPos);
  });
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
  const {
    traceStep,
    traceLength,
    posRef,
    tracePosRef,
    plotPosRef,
    plotObjects,
  } = useStore.getState();
  let deltaSum = 0;

  // let index = 0;
  // const pointsArr = [];
  const objectPos = new Vector3();
  const objMars = plotObjects.find((item) => item.name === "Mars");
  // console.log(objMars);
  // const objVenus = plotObjects.find((item) => item.name === "Venus");
  const objSystemCenter = plotObjects.find(
    (item) => item.name === "SystemCenter"
  );

  let pointsTest = [new Vector3()];
  // console.log(plotObjects);

  useFrame((state, delta) => {
    // console.log("blblblb")
    // deltaSum += delta;
    if (traceOn) {
      if (useStore.getState().traceInit) {
        useStore.setState({ traceInit: false });
        tracePosRef.current = posRef.current;
        plotPosRef.current = posRef.current;
        pointsArrRef.current = [];
        // setPoints([new Vector3(-1, -1, -1)]);
      } else {
        if (pointsArrRef.current.length >= traceLength) {
          // console.log("if (pointsArrRef.current.length > traceLength)");
          pointsArrRef.current.splice(0, 1);
        }

        if (tracePosRef.current + traceStep >= posRef.current - traceStep) {
          if (pointsArrRef.current.length) {
            pointsArrRef.current.pop();
            tracePosRef.current = tracePosRef.current - traceStep;
            plotPosRef.current = tracePosRef.current;
          } else {
            tracePosRef.current = posRef.current;
            plotPosRef.current = tracePosRef.current;
          }
        }

        if (tracePosRef.current <= posRef.current - traceStep) {
          plotPosRef.current = tracePosRef.current + traceStep;
          tracePosRef.current = tracePosRef.current + traceStep;
          // plotPosRef.current = tracePosRef.current;

          moveModel(plotObjects, plotPosRef.current);

          // console.log(objSystemCenter);
          // objSystemCenter.obj.updateWorldMatrix(false, true);
          // objMars.obj.getWorldPosition(objectPos);
          // pointsArrRef.current.push(objectPos);
          // console.log(pointsArrRef.current);
          // setPoints([...pointsArrRef.current]);
        }

        if (pointsArrRef.current.length > 1) {
          const curve = new CatmullRomCurve3(pointsArrRef.current);

          setPoints(curve.getPoints(pointsArrRef.current.length * 2));

          // setPoints([...pointsArrRef.current]);
        }
      }
    }
  });
  const [points, setPoints] = useState([new Vector3(-1, -1, -1)]);
  const [pointsVenus, setPointsVenus] = useState([new Vector3()]);
  const pointsRef = useRef([new Vector3(0, 0, 0)]);
  const pointsArrRef = useRef([]);
  const pointsArrRefV = useRef([]);
  const mlRef = useRef();
  return <>{/* <TraceLine points={points} /> */}</>;
}
