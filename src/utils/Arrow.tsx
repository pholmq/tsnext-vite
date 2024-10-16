function Arrow({ size = 0.4, length = 2, color = "red" }) {
  return (
    <>
      {/* Arrow shaft */}
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[size / 10, size / 10, length, 32]} />
        <meshStandardMaterial color={color} />
      </mesh>

      {/* Arrow head */}
      <mesh position={[0, length / 2, 0]} rotation={[0, 0, 0]}>
        <coneGeometry args={[size / 4, size, 32]} />
        <meshStandardMaterial color="red" />
      </mesh>
    </>
  );
}

export default Arrow;
