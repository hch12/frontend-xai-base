
  <div class="container">
    <h1>属性分而治之平台</h1>
  <div class="steps">
    <el-steps :active=active1 finish-status="success">
      <el-step title="领域核特征识别"></el-step>
      <el-step title="数据核特征识别"></el-step>
      <el-step title="特征团构建"></el-step>
      <el-step title="多方面构效关系分析"></el-step>
    </el-steps>
  </div>
    <div v-if="active1===0">
      <el-steps :active=active12 finish-status="success" simple>
        <el-step title="数据集上传"></el-step>
        <el-step title="输入领域核特征"></el-step>
      </el-steps>
      <br>
      <div v-if="active2===0">
        <DataUpload/>
      </div>
      <div v-if="active2===1">
        <KnowledgeKernels/>
      </div>
    </div>
    <el-button type="primary" @click="submit">上一步</el-button>
    <el-button type="primary" @click="add">下一步</el-button>
  </div>

    <script>
      import DataUpload from "../data_analysis/DataUpload";
      import KnowledgeKernels from "../data_analysis/KnowledgeKernels";
      export default {
        components: {KnowledgeKernels, DataUpload},
        data() {
          return {
            active1:0,
            active2:0,
            sumactive:0
          };
        },
        methods:{
          change(){
            if (this.sumactive<2)
            {
              this.active1=0;
              this.active2=this.sumactive;
            }
          },
          add(){
            sumactive++;
            this.change();
          },
          submit(){
            if(sumactive>=0) {
              sumactive--;
              this.change;
            }
          }
        }
      }
    </script>


<style scoped>

</style>
