<template>
  <!-- 动态版关系展示 -->
  <div class="section">
    <h2>关键构效关系总结</h2>
    <div class="relation-list">
      <div v-for="(rel, index) in relations" :key="index" class="relation-item">
        <div class="relation-index">R{{ index + 1 }}</div>
        <div class="relation-content">
          <strong>{{ rel.description }}</strong>
          <span class="direction" :class="rel.trend">
            {{ rel.direction }}
          </span>
          <el-tooltip v-if="rel.trend === 'positive'" effect="light">
            <template #content>关键预测因子</template>
            <i class="el-icon-info tip-icon"></i>
          </el-tooltip>
          <el-tooltip v-else-if="rel.description.includes('熵')" effect="light">
            <template #content>最具区分性指标</template>
            <i class="el-icon-info tip-icon"></i>
          </el-tooltip>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'KNN_analysis',
  data() {
    return {
      relations: []
    }
  },
  mounted() {
    this.getKnnInformation()
  },
  methods: {
    getKnnInformation() {
      axios.get('user/MLRAnalyze').then(res => {
        if (res.data.code === 1) {
          try {
            const parsedData = JSON.parse(res.data.data)
            this.relations = parsedData.list || []
          } catch (e) {
            console.error('数据解析错误:', e)
          }
        }
      }).catch(error => {
        console.error('请求出错:', error)
      })
    }
  }
}
</script>

<style scoped>
.analysis-container {
  max-width: 900px;
  margin: 20px auto;
  padding: 0 15px;
}

.section {
  margin-bottom: 30px;
  background: white;
  padding: 20px;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

h2 {
  color: #333;
  font-size: 18px;
  margin-bottom: 15px;
  padding-bottom: 8px;
  border-bottom: 1px solid #eee;
}

.relation-list {
  display: grid;
  gap: 12px;
}

.relation-item {
  display: flex;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px dashed #eee;
}

.relation-index {
  width: 40px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  background: #f5f7fa;
  border-radius: 50%;
  margin-right: 12px;
  font-weight: bold;
  color: #409EFF;
}

.relation-content {
  flex: 1;
  font-size: 14px;
}

.direction {
  margin-left: 8px;
  padding: 2px 6px;
  border-radius: 3px;
  font-size: 13px;
}

.direction.negative {
  background: #fef0f0;
  color: #f56c6c;
}

.direction.positive {
  background: #f0f9eb;
  color: #67c23a;
}

.tip-icon {
  margin-left: 8px;
  color: #909399;
  cursor: help;
}
</style>
