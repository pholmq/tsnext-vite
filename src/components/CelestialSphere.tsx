type Props = {
  visible: boolean;
};

export function CelestialSphere({ visible }) {
  return (
    <>
      <group>
        <mesh name="CelestialSphere" visible={visible}>
          <sphereGeometry args={[10, 64, 64]} />
          <meshBasicMaterial color="white" opacity={0.5} transparent />
        </mesh>
        <mesh name="CSLookAtObj"></mesh>
        <axesHelper args={[20]} />
      </group>
    </>
  );
}
