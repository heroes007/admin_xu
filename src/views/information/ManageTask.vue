<template>
    <div class='manage-task'>
        <header-component :type='3' :showAdd='true' @addTaskCategory='addTaskCategory' @reRenderList="reRenderListHandler" @manageEdit="manageEdit" />
        <div class="category-list">
            <category-item v-for='item in categoryList' :key="item.id" :showClose="showClose" :name='item.name' :cid='item.id' :type='item.type'
                :selected='getSelected(item.id, item.type)' @select='changeCategory(item)' />
        </div>
        <div class="create-panel">
            <!-- <Button @click="handleSelModal(types.ADD_HOMEWORK, {type: 1})">创建</Button> -->
            <!-- <Button @click="handleSelModal(types.MANUL_ACTIVE)">手动激活</Button> -->
            <Button @click="addTask()">创建</Button>
            <!-- <Button @click="handleSelModal(types.ADD_TASK,{type: 2})">编辑任务</Button> -->
        </div>
        <data-list @edit='editHandler' @delete='deleteHandler' @doActive='doActiveHandler' class='data-list light-header' :table-data='dataList'
            :header-data='dataHeader' :column-formatter='listColumnFormatter' :column-formatter-data='listColumnFormatterData'></data-list>
            <div class='manage-online-course'>
                <!-- <header-component @addCourse='addCourseHandler'/> -->
                <!-- <Button @click="handleSelModal(types.ADD_HOMEWORK, {type: 1})">创建作业</Button> -->
                <!-- <Button @click="handleSelModal(types.MANUL_ACTIVE)">手动激活</Button> -->
                <!-- <Button @click="handleSelModal(types.ADD_TASK, {type: 1})">创建任务</Button> -->
                <!-- <Button @click="handleSelModal(types.ADD_TASK,{type: 2})">编辑任务</Button> -->
            </div>
    </div>
</template>

