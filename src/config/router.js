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
const JobList = () => import('../views/tutor/job-list.vue')
const tutorCourse = () => import('../views/tutor/course-management')
const Curriculum = () => import('../views/tutor/curriculum')
const OrderManagement = () => import('../views/Order/OrderManagement/index')
const InvoiceInfo = () => import('../views/Order/InvoiceInfo/index')
const CertificateInfo = () => import('../views/Order/certificate-info/index')
const PrivateLetter = () => import('../views/PrivateLetter/index')
const RecommendedProducts = () => import('../views/SystemManage/RecommendedProducts/index')
const TutorHead = () => import('../views/tutor/tutor-head')
const ProductionIntersection = () => import('../views/train-manage/intersection/production-intersection')
const LiveCourse = () => import('../views/train-manage/live/live-course')
const IntersectionDetail = () => import('../views/train-manage/intersection/detail')
const LiveCheck = () => import('../views/train-manage/live/live-check')
const ProductGrade = () => import('../views/grade/product-grade')
const StudentGrade = () => import('../views/grade/student-grade')
const AddLb = () => import('../views/SystemManage/lb/add-lb')

Vue.use(VueRouter);
// 页面路由
const routes = [
  {
    path:'',
    redirect:'/login',
  },
  // 导师
  {
    path: '/tutor',
    name: 'tutor',
    component: TutorHead,
    children: [
      {
        path: 'job-list',
        name: 'job-list',
        component: JobList
      },
      {
        path: 'curriculum',
        name: 'curriculum',
        component: Curriculum
      },
    ]
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
        //导师
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
      //支付订单
      {
        path: 'order-management',
        name: 'order-management',
        component: OrderManagement
      },
      //发票信息
      {
        path: 'invoice-info',
        name: 'invoice-info',
        component: InvoiceInfo
      },
      //证书信息
      {
        path: 'certificate-info',
        name: 'certificate-info',
        component: CertificateInfo
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
        name:'add-advertising-map',
        path:'add-advertising-map',
        component:AddLb
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
        //培训管理
      {
        name:'recommended-products',
        path:'recommended-products',
        component: RecommendedProducts
      },
      {
        name: 'production-intersection',
        path: 'production-intersection',
        component: ProductionIntersection
      },
      {
        name: 'live-course',
        path: 'live-course',
        component: LiveCourse
      },
      {
        name: 'live-check',
        path: 'live-check',
        component: LiveCheck
      }
    ]
  },
  // {
  //   name: 'intersection-detail',
  //   path: '/dashboard/intersection-detail',
  //   component: IntersectionDetail
  // },
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
      {
        name: 'intersection-detail',
        path: 'intersection-detail',
        component: IntersectionDetail
      },
      {
        name: 'live-check-product',
        path: 'live-check',
        component: LiveCheck
      }
    ]
  },
  {
    name: 'product-grade',
    path: '/product/product-grade',
    component: ProductGrade
  },
  {
    name: 'student-grade',
    path: '/product/student-grade',
    component: StudentGrade
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
