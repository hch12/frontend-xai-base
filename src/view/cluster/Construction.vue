<template>
  <div class="container">
    <!-- 按钮部分 -->
    <!-- Tabs 控件，用于切换不同数据 -->
    <el-tabs v-model="activeTab" type="border-card" @tab-click="handleTabChange">

      <el-tab-pane label="MLR 数据">
        <h3>数据领域正核特征</h3>
        <el-table :data="mlrData" style="width: 100%">
          <el-table-column label="Feature" prop="Positive_kernel"></el-table-column>
        </el-table>

        <div v-if="showKeyKnowledge">
          <h3>关键领域核特征</h3>
          <el-table :data="keyKnowledgeData" style="width: 100%">
            <el-table-column label="Feature" prop="Features"></el-table-column>
          </el-table>

          <h3>组合核特征</h3>
          <el-table :data="combinedKernelDatamlr" style="width: 100%">
            <el-table-column label="Feature" prop="Feature"></el-table-column>
          </el-table>

          <br><br>

          <el-button v-if="showKeyKnowledge" style="margin-left: 10px;" size="small" type="success" @click="training">训练</el-button>

          <!-- Sheet Name Dropdown -->
<!--          <el-select v-model="selectedSheetNamemlr" placeholder="请选择 Sheet" @change="handleSheetmlrChange">-->
<!--            <el-option-->
<!--              v-for="item in sheetsmlr"-->
<!--              :key="item.sheetName"-->
<!--              :label="item.sheetName"-->
<!--              :value="item.sheetName">-->
<!--            </el-option>-->
<!--          </el-select>-->

          <!-- 显示选中的 Sheet Data -->
          <el-table v-loading="loading" :data="sortedSheetDatamlr" style="width: 100%" :default-sort="{ prop: 'R2', order: 'descending' }">
            <el-table-column label="Features" prop="Features" width="449.9"></el-table-column>
            <el-table-column label="Length" prop="Length" width="110"></el-table-column>
            <el-table-column label="Score" prop="Score" width="120"></el-table-column>
            <el-table-column label="RMSE" prop="Rmse">
              <template #header>
                RMSE
                <span style="color: red; font-size: 14px; margin-left: 5px;">↓</span> <!-- 数据越小越好 -->
              </template>
              <template #default="{ row }">
                {{ row.Rmse }}
              </template>
            </el-table-column>
            <el-table-column label="CV_RMSE" prop="Cv_RMSE">
              <template #header>
                CV_RMSE
                <span style="color: red; font-size: 14px; margin-left: 5px;">↓</span> <!-- 数据越小越好 -->
              </template>
              <template #default="{ row }">
                {{ row.Cv_RMSE }}
              </template>
            </el-table-column>
            <el-table-column label="R2" prop="R2">
              <template #header>
                R2
                <span style="color: red; font-size: 14px; margin-left: 5px;">↑</span> <!-- 数据越大越好 -->
              </template>
              <template #default="{ row }">
                {{ row.R2 }}
              </template>
            </el-table-column>
            <el-table-column label="Time" prop="Time" width="120"></el-table-column>
          </el-table>


          <br><br>
          <el-select
            v-model="selectbestDatamlr"
            placeholder="请在Top-3特征团中选择一个作为最佳特征团"
            style="width: 320px;"
            @change="getbest"
          >
            <el-option
              v-for="item in top3Featuresmlr"
              :key="item.Features"
              :label="item.Features"
              :value="item.Features"
            ></el-option>
          </el-select>

          <h3>最佳特征团</h3>
          <el-table :data="bestDatamlr" style="width: 100%">
            <el-table-column label="Features" prop="Features" width="449.9"></el-table-column>
            <el-table-column label="Length" prop="Length" width="120"></el-table-column>
            <el-table-column label="Score" prop="Score" width="120"></el-table-column>
            <el-table-column label="RMSE" prop="Rmse">
              <template #header>
                RMSE
                <span style="color: red; font-size: 14px; margin-left: 5px;">↓</span> <!-- 数据越小越好 -->
              </template>
              <template #default="{ row }">
                {{ row.Rmse }}
              </template>
            </el-table-column>
            <el-table-column label="CV_RMSE" prop="Cv_RMSE">
              <template #header>
                CV_RMSE
                <span style="color: red; font-size: 14px; margin-left: 5px;">↓</span> <!-- 数据越小越好 -->
              </template>
              <template #default="{ row }">
                {{ row.Cv_RMSE }}
              </template>
            </el-table-column>
            <el-table-column label="R2" prop="R2">
              <template #header>
                R2
                <span style="color: red; font-size: 14px; margin-left: 5px;">↑</span> <!-- 数据越大越好 -->
              </template>
              <template #default="{ row }">
                {{ row.R2 }}
              </template>
            </el-table-column>
            <el-table-column label="Time" prop="Time" width="120"></el-table-column>
          </el-table>
        </div>

        <br><br>
        <el-button v-if="showKeyKnowledge" style="margin-left: 10px;" size="small" type="success" @click="downloadFile">模型预测结果下载</el-button>

        <br><br>
        <h3>特征团、核特征可视化</h3>
        <el-select
          v-model="selectedFeatureGroupmlr"
          placeholder="请选择最佳特征团的ID"
          @change="handlefeaturesChange"
        >
          <el-option
            v-for="item in bestDatamlr"
            :key="item.Id"
            :label="item.Features"
            :value="item.Id"
          ></el-option>
        </el-select>

        <div v-if="imageSrcmlr">
          <img :src="imageSrcmlr" alt="特征团图片" style="max-width: 100%; margin-top: 20px;" />
        </div>
      </el-tab-pane>

      <el-tab-pane label="KNN 数据">
        <h3>数据领域正核特征</h3>
        <el-table :data="knnData" style="width: 100%">
          <el-table-column label="Feature" prop="Positive_kernel"></el-table-column>
        </el-table>

        <div v-if="showKeyKnowledge">
          <h3>关键领域核特征</h3>
          <el-table :data="keyKnowledgeData" style="width: 100%">
            <el-table-column label="Feature" prop="Features"></el-table-column>
          </el-table>

          <h3>组合核特征</h3>
          <el-table :data="combinedKernelDataknn" style="width: 100%">
            <el-table-column label="Feature" prop="Feature"></el-table-column>
          </el-table>

          <br><br>

          <el-button v-if="showKeyKnowledge" style="margin-left: 10px;" size="small" type="success" @click="training">训练</el-button>

          <!-- Sheet Name Dropdown -->
