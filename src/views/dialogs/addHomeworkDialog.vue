<template>
<el-dialog :title="payload.type == 1 ? '创建任务' : '编辑任务'" :show-close="false" v-model="addHomeworkDialog" @close="handleRemoveModal(remove)" size="auto" :closeOnClickModal="false">
    <base-input @closedialog="handleClose">
        <Row slot="body">
            <Form ref="form" :rules="rules" :inline="true" :model="form" label-width="80px" class="add-homework-form">
                <FormItem prop="name" required>
                    <Input placeholder="任务名称" v-model="form.name"></Input>
               </FormItem>
                <FormItem prop="duration" required>
                    <el-input-number placeholder="持续时间（天）" v-model="form.duration" :min='0'></el-input-number>
               </FormItem>
                <FormItem prop="subject_id" required>
                    <Select v-model="form.subject_id" placeholder="请选择学科">
                        <Option v-for="item in subjectList" :key="item.id" :label="item.name" :value="item.id"></Option>
                    </Select>
               </FormItem>
                <FormItem prop="grade_id" required>
                    <Select v-model="form.grade_id" placeholder="请选择学段">
                        <Option v-for="item in gradeList" :key="item.id" :label="item.name" :value="item.id"></Option>
                    </Select>
               </FormItem>
                <FormItem label="批阅形式" prop="result_type" required>
                    <el-radio-group v-model="form.result_type">
                        <el-radio :label="1">常规批阅</el-radio>
                        <el-radio :label="2">内置打分批阅</el-radio>
                    </el-radio-group>
               </FormItem>
                <FormItem prop="activity_param" required>
                    <Select v-model="form.activity_param" multiple placeholder="请选择">
                        <Option v-for="item in onlineCurrriculumList" :key="item.id" :label="item.title" :value="item.curriculum_id"></Option>
                    </Select>
               </FormItem>
                <FormItem prop="task_require" required>
                    <Input type="textarea" v-model="form.task_require"></Input>
               </FormItem>
                <FormItem>
                    <el-checkbox-group v-model="form.max_file_count">
                        <el-checkbox label="要求学员上传作业附件" name="type" value=""></el-checkbox>
                    </el-checkbox-group>
               </FormItem>
                <FormItem prop="upload_files" required>
                    <Row>
                        <Col>
                            <upload-button @uploadcomplete="handleGetUrl"></upload-button>
                        </Col>
                        <Col>
                            <Row v-for="item in form.upload_files" :key="item.id">
                              <!-- {{item.name}}.{{item.url}} -->
                            </Row>
                        </Col>
                    </Row>
               </FormItem>
                <FormItem>
                    <Button @click="handleSubmit('form')">提交</Button>
               </FormItem>
            </Form>
        </Row>
    </base-input>
