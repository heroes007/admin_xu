<template>
    <Modal v-model="showModal" title="查看预约" :width="960" @on-cancel="closeModal" :mask-closable=false
           :footer-hide="true" :styles="{top: '6%'}">
        <div class="title">
            <span class="title-name">{{details.title}}</span>
            <span class="title-num">{{details.student_num}}人预约</span>
        </div>
         <div class="make-list-item" v-for="(t,i) in list" :key="i">
            <img class="make-item-img" :src="t.head_img_url"/>
                <div class="make-item-content">
                    <h2>{{t.realname}}  <span>{{t.department_name}} | {{t.grade_name}}</span></h2>
                    <div class="make-item-de">
                        <div>{{t.username}}</div> 
                        <div class="make-item-time" v-if="t.reserve_time">预约时间: {{t.reserve_time}}</div>
                    </div>
                </div>
        </div>
        <!-- <Tables :is-serial=true :column="columns1" :table-data="list" :tabel-height="tabelHeight"></Tables> -->
        <Page v-if="this.total>4" :current="current" :total="total" :page-size="pageSize" @page-list="pageList"></Page>
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
            this.pageSize = 4
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
    .make-list-item {
        background: #FFFFFF;
        height: 110px;
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        align-items: center;
        position: relative;
        width: 100%;
        .make-item-img {
            width: 59px;
            height: 60px;
            border-radius: 30px;
        }
        .make-item-content {
            margin-left: 15.5px;
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
            width: calc(100% - 75.5px);
            h2, .make-item-de {
                text-align: left;
                color: #474C63;
            }
            h2 {
                font-family: PingFangSC-Medium;
                font-size: 18px;
                margin-bottom: 15px;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
                span{
                    margin-left: 20px;
                }
            }
            .make-item-de {
                font-family: PingFangSC-Regular;
                font-size: 14px;
                position: relative;
                display: flex;
                .make-item-time{
                    position: absolute;
                    right: 0;
                }
            }
        }
    }

</style>
