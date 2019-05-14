<template>
    <div>
        <private-modal :is-show="show" :title="title" :state="state" @handle-close="handleClose" @handle-submit="handleSubmit" :creat="creat" :message="message" :modal-width="modalWidth"
        :person-message="personMessage" @submit="submit"/>
        <screen :types="10" title="学员私信" btnType btnName="添加私信" @handleClick="handleClick" style="background:#ffffff"/>
        <tables :is-serial=true :column="columns1" :table-data="list" :tabel-height="tableHeight" @operation1="check"/>
        <page-list :current="current" :total="total" :page-size="pageSize" @page-list="pageList"/>
    </div>
</template>

<script>
    import screen from '../../components/ScreenFrame'
    import formModal from '../../components/FormModal'
    import privateModal from './modal'
    import tables from '../../components/tables'
    import pageList from '../../components/Page'
    import pageMixin from '../mixins/pageMixins'
    import postData from "../../api/postData";


    export default {
        components: {screen, formModal, privateModal, tables, pageList},
        mixins: [pageMixin],
        data() {
            return {
                show: false,
                creat: true,
                title: '',
                state: 1,
                columns1: [
                    {title: '私信内容', key: 'content', minWidth: 200},
                    {title: '收信学员', key: 'students_num', minWidth: 100},
                    {title: '发送时间', key: 'send_time', minWidth: 100},
                    {title: '创建人', key: 'realname', minWidth: 100},
                    {title: '操作', minWidth: 100, slot: 'operation', operation_btn_hide: true, operation: [['查看','operation1']]}
                ],
                list: [],
                tableHeight: null,
                message: '',
                modalWidth: 800,
                personMessage: {}
            }
        },
        methods: {
            handleClick() {
                this.state = 1
                this.title = '添加私信'
                this.modalWidth = 900
                this.show = true
                this.creat = true
            },
            handleClose() {
                this.show = false
                this.personMessage = {}
            },
            handleSubmit(val) {
                if(val == 1) {
                    this.state = 2
                    this.title = '选择学员'
                }else{
                    this.show = false
                }
            },
            check(val) {
                this.show = true
                this.title = '查看私信'
                this.creat = false
                this.modalWidth = 960
                postData('pmsg/getPMsgDetail', {msg_id: val.id}).then(res => {
                    this.personMessage = res.data
                })
            },
            getList() {
                var data = {
                    page_num: this.current,
                    page_size: this.pageSize
                }
                postData('pmsg/getPMsgList', data).then(res => {
                    if(res.res_code == 1){
                        res.data.list.forEach(item => {
                            item.students_num = item.students.length + '人'
                        })
                        this.total = res.data.count
                        this.list = res.data.list
                    }
                })
            },
            submit() {
                this.getList()
                this.handleClose()
            }
        },
        mounted() {
            this.tableHeight = window.innerHeight - 130
            this.getList()
        }
    }
</script>

<style scoped lang="less">

</style>
