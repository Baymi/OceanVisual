import React from "react";
import {Menu} from "antd";
import {inject, observer} from "mobx-react";

const SubMenu = Menu.SubMenu;
const option1 = [
  {
    value: 'volcano',
    label: '海底火山',
  }, {
    value: 'platform',
    label: '海上平台',
  }, {
    value: 'coralreef',
    label: '珊瑚礁',
  }, {
    value: 'porrock',
    label: '玄武岩',
  }, {
    value: 'flatrock',
    label: '沉积岩',
  }, {
    value: 'island',
    label: '海岛',
  }, {
    value: 'ship',
    label: '船只',
    children: [{
      value: 'shenqianhao',
      label: '深潜号',
    }, {
      value: 'fisher',
      label: '渔船',
    }, {
      value: 'ship',
      label: '小船',
    }, {
      value: 'freighter',
      label: '货轮',
    }]
  }];

const option2 = [
  {
    value: 'whale',
    label: '鲸鱼',
  }, {
    value: 'shark',
    label: '鲨鱼',
  }, {
    value: 'dolphin',
    label: '海豚',
  }, {
    value: 'fish',
    label: '鱼类',
    children: [{
      value: 'tropical',
      label: '热带鱼',
    }, {
      value: 'clown',
      label: '小丑鱼',
    }, {
      value: 'manta',
      label: '蝠鲼',
    }]
  }];

const option3 = [
  {
    value: 'crab',
    label: '帝王蟹',
  }, {
    value: 'sponge',
    label: '海绵',
  }, {
    value: 'seaurchin',
    label: '海胆',
  }];

const option4 = [
  {
    value: 'seaweed',
    label: '海草',
  }, {
    value: 'redforest',
    label: '红树植物',
  }];

const items = [
  {
    key: 'cre1',
    type: '海洋场景',
    data: option1
  },
  {
    key: 'cre2',
    type: '游泳生物',
    data: option2
  },
  {
    key: 'cre3',
    type: '底栖生物',
    data: option3
  },
  {
    key: 'cre4',
    type: '海洋植物',
    data: option4
  }
];

@inject(stores => ({
  toggleType: stores.creature.toggleType,
  unmount: stores.creature.unmount,
  creSubItem: stores.creature.creSubItem
}))
@observer
class Cremenu extends React.Component {
  componentWillUnmount() {
    this.props.unmount();
  }

  createSub(data) {
    return [data.map((i) => {
      if (i.children) {
        return (
            <SubMenu key={i.value} title={i.label}>
              {this.createSub(i.children)}
            </SubMenu>
        )
      } else {
        return (<Menu.Item key={i.value} onClick={() => this.props.toggleType(i.value)}>{i.label}</Menu.Item>)
      }
    })]
  }

  render() {
    const {creSubItem} = this.props;
    items.map((item) => {
      creSubItem.push(<SubMenu key={item.key} title={item.type}>{this.createSub(item.data)}</SubMenu>);
    });
    return (
        <div></div>
    );
  }
}

export default Cremenu;
