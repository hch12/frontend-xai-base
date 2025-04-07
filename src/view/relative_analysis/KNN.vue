<template>
  <div ref="treeChart" style="width: 100%; height: 700px;"></div>
</template>

<script>
import * as echarts from 'echarts';
import axios from 'axios';

export default {
  name: 'TreeChart',
  data() {
    return {
      treeData: null,
      chart: null
    };
  },
  mounted() {
    this.GetKnnPicture();
  },
  methods: {
    GetKnnPicture() {
      axios.post('/user/getKnnPicture').then(res => {
        if (res.data.code === 1) {
          const data = JSON.parse(res.data.data);
          this.updateChart(data.list);
        } else {
          this.$notify({
            title: '警告',
            message: '无法获取数据',
            type: 'warning'
          });
        }
      });
    },

    buildTree(flatData) {
      const map = new Map();
      const tree = [];

      flatData.forEach(item => {
        map.set(item.id, {
          ...item,
          children: [],
          depth: 0
        });
      });

      const calculateDepth = (node, depth) => {
        node.depth = depth;
        (node.children || []).forEach(child => calculateDepth(child, depth + 1));
      };

      flatData.forEach(item => {
        const node = map.get(item.id);
        if (item.parentId === -1) {
          tree.push(node);
          calculateDepth(node, 1);
        } else {
          const parent = map.get(item.parentId);
          if (parent) {
            parent.children.push(node);
            parent.isLeaf = false;
          }
        }
      });

      const calculateLeaves = (node) => {
        if (!node.children || node.children.length === 0) {
          node.remainingLeaves = 1;
          return 1;
        }

        let count = 0;
        node.children.forEach(child => {
          count += calculateLeaves(child);
        });
        node.remainingLeaves = count;
        return count;
      };

      tree.forEach(root => calculateLeaves(root));
      return tree;
    },

    updateChart(flatData) {
      this.treeData = this.buildTree(flatData);
      if (!this.treeData) return;

      if (this.chart) this.chart.dispose();
      this.chart = echarts.init(this.$refs.treeChart);

      const setEdgeColor = (node) => {
        if (!node.children || node.children.length === 0) return;

        const colorPalette = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD'];
        node.children.forEach((child, index) => {
          child.lineStyle = {
            width: 2.5,
            color: colorPalette[index % colorPalette.length],
            curveness: node.depth === 1 ? 0.3 : 0.2
          };
          setEdgeColor(child);
        });
      };

      this.treeData.forEach(setEdgeColor);

      const option = {
        tooltip: {
          trigger: 'item',
          formatter: ({ data }) => {
            if (data.formula) return data.formula;
            return `值: ${data.value} | 剩余节点: ${data.remainingLeaves}`;
          }
        },
        series: [{
          type: 'tree',
          data: this.treeData,
          top: '2%',
          left: '2%',
          bottom: '2%',
          right: '2%',
          symbolSize: 11,
          initialTreeDepth: 4,
          lineStyle: {
            width: 2,
            color: '#999'
          },
          label: {
            position: 'left',
            verticalAlign: 'middle',
            align: 'right',
            fontSize: 10,
            color: '#2c3e50',
            fontWeight: 'bold',
            formatter: ({ data }) => {
              // 非叶子节点显示剩余节点数
              if (data.children && data.children.length > 0) {
                return `(${data.remainingLeaves})`;
              }
              // 叶子节点只显示数值
              return data.value !== -1 ? data.value : '';
            }
          },
          leaves: {
            label: {
              position: 'left',
              verticalAlign: 'middle',
              align: 'left',
              fontSize: 12,
              distance: 18,
              color: '#e74c3c',
              // 确保叶子节点不显示个数
              formatter: ({ data }) => data.value !== -1 ? data.value : ''
            }
          },
          expandAndCollapse: true,
          animationDuration: 550,
          orient: 'vertical',
          roam: 'move'
        }]
      };

      this.chart.setOption(option);
    }
  }
};
</script>
