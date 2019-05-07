<template>
   <div class="user-manage-main">
        <see :detail-data="tableRowData" title="查看信息" :show-modal='detailShow' @close="close" />
         <screen select-subjects :paying-student="payingStudent" :radio-type="radioType" :select-type1="selectType1" :select-type2="selectType2" :types="5"
             :size-title1="title1" :size-num1="allNum+ (titleTotal ? '/'+titleTotal : '')"  @moneyStudent="moneyStudent"
             select2Placeholder="请选择年级"  :select2="selectList1"
          @selectChange1="selectChange1" @selectChange2="selectChange2" @selectChange3="selectChange3"  @inputChange="inputChange" @handleClick="handleClick" />
        <Tables :tabel-height="tableHeight" :is-serial=true @row-click="see" @operation1="statistics" @radio-change="radioChange"  @table-swtich="swtichChange" :column="columns1" :table-data="list"  :select-list="student"/>
       <page-list :current="current" :total="total" :page-size="pageSize" @page-list="pageList"/>
   </div>
</template>
<script>
  import Tables from '../../../components/tables.vue'
  import screen from '../../../components/ScreenFrame'
  import see from '../../../components/SeeInfo.vue'
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
            titleTotal: null,
            department_id: null,
            payingStudent: sessionStorage.getItem('organizationId') == 1,
            selectList1: [
            {
              id: 'all',
              title: '全部年级'
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
            }],
            columns1: [
            {
                title: '用户ID',
                key: 'username',
                align: 'left',
                minWidth: 100
            },{
                title: '真实姓名',
                key: 'realname',
                minWidth: 100
              },{
                title: '性别',
                slot: 'sex',
                minWidth: 100
              },
            {
                title: '学科',
                key: 'department_name',
                align: 'left',
                minWidth: 100
            },
            {
                title: '年级',
                key: 'grade_name',
                align: 'left',
                minWidth: 100
            },
            // {
            //     title: '所属机构',
            //     key: 'organization_name',
            //     minWidth: 200
            // },
            {
                key: '',
                title: '身份',
                minWidth: 100,
                render: (h, params) => {
                    let d = params.row.pay_state ? '学员' :'游客'
                    // {style: {color: params.row.pay_state ? '#2EBF07' :'#F54802'}}, 
                    return h('span', d)
                }
            },
            {
                title: '状态',
                slot: '_index',
                minWidth: 100
            },
            {
                title: '最近登录时间',
                key: 'last_time',
                align: 'left',
                minWidth: 150
            },
            // {
            //     title: '操作',
            //     minWidth: 100,
            //     slot: 'operation',
            //     align: 'left',
            //     operation: []
            // }
            ],
            operationList: [['统计','operation1']],
            title2: '付费学员',
            title1: '学员总数',
            list: []
        }
    },
    methods: {
        see(row){
            this.detailShow = true;
            this.tableRowData = row;
        },
        selectChange3(v){
          this.department_id = v;
          this.getList()
        },
        statistics(row,rowIndex){
          console.log(row,'统计')
        },
        swtichChange(row){
             console.log(row);
        },
        selectChange1(val){
            this.organization_id = val
            this.getList(val)
            this.title2 = val ? '' : '付费学员'
            this.title1 = val ? '付费学员' : '学员总数'
            this.payingStudent = val ? false : true
        },
        selectChange2(val){
          this.grade_id = val
          this.getList()
        },
        inputChange(val){
          this.keyword = val
          this.getList()
        },
        handleClick(){
            this.modalTitle = '添加学员'
            this.show = true
            this.tableRow = {}
        },
        radioChange(_new){
            console.log(_new)
        },
        moneyStudent(val){
            this.pay_state = val == "NO" ? '' : val
            this.getList()
        },
        getList(){
            let d = {
              keyword: this.keyword,
              page_size: this.pageSize,
              page_num: this.current,
              organization_id: this.$config.setSelVal(this.organization_id),
              department_id: this.$config.setSelVal(this.department_id),
              grade_id: this.$config.setSelVal(this.grade_id),
              pay_state: this.pay_state
            }
            postData('user/getStudentList', d).then((res) => {
                  this.list = res.data.list
                  this.total = res.data.count
                  this.titleTotal = res.data.all_student
                  this.allNum = res.data.count
                  if(this.list.length>0){
                    this.list.map((t) => {
                      t.states = t.pay_state
                      if(!t.department_id) t.department_name = null
                      if(!t.grade_id) t.grade_name = null
                    })
                  }
            })
        }
    },
    mounted() {
        this.getList()
        if(this.permissionItem4) this.handleAuth(this.permissionItem4)
    }
  }
</script>
<style scoped>
</style>
