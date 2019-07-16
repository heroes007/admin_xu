<template>
    <div class="content">
        <Row class="title">
            <Col span="12">
                <div class="title-content">
                    全科医生岗位技能水平提升
                </div>
                <div class="title-time">
                    <div class="title-time-name">统计时间</div>
                    <DatePicker v-model="datePicker" class="title-time-data" type="daterange" :options="options3" placeholder="" format="yyyy/MM/dd"
                                separator="至" @on-clear="dateClaer"></DatePicker>
                </div>
            </Col>
            <Col span="12" style="height: 100%;">
                <div class="statistics-box">
                    <div v-for="(item, index) in statistics" :key="index" style="margin: 0 25px;">
                        <div class="statistics-value">{{item.value}}</div>
                        <div class="statistics-title">{{item.title}}</div>
                    </div>
                </div>
            </Col>
        </Row>
        <Row :gutter="10" class="total">
            <Col span="12" style="height: 400px;">
                <div class="total-course">
                    <div class="total-course-title">
                        <div class="total-course-title-content">培训评分</div>
                    </div>
                    <tables :column="columns1" :table-data="list1" ></tables>
                </div>
            </Col>
            <Col span="12" style="height: 400px;">
                <div class="total-right">
                    <div class="total-course">
                        <div class="total-course-title" style="justify-content: space-between">
                            <div class="total-course-title-content">课程评分</div>
                            <div class="total-course-title-operation">
                                <Select v-model="selectCourse" style="width:200px;">
                                    <Option v-for="item in courseList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                                </Select>
                                <img src="../../assets/img/grade_all.jpg" alt="" class="total-course-img">
<!--                                <img src="../../assets/img/grade_pack.jpg" alt="">-->
                            </div>
                        </div>
                        <tables :column="columns1" :table-data="list1" ></tables>
                    </div>
                </div>
            </Col>
        </Row>
        <Row class="total">
            <Col>
                <div style="background-color: #fff;width: 100%;height: 100%;">
                    <div class="total-course">
                        <div class="total-course-title">
                            <div class="total-course-title-content">学员评分</div>
                        </div>
                        <tables :is-serial=true :column="columns3" :table-data="list3" @operation="check"></tables>
                        <page-list :current="current" :total="total" :page-size="pageSize" @page-list="pageList"/>
                    </div>
                </div>
            </Col>
        </Row>
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
                options3: {
                    disabledDate (date) {
                        return false;
                    }
                },
                datePicker: [new Date(Date.now() - 86400000), new Date()],
                statistics: [{title: '已报名', value: 12}, {title: '已学完', value: 12}, {title: '已评分', value: 12}],
                columns1: [
                    {title: '评分项', key: 'title', minWidth: 200, align: 'left'},
                    {title: '非常好', key: 'veryGood', minWidth: 90, maxWidth: 120},
                    {title: '良好', key: 'well', minWidth: 90, maxWidth: 120},
                    {title: '一般', key: 'ordinary', minWidth: 90, maxWidth: 120},
                    {title: '差', key: 'bad', minWidth: 90, maxWidth: 120},
                ],
                list1: [
                    {title: '线上课程安排合理性', veryGood: 3, well: 3, ordinary:10, bad:0},
                    {title: '线下课程安排合理性', veryGood: 3, well: 3, ordinary:10, bad:0},
                    {title: '培训对您以后的工作是否有帮助', veryGood: 3, well: 3, ordinary:10, bad:0},
                    {title: '课件质量', veryGood: 3, well: 3, ordinary:10, bad:0},
                    {title: '总体满意度', veryGood: 3, well: 3, ordinary:10, bad:0}
                ],
                columns3: [
                    {title: '姓名', key: 'realname', align: 'left', minWidth: 120},
                    {title: '账号', key: 'realname', align: 'left', minWidth: 140},
                    {title: '学习进度', key: 'realname', minWidth: 100},
                    {title: '已评课程', key: 'realname', minWidth: 100},
                    {title: '线上课', key: 'realname', minWidth: 90},
                    {title: '线下课', key: 'realname', minWidth: 90},
                    {title: '是否有帮助', key: 'realname', minWidth: 120},
                    {title: '课件质量', key: 'realname', minWidth: 100},
                    {title: '满意度', key: 'realname', minWidth: 90},
                    {
                        title: '操作',
                        minWidth: 100,
                        slot: 'operation',
                        align: 'center',
                        operation_btn_hide: true,
                        operation: [['查看详情', 'operation']],
                    }
                ],
                list3: [{realname: '张三'}],
                selectCourse: null,
                courseList: [
                    {value: '1', label: '第一节课'},
                    {value: '2', label: '第一节课'},
                    {value: '3', label: '第一节课'},
                ]
            }
        },
        methods: {
            dateClaer() {
                this.datePicker = [new Date(Date.now() - 86400000), new Date()]
            },
            check(item) {
                window.open(`/product/student-grade?name=${item.realname}`, '_blank')
            },
            getList() {

            }
        },
        mounted() {
            this.options3 = {
                disabledDate (date) {
                    return date && date.valueOf() < Date.now() - 86400000;
                }
            }
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
    .content{
        background-color: #f0f0f7;
        padding: 20px 30px;
        min-height: 100%;
    }
    .title{
        background-color:#fff;
        height: 170px;

        .title-content{
            font-family: PingFangSC-Medium;
            font-size: 30px;
            color: #1B1B1B;
            letter-spacing: 0;
            text-align: justify;
            margin: 30px;
        }

        .title-time{
            display: flex;
            align-items: center;
            margin-top: 5px;
            margin-left: 30px;

            .title-time-name{
                font-family: PingFangSC-Regular;
                font-size: 14px;
                color: #1B1B1B;
                letter-spacing: 0;
                text-align: justify;
            }

            .title-time-data{
                margin-left: 10px;
                background: #FFFFFF;
                border: 1px solid #C8CCDD;
                border-radius: 4px;
                width: 260px !important;
            }
        }

        .statistics-box{
            display: flex;
            float: right;
            height: 100%;
            align-items: center;

            .statistics-value{
                font-family: PingFangSC-Medium;
                font-size: 25px;
                color: #1B1B1B;
                letter-spacing: 0;
                text-align: center;
            }

            .statistics-title{
                font-family: PingFangSC-Regular;
                font-size: 14px;
                color: #1B1B1B;
                letter-spacing: 0;
                text-align: center;
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