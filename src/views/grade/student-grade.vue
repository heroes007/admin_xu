<template>
    <div class="box">
        <div class="message">
            <div class="message-left">
                <img class="message-left-img" src="../../assets/img/grade_all.jpg" alt="">
                <div>
                    <div class="message-left-name">name</div>
                    <div class="message-left-tel">111</div>
                </div>
            </div>
            <div class="message-right">
                <div class="message-right-percent">20%</div>
                <div class="message-right-title">全科骨干培训全科骨干培训</div>
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
        <div class="total" style="height: 200px;">
            <div class="total-course">
                <div class="total-course-title">
                    <div class="total-course-title-content">课程评分</div>
                </div>
                <tables :is-serial=true :column="columns2" :table-data="list2" ></tables>
                <page-list :current="current" :total="total" :page-size="pageSize" @page-list="pageList"/>
            </div>
        </div>
    </div>
</template>

<script>
    import tables from '../../components/tables'
    import pageList from '../../components/Page'
    import pageMixin from '../mixins/pageMixins'

    export default {
        components: {tables, pageList},
        mixins: [pageMixin],
        data() {
            return{
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
                    {title: '学习进度', key: 'veryGood', minWidth: 100},
                    {title: '老师仪表', key: 'well', minWidth: 100},
                    {title: '内容真实性', key: 'ordinary', minWidth: 120},
                    {title: '知识前沿性', key: 'bad', minWidth: 120},
                    {title: '课件质量', key: 'bad', minWidth: 100},
                    {title: '满意度', key: 'bad', minWidth: 90},
                    {
                        title: '操作',
                        minWidth: 90,
                        slot: 'operation',
                        align: 'center',
                        operation_btn_hide: true,
                        operation: [['查看', 'operation']],
                    },
                    {title: '评价时间', key: 'time', minWidth: 170},
                ],
                list2: [
                    {title: '线上课程安排合理性', veryGood: 3, well: 3, ordinary:10, bad:0, time: '2019/01/01 12:00'},
                    {title: '线上课程安排合理性', veryGood: 3, well: 3, ordinary:10, bad:0, time: '2019/01/01 12:00'},
                    {title: '线上课程安排合理性', veryGood: 3, well: 3, ordinary:10, bad:0, time: '2019/01/01 12:00'},
                    {title: '线上课程安排合理性', veryGood: 3, well: 3, ordinary:10, bad:0, time: '2019/01/01 12:00'},
                    {title: '线上课程安排合理性', veryGood: 3, well: 3, ordinary:10, bad:0, time: '2019/01/01 12:00'},
                ],
            }
        },
        mounted() {
            console.log(this.$route.query)
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
    .box{
        background-color:#f0f0f7;
        padding: 20px 30px;
        min-height: 100%;
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