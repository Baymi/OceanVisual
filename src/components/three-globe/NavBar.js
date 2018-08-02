import React from "react";
import style from "./Globe.css";
// import creatAll from "./creatAll";
import { showLoader } from "../../utils/loader";

const NavPic = ({ oriPic, hoverPic, bottom }) => (
  <img
    src={hoverPic}
    className={style.NavImg}
    alt=""
    style={{
      marginBottom: `${bottom}px`
    }}
  />
);

const NavPic2 = ({ oriPic, hoverPic, bottom, routeTo }) => (
  <img
    src={hoverPic}
    className={style.NavImg2}
    onClick={() => {
      showLoader();
      routeTo();
    }}
    alt=""
    style={{
      marginBottom: `${bottom}px`
    }}
  />
);

class NavBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = { active: false };
  }
  render() {
    return (
      <div>
        <div className={style.navbar}>
          <NavPic
            hoverPic="./resource/home/images/海底地形.png"
            bottom={-20}
            alt=""
          />
          <NavPic
            hoverPic="./resource/home/images/近海观测.png"
            bottom={0}
            alt=""
          />
          <NavPic
            hoverPic="./resource/home/images/科考航迹.png"
            bottom={20}
            alt=""
          />
          <NavPic
            hoverPic="./resource/home/images/海洋生物.png"
            bottom={0}
            alt=""
          />
          <NavPic
            hoverPic="./resource/home/images/开放数据.png"
            bottom={-20}
            alt=""
          />
        </div>

        <div className={style.navbar}>
          <NavPic2
            hoverPic="./resource/home/images/海底地形.png"
            bottom={-20}
            routeTo={() => window.location.replace("#Terrain")}
            alt=""
          />
          <NavPic2
            hoverPic="./resource/home/images/近海观测.png"
            bottom={0}
            routeTo={() => window.location.replace("#CTD")}
            alt=""
          />
          <NavPic2
            hoverPic="./resource/home/images/科考航迹.png"
            bottom={20}
            routeTo={() => window.location.replace("#Track")}
            alt=""
          />
          <NavPic2
            hoverPic="./resource/home/images/海洋生物.png"
            bottom={0}
            routeTo={() => window.location.replace("#Creature")}
            alt=""
          />
          <NavPic2
            url="./china"
            hoverPic="./resource/home/images/开放数据.png"
            bottom={-20}
            routeTo={() => window.location.replace("#Information")}
            alt=""
          />
        </div>
      </div>
    );
  }
}

export default NavBar;
