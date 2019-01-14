<template>
    <div class='project-header'>
        <Row class='header-container' type='flex' justify='space-between' align='middle'>
            <div class='title'>
                <i class='el-icon-menu'></i>
                <el-select v-model="project_id" placeholder="请选择" disabled>
                    <el-option v-for="item in projects" :key="item.id" :label="item.name" :value="item.id">
                    </el-option>
                </el-select>
            </div>
            <div class='btn-group' v-if='type !== 0'>
                <Button class='btn-add' type='primary' icon="plus" v-if='type === 1 && showAdd' @click="addCourseHandler">
                    添加课程
                </Button>
                <Button class='btn-add' type='primary' icon="plus" v-if='type === 2 && showAdd' @click="addOfflineSemester">
                    添加学期
                </Button>
                <Button class='btn-add' type='primary' icon="plus" v-if='type === 3 && showAdd' @click="addTaskCategory">
                    添加分类
                </Button>
                <Button class='btn-edit' type='text' icon="setting" v-if='type === 3 && showAdd' @click="editTaskCategory">
                    {{ isEdit ? '编辑类型': '取消编辑'}}
                </Button>
                <el-popover ref="teacherList" placement="bottom-end" width="500" trigger="click" popper-class='teacher-list'>
                    <Row class='teacher-list-head'>
                        <div class='head'>
                            全部讲师
                        </div>
                        <Button type='text' icon='plus' @click='addTeacherHandler'>
                            添加
                        </Button>
                    </Row>
                    <div class='teacher-list-container'>
                        <Row v-for='r in teacherListData' :key="r.id" type='flex'>
                            <Col v-for='t in r' :key="t.id" :span='4'>
                                <teacher-head :tid='t.id' :img-url='t.img_url' :teacher-name='t.name' />
                            </Col>
                        </Row>
                    </div>
                </el-popover>

                <Button class='btn-teacher' type='text' v-popover:teacherList v-if='type === 1 || type === 2'><i class='icon-xg-icon-xy'></i>讲师设置</Button>
            </div>
            <div class='btn-group'  v-if='type === 0'>
                <Button class='btn-add' type='primary' icon="plus" v-if='showAdd' @click="addClickHandler">
                    {{addText}}
                </Button>
            </div>
        </Row>
    </div>
</template>

<script>
    import {
        doGroupSlice
    } from './Util'
    import TeacherItem from './TeacherItem'
    import {
        Dialog
    } from '../views/dialogs'
    import {
        ADD_TEACHER
    } from '../views/dialogs/types'
    import {
        Loading
    } from 'element-ui'
    export default {
        mixins: [Dialog],
        data() {
            return {
                loadingInstance: null,
                isEdit: true
            }
        },
        props: {
            type: {
                type: Number,
                default: 1
            },
            showAdd: {
                type: Boolean,
                default: false
            },
            addText:{
                type:String
            }
        },
        methods: {
            addClickHandler() {
                this.$emit('addClick');
            },
            addTeacherHandler() {
                this.handleSelModal(ADD_TEACHER);
            },
            addCourseHandler() {
                this.$emit('addCourse');
            },
            addOfflineSemester() {
                this.$emit('addOfflineSemester');
            },
            addTaskCategory() {
                this.$emit('addTaskCategory');
            },
            editTaskCategory() {
                if (this.isEdit) {
                    this.isEdit = false;
                    this.$emit('manageEdit', true)
                } else {
                    this.isEdit = true;
                    this.$emit('manageEdit', false)
                }
            }
        },
        computed: {
            project_id: {
                set(v) {
                    this.$emit('reRenderList', v)
                    this.$store.dispatch('change_selected_project_id', v)
                },
                get() {
                    return this.$store.state.project.select_project_id;
                }
            },
            projects() {
                return this.$store.state.project.project_list;
            },
            teachers() {
                return this.$store.state.teacher.teacher_list;
            },
            teacherListData() {
                return doGroupSlice(6, this.teachers);
            },
            isLoading() {
                return this.$store.state.teacher.showLoading;
            }
        },
        watch: {
            isLoading(val) {
                if (val) {
                    this.loadingInstance = Loading.service({
                        text:'加载中，请稍后',
                        fullscreen: true
                    });
                } else {
                    this.loadingInstance.close();
                    this.dirty = false;
                }
            }
        },
        components: {
            'teacher-head': TeacherItem
        },
        mounted() {
            if (this.teachers.length === 0) {
                this.$store.dispatch('get_teacher_list');
            }
        }
    }
</script>
<style lang='scss'>
    .teacher-list {
        border-radius: 4px;
        &.el-popover[x-placement^=bottom] {
            .popper__arrow {
                &:after {
                    border-bottom-color: #e5e5e5;
                }
            }
        }

        .teacher-list-head {
            background-color: #e5e5e5;
            height: 60px;
            position: relative;
            .head {
                line-height: 60px;
                font-size: 18px;
                color: #141111;
                letter-spacing: 0;
                text-align: center;
            }
            .el-button {
                position: absolute;
                font-size: 14px;
                top: 12px;
                right: 11px;
                color: #F06B1D;
                letter-spacing: 0;
            }
        }
        .teacher-list-container {
            padding: 30px 0;
        }
    }

    .project-header {
        height: 60px;
        background-color: #333333;
        .header-container {
            height: 100%;
            padding: 0 25px;
            .title {
                color: #ffffff;

                i {
                    color: #ffffff;
                }

                input {
                    border: 0;
                    border-radius: 0;
                    background-color: #333333;
                    color: #ffffff;
                }
            }
            .btn-group {
                .el-button {
                    margin-right: 30px;
                    font-size: 14px;
                }

                .btn-add {
                    background-color: #F06B1D;

                    border-color: #F06B1D;
                }
                .btn-edit {
                    color: #fff;
                }
                .btn-teacher {
                    color: #ffffff;

                    i {
                        margin-right: 5px;
                    }
                }
            }
        }
    }
</style>