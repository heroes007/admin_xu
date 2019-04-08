<template>
    <div>
        <FormModal :detail-data="tableRow" :show-modal='show' :form-list="formList" @close="closeModal" :title="modalTitle" :rule-validate='rules' @from-submit="fromSubmit" @change-list="changeList"/>
        <screen btnType :types="4" size-title1="兑换码总数" placehodle="搜索兑换码" :size-num1="23" btn-name="添加兑换码" :select1="selectList"
                size-title2="付费学员" :size-num2="14"   @selectChange1="selectChange1"  @inputChange="inputChange" @handleClick="handleClick"/>
        <Tables :tabel-height="tabelHeight" :is-serial=true @operation1="batchDownload" @operation2="edit" @operation3="useRecords" @operation4="immediateFailure"  @table-swtich="swtichChange" :column="columns1" :table-data="list" />
        <!--<page-list :current="current" :total="total" :page-size="pageSize" @page-list="pageList"/>-->
    </div>
</template>
<script>
  import Tables from '../../../components/tables.vue'
  import FormModal from '../../../components/FormModal.vue'
  import screen from '../../../components/ScreenFrame'
  import FormModalMixin from '../../UserManage/Mixins/FormModalMixin'
  import postData from '../../../api/postData'
  import pageMixin from '../../mixins/pageMixins.js'

  export default {
    name: "ManagementList",
    components: { Tables, FormModal, screen },
    mixins: [FormModalMixin, pageMixin],
    data (){
        return{
            show: false,
            tabelHeight: null,
            modalTitle: '',
            tableRow: {},
            tableRow1: {
                realname: '',
                content:'',
                num: 0,
                jurisdiction: '',
                isswitch: false,
                effective_time: []
            },
            selectList: [],
            columns1: [
            {
                title: '兑换码名称',
                key: 'realname',
                minWidth: 100
            },{
                title: '类型',
                key: 'jurisdiction',
                minWidth: 100
            },
            {
                title: '兑换产品',
                key: 'product',
                align: 'left',
                minWidth: 100
            },
            {
                title: '数量',
                key: 'num',
                minWidth: 100
            },
             {
                title: '已使用',
                key: 'already_used',
                 minWidth: 100
            },
            {
                title: '生效时间',
                key: 'create_time',
                align: 'left',
                minWidth: 100
            },
             {
                title: '失效时间',
                key: 'failure_time',
                align: 'left',
                 minWidth: 100
            },
            {
                title: '状态',
                key: 'state1',
                slot: 'state-item',
                stateKey: 'state',
                minWidth: 100
            },
            {
                title: '操作',
                minWidth: 260,
                slot: 'operation',
                operation_state: true,
                operation: [['查看','operation1'], ['编辑','operation2'], ['下载','operation3']]
            }],
            list: [
                {
                    "id": 13186,
                    jurisdiction: "培训",
                    "realname": "王晓东",
                    "product": "浙江全科医生培训",
                    "num": 1000,
                    "create_time": "2019/01/12 21:34",
                    "already_used": 17,
                    failure_time: "2019/01/15 21:34",
                    state: 1,
                    isswitch: false,
                },
                {
                    "id": 13186,
                    jurisdiction: "培训",
                    "realname": "王晓东",
                    "product": "浙江全科医生培训",
                    "num": 1000,
                    "create_time": "2019/01/12 21:34",
                    "already_used": 17,
                    failure_time: "2019/01/15 21:34",
                    state: 0,
                    isswitch: false,
                }
            ],
            formList: [
                { type: 'input', name: '兑换码名称',  field: 'realname'},
                { type: 'select', name: '选择机构', field: 'jurisdiction' ,selectChange: true,
                    selectList: [], selectField: [ 'id','title' ]
                },
                { type: 'select', name: '兑换内容', field: 'content' , exchange_content: false,
                    selectList: [], selectField: [ 'id','title' ]
                },
                { type: 'input-number', name: '兑换数量',  field: 'num', disable: false },
                { type: 'switch-datetimerange', name: '有效时间',  field: ['isswitch','effective_time'], disable: false, switchList: ['永久','有效'] }
            ],
            rules:{
                realname: [{ required: true, message: '请输入兑换姓名', trigger: 'blur' } ],
                jurisdiction: [{ required: true, message: '请选择兑换类型'} ],
                content: [{ required: true, message: '请选择兑换内容'} ],
                num: [{ required: true, message: '请输入兑换数量'} ],
                effective_time: []
            }
        }
    },
    methods: {
        batchDownload(row,rowIndex){
            console.log(row,rowIndex,'batchDownload');
        },
        useRecords(row,rowIndex){
            this.$router.replace({path: `/dashboard/${row.id}/usage-record/`})
            localStorage.setItem('useRecords',JSON.stringify(row))
        },
        immediateFailure(row,rowIndex){
            console.log(row,rowIndex,'immediateFailure');
        },
        edit(row,rowIndex){
            this.modalTitle = '修改兑换码'
            this.formList[3].disable = true
            this.show = true
            this.tableRow = {
                realname: row.realname,
                content: row.content,
                num: row.num,
                jurisdiction: '',
                effective_time: []
            }
        },
        deletes(row,rowIndex){
            console.log(row,rowIndex);
        },
        swtichChange(row){
             console.log(row);
        },
        selectChange1(val){
            console.log(val)
        },
        inputChange(val){
            console.log(val)
        },
        handleClick(){
            this.modalTitle = '添加兑换码'
            this.show = true
            this.formList[3].disable = false
            this.tableRow = this.tableRow1
        },
        handleList(){
            this.list.map((it) => {
                it.state1 = it.state ? '生效中' : '已失效'
            })
        },
        fromSubmit(val) {
            let d = {
                product_id: val.content,
                title: val.realname,
                code_count: val.num,
                organization_id: val.jurisdiction,
                state: val.isswitch ? 1 : 2,
                effect_time: val.effective_time[0],
                invalid_time: val.effective_time[1]
            }
            postData('code/addCode', d).then(res => {
                console.log(res)
            })
            this.show = false
        },
        closeModal(){
            this.show = false
        },
        getOrganization() {
            postData('components/getOrganization').then(res => {
                if(res.res_code == 1) this.formList[1].selectList = res.data
            })
        },
        getProducts(val) {
            if(val) {
                postData('components/getProducts', {organization_id: val}).then(res => {
                    if(res.res_code == 1) this.formList[2].selectList = res.data
                })
            }else {
                postData('components/getProducts').then(res => {
                    if(res.res_code == 1) this.formList[2].selectList = res.data
                })
            }
        },
        changeList(val) {
            this.getProducts(val)
        },
        getList() {
            let d = {
                page_size: this.pageSize,
                page_num: this.current,
            }
            postData('code/getCodeList', d).then(res => {

            })
        }
    },
    mounted() {
         this.getOrganization()
         this.getProducts()
         this.handleList()
         this.tableRow = this.tableRow1
         this.tabelHeight = window.innerHeight - 130
    }
  }
</script>
