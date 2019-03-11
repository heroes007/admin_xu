<template>
   <div>
        <see :detail-data="tableRowData" title="查看信息" :show-modal='detailShow' @close="close" />
        <FormModal :modal-text="true" :detail-data="tableRow" :uploadFlie=true :show-modal='show' :form-list="formList" @close="closeModal" :title="modalTitle" :rule-validate="rules" />

        <screen :types="1" size-title1="机构总数" :size-num1="23" btn-name="添加机构" placehodle="搜索机构姓名"  @inputChange="inputChange" @handleClick="handleClick"/>
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
  export default {
    name: "ManagementList",
    components: { Tables, FormModal, screen, see },
    mixins: [seeMixin, FormModalMixin],
    data (){
        return{
            modalTitle: '',
            tableRow: {},
            tableRowData: {},
            selectList:[
                {
                    value:'all',
                    label:'全部机构'
                },
                {
                    value:'zj',
                    label:'浙江医院'
                }
            ],
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
                operation: [['查看','operation1'], ['编辑','operation2'], ['注销','operation3']],
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
                    selectList: [ ...jurisdictionList ], selectField: [ 'id','name' ]
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
    methods: {
        see(row,rowIndex){
            this.detailShow = true;
            this.tableRowData = details;
            this.tableRowData.mechanismName = row.name;
            console.log(row,rowIndex,'see',this.detailShow);
        },
        edit(row,rowIndex){
             this.show = true
             this.modalTitle = '修改机构'
             this.tableRow = {
                 
             }
            // console.log(row,rowIndex);
        },
        deletes(row,rowIndex){
            // console.log(row,rowIndex);
        },
        inputChange(val){
            console.log(val)
        },
        handleClick(){
            this.modalTitle = '添加机构'
            this.show = true
            this.tableRow = {}
            console.log('open modal')
        }
    },
    mounted() {
        console.log(this.projectList);
    }
  }
</script>

<style scoped>
</style>