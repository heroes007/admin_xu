<template>
    <div class="box">
        <Modal v-model="show" :mask-closable="false" :footer-hide="true" @on-cancel="handleClose" title="查看评价">
            <div class="modal-content">{{content}}</div>
        </Modal>
        <div class="message">
            <div class="message-left">
                <img class="message-left-img" :src="studentScore.head_img_url" alt="">
                <div>
                    <div class="message-left-name">{{studentScore.realname}}</div>
                    <div class="message-left-tel">{{studentScore.username}}</div>
                </div>
            </div>
            <div class="message-right">
                <div class="message-right-percent">{{studentScore.progress}}</div>
                <div class="message-right-title">{{studentScore.product_title}}</div>
            </div>
        </div>
        <div class="total" style="height: 200px;">
            <div class="total-course">
                <div class="total-course-title">
                    <div class="total-course-title-content">培训评分</div>
                </div>
                <tables :column="columns1" :table-data="list1" ></tables>
            </div>
        </div>
        <div class="total" :style="`height: ${lastHeight}px;`">
            <div class="total-course">
                <div class="total-course-title">
                    <div class="total-course-title-content">课程评分</div>
                </div>
                <tables :is-serial="pageDataCount" :column="columns2" :table-data="list2" @operation="operation"></tables>
                <page-list style="margin-bottom: 10px;" :current="current" :total="total" :page-size="pageSize" @page-list="pageList"/>
            </div>
        </div>
    </div>
</template>

<script>
    import tables from '../../components/tables'
    import pageList from '../../components/Page'
    import pageMixin from '../mixins/pageMixins'
    import postData from '../../api/postData'
    function scoreDta(v) {
        switch (v) {
            case 100:
                return '非常好'
            case 75:
                return '良好'
            case 25:
                return '一般'
            case 0:
                return '差'
            break
        }
        return v
    }

    export default {
        components: {tables, pageList},
        mixins: [pageMixin],
        data() {
            return{
                show: false,
                columns1: [
                    {title: '培训进度', key: 'veryGood', minWidth: 100,},
                    {title: '线上课安排合理性', key: 'veryGood', minWidth: 170},
                    {title: '线下课安排合理性', key: 'well', minWidth: 170},
                    {title: '培训对工作是否有帮助', key: 'ordinary', minWidth: 200},
                    {title: '课件质量', key: 'bad', minWidth: 100},
                    {title: '总体满意度', key: 'bad', minWidth: 120},
                    {title: '其他建议', key: 'bad', minWidth: 100},
                    {title: '评价时间', key: 'bad', minWidth: 170},
                ],
                list1: [
                    {title: '线上课程安排合理性', veryGood: 3, well: 3, ordinary:10, bad:0},
                ],
                columns2: [
                    {title: '课程名称', key: 'title', minWidth: 170, align: 'left'},
                    {title: '学习进度', key: 'progress', minWidth: 100},
                    {title: '老师仪表', key: 'score_1', minWidth: 100,
                        render: (h, params)=>{
                            return h('span', scoreDta(params.row.score_1))
                        }
                    },
                    {title: '内容真实性', key: 'score_2', minWidth: 120,
                        render: (h, params)=>{
                            return h('span', scoreDta(params.row.score_2))
                        }},
                    {title: '知识前沿性', key: 'score_3', minWidth: 120,
                        render: (h, params)=>{
                            return h('span', scoreDta(params.row.score_3))
                        }},
                    {title: '课件质量', key: 'score_4', minWidth: 100,
                        render: (h, params)=>{
                            return h('span', scoreDta(params.row.score_4))
                        }},
                    {title: '满意度', key: 'score_5', minWidth: 90,
                        render: (h, params)=>{
                            return h('span', scoreDta(params.row.score_5))
                        }},
                    {
                        title: '操作',
                        minWidth: 90,
                        slot: 'operation',
                        align: 'center',
                        isAppraise: true,
                        operation: [['查看', 'operation'], ['未评', 'operation1']],
                    },
                    {title: '评价时间', key: 'comment_time', minWidth: 170},
                ],
                list2: [],
                content: '',
                studentScore: ''
            }
        },
        computed: {
            lastHeight() {
                return window.innerHeight - 420
            }
        },
        methods: {
            handleClose() {
                this.show = false
            },
            operation(item) {
                this.show = true
                this.content = item.comment
            },
            getList() {
                let data = {
                    page_size: this.pageSize,
                    page_num: this.current,
                    product_id: Number(this.$route.query.product_id),
                    student_id: Number(this.$route.query.student_id)
                }
                postData('product/product/getStudentProductScore', data).then(res => {
                    if(res.res_code == 1) {
                        this.total = res.data.count
                        this.list2 = res.data.list
                        this.studentScore = res.data.studentScore
                        this.list2.map(item => {
                            item.state = item.is_comment
                        })
                    }
                })
            }
        },
        mounted() {
            this.pageSize = 10
            this.getList()
        }
    }
</script>

<style scoped lang="less">
    /deep/ .ivu-table:before{
        display: none;
    }
    /deep/ .ivu-table:after{
        display: none;
    }
    /deep/ .ivu-modal-body{
        padding: 30px;
    }
    .box{
        background-color:#f0f0f7;
        padding: 20px 30px;
        min-height: 100%;
    }
    .modal-content{
        font-family: PingFangSC-Regular;
        font-size: 16px;
        color: #474C63;
        letter-spacing: 0;
        line-height: 28px;
        min-height: 300px;
        max-height: 600px;
        overflow: hidden;
        overflow-y: auto;
    }
    .message{
        display: flex;
        justify-content: space-between;
        align-items: center;
        background-color:#fff;
        height: 160px;

        .message-left{
            display: flex;
            margin-left: 50px;
            align-items: center;

            .message-left-img{
                height: 100px;
                width: 100px;
                border-radius: 100%;
                margin-right: 20px;
            }

            .message-left-name{
                font-family: PingFangSC-Medium;
                font-size: 22px;
                color: #1B1B1B;
                letter-spacing: 0;
                text-align: justify;
            }

            .message-left-tel{
                font-family: PingFangSC-Regular;
                font-size: 15px;
                color: #777777;
                letter-spacing: 0;
                text-align: justify;
                margin-top: 10px;
            }
        }
        .message-right{
            margin-right: 50px;

            .message-right-percent{
                font-family: PingFangSC-Medium;
                font-size: 30px;
                color: #4098FF;
                letter-spacing: 0;
                text-align: right;
            }
            .message-right-title{
                font-family: PingFangSC-Regular;
                font-size: 18px;
                color: #1B1B1B;
                letter-spacing: 0;
                text-align: right;
                margin-top: 13px;
            }
        }
    }
    .total{
        margin-top: 10px;

        .total-right{
            margin-right: 5px;
            background-color: #fff;
            width: 100%;
            height: 100%;
        }

        .total-course{
            margin-right: 5px;
            background-color: #fff;
            width: 100%;
            height: 100%;

            .total-course-title{
                height: 60px;
                font-family: PingFangSC-Medium;
                font-size: 22px;
                color: #1B1B1B;
                letter-spacing: 0;
                text-align: left;
                display: flex;
                align-items: center;
            }
            .total-course-title-content{
                line-height: 20px;
                border-left: 5px solid #4098FF;
                margin-left: 30px;
                padding-left: 10px;
            }
            .total-course-title-operation{
                margin-right: 30px;
                display: flex;
                align-items: center;

                .total-course-img{
                    margin-left: 15px;
                    width: 20px;
                    height: 20px;
                }
            }
        }
    }

</style>