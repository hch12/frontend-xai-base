<template>
  <div>
    <h1>构建特征决策表</h1>
    <div class="block">
      <span class="demonstration">划分次数</span>
      <el-slider v-model="split" :min="1" :max="10"></el-slider>
    </div>
    <br>
    <div class="block">
      <span class="demonstration">重复执行次数</span>
      <el-slider v-model="repeat" :min="1" :max="200"></el-slider>
    </div>
    <br>

    <div class="block">
      <span class="demonstration">迭代次数</span>
      <el-slider v-model="iteration":min="1":max="50"></el-slider>
    </div>
    <br>
    <div v-show="!OK&&process">
    <el-progress :percentage="progress" />
   </div>
    <br>
    <div style="display: flex;justify-self: flex-end"><el-button type="primary" round @click="GetfeatureTable">获取特征表</el-button></div>
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
      <div style="display: flex;justify-self: flex-end"><el-button type="primary"  @click="download">下载</el-button></div>

    </div>
    <div style="display: flex; justify-self:center;align-items: center; margin-bottom: 20px">
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
      </el-table>
      <br>
    </div>
    <div style="display: flex;justify-self: center">
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
      repeat: 10,
      iteration: 2,
      pageSize: 10, // 初始化 pageSize
      value1: 'gpr_feature_table',
      options1: [
        {value: 'gpr_feature_table', label: 'gpr决策表'},
        {value: 'knn_feature_table', label: 'knn决策表'},
        {value: 'mlr_feature_table', label: 'mlr决策表'},
        {value: 'svr_feature_table', label: 'svr决策表'}
      ],
      tableData: [], // 初始化表格数据
      total: 0, // 初始化总记录数
      currentPage: 1, // 当前页数
      OK:true,
      progress: 0, // 初始进度
      timer: null, // 定时器
      process:false
    }
  },
  methods: {
    GetfeatureTable() {
      this.process=true;
      this.startProgress()
      this.solve(1)
    },
    solve(page) {
      let params = {
        Page: page,
        PageSize: this.pageSize,
        Value1: this.value1,
        Split: this.split,
        Repeat: this.repeat,
        Iteration: this.iteration
      }
      this.$axios.post('/user/FeatureTable', params).then(res => {
        if (res.data.code === 1) {
          const responseData = JSON.parse(res.data.data);
          this.tableData = responseData.list;
          this.total=responseData.total;
          this.progress=100;
          this.OK=true;
        } else {
          this.$notify({
            title: '警告',
            message: '无法获取数据',
            type: 'warning'
          });
        }
      })
    },
    SearchfeatureTable(page) {
      let params = {
        Page: page,
        PageSize: this.pageSize,
        Value1: this.value1,
      }
      this.$axios.post('/user/searchFeatureTable', params).then(res => {
        if (res.data.code === 1) {
          const responseData = JSON.parse(res.data.data);
          this.tableData = responseData.list;
          this.total=responseData.total;
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
    // 启动进度条
    startProgress() {
      if (this.timer) {
        clearInterval(this.timer); // 清除之前的定时器
      }
      this.progress = 0; // 重置进度
      this.timer = setInterval(() => {
        if (this.progress < 12) {
          this.progress += 2; // 增加进度
        }else if(this.progress<99){
          this.progress +=1;
        }
        else if(this.progress==99)
        {
          this.progress=this.progress
        }
        else {
          clearInterval(this.timer); // 进度到达100%时清除定时器
        }
      }, 3000); // 每100毫秒增加一次进度
    },
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
        link.download = "特征表" + '.zip';  // 指定压缩包文件名
        link.click();
      }).catch((error) => {
        console.error('文件下载失败:', error);
      });
    }
  }
}
</script>

<style scoped>
h1,
h2,
h3 {
  text-align: center;
  color: #333;
}
</style>
