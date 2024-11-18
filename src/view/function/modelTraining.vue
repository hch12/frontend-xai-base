<template>
  <div>
    <div class="centered-content">
      <h1 style="font-size: 35px; font-family: Gabriola">模型训练</h1>
    </div>
    <div>
      <h3 style="font-size: 17px">模型模式选择</h3>
      <br>
      <el-radio-group v-model="pattern" class="large-radio">
        <el-radio label="1">单正核特征训练</el-radio>
        <el-radio label="2">单领域特征训练</el-radio>
        <el-radio label="3">领域特征+正核特征训练</el-radio>
      </el-radio-group>
    </div>
    <br>
    <br>
    <el-collapse v-model="activeNames" @change="handleChange" class="large-radio">
      <el-collapse-item title="领域核特征配置" name="1" class="header" v-if="pattern!=1">
        <el-button type="primary" @click="openDialog" style="float: right">添加核特征</el-button>
        <br />
        <h3>已添加的组合</h3>
        <ul style="line-height: 3; font-size: 14px;">
          <li v-for="(combination, index) in addedCombinations" :key="index">
            第 {{ index + 1 }} 组: {{ getCombinationLabels(combination).join(' + ') }}
            <el-button type="danger" size="mini" @click="removeCombination(index)">删除</el-button>
          </li>
        </ul>
      </el-collapse-item>
    </el-collapse>
    <div>
      <el-dialog title="添加" :visible.sync="dialogVisible" :modal="false">
        <el-checkbox-group v-model="checkList">
          <el-checkbox
            v-for="(item, index) in options"
            :key="index"
            :label="index"
          >
            <!-- 使用 index 作为 label -->
            {{ index }}: {{ item }} <!-- 显示序号和对应的值 -->
          </el-checkbox>
        </el-checkbox-group>
        <br />
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </el-dialog>
    </div>
    <br>
    <br>
    <br>
    <br>
    <br>
    <el-button type="primary" @click="training">训练</el-button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      pattern: "1",
      dialogVisible: false,
      checkList: [], // 保存用户选择的序号
      options: [], // 数组中的实际值
      addedCombinations: [], // 保存添加的组合
      addedValues: [], // 保存添加的值
    };
  },
  mounted() {
    this.GetSign();
  },
  methods: {

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
    training(){
      this.GetSign();
    },
    GetSign(){
      this.$axios.post('/user/getSign').then(res => {
        if (res.data.code === 1) {
          const list = JSON.parse(res.data.data);
          this.options=list.result.map(item => item.name);
          this.options.pop();
        } else {
          this.$notify({
            title: '警告',
            message: '无法获取数据',
            type: 'warning'
          });
        }
      })
    }
  },
};

</script>

<style scoped>
.centered-content {
  display: flex;
  flex-direction: column;
  align-items: center; /* 垂直居中 */
  text-align: center; /* 文字居中 */
}

/* 使用 /deep/ 来穿透 scoped 样式 */
.large-radio /deep/ .el-collapse-item__header {
  font-size: 16px !important; /* 调整字体大小并提升优先级 */
  font-weight: bold !important;
  border:wave;
}
</style>