<!--          <el-select v-model="selectedSheetNameknn" placeholder="请选择 Sheet" @change="handleSheetknnChange">-->
<!--            <el-option-->
<!--              v-for="item in sheetsknn"-->
<!--              :key="item.sheetName"-->
<!--              :label="item.sheetName"-->
<!--              :value="item.sheetName">-->
<!--            </el-option>-->
<!--          </el-select>-->

          <!-- 显示选中的 Sheet Data -->
          <el-table v-loading="loading" :data="selectedSheetDataknn" style="width: 100%" :default-sort="{ prop: 'R2', order: 'descending' }">
            <el-table-column label="Features" prop="Features" width="449.9"></el-table-column>
            <el-table-column label="Length" prop="Length" width="110"></el-table-column>
            <el-table-column label="Score" prop="Score" width="120"></el-table-column>
            <el-table-column label="RMSE" prop="Rmse">
              <template #header>
                RMSE
                <span style="color: red; font-size: 14px; margin-left: 5px;">↓</span> <!-- 数据越小越好 -->
              </template>
              <template #default="{ row }">
                {{ row.Rmse }}
              </template>
            </el-table-column>
            <el-table-column label="CV_RMSE" prop="Cv_RMSE">
              <template #header>
                CV_RMSE
                <span style="color: red; font-size: 14px; margin-left: 5px;">↓</span> <!-- 数据越小越好 -->
              </template>
              <template #default="{ row }">
                {{ row.Cv_RMSE }}
              </template>
            </el-table-column>
            <el-table-column label="R2" prop="R2">
              <template #header>
                R2
                <span style="color: red; font-size: 14px; margin-left: 5px;">↑</span> <!-- 数据越大越好 -->
              </template>
              <template #default="{ row }">
                {{ row.R2 }}
              </template>
            </el-table-column>
            <el-table-column label="Time" prop="Time" width="120"></el-table-column>
          </el-table>

          <br><br>
          <el-select
            v-model="selectbestDataknn"
            placeholder="请在Top-3特征团中选择一个作为最佳特征团"
            style="width: 320px;"
            @change="getbest"
          >
            <el-option
              v-for="item in top3Featuresknn"
              :key="item.Features"
              :label="item.Features"
              :value="item.Features"
            ></el-option>
          </el-select>

          <h3>最佳特征团</h3>
          <el-table :data="bestDataknn" style="width: 100%">
            <el-table-column label="ID" prop="Id" width="80"></el-table-column>
            <el-table-column label="Features" prop="Features" width="369.9"></el-table-column>
            <el-table-column label="Length" prop="Length" width="120"></el-table-column>
            <el-table-column label="Score" prop="Score" width="120"></el-table-column>
            <el-table-column label="RMSE" prop="Rmse">
              <template #header>
                RMSE
                <span style="color: red; font-size: 14px; margin-left: 5px;">↓</span> <!-- 数据越小越好 -->
              </template>
              <template #default="{ row }">
                {{ row.Rmse }}
              </template>
            </el-table-column>
            <el-table-column label="CV_RMSE" prop="Cv_RMSE">
              <template #header>
                CV_RMSE
                <span style="color: red; font-size: 14px; margin-left: 5px;">↓</span> <!-- 数据越小越好 -->
              </template>
              <template #default="{ row }">
                {{ row.Cv_RMSE }}
              </template>
            </el-table-column>
            <el-table-column label="R2" prop="R2">
              <template #header>
                R2
                <span style="color: red; font-size: 14px; margin-left: 5px;">↑</span> <!-- 数据越大越好 -->
              </template>
              <template #default="{ row }">
                {{ row.R2 }}
              </template>
            </el-table-column>
            <el-table-column label="Time" prop="Time" width="120"></el-table-column>
          </el-table>
        </div>

        <br><br>
        <el-button v-if="showKeyKnowledge" style="margin-left: 10px;" size="small" type="success" @click="downloadFile">模型预测结果下载</el-button>

        <br><br>
        <h3>特征团、核特征可视化</h3>
        <el-select
          v-model="selectedFeatureGroupknn"
          placeholder="请选择特征团"
          @change="handlefeaturesChange"
        >
          <el-option
            v-for="item in bestDataknn"
            :key="item.Features"
            :label="item.Features"
            :value="item.Id"
          ></el-option>
        </el-select>

        <div v-if="imageSrcknn">
          <h3>特征团韦恩图</h3>
          <img :src="imageSrcknn" alt="特征团图片" style="max-width: 100%; margin-top: 20px;" />
        </div>
      </el-tab-pane>

      <el-tab-pane label="SVR 数据">
        <h3>数据领域正核特征</h3>
        <el-table :data="svrData" style="width: 100%">
          <el-table-column label="Feature" prop="Positive_kernel"></el-table-column>
        </el-table>
        <div v-if="showKeyKnowledge">
          <h3>关键领域核特征</h3>
          <el-table :data="keyKnowledgeData" style="width: 100%">
            <el-table-column label="Feature" prop="Features"></el-table-column>
          </el-table>

          <h3>组合核特征</h3>
          <el-table :data="combinedKernelDatasvr" style="width: 100%">
            <el-table-column label="Feature" prop="Feature"></el-table-column>
          </el-table>

          <br><br>

          <el-button v-if="showKeyKnowledge" style="margin-left: 10px;" size="small" type="success" @click="training">训练</el-button>

          <!-- Sheet Name Dropdown -->
