<template>
  <div>
    <h1 style="font-size: 35px; font-family: Gabriola">选择组合方式</h1>

    <!-- 选择组合 -->
    <el-form>
      <el-form-item label="请选择组合">
        <el-checkbox-group v-model="currentSelection">
          <el-checkbox v-for="option in combinationOptions" :key="option.value" :label="option.value">
            {{ option.label }}
          </el-checkbox>
        </el-checkbox-group>
      </el-form-item>

      <!-- 添加组合按钮 -->
      <el-button type="primary" @click="addCombination">添加组合</el-button>
    </el-form>

    <!-- 展示已添加的组合 -->
    <h2>已添加的组合</h2>
    <ul>
      <li v-for="(combination, index) in addedCombinations" :key="index">
        第 {{ index + 1 }} 组: {{ getCombinationLabels(combination).join(' + ') }}
        <el-button type="danger" size="mini" @click="removeCombination(index)">删除</el-button>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 组合选项
      combinationOptions: [
        { label: '单正核特征训练', value: '1' },
        { label: '单领域特征训练', value: '2' },
        { label: '领域特征+正核特征训练', value: '3' },
        { label: '特征组合训练', value: '4' },
        { label: '核特征组合训练', value: '5' }
      ],
      currentSelection: [],  // 当前选择的组合
      addedCombinations: []  // 已添加的组合
    };
  },
  methods: {
    // 添加组合
    addCombination() {
      if (this.currentSelection.length > 0) {
        this.addedCombinations.push([...this.currentSelection]); // 保存当前选择
        this.currentSelection = []; // 清空当前选择
      } else {
        this.$message.warning('请至少选择一个组合');
      }
    },
    // 获取组合的 label
    getCombinationLabels(combination) {
      return combination.map(value => {
        const option = this.combinationOptions.find(option => option.value === value);
        return option ? option.label : '';
      });
    },
    // 删除组合
    removeCombination(index) {
      this.addedCombinations.splice(index, 1);
    },

  }
}
</script>

<style scoped>

</style>
