<template>
<div class='manage-offline-course'>
    <header-component :type='2' :showAdd='true' @addOfflineSemester='addOfflineSemesterHandler' @reRenderList="reRenderListHandler" />
    <data-list @editChapter='editChapterHandler' @editCourse='editCourseHandler' @moveUp='moveUpHandler' @moveDown='moveDownHandler' @deleteCourse='deleteCourseHandler' @childBtnClick='childBtnClickHandler' @add='addOfflineCourse' @edit='editOfflineSemester'
        @expandOpen='rowExpandHandler' @delete='deleteOfflineSemester' @sendOfflineCourse="sendOfflineCourseHandler"
        @manageSignup='manageSignupHandler' class='data-list light-header' :table-data='dataList' :header-data='dataHeader' :column-formatter='listColumnFormatter' :column-formatter-data='listColumnFormatterData' :is-stripe='false'></data-list>
    <save-order v-if='dirty' @saveOrder='saveOrderHandler' />
</div>
</template>

<script>
import Header from '../../components/ProjectHeader'
import BaseList from '../../components/BaseList'
import SaveOrder from '../../components/SaveOrder'
import {
    doTimeFormat,
    doDateFormat,
    doOfflineCurriculumTypeFormat
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
            data: [{
                time: 'Fs100',
                title: '老师也要学点管理学',
                createtime: '2016-10-27T02:51:43.000Z',
                total: 10,
                openTime: '2016-10-27T02:51:43.000Z',
                endTime: '2016-10-27T02:51:43.000Z',
                childData: [{
                    title: '攻心是销售流程准备阶段',
                    type: '讲座',
                    openTime: '2016-10-27T02:51:43.000Z',
                    endTime: '2016-10-27T02:51:43.000Z',
                    teacher: '李恩强'
                }, {
                    title: '攻心是销售流程准备阶段',
                    type: '讲座',
                    openTime: '2016-10-27T02:51:43.000Z',
                    endTime: '2016-10-27T02:51:43.000Z',
                    teacher: '李恩强'
                }]
            }, {
                time: 'Fs99',
                title: '好老师，懂孩子',
                createtime: '2016-10-27T02:51:43.000Z',
                total: 5,
                openTime: '2016-10-27T02:51:43.000Z',
                endTime: '2016-10-27T02:51:43.000Z',
                childData: []
            }],
            gradeList: [{
                id: 1,
                name: '小学'
            }],
            subjectList: [{
                id: 1,
                name: '英语'
            }],
            dirty: false,
            loadingInstance: null,
            isdelete: false,
            deleteData: null
        }
    },
    computed: {
        ...mapState({
            offline_curriculum_detail1: state => state.offline_curriculum.offline_curriculum_detail
        }),
        dataHeader() {
            return [{
                prop: 'name',
                label: '学期名称'
            }, {
                prop: '',
                label: '开课日期范围',
                width: 200,
                mixColumn: true,
                mixFunc: (function(data) {
                    var open_date = doTimeFormat(data.start_time);
                    var end_date = doTimeFormat(data.end_time);
                    return open_date + '至' + end_date;
                })
            }, {
                prop: 'curriculum_count',
                label: '课程数量',
                width: 100
            }, {
                prop: 'create_time',
                label: '创建时间',
                width: 150
            }, {
                label: '操作',
                width: 550,
                groupBtn: [{
                    text: '编辑学期',
                    param: 'edit'
                }, {
                    text: '回执管理',
                    param: 'manageSignup'
                },{
                //   text: '发送线下课',
                //   param: 'sendOfflineCourse',
                // hoverShow: true
                    isSwitch:true,
                    switchKey:'is_valid',
                    onText:'启用',
                    offText:'停用',
                    actionName:'change_offline_term_valid'
                }, {
                    text: '发送学期',
                    param: 'sendOfflineCourse',
                },{
                    text: '添加课程',
                    param: 'add',
                    // hoverShow: true
                }, {
                    text: 'el-icon-delete',
                    param: 'delete',
                    // hoverShow: true,
                    isIcon: true
                }]
            }, {
                listExpand: true,
                width: 90,
                childHeader: [{
                    prop: 'title',
                    label: '课程名称',
                }, {
                    prop: 'type',
                    label: '类型',
                    width: 100
                }, {
                    prop: '',
                    label: '开课日期范围',
                    width: 300,
                    mixColumn: true,
                    mixFunc: (function(data) {
                        var open_date = doDateFormat(data.start_time);
                        var end_date = doDateFormat(data.end_time);
                        return open_date + '至' + end_date;
                    })
                }, {
                    prop: 'teacher_name',
                    label: '导师',
                    width: 100
                }, {
                    label: '操作',
                    width:350,
                    groupBtn: [{
                        text: '编辑课程',
                        param: 'editCourse'
                    }, {
                        text: 'el-icon-delete',
                        param: 'deleteCourse',
                        hoverShow: true,
                        isIcon: true
                    }]
                }],
                listColumnFormatter: [{
                    columnName: 'type',
                    doFormat: doOfflineCurriculumTypeFormat
                }]
            }]
        },
        listColumnFormatter() {
            return [{
                columnName: 'create_time',
                doFormat: doTimeFormat
            }, {
                columnName: 'grade',
                dataIndex: 0,
                dataProp: 'id',
                dataValue: 'name'
            }, {
                columnName: 'subject',
                dataIndex: 1,
                dataProp: 'id',
                dataValue: 'name'
            }]
        },
        listColumnFormatterData() {
            return [this.gradeList, this.subjectList];
        },
        dataList() {
            return this.$store.state.offline_curriculum.offline_term_list;
        },
        isLoadingCurriculum() {
            return this.$store.state.offline_curriculum.showLoading;
        }
    },
    watch: {
        isLoadingCurriculum(val) {
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
            'delete_offline_curriculum',
            'delete_offline_term',
            'get_offline_curriculum_detail',
            'get_grade_list'
        ]),
        sendOfflineCourseHandler(index, row){
          this.handleSelModal(types.SEND_OFFLINE_COURSE, {row: row});
        },
        handleShowDialog() {
            this.handleSelModal(types.ADD_QUESTION);
        },
        reRenderListHandler(v) {
            if (this.$store.state.project.project_list.length > 0) {
                this.$store.dispatch('get_offline_term_list', {
                    project_id: v,
                    last_count: 0
                });
            }
        },
        editChapterHandler(index) {
            this.$router.push({
                name: 'online-course-chapter',
                params: {
                    id: '1'
                }
            })
        },
        editCourseHandler(param, index, row) {

        },
        editOfflineSemester(index, row) {
            this.handleSelModal(types.ADD_OFFLINE_SEMESTER, {
                type: 2,
                row
            })
        },
        addOfflineSemesterHandler() {
            this.handleSelModal(types.ADD_OFFLINE_SEMESTER, {
                type: 1
            })
        },
        moveUpHandler(index) {
            this.dirty = true;
        },
        moveDownHandler(index) {
            this.dirty = true;
        },
        deleteCourseHandler(index, data) {
            // console.log(row);

        },
        deleteOfflineSemester(index, row) {
            var vm = this;
            if (row.can_delete == 0) {
                this.$confirm('无法删除该学期!', '提示', {
                    type: 'info'
                }).catch(() => {});
            } else {
                this.$confirm('您删除该学期?', '提示', {
                    type: 'info'
                }).then(() => {
                    vm.delete_offline_term({
                        index,
                        row
                    });
                }).catch(() => {});
            }
        },
        addOfflineCourse(index, row) {
            this.handleSelModal(types.ADD_OFFLINE_COURSE, {
                type: 1,
                row
            })
        },
        saveOrderHandler() {

        },
        childBtnClickHandler(param, index, row) {
            var vm = this;
            if (param == 'deleteCourse') {
                this.$confirm('确定要删除该课程吗!', '提示', {
                    type: 'info'
                }).then(() => {
                  vm.delete_offline_curriculum({
                      index,
                      row
                  });
                }).catch(() => {});
            } else {
                this.get_offline_curriculum_detail({
                    index,
                    row,
                    callback() {
                        vm.handleSelModal(types.ADD_OFFLINE_COURSE, {
                            type: 2,
                            row,
                            index,
                            data: vm.offline_curriculum_detail1
                        });
                    }
                });
            }

        },
        rowExpandHandler(row) {
            if (row.childData.length === 0)
                this.$store.dispatch('get_offline_curriculum_list', {
                    offline_term_id: row.id
                })
        },
        manageSignupHandler(index, row) {
            this.$router.push({
                name: 'offline-course-manage-signup',
                params: {
                    id: row.id
                }
            })
        }
    },
    mounted() {
        var vm = this;
        if (this.$store.state.project.project_list.length === 0) {
            this.$store.dispatch('get_project_list', {
                callback(v) {
                    if (vm.dataList.length === 0) {
                        vm.$store.dispatch('get_offline_term_list', {
                            project_id: v,
                            last_count: 0
                        });
                        // vm.$store.dispatch('save_static_offline_project_id', v);
                    }
                }
            });
            // return;
        } else {
            this.$store.dispatch('get_offline_term_list', {
                project_id: this.$store.state.project.select_project_id,
                last_count: 0
            });
        }
        // debugger;
        // if (this.$store.state.project.offline_project_id != this.$store.state.project.select_project_id) {
        // this.$store.dispatch('get_offline_term_list', {
        //     project_id: this.$store.state.project.select_project_id,
        //     last_count: 0
        // });
        // }
        if(this.$store.state.grade.grade_list.length == 0){
          this.$store.dispatch('get_grade_list');
        }
        if(this.$store.state.subject.subject_list.length == 0){
          this.$store.dispatch('get_subject_list');
        }

    },
    components: {
        'header-component': Header,
        'data-list': BaseList,
        'save-order': SaveOrder
    }
}
</script>
<style lang='scss'>
.manage-offline-course {
    .data-list {
        .base-list-row {
            .handle-component {
                margin-right: 20px;
                &:last-child {
                    margin-left: 30px;
                }
            }
        }

        thead {
            tr {
                height: 60px;
            }
        }

        .base-list-row {
            height: 60px;
        }

        .el-table__expanded-cell {
            padding: 0;
            height: auto;
            .base-list-container {
                thead {
                    tr {
                        height: 40px;
                        th {
                            background-color: #FBFBFB;
                            .cell {
                                background-color: #FBFBFB;
                            }
                        }
                    }
                }
            }
            .base-list-row {
                height: 40px;
            }
        }
    }
}
</style>
