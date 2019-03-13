<template>
   <div>
         <see :detail-data="tableRowData" title="查看信息" :show-modal='detailShow' @close="close" />
         <FormModal :detail-data="tableRow" :show-modal='show' :form-list="formList" @close="closeModal" :title="modalTitle" :rule-validate='rules'/>

        <screen :btn-type="btnType" :types="1" size-title1="管理总数" :size-num1="23" btn-name="添加管理"  @inputChange="inputChange" @handleClick="handleClick"/>
        <Tables :is-serial=true @operation1="see" @operation2="edit" @operation3="deletes"  :column="columns1" :table-data="list" />

   </div>
</template>

<script>
  import Tables from '../../../components/tables.vue'
  import FormModal from '../../../components/FormModal.vue'
  import screen from '../../../components/ScreenFrame'
  import see from '../../../components/SeeInfo.vue'
  import details from './const'
  import seeMixin from '../seeMixin'
  import FormModalMixin from '../FormModalMixin'
  import jurisdictionList from '../jurisdictionList'
  import postData from 'src/api/postData'
  export default {
    name: "ManagementList",
    components: { Tables, FormModal, screen, see },
    mixins: [seeMixin, FormModalMixin],
    props: {
        permissionItem1: {
            type: Object,
            default: null
        }
    },
    data (){
        return{
            modalTitle: '',
            tableRow: {},
            tableRowData: {},
            btnType: false,
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
                key: 'grade_id',
            },
            {
                title: '手机号',
                key: 'phone',
                align: 'left',
            },
                {
                title: '状态',
                key: 'state',
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
                operation: [],
            }],
            list:[],
            formList: [
                { type: 'input', name: '真实姓名',  field: 'realname'},
                { type: 'input', name: '管理账号',  field: 'nickname' },
                { type: 'input', name: '账号密码',  field: 'pass' },
                { type: 'select', name: '管理权限', field: 'jurisdiction' ,
                    selectList: [ ...jurisdictionList ], selectField: [ 'id','name' ]
                }
            ],
            rules:{
                realname: [{ required: true, message: '请输入真实姓名', trigger: 'blur' } ],
                name: [{ required: true, message: '请输入管理账号', trigger: 'blur' } ],
                pass: [{ required: true, message: '请输入账号密码', trigger: 'blur' } ],
                jurisdiction: [{ required: true, message: '请选择管理权限'} ],
            },
            data1: null,
            keyword: '',
            operationList: [['查看','operation1'], ['编辑','operation2'], ['删除','operation3']]
        }
    },
    watch: {
        permissionItem1(_new){
            this.handleAuth(_new)
        }
    },
    methods: {
        see(row,rowIndex){
            this.detailShow = true;
            this.tableRowData = details;
            console.log(row,rowIndex,'see',this.detailShow);
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
            console.log(row,rowIndex);
        },
        deletes(row,rowIndex){
            console.log(row,rowIndex);
        },
        inputChange(val){
            this.keyword = val;
            this.getList()
        },
        handleClick(){
            this.modalTitle = '编辑管理'
            this.show = true
            this.tableRow = {}
            console.log('open modal')
        },
        getList(){
            let d = {
                keyword: this.keyword,
                page_size: 1,
                page_num: 1
            }
            postData('user/getSuperAdminList', d).then((res) => {
                  this.list = res.list
            })
        },
        handleAuth(d){
            if(d && d.hasOwnProperty('child')){
                let t = d.child;
                let col = this.columns1[this.columns1.length-1].operation
                t.forEach((m) => {
                    let n = +m.permission_code.slice(4,6)
                    if(n === 1) this.btnType = true
                    if(n>1) col.push(this.operationList[n-2])
                })
            }
        }
    },
    mounted() {
        this.getList()
        if(this.permissionItem1) this.handleAuth(this.permissionItem1)
    }
  }
</script>
