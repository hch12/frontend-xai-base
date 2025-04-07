<template>
  <div>
    <div ref="chartContainer1" v-loading="loading" style="width: 100%; height: 800px;"></div>
    <div ref="chartContainer2" v-loading="loading" style="width: 100%; height: 800px;"></div>
  </div>
</template>

<script>
import * as echarts from 'echarts';

export default {
  name: 'MLR',
  data() {
    return {
      Name1: [],
      Importance1: [],
      PCC1: [],
      Name2: [],
      Importance2: [],
      PCC2: [],
      loading: true,  // 控制加载状态
      option1: {
        title: {
          text: 'Multiple Linear Regression分析图',
          left: 'center',
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          top: 80,
          bottom: 30,  // 恢复底部间距
          left: '8%',
          right: '8%' // 为右侧滑块腾出空间
        },
        dataZoom: [{
          type: 'slider',
          orient: 'vertical', // 设置为垂直方向
          yAxisIndex: 0,
          startValue: 0,
          endValue: 9,
          right: '2%',        // 定位到右侧
          top: '5%',         // 从顶部15%位置开始
          bottom: '5%',      // 到底部15%位置结束
          width: 12,         // 滑块宽度
          height: 'auto',    // 高度自适应
          fillerColor: '#8B8B8B',
          borderColor: '#999',
          showDetail: true,
          zoomLock: true,
          filterMode: 'filter',
          brushSelect: false // 禁止框选
        }],
        xAxis: {
          type: 'value',
          position: 'top',
          splitLine: {
            lineStyle: {
              type: 'dashed'
            }
          },
          axisLabel: {
            margin: 10, // x 轴标签距离轴的间距
            fontSize: 9
          }
        },
        yAxis: {
          type: 'category',
          axisLine: { show: false },
          axisLabel: {
            show: true,
            interval: 0,
            margin: 20,
            fontSize: 9
          },
          axisTick: { show: false },
          splitLine: { show: false },
          data: []  // 留空，稍后用动态数据填充
        },
        series: [
          {
            name: 'PCC',
            type: 'bar',
            label: {
              show: true,
              position: 'insideRight',
              formatter: '{b}'
            },
            barWidth: 10,
            barCategoryGap: '60%',
            data: []  // 留空，稍后用动态数据填充
          },
          {
            name: 'LC',
            type: 'bar',
            label: {
              show: true,
              position: 'insideRight',
              formatter: '{b}'
            },
            barWidth: 10,
            barCategoryGap: '50%',
            data: []  // 留空，稍后用动态数据填充
          }
        ]
      },
      option2: {
        title: {
          text: 'Multiple Linear Regression positive分析图',
          left: 'center',
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          top: 80,
          bottom: 30,
          left: '10%',
          right: '10%'
        },
        xAxis: {
          type: 'value',
          position: 'top',
          splitLine: {
            lineStyle: {
              type: 'dashed'
            }
          },
          axisLabel: {
            margin: 10, // x 轴标签距离轴的间距
            fontSize: 9
          }
        },
        yAxis: {
          type: 'category',
          axisLine: { show: false },
          axisLabel: {
            show: true,
            interval: 0,
            margin: 20,
            fontSize: 9
          },
          axisTick: { show: false },
          splitLine: { show: false },
          data: []  // 留空，稍后用动态数据填充
        },
        series: [
          {
            name: 'Importance',
            type: 'bar',
            label: {
              show: true,
              position: 'insideRight',
              formatter: '{b}'
            },
            barWidth: 10,
            barCategoryGap: '60%',
            data: []  // 留空，稍后用动态数据填充
          },
          {
            name: 'PCC',
            type: 'bar',
            label: {
              show: true,
              position: 'insideRight',
              formatter: '{b}'
            },
            barWidth: 10,
            barCategoryGap: '50%',
            data: []  // 留空，稍后用动态数据填充
          }
        ]
      }
    };
  },
  methods: {
    GetMlrPicture() {
      this.loading = true; // 开始加载时显示加载符号
      this.$axios.post('/user/getMlrPicture').then(res => {
        if (res.data.code === 1) {
          const data = JSON.parse(res.data.data);
          const list1 = data.list1;
          const list2 = data.list2;
          this.Name1 = [];
          this.Importance1 = [];
          this.PCC1 = [];
          this.Name2 = [];
          this.Importance2 = [];
          this.PCC2 = [];
          for (const item of list1) {
            this.Name1.push(item.Name);
            this.Importance1.push(item.Importance);
            this.PCC1.push(item.PCC);
          }
          for (const item of list2) {
            this.Name2.push(item.Name);
            this.Importance2.push(item.Importance);
            this.PCC2.push(item.PCC);
          }
          // 数据加载完后，更新图表的 option
          this.updateChart();
        } else {
          this.$notify({
            title: '警告',
            message: '无法获取数据',
            type: 'warning'
          });
        }
        this.loading = false;  // 数据加载完成后隐藏加载符号
      });
    },

    updateChart() {
      // 更新 yAxis 和 series 中的数据
      this.option1.yAxis.data = this.Name1;
      this.option1.series[0].data = this.Importance1;
      this.option1.series[1].data = this.PCC1;
      this.option2.yAxis.data = this.Name2;
      this.option2.series[0].data = this.Importance2;
      this.option2.series[1].data = this.PCC2;
      // 重新设置图表
      const chartDom1 = this.$refs.chartContainer1;
      const myChart1 = echarts.init(chartDom1);
      myChart1.setOption(this.option1);

      const chartDom2 = this.$refs.chartContainer2;
      const myChart2 = echarts.init(chartDom2);
      myChart2.setOption(this.option2);
    }
  },
  mounted() {
    // 在 mounted 生命周期钩子中初始化图表
    this.GetMlrPicture();  // 初始时先请求数据
  }
};
</script>

<style scoped>
/* 自定义样式 */
.loading-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 18px;
  color: #555;
  display: flex;
  align-items: center;
}

.loading-spinner {
  width: 30px;
  height: 30px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  animation: spin 2s linear infinite;
  margin-right: 10px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>
