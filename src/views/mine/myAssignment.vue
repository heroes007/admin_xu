<template>
    <div class='my-assignment-view'>
        <header-component :type='4' @reRenderList="reRenderListHandler" style="margin-bottom:20px;"/>
         <el-form :inline="true" label-width="80px" style="text-align:left">
             <el-form-item label="学科：">
                 <el-select v-model="selectSubject" placeholder="请选择" @change='getNewList'>
                    <el-option v-for="item in subjectList" :key="item.id" :label="item.name" :value="item.id">
                    </el-option>
                </el-select>
             </el-form-item>
             <el-form-item label="学段：">
                 <el-select v-model="selectGrade" placeholder="请选择" @change='getNewList'>
                    <el-option v-for="item in gradeList" :key="item.id" :label="item.name" :value="item.id">
                    </el-option>
                </el-select>
             </el-form-item>
             <el-form-item label="类型：">
                 <el-select v-model="selectType" placeholder="请选择" @change='getNewList'>
                    <el-option :label="item.name" :value="item.id" v-for='item in categoryList' :key="item.id">
                    </el-option>
                </el-select>
             </el-form-item>
             <el-form-item label="状态：">
                 <el-select v-model="selectState" placeholder="请选择" @change='getNewList'>
                    <el-option label="已发送" :value="0">
                    </el-option>
                    <el-option label="未上传" :value="1">
                    </el-option>
                    <el-option label="未批阅" :value="2">
                    </el-option>
                    <el-option label="已批阅" :value="3">
                    </el-option>
                </el-select>
             </el-form-item>
         </el-form>
        <el-form :inline="true" label-width="80px" style="text-align:left">
            <el-form-item label="电话：">
                <el-input v-model="phone" placeholder="请输入电话"></el-input>
            </el-form-item>
            <el-form-item label="姓名：">
                <el-input v-model="realname" placeholder="请输入姓名"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="getNewList">查询</el-button>
            </el-form-item>
        </el-form>
        <data-list @assign='assignHandler' class='data-list light-header' :table-data='dataList' :header-data='dataHeader' :column-formatter='listColumnFormatter'
            :column-formatter-data='listColumnFormatterData' :is-stripe='false'></data-list>
    </div>
</template>

<script>
    import Header from '../../components/ProjectHeader'
    import BaseList from '../../components/BaseList'
    import {
        doTimeFormat
    } from '../../components/Util'
    import {
        Loading
    } from 'element-ui';
    import {
        Dialog
    } from '../dialogs';
    import * as types from '../dialogs/types';
    import {
        mapActions,
        mapState
    } from 'vuex'
    import {
        Config
    } from '../../config/base'
    export default {
        mixins: [Dialog],
        data() {
            return {
                loadingInstance: null,
                selectSubject: 0,
                selectGrade: 0,
                selectType: 1,
                selectState: 2,
                phone:"",
                realname:""
            }
        },
        computed: {
            ...mapState({
                categoryList:state => state.task.task_category_list,
                subjectList: state => state.subject.subject_list,
                gradeList: state => state.grade.grade_list,
                isLoading: state => state.assignment.isLoading,
                stateList: state => state.assignment.state_list,
                projectId: state => state.project.select_project_id,
                dataList: state => state.assignment.data_list
            }),
            dataHeader() {
                return [{
                    prop: 'user_id',
                    label: 'ID',
                    width: 80
                }, {
                    prop: 'realname',
                    label: '姓名',
                    width: 100
                }, {
                    prop: 'phone',
                    label: '注册手机',
                    width: 200
                }, {
                    prop: 'grade_id',
                    label: '学段',
                    width: 80
                }, {
                    prop: 'subject_id',
                    label: '学科',
                    width: 80
                },
                {
                    prop: 'upload_time',
                    label: '上传时间',
                    width: 150
                },
                {
                    prop: 'expect_task_time',
                    label: '截止时间',
                    width: 150
                },
                {
                    prop: 'state',
                    label: '状态',
                    width: 100
                }, 
                {
                    prop: 'name',
                    label: '任务名称'
                }, 
                {
                    label: '操作',
                    width: 350,
                    groupBtn: [{
                        text: '批阅',
                        param: 'assign'
                    }]
                }
                ]
            },
            listColumnFormatter() {
                return [{
                    columnName: 'upload_time',
                    doFormat: doTimeFormat
                },
                {
                    columnName: 'expect_task_time',
                    doFormat: doTimeFormat
                }, {
                    columnName: 'grade_id',
                    dataIndex: 0,
                    dataProp: 'id',
                    dataValue: 'name'
                }, {
                    columnName: 'subject_id',
                    dataIndex: 1,
                    dataProp: 'id',
                    dataValue: 'name'
                }, {
                    columnName: 'state',
                    dataIndex: 2,
                    dataProp: 'id',
                    dataValue: 'name'
                }]
            },
            listColumnFormatterData() {
                return [this.gradeList, this.subjectList, this.stateList];
            }
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
                }
            }
        },
        methods: {
            ...mapActions([
                'get_subject_list',
                'get_grade_list',
                'get_my_assignment_list',
                'get_project_list'
            ]),
            getNewList() {
                this.get_my_assignment_list({                    
                    project_id: this.projectId,
                    task_category_id: this.selectType,
                    subject_id: this.selectSubject,
                    grade_id: this.selectGrade,
                    phone:this.phone,
                    realname:this.realname,
                    state: this.selectState
                });
            },
            reRenderListHandler(v) {
                if (this.$store.state.project.project_list.length > 0) {
                    this.getNewList();
                }
            },
            assignHandler(index, row) {
                this.handleSelModal(types.ADD_TASK_ASSIGNMENT, {
                    row: row
                })
            }
        },
        mounted() {
            var vm = this;
            if (this.$store.state.project.project_list.length === 0) {
                this.$store.dispatch('get_project_list', {
                    callback(v) {
                        vm.getNewList();
                        vm.$store.dispatch('get_task_category_list', {
                        project_id: v
                    })
                    }
                });
                // return;
            } else {
                this.getNewList();
                vm.$store.dispatch('get_task_category_list', {
                        project_id: this.projectId
                    })
            }

            this.get_subject_list();
            this.get_grade_list();

        },
        components: {
            'header-component': Header,
            'data-list': BaseList
        }
    }

</script>
<style lang='scss'>
    .my-assignment-view {
        .data-filters {
            margin: 30px 0;
        }
        .data-list {
            thead {
                tr {
                    height: 60px;
                }
            }
            .base-list-row {
                height: 60px;
                .el-button {
                    margin-left: 0;
                    &:last-child {
                    margin-left: 0;
                }
                }
            }
        }
    }
</style>