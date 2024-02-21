import { useStore } from "../store";
import { useFrame } from "@react-three/fiber";

//Note: Controls handles most of this but we need to have the useFrame hook
//within the canvas component

const AnimationController = () => {
  const posRef: any = useStore((s) => s.posRef);
  const run = useStore((s) => s.run);
  const speedFact = useStore((s) => s.speedFact);
  const speedmultiplier = useStore((s) => s.speedmultiplier);
  useFrame((state, delta) => {
    if (run) {
      posRef.current = posRef.current + delta * (speedFact * speedmultiplier);
    }
  });
  return null;
};

export default AnimationController;
