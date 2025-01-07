import Vue from 'vue'
import Router from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Login from '@/view/systemPage/Login.vue'


import Register from '@/view/systemPage/Register.vue'

import Home from '@/view/systemPage/Home.vue'
import HomePage from '@/view/systemPage/HomePage.vue'
import PlatformManage from '@/view/systemPage/PlatformManage.vue'
import MenuManage from '@/view/systemPage/MenuManage.vue'
import OPManage from '@/view/systemPage/OPManage.vue'
import UserManage from '@/view/systemPage/UserManage.vue'
import UserInfo from '@/view/systemPage/UserInfo.vue'
import LogInfo from '@/view/systemPage/LogInfo.vue'

import AddPatent from '@/view/demo/AddPatent.vue'
import PatentInfo from '@/view/demo/PatentInfo.vue'
import FileUpload from '@/view/demo/FileUpload.vue'
import FeatureTable from "@/view/function/FeatureTable.vue";
import AreaKernel from "@/view/function/areaKernel";
import ModelTraining from "@/view/function/modelTraining";

import DataUpload from "../view/data_analysis/DataUpload";
import Steps from "../view/function/Steps";
import Construction from "../view/cluster/Construction";

Vue.use(Router)

export default new Router({
  mode: 'history',    //此行注释掉即hash模式 不用配置base
  // base:'/api',      // 配置单页应用的基路径 用history时与后端联合配置，打包history模式时用
  routes: [
    {
      path: '/HelloWorld',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/register',
      name: 'Register',
      component: Register
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/',
      name: 'Login',
      component: Login
    },
    {
      path: '/home',
      name: 'Home',
      component: Home,
      children:[
        {
          path: '/homePage',
          name: '首页',
          component: HomePage,
        },
        {
          path: '/platformManage',
          name: '平台管理',
          component: PlatformManage,
        },
        {
          path: '/opManage',
          name: '操作管理',
          component: OPManage,
        },
        {
          path: '/menuManage',
          name: '菜单管理',
          component: MenuManage,
        },
        {
          path: '/userManage',
          name: '用户管理',
          component: UserManage,
        },
        {
          path: '/userInfo',
          name: '用户信息',
          component: UserInfo,
        },
        {
          path: '/logInfo',
          name: '系统日志',
          component: LogInfo,
        },
        // 子页面路由
        {
          path: '/addPatent',
          name: '专利新增',
          component: AddPatent,
        },
        {
          path: '/patentInfo',
          name: '专利信息',
          component: PatentInfo,
        },
        {
          path: '/fileUpload',
          name: '文件上传',
          component: FileUpload,
        },
        {
          path: '/featureTable',
          name: '决策表',
          component:FeatureTable,
        },
        {
          path: '/areaKernel',
          name: '领域核特征',
          component:AreaKernel,
        },
        {
          path: '/modelTraining',
          name: '训练模型',
          component:ModelTraining,
        },
        // {
        //   path: '/attribute/dataUpload',
        //   name: '数据集上传',
        //   component:DataUpload,
        // },
        {
          path:'/Steps',
          name:'步骤',
          component:Steps
        },
        {
          path:'/attribute/ccc',
          name:'特征团构建',
          component:Construction
        },
      ]
    }
  ]
})
