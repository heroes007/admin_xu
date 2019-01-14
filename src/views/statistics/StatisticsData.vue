<template>
    <div class='statistics-data-view'>
        <header-component title='点击量统计' :type='0' :showAdd='false'></header-component>
        <Row>
            <Form :inline="true" :model="formInline" class="find-by-term">
                <FormItem label="选择时间" label-width="80px">
                    <DatePicker v-model="timeRange" type="daterange" placeholder="选择日期范围" @change='changeTimeHandler'></DatePicker>
               </FormItem>
            </Form>
        </Row>
        <data-list class='data-list light-header' :table-data='dataList' :header-data='dataHeader' :column-formatter='listColumnFormatter' :column-formatter-data='listColumnFormatterData'></data-list>
        <!-- <Row class='pager' type='flex' justify='end' align='middle'>
                    <el-pagination @current-change="handleCurrentChange" :current-page="curPage" :page-size='20' layout="prev, pager, next" :total="total">
                    </el-pagination>
                </Row> -->
    </div>
</template>



<script>
import Header from '../../components/Header'
import SubjectFilter from '../../components/SubjectFilter'
import BaseList from '../../components/BaseList'
import BackToTop from '../../components/BackToTop'
import {
    MPop
} from '../../components/MessagePop'
import api from '../../api/modules/config'
import {
    getPVAndUV
} from '../../api/modules/tools_statistics'
import {
    send_interview_msg
} from '../../api/modules/exam'
import {
    Loading
} from 'element-ui'
import {
    Dialog
} from '../dialogs'
import {
    ADD_NEWS
} from '../dialogs/types'
import {
    Config
} from '../../config/base'
import {
    mapState,
    mapActions,
    mapGetters
} from 'vuex'
import {
    doDateFormat,
    doTimeFormat,
    reunitPrice
} from '../../components/Util'

export default {
    mixins: [Dialog, MPop],
    data() {
        return {
            loadingInstance: null,
            curPage: 1,
            formInline: {
                state: null
            },
            pageSize: 20,
            dataList:[],
            timeRange:[]
        }
    },

    methods: {
        ...mapActions([

        ]),
        changeTimeHandler() {
            this.getData();
        },
        handleCurrentChange(val) {
            this.curPage = val;
            this.getData();
        },
        changeFilterHandler() {
            this.curPage = 1;
            this.getData();
        },
        getData() {
            if(this.timeRange.length === 0)
                return;
            var data = {
                start_time: this.timeRange[0],
                end_time: this.timeRange[1]
            }
            this.showLoading();
            getPVAndUV(data).then(res => {
                if (res.data.res_code === 1) {
                    this.dataList = res.data.msg;
                }
                this.loadingInstance && this.loadingInstance.close();
            })
        },
        showLoading() {
            this.loadingInstance = Loading.service({
                text: '加载中，请稍后',
                fullscreen: true
            });
            setTimeout(() => {
                this.loadingInstance && this.loadingInstance.close();
            }, Config.base_timeout);
        }
    },
    mounted() {
        this.getData();
    },
    watch: {
    },
    computed: {
        ...mapState({
        }),
        dataHeader() {
            return [{
                label: '排序',
                width: 90,
                sort: true
            }, {
                prop: 'url',
                label: '访问地址'
            }, {
                prop: 'view_count',
                label: '点击次数',
                width:150
            }, {
                prop: 'ip_count',
                label: '点击量',
                width: 150
            }, {
                prop: 'log_file',
                label: '记录时间',
                width: 150
            }]
        },
        listColumnFormatter() {
            return [
                {
                    columnName: 'create_time',
                    doFormat: doTimeFormat
                }
            ]
        },
        listColumnFormatterData() {
            return [];
        }
    },
    components: {
        'header-component': Header,
        'subject-filter': SubjectFilter,
        'data-list': BaseList,
        'back-to-top': BackToTop
    }
}

</script>
<style lang="scss">
.el-tooltip__popper {
    &.is-light {
        background: #FFFFFF;
        border: 1px solid #E7E8EA;
        box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.12), 0 0 6px 0 rgba(0, 0, 0, 0.04);
        .more-tip {
            max-width: 278px;
            line-height: 1.2;
            font-size: 14px;
            color: #2e3e47;
            &+.popper__arrow {
                border-top-color: #E7E8EA;
                &:after {
                    //border-top-color:#E7E8EA;
                }
            }
        }
    }
}

