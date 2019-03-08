<template>
   <div>
       <h1>机构列表</h1>
        <UserModal :uploadFlie=true :show-modal='show' :form-list="formList" @close="closeModal" :title="modalTitle" :rule-validate="rules" />
        <Tables :is-serial=true @operation1="see" @operation2="edit" @operation3="deletes"  :column="columns1" :table-data="list" />
   </div>
</template>

<script>
  import Tables from '../../../components/tables.vue'
  import { mapState } from 'vuex'
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
                title: '机构名称',
                key: 'name',
                align: 'left'
            },{
                title: '导师人数',
                key: 'num',
            },{
                title: '学员总数',
                key: 'phone',
            },
            {
                title: '付费学员',
                key: 'from_domain',
            },
            {
                title: '状态',
                key: 'phone',
            },
            {
                title: '操作',
                width: 260,
                slot: 'operation',
                operation: ['查看', '编辑', '注销']
            }],
            list: [
                {
                    name: "北京大学人民医院",
                    num: 14,
                    "phone": "150",
                    "from_domain": "正常",
                    "roles": '14',
                }
            ],
            formList: [
                { type: 'input', name: '机构名称',  field: 'realname'},
                { type: 'textarea', name: '机构介绍',  field: 'introduce' },
                { type: 'input', name: '机构账号',  field: 'name' },
                { type: 'input', name: '账号密码',  field: 'pass' },
                { type: 'select', name: '管理权限', field: 'jurisdiction' ,
                    selectList: [ 'jurisdiction' ], selectField: [ 'id','name' ]
                }
            ],
            rules:{
                realname: [{ required: true, message: '请输入机构名称', trigger: 'blur' } ],
                introduce: [{ required: true, message: '请输入机构介绍', trigger: 'blur' } ],
                name: [{ required: true, message: '请输入机构账号', trigger: 'blur' } ],
                pass: [{ required: true, message: '请输入账号密码', trigger: 'blur' } ],
                jurisdiction: [{ required: true, message: '请选择管理权限' } ],
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
             this.show = true
             this.modalTitle = '修改机构'
            // console.log(row,rowIndex);
        },
        deletes(row,rowIndex){
            // console.log(row,rowIndex);
        },
    },
    mounted() {
        console.log(this.projectList);
    }
  }
</script>

<style scoped>
</style>