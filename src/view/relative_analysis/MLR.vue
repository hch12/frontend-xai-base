<template>
  <div>
    <div ref="chartContainer" v-loading="loading" style="width: 100%; height: 800px;"></div>
  </div>
</template>

<script>
import * as echarts from 'echarts';

export default {
  name: 'MLR',
  data() {
    return {
      Name: [],
      Importance: [],
      PCC: [],
      loading: true,  // 控制加载状态
      option: {
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
            name: 'Positive Cost',
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
            name: 'Negative Cost',
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
          const list = data.list;
          this.Name = [];
          this.Importance = [];
          this.PCC = [];
          for (const item of list) {
            this.Name.push(item.Name);
            this.Importance.push(item.Importance);
            this.PCC.push(item.PCC);
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
      this.option.yAxis.data = this.Name;
      this.option.series[0].data = this.Importance;
      this.option.series[1].data = this.PCC;

      // 重新设置图表
      const chartDom = this.$refs.chartContainer;
      const myChart = echarts.init(chartDom);
      myChart.setOption(this.option);
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
