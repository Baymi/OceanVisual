import React, { Component } from "react";
// import PropTypes from "prop-types";
import styles from "./style.css";
import { observer } from "mobx-react";

@observer
class ScatterChart extends Component {
  componentDidMount() {
    this.initChart(this.props.buoyName);
  }

  componentDidUpdate() {
    this.initChart(this.props.buoyName);
  }

  initChart(buoyName) {
    const myChart = echarts.init(document.getElementById("scatterChart_div"));
    var evaporation = [ 4.9, 7.0, 23.2, 25.6, 76.7, 135.6, 162.2, 32.6, 20.0, 6.4, 3.3, 4.4];
    var rain = [ 5.9, 9.0, 26.4, 28.7, 70.7, 175.6, 182.2, 48.7, 18.8, 6.0, 7.4, 2.3];
    var temp = [ 2.2, 3.3, 4.5, 6.3, 10.2, 20.3, 23.4, 23.0, 16.5, 12.0, 8.3, 6.2];
    var thisEvaporation = [];  
    var thisRain = [];
    var thisTemp = [];
    evaporation.map(item =>{
      item = item + Math.random() * 10 - Math.random() * 10;
      thisEvaporation.push(item);
    })
    rain.map(item =>{
      item = item + Math.random() * 10 - Math.random() * 10;
      thisRain.push(item);
    })
    temp.map(item =>{
      item = item + Math.random() * 3 - Math.random() * 3;
      thisTemp.push(item);
    })
    var option = {
      tooltip: {
          trigger: 'axis',
          axisPointer: {
              type: 'cross',
              crossStyle: {
                  color: '#999'
              }
          }
      },
      legend: {
          data:['蒸发量','降水量','平均温度'],
          textStyle: {
            color: "#fff",
            textAlign: "center"
          }
      },
      grid: {
        left: 65,
        right: 65
      },
      xAxis: [
          {
              type: 'category',
              data: ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'],
              axisPointer: {
                  type: 'shadow'
              },
              axisLine: {
                lineStyle: {
                  color: "#fff"
                }
              }
          }
      ],
      yAxis: [
          {
              type: 'value',
              name: '水量',
              min: 0,
              max: 250,
              interval: 50,
              axisLabel: {
                  formatter: '{value} ml'
              },
              axisLine: {
                lineStyle: {
                  color: "#fff"
                }
              }
          },
          {
              type: 'value',
              name: '温度',
              min: 0,
              max: 25,
              interval: 5,
              axisLabel: {
                  formatter: '{value} °C'
              },
              axisLine: {
                lineStyle: {
                  color: "#fff"
                }
              }
          }
      ],
      series: [
          {
              name:'蒸发量',
              type:'bar',
              data: thisEvaporation
          },
          {
              name:'降水量',
              type:'bar',
              data: thisRain
          },
          {
              name:'平均温度',
              type:'line',
              yAxisIndex: 1,
              data: thisTemp
          }
      ]
  };
  
    myChart.setOption(option);
  }

  render() {
    return <div id="scatterChart_div" className={styles.scatterChart_div} />;
  }
}

export default ScatterChart;
