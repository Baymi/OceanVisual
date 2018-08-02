import React from "react";
import {
  Menu,
  List,
  Icon,
  Button,
  Input,
  Select,
  DatePicker,
  Cascader,
  Divider,
  Card,
  Row,
  Col
} from "antd";
import { inject, observer } from "mobx-react";
import QueueAnim from "rc-queue-anim";
import styles from "./style.css";

const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;
const Search = Input.Search;
const Option = Select.Option;
const { MonthPicker, RangePicker, WeekPicker } = DatePicker;

const menuOp = [
  {
    value: "project",
    label: "海洋专项数据库",
    children: [
      {
        value: "earth",
        label: "地球科学大数据项目"
      },
      {
        value: "sea",
        label: "海洋科学大数据项目"
      },
      {
        value: "physic",
        label: "海洋物理大数据项目"
      },
      {
        value: "chemistry",
        label: "海洋化学大数据项目"
      }
    ]
  },
  {
    value: "network",
    label: "中国近海观测网络数据库",
    children: [
      {
        value: "buoy",
        label: "浮标数据库"
      },
      {
        value: "submersible",
        label: "潜标数据库"
      }
    ]
  },
  {
    value: "track",
    label: "开放航次数据库",
    children: [
      {
        value: "track1",
        label: "开放航次数据库"
      }
    ]
  },
  {
    value: "sensing",
    label: "中国近海遥感数据库",
    children: [
      {
        value: "terrain",
        label: "海底地形数据库"
      },
      {
        value: "disaster",
        label: "海洋灾害数据库"
      }
    ]
  }
];

const Listdata = [
  {
    key: "1",
    value: "1",
    label: "东海01号浮标"
  },
  {
    key: "2",
    value: "2",
    label: "东海02号浮标"
  },
  {
    key: "3",
    value: "3",
    label: "东海03号浮标"
  },
  {
    key: "4",
    value: "4",
    label: "东海04号浮标"
  },
  {
    key: "5",
    value: "5",
    label: "黄海01号浮标"
  },
  {
    key: "6",
    value: "6",
    label: "黄海02号浮标"
  },
  {
    key: "7",
    value: "7",
    label: "黄海03号浮标"
  },
  {
    key: "8",
    value: "8",
    label: "黄海04号浮标"
  }
];

@inject(stores => ({
  toggleShow: stores.information.toggleShow,
  toggleList: stores.information.toggleList,
  toggleList2: stores.information.toggleList2,
  reset: stores.information.reset,
  unmount: stores.information.unmount,
  show: stores.information.show
}))
@observer
class LeftPanel extends React.Component {
  componentDidMount() {
    // this.props.init();
  }

  componentWillUnmount() {
    this.props.unmount();
  }
  render() {
    const searthList = Listdata.map((item, index) => {
      return (
        <li key={index} onClick={() => this.props.toggleList(item.value)}>
          <div className={styles.searthLi}>{item.label}</div>
        </li>
      );
    });
    return (
      <div className="leftPanel300">
        <Divider>数据库目录</Divider>
        <Row>
          <Col span={6} />
          <Col span={12}>
            <Cascader
              options={menuOp}
              onChange={val => this.props.toggleType(val)}
              placeholder="请选择"
            />
          </Col>
          <Col span={6} />
        </Row>
        <Divider>搜索选项</Divider>
        <Row>
          <Col span={8}>
            <p className="info-p">关键词:</p>
          </Col>
          <Col span={16}>
            <Select
              mode="tags"
              style={{ width: "100%" }}
              placeholder="Tags Mode"
              // onChange={handleChange}
            >
              <Option value="salt">盐度</Option>
              <Option value="wind">风</Option>
              <Option value="depth">水深</Option>
              <Option value="tem">水温</Option>
              <Option value="wave">海浪</Option>
            </Select>
          </Col>
        </Row>
        <br />
        <Row>
          <Col span={8}>
            <p className="info-p">学科分类:</p>
          </Col>
          <Col span={16}>
            <Select style={{ width: "100%" }}>
              <Option value="chemistry">海洋化学</Option>
              <Option value="geology">海洋地质</Option>
              <Option value="creature">海洋生物</Option>
              <Option value="physic">物理海洋</Option>
            </Select>
          </Col>
        </Row>
        <br />
        <Row>
          <Col span={8}>
            <p className="info-p">海域选择:</p>
          </Col>
          <Col span={16}>
            <Select style={{ width: "100%" }}>
              <Option value="bo">渤海</Option>
              <Option value="huang">黄海</Option>
              <Option value="dong">东海</Option>
              <Option value="nan">南海</Option>
              <Option value="pacific">太平洋</Option>
              <Option value="atlantic">大西洋</Option>
              <Option value="india">印度洋</Option>
            </Select>
          </Col>
        </Row>
        <br />
        <Row>
          <Col span={8}>
            <p className="info-p">时间范围:</p>
          </Col>
          <Col span={16}>
            <RangePicker />
          </Col>
        </Row>
        <br />
        <Row>
          <Col span={8}>
            <Button type="primary" onClick={() => this.props.toggleShow()}>
              搜索
            </Button>
          </Col>
          <Col span={8}>
            <Button onClick={() => this.props.reset()}>重置</Button>
          </Col>
        </Row>
        <br />
        <Row>
          <Divider>搜索结果</Divider>
          <Col span={24}>
            <div id="searthDiv" className={styles.searthDiv}>
              {this.props.show && (
                <ul style={{ listStyle: "none" }}>{searthList}</ul>
              )}
            </div>
          </Col>
        </Row>
        <br />
      </div>
    );
  }
}

export default LeftPanel;
