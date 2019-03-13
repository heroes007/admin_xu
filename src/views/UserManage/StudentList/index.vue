<template>
   <div class="user-manage-main">
        <see :detail-data="tableRowData" title="查看信息" :show-modal='detailShow' @close="close" />
        <screen :radio-type="radioType" :select-type1="selectType1" :select-type2="selectType2" :types="5" size-title1="导师总数" :size-num1="23" btn-name="添加导师" :select1="selectList" 
                size-title2="付费学员" :size-num2="14"   @selectChange1="selectChange1"  @inputChange="inputChange" @handleClick="handleClick"/>
        <Tables :is-serial=true @operation1="see" @radio-change="radioChange"  @table-swtich="swtichChange" :column="columns1" :table-data="list" />
   </div>
</template>

<script>
  import Tables from '../../../components/tables.vue'
  import screen from '../../../components/ScreenFrame'
  import see from '../../../components/SeeInfo.vue'
  import details from './const'
  import seeMixin from '../seeMixin'
  import UserMixins from '../Mixins/UserMixins'
  import postData from 'src/api/postData'

  export default {
    name: "ManagementList",
    components: { Tables, screen, see },
    mixins: [seeMixin, UserMixins],
    props: {
        permissionItem4: {
            type: Object,
            default: null
        }
    },
    watch: {
        permissionItem4(_new){
            this.handleAuth(_new)
            console.log(_new,'_new')
        }
    },
    data (){
        return{
            tableRowData: {},
            selectType1: false,
            selectType2: true,
            radioType: false,
            selectList:[
            {
                value:'all',
                label:'全部机构'
            },
            {
                value:'zj',
                label:'浙江医院'
            },
            {
                value:'bj',
                label:'北京医院'
            }],
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
                key: 'sex',
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
                title: '所属机构',
                key: 'organization_name',
                align: 'left'
            },
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
            this.tableRowData = details;
            console.log(row,rowIndex,'see',this.detailShow);
        },
        swtichChange(row){
             console.log(row);
        },
        selectChange1(val){
            console.log(val)
        },
        selectChange2(val){
            console.log(val)
        },
        inputChange(val){
            console.log(val)
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
        getList(){
            let d = {
                keyword: this.keyword,
                page_size: 1,
                page_num: 1
            }
            postData('user/getStudentList', d).then((res) => {
                  this.list = res.data.list
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