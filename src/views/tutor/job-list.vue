<template>
    <div>
        <screen :types="13" :selectType2="true" :select4="selectList" :title="title" @handleBack="handleBack"/>
        <div class="state">
            <Select v-model="stateValue" class="state-select">
                <Option v-for="item in stateSelect" :key="item.id" :value="item.id">{{item.title}}</Option>
            </Select>
            <div class="state-btn">
                <img class="state-img" :src="checkImg" alt="">
                <div class="state-check font-regular6">查看题目</div>
            </div>
            <div class="state-data">
                <div v-for="(item, index) in numList" :key="index" class="state-data-box">
                    <div>
                        <span class="state-data-box-num font-regular1">{{item.num}}</span>
                        <span class="state-data-box-unit">{{item.unit}}</span>
                    </div>
                    <div class="state-data-box-title">{{item.title}}</div>
                </div>
            </div>
        </div>
        <div class="batch">
            <div class="batch-title">选项</div>
            <Button class="batch-download" type="primary" ghost>下载附件</Button>
            <Button class="batch-read" type="primary" ghost>批阅</Button>
        </div>
        <tables :tabel-height="tableHeight" :column="column" :table-data="list" @operation1="check" @select-tables="selectTables" @on-select-all="selectTablesAll"/>
        <page-list  :current="current" :total="total" :page-size="pageSize" @page-list="pageList"/>
    </div>
</template>

<script>
    import tables from '../../components/tables'
    import screen from '../../components/ScreenFrame'
    import checkImg from '../../assets/img/check.jpg'
    import pageList from '../../components/Page'
    import pageMixins from '../mixins/pageMixins'
    import postData from '../../api/postData'
    export default {
        components: {tables, screen, pageList},
        mixins: [pageMixins],
        data() {
            return {
                column: [
                    {title: '选项', type: 'selection', width: 100},
                    {title: '姓名', key: 'realname', minWidth: 100 },
                    {title: '作业附件', slot: 'accessory', minWidth: 180 },
                    {title: '提交日期', key: 'upDate', minWidth: 180},
                    {title: '批阅', key: 'state', slot: 'state-item', stateKey: 'read', minWidth: 100},
                    {title: '评分', key: 'score', minWidth: 100 },
                    {
                        title: '操作',
                        minWidth: 100,
                        slot: 'operation',
                        align: 'left',
                        operation: [['查看','operation1']],
                    }
                ],
                list: [
                    {realname: '张三', describe: '描述', accessory: '附件', upDate: new Date(), read: 1, state: '已通过', score: 80},
                    {realname: '李四', describe: '描述', accessory: '附件', upDate: new Date(), read: 0, state: '未通过', score: 80},
                    {realname: '王五', describe: '描述', accessory: '附件', upDate: new Date(), read: 2, state: '未批阅', score: 80},
                ],
                selectList: [
                    {id: 1, title: '作业'},
                    {id: 2, title: '问答'},
                    {id: 3, title: '课程'},
                ],
                title: '课程名称癌症病人的心理护理与症状干预',
                stateValue: null,
                stateSelect: [
                    {id: 1, title: '全部'},
                    {id: 2, title: '未批阅'},
                    {id: 3, title: '未通过'},
                ],
                numList: [
                    {num: 13, unit: '人', title: '交作业'},
                    {num: 13, unit: '人', title: '未批阅'},
                    {num: 13, unit: '人', title: '未通过'},
                    {num: 13, unit: '人', title: '已通过'},
                    {num: 13, unit: '次', title: '复审'},
                ],
                tableHeight: null,
                checkImg
            }
        },
        methods: {
            check() {

            },
            selectTables(selection, row) {
                console.log(selection, row, '123')
            },
            selectTablesAll() {
                console.log(123);
            },
            handleBack() {
                this.$router.go(-1)
            },
            getList() {
                let data = {
                    page_size: this.pageSize,
                    page_num: this.current,
                    curr_term_id: +this.$route.query.id,
                    curriculum_type: this.$route.query.curriculum_type
                }
                postData('/tutor/getHomeworkByCurr', data).then(res => {
                    console.log(res)
                    this.total = res.count
                })
            }
        },
        mounted() {
            this.pageSize = 10
            this.tableHeight = window.innerHeight - 260
            this.stateValue = this.stateSelect[0].id
            this.getList()
        }
    }
</script>

<style lang="less" scoped>
    .screen{
        background-color: #fff;
    }
    /deep/ .ivu-select-selection{
        border-radius: 100px;
        height: 36px;
        padding-left: 15px;
    }
    /deep/ .ivu-select-selection{
        background: #EEEEF6;
    }
    .state{
        background-color: #fff;
        border-top: 1px solid #F0F0F7;
        height: 80px;
        display: flex;
        align-items: center;
        position: relative;

        .state-select{
            width: 120px;
            border-radius: 18px;
            margin-left: 40px;
        }

        .state-btn{
            display: flex;
            align-items: center;
            cursor: pointer;
            margin-left: 30px;
        }

        .state-img{
            height: 24px;
            width: 24px;
        }

        .state-check{
            margin-left: 5px;
            letter-spacing: 2px;
        }

        .state-data{
            display: flex;
            position: absolute;
            right: 40px;
        }

        .state-data-box{
            margin-left: 30px;

            &-unit{
                font-size: 14px;
                color: #4098FF;
            }

            &-title{
                font-size: 14px;
                color: #8C9095;
            }
        }
    }
    .batch{
        text-align: left;
        display: flex;
        border-top: 1px solid #F0F0F7;
        background-color:#fff;
        height: 60px;
        align-items: center;

        &-title{
            margin-left: 36px;
            font-size: 16px
        }

        &-download{
            margin-left: 40px;
            width: 100px;
            height: 30px;
        }

        &-read{
            margin-left: 10px;
            width: 100px;
            height: 30px;
        }
    }
</style>
