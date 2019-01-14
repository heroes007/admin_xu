<template>
    <div class='manage-production-group-view'>
        <header-component title='产品组合' :type='0' :showAdd='true' addText='新建专题' @addClick='addProductionGroupHandler'></header-component>
        <Row>
            <Form :inline="true" :model="formInline" class="find-by-term">
                <FormItem label="专题名称" :label-width="80">
                    <Row>
                        <Col>
                            <Input v-model="formInline.searchData" placeholder="请输入搜索内容"></Input>
                        </Col>
                    </Row>
               </FormItem>
                <FormItem>
                    <Button type="primary" @click="search">查询</Button>
               </FormItem>
                <FormItem>
                    <Button type="primary" @click="clearSearch">清除</Button>
               </FormItem>
            </Form>
        </Row>
        <data-list class='data-list light-header' @edit='editHandler' @detail='showCourseDetailHandler' @delete='deleteHandler' :table-data='dataList'
            :header-data='dataHeader' :column-formatter='listColumnFormatter' :column-formatter-data='listColumnFormatterData'></data-list>
            <Row class='pager' type='flex' justify='end' align='middle'>
                <Page class="case-main-pages" :current="curPage" :page-size='20' @on-change="handleCurrentChange" :total="total" />
            </Row>
    </div>
</template>
<script>
    import Header from '../../components/Header'
    import BaseList from '../../components/BaseList'
    import BackToTop from '../../components/BackToTop'
    import { MPop } from '../../components/MessagePop'
    import api from '../../api/modules/config'
    import { set_user_student_mrzx } from '../../api/modules/student'
    import { send_interview_msg } from '../../api/modules/exam'
    import { Dialog  } from '../dialogs'
    import { ADD_PRODUCTION_GROUP, SELECT_PRODUCTION } from '../dialogs/types'
    import { Config } from '../../config/base'
    import { mapState, mapActions, mapGetters } from 'vuex'
    import { doDateFormat,doTimeFormat } from '../../components/Util'
    export default {
        mixins: [Dialog, MPop],
        components: { 
            'header-component': Header, 'data-list': BaseList,
        },
        data() {
            return {
                curPage: 1,
                formInline: {
                    searchData: ''
                },
            }
        },
        methods: {
            ...mapActions([
                'get_production_group_list',
                'change_production_group_vailid',
                'delete_production_group'
            ]),
            addProductionGroupHandler() {
                this.handleSelModal(ADD_PRODUCTION_GROUP);
            },
            editHandler(index, row) {
                this.handleSelModal(ADD_PRODUCTION_GROUP, {id:row.id});
            },
            showCourseDetailHandler(index, row) {
                this.handleSelModal(SELECT_PRODUCTION,row.id);
            },
            deleteHandler(index, row) {
                var vm = this;
                this.$confirm('是否确认删除该专题？', '提示', {
                    type: 'info'
                }).then(() => {
                    this.delete_production_group({
                        id: row.id, _fn: function () {
                            vm.showPop('删除成功！');
                        }
                    })
                }).catch(() => { });
            },
            clearSearch() {
                this.formInline.searchData = '';
                this.curPage = 1;
                var data = this.getData();
            },
            search() {
                this.curPage = 1;
                var data = this.getData();
            },
            handleCurrentChange(val) {
                this.curPage = val;
                var data = this.getData();
            },
            getData() {
                var data = {
                    project_id: this.projectId,
                    page_index: this.curPage - 1,
                    page_size: 20,
                    name: this.formInline.searchData
                }
                this.get_production_group_list(data);;
            }
        },
        mounted() {
            this.getData();
        },
        watch: {
            isLoading(val) {
                this.$config.IsLoading(val);
            }
        },
        computed: {
            ...mapState({
                isLoading: state => state.production_group.isLoading,
                dataList: state => state.production_group.production_group_list,
                total: state => state.production_group.totalCount,
                projectId: state => state.project.select_project_id
            }),
            dataHeader() {
                 return [{
                        label: '序号',
                        width:90,
                        sort:true
                    }, {
                        prop: 'name',
                        label: '专题名称'
                    }, {
                        prop: 'product_count',
                        label: '产品数量',
                        width: 100
                    }, {
                        label: '操作',
                        width: 360,
                        groupBtn: [{
                            isSwitch: true,
                            switchKey: 'is_valid',
                            onText: '启用',
                            offText: '停用',
                            disableText: '失效',
                            actionName: 'change_production_group_vailid'

                        }, {
                            text: '编辑',
                            param: 'edit'
                        }, {
                            text: '查看产品',
                            param: 'detail'
                        }, {
                            text: 'el-icon-delete',
                            param: 'delete',
                            isIcon: true
                        }]
                    }]
            },
            listColumnFormatter() {
                return []
            },
            listColumnFormatterData() {
                return [];
            }
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
    
    .manage-production-group-view {
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