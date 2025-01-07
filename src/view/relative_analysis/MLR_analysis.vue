<template>
  <div>
    <h1>Multiple Linear Regression构效分析</h1>
    <br>
    <div>
      <div v-for="(item, index) in Name" :key="index">
        <div v-if="Importance[index] * PCC[index] > 0 && Importance[index] > 0" class="font">
          {{ item }} 得出结果与预测方向一致，对激活能有
          <div class="positive">正向作用</div>
        </div>
        <div v-if="Importance[index] * PCC[index] > 0 && Importance[index] < 0" class="font">
          {{ item }} 得出结果与预测方向一致，对激活能有
          <div class="negative">负向作用</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "MLR_analysis",
  data() {
    return {
      Name: [],
      Importance: [],
      PCC: []
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
        this.loading = false; // 数据加载完成后隐藏加载符号
      });
    }
  },
  mounted() {
    // 在 mounted 生命周期钩子中初始化图表
    this.GetMlrPicture(); // 初始时先请求数据
  }
};
</script>

<style scoped>
h1 {
  text-align: center;
  color: #333;
}

.positive,
.negative {
  font-size: 16px;
  font-weight: bold;
  margin-left: 5px; /* 让两者之间有间隔 */
}

.positive {
  color: green;
}

.negative {
  color: red;
}

.font {
  font-size: 16px;
  font-weight: bold;
  margin: 10px 0;
}

/* 增加一些字体样式 */
div {
  font-family: 'Arial', sans-serif;
}

/* 如果需要让文本在同一行显示 */
.font div {
  display: inline; /* 让 '正向作用' 和 '负向作用' 在同一行显示 */
}
</style>
