<template>
  <div ref="treeChart" style="width: 100%; height: 600px;"></div>
</template>

<script>
import * as echarts from 'echarts';
import axios from 'axios';

export default {
  name: 'TreeChart',
  data() {
    return {
      treeData: null, // 存储转换后的树形结构数据
      chart: null // 存储ECharts实例
    };
  },
  mounted() {
    this.GetKnnPicture(); // 组件挂载后获取数据
  },
  methods: {
    // 1. 从后端获取数据
    GetKnnPicture() {
      this.loading = true;
      axios.post('/user/getKnnPicture').then(res => {
        if (res.data.code === 1) {
          const data = JSON.parse(res.data.data);
          const list = data.list;
          console.log('获取到的树形数据:', list);
          this.updateChart(list);
        } else {
          this.$notify({
            title: '警告',
            message: '无法获取数据',
            type: 'warning'
          });
        }
        this.loading = false;
      });
    },

    // 2. 将扁平化数据转换为树形结构
    buildTree(flatData) {
      let tree = [];
      let map = {}; // 存储所有节点
      flatData.forEach(item => {
        map[item.id] = { ...item, children: [] };
      });
      flatData.forEach(item => {
        if (item.parentId === -1) tree.push(map[item.id]);
        else if (map[item.parentId]) map[item.parentId].children.push(map[item.id]);
      });
      return tree;
    },

    // 3. 初始化 ECharts 树形图
    updateChart(flatData) {
      this.treeData = this.buildTree(flatData);
      if (!this.treeData) return;

      if (this.chart) {
        this.chart.dispose();
      }
      this.chart = echarts.init(this.$refs.treeChart);

      const setEdgeColor = (node) => {
        if (!node.children || node.children.length === 0) return;
        const leftColor = '#FFA500';
        const rightColor = '#0000FF';
        node.children.forEach((child, index) => {
          child.lineStyle = { width: 2, color: index === 0 ? leftColor : rightColor };
          setEdgeColor(child);
        });
      };

      setEdgeColor(this.treeData[0]);

      const option = {
        tooltip: {
          trigger: 'item',
          triggerOn: 'mousemove',
          // 显示公式而不是整个节点对象
          formatter: params => {
            return params.data.formula ? params.data.formula : 'No formula available';
          }
        },
        series: [
          {
            type: 'tree',
            id: 0,
            name: 'tree1',
            data: this.treeData,
            top: '5%',   // 让树的间隔更大
            left: '5%',
            bottom: '5%',
            right: '5%',
            symbolSize:3,
            edgeShape: 'polyline',
            edgeForkPosition: '63%',
            initialTreeDepth: -1,  // 不限制树的深度
            lineStyle: { width: 1 },
            label: {
              show: true,
              position: 'left',
              verticalAlign: 'middle',
              align: 'right',
              fontSize: 7,
              formatter: params => params.data.value !== -1 ? params.data.value : ''
            },
            leaves: {
              label: {
                position: 'left',
                verticalAlign: 'middle',
                align: 'left',
                fontSize: 8,
                distance:1,
                formatter: params => params.data.value !== -1 ? params.data.value : ''
              }
            },
            emphasis: { focus: 'descendant' },
            expandAndCollapse: true,  // 设置为 false，初始化时不需要点击展开
            animationDuration: 550,
            animationDurationUpdate: 750,
            orient: 'vertical',
            roam: true,
            inverse: true
          }
        ]
      };

      this.chart.setOption(option);
    }
  }
};
</script>

<style scoped>
/* 自定义样式 */
</style>
