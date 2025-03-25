<template>
  <div id="app">
    <h3 style="margin-bottom: 15px; font-size: 24px; font-weight: bold; color: #303133; text-align: center;">
      Support Vector Regression分析结果
    </h3>
    <el-container v-loading="loading" element-loading-text="数据分析与可视化中">
      <el-main>
        <!-- 下拉选择框 -->
<!--        <el-select v-model="selectedItem" placeholder="请选择最佳特征团" style="width: 300px">-->
<!--          <el-option-->
<!--            v-for="item in options"-->
<!--            :key="item.Id"-->
<!--            :label="item.Features"-->
<!--            :value="item.Id"-->
<!--          />-->
<!--        </el-select>-->

<!--        &lt;!&ndash; 提交按钮 &ndash;&gt;-->
<!--        <el-button type="primary" @click="fetchDataUrls" style="margin-left: 10px">-->
<!--          提交-->
<!--        </el-button>-->

        <div v-show="showCharts" style="margin-top: 20px; display: block; text-align: center;">
          <!-- 高维空间散点图 -->
          <div id="scatterChart" ref="scatterChart" style="width: 80%; height: 500px; margin: 0 auto;"></div>

          <el-button style="display: block; margin-left: 0;" type="success" @click="downloadFile">聚类结果下载</el-button>

          <div style="margin-top: 20px; padding: 10px; background-color: #f5f7fa; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">

            <div style="margin: 30px 0; padding: 20px; background-color: #f0f2f5; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); text-align: center;">
              <h3 style="margin-bottom: 15px; font-size: 24px; font-weight: bold; color: #303133;">
                特征团应用结果分析
              </h3>
            </div>

            <!-- F 值柱状图 -->
            <div id="barChart" ref="barChart" style="width: 70%; height: 500px; margin: 20px auto 0;"></div>

            <el-button type="primary" @click="showSentences = true" style="display: block; margin-left: 0;">
              构效关系提取
            </el-button>

            <!-- 句子列表 -->
            <div v-if="showSentences">
              <h3>请选择构效关系</h3>
              <el-table :data="sentences" border style="margin-top: 20px;">
                <el-table-column label="选择">
                  <template v-slot="{ row }">
                    <el-checkbox v-model="selectedSentences" :label="row.id">
                      {{ row.content }}
                    </el-checkbox>
                  </template>
                </el-table-column>
              </el-table>
            </div>

            <!-- 提交按钮 -->
              <el-button v-if="showSentences" type="primary" @click="submitSelection" style="display: block; margin-left: 0;">
                提交选择
              </el-button>
            </div>
          </div>

      </el-main>
    </el-container>
  </div>
</template>

<script>
import * as echarts from "echarts";

