import { useStore } from "../store";
import { useFrame } from "@react-three/fiber";
import { posToDate, posToTime } from "../utils/time-date-functions";

//Note Controls handles most of this but we need to have the useFrame hook
//within the canvas component

const AnimationController = () => {
  const posRef: any = useStore((s) => s.posRef);
  // useStore.getState().orbits,
  // const date: any = useStore((s) => s.date);
  const date: any = useStore.getState().date;
  const time: any = useStore.getState().time;
  const run = useStore((s) => s.run);
  const speedFact = useStore((s) => s.speedFact);
  let deltaSum = 0;
  useStore.setState({ date: posToDate(posRef.current) });
  useStore.setState({ time: posToTime(posRef.current) });
  useFrame((state, delta) => {
    if (run) {
      // posRef.current = posRef.current + delta * 0.1;
      posRef.current = posRef.current + delta * speedFact;
      deltaSum += delta;
      if (deltaSum > 0.01) {
        //needs to be about 0.1 otherwise framerate drops with a high speed fact
          useStore.setState({ date: posToDate(posRef.current) });
        if ( speedFact < 0.002 ) {
          //quickndirty speed fact check since time being updated looks ugly
          useStore.setState({ time: posToTime(posRef.current) });

        }
        // if (posToDate(posRef.current) != date) {
        //   useStore.setState({ date: posToDate(posRef.current) });
        // }
        // if ( speedFact < 0.002 && posToTime(posRef.current) != time) {
        //   //quickndirty speed fact check since time being updated looks ugly
        //   useStore.setState({ time: posToTime(posRef.current) });

        // }

        deltaSum = 0;
      }
    } 
  });
  return null;
};

export default AnimationController;
