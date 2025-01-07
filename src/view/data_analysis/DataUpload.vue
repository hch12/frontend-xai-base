
<template>
  <div>
    <!-- 上传步骤 -->
    <div v-if=true>
      <br>
      <!-- 文件上传部分 -->
      <el-row>
        <el-col :span="6">
          <el-input
            placeholder="请选择文件"
            v-model="uploadForm.inputFile"
            :disabled="true"
          ></el-input>
        </el-col>
        <el-col :span="10">
          <el-upload
            class="upload-demo"
            ref="upload"
            action=""
            :http-request="customUpload"
            :show-file-list="false"
            accept=".xlsx"
            :before-upload="beforeUpload"
            :on-change="handleSelectFile"
            :auto-upload="false"
          >
            <el-button slot="trigger" type="primary">选取文件<i class="el-icon-document el-icon--right"></i></el-button>
            <el-button type="primary" @click="downloadTemplate">下载数据格式模板<i class="el-icon-download el-icon--right"></i></el-button>
            <el-button type="primary" @click="submitUpload">上传<i class="el-icon-upload el-icon--right"></i></el-button>
            <el-button size="primary" type="success" @click="fetchData(1)">展示</el-button>
            <div slot="tip" class="el-upload__tip">仅支持 .xlsx 文件</div>
          </el-upload>
        </el-col>
      </el-row>
    </div>

    <!-- 数据展示 -->
    <div v-if="showAnalysis" class="data-display">
      <h2>数据集展示</h2>
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column
          v-for="(header, index) in tableHeaders"
          :key="index"
          :label="header.label"
          :prop="header.prop"
          :min-width="150"
        ></el-table-column>
      </el-table>
    </div>

    <!-- 分页 -->
    <div class="pagination-section">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pagination.currentPage"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pagination.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pagination.total"
      ></el-pagination>
    </div>

    <div class="statistics">
      <h2>数据集情况统计</h2>
      <!-- 小提琴图加载 -->
      <div v-loading="loading" element-loading-text="图片加载中..." class="image-container">
        <img
          :src="violinImageSrc"
          style="max-width: 100%; margin-top: 20px;"
          @load="onImageLoad" />
      </div>

      <h3>特征数量</h3>
      <p>特征数量：条件属性 {{ conditionAttributeCount }} 个，决策属性 {{ decisionAttributeCount }} 个</p>

      <el-row :gutter="20">
        <!-- 条件属性 -->
        <el-col :span="12">
          <h3>条件属性</h3>
          <el-select v-model="selectedConditionAttribute" placeholder="请选择条件属性" @change="updateConditionStatistics">
            <el-option
              v-for="attr in conditionAttributes"
              :key="attr.value"
              :label="attr.label"
              :value="attr.value"
            ></el-option>
          </el-select>
          <div v-if="conditionStatistics">
            <p>最大值：{{ conditionStatistics.max }}</p>
            <p>最小值：{{ conditionStatistics.min }}</p>
            <p>平均值：{{ conditionStatistics.avg }}</p>
            <p>中位数：{{ conditionStatistics.median }}</p>
            <p>非空值个数：{{ conditionStatistics.nullCount }}</p>
          </div>
        </el-col>

        <!-- 决策属性 -->
        <el-col :span="12">
          <h3>决策属性</h3>
          <el-select v-model="selectedDecisionAttribute" placeholder="请选择决策属性" @change="updateDecisionStatistics">
            <el-option
              v-for="attr in decisionAttributes"
              :key="attr.value"
              :label="attr.label"
              :value="attr.value"
            ></el-option>
          </el-select>
          <div v-if="decisionStatistics">
            <p>最大值：{{ decisionStatistics.max }}</p>
            <p>最小值：{{ decisionStatistics.min }}</p>
            <p>平均值：{{ decisionStatistics.avg }}</p>
            <p>中位数：{{ decisionStatistics.median }}</p>
            <p>非空值个数：{{ decisionStatistics.nullCount }}</p>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>


