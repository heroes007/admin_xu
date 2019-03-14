import Vue from 'vue';
import VueRouter from 'vue-router';

// import Home from '../views/Home';
// import Project from '../views/ProjectPanel';
// import Hello from '../views/hello';
// import AddHomework from '../views/homework/AddHomework';
// import ManageHomework from '../views/homework/ManageHomework';
// import GradeHomework from '../views/homework/GradeHomework';
// import AddStudent from '../views/student/AddStudent';
// import ManageApp from '../views/information/ManageApp';
// import ProjectList from '../components/ProjectList';
// import ManageRecruit from '../views/information/ManageRecruit';
// import MyInterview from '../views/mine/MyInterview';
// import ManageNews from '../views/news/ManageNews';
// import StatisticsData from '../views/statistics/StatisticsData';
// import FromPageData from '../views/statistics/FromPageData';
// import TeamGrouping from '../views/team/TeamGrouping';
// import HolyWater from '../views/HolyWater';

const Login = () => import('../views/Login');
const NotFound = () => import('../views/notfound');
const DashBoard = () => import('../views/DashBoard');
const ManageStudent = () => import('../views/student/ManageStudent');
const ManageUser = () => import('../views/user/ManageUser');
const ManageLb = () => import('../views/lb/ManageLb');
const ManageOnlineCourse = () => import('../views/information/ManageOnlineCourse');
const ManageOnlineCourseChapter = () => import('../views/information/ManageOnlineCourseChapter');
const ManageOfflineCourse = () => import('../views/information/ManageOfflineCourse');
const ManageOfflineCourseSignup = () => import('../views/information/MangeOfflineCourseSignup');
const ManageTask = () => import('../views/information/ManageTask');
const MyAssignment = () => import('../views/mine/MyAssignment');
const ManageNotification = () => import('../views/information/ManageNotification');
const ManageCourseDownloadData = () => import('../views/download/ManageCourseDownloadData');
const ManagePublicDownloadData = () => import('../views/download/ManagePublicDownloadData');
const ManageProduction = () => import('../views/production/ManageProduction');
const ManageProductionCurriculum = () => import('../views/production/ManageProductionCurriculum');
const ManageProductionGroup = () => import('../views/production/ManageProductionGroup');
const ManageNews = () => import('../views/news/ManageNews')
const ProjectList = () => import('../components/ProjectList');
const ManagRedeemCode = () => import('../views/code/ManageRedeemCode');

const UserManage = () => import('../views/UserManage/index')
const ProductManage = () => import('../views/ProductManage/index')
const SystemManage = () => import('../views/SystemManage/index')
const OpenProduct = () => import('../views/ProductManage/OpenProduct/index')
const MainProduct = () => import('../views/ProductManage/MainProduct/index')
const ExchangeCode = () => import('../views/ExchangeCode/index')
const UsageRecord = () => import('../views/ExchangeCode/UsageRecord/index')
const MarkingHomework = () => import('../views/information/MarkingHomework/index')
Vue.use(VueRouter);

