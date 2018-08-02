import React, { Component } from "react";
// import PropTypes from "prop-types";
import { observer } from "mobx-react";
import styles from "./styles.css";

@observer
class SeafloorChart extends Component {
  componentDidMount() {
    this.initChart(this.props.jLength);
  }

  componentDidUpdate() {
    this.initChart(this.props.jLength);
  }

  initChart(jLength) {
    // console.log(chartdata);
    if (jLength < 1) return;
    this.myChart =
      this.myChart ||
      echarts.init(document.getElementById("seafloorChart_div"));
    let i, j;
    const testData = [];
    for (i = 0; i < 5; i++) {
      let eachLine = [];
      for (j = 0; j < jLength; j++) {
        eachLine.push(50 - i * 10 + Math.random() * 20);
      }
      testData.push(eachLine);
    }

    let xData = [];
    for (j = 0; j < jLength; j++) {
      xData.push(j);
    }
    let option = {
      tooltip: {
        trigger: "axis"
      },
      color: [
        "rgba(58, 161, 255, 1.0)",
        "rgba(54, 203, 203, 1.0)",
        "rgba(78, 203, 115, 1.0)",
        "rgba(251, 212, 55, 1.0)",
        "rgba(242, 99, 123, 1.0)"
      ],
      legend: {
        data: ["-20km", "-10km", "0km", "10km", "20km"],
        align: "left",
        textStyle: {
          color: "#fff",
          textAlign: "center"
        },
        bottom: 10
      },
      xAxis: {
        type: "category",
        boundaryGap: false,
        data: xData,
        axisLine: {
          lineStyle: {
            color: "#fff"
          }
        }
      },
      yAxis: {
        type: "value",
        max: 120,
        axisLine: {
          lineStyle: {
            color: "#fff"
          }
        }
      },
      series: [
        {
          name: "-20km",
          symbol: "none",
          data: testData[0],
          type: "line",
          itemStyle: {
            normal: {
              lineStyle: {
                width: 0.1, // 折线宽度
                color: "rgba(58, 161, 255, 1.0)" // 折线颜色
              }
            }
          },
          areaStyle: {
            color: "rgba(58, 161, 255, 1.0)"
          }
        },
        {
          name: "-10km",
          symbol: "none",
          data: testData[1],
          type: "line",
          itemStyle: {
            normal: {
              lineStyle: {
                width: 0.1, // 折线宽度
                color: "rgba(54, 203, 203, 1.0)" // 折线颜色
              }
            }
          },
          areaStyle: {
            color: "rgba(54, 203, 203, 1.0)"
          }
        },
        {
          name: "0km",
          symbol: "none",
          data: testData[2],
          type: "line",
          itemStyle: {
            normal: {
              lineStyle: {
                width: 0.1, // 折线宽度
                color: "rgba(78, 203, 115, 1.0)" // 折线颜色
              }
            }
          },
          areaStyle: {
            color: "rgba(78, 203, 115, 1.0)"
          }
        },
        {
          name: "10km",
          symbol: "none",
          data: testData[3],
          type: "line",
          itemStyle: {
            normal: {
              lineStyle: {
                width: 0.1, // 折线宽度
                color: "rgba(251, 212, 55, 1.0)" // 折线颜色
              }
            }
          },
          areaStyle: {
            color: "rgba(251, 212, 55, 1.0)"
          }
        },
        {
          name: "20km",
          symbol: "none",
          data: testData[4],
          type: "line",
          itemStyle: {
            normal: {
              lineStyle: {
                width: 0.1, // 折线宽度
                color: "rgba(242, 99, 123, 1.0)" // 折线颜色
              }
            }
          },
          areaStyle: {
            color: "rgba(242, 99, 123, 1.0)"
          }
        }
      ]
    };
    this.myChart.setOption(option);
  }

  render() {
    return <div id="seafloorChart_div" className={styles.seafloorChart_div} />;
  }
}

export default SeafloorChart;
