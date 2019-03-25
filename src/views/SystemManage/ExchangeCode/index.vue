<template>
   <div>
         <FormModal :detail-data="tableRow" :show-modal='show' :form-list="formList" @close="closeModal" :title="modalTitle" :rule-validate='rules'/>

        <screen btnType :types="4" size-title1="兑换码总数" placehodle="搜索兑换码" :size-num1="23" btn-name="添加兑换码" :select1="selectList"
                size-title2="付费学员" :size-num2="14"   @selectChange1="selectChange1"  @inputChange="inputChange" @handleClick="handleClick"/>
        <Tables :is-serial=true @operation1="batchDownload" @operation2="edit" @operation3="useRecords" @operation4="immediateFailure"  @table-swtich="swtichChange" :column="columns1" :table-data="list" />
   </div>
</template>

<script>
  import Tables from '../../../components/tables.vue'
  import FormModal from '../../../components/FormModal.vue'
  import screen from '../../../components/ScreenFrame'
  import { mapState } from 'vuex'
  import FormModalMixin from '../../UserManage/Mixins/FormModalMixin'
  export default {
    name: "ManagementList",
    components: { Tables, FormModal, screen },
    mixins: [FormModalMixin],
    data (){
        return{
            show: false,
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
            },{
                title: '类型',
                key: 'jurisdiction',
            },
            {
                title: '兑换产品',
                key: 'product',
                align: 'left',
            },
            {
                title: '数量',
                key: 'num',
            },
             {
                title: '已使用',
                key: 'already_used',
            },
            {
                title: '生效时间',
                key: 'create_time',
                align: 'left',
            },
             {
                title: '失效时间',
                key: 'failure_time',
                align: 'left',
            },
            {
                title: '状态',
                key: 'state1',
                slot: 'state-item',
                stateKey: 'state'
            },
            {
                title: '操作',
                width: 420,
                slot: 'operation',
                operation_state: true,
                operation: [['批量下载','operation1'], ['编辑','operation2'], ['使用记录','operation3'], [['立即失效','立即生效'],'operation4']],
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
                { type: 'input', name: '兑换姓名',  field: 'realname'},
                { type: 'select', name: '兑换类型', field: 'jurisdiction' ,
                    selectList: [ { id: 1, name: '培训1' }, { id: 2, name: '培训2' } ], selectField: [ 'id','name' ]
                },
                { type: 'select', name: '兑换内容', field: 'content' , exchange_content: true,
                    selectList: [ { id: 1, name: '浙江医院全科医生培训1' },{ id: 2, name: '浙江医院全科医生培训2' },{ id: 3, name: '浙江医院全科医生培训3' }], selectField: [ 'id','name' ]
                },
                { type: 'input-number', name: '兑换数量',  field: 'num', disable: false },
                { type: 'switch-datetimerange', name: '有效时间',  field: ['isswitch','effective_time'], disable: false, switchList: ['永久','有效'] }
            ],
            rules:{
                realname: [{ required: true, message: '请输入兑换姓名', trigger: 'blur' } ],
                jurisdiction: [{ required: true, message: '请选择兑换类型'} ],
                content: [{ required: true, message: '请选择兑换内容'} ],
                num: [{ required: true, message: '请输入兑换数量'} ],
                effective_time: [
                    // { required: true, message: '请选择有效时间范围'}
                ]
            }
        }
    },
    computed: {
     ...mapState({ projectList: state => state.project.project_list, isLoading: state => state.project.isLoading })
    },
    methods: {
        batchDownload(row,rowIndex){
            console.log(row,rowIndex,'batchDownload');
        },
        useRecords(row,rowIndex){
            this.$router.replace({path: `/dashboard/${row.id}/usage-record/`})
            console.log(row,rowIndex,'useRecords');
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
            console.log(row,rowIndex);
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
            console.log('open modal')
        },
        handleList(){
            this.list.map((it) => {
                it.state1 = it.state ? '生效中' : '已失效'
            })
        }
    },
    mounted() {
         this.handleList()
         this.tableRow = this.tableRow1
    }
  }
</script>

<style scoped>
</style>
