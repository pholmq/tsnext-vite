import { Cobj } from "./Cobj";
// import { useThree } from "@react-three/fiber";

const SolarSystem = () => {
  // const { scene } = useThree();
  // const meshObjects = scene.children.filter(child => child.type === 'Mesh');
  // const meshObject = scene.getObjectByName('Earth');
  // console.log(meshObject);
  return (
    <group>
      <Cobj name="SystemCenter">
        <Cobj name="Earth">
          <Cobj name="Moon deferent A">
            <Cobj name="Moon deferent B">
              <Cobj name="Moon" />
            </Cobj>
          </Cobj>
          <Cobj name="Sun deferent">
            <Cobj name="Sun">
              <Cobj name="Jupiter deferent">
                <Cobj name="Jupiter" />
              </Cobj>
              <Cobj name="Saturn deferent">
                <Cobj name="Saturn" />
              </Cobj>
            </Cobj>
          </Cobj>
          <Cobj name="Venus deferent A">
            <Cobj name="Venus deferent B">
              <Cobj name="Venus" />
            </Cobj>
          </Cobj>
          <Cobj name="Mercury def A">
            <Cobj name="Mercury def B">
              <Cobj name="Mercury" />
            </Cobj>
          </Cobj>
          <Cobj name="Mars E deferent">
            <Cobj name="Mars S deferent">
              <Cobj name="Mars">
                {/* <Cobj name="Phobos" />
                <Cobj name="Deimos" /> */}
              </Cobj>
            </Cobj>
          </Cobj>
        </Cobj>
      </Cobj>
    </group>
  );
};
export default SolarSystem;