<script>
    import Header from '../../components/ProjectHeader'
    import TaskCategoryItem from '../../components/TaskCategoryItem.vue'
    import BaseList from '../../components/BaseList'
    import {
        Dialog
    } from '../dialogs'
    import {
        ADD_TASK_CATEGORY,
        ADD_TASK,
        NOTIFICATION,
        MANUL_ACTIVE
    } from '../dialogs/types'
    import {
        Loading
    } from 'element-ui'
    import {
        doTimeFormat
    } from '../../components/Util'
    import {
        mapActions
    } from 'vuex'
    import {
        Config
    } from '../../config/base'
    export default {
        mixins: [Dialog],
        data() {
            return {
                data: [{
                    id: '01',
                    title: '老师也要学点管理学',
                    createtime: '2016-10-27T02:51:43.000Z',
                    grade: 1,
                    subject: 1
                }, {
                    id: '02',
                    title: '好老师，懂孩子',
                    createtime: '2016-10-27T02:51:43.000Z',
                    grade: 1,
                    subject: 1
                }],
                dirty: false,
                loadingInstance: null,
                selectCategory: -1,
                selectedType: 0,
                isInited: false,
                showClose: false
            }
        },
        computed: {
            isLoading() {
                return this.$store.state.task.showLoading;
            },
            categoryList() {
                return this.$store.state.task.task_category_list;
            },
            dataHeader() {
                if (!this.selectedCategory || this.selectedCategory.type === 0) {
                    return [{
                        prop: 'name',
                        label: '名称'
                    }, {
                        prop: 'create_time',
                        label: '创建时间',
                        width: 120
                    }, {
                        prop: 'grade_id',
                        label: '学段',
                        width: 80
                    }, {
                        prop: 'subject_id',
                        label: '学科',
                        width: 80
                    }, {
                        prop: 'activity_type',
                        label: '激活方式',
                        width: 100,
                        isBtn: true,
                        param: 'doActive'
                    }, {
                        label: '操作',
                        width: 250,
                        groupBtn: [{
                            text: '编辑',
                            param: 'edit'
                        }, {
                            text: 'el-icon-delete',
                            param: 'delete',
                            hoverShow: true,
                            isIcon: true
                        }]
                    }]
                } else {
                    return [{
                        prop: 'name',
                        label: '名称'
                    }, {
                        prop: 'create_time',
                        label: '创建时间',
                        width: 120
                    }, {
                        prop: 'grade_id',
                        label: '学段',
                        width: 80
                    }, {
                        prop: 'subject_id',
                        label: '学科',
                        width: 80
                    }, {
                        label: '操作',
                        width: 250,
                        groupBtn: [{
                            text: '编辑',
                            param: 'edit'
                        }, {
                            text: 'el-icon-delete',
                            param: 'delete',
                            hoverShow: true,
                            isIcon: true
                        }]
                    }]
                }
            },
            listColumnFormatter() {
                return [{
                    columnName: 'create_time',
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
                    columnName: 'activity_type',
                    dataIndex: 2,
                    dataProp: 'id',
                    dataValue: 'name'
                }]
            },
            listColumnFormatterData() {
                return [this.gradeList, this.subjectList, this.$store.state.task.activityTypeList];
            },
            dataList() {
                if (!this.selectedCategory)
                    return [];
                return this.selectedCategory.task_list;
            },
            selectedCategory() {
                for (var i = 0; i < this.categoryList.length; i++) {
                    if (this.categoryList[i].id === this.selectCategory) {
                        return this.categoryList[i];
                    }
                }
                return undefined;
            },
            subjectList() {
                return this.$store.state.subject.subject_list;
            },
            gradeList() {
                return this.$store.state.grade.grade_list;
            },
        },
        watch: {
            isLoading(val) {
                if (val) {
                    this.loadingInstance = Loading.service({
                        text:'加载中，请稍后',
                        fullscreen: true
                    });
                    setTimeout(() => {
                        this.loadingInstance.close();
                    }, Config.base_timeout);
                } else {
                    this.loadingInstance.close();
                    this.dirty = false;
                }
            },
            categoryList(val) {
                if (val.length !== 0) {
                    this.checkInit();
                }
            }
        },
        methods: {
            ...mapActions([
                'delete_task'
            ]),
            addTaskCategory() {
                this.handleSelModal(ADD_TASK_CATEGORY, {
                    orderby: this.categoryList.length + 1
                });
            },
            manageEdit(v) {
                this.showClose = v;
            },
            reRenderListHandler(v) {
                if (this.$store.state.project.project_list.length > 0) {
                    this.$store.dispatch('get_task_category_list', {
                        project_id: v
                    })
                    // if (this.categoryList.length > 0) {
                    this.$store.dispatch('get_task_list', {
                        task_category_id: this.selectCategory
                    });
                    // }
                }
            },
            getSelected(id, type) {
                if (this.selectCategory === id)
                    return true;
                return false;
            },
            checkInit() {
                if (!this.isInited) {
                    this.selectCategory = this.categoryList[0].id;
                    this.selectedType = this.categoryList[0].type;
                    this.$store.dispatch('get_task_list', {
                        task_category_id: this.selectCategory
                    });
                    this.isInited = true;
                }
            },
            editHandler(index, row) {
                this.handleSelModal(ADD_TASK, {
                    separage: this.selectedCategory,
                    type: 2,
                    index: index,
                    row: row,
                    selectedType: this.selectedType
                });
            },
            deleteHandler(index, row) {
                var vm = this;
              this.$Modal.confirm({
                title: '提示',
                content: '<p>您确定要删除该任务吗?</p>',
                onOk: () => {
                  this.delete_task({
                    task_category_id: this.selectCategory,
                    task_id: row.id,
                    is_del_ut: 1
                  })
                },
              });
            },
            addTask() {
                if (this.categoryList.length > 0) {
                    this.handleSelModal(ADD_TASK, {
                        separage: this.selectedCategory || this.categoryList[0].id,
                        type: 1,
                        selectedType: this.selectedType
                    })
                } else {
                  this.$Modal.info({
                    title: '提示',
                    content: '<p>请先添加分类！</p>'
                  });
                }
            },
            deleteCourseHandler(index, row) {

            },
            doActiveHandler(index, row) {
                if (row.activity_type == 1) {
                    this.handleSelModal(MANUL_ACTIVE, {
                        row: row
                    })
                }
            },
            changeCategory(item) {
                if (this.selectCategory !== item.id) {
                    this.selectCategory = item.id;
                    this.selectedType = item.type;
                    for (var i = 0; i < this.categoryList.length; i++) {
                        if (this.categoryList[i].id === this.selectCategory) {
                            if (this.categoryList[i].task_list.length === 0) {
                                this.$store.dispatch('get_task_list', {
                                    task_category_id: this.selectCategory
                                });
                            }
                            break;
                        }
                    }
                }
            }
        },
        mounted() {
            var vm = this;
            if (this.$store.state.project.project_list.length === 0) {
                this.$store.dispatch('get_project_list', {
                    callback(v) {
                        vm.$store.dispatch('get_task_category_list', {
                            project_id: v
                        })
                    }
                });
            } else {
                this.$store.dispatch('get_task_category_list', {
                    project_id: this.$store.state.project.select_project_id
                })
            }

            if (this.categoryList.length === 0) {
                // this.$store.dispatch('get_task_category_list', {
                //     project_id: this.$store.state.project.select_project_id
                // })
            } else {
                this.checkInit();
            }

            this.$store.dispatch('get_grade_list');
            this.$store.dispatch('get_subject_list');
        },
        components: {
            'header-component': Header,
            'data-list': BaseList,
            'category-item': TaskCategoryItem
        }
    }

</script>
<style lang='scss'>
    .manage-task {
        .category-list {
            padding-top: 20px;
            padding-bottom: 20px;
            background-color: #FBFBFB;
        }
        .create-panel {
            padding-top: 10px;
            padding-bottom: 10px;
            text-align: right;
            button {
                margin-right: 30px;
                background: #F06B1D;
                border-radius: 2px;
                padding: 3px 15px;
                font-size: 14px;
                color: #FFFFFF;
                letter-spacing: 0;
                border: none;
                outline: none;
                line-height: 20px;
            }
        }
    }

    .manage-task {
        .data-list {
            .base-list-row {
                .handle-component {
                    margin-right: 30px;
                    +.handle-component {
                        +.handle-component {
                            margin-right: 2px;
                        }
                    }
                    &:last-child {
                        margin-left: 50px;
                    }
                }
            }
        }
    }
</style>
