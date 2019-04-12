<template>
    <Modal v-model="showModal" title="查看信息" :width="960" @on-cancel="closeModal" :mask-closable=false
           :footer-hide="true" :styles="{top: '6%'}">
        <div class="detail-data1">
            <img class="detail-data1-img" :src="details.img_url" />
            <div class="detail-item">
                <p class="detail-title">{{details.name}}</p>
                <p class="detail-title2">{{details.organization_name}}</p>
                <p class="detail-title3">绑定课程 <span class="curriculum-count">{{details.curriculum_count}}</span></p>
            </div>
            <div class="detail-item2">
                <p class="item2-title">讲师介绍：</p>
                <p class="item2-description">{{details.description}}</p>
            </div>
        </div>
        <Divider />
        <Tables :is-serial=true :column="columns1" :table-data="list" :tabel-height="tabelHeight" @row-click="rowClick"></Tables>
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
                        title: '类型',
                        key: 'online_name',
                        minWidth: 100
                    },
                    {
                        title: '课程名称',
                        key: 'title',
                        minWidth: 200
                    },
                    {
                        title:'培训项目',
                        key:'product_name',
                        minWidth: 160
                    },
                    // {
                    //     title:'报名人数',
                    //     key:'num',
                    //     minWidth: 100
                    // }
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
            rowClick(row){
                // window.open('http://'+row.link_url);
            },
            closeModal() {
                this.showModal = false
                this.$emit('close-modal')
            },
            getList() {
                var data = {
                    product_id: JSON.parse(localStorage.getItem('PRODUCTINFO')).id,
                    page_size: this.pageSize,
                    page_num: this.current,
                    teacher_id: this.details.id
                }
                postData('user/getTeacherCurriculums', data).then(res => {
                    this.total = res.data.count
                    this.list = res.data.list
                    if(this.list.length>0){
                        this.list.map((t) => {
                            t.online_name = t.online == 'offline' ? '线下课程' : '线上课程'
                        })
                    }
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
    /deep/ .ivu-table th, /deep/.ivu-table td{
        border: none
    }
    /deep/ .ivu-modal-body{
        padding: 0;
        padding-bottom: 50px;
    }
    .size{
        font-family: PingFangSC-Medium;
        color: #474C63;
    }
    .font{
        font-family: PingFangSC-Regular;
        font-size: 16px;
        color: #474C63;
    }
    .detail-data1 { 
        display: flex; flex-wrap: nowrap;margin: 40px; 
        .detail-data1-img{
            width: 118px;
            height: 118px;
            border-radius: 100px;
        }
        .detail-item{
            margin-left: 26px;
            .detail-title{
                .size;
                font-size: 20px;
            }
            .detail-title2{
                .font;
                margin-top: 13px;
            }
            .detail-title3{
                .font;
                margin-top: 22px;
                .curriculum-count{
                    margin-left: 14px;
                    font-family: PingFangSC-Medium;
                    font-size: 16px;
                    color: #4098FF;
                }
            }
        }
        .detail-item2{
            margin-left: 73px;
            .item2-title{
                 .size;
                 font-size: 16px;
            }
            .item2-description{
                .font;
                margin-top: 13px;
                font-size: 14px;
                letter-spacing: 0;
                line-height: 25px;
                width: 500px;
                height: 100px;
                overflow:hidden;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 4;
                text-overflow:ellipsis;
                text-align: justify;
            }
        }
    }
</style>
