<template>
   <div>
       <!-- <h1>管理列表</h1> -->
          <screen :types="1" size-title1="管理总数" :size-num1="23" btn-name="添加管理" :select1="selectList" :select2="selectList"
                    @selectChange1="selectChange1"  @selectChange2="selectChange2" @inputChange="inputChange" @handleClick="handleClick"/>
         <UserModal :detail-data="tableRow" :show-modal='show' :form-list="formList" @close="closeModal" :title="modalTitle" :rule-validate='rules'/>
        <Tables :is-serial=true @operation1="see" @operation2="edit" @operation3="deletes"  :column="columns1" :table-data="list" />
   </div>
</template>

<script>
  import Tables from '../../../components/tables.vue'
  import UserModal from '../../../components/UserModal.vue'
  import screen from '../../../components/ScreenFrame'

  import { mapState } from 'vuex'
  export default {
    name: "ManagementList",
    components: { Tables, UserModal, screen },
    data (){
        return{
            show: false,
            modalTitle: '',
            tableRow: {},
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
            },
            ],
            columns1: [
            {
                title: '用户名',
                key: 'nickname',
                align: 'left',
            },{
                title: '真实姓名',
                key: 'realname',
            },{
                title: '性别',
                key: 'sex',
            },
            {
                title: '手机号',
                key: 'phone',
                align: 'left',
            },
                {
                title: '状态',
                key: 'from_domain',
            },
                {
                title: '最近登录时间',
                key: 'create_time',
                align: 'left',
            },
            {
                title: '操作',
                width: 260,
                slot: 'operation',
                operation: ['查看', '编辑', '删除']
            }],
            list: [
                {
                    "user_id": 13186,
                    "nickname": "150****1134",
                    sex: "男",
                    "realname": "王晓东",
                    "phone": "15022211134",
                    "from_domain": '正常',
                    "create_time": "2019/01/12 21:34",
                    "action": "action"
                }
            ],
            formList: [
                { type: 'input', name: '真实姓名',  field: 'realname'},
                { type: 'input', name: '管理账号',  field: 'nickname' },
                { type: 'input', name: '账号密码',  field: 'pass' },
                { type: 'select', name: '管理权限', field: 'jurisdiction' ,
                    selectList: [ 'jurisdiction' ], selectField: [ 'id','name' ]
                }
            ],
            rules:{
                realname: [{ required: true, message: '请输入真实姓名', trigger: 'blur' } ],
                name: [{ required: true, message: '请输入管理账号', trigger: 'blur' } ],
                pass: [{ required: true, message: '请输入账号密码', trigger: 'blur' } ],
                jurisdiction: [{ required: true, message: '请选择管理权限'} ],
            }
        }
    },
    computed: {
     ...mapState({ projectList: state => state.project.project_list, isLoading: state => state.project.isLoading })
    },
    methods: {
        closeModal(){
            this.show = false;
        },
        see(row,rowIndex){
            console.log(row,rowIndex,'see',this.show);
        },
        edit(row,rowIndex){
            this.modalTitle = '修改管理'
            this.show = true
            this.tableRow = {
                realname: row.realname,
                nickname: row.nickname,
                pass: '',
                jurisdiction: ''
            }
            // console.log(row,rowIndex);
        },
        deletes(row,rowIndex){
            // console.log(row,rowIndex);
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
            this.modalTitle = '添加管理'
            this.show = true
            console.log('open modal')
        }
    },
    mounted() {}
  }
</script>

<style scoped>
</style>