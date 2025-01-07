<template>
  <div id="app">
    <el-container>
      <el-main>
        <!-- 下拉选择框 -->
        <el-select v-model="selectedItem" placeholder="请选择 ID" style="width: 300px">
          <el-option
            v-for="item in options"
            :key="item.Id"
            :label="item.Features"
            :value="item.Id"
          />
        </el-select>

        <!-- 显示对应的 Features -->
        <div v-if="selectedFeatures" style="margin: 10px 0">
          <strong>对应 Features:</strong> {{ selectedFeatures }}
        </div>

        <!-- 提交按钮 -->
        <el-button type="primary" @click="fetchImageUrls" style="margin-left: 10px">
          提交
        </el-button>

        <div v-if="highDimensionalImageSrc">
          <h3>highDimensionalImageSrc</h3>
          <img :src="highDimensionalImageSrc" alt="特征团图片" style="max-width: 100%; margin-top: 20px;" />
        </div>
        <div v-if="lowDimensionalImageSrc">
          <h3>lowDimensionalImageSrc</h3>
          <img :src="lowDimensionalImageSrc" alt="特征团图片" style="max-width: 100%; margin-top: 20px;" />
        </div>
      </el-main>
    </el-container>
  </div>
</template>

<script>

export default {
  data() {
    return {
      options: [], // 存储从后端获取的数据
      selectedItem: null, // 当前选中的 ID
      selectedFeatures: null, // 当前选中的 Features
      images: [],
      highDimensionalImageSrc: null, // 高维度图片 URL
      lowDimensionalImageSrc: null, // 低维度图片 URL
    };
  },
  methods: {
    // 获取后端数据
    async fetchData() {
      try {
        const response = await this.$axios.get("/relative/svr"); // 使用 this.$axios
        this.options = response.data.map((item) => ({
          Id: item.Id,
          Features: JSON.parse(item.Features), // 解析 Features 字符串为数组
        }));
      } catch (error) {
        console.error("获取数据失败:", error);
      }
    },

    // 提交选中项到后端
    async fetchImageUrls() {
      if (!this.selectedItem) {
        this.$message.error("请选择 ID");
        return;
      }

      try {
        // 请求获取图片的 URL
        const response = await this.$axios.get('/relative/getImageUrls', {
          params: { Id: this.selectedItem }
        });

        // 获取返回的图片 URL
        const highDimensionalImageurl = response.data.highDimensionalImage;
        const lowDimensionalImageurl = response.data.lowDimensionalImage;

        if (!highDimensionalImageurl || !lowDimensionalImageurl) {
          this.$message.error("图片 URL 获取失败");
          return;
        }

        this.$axios.get(highDimensionalImageurl, {
          responseType: 'blob' // 确保接收的是图片流
        })
          .then(response => {
            console.log("特征团应用成功，后端返回:", response);

            // 将图片 Blob 转换为 URL
            const blob = new Blob([response.data], { type: 'image/png' });
            const objectURL = URL.createObjectURL(blob);

            // 设置图片的 URL 给前端展示
            this.highDimensionalImageSrc = objectURL;

            this.$message.success("特征团应用成功！");
          })
          .catch(error => {
            console.error("失败:", error);
            this.$message.error("失败，请稍后重试。");
          });


        this.$axios.get(lowDimensionalImageurl, {
          responseType: 'blob' // 确保接收的是图片流
        })
          .then(response => {
            console.log("特征团应用成功，后端返回:", response);

            // 将图片 Blob 转换为 URL
            const blob = new Blob([response.data], { type: 'image/png' });
            const objectURL = URL.createObjectURL(blob);

            // 设置图片的 URL 给前端展示
            this.lowDimensionalImageSrc = objectURL;

            this.$message.success("特征团应用成功！");

          })
          .catch(error => {
            console.error("失败:", error);
            this.$message.error("失败，请稍后重试。");
          });

      } catch (error) {
        console.error('获取图片失败:', error);
        this.$message.error('获取图片失败');
      }
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
    this.fetchData();
  },
};
</script>

<style>
#app {
  padding: 20px;
}
</style>
