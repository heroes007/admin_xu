<template>
    <div class='manage-notification'>
        <FormModal modal-body :detail-data="tableRow" @from-submit="handleSubmit" :show-modal='show' :form-list="formList" @close="closeModal" :title="modalTitle" :rule-validate="rules" ></FormModal>
        <screen :types="10" title="全站通知" btnType btnName="添加通知" @handleClick="createNotificationHandler" style="background:#ffffff"/>
        <Tables  :tabel-height="tableHeight" :is-serial=true @operation1="sendHandler" @operation2="editHandler" @operation3="deleteHandler"
        :column="columns1" :table-data="list" />
        <page-list class="pages" :current="current" :total="total" :page-size="pageSize" @page-list="pageList"/>
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
                tableHeight: null,
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
                        slot: 'content-html',
                        width: 650,
                        align: 'left'
                    },
                    {
                        key: 'send_time',
                        title: '发送时间',
                        width: 150
                    },
                    {
                        key: 'realname',
                        title: '创建人',
                        width: 120
                    },
                    {
                        title: '操作',
                        minWidth: 260,
                        slot: 'operation',
                        align: 'left',
                        operationLast: true,
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
                this.modalTitle = '添加通知'
                this.tableRow = {}
                this.show = true
            },
            handleSubmit(d){
                d.content = d.uploading
                let url = this.modalTitle === '添加通知' ? 'platform/message/addMessage' : 'platform/message/modifyMessage'
                postData(url, d).then((res) => {
                    if(res.res_code == 1){
                        this.$Message.success(res.msg)
                        this.getList()
                    }
                })
            },
            sendAndDelete(row, text, url, index){
                this.$Modal.confirm({
                    title: '提示',
                    content: `确定要${text}该通知吗!`,
                    onOk: () => {
                        postData(url, {message_id: row.id}).then((res) => {
                            if(res.res_code == 1){
                                if(text == '发送') this.$Message.success(res.msg)
                                this.getList()
                            }
                        })
                    },
                });
            },
            sendHandler(row,index) {
                this.sendAndDelete(row,'发送', 'platform/message/sendMessage')
            },
            deleteHandler(row, index) {
                this.sendAndDelete(row,'删除', 'platform/message/removeMessage', index)
            },
            editHandler(row, index) {
                this.tableRow = row
                this.tableRow.uploading = row.content
                this.show = true
                this.modalTitle = '编辑通知'
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
           this.tableHeight = window.innerHeight - 130
        }
    }
</script>
<style scoped lang="less">
    /deep/ .form-message{
        width: 580px;
        height: 500px;
    }
    /deep/ .select-list{
        display: none;
    }
    /deep/ .pages{
        position: absolute;
        left: 0;
        right: 0;
        bottom: 10px;
        margin: 0 auto;
    }
</style>
