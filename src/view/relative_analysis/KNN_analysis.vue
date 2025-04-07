<template>
  <div class="analysis-container">
    <!-- 原有KNN分析表格 -->
    <div class="section">
      <h2>KNN构效关系分析</h2>
      <el-table :data="tableData" border style="width: 100%" size="small">
        <el-table-column prop="levelNode" label="层级-节点" width="100" align="center"/>
        <el-table-column prop="features" label="特征值" align="center">
          <template #default="{row}">
            <span v-if="row.features.length">{{ row.features.join(', ') }}</span>
            <span v-else class="muted">-</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="80" align="center">
          <template #default="{row}">
            <el-button
              v-if="row.features.length"
              type="text"
              size="small"
              @click="handleDownload(row)"
            >
              下载
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="section">
      <h2>决策树结构</h2>
      <el-image
        src="../../static/img.png"> <!-- 使用你原来成功的路径 -->
      </el-image>
    </div>
    <!-- 简洁版关系展示 -->
    <div class="section">
      <h2>关键构效关系总结</h2>
      <div class="relation-list">
        <div v-for="(rel, index) in relations" :key="index" class="relation-item">
          <div class="relation-index">R{{ index + 1 }}</div>
          <div class="relation-content">
            <strong>{{ rel.descriptor }}</strong>
            <span class="direction" :class="rel.trend">
              {{ rel.direction }}
            </span>
            <el-tooltip v-if="rel.note" effect="light">
              <template #content>{{ rel.note }}</template>
              <i class="el-icon-info tip-icon"></i>
            </el-tooltip>
          </div>
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
      tableData: [],
      relations: [
        {
          descriptor: 'E_Na(3)构型熵',
          direction: '↑  → 势垒 ↓ ',
          trend: 'negative',
          note: '最具区分性指标'
        },
        {
          descriptor: '通道尺寸',
          direction: '↑  → 势垒 ↓  ',
          trend: 'negative'
        },
        {
          descriptor: 'X元素混杂度',
          direction: '↑  → 势垒 ↓',
          trend: 'negative'
        },
        {
          descriptor: 'M元素离子半径',
          direction: '↑ → 势垒 ↓',
          trend: 'negative'
        },
        {
          descriptor: '末层描述符V_Na(1)O6和Min_BT',
          direction: '预测精度 ↑ ',
          trend: 'positive',
          note: '关键预测因子'
        }
      ]
    }
  },
  mounted() {
    this.getKnnInformation()
  },
  methods: {
    getKnnInformation() {
      axios.get('user/KNNAnalyze').then(res => {
        console.log('API响应数据:', res.data); // 调试用
        if (res.data.code === 200 || res.data.code === 1) { // 兼容两种code
          this.prepareTableData(res.data.data || res.data);
        } else {
          this.$notify({
            title: '警告',
            message: res.data.msg || '无法获取数据',
            type: 'warning'
          });
        }
      }).catch(error => {
        console.error('请求出错:', error);
        this.$notify.error({
          title: '错误',
          message: '数据请求失败'
        });
      });
    },
    prepareTableData(nodes) {
      // 如果nodes是字符串，则解析为对象
      if (typeof nodes === 'string') {
        try {
          nodes = JSON.parse(nodes);
        } catch (e) {
          console.error('JSON解析错误:', e);
          nodes = {};
        }
      }

      // 转换数据结构
      this.tableData = Object.entries(nodes).map(([levelNode, features]) => {
        return {
          levelNode: levelNode.replace('-', '-'), // 保持格式，如"1-3"
          features: Array.isArray(features) ? features : [],
          downloadData: Array.isArray(features) ? features : []
        };
      }).sort((a, b) => {
        // 按层级和节点排序
        const [aLevel, aNode] = a.levelNode.split('-').map(Number);
        const [bLevel, bNode] = b.levelNode.split('-').map(Number);
        return aLevel - bLevel || aNode - bNode;
      });

      console.log('表格数据:', this.tableData); // 调试用
    },

    handleDownload(row) {
      // 提取层级和节点信息
      const [level, node] = row.levelNode.split('-')

      axios({
        url: '/download/treeCluster',
        method: 'GET',
        params: {
          level: level,
          node: node
        },
        responseType: 'blob'
      }).then((response) => {
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const link = document.createElement('a')
        link.href = url
        let fileName = `${level}-${node}.xlsx`
        const contentDisposition = response.headers['content-disposition']
        if (contentDisposition) {
          const fileNameMatch = contentDisposition.match(/filename=(.+)/)
          if (fileNameMatch && fileNameMatch[1]) {
            fileName = fileNameMatch[1]
          }
        }

        link.setAttribute('download', fileName)
        document.body.appendChild(link)
        link.click()
        link.remove()
        window.URL.revokeObjectURL(url)

        this.$message.success('文件下载成功')
      }).catch((error) => {
        console.error('下载失败:', error)
        // 修改这一行，使用兼容性写法
        const errorMsg = (error.response && error.response.data && error.response.data.message)
          || error.message
        this.$message.error('文件下载失败: ' + errorMsg)
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
