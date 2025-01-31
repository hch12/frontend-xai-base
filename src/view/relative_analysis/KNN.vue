<template>
  <div ref="treeChart" style="width: 100%; height: 400px;"></div>
</template>

<script>
import * as echarts from 'echarts';

export default {
  name: 'KNN',
  mounted() {
    this.initChart();
  },
  methods: {
    initChart() {
      const chart = echarts.init(this.$refs.treeChart);

      // 二叉树数据结构
      const data = {
        name: 'flare',
        children: [
          {
            name: 'data',
            children: [
              {
                name: 'converters',
                children: [
                  { name: 'Converters', value: 721 },
                  { name: 'DelimitedTextConverter', value: 4294 }
                ]
              },
              { name: 'DataUtil', value: 3322 }
            ]
          },
          {
            name: 'query',
            children: [
              { name: 'AggregateExpression', value: 1616 },
              { name: 'And', value: 1027 }
            ]
          }
        ]
      };

      // 动态设置根节点的左右枝条颜色
      const setEdgeColor = (node) => {
        if (!node.children) return;

        const leftColor = '#FFA500';  // 橙色
        const rightColor = '#0000FF'; // 蓝色

        // 如果有子节点，分别为左侧和右侧枝条设置颜色
        node.children.forEach((child, index) => {
          child.lineStyle = {
            width: 2,
            color: index === 0 ? leftColor : rightColor  // 左边为橙色，右边为蓝色
          };

          // 递归为每个子节点设置颜色
          setEdgeColor(child);
        });
      };

      setEdgeColor(data); // 初始化时设置颜色

      const option = {
        tooltip: {
          trigger: 'item',
          triggerOn: 'mousemove'
        },
        series: [
          {
            type: 'tree',
            id: 0,
            name: 'tree1',
            data: [data],
            top: '10%',
            left: '8%',
            bottom: '22%',
            right: '20%',
            symbolSize: 7,
            edgeShape: 'polyline',
            edgeForkPosition: '63%',
            initialTreeDepth: 3,
            lineStyle: {
              width: 2
            },
            label: {
              backgroundColor: '#fff',
              position: 'left',
              verticalAlign: 'middle',
              align: 'right'
            },
            leaves: {
              label: {
                position: 'right',
                verticalAlign: 'middle',
                align: 'left'
              }
            },
            emphasis: {
              focus: 'descendant'
            },
            expandAndCollapse: true,
            animationDuration: 550,
            animationDurationUpdate: 750,
            orient: 'vertical', // 垂直显示树
            roam: true, // 开启漫游，方便查看树形图
            inverse: true // 翻转方向：树从下到上显示
          }
        ]
      };

      chart.setOption(option);
    }
  }
};
</script>

<style scoped>
/* Add any custom styles here */
</style>
