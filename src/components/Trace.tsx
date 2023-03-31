import { useRef, useState } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { Vector3 } from "three";

export function Trace({traceOn, name}) {
  const { scene } = useThree();
  if (traceOn) {
    //Init trace
    const csPos = new Vector3();
    scene.getObjectByName(name).getWorldPosition(csPos);
    console.log("trace is: " + traceOn + " Positon of " + name + " is " + csPos.x)

  } else {
    console.log("trace is: " + traceOn)
    //Reset trace
  }



  return (
    <>
    </>
  );
}
