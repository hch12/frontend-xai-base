<template>
  <div>
    <h1>特征决策表聚类</h1>
    <div style="margin: 20px 100px ">
      <el-select v-model="value1" placeholder="选择特征表" class="select" @change="changeFeatureTable">
        <el-option
          v-for="item in options1"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <div style="display: flex; justify-self: flex-end"><el-button type="primary" @click="download">下载</el-button></div>
    </div>

    <div style="display: flex; justify-self:center; align-items: center; margin-bottom: 20px">
      <el-table
        :data="tableData"
        border
        style="width: 85%;">
        <el-table-column
          prop="id"
          label="编号"
          width="100">
        </el-table-column>
        <el-table-column
          prop="features"
          label="特征"
          width="620">
        </el-table-column>
        <el-table-column
          prop="Score"
          label="分数"
          width="150">
        </el-table-column>
        <el-table-column
          prop="CV RMSE"
          label="CV RMSE"
          width="150">
        </el-table-column>
        <el-table-column
          prop="Test RMSE"
          label="RMSE"
          width="150">
        </el-table-column>
        <el-table-column
          prop="Test R2"
          label="R2"
          width="100">
        </el-table-column>
        <el-table-column
          prop="Time"
          label="时间"
          width="100">
        </el-table-column>
        <el-table-column
          prop="d_class"
          label="类别"
          width="100">
        </el-table-column>
      </el-table>
    </div>

    <div style="display: flex; justify-self: center">
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
</template>

<script>
import axios from "axios";

export default {
  name: "step1_cluster",
  data() {
    return {
      pageSize: 10, // 每页记录数
      value1: 'gpr_feature_table', // 默认选择的表
      options1: [
        { value: 'gpr_feature_table', label: 'gpr' },
        { value: 'knn_feature_table', label: 'knn' },
        { value: 'mlr_feature_table', label: 'mlr' },
        { value: 'svr_feature_table', label: 'svr' }
      ],
      tableData: [], // 表格数据
      total: 0, // 数据总数
      currentPage: 1, // 当前页码
    }
  },

  methods: {
    // 获取特征决策表数据
    solve(page) {
      let params = {
        Page: page,
        PageSize: this.pageSize,
        Value1: this.value1,
      }
      this.$axios.post('/user/cluster', params).then(res => {
        if (res.data.code === 1) {
          const responseData = JSON.parse(res.data.data);
          this.tableData = responseData.list;
          this.total = responseData.total; // 假设返回数据中有 total 字段
        } else {
          this.$notify({
            title: '警告',
            message: '无法获取数据',
            type: 'warning'
          });
        }
      }).catch(error => {
        this.$notify({
          title: '错误',
          message: '网络错误，请稍后再试',
          type: 'error'
        });
      });
    },

    SearchfeatureTable(page) {
      let params = {
        Page: this.currentPage,
        PageSize: this.pageSize,
        Value1: this.value1,
      }
      this.$axios.post('/user/searchFeatureTable', params).then(res => {
        if (res.data.code === 1) {
          const responseData = JSON.parse(res.data.data);
          this.tableData = responseData.list;
        } else {
          this.$notify({
            title: '警告',
            message: '无法获取数据',
            type: 'warning'
          });
        }
      });
    },
    changeFeatureTable(){
      this.SearchfeatureTable(1);
    },
    // 更新当前页码
    handlePageChange(currentPage) {
      this.currentPage = currentPage;
      this.SearchfeatureTable(this.currentPage); // 获取新页的数据
    },

    // 下载数据功能（假设有下载接口）
    download(){
      let param = {
        address: "./src/main/resources/python/MultifacetedModeling/Results/OnTrain/DKNCOR"
      }
      axios({
        url: '/download/zip',  // 请求压缩文件下载接口
        method: 'GET',
        params: param,  // 传递文件名数组
        responseType: 'blob',   // 设置响应类型为二进制流
      }).then((response) => {
        const blob = response.data;
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = "聚类特征表" + '.zip';  // 指定压缩包文件名
        link.click();
      }).catch((error) => {
        console.error('文件下载失败:', error);
      });
    }
  },
  mounted() {
    this.solve(this.currentPage);
  }
}
</script>

<style scoped>
/* 添加你自己的样式 */
h1,
h2,
h3 {
  text-align: center;
  color: #333;
}
</style>
