<!-- KnowledgeKernels.vue -->
<template>
  <div v-if="active12===1">
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
      <div>
      </div>
</template>

<script>
export default {
  name: "KnowledgeKernels",
};
</script>


<style scoped>

</style>
