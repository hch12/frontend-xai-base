<template>

  <div>
      <h1>构建特征决策表</h1>
      <br>
      <div class="radio-container">
        <el-radio v-model="radio" label="1" >直接训练</el-radio>
        <el-radio v-model="radio" label="2">使用预制数据</el-radio>
      </div>
    <div v-if="radio==1">
    <div class="block">
      <span class="demonstration">重复执行次数</span>
      <el-slider v-model="repeat" :min="1" :max="200"></el-slider>
    </div>
    <br>
    <div class="block">
      <span class="demonstration">迭代次数</span>
      <el-slider v-model="iteration" :min="1" :max="50"></el-slider>
    </div>
    <br>
    </div>
    <div v-if="radio==2">
      <el-select v-model="value" placeholder="请选择">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </div>
    <div style="display: flex;justify-self: flex-end">
      <el-button type="primary" round @click="GetfeatureTable">获取特征表</el-button>
    </div>
    <br>

    <div v-show="OK">
      <div style="margin: 20px 100px ">
        <el-select v-model="value1" placeholder="gpr_feature_table" class="select" @input="changeFeatureTable">
          <el-option
            v-for="item in options1"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
        <div style="display: flex;justify-self: flex-end">
          <el-button type="primary" @click="download">下载</el-button>
        </div>
      </div>

      <div style="display: flex; justify-self:center;align-items: center; margin-bottom: 20px">
        <!-- 在表格中显示加载标志 -->
        <el-table
          :data="tableData"
          border
          style="width: 85%;"
          :loading="isLoading">
        <el-table-column prop="id" label="编号" width="100"></el-table-column>
        <el-table-column prop="features" label="特征" width="620"></el-table-column>
        <el-table-column prop="Score" label="分数" width="150"></el-table-column>
        <el-table-column prop="CV RMSE" label="CV RMSE" width="150"></el-table-column>
        <el-table-column prop="Test RMSE" label="RMSE" width="150"></el-table-column>
        <el-table-column prop="Test R2" label="R2" width="100"></el-table-column>
        <el-table-column prop="Time" label="时间" width="100"></el-table-column>
        </el-table>
        <br>
      </div>

      <div style="display: flex;justify-self: center">
        <br>
        <el-pagination
          background
          layout="prev, pager, next"
          :total="total"
          :page-size="pageSize"
          :current-page="currentPage"
          @current-change="handlePageChange">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "decision_table",
  data() {
    return {
      split: 10,
      repeat: 100,
      iteration: 2,
      pageSize: 10, // 初始化 pageSize
      radio: '1',
      value1: 'gpr_feature_table',
      value: '',
      options1: [
        { value: 'gpr_feature_table', label: 'Gaussian Process Regression决策表' },
        { value: 'knn_feature_table', label: 'K-Nearest Neighbors决策表' },
        { value: 'mlr_feature_table', label: 'Multiple Linear Regression决策表' },
        { value: 'svr_feature_table', label: 'Support Vector Regression决策表' }
      ],
      options:
        [{value: '001', label: '100数据项'},
        {value: '002', label: '150数据项'},
        {value: '003', label: '200数据项'}],
      tableData: [], // 初始化表格数据
      total: 0, // 初始化总记录数
      currentPage: 1, // 当前页数
      OK: false,
      isLoading: false, // 控制表格加载标志
      progress: 0, // 初始进度
      timer: null, // 定时器
      process: false // 控制进度条和加载提示
    };
  },
  methods: {
    GetfeatureTable() {
      this.isLoading = true; // 启动表格加载
      this.process = true;
      this.startProgress();
      this.solve(1);
    },
    solve(page) {
      let params = {
        Page: page,
        PageSize: this.pageSize,
        Value1: this.value1,
        Repeat: this.repeat,
        Iteration: this.iteration,
        Value:this.value,
        Radio:this.radio
      };
      this.$axios.post('/user/FeatureTable', params).then(res => {
        if (res.data.code === 1) {
          const responseData = JSON.parse(res.data.data);
          this.tableData = responseData.list;
          this.total = responseData.total;
          this.progress = 100;
          this.OK = true;
          this.isLoading = false; // 数据加载完毕，关闭加载标志
        } else {
          this.$notify({
            title: '警告',
            message: '无法获取数据',
            type: 'warning'
          });
          this.isLoading = false; // 数据加载完毕，关闭加载标志
        }
      });
    },
    SearchfeatureTable(page) {
      let params = {
        Page: page,
        PageSize: this.pageSize,
        Value1: this.value1,
      };
      this.$axios.post('/user/searchFeatureTable', params).then(res => {
        if (res.data.code === 1) {
          const responseData = JSON.parse(res.data.data);
          this.tableData = responseData.list;
          this.total = responseData.total;
        } else {
          this.$notify({
            title: '警告',
            message: '无法获取数据',
            type: 'warning'
          });
        }
      });
    },
    changeFeatureTable() {
      this.SearchfeatureTable(1);
    },
    handlePageChange(currentPage) {
      this.currentPage = currentPage;
      this.SearchfeatureTable(this.currentPage); // 获取新页的数据
    },
    startProgress() {
      if (this.timer) {
        clearInterval(this.timer); // 清除之前的定时器
      }
      this.progress = 0; // 重置进度
      this.timer = setInterval(() => {
        if (this.progress < 12) {
          this.progress += 2; // 增加进度
        } else if (this.progress < 99) {
          this.progress += 1;
        } else if (this.progress === 99) {
          this.progress = this.progress;
        } else {
          clearInterval(this.timer); // 进度到达100%时清除定时器
        }
      }, 3000); // 每100毫秒增加一次进度
    },
    download() {
      let param = {
        address: "./src/main/resources/python/MultifacetedModeling/Results/OnTrain/DKNCOR"
      };
      axios({
        url: '/download/zip',  // 请求压缩文件下载接口
        method: 'GET',
        params: param,  // 传递文件名数组
        responseType: 'blob',   // 设置响应类型为二进制流
      }).then((response) => {
        const blob = response.data;
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = "特征表" + '.zip';  // 指定压缩包文件名
        link.click();
      }).catch((error) => {
        console.error('文件下载失败:', error);
      });
    }
  }
};
</script>

<style scoped>
h1, h2, h3 {
  text-align: center;
  color: #333;
}
/* 单选按钮容器样式 */
.radio-container {
  display: flex;
  justify-content: center;
  gap: 30px; /* 增加两个选项之间的间距 */
  margin-bottom: 20px;
}

/* 单选按钮自定义样式 */
.radio-container >>> .el-radio {
  margin: 0;
}

.radio-container >>> .el-radio__input {
  transform: scale(1.3); /* 增大单选圆圈 */
  margin-right: 8px;
}

.radio-container >>> .el-radio__label {
  font-size: 16px;
  padding-left: 5px;
}

/* 滑块样式调整 */
.block {
  width: 80%;
  margin: 0 auto;
}

.demonstration {
  display: block;
  margin-bottom: 10px;
  font-size: 14px;
  color: #666;
}

/* 表格区域样式 */
.el-table {
  margin: 0 auto;
}

/* 分页样式 */
.el-pagination {
  justify-content: center;
  margin-top: 20px;
}
</style>
