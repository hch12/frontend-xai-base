<!--<template>-->
<!--  <div>-->
<!--    <h1>Feature Table Page</h1>-->
<!--    <el-table-->
<!--      :data="tableData"-->
<!--      border-->
<!--      style="width: 100%">-->
<!--      <el-table-column-->
<!--        prop="id"-->
<!--        label="编号"-->
<!--        width="180">-->
<!--      </el-table-column>-->
<!--      <el-table-column-->
<!--        prop="features"-->
<!--        label="特征"-->
<!--        width="180">-->
<!--      </el-table-column>-->
<!--      <el-table-column-->
<!--        prop="Score"-->
<!--        label="分数">-->
<!--      </el-table-column>-->
<!--      <el-table-column-->
<!--        prop="CV RMSE"-->
<!--        label="CV RMSE">-->
<!--      </el-table-column>-->
<!--      <el-table-column-->
<!--        prop="RMSE"-->
<!--        label="RMSE">-->
<!--      </el-table-column>-->
<!--      <el-table-column-->
<!--        prop="R2"-->
<!--        label="R2">-->
<!--      </el-table-column>-->
<!--      <el-table-column-->
<!--        prop="Time"-->
<!--        label="时间">-->
<!--      </el-table-column>-->
<!--      <el-table-column-->
<!--        prop="d_class"-->
<!--        label="d_class">-->
<!--      </el-table-column>-->
<!--      <el-table-column-->
<!--        prop="tag"-->
<!--        label="轮数">-->
<!--      </el-table-column>-->
<!--    </el-table>-->
<!--    <el-pagination-->
<!--      background-->
<!--      layout="prev, pager, next"-->
<!--      :total="200">-->
<!--    </el-pagination>-->
<!--  </div>-->
<!--</template>-->

<!--<script>-->
<!--export default {-->
<!--  data() {-->
<!--    return {-->
<!--      tableData: [],-->
<!--    }-->
<!--  },-->
<!--  mounted: function () {-->
<!--    this.GetTable();-->
<!--  },-->
<!--  methods: {-->
<!--    GetTable() {-->
<!--//      this.menuData=[{order: "3",name: "研究生入学测试",children: [{name: "回归",order: "31",path: "/regression"},{name: "聚类",order: "32",path: "/clustering"}]}]-->
<!--      let params = {};-->
<!--      this.$axios.post('/user/getfeatureTable', params).then(res => {-->
<!--        if (res.data.code === 1) {-->
<!--          this.tableData = JSON.parse(res.data.data);-->
<!--        } else {-->
<!--          this.$notify({-->
<!--            title: '警告',-->
<!--            message: res.data.msg,-->
<!--            type: 'warning'-->
<!--          });-->
<!--        }-->
<!--      })-->
<!--    }-->
<!--  }-->
<!--}-->

<!--</script>-->

<!--<style scoped>-->
<!--/* 样式 */-->
<!--</style>-->
<template>
  <div>

    <h1>Feature Table Page</h1>
    <template>

      <el-select
        v-model="value1"
        multiple
        collapse-tags
        style="margin-left: 20px;"
        placeholder="请选择">
        <el-option
          v-for="item in options1"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>

      <el-select
        v-model="value2"
        multiple
        collapse-tags
        style="margin-left: 20px;"
        placeholder="请选择">
        <el-option
          v-for="item in options2"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>

    </template>


    <el-table
      :data="tableData"
      border
      style="width: 100%">
      <el-table-column
        prop="id"
        label="编号"
        width="180">
      </el-table-column>
      <el-table-column
        prop="features"
        label="特征"
        width="180">
      </el-table-column>
      <el-table-column
        prop="Score"
        label="分数">
      </el-table-column>
      <el-table-column
        prop="CV RMSE"
        label="CV RMSE">
      </el-table-column>
      <el-table-column
        prop="RMSE"
        label="RMSE">
      </el-table-column>
      <el-table-column
        prop="R2"
        label="R2">
      </el-table-column>
      <el-table-column
        prop="Time"
        label="时间">
      </el-table-column>
      <el-table-column
        prop="d_class"
        label="d_class">
      </el-table-column>
      <el-table-column
        prop="tag"
        label="轮数">
      </el-table-column>
    </el-table>
    <el-pagination
      background
      layout="prev, pager, next"
      :total="total"
      :page-size="pageSize"
      :current-page="currentPage"
      @current-change="handlePageChange">
    </el-pagination>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableData: [],
      total: 2000,            // 可能需要从后端获取总记录数
      pageSize: 40,        // 每页显示条数
      currentPage: 1,      // 当前页码
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
          value: 'result0',
          label: '结果一'
        },
        {
          value: 'result1',
          label: '结果二'
        },
        {
          value: 'result2',
          label: '结果三'
        },
        {
          value: 'result3',
          label: '结果四'
        },
        {
          value: 'result4',
          label: '结果五'
        },
        {
          value: 'result5',
          label: '结果六'
        },
        {
          value: 'result6',
          label: '结果七'
        },
        {
          value: 'result7',
          label: '结果八'
        },
        {
          value: 'result8',
          label: '结果九'
        },
        {
          value: 'result9',
          label: '结果十'
        }
      ],
      value1: [],
      value2: []
    }
  },
  mounted() {
    this.GetTable(this.currentPage, this.pageSize);

  },
  methods: {
    GetTable(page, pageSize) {
      let params = {
        page: page,
        pageSize: pageSize
      };
      this.$axios.post('/user/getfeatureTable', params).then(res => {
        if (res.data.code === 1) {
          const responseData = JSON.parse(res.data.data);
          this.total = responseData.total; // 设置总记录数
          this.tableData = responseData.list;
        } else {
          this.$notify({
            title: '警告',
            message: '无法获取数据',
            type: 'warning'
          });
        }
      })
    },
    handlePageChange(page) {
      this.currentPage = page;
      this.GetTable(this.currentPage, this.pageSize);
    }
  }
}
</script>
