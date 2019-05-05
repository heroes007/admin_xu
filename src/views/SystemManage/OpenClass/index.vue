<template>
   <div>
        <div class="open-head grey-regular1">首页公开课<Button class="head-btn" type="primary" @click="handleClick">添加课程</Button></div>
        <FormModal :modal-false="true" :detail-data="tableRow" :show-modal='show' :form-list="formList" @from-submit="handleSubmit" @close="closeModal" :title="modalTitle" :rule-validate='rules'/>
        <Tables :tabel-height="tableHeight" :is-serial=true @operation1="edit" @operation2="moveUpward" @operation3="MoveDown" @operation4="deletes"  :column="columns1" :table-data="list" />
        <page-list :current="current" :total="total" :page-size="pageSize" @page-list="pageList"/>
   </div>
</template>
<script>
  import Tables from '../../../components/tables.vue'
  import FormModal from '../../../components/FormModal.vue'
  import FormModalMixin from '../../UserManage/Mixins/FormModalMixin'
  import postData from 'src/api/postData'
  import UserMixins from '../../UserManage/Mixins/UserMixins'
  import pageList from '../../../components/Page'
  import pageMixin from '../../mixins/pageMixins.js'
  export default {
    name: "ManagementList",
    components: { Tables, FormModal, pageList },
    mixins: [FormModalMixin, UserMixins, pageMixin],
    data (){
        return{
            modalTitle: '',
            tableRow: {},
            tableHeight: 0,
            columns1: [
            {
                title: '课程名称',
                key: 'title',
                align: 'left',
                minWidth: 100
            },
            {
                title: '播放量',
                key: 'views',
                minWidth: 100
            },
            {
                title: '状态',
                key: '',
                align: 'left',
                minWidth: 100,
                render: (h, params) => {
                    let d = params.row.state == -1 ? '下架' : params.row.state == 1 ? '上架' : '测试'
                    return h('span', d)
                }
            },
            {
                title: '上传时间',
                key: 'create_time',
                minWidth: 150
            },
            {
                title: '上传者',
                key: 'author_username',
                align: 'left',
                minWidth: 100
            },
            {
                title: '操作',
                minWidth: 260,
                slot: 'operation',
                align: 'left',
                operation: [['编辑','operation1'], ['上移','operation2'], ['下移','operation3'], ['删除','operation4']],
            }
            ],
            list:[],
            formList: [
                { type: 'input', name: '课程名称',  field: 'title'},
                { type: 'select', name: '课程状态', disable: false, field: 'state',
                    selectList: [{id: -1,title:'下架'},{id: 0,title:'测试'},{id: 1,title:'上架'}],
                    selectField: ['id', 'title'], selectChange: false
                },
                { type: 'uploadVideo', name: '上传视频',  field: 'video_url' },
            ],
            rules:{
                title: [{ required: true, message: '请输入课程名称', trigger: 'blur' } ],
                state: [{ required: true, message: '请选择课程状态'}],
            },
            data1: null,
        }
    },
    beforeDestroy() {
        this.setMove = null;
        this.getList = null;
        this.deletes = null;
        this.handleSubmit = null;
    },
    methods: {
        setMove(row, type){
            let d = {
               curriculum_open_id: row.id,
               direction: type
            }
            postData('product/curriculum_open/move', d).then(res => {
              if(res.res_code == 1){
                  this.$Message.info(res.msg);
                  this.getList()
              }
            })
        },
        moveUpward(row,rowIndex){
           this.setMove(row, 0)
        },
        MoveDown(row,rowIndex){
           this.setMove(row, 1)
        },
        edit(row,rowIndex){
            this.modalTitle = '编辑课程'
            this.show = true
            this.tableRow = row
        },
        handleSubmit(val){
           val.role_id = 1
           if(this.modalTitle == '添加课程') this.fromAddAndEdit('product/curriculum_open/add',val)
           else{
               val.curriculum_open_id = this.tableRow.id
               this.fromAddAndEdit('product/curriculum_open/change',val)
           }
        },
        deletes(row,rowIndex){
             this.$Modal.confirm({
                title: '提示',
                content: '确定删除该公开课？',
                onOk: () => {
                    postData('product/curriculum_open/delete',{curriculum_open_id: row.id}).then(res => {
                        if(res.res_code == 1) this.getList()
                    })
                }
            });
        },
        handleClick(){
            this.modalTitle = '添加课程'
            this.show = true
            this.tableRow = { realname: '', username: '',  password: '', jurisdiction: '' }
        },
        getList(){
            let d = {
                page_size: this.pageSize,
                page_num: this.current
            }
            postData('product/curriculum_open/get_list', d).then((res) => {
                if(res.res_code==1){
                  this.list = res.data.data
                  this.total = res.data.count
                }
            })
        }
    },
    mounted() {
        this.tableHeight = window.innerHeight - 116
        this.getList()
    }
  }
</script>
<style lang="less" scoped>
.open-head{
    height: 66px;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    .head-btn{
        position: absolute;
        right: 34px;
    }
}
</style>

