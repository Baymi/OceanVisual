import AntdAnimation from "./AntdAnimation";
import AntdTable from "./AntdTable";
import Terrain from "./terrain";
import CTD from "./ctd";
import Track from "./track";
import Creature from "./creature";
import Information from "./information";
const plugins = {};

plugins.AntdAnimation = AntdAnimation;
plugins.AntdTable = AntdTable;
plugins.Terrain = Terrain;
plugins.CTD = CTD;
plugins.Track = Track;
plugins.Creature = Creature;
plugins.Information = Information;
// export { default as Wind } from './Wind';
export default plugins;
