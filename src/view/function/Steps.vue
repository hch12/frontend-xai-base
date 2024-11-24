<template>
  <div class="container">
    <h1>属性分而治之平台</h1>
    <div class="steps">
      <el-steps :active="active1" finish-status="success">
        <el-step title="领域核特征识别"></el-step>
        <el-step title="数据核特征识别"></el-step>
        <el-step title="特征团构建"></el-step>
        <el-step title="多方面构效关系分析"></el-step>
      </el-steps>
    </div>

    <!-- 子步骤 -->
    <div v-if="active1 === 0">
      <el-steps :active="active2" finish-status="success" simple>
        <el-step title="数据集上传"></el-step>
        <el-step title="输入领域核特征"></el-step>
      </el-steps>
      <br>
      <div v-if="active2===0">
        <DataUpload />
      </div>
      <div v-if="active2===1">
        <KnowledgeKernels />
      </div>
      <br>
    </div>

    <!-- 按钮 -->
    <div class="button-group">
      <el-button type="primary" @click="sub">上一步</el-button>
      <el-button type="primary" @click="add">下一步</el-button>
    </div>
  </div>
</template>

<script>
import DataUpload from "../data_analysis/DataUpload";
import KnowledgeKernels from "../data_analysis/KnowledgeKernels";
import FeatureTable from "./FeatureTable";
export default {
  components: { KnowledgeKernels, DataUpload},
  data() {
    return {
      active1: 0, // 主步骤索引
      active2: 0, // 子步骤索引
      currentStep: 0, // 当前全局步数
    };
  },
  methods: {
    updateSteps() {
      if (this.currentStep < 2) {
        this.active1 = 0;
        this.active2 = this.currentStep;
      } else {
        this.active1 = this.currentStep - 2;
        this.active2 = 0;
      }
    },
    add() {
      if (this.currentStep < 5) {
        this.currentStep++;
        this.updateSteps();
      }
    },
    sub() {
      if (this.currentStep > 0) {
        this.currentStep--;
        this.updateSteps();
      }
    },
  },
};
</script>

<style scoped>
.container {
  max-width: 95%;
  margin: 0 auto;
  padding: 20px;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-family: Arial, sans-serif;
}
</style>
