<template>
  <div>
    <h1>决策表求核</h1>

    <div>
      <el-select v-model="value1" placeholder="选择特征表" class="select" @change="change">
        <el-option
          v-for="item in options1"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
    </div>

    <div>
      <el-table
        :data="tableData"
        style="width: 90%">
        <el-table-column
          prop="positive_kernel"
          label="正核特征"
          width="250">
        </el-table-column>
        <el-table-column
          prop="negative_kernel"
          label="负核特征"
          width="250">
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
export default {
  name: "step5_positive_kernel",
  data(){
    return {
      tableData:[],
      value1: 'gpr_positive_kernel', // 默认选择的表
      options1: [
        { value: 'gpr_positive_kernel', label: 'gpr' },
        { value: 'knn_positive_kernel', label: 'knn' },
        { value: 'mlr_positive_kernel', label: 'mlr' },
        { value: 'svr_positive_kernel', label: 'svr' }
      ],
    }
  },
  mounted() {
    this.Getkernel()
  },
  methods: {
    Getkernel()
    {let
      params={
        Value:this.value1
      }
      this.$axios.post('/user/positivekernel',params).then(res => {
        if (res.data.code === 1) {
          const responsedata = JSON.parse(res.data.data);
          this.tableData=responsedata.list;
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
      this.$axios.post('/user/searchpositivekernel',params).then(res => {
        if (res.data.code === 1) {
          const responsedata = JSON.parse(res.data.data);
          this.tableData=responsedata.list;
        } else {
          this.$notify({
            title: '警告',
            message: '无法获取数据',
            type: 'warning'
          });
        }
      })
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
