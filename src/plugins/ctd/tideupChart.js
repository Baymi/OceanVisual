import React, { Component } from "react";
// import PropTypes from "prop-types";
import styles from "./styles.css";
import { observer } from "mobx-react";

@observer
class TideupChart extends Component {
  componentDidMount() {
    this.initChart(this.props.tideId);
  }

  componentDidUpdate() {
    this.initChart(this.props.tideId);
  }

  initChart(tideId) {
    console.log(tideId);
    const myChart = echarts.init(document.getElementById("tideupChart_div"));
    var ring1 = Math.random() * 24;
    const option = {
      title: [
        {
          text: "潮高时长",
          left: "46%",
          top: "25%",
          textAlign: "center",
          textStyle: {
            color: "#fff",
            textAlign: "center",
            fontSize: 12
          }
        }
      ],
      series: [
        {
          type: "pie",
          radius: ["63%", "79%"],
          silent: true,
          data: [
            {
              value: 1,
              itemStyle: {
                normal: {
                  color: "#ff9137",
                  borderColor: "#ff9137",
                  borderWidth: 2
                  // shadowBlur: 50,
                  // shadowColor: 'rgba(21,41,185,.75)'
                }
              },
              labelLine: {
                normal: {
                  show: false
                }
              }
            }
          ]
        },
        {
          type: "pie",
          radius: ["77%", "85%"],
          silent: true,
          label: {
            normal: {
              show: false
            }
          },
          data: [
            {
              value: 1,
              itemStyle: {
                normal: {
                  color: "#ff9137"
                }
              },
              labelLine: {
                normal: {
                  show: false
                }
              }
            }
          ]
        },
        {
          name: "比例",
          type: "pie",
          radius: ["72%", "80%"],
          hoverAnimation: true,
          data: [
            {
              value: ring1,
              // name: "24h潮高时长",
              itemStyle: {
                normal: {
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    {
                      offset: 1,
                      color: "#ffde33"
                    },
                    {
                      offset: 1,
                      color: "#ffde33"
                    }
                  ])
                }
              },
              labelLine: {
                normal: {
                  show: false
                }
              }
            },
            {
              value: 24 - ring1,
              // name: "其他时长",
              itemStyle: {
                normal: {
                  color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    {
                      offset: 0,
                      color: "#fff"
                    },
                    {
                      offset: 1,
                      color: "#fff"
                    }
                  ])
                }
              },
              labelLine: {
                normal: {
                  show: false
                }
              }
            }
          ]
        },
        {
          name: "",
          type: "pie",
          clockWise: true,
          hoverAnimation: false,
          radius: [200, 200],
          label: {
            normal: {
              position: "center"
            }
          },
          data: [
            {
              value: 0,
              label: {
                normal: {
                  formatter: parseInt(ring1) + "min",
                  textStyle: {
                    color: "#fe8b53",
                    fontSize: 15,
                    fontWeight: "bold"
                  }
                }
              }
            }
          ]
        }
      ]
    };
    myChart.setOption(option);
  }

  render() {
    return <div id="tideupChart_div" className={styles.tideupChart_div} />;
  }
}

export default TideupChart;
