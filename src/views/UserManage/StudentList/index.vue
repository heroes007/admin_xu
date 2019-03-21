<template>
   <div class="user-manage-main">
        <see :detail-data="tableRowData" title="查看信息" :show-modal='detailShow' @close="close" />

       <screen :radio-type="radioType" :select-type1="selectType1" :select-type2="selectType2" :types="5" size-title1="学员总数" :size-num1="allNum" btn-name="添加导师" :select1="selectList" @moneyStudent="moneyStudent"
             select2Placeholder="请选择年级"  :select2="selectList1" size-title2="付费学员" :size-num2="total"   @selectChange1="selectChange1" @selectChange2="selectChange2"  @inputChange="inputChange" @handleClick="handleClick" />

        <Tables :is-serial=true @operation1="see" @radio-change="radioChange"  @table-swtich="swtichChange" :column="columns1" :table-data="list"  :select-list="student"/>

       <page-list :current="current" :total="total" :page-size="pageSize" @page-list="pageList"/>

   </div>
</template>

<script>
  import Tables from '../../../components/tables.vue'
  import screen from '../../../components/ScreenFrame'
  import see from '../../../components/SeeInfo.vue'
  import details from './const'
  import seeMixin from '../Mixins/seeMixin'
  import UserMixins from '../Mixins/UserMixins'
  import postData from 'src/api/postData'
  import pageList from '../../../components/Page'
  import pageMixin from '../../mixins/pageMixins'

  export default {
    name: "ManagementList",
    components: { Tables, screen, see, pageList },
    mixins: [seeMixin, UserMixins, pageMixin],
    props: {
        permissionItem4: {
            type: Object,
            default: null
        }
    },
    watch: {
        permissionItem4(_new){
            this.handleAuth(_new)
        }
    },
    data (){
        return{
            allNum: null,
            tableRowData: {},
            selectType1: false,
            selectType2: true,
            radioType: false,
            selectList:[
            {
                id:'all',
                title:'全部机构'
            }],
            selectList1: [
            {
              id: '',
              title: '全部'
            },
            {
              id: 1,
              title: '一年级'
            }, {
              id: 2,
              title: '二年级'
            }, {
              id: 3,
              title: '三年级'
            }, ],
            columns1: [
            {
                title: '用户名',
                key: 'username',
                align: 'left',
            },{
                title: '真实姓名',
                key: 'realname',
            },{
                title: '性别',
                slot: 'sex',
            },
            {
                title: '学科',
                key: 'department_name',
                align: 'left',
            },
            {
                title: '年级',
                key: 'grade_name',
                align: 'left',
            },
            {
                title: '状态',
                slot: '_index'
            },
            // {
            //     title: '所属机构',
            //     key: 'organization_name',
            //     align: 'left'
            // },
            {
                title: '最近登录时间',
                key: 'last_time',
                align: 'left',
            },
            {
                title: '操作',
                width: 260,
                slot: 'operation',
                operation: [],
                isSwitch: false,
                switchKey: 'switch_state'
            }],
            operationList: [['查看','operation1']],
            list: [
                {
                    "user_id": 13186,
                    "nickname": "150****1134",
                    sex: "男",
                    "realname": "王晓东",
                    "phone": "15022211134",
                    "from_domain": '正常',
                    "create_time": "2019/01/12 21:34",
                    "action": "action",
                    admin: '超级管理员',
                    company: "北京大学人民医院",
                    switch_state: true //true --> 启用 false --> 禁用
                }
            ]
        }
    },
    methods: {
        see(row,rowIndex){
            this.detailShow = true;
            this.tableRowData = row;
            console.log(row,rowIndex,'see',this.detailShow);
        },
        swtichChange(row){
             console.log(row);
        },
        selectChange1(val){
            this.organization_id = val
            this.getList()
        },
        selectChange2(val){
          this.grade_id = val
          this.getList()
        },
        inputChange(val){
            console.log(val)
          this.keyword = val
          this.getList()
        },
        handleClick(){
            this.modalTitle = '添加学员'
            this.show = true
            this.tableRow = {}
            console.log('open modal')
        },
        radioChange(_new){
            console.log(_new)
        },
        moneyStudent(val){
            this.pay_state = val == "YES" ? '' : val
            this.getList()
        },
        getList(){
            let d = {
              keyword: this.keyword,
              page_size: this.pageSize,
              page_num: this.current,
              organization_id: this.organization_id,
              grade_id: this.grade_id,
              pay_state: this.pay_state
            }
            postData('user/getStudentList', d).then((res) => {
                  this.list = res.data.list
                  this.total = res.data.count
                  this.allNum = localStorage.getItem('organizationId') == 1 ? res.data.all_student : res.data.count
            })
        }
    },
    mounted() {
        this.getList()
         if(this.permissionItem4) this.handleAuth(this.permissionItem4)
        postData('/user/getDeptAdminList',{page_size:100, page_num:1}).then((res) => {
          this.selectList = res.data.list
        })
    }
  }
</script>

<style scoped>
</style>
