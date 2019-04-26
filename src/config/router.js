import Vue from 'vue';
import VueRouter from 'vue-router';
import iView from 'iview'
const Login = () => import('../views/Login');
const NotFound = () => import('../views/notfound');
const DashBoard = () => import('../views/DashBoard');
const PersonalData = () => import('../views/personal-data/index');
const ManageOnlineCourseChapter = () => import('../views/ProductManage/Online/ManageOnlineCourseChapter');
const nextSemester = () => import('../views/ProductManage/Offline/next-semester');
const ManageNotification = () => import('../views/SystemManage/inform/ManageNotification');
const ManageNews = () => import('../views/SystemManage/news/ManageNews')
const UserManage = () => import('../views/UserManage/index')
const ProductManage = () => import('../views/ProductManage/index')
const OpenProduct = () => import('../views/ProductManage/OpenProduct/index')
const MainProduct = () => import('../views/ProductManage/MainProduct/index')
const ExchangeCode = () => import('../views/SystemManage/ExchangeCode/index')
const UsageRecord = () => import('../views/SystemManage/ExchangeCode/UsageRecord/index')
const MarkingHomework = () => import('../views/ProductManage/Task/MarkingHomework/index')
const AdvertisingMap = () => import('../views/SystemManage/AdvertisingMap/index')
const OpenClass = () => import('../views/SystemManage/OpenClass/index')
const head = () => import('../views/tutor/head.vue')
const JobList = () => import('../views/tutor/job-list.vue')
const tutorCourse = () => import('../views/tutor/course-management')
const OrderManagement = () => import('../views/OrderManagement/index')
const PrivateLetter = () => import('../views/PrivateLetter/index')
const RecommendedProducts = () => import('../views/SystemManage/RecommendedProducts/index')

Vue.use(VueRouter);
// 页面路由
const routes = [
  {
    path:'',
    redirect:'/login',
  },
  {
    path: '/job-list',
    name: 'job-list',
    component: JobList
  },
  {
    path:'/dashboard',
    // name:'dashboard',
    component:DashBoard,
    children:[
      // {
      //   path:'',
      //   redirect: 'user-manage'
      // },
      {
        path: 'user-manage',
        name: 'user-manage',
        component: UserManage
      },
        //辅导老师
      {
        path: 'tutor-course',
        name: 'tutor-course',
        component: tutorCourse,
      },
      {
        path: 'personal-data',
        name: 'personal-data',
        component: PersonalData
      },
      {
        path: 'product-manage',
        name: 'product-manage',
        component: ProductManage
      },
      {
        path: 'exchange-code',
        name: 'exchange-code',
        component: ExchangeCode
      },
      //订单管理
      {
        path: 'order-management',
        name: 'order-management',
        component: OrderManagement
      },
      //私信管理
      {
        path: 'private-letter',
        name: 'private-letter',
        component: PrivateLetter
      },
      // 兑换码使用记录
      {
        path: ':id/usage-record',
        name: 'usage-record',
        component: UsageRecord
      },
      {
        name:'advertising-map',
        path:'advertising-map',
        component:AdvertisingMap
      },
      {
        name: 'manage-news',
        path: 'manage-news',
        component: ManageNews
      },
      {
        name:'notification-chat',
        path:'notification-chat',
        component: ManageNotification
      },
      {
        name:'open-class',
        path:'open-class',
        component: OpenClass
      },
      {
        name:'recommended-products',
        path:'recommended-products',
        component: RecommendedProducts
      },
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
        component: nextSemester
      },
    ]
  },
  {
    path: '/login',
    name: 'login',
    component: Login
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
