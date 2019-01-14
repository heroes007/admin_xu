<template>
    <div class='manage-production-view'>
        <header-component title='点师动态' :type='0' :showAdd='true' addText='创建文章' @addClick='addNewsHandler'></header-component>
        <Row>
            <Form :inline="true" :model="formInline" class="find-by-term">
                <FormItem label="文章状态" label-width="80px">
                    <el-select v-model="formInline.state" placeholder="请选择文章状态" @change='changeFilterHandler'>
                        <el-option v-for="item in stateList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                    </el-select>
               </FormItem>
            </Form>
        </Row>
        <data-list class='data-list light-header' @edit='editHandler' @delete='deleteHandler' :table-data='dataList'
            :header-data='dataHeader' :column-formatter='listColumnFormatter' :column-formatter-data='listColumnFormatterData'></data-list>
            <Row class='pager' type='flex' justify='end' align='middle'>
                <el-pagination @current-change="handleCurrentChange" :current-page="curPage" :page-size='20' layout="prev, pager, next" :total="total">
                </el-pagination>
            </Row>
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
        set_user_student_mrzx
    } from '../../api/modules/student'
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
                pageSize:20
            }
        },

        methods: {
            ...mapActions([
                'get_news_list',
                'delete_news'
            ]),
            addNewsHandler() {
                this.handleSelModal(ADD_NEWS);
            },
            editHandler(index, row) {
                this.handleSelModal(ADD_NEWS,row.id);
            },
            deleteHandler(index, row) {
                var vm = this;
                this.$confirm('是否确认删除该产品？', '提示', {
                    type: 'info'
                }).then(() => {
                    this.delete_news({
                        id: row.id, _fn: function () {
                            vm.showPop('删除成功！');
                        }
                    })
                }).catch(() => { });
            },
            handleCurrentChange(val) {
                this.curPage = val;
                this.getData();
            },
            changeFilterHandler(){
                this.curPage = 1;
                this.getData();
            },
            getData() {
                var data = {
                    page_index: this.curPage - 1,
                    page_size: 20,
                    state: this.formInline.state
                }
                this.get_news_list(data);;
            }
        },
        mounted() {
            this.getData();
        },
        watch: {
            isLoading(val) {
                if (val) {
                    this.loadingInstance = Loading.service({
                        text:'加载中，请稍后',
                        fullscreen: true
                    });
                    setTimeout(() => {
                        this.loadingInstance && this.loadingInstance.close();
                    }, Config.base_timeout);
                } else {
                    this.loadingInstance && this.loadingInstance.close();
                    this.dirty = false;
                }
            }
        },
        computed: {
            ...mapState({
                isLoading: state => state.news.isLoading,
                dataList: state => state.news.news_list,
                total: state => state.news.total,
                stateList :state => state.news.state_list
            }),
            dataHeader() {
                    return [{
                        label: '排序',
                width: 90,
                sort: true
                    }, {
                        prop: 'create_time',
                        label: '创建时间',
                        width:160
                    }, {
                        prop: 'title',
                        label: '标题'
                    }, {
                        prop: 'count',
                        label: '浏览量',
                        width: 100
                    }, {
                        label: '操作',
                        width: 320,
                        groupBtn: [{
                            isSwitch: true,
                            switchKey: 'is_valid',
                            onText: '启用',
                            offText: '停用',
                            disableText: '失效',
                            actionName: 'change_news_valid'

                        }, {
                            text: '编辑',
                            param: 'edit'
                        },  {
                            text: 'el-icon-delete',
                            param: 'delete',
                            isIcon: true
                        }]
                    }]
            },
            listColumnFormatter() {
                return [
                    {
                        columnName:'create_time',
                        doFormat:doTimeFormat
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
                & + .popper__arrow {
                    border-top-color: #E7E8EA;
                    &:after {
                        //border-top-color:#E7E8EA;
                    }
                }
            }
        }
    }
    
    .manage-production-view {
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
    }
    
    //添加框
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