<template>
   <div class="user-manage-main">
        <see :detail-data="tableRowData" title="查看信息" :show-modal='detailShow' @close="close" />

        <FormModal :detail-data="tableRow" :modal-text="true" :show-modal='show' :form-list="formList" @close="closeModal" @from-submit="handleSubmit" :title="modalTitle" :rule-validate='rules'/>

        <screen :btn-type="btnType" :select-type1="selectType1" :types="2" size-title1="导师总数" :size-num1="total" btn-name="添加导师" :select1="selectList"
               @selectChange1="selectChange1"  @inputChange="inputChange" @handleClick="handleClick"/>

        <Tables :is-serial=true @operation1="see" @operation2="edit" @operation3="deletes"  :column="columns1" :table-data="list" :select-list="mentor"/>

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
  import UserMixins from '../Mixins/UserMixins'
  import postData from 'src/api/postData'
  import pageList from '../../../components/Page'
  import pageMixin from '../../mixins/pageMixins'
  import  { validatePass, validateUsername3 } from '../validate'
  export default {
    name: "ManagementList",
    components: { Tables, FormModal, screen, see, pageList },
    mixins: [seeMixin, FormModalMixin, UserMixins, pageMixin],
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
            tableRow: {},
            tableRowData: {},
            selectType1: false,
            keyword: '',
            selectList:[],
            organization_id:'',
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
                title: '管理权限',
                key: 'role_name',
                align: 'left',
            },
            {
                title: '所属机构',
                key: 'title',
                align: 'left'
            },
            // {
            //     title: '状态',
            //     key: 'state',
            // },
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
            list: [],
            operationList: [['查看','operation1'], ['编辑','operation2'], ['删除','operation3']],
            formList: [
                { type: 'input', name: '真实姓名',  field: 'realname'},
                { type: 'select', name: '所属机构', field: 'organization_id' ,
                    selectList: [], selectField: [ 'id','title' ]
                },
                { type: 'input', name: '导师账号',  field: 'username' },
                { type: 'password', name: '账号密码',  field: 'password' },
                { type: 'select', name: '管理权限', field: 'role_id' ,
                    selectList: [ ...jurisdictionList ], selectField: [ 'id','name' ]
                }
            ],
            rules:{
                realname: [{ required: true, message: '请输入真实姓名', trigger: 'blur' } ],
                organization_id: [{ required: true, message: '请选择机构' } ],
                username: [{ required: true, validator: validateUsername3 }],
                password: [{ required: true, validator: validatePass }],
                role_id: [{ required: true, message: '请选择管理权限'} ],
            }
        }
    },
    methods: {
        see(row,rowIndex){
            this.detailShow = true;
            this.tableRowData = row;
        },
        edit(row,rowIndex){
            this.modalTitle = '编辑导师'
            this.show = true
            this.tableRow = {
              realname: row.realname,
              username: row.username,
              password: row.password,
              role_id: this.list[rowIndex].role_id,
              id: row.id,
              organization_id: row.organization_id
            }
            this.setOrganization()
        },
        deletes(row,rowIndex){
           this.fromAddAndEdit('/user/removeDeptTeacher',{id: row.id})
        },
        selectChange1(val){
          this.organization_id = val
          this.getList()
        },
        inputChange(val){
          this.keyword = val
          this.getList()
        },
        setOrganization(){
             if(this.organizationList){
                if(this.role_id == 1){
                    this.formList[1].selectList = this.organizationList
                }else if(this.formList[1].field == 'organization_id') this.formList.splice(1,1);
            }
        },
        handleClick(){
            this.modalTitle = '添加导师'
            this.show = true
            this.tableRow = {}
            this.setOrganization()
        },
        getList(){
            let d = {
              keyword: this.keyword,
              page_size: this.pageSize,
              page_num: this.current,
              organization_id: this.organization_id
            }
            postData('user/getDeptTeacherList', d).then((res) => {
                  this.list = res.data.list
                  this.list.map((t) => {
                      t.role_name = this.$config.status(t.role_id )
                  })
                  this.total = res.data.count
            })
        },
        handleSubmit(val){
          let d = val
          if(this.role_id != 1) d.organization_id = +localStorage.getItem('organizationId')
          if(this.modalTitle == '添加导师') this.fromAddAndEdit('/user/addDeptTeacher',d)
          else this.fromAddAndEdit('/user/modifyDeptTeacher',d)
        }
    },
    mounted() {
        this.getList()
        if(this.permissionItem3) this.handleAuth(this.permissionItem3)
        postData('/user/getDeptAdminList',{page_size:100, page_num:1}).then((res) => {
          this.selectList = res.data.list
        })
        this.organizationList = null
        if(this.role_id == 1)  this.getOrganization()
    }
  }
</script>

<style scoped>
</style>
