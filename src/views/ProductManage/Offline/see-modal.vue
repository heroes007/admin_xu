<template>
    <Modal v-model="showModal" title="查看详情" :width="960" @on-cancel="closeModal" :mask-closable=false
           :footer-hide="true" :styles="{top: '6%'}">
        <div class="title">
            <span class="title-name">{{details.title}}</span>
            <span class="title-num">预约人数：{{details.student_num}}</span>
        </div>
        <div class="time">
            <span class="time-content">开课日期：{{details.start_time}}至{{details.end_time}}</span>
            <span class="time-content">报名截止日期：{{details.register_end_time}}</span>
        </div>
        <div class="student">预约学员</div>
        <Tables :is-serial=true :column="columns1" :table-data="list" :tabel-height="tabelHeight"></Tables>
        <Page :current="current" :total="total" :page-size="pageSize" @page-list="pageList"></Page>
    </Modal>
</template>

<script>
    import Tables from '../../../components/tables'
    import postData from '../../../api/postData'
    import Page from '../../../components/Page'
    import pageMixin from '../../mixins/pageMixins'
    export default {
        components: {Tables, Page},
        props: {
            show: {
                type: Boolean,
                default: false
            },
            details: {
                type: Object,
                default: {}
            }
        },
        mixins: [pageMixin],
        data() {
            return {
                showModal: false,
                list:[],
                tabelHeight: 530,
                columns1:[
                    {
                        title: '用户ID',
                        key: 'id',
                        minWidth: 100
                    },
                    {
                        title: '真实姓名',
                        key: 'realname',
                        minWidth: 100
                    },
                    {
                        title:'性别',
                        key:'sex',
                        minWidth: 100
                    },
                    {
                        title:'学科',
                        key:'department_name',
                        minWidth: 100
                    },
                    {
                        title:'年级',
                        key:'grade_name',
                        minWidth: 100
                    },
                    {
                        title:'预约时间',
                        key:'reserve_time',
                        minWidth: 200
                    },
                ],
            }
        },
        watch: {
            show(_new) {
                this.showModal = _new
                if(_new) this.getList()
            }
        },
        methods: {
            closeModal() {
                this.showModal = false
                this.$emit('close-modal')
            },
            getList() {
                var data = {
                    product_id: JSON.parse(localStorage.getItem('PRODUCTINFO')).id,
                    page_size: this.pageSize,
                    page_num: this.current,
                    term_id: this.details.id
                }
                postData('/product/curriculum_offline/subject_reserve_student_get_list', data).then(res => {
                    res.data.data.forEach(item => {
                        item.sex = item.sex == 1 ? '男' : '女'
                    })
                    this.total = res.data.count
                    this.list = res.data.data
                })
            }
        },
        mounted() {
            this.pageSize = 10
        }
    }
</script>
<style lang="less" scoped>
    /deep/ .ivu-table:before, /deep/ .ivu-table:after{
        display: none;
    }
    /deep/ .ivu-table-wrapper{
        border: none
    }
    /deep/ .ivu-modal-content{
        padding: 10px 30px;
    }
    /deep/ .ivu-table:after{
        display: none;
    }
    /deep/ .ivu-table:before{
        display: none;
    }
    /deep/ .ivu-table-wrapper{
        border: none;
    }
    .title{
        margin-top: 20px;
        display: flex;
        justify-content: space-between;

        .title-name{
            font-family: PingFangSC-Medium;
            font-size: 18px;
            color: #474C63;
            letter-spacing: 0;
        }

        .title-num{
            font-family: PingFangSC-Regular;
            font-size: 16px;
            color: #474C63;
            letter-spacing: 0;
        }
    }
    .time{
        margin-top: 20px;
        display: flex;
        justify-content: space-between;

        .time-content{
            font-family: PingFangSC-Regular;
            font-size: 16px;
            color: #474C63;
            letter-spacing: 0;
        }
    }
    .student{
        margin-top: 24px;
        background: #F7F7F7;
        height: 46px;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-family: PingFangSC-Medium;
        font-size: 16px;
        color: #474C63;
    }
</style>