</el-dialog>
</template>
<!-- task_id = 19 -->
<script>
import BaseInput from '../../components/BaseInput'
import UploadButton from '../../components/UploadButton'
import {
    RemoveModal
} from './mixins'
import {
    mapActions,
    mapState
} from 'vuex';
import {
    get_task_by_id
} from '../../api/modules/tools_task'
import {
    MPop
} from '../../components/MessagePop'
export default {
    mixins: [RemoveModal,MPop],
    props: {
        remove: {
            type: String
        },
        payload: {}
    },
    data() {
        return {
            addHomeworkDialog: true,
            form: {
                name: '',
                duration:0,
                subject_id: '',
                grade_id: '',
                result_type: 1,
                activity_type: 1,
                activity_param: '',
                task_require: '',
                upload_files: [],
                max_file_count: 0
            },
            rules: {
                name: [{
                    required: true,
                    message: '请输入名称',
                    trigger: 'blur'
                }],
                duration: [{
                    required: true,
                    message: '请输入持续时间',
                    trigger: 'blur'
                }],
                subject_id: [{
                    type: 'number',
                    required: true,
                    message: '请选择时间范围',
                    trigger: 'change'
                }],
                grade_id: [{
                    type: 'number',
                    required: true,
                    message: '请选择讲师',
                    trigger: 'change'
                }],
                result_type: [{
                    type: 'number',
                    required: true,
                    message: '请选择课程类型',
                    trigger: 'change'
                }],
                // activity_type: [{
                //     required: true,
                //     message: '请输入讲师描述',
                //     trigger: 'change'
                // }],
                activity_param: [{
                    type: 'string',
                    required: true,
                    message: '请输入讲师描述',
                    trigger: 'blur'
                }],
                task_require: [{
                    required: false,
                    message: '请选择讲师照片',
                    trigger: 'blur'
                }],
                upload_files: [{
                    type: [],
                    required: false,
                    message: '请上传附件',
                    trigger: 'change'
                }]
            }
        }
    },
    mounted() {
        if (this.payload.type == 1) {
            this.get_subject_list();
            this.get_grade_list();
            if (this.$store.state.subject.subject_list.length == 0 || this.$store.state.grade.grade_list.length == 0) {
                this.get_online_curriculum_list({
                    project_id: 1
                });
            }
        } else {
            this.rules.subject_id[0].required = false;
            this.rules.grade_id[0].required = false;
            this.rules.upload_files[0].required = true;
            get_task_by_id(this.payload.row.id).then(res => {
                this.form.name = res.data.msg.name;
                this.form.duration = res.data.msg.duration;
                this.form.subject_id = res.data.msg.subject_id;
                this.form.grade_id = res.data.msg.grade_id;
                this.form.activity_type = res.data.msg.activity_type;
                this.form.activity_param = res.data.msg.activity_param;
                this.form.task_require = res.data.msg.task_require;
                this.form.upload_files = res.data.msg.upload_files;
            })
        }
    },
    computed: {
        ...mapState({
            subjectList: state => state.subject.subject_list,
            gradeList: state => state.grade.grade_list,
            onlineCurrriculumList: state => state.online_curriculum.online_curriculum_list
        })
    },
    methods: {
        ...mapActions([
            'get_subject_list',
            'get_grade_list',
            'get_online_curriculum_list',
            'add_task',
            'edit_task'
        ]),
        handleClose() {
            this.addHomeworkDialog = false;
        },
        handleGetUrl(name, url){
          var file = {
            name: name,
            ulr: ulr
          };

          this.form.upload_files.push(file);
        },
        handleChangeType(v) {
            if (v == 2) {
                this.form.activity_param = '';
                this.rules.activity_param[0].type = 'string';
                this.rules.activity_param[0].message = '请输入天数';
                this.rules.activity_param[0].trigger = 'blur';
            } else if (v == 3) {
                this.form.activity_param = [];
                this.rules.activity_param[0].type = 'array';
                this.rules.activity_param[0].message = '请选择前置课程';
                this.rules.activity_param[0].trigger = 'change';
            }
        },
        handleSubmit(formName) {
            if (this.payload.type == 1) {
                this.$refs[formName].validate(val => {
                    if (val) {
                        this.add_task({
                            category_id: 2,
                            name: this.form.name,
                            duration: this.form.duration,
                            grade_id: this.form.grade_id,
                            subject_id: this.form.subject_id,
                            type: 1,
                            result_type: this.form.result_type,
                            activity_type: this.form.activity_type,
                            activity_param: this.form.activity_param,
                            task_require: this.form.task_require,
                            upload_files: this.form.upload_files,
                            max_file_count: this.form.upload_files.length
                        });
                    } else {
                        return false;
                    }
                });
            } else {
              this.$refs[formName].validate(val => {
                  if (val) {
                      this.edit_task({
                          task_id: this.payload.row.id,
                          name: this.form.name,
                          duration: this.form.duration,
                          result_type: this.form.result_type,
                          task_require: this.form.task_require,
                          upload_files: this.form.upload_files
                      });
                  } else {
                      return false;
                  }
              });
            }
        }
    },
    components: {
        'base-input': BaseInput,
        'upload-button': UploadButton
    },
}
</script>
<style lang="scss">
#add-homework-container {
    @import "base.scss";
    input,
    textarea {
        resize: none;
        outline: none;
    }
    .close-dialog-panel {
        position: absolute;
        top: -40px;
        right: 13.5px;
        z-index: 99999;
        font-size: 30px;
        cursor: pointer;
        &:before {
            // color: #fff;
            color: #757575;
        }
    }
    .el-dialog {
        width: 700px;
        background: none;

        .body-top {
            padding-bottom: 10px;
        }
        .el-dialog__header {
            background: #333333;
            border-radius: 4px 4px 0 0;
            padding: 16px;
        }
        .el-dialog__body {
            padding: 0;
            background: #fff;
            border-radius: 0 0 4px 4px;
        }
    }
}
</style>
