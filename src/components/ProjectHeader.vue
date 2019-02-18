<template>
    <div class='project-header'>
        <Row class='header-container' type='flex' justify='space-between' align='middle'>
            <div class='title'>
                <Icon class="md-menu" type="md-menu" />
                <Select v-model="project_id" placeholder="请选择" disabled>
                    <Option v-for="item in projects" :key="item.id" :label="item.name" :value="item.id"></Option>
                </Select>
            </div>
            <div class='btn-group' v-if='type !== 0'>
                <Button class='btn-add' type='primary' icon="md-add" v-if='type === 1 && showAdd' @click="addCourseHandler">
                    添加课程
                </Button>
                <Button class='btn-add' type='primary' icon="md-add" v-if='type === 2 && showAdd' @click="addOfflineSemester">
                    添加学期
                </Button>
                <Button class='btn-add' type='primary' icon="md-add" v-if='type === 3 && showAdd' @click="addTaskCategory">
                    添加分类
                </Button>
                <Button class='btn-edit' type='text' icon="setting" v-if='type === 3 && showAdd' @click="editTaskCategory">
                    {{ isEdit ? '编辑类型': '取消编辑'}}
                </Button>
                <Poptip ref="teacherList" placement="bottom-end" width="500" trigger="click" popper-class='teacher-list'>
                    <Row slot="title" class='teacher-list-head'>
                        <div class='head'>全部讲师</div>
                        <Button class="teacher-list-head-btn" type='text' icon='md-add' @click='addTeacherHandler'>
                           添加
                        </Button> 
                    </Row>
                    <div slot="content" class='teacher-list-container'>
                        <Row v-for='r in teacherListData' :key="r.id" type='flex'>
                            <Col v-for='t in r' :key="t.id" :span='4'>
                                <teacher-head :tid='t.id' :img-url='t.img_url' :teacher-name='t.name' />
                            </Col>
                        </Row>
                    </div>
                    <Button class='btn-teacher' type='text' v-if='type === 1 || type === 2'>讲师设置</Button>
                </Poptip>
            </div>
            <div class='btn-group'  v-if='type === 0'>
                <Button class='btn-add' type='primary' icon="md-add" v-if='showAdd' @click="addClickHandler">
                    {{addText}}
                </Button>
            </div>
        </Row>
    </div>
</template>
<script>
    import { doGroupSlice } from './Util'
    import TeacherItem from './TeacherItem'
    import { Dialog } from '../views/dialogs'
    import { ADD_TEACHER } from '../views/dialogs/types'
    export default {
        mixins: [Dialog],
        components: { 'teacher-head': TeacherItem },
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
                this.$config.IsLoading(val);
            }
        },
        mounted() {
            if (this.teachers.length === 0) this.$store.dispatch('get_teacher_list');
        }
    }
</script>
<style lang='scss' scoped>
    /deep/ .ivu-btn > .ivu-icon{
        line-height: normal;
    }
    .teacher-list-head{
        display: flex;
        text-align: center;
        justify-content: center;
    }
    .teacher-list-head-btn{
        position: absolute;
        right: 0;
        top: 50%;
        transform: translateY(-50%);
    }
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
                 display: inline-flex;
                 .md-menu{
                color: #ffffff;
                font-size: 24px;
                margin-right: 10px;
                line-height: 32px;
                }
                /deep/ .ivu-select-selection{
                    border: none;
                    background-color: #333333;
                    color: #ffffff;
                    font-weight: 600;
                    div{
                        span{
                        font-size: 14px !important;
                        }
                    }
                }
            }
            .btn-group {
                .btn-add {
                    background-color: #F06B1D;
                    border-color: #F06B1D;
                    padding: 6px 15px;
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