export default {
  name: "SVR",
  data() {
    return {
      showSentences: false,
      options: [],
      selectedItem: null,
      showCharts: false,
      scatterData: [],
      featureImportanceData: [],
      sentences: [
        { id: 1, content: "𝑎𝑣𝑔_𝑅_𝑋和𝑎𝑣𝑔_𝑅_𝑀越大，能量势垒值越小。" },
        { id: 2, content: "𝑎𝑣𝑔_𝑅_𝑋更小的化合物，\n" +
            "晶胞尺寸𝑎和𝑉、多面体体积𝑉_𝑋𝑂4和𝑉_𝑁𝑎(1)𝑂6、通道尺寸𝐵𝑇1、𝑀𝑖𝑛_𝐵𝑇和𝑅𝑇\n" +
            "更大，BVSE 能量势垒值更小。" },
      ],
      selectedSentences: [], // 选择的句子 ID
      loading: true
    };
  },
  methods: {
    async fetchData() {
      try {
        const response = await this.$axios.get("/relative/svr");
        console.log("收到的数据:", response.data);
        this.options = response.data.map((item) => ({
          Id: item.Id,
          Features: JSON.parse(item.Features),
        }));
      } catch (error) {
        console.error("获取数据失败:", error);
      }
    },

    async fetchDataUrls() {
      try {
        const response = await this.$axios.get("/relative/getDataUrls");

        const scatterDataUrl = response.data.highDimensionalData;
        const featureImportanceUrl = response.data.FValueData;

        const scatterResponse = await this.$axios.get(scatterDataUrl);
        this.scatterData = scatterResponse.data;
        console.log("高维数据:", this.scatterData);

        const featureResponse = await this.$axios.get(featureImportanceUrl);
        this.featureImportanceData = featureResponse.data;
        console.log("特征重要性数据:", this.featureImportanceData);

        this.showCharts = true;

        // 使用 nextTick() 确保 DOM 已经渲染
        this.$nextTick(() => {
          this.drawScatterChart();
          this.drawBarChart();
        });

        this.loading = false;

      } catch (error) {
        console.error("获取数据失败:", error);
        this.$message.error("获取数据失败");
      }
    },

    drawScatterChart() {
      const chart = echarts.init(this.$refs.scatterChart);

      // 定义不同类别的颜色
      const colors = ["blue", "orange", "green", "purple"];

      // 生成初始数据
      let series = [];

      // 处理支持向量（红色）
      const supportVectors = this.scatterData.filter(point => point.is_support_vector);
      if (supportVectors.length > 0) {
        series.push({
          name: "支持向量",
          type: "scatter",
          data: supportVectors.map(point => [point.x, point.y]),
          itemStyle: { color: "red" },
          symbolSize: 12, // 默认大小
          emphasis: {
            itemStyle: { color: "red", symbolSize: 15 } // 鼠标悬停时放大
          }
        });
      }

      // 处理每个类别
      for (let i = 0; i < colors.length; i++) {
        const clusterData = this.scatterData.filter(point => point.label === i && !point.is_support_vector);
        if (clusterData.length > 0) {
          series.push({
            name: `类别 ${i + 1}`,
            type: "scatter",
            data: clusterData.map(point => [point.x, point.y]),
            itemStyle: { color: colors[i % colors.length] },
            symbolSize: 10, // 默认大小
            emphasis: {
              itemStyle: { color: colors[i % colors.length], symbolSize: 12 } // 鼠标悬停时放大
            }
          });
        }
      }

      // 配置 ECharts 选项
      const option = {
        title: {
          text: "将样本映射到高维空间进行聚类结果展示",
          left: "center",
          textStyle: {
            fontSize: 20,
            fontWeight: "bold",
            color: "#303133"
          }
        },
        legend: {
          top: "5%",
          left: "right"
        },
        xAxis: { name: "PC1", type: "value" },
        yAxis: { name: "PC2", type: "value" },
        series: series
      };

      chart.setOption(option);

      // 监听鼠标事件
      chart.on("mouseover", (params) => {
        const clickedLabel = params.seriesName;

        // 找到该类别的所有点，并放大
        series.forEach((s) => {
          if (s.name === clickedLabel) {
            s.symbolSize = 20; // 放大类别点
          } else if (s.name === "支持向量") {
            s.symbolSize = 17; // 放大支持向量
          }
        });

        chart.setOption({ series });
      });

      // 监听鼠标移出事件，恢复原大小
      chart.on("mouseout", () => {
        series.forEach((s) => {
          if (s.name === "支持向量") {
            s.symbolSize = 15; // 还原支持向量大小
          } else {
            s.symbolSize = 12; // 还原类别点大小
          }
        });

        chart.setOption({ series });
      });
    },



    drawBarChart() {
      const chart = echarts.init(this.$refs.barChart);
      const features = this.featureImportanceData.map(f => f.Feature);
      const fValues = this.featureImportanceData.map(f => f["F-Value"]);

      const option = {
        title: { text: "特征重要性", left: "center" },
        tooltip: {
          trigger: "item", // 悬停时显示具体数值
          formatter: (params) => `${params.name}: ${params.value.toFixed(2)}`
        },
        xAxis: { type: "value" },  // 使柱子变横向
        yAxis: {
          type: "category",
          data: features,
          axisLabel: {
            interval: 0,  // 确保所有标签都显示
            fontSize: 12,  // 调整字体大小
          }
        },
        series: [{
          type: "bar",
          data: fValues.map((value, index) => ({
            value: value,
            itemStyle: { color: "#3498db" }, // 默认颜色
            emphasis: {
              itemStyle: { color: "#e74c3c", barWidth: "80%" } // 鼠标悬停时放大 & 变色
            }
          })),
          barWidth: "60%"  // 默认柱状图宽度
        }]
      };

      chart.setOption(option);
    },


    downloadFile() {
      const model = this.currentModel;

      this.$axios.get('/relative/download', {
        responseType: 'blob',
      })
        .then(response => {
          const blob = new Blob([response.data]);
          const link = document.createElement('a');
          const url = window.URL.createObjectURL(blob);
          link.href = url;
          link.download = `results.xlsx`;
          link.click();
          window.URL.revokeObjectURL(url);
        })
        .catch(error => {
          console.error("文件下载失败:", error);
        });
    },

    extractRelative() {
      // this.$axios.get('/relative/extract')
      //   .then(response => {
      //     this.$message({
      //       message: '构效关系提取成功',
      //       type: 'success'
      //     });
      //   })
      //   .catch(error => {
      //     console.error("构效关系提取失败:", error);
      //     this.$message({
      //       message: '构效关系提取失败',
      //       type: 'error'
      //     });
      //   });
    },

    async fetchSentences() {
      const response = await this.$axios.get("/api/sentences");
      this.sentences = response.data;
    },

    submitSelection() {
      if (this.selectedSentences.length === 0) {
        this.$message.warning("请至少选择一个句子！");
        return;
      }

      console.log("用户选择的句子ID:", this.selectedSentences);
      this.$message.success("选择的构效关系已提交！");
    }

  },
  mounted() {
    this.fetchSentences();
    this.fetchDataUrls()
  }
};
</script>

<style>
#app {
  padding: 20px;
}
</style>
