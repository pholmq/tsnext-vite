import { useFrame } from "@react-three/fiber";
export const useFrameInterval = (fn, delay = 0) => {
  let start = performance.now();

  useFrame(() => {
    let current = performance.now();
    let delta = current - start;

    if (delta >= delay) {
      fn.call();
      start = performance.now();
    }
  });
};
