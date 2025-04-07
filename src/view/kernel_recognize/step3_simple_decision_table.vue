<template>
  <div>
    <h1>最简决策表</h1>
    <div>
      <el-select v-model="value1" placeholder="选择特征表" class="select" @change="change">
        <el-option
          v-for="item in options1"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <div style="display: flex;justify-self: flex-end"><el-button type="primary"  @click="download">下载</el-button></div>
      </div>

     <el-table v-loading="process"
       :data="tableData"
       style="width: 95%"
       height="1500px">
        <el-table-column
          v-for="(column, index) in head"
          :key="index"
          :prop="column"
          :label="column"
        >
        </el-table-column>
      </el-table>
    </div>
</template>



<script>
import axios from "axios";

export default {
  name: "step3_simple_decision_table",
  data() {
    return {
      tableData: [],
      head:[],
      value1: 'gpr_decision_table', // 默认选择的表
      options1: [
        { value: 'gpr_decision_table', label: 'Gaussian Process Regression' },
        { value: 'knn_decision_table', label: 'K-Nearest Neighbors' },
        { value: 'mlr_decision_table', label: 'Multiple Linear Regression' },
        { value: 'svr_decision_table', label: 'Support Vector Regression' }
      ],
      process:true
    }
  },
  mounted() {
    this.GetSign()
    this.GetSimpleDecision()
  },
  methods:{
    GetSign() {
      this.$axios.post('/user/getSign').then(res => {
        if (res.data.code === 1) {
          const list = JSON.parse(res.data.data);
          this.head = list.result.map(item => item.name);
          this.head.pop();
          this.head.push("d_class")
        } else {
          this.$notify({
            title: '警告',
            message: '无法获取数据',
            type: 'warning'
          });
        }
      })
    },
    GetSimpleDecision()
    {let
      params={
      Value:this.value1
    }
      this.$axios.post('/user/simple',params).then(res => {
        if (res.data.code === 1) {
          const responsedata = JSON.parse(res.data.data);
          this.tableData=responsedata.list;
          this.process=false
        } else {
          this.$notify({
            title: '警告',
            message: '无法获取数据',
            type: 'warning'
          });
        }
      })
    },
    change()
    {let
      params={
        Value:this.value1
      }
      this.$axios.post('/user/searchsimple',params).then(res => {
        if (res.data.code === 1) {
          const responsedata = JSON.parse(res.data.data);
          this.tableData=responsedata.list;
          this.process=false;
        } else {
          this.$notify({
            title: '警告',
            message: '无法获取数据',
            type: 'warning'
          });
        }
      })
    },
    download(){
      let param = {
        filename: "decision_table.xlsx"
      }
      axios({
        url: '/download/output',  // 请求压缩文件下载接口
        method: 'GET',
        params: param,  // 传递文件名数组
        responseType: 'blob',   // 设置响应类型为二进制流
      }).then((response) => {
        const blob = response.data;
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = "最简决策表" + '.zip';  // 指定压缩包文件名
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
