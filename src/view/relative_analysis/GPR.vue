<template>
  <div id="app">
    <h3 style="margin-bottom: 15px; font-size: 24px; font-weight: bold; color: #303133; text-align: center;">
      Gaussian Process Regression分析结果
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
<!--        <el-button type="primary" @click="fetchImageUrls" style="margin-left: 10px">-->
<!--          提交-->
<!--        </el-button>-->

        <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 20px; margin-top: 20px;">
          <div v-if="GPRImageSrc" style="flex: 1; text-align: center;">
            <img :src="GPRImageSrc" alt="GPR" style="max-width:60%; border: 1px solid #ccc; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);" />
          </div>
        </div>

        <div v-if="GPRImageSrc" style="margin-top: 20px; padding: 10px; background-color: #f5f7fa; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">

          <div style="margin: 10px 0; padding: 5px; background-color: #f0f2f5; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); text-align: center;">
            <h3 style="margin-bottom: 15px; font-size: 24px; font-weight: bold; color: #303133;">
              特征团应用结果分析
            </h3>
          </div>

          <h3 style="margin-bottom: 15px; font-size: 15px; font-weight: bold; color: #303133; text-align: center;">
            未能够从数据中有效提取出明确的构效关系
          </h3>
        </div>

<!--        <div-->
<!--          v-if="lowDimensionalImageSrc || highDimensionalImageSrc"-->
<!--          style="margin-top: 30px; padding: 20px; background-color: #f5f7fa; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">-->
<!--          <h3 style="margin-bottom: 15px; color: #303133;">特征团应用结果分析</h3>-->
<!--          <div v-if="FImageSrc" style="flex: 1; text-align: center;">-->
<!--            <img :src="FImageSrc" alt="特征团图片" style="max-width: 100%; border: 1px solid #ccc; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);" />-->
<!--          </div>-->
<!--          <p style="line-height: 1.6; color: #606266;">-->
<!--            根据选择的特征团组合，系统通过SVR算法对样本数据进行聚类分析。左侧展示低维空间的聚类可视化结果，右侧展示高维空间的聚类分布。上图展示是一个基于ANOVA F检验的特征重要性排序图，用于展示不同特征对目标变量的区分能力。-->
<!--          </p>-->
<!--        </div>-->

      </el-main>
    </el-container>
  </div>
</template>

<script>

export default {
  name: "GPR",
  data() {
    return {
      options: [], // 存储从后端获取的数据
      selectedItem: null, // 当前选中的 ID
      selectedFeatures: null, // 当前选中的 Features
      images: [],
      GPRImageSrc: null,
      loading: true
    };
  },
  methods: {
    // 获取后端数据
    // async fetchData() {
    //   try {
    //     const response = await this.$axios.get("/relative/gpr"); // 使用 this.$axios
    //     console.log("收到的数据:", response.data);  // 打印收到的数据
    //     this.options = response.data.map((item) => ({
    //       Id: item.Id,
    //       Features: JSON.parse(item.Features), // 解析 Features 字符串为数组
    //     }));
    //   } catch (error) {
    //     console.error("获取数据失败:", error);
    //   }
    // },


    // 提交选中项到后端
    async fetchImageUrls() {

      // 请求后端接口获取图片 URL
      const response = await this.$axios.get('/relative/getGPRUrls', {
        responseType: 'blob'
      }).then(response => {
        console.log("特征团应用成功，后端返回:", response);

        // 将图片 Blob 转换为 URL
        const blob = new Blob([response.data], { type: 'image/png' });
        const objectURL = URL.createObjectURL(blob);

        // 设置图片的 URL 给前端展示
        this.GPRImageSrc = objectURL;

        this.loading = false;

        // this.$message.success("特征团应用成功！");

      })
        .catch(error => {
          console.error("失败:", error);
          this.$message.error("失败，请稍后重试。");
        });
    }

  },
  watch: {
    // 监听选中项变化，更新对应的 Features
    selectedItem(newId) {
      const selected = this.options.find((item) => item.Id === newId);
      this.selectedFeatures = selected ? selected.Features : null;
    },
  },
  mounted() {
    // 组件挂载时获取数据
    this.fetchImageUrls();
  },
};
</script>

<style>
#app {
  padding: 20px;
}
</style>
