<!-- KnowledgeKernels.vue -->
<template>
  <div>
    <div class="centered-content">
      <h1>添加领域特征</h1>
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
    <div v-show="GET">
      <h2>领域核特征展示</h2>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="GPR领域核特征" name="first">
          <h3>GPR领域核特征</h3>
          <br>
          <el-button type="primary" @click="downloadFiles('GPR')">下载</el-button>
          <br>
          <br>
          <div>
            <!-- 遍历 group 数组 -->
            <div v-for="(item, index) in group" :key="index">
              <!-- 每个 group 显示一个表格 -->
              <h4>
                第 {{ index + 1 }} 组: {{ getCombinationLabels(item).join(' + ') }}
              </h4>
              <el-table :data="gpr_analysis[index]" >
                <el-table-column prop="轮次" label="轮次" width="130">
                  <!-- 使用 v-for 遍历每一行，设置轮次 -->
                  <template slot-scope="scope">{{ scope.$index + 1 }}</template>
                </el-table-column>
                <el-table-column prop="CV RMSE" label="CV RMSE" width="130"></el-table-column>
                <el-table-column prop="Test RMSE" label="Test RMSE" width="130"></el-table-column>
                <el-table-column prop="Test R2" label="Test R2" width="130"></el-table-column>
              </el-table>
            </div>
            <div>
              <h3>结果选择</h3>

              <el-table :data="gpr_result" border style="width: 100%">
                <el-table-column prop="轮次" label="轮次" width="130">
                  <!-- 使用 v-for 遍历每一行，设置轮次 -->
                  <template slot-scope="scope">{{ scope.$index + 1 }}</template>
                </el-table-column>
                <el-table-column label="领域核特征" width="300">
                <template slot-scope="scope">{{ getCombinationLabels(group[scope.row.group]).join(' + ')}}</template>
              </el-table-column>
                <el-table-column label="CV RMSE" prop="CV RMSE" width="180">
                </el-table-column>
                <el-table-column label="Test RMSE" prop="Test RMSE" width="180">
                </el-table-column>
                <el-table-column label="Test R2" prop="Test R2" width="180">
                </el-table-column>

              </el-table>

            </div>
          </div>

        </el-tab-pane>
        <el-tab-pane label="MLR领域核特征" name="second">
          <h3>MLR领域核特征</h3>
          <br>
          <el-button type="primary" @click="downloadFiles('MLR')">下载</el-button>
          <br>
          <br>
          <div v-for="(item, index) in group" :key="index">
            <!-- 每个 group 显示一个表格 -->
            <h4>
              第 {{ index + 1 }} 组: {{ getCombinationLabels(item).join(' + ') }}
            </h4>
            <el-table :data="mlr_analysis[index]" >
              <el-table-column prop="轮次" label="轮次" width="130">
                <!-- 使用 v-for 遍历每一行，设置轮次 -->
                <template slot-scope="scope">{{ scope.$index + 1 }}</template>
              </el-table-column>
              <el-table-column prop="CV RMSE" label="CV RMSE" width="130"></el-table-column>
              <el-table-column prop="Test RMSE" label="Test RMSE" width="130"></el-table-column>
              <el-table-column prop="Test R2" label="Test R2" width="130"></el-table-column>
            </el-table>
          </div>
          <div>

          <h3>结果选择</h3>
          <el-table :data="mlr_result" border style="width: 100%">
            <el-table-column prop="轮次" label="轮次" width="130">
              <!-- 使用 v-for 遍历每一行，设置轮次 -->
              <template slot-scope="scope">{{ scope.$index + 1 }}</template>
            </el-table-column>
            <el-table-column label="领域核特征" width="300">
              <template slot-scope="scope">{{ getCombinationLabels(group[scope.row.group]).join(' + ')}}</template>
            </el-table-column>
            <el-table-column label="CV RMSE" prop="CV RMSE" width="180">
            </el-table-column>
            <el-table-column label="Test RMSE" prop="Test RMSE" width="180">
            </el-table-column>
            <el-table-column label="Test R2" prop="Test R2" width="180">
            </el-table-column>
          </el-table>

          </div>
        </el-tab-pane>
        <el-tab-pane label="KNN领域核特征" name="third">
          <h3>KNN领域核特征</h3>
          <br>
          <el-button type="primary" @click="downloadFiles('KNN')">下载</el-button>
          <br>
          <br>
          <div v-for="(item, index) in group" :key="index">
            <!-- 每个 group 显示一个表格 -->
            <h4>
              第 {{ index + 1 }} 组: {{ getCombinationLabels(item).join(' + ') }}
            </h4>
            <el-table :data="knn_analysis[index]" >
              <el-table-column prop="轮次" label="轮次" width="130">
                <!-- 使用 v-for 遍历每一行，设置轮次 -->
                <template slot-scope="scope">{{ scope.$index + 1 }}</template>
              </el-table-column>
              <el-table-column prop="CV RMSE" label="CV RMSE" width="130"></el-table-column>
              <el-table-column prop="Test RMSE" label="Test RMSE" width="130"></el-table-column>
              <el-table-column prop="Test R2" label="Test R2" width="130"></el-table-column>
            </el-table>
          </div>

          <h3>结果选择</h3>
          <div>
          <el-table :data="knn_result" border style="width: 100%">
            <el-table-column prop="轮次" label="轮次" width="130">
              <!-- 使用 v-for 遍历每一行，设置轮次 -->
              <template slot-scope="scope">{{ scope.$index + 1 }}</template>
            </el-table-column>
            <el-table-column label="领域核特征" width="300">
              <template slot-scope="scope">{{ getCombinationLabels(group[scope.row.group]).join(' + ')}}</template>
            </el-table-column>
            <el-table-column label="CV RMSE" prop="CV RMSE" width="180">
            </el-table-column>
            <el-table-column label="Test RMSE" prop="Test RMSE" width="180">
            </el-table-column>
            <el-table-column label="Test R2" prop="Test R2" width="180">
            </el-table-column>

          </el-table>
          </div>

        </el-tab-pane>
        <el-tab-pane label="SVR领域核特征" name="fourth">
          <h3>SVM领域核特征</h3>
          <br>
          <el-button type="primary" @click="downloadFiles('SVR')">下载</el-button>
          <br>
          <br>
          <div v-for="(item, index) in group" :key="index">
            <!-- 每个 group 显示一个表格 -->
            <h4>
              第 {{ index + 1 }} 组: {{ getCombinationLabels(item).join(' + ') }}
            </h4>
            <el-table :data="svr_analysis[index]" >
              <el-table-column prop="轮次" label="轮次" width="130">
                <!-- 使用 v-for 遍历每一行，设置轮次 -->
                <template slot-scope="scope">{{ scope.$index + 1 }}</template>
              </el-table-column>
              <el-table-column prop="CV RMSE" label="CV RMSE" width="130"></el-table-column>
              <el-table-column prop="Test RMSE" label="Test RMSE" width="130"></el-table-column>
              <el-table-column prop="Test R2" label="Test R2" width="130"></el-table-column>
            </el-table>
          </div>

          <div>

            <h3>结果选择</h3>
            <el-table :data="svr_result" border style="width: 100%">
              <el-table-column prop="轮次" label="轮次" width="130">
                <!-- 使用 v-for 遍历每一行，设置轮次 -->
                <template slot-scope="scope">{{ scope.$index + 1 }}</template>
              </el-table-column>
              <el-table-column label="领域核特征" width="300">
                <template slot-scope="scope">{{ getCombinationLabels(group[scope.row.group]).join(' + ')}}</template>
              </el-table-column>
              <el-table-column label="CV RMSE" prop="CV RMSE" width="180">
              </el-table-column>
              <el-table-column label="Test RMSE" prop="Test RMSE" width="180">
              </el-table-column>
              <el-table-column label="Test R2" prop="Test R2" width="180">
              </el-table-column>
            </el-table>

          </div>

        </el-tab-pane>
      </el-tabs>
    </div>
  </div>

