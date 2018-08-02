import Config from "./config";
import Terrain from "./terrain";
import CTD from "./ctd";
import Track from "./track";
import Creature from "./creature";
import Information from "./information";
import Sidemenu from "./sidemenu";

export default function createStore(earth) {
  const config = new Config(earth);
  const terrain = new Terrain(earth);
  const ctd = new CTD(earth);
  const track = new Track(earth);
  const creature = new Creature(earth);
  const information = new Information(earth);
  const sidemenu = new Sidemenu(earth);
  return {
    config,
    terrain,
    ctd,
    track,
    creature,
    information,
    sidemenu
  };
}
