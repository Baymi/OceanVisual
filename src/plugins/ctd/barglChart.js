import React, { Component } from "react";
// import PropTypes from "prop-types";
import { observer } from "mobx-react";
import styles from "./styles.css";

@observer
class BarglChart extends Component {
  componentDidMount() {
    this.initChart(this.props.chartdata);
  }

  componentDidUpdate() {
    this.initChart(this.props.chartdata);
  }

  initChart(chartdata) {
    if (chartdata[1].length < 1) return;
    this.myChart =
      this.myChart || echarts.init(document.getElementById("barglChart_div"));
    const option = {
      grid3D: {
        viewControl: {
          autoRotate: true,
          autoRotateSpeed: 20,
          autoRotateAfterStill: 3
        }
      },
      tooltip: {},
      xAxis3D: {
        type: "category",
        axisLine: {
          lineStyle: {
            color: "#fff",
            width: 1
          }
        }
      },
      yAxis3D: {
        type: "category",
        // max: 11
        axisLine: {
          lineStyle: {
            color: "#fff",
            width: 1
          }
        }
      },
      zAxis3D: {
        axisLine: {
          lineStyle: {
            color: "#fff",
            width: 1
          }
        }
      },
      visualMap: {
        max: 11,
        dimension: "Layer"
      },
      dataset: {
        dimensions: ["Value", "Layer", { name: "Num", type: "ordinal" }],
        source: chartdata
      },
      series: [
        {
          type: "bar3D",
          // symbolSize: symbolSize,
          shading: "lambert",
          barWidth: "10%",
          // barGap: 500,
          // barCategoryGap: 200,
          encode: {
            x: "Num",
            y: "Layer",
            z: "Value",
            tooltip: [0, 1, 2]
          }
        }
      ]
    };
    this.myChart.setOption(option);
  }

  render() {
    return <div id="barglChart_div" className={styles.barglChart_div} />;
  }
}

export default BarglChart;
