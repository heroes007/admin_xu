<template>
   <div>
       <h1>导师列表</h1>
        <UserModal :show-modal='show' :form-list="formList" @close="closeModal" :title="modalTitle" :rule-validate='rules'/>
        <Tables :is-serial=true @operation1="see" @operation2="edit" @operation3="deletes"  :column="columns1" :table-data="list" />
   </div>
</template>

<script>
  import Tables from '../../../components/tables.vue'
  import UserModal from '../../../components/UserModal.vue'
  export default {
    name: "ManagementList",
    components: { Tables, UserModal },
    data (){
        return{
            show: false,
            modalTitle: '',
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
                title: '管理权限',
                key: 'admin',
                align: 'left',
            },
                {
                title: '管理权限',
                key: 'phone',
                align: 'left',
            },
            {
                title: '所属机构',
                key: 'company',
                align: 'left'
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
                    "action": "action",
                    admin: '超级管理员',
                    company: "北京大学人民医院"
                }
            ],
            formList: [
                { type: 'input', name: '真实姓名',  field: 'realname'},
                { type: 'input', name: '导师账号',  field: 'name' },
                { type: 'input', name: '账号密码',  field: 'pass' },
                { type: 'select', name: '管理权限', field: 'jurisdiction' ,
                    selectList: [ 'jurisdiction' ], selectField: [ 'id','name' ]
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
        closeModal(){
            this.show = false;
        },
        see(row,rowIndex){
            console.log(row,rowIndex,'see',this.show);
        },
        edit(row,rowIndex){
            this.modalTitle = '修改导师'
            this.show = true
            // console.log(row,rowIndex);
        },
        deletes(row,rowIndex){
            // console.log(row,rowIndex);
        },
    },
    mounted() {}
  }
</script>

<style scoped>
</style>