<!--          <el-select v-model="selectedSheetNamesvr" placeholder="请选择 Sheet" @change="handleSheetsvrChange">-->
<!--            <el-option-->
<!--              v-for="item in sheetssvr"-->
<!--              :key="item.sheetName"-->
<!--              :label="item.sheetName"-->
<!--              :value="item.sheetName">-->
<!--            </el-option>-->
<!--          </el-select>-->

          <!-- 显示选中的 Sheet Data -->
          <el-table v-loading="loading" :data="selectedSheetDatasvr" style="width: 100%" :default-sort="{ prop: 'R2', order: 'descending' }">
            <el-table-column label="Features" prop="Features" width="449.9"></el-table-column>
            <el-table-column label="Length" prop="Length" width="110"></el-table-column>
            <el-table-column label="Score" prop="Score" width="120"></el-table-column>
            <el-table-column label="RMSE" prop="Rmse">
              <template #header>
                RMSE
                <span style="color: red; font-size: 14px; margin-left: 5px;">↓</span> <!-- 数据越小越好 -->
              </template>
              <template #default="{ row }">
                {{ row.Rmse }}
              </template>
            </el-table-column>
            <el-table-column label="CV_RMSE" prop="Cv_RMSE">
              <template #header>
                CV_RMSE
                <span style="color: red; font-size: 14px; margin-left: 5px;">↓</span> <!-- 数据越小越好 -->
              </template>
              <template #default="{ row }">
                {{ row.Cv_RMSE }}
              </template>
            </el-table-column>
            <el-table-column label="R2" prop="R2">
              <template #header>
                R2
                <span style="color: red; font-size: 14px; margin-left: 5px;">↑</span> <!-- 数据越大越好 -->
              </template>
              <template #default="{ row }">
                {{ row.R2 }}
              </template>
            </el-table-column>
            <el-table-column label="Time" prop="Time" width="120"></el-table-column>
          </el-table>

          <br><br>
          <el-select
            v-model="selectbestDatasvr"
            placeholder="请在Top-3特征团中选择一个作为最佳特征团"
            style="width: 320px;"
            @change="getbest"
          >
            <el-option
              v-for="item in top3Featuressvr"
              :key="item.Features"
              :label="item.Features"
              :value="item.Features"
            ></el-option>
          </el-select>

          <h3>最佳特征团</h3>
          <el-table :data="bestDatasvr" style="width: 100%">
            <el-table-column label="ID" prop="Id" width="80"></el-table-column>
            <el-table-column label="Features" prop="Features" width="369.9"></el-table-column>
            <el-table-column label="Length" prop="Length" width="120"></el-table-column>
            <el-table-column label="Score" prop="Score" width="120"></el-table-column>
            <el-table-column label="RMSE" prop="Rmse">
              <template #header>
                RMSE
                <span style="color: red; font-size: 14px; margin-left: 5px;">↓</span> <!-- 数据越小越好 -->
              </template>
              <template #default="{ row }">
                {{ row.Rmse }}
              </template>
            </el-table-column>
            <el-table-column label="CV_RMSE" prop="Cv_RMSE">
              <template #header>
                CV_RMSE
                <span style="color: red; font-size: 14px; margin-left: 5px;">↓</span> <!-- 数据越小越好 -->
              </template>
              <template #default="{ row }">
                {{ row.Cv_RMSE }}
              </template>
            </el-table-column>
            <el-table-column label="R2" prop="R2">
              <template #header>
                R2
                <span style="color: red; font-size: 14px; margin-left: 5px;">↑</span> <!-- 数据越大越好 -->
              </template>
              <template #default="{ row }">
                {{ row.R2 }}
              </template>
            </el-table-column>
            <el-table-column label="Time" prop="Time" width="120"></el-table-column>
          </el-table>
        </div>

        <br><br>
        <el-button v-if="showKeyKnowledge" style="margin-left: 10px;" size="small" type="success" @click="downloadFile">模型预测结果下载</el-button>

        <br><br>
        <h3>特征团、核特征可视化</h3>
        <el-select
          v-model="selectedFeatureGroupsvr"
          placeholder="请选择特征团"
          @change="handlefeaturesChange"
        >
          <el-option
            v-for="item in bestDatasvr"
            :key="item.Features"
            :label="item.Features"
            :value="item.Id"
          ></el-option>
        </el-select>

        <div v-if="imageSrcsvr">
          <h3>特征团韦恩图</h3>
          <img :src="imageSrcsvr" alt="特征团图片" style="max-width: 100%; margin-top: 20px;" />
        </div>
      </el-tab-pane>

      <el-tab-pane label="GPR 数据">
        <h3>数据正核特征</h3>
        <el-table :data="gprData" style="width: 100%">
          <el-table-column label="Feature" prop="Positive_kernel"></el-table-column>
        </el-table>

        <div v-if="showKeyKnowledge">
          <h3>关键领域核特征</h3>
          <el-table :data="keyKnowledgeData" style="width: 100%">
            <el-table-column label="Feature" prop="Features"></el-table-column>
          </el-table>

          <h3>组合核特征</h3>
          <el-table :data="combinedKernelDatagpr" style="width: 100%">
            <el-table-column label="Feature" prop="Feature"></el-table-column>
          </el-table>

          <br><br>

          <el-button v-if="showKeyKnowledge" style="margin-left: 10px;" size="small" type="success" @click="training">训练</el-button>

          <!-- Sheet Name Dropdown -->
