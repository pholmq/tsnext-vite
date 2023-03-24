
import { Pobj } from "./Pobj";

const PlotSolarSystem = () => {
  
    return (
      <group>
        <Pobj name="SystemCenter">
          <Pobj name="Earth">
            <Pobj name="MoonDefA">
              <Pobj name="MoonDefB">
                <Pobj name="Moon" />
              </Pobj>
            </Pobj>
            <Pobj name="SunDefA">
              <Pobj name="Sun">
                <Pobj name="JupiterDef">
                  <Pobj name="Jupiter" />
                </Pobj>
                <Pobj name="SaturnDef">
                  <Pobj name="Saturn" />
                </Pobj>
              </Pobj>
            </Pobj>
            <Pobj name="VenusDefA">
              <Pobj name="VenusDefB">
                <Pobj name="Venus" />
              </Pobj>
            </Pobj>
            <Pobj name="MercuryDefA">
              <Pobj name="MercuryDefB">
                <Pobj name="Mercury" />
              </Pobj>
            </Pobj>
            <Pobj name="MarsDefE">
              <Pobj name="MarsDefS">
                <Pobj name="Mars" />
              </Pobj>
            </Pobj>
          </Pobj>
        </Pobj>
      </group>
    );
  };
  export default PlotSolarSystem