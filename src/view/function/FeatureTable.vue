<template>
  <div>
    <el-tabs type="border-card">
      <el-tab-pane>
        <span slot="label"><i class="el-icon-date"></i> 决策表</span>
        <template>
          <el-select v-model="value1" placeholder="gpr_feature_table" class="select" @input="GetfeatureTable">
            <el-option
              v-for="item in options1"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </template>

        <template>
          <el-select v-model="value2" placeholder="请选择" class="select" @input="GetfeatureTable">
            <el-option
              v-for="item in options2"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </template>

        <template>
          <el-button class="button-container" type="primary" icon="el-icon-download">下载</el-button>
        </template>

        <el-table
          :data="tableData1"
          border
          style="width: 100%">
          <el-table-column
            prop="id"
            label="编号"
            width="100">
          </el-table-column>
          <el-table-column
            prop="features"
            label="特征"
            width="320">
          </el-table-column>
          <el-table-column
            prop="Score"
            label="分数"
            width="100">
          </el-table-column>
          <el-table-column
            prop="CV RMSE"
            label="CV RMSE"
            width="100">
          </el-table-column>
          <el-table-column
            prop="RMSE"
            label="RMSE"
            width="100">
          </el-table-column>
          <el-table-column
            prop="R2"
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
            label="d_class"
            width="100">
          </el-table-column>
          <el-table-column
            prop="tag"
            label="轮数"
            width="100">
          </el-table-column>
        </el-table>
        <el-pagination
          background
          layout="prev, pager, next"
          :total="total1"
          :page-size="pageSize1"
          :current-page="currentPage1"
          @current-change="handlePageChange">
        </el-pagination>
      </el-tab-pane>
      <el-tab-pane label="正核特征">
        <template>
          <el-select v-model="value4"  class="select" @input="GetPositivegeKernel">
            <el-option
              v-for="item in options4"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-table
            :data="tableData3"
            border
            style="width: 100%">
            <el-table-column
              prop="id"
              label="编号"
              width="100">
            </el-table-column>
            <el-table-column
              prop="features"
              label="特征"
              width="320">
            </el-table-column>
          </el-table>
        </template>
      </el-tab-pane>
      <el-tab-pane label="领域核特征">
        <template>
          <el-select v-model="value3"  class="select" @input="GetKnowlegeKernel">
            <el-option
              v-for="item in options3"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-table
            :data="tableData2"
            border
            style="width: 100%">
            <el-table-column
              prop="id"
              label="编号"
              width="100">
            </el-table-column>
            <el-table-column
              prop="feature"
              label="特征"
              width="320">
            </el-table-column>
            <el-table-column
              prop="CV RMSE"
              label="CV RMSE"
              width="100">
            </el-table-column>
            <el-table-column
              prop="RMSE"
              label="RMSE"
              width="100">
            </el-table-column>
            <el-table-column
              prop="R2"
              label="R2"
              width="100">
            </el-table-column>
          </el-table>
        </template>
      </el-tab-pane>

      <el-tab-pane label="最优特征集">最优特征集</el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData1: [],
      tableData2:[],
      tableData3:[],
      total2:10,
      total3:1,
      pageSize2: 10,
      currentPage2:1,
      total1: 2000,            // 可能需要从后端获取总记录数
      pageSize1: 40,        // 每页显示条数
      currentPage1: 1,      // 当前页码
      options1: [{
        value: 'gpr_feature_table',
        label: 'gpr决策表'
      }, {
        value: 'knn_feature_table',
        label: 'knn决策表'
      }, {
        value: 'mlr_feature_table',
        label: 'mlr决策表'
      }, {
        value: 'svr_feature_table',
        label: 'svr决策表'
      }],
      options2: [
        {
          value: 'result1',
          label: '结果一'
        },
        {
          value: 'result2',
          label: '结果二'
        },
        {
          value: 'result3',
          label: '结果三'
        },
        {
          value: 'result4',
          label: '结果四'
        },
        {
          value: 'result5',
          label: '结果五'
        },
        {
          value: 'result6',
          label: '结果六'
        },
        {
          value: 'result7',
          label: '结果七'
        },
        {
          value: 'result8',
          label: '结果八'
        },
        {
          value: 'result9',
          label: '结果九'
        },
        {
          value: 'result10',
          label: '结果十'
        }
      ],
      value1: 'gpr_feature_table',
      value2: '',
      value3: 'gpr_knowlegekernel',
      value4: 'gpr_positivekernel',
      options3: [{
        value: 'gpr_knowlegekernel',
        label: 'gpr领域核特征'
      }, {
        value: 'knn_knowlegekernel',
        label: 'knn领域核特征'
      }, {
        value: 'mlr_knowlegekernel',
        label: 'mlr领域核特征'
      }, {
        value: 'svr_knowlegekernel',
        label: 'svr领域核特征'
      }],
      options4: [{
        value: 'gpr_positivekernel',
        label: 'gpr正核特征'
      }, {
        value: 'knn_positivekernel',
        label: 'knn正核特征'
      }, {
        value: 'mlr_positivekernel',
        label: 'mlr正核特征'
      }, {
        value: 'svr_positivekernel',
        label: 'svr正核特征'
      }],
    }
  },
  mounted() {
    this.GetfeatureTable()
    this.GetKnowlegeKernel()
    this.GetPositivegeKernel()
  },
  methods: {
    GetfeatureTable() {
      this.search(1)
    },
    search(page){
      let params={
        page:page,
        pageSize:this.pageSize1,
        value1:this.value1,
        value2:this.value2,
      }
      this.$axios.post('/user/searchFeatureTable', params).then(res => {
        if (res.data.code === 1) {
          const responseData = JSON.parse(res.data.data);
          this.total1 = responseData.total; // 设置总记录数
          this.tableData1 = responseData.list;
        } else {
          this.$notify({
            title: '警告',
            message: '无法获取数据',
            type: 'warning'
          });
        }
      })
    },
    handlePageChange(currentPage) {
      this.currentPage1 = currentPage; // 更新当前页码
      this.search(this.currentPage1); // 获取新页的数据
    },
    GetKnowlegeKernel(){
      let params={
        value:this.value3
      }
      console.log('发送的参数:', params);
      this.$axios.post('/user/getKnowledgeKernel', params).then(res => {
        if (res.data.code === 1) {
          const responseData = JSON.parse(res.data.data);
          this.total2 = responseData.total; // 设置总记录数
          this.tableData2 = responseData.list;
        } else {
          this.$notify({
            title: '警告',
            message: '无法获取数据',
            type: 'warning'
          });
        }
      })
    },
    GetPositivegeKernel(){
      let params={
        value:this.value4
      }

      this.$axios.post('/user/getPositiveKernel', params).then(res => {
        if (res.data.code === 1) {
          const responseData = JSON.parse(res.data.data);
          this.total3 = responseData.total; // 设置总记录数
          this.tableData3 = responseData.list;
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
<style>
.select{
  margin:5px 10px 10px 5px;
}
/deep/ .button-container {
  text-align: right;
}
</style>