<!--          <el-select v-model="selectedSheetNamegpr" placeholder="请选择 Sheet" @change="handleSheetgprChange">-->
<!--            <el-option-->
<!--              v-for="item in sheetsgpr"-->
<!--              :key="item.sheetName"-->
<!--              :label="item.sheetName"-->
<!--              :value="item.sheetName">-->
<!--            </el-option>-->
<!--          </el-select>-->

          <!-- 显示选中的 Sheet Data -->
          <el-table v-loading="loading" :data="selectedSheetDatagpr" style="width: 100%" :default-sort="{ prop: 'R2', order: 'descending' }">
            <el-table-column label="Features" prop="Features" width="449.9"></el-table-column>
            <el-table-column label="Length" prop="Length" width="110"></el-table-column>
            <el-table-column label="Score" prop="Score" width="120"></el-table-column>
            <el-table-column label="RMSE" prop="Rmse">
              <template #header>
                RMSE
                <span style="color: red; font-size: 14px; margin-left: 5px;">↓</span> <!-- 数据越小越好 -->
              </template>
              <template #default="{ row }">
                {{ row.Rmse }}
              </template>
            </el-table-column>
            <el-table-column label="CV_RMSE" prop="Cv_RMSE">
              <template #header>
                CV_RMSE
                <span style="color: red; font-size: 14px; margin-left: 5px;">↓</span> <!-- 数据越小越好 -->
              </template>
              <template #default="{ row }">
                {{ row.Cv_RMSE }}
              </template>
            </el-table-column>
            <el-table-column label="R2" prop="R2">
              <template #header>
                R2
                <span style="color: red; font-size: 14px; margin-left: 5px;">↑</span> <!-- 数据越大越好 -->
              </template>
              <template #default="{ row }">
                {{ row.R2 }}
              </template>
            </el-table-column>
            <el-table-column label="Time" prop="Time" width="120"></el-table-column>
          </el-table>

          <br><br>
          <el-select
            v-model="selectbestDatagpr"
            placeholder="请在Top-3特征团中选择一个作为最佳特征团"
            style="width: 320px;"
            @change="getbest"
          >
            <el-option
              v-for="item in top3Featuresgpr"
              :key="item.Features"
              :label="item.Features"
              :value="item.Features"
            ></el-option>
          </el-select>

          <h3>最佳特征团</h3>
          <el-table :data="bestDatagpr" style="width: 100%">
            <el-table-column label="ID" prop="Id" width="80"></el-table-column>
            <el-table-column label="Features" prop="Features" width="369.9"></el-table-column>
            <el-table-column label="Length" prop="Length" width="120"></el-table-column>
            <el-table-column label="Score" prop="Score" width="120"></el-table-column>
            <el-table-column label="RMSE" prop="Rmse">
              <template #header>
                RMSE
                <span style="color: red; font-size: 14px; margin-left: 5px;">↓</span> <!-- 数据越小越好 -->
              </template>
              <template #default="{ row }">
                {{ row.Rmse }}
              </template>
            </el-table-column>
            <el-table-column label="CV_RMSE" prop="Cv_RMSE">
              <template #header>
                CV_RMSE
                <span style="color: red; font-size: 14px; margin-left: 5px;">↓</span> <!-- 数据越小越好 -->
              </template>
              <template #default="{ row }">
                {{ row.Cv_RMSE }}
              </template>
            </el-table-column>
            <el-table-column label="R2" prop="R2">
              <template #header>
                R2
                <span style="color: red; font-size: 14px; margin-left: 5px;">↑</span> <!-- 数据越大越好 -->
              </template>
              <template #default="{ row }">
                {{ row.R2 }}
              </template>
            </el-table-column>
            <el-table-column label="Time" prop="Time" width="120"></el-table-column>
          </el-table>
        </div>

        <br><br>
        <el-button v-if="showKeyKnowledge" style="margin-left: 10px;" size="small" type="success" @click="downloadFile">模型预测结果下载</el-button>

        <br><br>
        <h3>特征团、核特征可视化</h3>
        <el-select
          v-model="selectedFeatureGroupgpr"
          placeholder="请选择特征团"
          @change="handlefeaturesChange"
        >
          <el-option
            v-for="item in bestDatagpr"
            :key="item.Features"
            :label="item.Features"
            :value="item.Id"
          ></el-option>
        </el-select>

        <div v-if="imageSrcgpr">
          <h3>特征团韦恩图</h3>
          <img :src="imageSrcgpr" alt="特征团图片" style="max-width: 100%; margin-top: 20px;" />
        </div>
      </el-tab-pane>

    </el-tabs>

  </div>
