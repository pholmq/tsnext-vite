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
          <Cobj name="MoonDefA">
            <Cobj name="MoonDefB">
              <Cobj name="Moon" />
            </Cobj>
          </Cobj>
          <Cobj name="SunDefA">
            <Cobj name="Sun">
              <Cobj name="JupiterDef">
                <Cobj name="Jupiter" />
              </Cobj>
              <Cobj name="SaturnDef">
                <Cobj name="Saturn" />
              </Cobj>
            </Cobj>
          </Cobj>
          <Cobj name="VenusDefA">
            <Cobj name="VenusDefB">
              <Cobj name="Venus" />
            </Cobj>
          </Cobj>
          <Cobj name="MercuryDefA">
            <Cobj name="MercuryDefB">
              <Cobj name="Mercury" />
            </Cobj>
          </Cobj>
          <Cobj name="MarsDefE">
            <Cobj name="MarsDefS">
              <Cobj name="Mars" />
            </Cobj>
          </Cobj>
        </Cobj>
      </Cobj>
    </group>
  );
};
export default SolarSystem;
