<!-- KnowledgeKernels.vue -->
    <div>
      <div class="centered-content">
        <h1 style="font-size: 35px; font-family: Gabriola">添加领域特征</h1>
      </div>
      <br>
      <br>
      <el-button type="primary" @click="openDialog" style="float: right">添加核特征</el-button>
      <br />
      <h3>已添加的组合</h3>
      <ul style="line-height: 3; font-size: 14px;">
        <li v-for="(combination, index) in addedCombinations" :key="index">
          第 {{ index + 1 }} 组: {{ getCombinationLabels(combination).join(' + ') }}
          <el-button type="danger" size="mini" @click="removeCombination(index)">删除</el-button>
        </li>
      </ul>
      <div>
        <el-dialog title="添加" :visible.sync="dialogVisible" :modal="false">
          <el-checkbox-group v-model="checkList">
            <el-checkbox
              v-for="(item, index) in options"
              :key="index"
              :label="index"
            >
              {{ index }}: {{ item }}
            </el-checkbox>
          </el-checkbox-group>
          <br />
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="submit">确 定</el-button>
        </el-dialog>
      </div>
      <br>
      <br>
      <el-button type="primary" @click="GetKnowledgeKernel">获取领域核特征</el-button>
    </div>


<script>
export default {
  name: "KnowledgeKernels",
  data:{
    //领域特征变量
    dialogVisible: false,
    checkList: [], // 保存用户选择的序号
    options: [], // 数组中的实际值
    addedCombinations: [], // 保存添加的组合
    addedValues: [], // 保存添加的值
},
  mounted() {
    this.GetSign()
  },
methods: {
  // 领域特征函数
  GetKnowledgeKernel() {
    let params = {
      V: this.addedCombinations,
    };
    this.$axios.post('/user/training', params).then(res => {
      console.log(params.V);
      if (res.data.code === 1) {
        this.$notify({
          title: '提示',
          message: '领域核特征表已更新',
          type: 'success'
        });
      } else {
        this.$notify({
          title: '警告',
          message: '无法获取数据',
          type: 'warning'
        });
      }
    });
  },

  addCombination() {
    if (this.checkList.length > 0) {
      this.addedCombinations.push([...this.checkList]); // 保存当前选择
      this.checkList = []; // 清空当前选择
    } else {
      this.$message.warning("请至少选择一个组合");
    }
  },
  getCombinationLabels(combination) {
    return combination.map((index) => this.options[index]); // 根据序号获取组合项的名称
  },
  openDialog() {
    this.dialogVisible = true;
  },
  submit() {
    this.addCombination();
    this.dialogVisible = false; // 提交后关闭对话框
  },
  removeCombination(index) {
    this.addedCombinations.splice(index, 1); // 删除指定组合
  },
  GetSign() {
    this.$axios.post('/user/getSign').then(res => {
      if (res.data.code === 1) {
        const list = JSON.parse(res.data.data);
        this.options = list.result.map(item => item.name);
        this.options.pop();
      } else {
        this.$notify({
          title: '警告',
          message: '无法获取数据',
          type: 'warning'
        });
      }
    })
  },
},
};
</script>
<style scoped>

</style>