<script>
export default {
  name: "DataUpload",
  data() {
    return {
      uploadForm: {
        inputFile: "",
        fileList: [],
      },
      fd: null,
      fileStatus: false,
      conditionAttributes: {}, // 条件属性列表
      decisionAttributes: {},  // 决策属性列表
      selectedConditionAttribute: "", // 当前选中的条件属性
      selectedDecisionAttribute: "",  // 当前选中的决策属性
      conditionStatistics: null, // 条件属性统计信息
      decisionStatistics: null,  // 决策属性统计信息
      conditionAttributeCount: 0,
      decisionAttributeCount: 0,
      tableData: [],
      showAnalysis: false,
      searchQuery: "",
      pagination: {
        currentPage: 1,
        pageSize: 10,
        total: 0,
      },
      statistics: {}, // 用于存储统计信息
      violinImageSrc: null,
      loading: false,
    };
  },
  watch: {
    // 当表头信息更新时，动态生成条件属性列表
    tableHeaders(newHeaders) {
      this.conditionAttributes = newHeaders.filter(
        (header) => header.label !== "BVSE_energy_barrier"
      );
    },
  },
  methods: {
    handleSelectFile(file, fileList) {
      if (fileList.length > 1) {
        fileList.shift();
      }
      this.uploadForm.inputFile = file.name;
      const fileSuffix = file.name.substring(file.name.lastIndexOf(".") + 1);
      const whiteList = ["xlsx"];
      if (whiteList.indexOf(fileSuffix) === -1) {
        this.$message.error("上传文件只能是 .xlsx 格式");
        this.fileStatus = false;
        return;
      }
      this.fileStatus = true;
    },

    customUpload(option) {
      this.fd = new FormData();
      this.fd.append("file", option.file);
      this.$axios
        .post("/data/upload", this.fd, {
          headers: { "Content-Type": "multipart/form-data" },
        })
        .then((response) => {
          this.handleUploadSuccess(response.data);
        })
        .catch((error) => {
          console.error("上传失败：", error.response || error);
          this.handleUploadError(error);
        });
    },

    submitUpload() {
      if (this.fileStatus) {
        this.$refs.upload.submit();
      } else {
        this.$message.error("请选择合适的文件");
      }
    },

    handleUploadSuccess(data) {
      this.$message.success("文件上传成功！");
    },

    async fetchData() {
      try {
        const response = await this.$axios.get('/data/paginated', {
          params: {
            page: this.pagination.currentPage,
            size: this.pagination.pageSize,
          },
        });

        if (response.data) {
          const list = response.data.List;
          if (list.length > 0) {
            // 动态生成表头
            this.tableHeaders = Object.keys(list[0]).map((key) => ({
              label: key,
              prop: key,
            }));
          }

          // 设置表格数据和分页信息
          this.tableData = list;
          // console.log("分页数据：", list);
          this.pagination.total = response.data.Total;
          this.showAnalysis = true;
          this.violin();
        } else {
          this.$message.warning("未获取到数据！");
        }
      } catch (error) {
        console.error("分页数据获取失败：", error);
        this.$message.error("无法获取分页数据，请稍后重试！");
      }
    },


    handleCurrentChange(page) {
      this.pagination.currentPage = page;
      this.fetchData();
    },
    handleSizeChange(size) {
      this.pagination.pageSize = size;
      this.fetchData();
    },

    handleUploadError(error) {
      console.error("上传失败", error);
      this.$message.error("文件上传失败，请重试！");
    },

    beforeUpload(file) {
      const isXlsx = file.name.endsWith(".xlsx");
      if (!isXlsx) {
        this.$message.error("仅支持 .xlsx 文件上传！");
        return false;
      }
      this.fileStatus = true;
      return true;
    },

    async fetchStatistics() {
      try {
        const response = await this.$axios.get("/data/statistics");
        console.log("统计数据：", response.data);

        const conditionData = response.data.condition || {};
        const decisionData = response.data.decision || {};

        // 将统计信息和字段名绑定
        this.conditionAttributes = Object.keys(conditionData).map((key) => ({
          label: key,
          value: key,
          statistics: conditionData[key],
        }));
        this.decisionAttributes = Object.keys(decisionData).map((key) => ({
          label: key,
          value: key,
          statistics: decisionData[key],
        }));

        this.conditionAttributeCount = response.data.counts.conditionCount;
        this.decisionAttributeCount = response.data.counts.decisionCount;

        // 初始化第一个属性的统计信息
        if (this.conditionAttributes.length > 0) {
          this.selectedConditionAttribute = this.conditionAttributes[0].value;
          this.updateConditionStatistics(this.selectedConditionAttribute);
        }
        if (this.decisionAttributes.length > 0) {
          this.selectedDecisionAttribute = this.decisionAttributes[0].value;
          this.updateDecisionStatistics(this.selectedDecisionAttribute);
        }
      } catch (error) {
        console.error("获取统计信息失败：", error);
        this.$message.error("无法获取统计信息，请稍后重试！");
      }
    },

    updateConditionStatistics(attribute) {
      if (!attribute) {
        this.conditionStatistics = {};
        return;
      }
      const selectedAttribute = this.conditionAttributes.find((attr) => attr.value === attribute);
      this.conditionStatistics = selectedAttribute ? selectedAttribute.statistics : {};
    },

    updateDecisionStatistics(attribute) {
      if (!attribute) {
        this.decisionStatistics = {};
        return;
      }
      const selectedAttribute = this.decisionAttributes.find((attr) => attr.value === attribute);
      this.decisionStatistics = selectedAttribute ? selectedAttribute.statistics : {};
    },

    downloadTemplate() {
      // 使用 require 来获取 Webpack 打包后的文件路径
      const filePath = require('@/assets/template.xlsx');
      const link = document.createElement('a');
      link.href = filePath; // 使用 Webpack 打包后的文件路径
      link.download = 'template.xlsx'; // 设置下载文件的默认名称
      link.click(); // 触发下载
    },

    violin() {
      this.loading = true;

      this.$axios.get('/data/violin', { responseType: 'blob' })
        .then(response => {
          console.log("后端返回:", response);

          // 将图片 Blob 转换为 URL
          const blob = new Blob([response.data], { type: 'image/png' });
          const objectURL = URL.createObjectURL(blob);

          this.violinImageSrc = objectURL;
          console.log("小提琴图数据：", this.violinImageSrc);
        })
        .catch(error => {
          console.error("小提琴图生成失败:", error);
          this.$message.error("小提琴图生成失败，请稍后重试。");
        });
    },

    onImageLoad() {
      // 图片加载完成后隐藏 loading 动效
      this.loading = false;
    }


  },
  mounted() {
    this.fetchData();
    this.fetchStatistics();
  }

};
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  font-family: Arial, sans-serif;
}

h1,
h2 {
  text-align: center;
  color: #333;
}

.steps,
.upload-section,
.data-display {
  margin-bottom: 20px;
}

.statistics-section {
  margin-top: 20px;
}

.statistics-section h3 {
  text-align: center;
  margin-bottom: 10px;
}

.statistics-section p {
  text-align: center;
  font-size: 16px;
}

.image-container {
  position: relative;
  display: inline-block;  /* 确保容器只包裹图片的大小 */
  width: 100%;            /* 容器宽度 */
  text-align: center;     /* 居中显示加载动画 */
}




</style>