</template>

<script>
import axios from 'axios'
export default {
  name: "KnowledgeKernels",
  data(){
    return{
      //领域特征变量
      dialogVisible: false,
      checkList: [], // 保存用户选择的序号
      options: [], // 数组中的实际值
      addedCombinations: [], // 保存添加的组合
      addedValues: [], // 保存添加的值
      GET:false,
      activeName: 'first',
      group:[],
      knn_analysis:[],
      gpr_analysis:[],
      svr_analysis:[],
      mlr_analysis:[],
      knn_result:[],
      gpr_result:[],
      svr_result:[],
      mlr_result:[],
      originTitle: ['', '数量', '均分'], // 原始标题
      transTitle: ['题型', '学生1', '学生2', '学生3'], // 转化后的标题
      transData: [], // 转化后的数据
    }
  },
  mounted() {
    this.GetSign()
  },
  methods: {
    // 领域特征函数
    GetKnowledgeKernel() {
      if (this.addedCombinations.length!=0) {
        this.group=this.addedCombinations;
        let params = {
          V: this.addedCombinations,
        };
        this.$axios.post('/user/training', params).then(res => {
          if (res.data.code === 1) {
            this.GET = true
            this.$notify({
              title: '提示',
              message: '领域核特征表已更新',
              type: 'success'
            });
            const parsedData = JSON.parse(res.data.data)
            const model_analysis = parsedData.ModelAnalysis
            const result=parsedData.Result
            console.log(parsedData)
            console.log(model_analysis)
            this.knn_analysis=model_analysis.KNN
            this.gpr_analysis=model_analysis.GPR
            this.mlr_analysis=model_analysis.MLR
            this.svr_analysis=model_analysis.SVR
            console.log(this.knn_analysis)
            console.log(result)
            this.knn_result=result.KNN
            this.mlr_result=result.MLR
            this.svr_result=result.SVR
            this.gpr_result=result.GPR
            console.log(this.gpr_result)
          } else {
            this.$notify({
              title: '警告',
              message: '无法获取数据',
              type: 'warning'
            });
          }
        })
      }
      else {
        this.$notify({
          title: '错误',
          message: '领域特征为空',
          type: 'error'
        })
      }
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
    downloadFiles(choice) {
      let param = {
        address: choice
      }
      axios({
        url: '/download/knowledge',  // 请求压缩文件下载接口
        method: 'GET',
        params: param,  // 传递文件名数组
        responseType: 'blob',   // 设置响应类型为二进制流
      }).then((response) => {
        const blob = response.data;
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = choice + "领域核特征预测结果" + '.zip';  // 指定压缩包文件名
        link.click();
      }).catch((error) => {
        console.error('文件下载失败:', error);
      });
    },
    handleClick(tab, event) {
      console.log(tab, event);
    },
    processResult(data) {
      // 将对象中的每个项转为纯数据数组
      return data.map(item => Object.values(item));
    }
  }
};
</script>
<style scoped>
h1,
h2,
h3 {
  text-align: center;
  color: #333;
}


</style>
