<template>
   <div class="user-manage-main">
        <see :detail-data="tableRowData" title="查看信息" :show-modal='detailShow' @close="close" />

        <FormModal :modal-text="true" :detail-data="tableRow" :uploadFlie=true :show-modal='show' :form-list="formList" @from-submit="handleSubmit"
                   @close="closeModal" :title="modalTitle" :rule-validate="rules" />

        <screen :btn-type="btnType" :types="1" size-title1="机构总数" :size-num1="total" btn-name="添加机构" placehodle="搜索机构姓名"  @inputChange="inputChange" @handleClick="handleClick"/>

        <Tables :is-serial=true @operation1="see" @operation2="edit" @operation3="deletes"  :column="columns1" :table-data="list" :select-list="institution"/>

        <page-list :current="current" :total="total" :page-size="pageSize" @page-list="pageList"/>
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
  import { mapState } from 'vuex'
  import UserMixins from '../Mixins/UserMixins'
  import pageList from '../../../components/Page'
  import pageMixin from '../../mixins/pageMixins'
  import  { validatePass, validateUsername2 } from '../validate'

  export default {
    name: "ManagementList",
    components: { Tables, FormModal, screen, see, pageList },
    mixins: [seeMixin, FormModalMixin, UserMixins, pageMixin],
    props: {
        permissionItem2: {
            type: Object,
            default: null
        }
    },
    data (){
        return{
            modalTitle: '',
            tableRow: {},
            tableRowData: {},
            keyword: '',
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
                key: 'title',
                align: 'left'
            },{
                title: '导师人数',
                key: 'tutor_count',
            },
            {
                title: '付费学员',
                key: 'student_count',
            },
            // {
            //     title: '状态',
            //     key: 'state',
            // },
            {
                title: '操作',
                width: 260,
                slot: 'operation',
                operation: [],
            }],
            list: [],
            formList: [
                { type: 'input', name: '机构名称',  field: 'title'},
                { type: 'textarea', name: '机构介绍',  field: 'description' },
                { type: 'input', name: '机构账号',  field: 'username' },
                { type: 'password', name: '账号密码',  field: 'password' },
                { type: 'inputTab', name: '管理权限',  field: 'jurisdiction', content:'九划超级管理员'}
              // { type: 'select', name: '管理权限', field: 'jurisdiction' ,
                //     selectList: [ ...jurisdictionList ], selectField: [ 'id','name' ]
                // }
            ],
            rules:{
                title: [{ required: true, message: '请输入机构名称', trigger: 'blur' } ],
                description: [{ required: true, message: '请输入机构介绍', trigger: 'blur' } ],
                username: [{ required: true, validator: validateUsername2 }],
                password: [{ required: true, validator: validatePass }],
                jurisdiction: [],
            },
            operationList: [['查看','operation1'], ['编辑','operation2'], ['注销','operation3']]
        }
    },
    watch: {
        permissionItem2(_new){
            this.handleAuth(_new)
        }
    },
    methods: {
        see(row,rowIndex){
          this.detailShow = true;
          this.tableRowData = this.list[rowIndex]
          this.tableRowData.mechanismName = this.list[rowIndex].title;
        },
        edit(row,rowIndex){
             postData('user/getDeptDetail', {id: row.organization_id}).then((res) => {
                this.show = true
                this.modalTitle = '编辑机构'
                let username = res.data[0].admin[0].username
                let password = res.data[0].admin[0].password
                let organization_id = row.organization_id
                this.tableRow = {...res.data[0],username ,password, organization_id}
             })
        },
        deletes(row,rowIndex){
          this.fromAddAndEdit('user/removeDept', {id: row.organization_id})
        },
        inputChange(val){
           this.keyword = val;
           this.getList()
        },
        handleClick(){
            this.modalTitle = '添加机构'
            this.show = true
            this.tableRow = {}
        },
        getList(){
            let d = {
              keyword: this.keyword,
              page_size: this.pageSize,
              page_num: this.current
            }
            postData('user/getDeptAdminList', d).then((res) => {
              this.list = res.data.list
              this.total = res.data.count
              this.list.forEach((item, index) => {
                postData('user/getDeptDetail', {id: item.organization_id}).then((res) => {
                  this.list[index] = {...this.list[index], ...res.data[0], ...res.data[0].admin[0]}
                })
              })
            })
        },
        handleSubmit(val) {
          if(this.modalTitle === '添加机构') this.fromAddAndEdit('user/addDeptAdmin', val)
          else this.fromAddAndEdit('user/modifyDept', val)
        }
    },
    mounted() {
        this.getList()
    }
  }
</script>

<style scoped>
</style>
