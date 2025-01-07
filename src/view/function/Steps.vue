<template>
  <div class="container">
    <h1>属性分而治之平台</h1>
    <!-- 主步骤 -->
    <div class="steps">
      <el-steps :active="active1" finish-status="success">
        <el-step title="领域核特征识别"></el-step>
        <el-step title="数据核特征识别"></el-step>
        <el-step title="特征团构建"></el-step>
        <el-step title="多方面构效关系分析"></el-step>
      </el-steps>
    </div>

    <!-- 子步骤 1：领域核特征识别 -->
    <div v-if="active1 === 0" class="sub-steps">
      <el-steps :active="active2" finish-status="success" simple>
        <el-step title="数据集上传"></el-step>
        <el-step title="输入领域核特征"></el-step>
      </el-steps>
      <div v-if="active2 === 0">
        <DataUpload />
      </div>
      <div v-if="active2 === 1">
        <KnowledgeKernels />
      </div>
    </div>

    <!-- 子步骤 2：数据核特征识别 -->
    <div v-if="active1 === 1" class="sub-steps">
      <el-steps :active="active2" align-center finish-status="success">
        <el-step title="构建特征决策表"></el-step>
        <el-step title="特征决策表聚类"></el-step>
        <el-step title="最简决策表构建"></el-step>
        <el-step title="决策表求核"></el-step>
        <el-step title="正数据核特征识别"></el-step>
      </el-steps>
      <div v-if="active2 === 0">
         <step1_featuretable/>
      </div>
      <div v-if="active2 === 1">
        <step2_cluster/>
      </div>
      <div v-if="active2 === 2">
        <step3_simple_decision_table/>
      </div>
      <div v-if="active2 === 3">
        <step4_kernel/>
      </div>
      <div v-if="active2 === 4">
        <step5_positive_kernel/>
      </div>
    </div>

    <div v-if="active1 === 2" class="sub-steps">
      <Construction />
    </div>

    <!-- 子步骤 3：多方面构效关系分析 -->
    <div v-if="active1 === 3" class="sub-steps">
      <el-row :gutter="20" class="navigation">
        <el-col :span="5">
          <el-menu
            default-active="1-1"
            class="el-menu-vertical-demo narrow-menu"
            @select="handleSelect"
          >
            <el-submenu index="1">
              <template slot="title">基于 MLR 的材料构效关系提取</template>
              <el-menu-item index="1-1">可解释方法</el-menu-item>
              <el-menu-item index="1-2">分析步骤</el-menu-item>
            </el-submenu>
            <el-submenu index="2">
              <template slot="title">基于 KNN 的材料构效关系提取</template>
              <el-menu-item index="2-1">可解释方法</el-menu-item>
              <el-menu-item index="2-2">分析步骤</el-menu-item>
            </el-submenu>
            <el-submenu index="3">
              <template slot="title">基于 SVR 的材料构效关系提取</template>
              <el-menu-item index="3-1">可解释方法</el-menu-item>
              <el-menu-item index="3-2">分析步骤</el-menu-item>
            </el-submenu>
            <el-submenu index="4">
              <template slot="title">基于 GPR 的材料构效关系提取</template>
              <el-menu-item index="4-1">可解释方法</el-menu-item>
              <el-menu-item index="4-2">分析步骤</el-menu-item>
            </el-submenu>
          </el-menu>
        </el-col>

        <!-- 右侧内容区域 -->
        <el-col :span="19">
          <el-card shadow="always">
            <component :is="currentComponent" />
          </el-card>
        </el-col>
      </el-row>
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
import step1_featuretable from "../kernel_recognize/step1_featuretable";
import step2_cluster from "../kernel_recognize/step2_cluster";
import step3_simple_decision_table from "../kernel_recognize/step3_simple_decision_table";
import step4_kernel from "../kernel_recognize/step4_kernel";
import Step5_positive_kernel from "../kernel_recognize/step5_positive_kernel";
import Construction from "../cluster/Construction";
import SVR from "../relative_analysis/SVR";
export default {
  components: {
    SVR,
    Construction,
    Step5_positive_kernel,
    step4_kernel,step3_simple_decision_table,step1_featuretable, KnowledgeKernels, DataUpload,step2_cluster},
  data() {
    return {
      active1: 0, // 主步骤索引
      active2: 0, // 子步骤索引
      currentStep: 0, // 当前全局步数
      currentComponent: "MLR"
    };
  },
  methods: {
    updateSteps() {
      if (this.currentStep < 2) {
        this.active1 = 0;
        this.active2 = this.currentStep;
      } else if (this.currentStep < 7) {
        this.active1 = 1;
        this.active2 = this.currentStep - 2;
      } else if (this.currentStep < 8) {
        this.active1 = 2;
        this.active2 = this.currentStep - 7;
      } else {
        this.active1 = 3;
        this.active2 = this.currentStep - 8;
      }
    },
    add() {
      if (this.currentStep < 10) {
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
    handleSelect(index) {
      const componentsMap = {
        "1-1": "MLR",
        "3-1": "SVR"
      };
      this.currentComponent = componentsMap[index] || "MLR"; // 根据索引动态加载组件
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
.sub-steps {
  margin-top: 20px;
}

.navigation .narrow-menu {
  border: 1px solid #ddd;
  background: #f9f9f9;
  border-radius: 8px;
}

.el-menu-item {
  font-size: 14px;
}

.el-card {
  font-size: 16px;
  padding: 20px;
}

.el-card h2 {
  font-size: 18px;
  color: #e74c3c;
  margin-bottom: 10px;
}

.button-group {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}
</style>
