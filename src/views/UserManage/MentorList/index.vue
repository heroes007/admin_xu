<template>
   <div>
        <see :detail-data="tableRowData" title="查看信息" :show-modal='detailShow' @close="close" />
        <FormModal :modal-text="true" :show-modal='show' :form-list="formList" @close="closeModal" :title="modalTitle" :rule-validate='rules'/>

        <screen :btn-type="btnType" :select-type1="selectType1" :types="2" size-title1="导师总数" :size-num1="23" btn-name="添加导师" :select1="selectList" 
                    @selectChange1="selectChange1"  @inputChange="inputChange" @handleClick="handleClick"/>
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
  import UserMixins from '../Mixins/UserMixins'
  import postData from 'src/api/postData'

  export default {
    name: "ManagementList",
    components: { Tables, FormModal, screen, see },
    mixins: [seeMixin, FormModalMixin, UserMixins],
    props: {
        permissionItem3: {
            type: Object,
            default: null
        }
    },
    watch: {
        permissionItem3(_new){
            this.handleAuth(_new)
        }
    },
    data (){
        return{
            modalTitle: '',
            tableRowData: {},
            selectType1: false,
            keyword: '',
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
                title: '管理权限',
                key: 'role_id',
                align: 'left',
            },
            {
                title: '所属机构',
                key: 'title',
                align: 'left'
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
                    company: "北京大学人民医院"
                }
            ],
            operationList: [['查看','operation1'], ['编辑','operation2'], ['删除','operation3']],
            formList: [
                { type: 'input', name: '真实姓名',  field: 'realname'},
                { type: 'input', name: '导师账号',  field: 'name' },
                { type: 'input', name: '账号密码',  field: 'pass' },
                { type: 'select', name: '管理权限', field: 'jurisdiction' ,
                    selectList: [ ...jurisdictionList ], selectField: [ 'id','name' ]
                }
            ],
            rules:{
                realname: [{ required: true, message: '请输入真实姓名', trigger: 'blur' } ],
                name: [{ required: true, message: '请输入导师账号', trigger: 'blur' } ],
                pass: [{ required: true, message: '请输入账号密码', trigger: 'blur' } ],
                jurisdiction: [{ required: true, message: '请选择管理权限'} ],
            }
        }
    },
    methods: {
        see(row,rowIndex){
            this.detailShow = true;
            this.tableRowData = details;
            console.log(row,rowIndex,'see',this.detailShow);
        },
        edit(row,rowIndex){
            this.modalTitle = '修改导师'
            this.show = true
            // console.log(row,rowIndex);
        },
        deletes(row,rowIndex){
            // console.log(row,rowIndex);
        },
        selectChange1(val){
        console.log(val)
        },
        inputChange(val){
            console.log(val)
        },
        handleClick(){
            this.modalTitle = '添加导师'
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
            postData('user/getDeptTeacherList', d).then((res) => {
                console.log(res);
                  this.list = res.data.list
            })
        }
    },
    mounted() {
        this.getList()
        if(this.permissionItem3) this.handleAuth(this.permissionItem3)
    }
  }
</script>

<style scoped>
</style>