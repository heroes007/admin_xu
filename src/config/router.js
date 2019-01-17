//异步加载,后续再修改
//const Hello = r => require(['views/hello'], r);
//const NotFound = r => require(['views/notfound'], r);
import Vue from 'vue';
import VueRouter from 'vue-router';

import Login from '../views/Login';
import Home from '../views/Home';
import Project from '../views/ProjectPanel';
import Hello from '../views/hello';
import NotFound from '../views/notfound';
import DashBoard from '../views/DashBoard';
import AddHomework from '../views/homework/AddHomework';
import ManageHomework from '../views/homework/ManageHomework';
import GradeHomework from '../views/homework/GradeHomework';
import ManageStudent from '../views/student/ManageStudent';
import AddStudent from '../views/student/AddStudent';
import ManageUser from '../views/user/ManageUser';
import ManageLb from '../views/lb/ManageLb';
import ManageOnlineCourse from '../views/information/ManageOnlineCourse';
import ManageOnlineCourseChapter from '../views/information/ManageOnlineCourseChapter';
import ManageOfflineCourse from '../views/information/ManageOfflineCourse';
import ManageOfflineCourseSignup from '../views/information/MangeOfflineCourseSignup';
import ManageTask from '../views/information/ManageTask';
import MyAssignment from '../views/mine/MyAssignment';
import ManageNotification from '../views/information/ManageNotification';
import ManagRedeemCode from '../views/code/ManageRedeemCode';
import ManageCourseDownloadData from '../views/download/ManageCourseDownloadData';
import ManagePublicDownloadData from '../views/download/ManagePublicDownloadData';
import ManageApp from '../views/information/ManageApp';
import ProjectList from '../components/ProjectList';
import ManageRecruit from '../views/information/ManageRecruit';
import MyInterview from '../views/mine/MyInterview';
import ManageProduction from '../views/production/ManageProduction';
import ManageProductionCurriculum from '../views/production/ManageProductionCurriculum';
import ManageProductionGroup from '../views/production/ManageProductionGroup';
import ManageNews from '../views/news/ManageNews';
import StatisticsData from '../views/statistics/StatisticsData';
import FromPageData from '../views/statistics/FromPageData';

// import TeamGrouping from '../views/team/TeamGrouping';
import HolyWater from '../views/HolyWater';

Vue.use(VueRouter);

// 页面路由
const routes = [
  {
    path:'',
    redirect:'/dashboard/manage-student'
  },
  {
    path:'/project',
    name:'project',
    component:Project
  },
  {
    path:'/home',
    // name:'home',
    component:Home,
    children:[
      {
        path:'',
        redirect:'/home/hello'
      },
      {
        path:'hello',
        component:Hello
      }
    ]
  },
  {
    path:'/dashboard',
    // name:'dashboard',
    component:DashBoard,
    children:[
      {
        path:'',
        redirect:'/dashboard/manage-production'
      },
      {
        name:'add-homework',
        path:'add-homework',
        component:AddHomework
      },
      {
        name:'manage-homework',
        path:'manage-homework',
        component:ManageHomework
      },
      {
        name:'grade-homework',
        path:'grade-homework',
        component:GradeHomework
      },
      {
        name:'manage-student',
        path:'manage-student',
        component:ManageStudent
      },
      {
        name:'add-student',
        path:'add-student',
        component:AddStudent
      },
      {
        name:'edit-homework',
        path:'add-homework/:id',
        component:AddHomework
      },
      {
        name:'manage-user',
        path:'manage-user',
        component:ManageUser
      },
      {
        name:'manage-lb',
        path:'manage-lb',
        component:ManageLb
      },
      {
        name:'online-course',
        path:'online-course',
        component:ManageOnlineCourse
      },
      {
        name:'online-course-chapter',
        path:'online-course-chapter/:id',
        component:ManageOnlineCourseChapter
      },
      {
        name:'offline-course',
        path:'offline-course',
        component:ManageOfflineCourse
      },
      {
        name:'offline-course-manage-signup',
        path:'offline-course-manage-signup/:id',
        component:ManageOfflineCourseSignup
      },
      {
        name:'task',
        path:'task',
        component:ManageTask
      },
      {
        name:'manage-my-assignment',
        path:'manage-my-assignment',
        component:MyAssignment
      },
      {
        name:'notification-chat',
        path:'notification-chat',
        component:ManageNotification
      },
      {
        name:'redeem-code',
        path:'redeem-code',
        component:ManagRedeemCode
      },
      {
        name:'course-download-data',
        path:'course-download-data',
        component:ManageCourseDownloadData
      },
      {
        name:'public-download-data',
        path:'public-download-data',
        component:ManagePublicDownloadData
      },
      {
        name: 'manage-app',
        path: 'manage-app',
        component: ManageApp
      },
      {
        name: 'manage-project',
        path: 'manage-project',
        component: ProjectList
      },
      {
        name: 'manage-recruit',
        path: 'manage-recruit',
        component: ManageRecruit
      },
      {
        name: 'manage-my-interview',
        path: 'manage-my-interview',
        component: MyInterview
      },
      {
        name: 'manage-production',
        path: 'manage-production',
        component: ManageProduction
      },
      {
        name: 'manage-production-curriculum',
        path: 'manage-production-curriculum/:id',
        component: ManageProductionCurriculum
      },
      {
        name: 'manage-production-group',
        path: 'manage-production-group',
        component: ManageProductionGroup
      },
      {
        name: 'manage-news',
        path: 'manage-news',
        component: ManageNews
      },
      {
        name: 'statistics-data',
        path: 'statistics-data',
        component: StatisticsData
      },
      {
        name: 'from-page-data',
        path: 'from-page-data',
        component: FromPageData
      }
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path:'/team-grouping',
    name:'team-grouping',
    component: HolyWater
  },
  {
    path: '*',
    name: 'notfound',
    component: NotFound
  }
];

// 创建一个路由对象用于管理页面的路由
const router = new VueRouter({
  mode: 'history',
  routes: routes
});

export default router;