.statistics-data-view {
    .base-list-container {
        .base-list-row {
            height: 60px;
            .cell {
                .el-button {
                    margin-right: 2px;
                    &:last-child {
                        margin-left: 10px;
                    }
                }
            }
        }
    }
    .find-by-term {
        padding-top: 22px;
        text-align: left;
        margin-left: 20px;
        .el-input__inner {
            border-radius: 0;
            background: #FFFFFF;
            border: 1px solid #E5E5E5;
        }
        .el-form-item__label {
            font-size: 14px;
            color: #141111;
            letter-spacing: 0;
        }
        .el-select {
            width: 300px;
            &.select-user {
                width: 100%;
                .el-input__inner {
                    border-right: 0;
                }
            }
        }
        button {
            background: #FB843E;
            border: 1px solid #F06B1D;
            border-radius: 4px;
            width: 100px;
            height: 36px;
        }
    }
    .pager {
        margin: 30px 0;
        padding-right: 40px;
        .el-pagination {
            button {
                &.disabled {
                    background-color: #ebebec;
                    border-color: #b0b3c5;
                    color: #8b9fa9;
                }
            }
            .el-pager {
                li {
                    &.active {
                        background-color: #8b9fa9;
                    }
                }
            }
        }
    }
    .btn-add {
        color: #5fa137;
    }
    .data-container {
        background-color: #ffffff;
        margin: 0 20px 20px;
        .list {
            .data-header {
                height: 50px;
                .Col {
                    line-height: 50px;
                }
            }
            .data-item {
                height: 40px;
                border-top: 1px solid #cecece;
                &.bg-gray {
                    background-color: #fbfbfb;
                }
                .Col {
                    line-height: 40px;
                    .el-button {
                        a {
                            color: #5fa137;
                            font-size: 14px;
                        }
                    }
                    p {
                        margin: 0;
                        display: -webkit-box;
                        white-space: normal;
                        -webkit-box-orient: vertical;
                        overflow: hidden;
                        -webkit-line-clamp: 1;
                    }
                }
            }
            .pager {
                margin: 30px 0;
                padding-right: 40px;
                .el-pagination {
                    button {
                        &.disabled {
                            background-color: #ebebec;
                            border-color: #b0b3c5;
                            color: #8b9fa9;
                        }
                    }
                    .el-pager {
                        li {
                            &.active {
                                background-color: #8b9fa9;
                            }
                        }
                    }
                }
            }
        }
    }
    .back-to-top {
        top: 80%;
        right: 20px;
    }
} //添加框
.add-student-view {
    .img {
        margin-top: 100px;
        img {
            width: 150px;
            height: 150px;
        }
    }
    .title {
        margin-top: 25px;
        h1 {
            font-size: 28px;
            color: #2e3e47;
            font-weight: 200;
            font-family: MicrosoftYaHei;
            margin: 0;
        }
    }
    .search-bar {
        margin-top: 40px;
        .el-input-group {
            width: 380px;
            .el-input__inner {
                height: 46px;
            }
            .el-input-group__append {
                background-color: #7ab854;
                .el-button {
                    height: 100%;
                    width: 80px;
                    color: #ffffff;
                    font-size: 16px;
                }
            }
            .el-input-group__prepend {
                background-color: #7ab854;
                .el-select {
                    height: 100%;
                    width: 110px;
                    color: #ffffff;
                    font-size: 16px;
                }
                i {
                    color: #ffffff;
                }
            }
        }
    }
    .result {
        margin: 15px 0 76px;
        .data-form {
            width: 550px;
            background-color: #ffffff;
            border: 1px solid #EBEBEC;
            border-radius: 6px;
            padding: 20px 0;
            .user-info {
                font-size: 14px;
                margin-bottom: 24px;
                border-bottom: 1px solid #EBEBEC;
                padding: 0 20px;
                span {
                    color: #7ab854;
                    margin-right: 15px;
                }
            }
            .user-data {
                font-size: 14px;
                margin-bottom: 15px;
                padding: 0 20px;
                .el-button {
                    width: 140px;
                    height: 36px;
                    background-color: #7ab854;
                    color: #ffffff;
                }
                &.desc {
                    width: 100%;
                    .el-input {
                        width: 330px;
                    }
                }
            }
        }
    }
}
</style>
