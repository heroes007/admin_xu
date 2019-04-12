<template>
    <div class='manage-notification'>
        <FormModal :detail-data="tableRow" @from-submit="handleSubmit" :show-modal='show' :form-list="formList" @close="closeModal" :title="modalTitle" :rule-validate="rules" ></FormModal>
        <screen :types="10" title="全站通知" btnType btnName="添加通知" @handleClick="createNotificationHandler" style="background:#ffffff"/>
        <Tables :is-serial=true @operation1="sendHandler" @operation2="editHandler" @operation3="deleteHandler" 
        :column="columns1" :table-data="list" />
        <page-list :current="current" :total="total" :page-size="pageSize" @page-list="pageList"/>
    </div>
</template>

<script>
    import FormModal from '../../../components/FormModal'
    import FormModalMixin from '../../UserManage/Mixins/FormModalMixin'
    import screen from '../../../components/ScreenFrame'
    import Tables from '../../../components/tables.vue'
    import postData from 'src/api/postData'
    import pageList from '../../../components/Page'
    import pageMixin from '../../mixins/pageMixins'
    export default {
        mixins: [FormModalMixin, pageMixin],
        components: { screen, FormModal, Tables, pageList },
        data() {
            return {
                messageContent: '',
                activeName: 'notification',
                noSelect:true,
                tabName: 'notification',
                tableRow: {},
                modalTitle: '',
                show: false,
                list: [
                    {
                        content: '1',
                        create_time: '2018/01/01'
                    }
                ],
                formList: [
                    { type: 'upload',name:'', field: 'content' }
                ],
                rules:{
                    uploading: [{ required: true, message: '请输入通知内容'} ],
                },
                columns1: [
                {
                    key: 'content',
                    title: '通知内容',
                    width: 650,
                    align: 'left'
                },
                {
                    key: 'create_time',
                    title: '发送时间',
                    width: 150
                },
                {
                    key: 'create_time',
                    title: '创建人',
                    width: 120
                },
                {
                    title: '操作',
                    minWidth: 260,
                    slot: 'operation',
                    align: 'left',
                    operation: [['发送','operation1'], ['编辑','operation2'], ['删除','operation3']],
                }]
            }
        },
        methods: {
            updateWrapper() {
                var vm = this;
                setTimeout(function () {
                    var wrapper = vm.$refs.mwrapper;
                    if (wrapper) wrapper.scrollTop = wrapper.scrollHeight;
                }, 100)
            },
            createNotificationHandler() {
                this.modalTitle = '创建通知'
                this.show = true
            },
            handleSubmit(d){
               postData('platform/message/addMessage',d).then((res) => {
                  
               })
            },
            sendAndDelete(row,text){
              this.$Modal.confirm({
                title: '提示',
                content: `确定要${text}该通知吗!`,
                onOk: () => {

                },
              });
            },
            sendHandler(row,index) {
                this.sendAndDelete(row,'发送')
            },
            deleteHandler(row, index) {
                this.sendAndDelete(row,'删除')
            },
            editHandler(row, index) {
                this.tableRow = row
                this.show = true
            },
            getList(){
                let d = {
                    page_size: this.pageSize,
                    page_num: this.current,
                }
                postData('platform/message/getMessageList',d).then((res) => {
                    this.list = res.data.list
                    this.total = res.data.count
                })
            }
        },
        mounted() {
           this.getList()
        }
    }

</script>
<style scoped lang="less">
    /deep/ .form-message{
        width: 580px;
        height: 500px;
    }
    /deep/.ivu-modal-body{
        padding: 10px 25px !important;
    }
</style>