</template>


<script>

export default {
  name: "Construction",
  data() {
    return {
      activeTab: "MLR 数据",
      mlrData: [],
      knnData: [],
      svrData: [],
      gprData: [],
      keyKnowledgeData: [],
      showKeyKnowledge: false,
      selectedSheetNamemlr: '',
      selectedSheetNameknn: '',
      selectedSheetNamesvr: '',
      selectedSheetNamegpr: '',
      selectedFeatureGroupmlr: '',
      selectedFeatureGroupknn: '',
      selectedFeatureGroupsvr: '',
      selectedFeatureGroupgpr: '',
      sheetsmlr: [],
      sheetsknn: [],
      sheetssvr: [],
      sheetsgpr: [],
      selectedSheetDatamlr: [],
      selectedSheetDataknn: [],
      selectedSheetDatasvr: [],
      selectedSheetDatagpr: [],
      currentModel: '',
      loading: false,
      bestDatamlr: [],
      bestDataknn: [],
      bestDatasvr: [],
      bestDatagpr: [],
      selectbestDatamlr: null,
      selectbestDataknn: null,
      selectbestDatasvr: null,
      selectbestDatagpr: null,
      imageSrcmlr: null,
      imageSrcknn: null,
      imageSrcsvr: null,
      imageSrcgpr: null,
    };
  },
  methods: {
    fetchMLRData() {
      this.$axios.get('/cluster/features/mlr')
        .then(response => {
          this.mlrData = response.data;
        })
        .catch(error => {
          console.error("Error fetching MLR data:", error);
        });
    },

    fetchKNNData() {
      this.$axios.get('/cluster/features/knn')
        .then(response => {
          this.knnData = response.data;
        })
        .catch(error => {
          console.error("Error fetching KNN data:", error);
        });
    },

    fetchSVRData() {
      this.$axios.get('/cluster/features/svr')
        .then(response => {
          this.svrData = response.data;
        })
        .catch(error => {
          console.error("Error fetching SVR data:", error);
        });
    },

    fetchGPRData() {
      this.$axios.get('/cluster/features/gpr')
        .then(response => {
          this.gprData = response.data;
        })
        .catch(error => {
          console.error("Error fetching GPR data:", error);
        });
    },

    fetchKeyKnowledge(model) {
      this.$axios.get('/cluster/features/keyKnowledge', { params: { model } })
        .then(response => {
          this.keyKnowledgeData = response.data;
        })
        .catch(error => {
          console.error("Error fetching KeyKnowledgeFeature data:", error);
        });
    },

    // 切换标签页时自动查询对应的模型数据
    handleTabChange(tab) {
      let model = '';
      switch (tab.label) {
        case 'MLR 数据':
          model = 'mlr';
          break;
        case 'KNN 数据':
          model = 'knn';
          break;
        case 'SVR 数据':
          model = 'svr';
          break;
        case 'GPR 数据':
          model = 'gpr';
          break;
        default:
          model = '';
      }

      this.currentModel = model;

      this.fetchKeyKnowledge(model);

      this.showKeyKnowledge = true;

    },

    training() {
      const model = this.currentModel;
      if (model) {
        this.loading = true;
        this.$axios.get('/cluster/training', {params: {model: model}})
          .then(response => {

            if (model === 'mlr') {
              this.sheetsmlr = response.data;
              if (this.sheetsmlr.length > 0) {

                this.selectedSheetNamemlr = this.sheetsmlr[0].sheetName;
                this.selectedSheetDatamlr = this.sheetsmlr[0].sheetData;
              }
            } else if (model === 'knn') {
              this.sheetsknn = response.data;
              if (this.sheetsknn.length > 0) {
                this.selectedSheetNameknn = this.sheetsknn[0].sheetName;
                this.selectedSheetDataknn = this.sheetsknn[0].sheetData;
              }
            } else if (model === 'svr') {
              this.sheetssvr = response.data;
              if (this.sheetssvr.length > 0) {
                this.selectedSheetNamesvr = this.sheetssvr[0].sheetName;
                this.selectedSheetDatasvr = this.sheetssvr[0].sheetData;
              }
            } else if (model === 'gpr') {
              this.sheetsgpr = response.data;
              if (this.sheetsgpr.length > 0) {
                this.selectedSheetNamegpr = this.sheetsgpr[0].sheetName;
                this.selectedSheetDatagpr = this.sheetsgpr[0].sheetData;
              }
            }
            this.loading = false;
          })
          .catch(error => {
            console.error("Error fetching training data:", error);
            this.loading = false;
          })
      }
    },

    handleSheetmlrChange(sheetName) {
      const selectedSheet = this.sheetsmlr.find(sheet => sheet.sheetName === sheetName);
      this.selectedSheetDatamlr = selectedSheet ? selectedSheet.sheetData : [];
    },
    handleSheetknnChange(sheetName) {
      const selectedSheet = this.sheetsknn.find(sheet => sheet.sheetName === sheetName);
      this.selectedSheetDataknn = selectedSheet ? selectedSheet.sheetData : [];
    },
    handleSheetsvrChange(sheetName) {
      const selectedSheet = this.sheetssvr.find(sheet => sheet.sheetName === sheetName);
      this.selectedSheetDatasvr = selectedSheet ? selectedSheet.sheetData : [];
    },
    handleSheetgprChange(sheetName) {
      const selectedSheet = this.sheetsgpr.find(sheet => sheet.sheetName === sheetName);
      this.selectedSheetDatagpr = selectedSheet ? selectedSheet.sheetData : [];
    },

    handlefeaturesChange(Id) {
      console.log("用户选择了特征团:", Id);

      const model = this.currentModel;

      this.$axios.get('/cluster/featureVenn', {
        params: {
          model: model,
          Id: Id
        },
        responseType: 'blob'
      })
        .then(response => {
          console.log("特征团应用成功，后端返回:", response);

          // 将图片 Blob 转换为 URL
          const blob = new Blob([response.data], { type: 'image/png' });
          const objectURL = URL.createObjectURL(blob);

          if (model === 'mlr') {
            this.imageSrcmlr = objectURL;
          } else if (model === 'knn') {
            this.imageSrcknn = objectURL;
          } else if (model === 'svr') {
            this.imageSrcsvr = objectURL;
          } else if (model === 'gpr') {
            this.imageSrcgpr = objectURL;
          }

          this.$message.success("特征团应用成功！");
        })
        .catch(error => {
          console.error("特征团应用失败:", error);
          this.$message.error("特征团应用失败，请稍后重试。");
        });
    },


    getbest(features) {
      const model = this.currentModel;

      if (model && features) {
        // 向后端发送整个选中项对象
        console.log("用户选择了特征团，向后端发送请求:", features)
        const encodedFeatures = encodeURIComponent(features);
        this.$axios.get('/cluster/bestcluster', {params: {model: model, features: encodedFeatures}})
          .then((response) => {
            console.log("成功更新最佳特征团:", response.data);

            // 如果需要，可以更新本地状态
            if (model === 'mlr') {
              this.bestDatamlr = response.data;
            } else if (model === 'knn') {
              this.bestDataknn = response.data;
            } else if (model === 'svr') {
              this.bestDatasvr = response.data;
            } else if (model === 'gpr') {
              this.bestDatagpr = response.data;
            }

            this.$message.success("最佳特征团已更新！");
          })
          .catch((error) => {
            console.error("更新最佳特征团失败:", error);
            this.$message.error("更新失败，请稍后重试！");
          });
      } else {
        this.$message.warning("请选择一个特征团！");
      }
    },
    downloadFile() {
      const model = this.currentModel;

      this.$axios.get('/cluster/download', {
        params: { model },
        responseType: 'blob',
      })
        .then(response => {
          const blob = new Blob([response.data]);
          const link = document.createElement('a');
          const url = window.URL.createObjectURL(blob);
          link.href = url;
          link.download = `${model}_预测结果.xlsx`;
          link.click();
          window.URL.revokeObjectURL(url);
        })
        .catch(error => {
          console.error("文件下载失败:", error);
        });
    },

    parseStringToArray(data) {
      if (typeof data === "string") {
        try {
          const parsed = JSON.parse(data);
          console.log("成功解析字符串为数组:", parsed);
          return Array.isArray(parsed) ? parsed : [parsed];
        } catch (error) {
          console.error("解析失败，数据非JSON格式:", data);
          return [];
        }
      }
      return Array.isArray(data) ? data : [data];
    },

    computeUnion(data, key) {
      const features = data
        .map((item) => this.parseStringToArray(item[key]))
        .flat();
      console.log("展平后的 features:", features);

      const keyKnowledgeFeatures = this.keyKnowledgeData
        .map((item) => this.parseStringToArray(item.Features))
        .flat();
      console.log("关键领域特征 keyKnowledgeFeatures:", keyKnowledgeFeatures);

      const union = [...new Set([...features, ...keyKnowledgeFeatures])]
        .sort((a, b) => a - b);
      console.log("排序后的并集 union:", union);

      const formattedResult = [{ Feature: `[${union.join(", ")}]` }];
      console.log("格式化结果 formattedResult:", formattedResult);

      return formattedResult;
    }


  },

  created() {
    this.fetchMLRData();
    this.fetchKNNData();
    this.fetchSVRData();
    this.fetchGPRData();

    this.fetchKeyKnowledge('mlr');
  },
  computed: {
    combinedKernelDatamlr() {
      return this.computeUnion(this.mlrData, "Positive_kernel");
    },
    combinedKernelDataknn() {
      return this.computeUnion(this.knnData, "Positive_kernel");
    },
    combinedKernelDatasvr() {
      return this.computeUnion(this.svrData, "Positive_kernel");
    },
    combinedKernelDatagpr() {
      return this.computeUnion(this.gprData, "Positive_kernel");
    },
    sortedSheetDatamlr() {
      return [...this.selectedSheetDatamlr].sort((a, b) => b.R2 - a.R2); // 按 R2 降序排序
    },
    sortedSheetDataknn() {
      return [...this.selectedSheetDataknn].sort((a, b) => b.R2 - a.R2); // 按 R2 降序排序
    },
    sortedSheetDatasvr() {
      return [...this.selectedSheetDatasvr].sort((a, b) => b.R2 - a.R2); // 按 R2 降序排序
    },
    sortedSheetDatagpr() {
      return [...this.selectedSheetDatagpr].sort((a, b) => b.R2 - a.R2); // 按 R2 降序排序
    },
    // 返回排序后的前 3 行数据
    top3Featuresmlr() {
      return this.sortedSheetDatamlr.slice(0, 3);
    },
    top3Featuresknn() {
      return this.sortedSheetDataknn.slice(0, 3);
    },
    top3Featuressvr() {
      return this.sortedSheetDatasvr.slice(0, 3);
    },
    top3Featuresgpr() {
      return this.sortedSheetDatagpr.slice(0, 3);
    },
  },
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

.steps {
  margin: 20px 0;
}

.database-display {
  margin-top: 40px;
}

.el-table {
  margin-top: 10px;
  width: 100%;
}
</style>