// 页面路由
const routes = [
  {
    path:'',
    redirect:'/dashboard/manage-student'
  },
  // {
  //   path:'/project',
  //   name:'project',
  //   component:Project
  // },
  // {
  //   path:'/home',
  //   name:'home',
  //   component:Home,
  //   children:[
  //     {
  //       path:'',
  //       redirect:'/home/hello'
  //     },
  //     {
  //       path:'hello',
  //       component:Hello
  //     }
  //   ]
  // },
  {
    path:'/dashboard',
    // name:'dashboard',
    component:DashBoard,
    children:[
      {
        path:'',
        redirect:'user-manage'
      },
      {
        path: 'user-manage',
        name: 'user-manage',
        component: UserManage
      },
      {
        path: 'product-manage',
        name: 'product-manage',
        component: ProductManage
      },
      {
        path: 'system-manage',
        name: 'system-manage',
        component: SystemManage
      },
      {
        path: 'exchange-code',
        name: 'exchange-code',
        component: ExchangeCode
      },
      // 兑换码使用记录
      {
        path: ':id/usage-record',
        name: 'usage-record',
        component: UsageRecord
      },
      // {
      //   name:'add-homework',
      //   path:'add-homework',
      //   component:AddHomework
      // },
      // {
      //   name:'manage-homework',
      //   path:'manage-homework',
      //   component:ManageHomework
      // },
      // {
      //   name:'grade-homework',
      //   path:'grade-homework',
      //   component:GradeHomework
      // },
      // {
      //   name:'manage-student',
      //   path:'manage-student',
      //   component:ManageStudent
      // },
      // {
      //   name:'add-student',
      //   path:'add-student',
      //   component:AddStudent
      // },
      // {
      //   name:'edit-homework',
      //   path:'add-homework/:id',
      //   component:AddHomework
      // },
      // {
      //   name:'manage-user',
      //   path:'manage-user',
      //   component:ManageUser
      // },
      // {
      //   name:'manage-lb',
      //   path:'manage-lb',
      //   component:ManageLb
      // },
      // {
      //   name:'online-course',
      //   path:'online-course',
      //   component:ManageOnlineCourse
      // },
      // {
      //   name:'online-course-chapter',
      //   path:'online-course-chapter/:id',
      //   component:ManageOnlineCourseChapter
      // },
      // {
      //   name:'offline-course',
      //   path:'offline-course',
      //   component:ManageOfflineCourse
      // },
      // {
      //   name:'offline-course-manage-signup',
      //   path:'offline-course-manage-signup/:id',
      //   component:ManageOfflineCourseSignup
      // },
      // {
      //   name:'task',
      //   path:'task',
      //   component:ManageTask
      // },
      // {
      //   name:'manage-my-assignment',
      //   path:'manage-my-assignment',
      //   component:MyAssignment
      // },
      // {
      //   name:'notification-chat',
      //   path:'notification-chat',
      //   component:ManageNotification
      // },
      // {
      //   name:'redeem-code',
      //   path:'redeem-code',
      //   component:ManagRedeemCode
      // },
      // {
      //   name:'course-download-data',
      //   path:'course-download-data',
      //   component:ManageCourseDownloadData
      // },
      // {
      //   name:'public-download-data',
      //   path:'public-download-data',
      //   component:ManagePublicDownloadData
      // },
      // {
      //   name: 'manage-app',
      //   path: 'manage-app',
      //   component: ManageApp
      // },
      // {
      //   name: 'manage-project',
      //   path: 'manage-project',
      //   component: ProjectList
      // },
      // {
      //   name: 'manage-recruit',
      //   path: 'manage-recruit',
      //   component: ManageRecruit
      // },
      // {
      //   name: 'manage-my-interview',
      //   path: 'manage-my-interview',
      //   component: MyInterview
      // },
      // {
      //   name: 'manage-production',
      //   path: 'manage-production',
      //   component: ManageProduction
      // },
      // {
      //   name: 'manage-production-curriculum',
      //   path: 'manage-production-curriculum/:id',
      //   component: ManageProductionCurriculum
      // },
      // {
      //   name: 'manage-production-group',
      //   path: 'manage-production-group',
      //   component: ManageProductionGroup
      // },
      // {
      //   name: 'manage-news',
      //   path: 'manage-news',
      //   component: ManageNews
      // },
      // {
      //   name: 'statistics-data',
      //   path: 'statistics-data',
      //   component: StatisticsData
      // },
      // {
      //   name: 'from-page-data',
      //   path: 'from-page-data',
      //   component: FromPageData
      // }
    ]
  },
  {
    path: '/product',
    name: 'main-product',
    component: MainProduct,
    redirect: '/product/open-product',
    children: [
      {
        path: 'open-product',
        name: 'open-product',
        component: OpenProduct,
      },
      {
        path: 'open-product/online-course-chapter/:id',
        name: 'online-course-chapter',
        component: ManageOnlineCourseChapter
      },
      // 作业--批阅作业
      {
        path: 'open-product/:id/marking-homework',
        name: 'marking-homework',
        component: MarkingHomework
      },
      {
        name:'offline-course',
        path:'open-product/offline-course',
        component:ManageOfflineCourse
      },
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  // {
  //   path:'/team-grouping',
  //   name:'team-grouping',
  //   component: HolyWater
  // },
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
