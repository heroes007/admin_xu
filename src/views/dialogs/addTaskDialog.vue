<template>
<Modal :transfer=false :title="payload.selectedType == 0 ? payload.type == 1 ? '创建任务' : '编辑任务' : payload.type == 1 ? '创建作业' : '编辑作业'" :footer-hide="true"
       v-model="addTaskDialog" @on-cancel="handleRemoveModal(remove)" size="auto" :mask-closable="false" :styles="{width: '800px'}">
    <base-input @closedialog="handleClose">
        <Row slot="body">
            <Row class="body-top">
                <Form ref="form" :rules="rules" :model="form" :label-width="121" class="add-task-form">
                    <FormItem v-show="nextStep == 0" :label="typeStr('','名称')" prop="name" required>
                        <Input v-model="form.name" :placeholder="typeStr('请输入','名称')"></Input>
                   </FormItem>
                    <FormItem v-show="nextStep == 0" :label="typeStr('','持续时间')" prop="duration" required>
                        <InputNumber placeholder="持续时间（天）" v-model="form.duration" :min='0'></InputNumber>
                   </FormItem>
                    <FormItem v-show="nextStep == 0" label="选择学科" prop="subject_id" required>
                        <Select v-model="form.subject_id" placeholder="请选择学科" :disabled='payload.type == 2' @on-change="handleChangeType1">
                            <Option v-for="item in subjectList" :key="item.id" :label="item.name" :value="item.id"></Option>
                        </Select>
                   </FormItem>
                    <FormItem v-show="nextStep == 0" label="选择学段" prop="grade_id" required>
                        <Select v-model="form.grade_id" placeholder="请选择学段" :disabled="disabled" @on-change="handleChangeType1">
                            <Option v-for="item in gradeList" :key="item.id" :label="item.name" :value="item.id"></Option>
                        </Select>
                   </FormItem>
                    <FormItem v-show="nextStep == 0" class="approval" label="批阅形式" prop="result_type" required>
                        <RadioGroup v-model="form.result_type" class="float_left" :disabled="disabled">
                            <Radio :label="1">常规批阅</Radio>
                            <Radio :label="2">内置打分批阅</Radio>
                        </RadioGroup>
                   </FormItem>
                    <FormItem v-show="nextStep == 0" :disabled="disabled" class="approval" v-if="payload.selectedType == 0" label="激活方式">
                        <RadioGroup v-model="form.activity_type" class="float_left" :disabled="disabled" @on-change="handleChangeType">
                            <Radio :label="1">手动激活</Radio>
                            <Radio :label="2">定时激活</Radio>
                            <!--<el-radio :label="3">前置课激活</el-radio>-->
                        </RadioGroup>
                   </FormItem>
                    <FormItem v-show="payload.selectedType == 1 && nextStep == 0" v-if="payload.selectedType == 1" label="前置课">
                        <Select v-model="form.activity_param" placeholder="请选择" :disabled="disabled1">
                            <Option v-for="item in preCurriculum" :key="item.id" :label="item.title" :value="item.id"></Option>
                        </Select>
                   </FormItem>
                    <FormItem :class="{'inter-data': form.activity_type == 2}" v-show="payload.selectedType == 0 && nextStep == 0" v-if="!(form.activity_type == 1)" :disabled="disabled" :label="form.activity_type == 2 ? '学员入学后:' : form.activity_type == 3 ? '前置课': ''" prop="activity_param" required>
                        <Input v-if="form.activity_type == 2" v-model="form.activity_param" :disabled="disabled" placeholder="请输入天数"></Input>
                        <Select v-if="form.activity_type == 3" v-model="form.activity_param" placeholder="请选择" :disabled="disabled">
                            <Option v-for="item in preCurriculum" :key="item.id" :label="item.title" :value="item.id"></Option>
                        </Select>
                   </FormItem>
                    <FormItem v-show="nextStep == 1" :label="typeStr('','内容')" prop="task_require">
                        <!--<Input type="textarea" :rows="6" :placeholder="typeStr('请填写','内容')" v-model="form.task_require">
                        </Input>-->
                        <text-editor ref='require_editor' :content='form.task_require'/>
                   </FormItem>
                    <FormItem class="check-upload" v-show="nextStep == 1">
                        <Checkbox class="float_left" v-model="form.limit_count" :disabled="disabled" name="type">{{typeStr('要求学员上传','附件')}}</Checkbox>
                   </FormItem>
                    <FormItem v-show="nextStep == 1" label="上传附件" class="upload-form1">
                        <upload-panel ref="upload_panel" :upload-config="uploadConfig" @getuploadfile="handleGetUrl">
                            <!--<span slot="file-require">只能上传 MP4/MOV/AVI 文件，且不超过2M</span>-->
                        </upload-panel>
                        <!-- <Input type="file" :change="getMyForm.teacher_img_url"></Input> -->
                        <Row class="upload-file-list">
                            <Row class="file-item" v-for="(item,index) in form.upload_files" :key="item.id">
                                <span class="filename">{{item.name}}</span>
                                <span class="el-icon-delete" @click="handleDeleteUploadItem(index)"></span>
                                <span class="datetime">{{ item.datetime | zonetime }}</span>
                            </Row>
                        </Row>
                   </FormItem>
                    <div style="text-align: center">
                        <Button type='text' v-show='nextStep == 1' class='btn-pre' @click='handlePreStep'>上一步</Button>
                        <Button v-show="nextStep == 1" class="btn-orange" type="primary" @click="handleSubmit('form')">提交</Button>
                        <Button v-show="nextStep == 0" class="btn-orange" type="primary" @click="handleNextStep('form')">下一步</Button>
                   </div>
                </Form>
            </Row>
        </Row>
    </base-input>
</Modal>
</template>
<!-- task_id = 19 -->
<script>
import BaseInput from '../../components/BaseInput'
import UploadPanel from '../../components/UploadPanel'
import Editor from '../../components/Editor'
import {
    RemoveModal
} from './mixins'
import {
    mapActions,
    mapState
} from 'vuex';
import {
    get_task_by_id,
    get_curriculumlist
} from '../../api/modules/tools_task'
import dateFormat from '../../config/dateFormat'
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
            addTaskDialog: true,
            preCurriculum: [],
            form: {
                name: '',
                duration:0,
                subject_id: 0,
                grade_id: 0,
                result_type: 1,
                activity_type: 1,
                activity_param: '',
                task_require: '',
                upload_files: [],
                max_file_count: 0,
                limit_count:false
            },
            uploadConfig: {
              bucket:'dscj-app',
              dir:'student_tasks',
              type: 0
            },
            disabled: false,
            disabled1: false,
            nextStep: 0,
            rules: {
                name: [{
                    required: true,
                    message: '请输入名称',
                    trigger: 'blur'
                }],
                duration: [{
                    type:'number',
                    required: true,
                    message: '请输入持续时间',
                    trigger: 'blur'
                }],
                subject_id: [{
                    type: 'number',
                    required: true,
                    message: '请选择学科',
                    trigger: 'change'
                }],
                grade_id: [{
                    type: 'number',
                    required: true,
                    message: '请选择学段',
                    trigger: 'change'
                }],
                result_type: [{
                    type: 'number',
                    required: true,
                    message: '请选择批阅形式',
                    trigger: 'change'
                }],
                // activity_type: [{
                //     required: true,
                //     message: '请输入讲师描述',
                //     trigger: 'change'
                // }],
                // activity_param: [{
                //     required: true,
                //     message: '请输入讲师描述',
                //     trigger: 'change'
                // }],
                activity_param:[{
                  message: '',
                  trigger: '',
                  type: ''
                }],
                task_require: [{
                    required: false,
                    message: '请填写描述信息',
                    trigger: 'blur'
                }],
                upload_files: [{
                    type: 'array',
                    required: false,
                    message: '请上传附件',
                    trigger: 'change'
                }],
            },
            isInited: false
        }
    },
    mounted() {
        if (this.payload.type == 1) {
            this.isInited = true;
            this.get_subject_list();
            this.get_grade_list();
            this.getPreCurriculumList();
        } else {
            this.rules.subject_id[0].required = false;
            this.rules.grade_id[0].required = false;
            this.rules.upload_files[0].required = true;
            this.disabled = true;
            this.disabled1 = true;
            get_task_by_id(this.payload.row.id).then(res => {
                this.form.name = res.data.msg.name;
                this.form.duration = res.data.msg.duration;
                this.form.subject_id = res.data.msg.subject_id;
                this.form.grade_id = res.data.msg.grade_id;
                this.form.activity_type = res.data.msg.activity_type;
                this.form.result_type = res.data.msg.result_type;
                this.form.activity_param = (res.data.msg.activity_param && JSON.parse(res.data.msg.activity_param) instanceof Array) ? JSON.parse(res.data.msg.activity_param) : parseInt(res.data.msg.activity_param);
                // this.form.activity_param = parseInt(res.data.msg.activity_param);
                this.form.task_require = res.data.msg.task_require;
                if(res.data.msg.max_file_count === 3)
                {
                    this.form.limit_count = true;
                }
                else
                {
                    this.form.limit_count = false;
                }
                if (res.data.msg.upload_files) {
                    this.form.upload_files = JSON.parse(res.data.msg.upload_files);
                } else {
                    this.form.upload_files = "";
                }
                this.isInited = true;
                this.getPreCurriculumList();
            })
        }
    },
    computed: {
        ...mapState({
            subjectList: state => state.subject.subject_list,
            gradeList: state => state.grade.grade_list,
            onlineCurrriculumList: state => state.online_curriculum.online_curriculum_list
        }),
        selectSubject() {
            return this.form.subject_id;
        },
        selectGrade() {
            return this.form.grade_id;
        }
    },
    watch: {
        selectSubject(val) {
            this.getPreCurriculumList();
        },
        selectGrade(val) {
            this.getPreCurriculumList();
        }
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
            this.form.task_require = '';
            this.addTaskDialog = false;
        },
        handleGetUrl(param) {
            param.datetime = dateFormat(new Date);
            this.form.upload_files.push(param)
        },
        handleDeleteUploadItem(idx) {
            this.form.upload_files.splice(idx, 1);
        },
        handleNextStep(formName) {
            this.$refs[formName].validate(val => {
              if(val){
                this.nextStep = 1;
              } else {
                return false;
              }
            })
        },
        handlePreStep() {
            this.nextStep = 0;
        },
        handleChangeType1(v){
         this.getPreCurriculumList();
            this.disabled1 = false;
        },
        handleChangeType(v) {
            switch (v) {
                case 2:
                    this.rules.activity_param[0].type = 'string';
                    this.rules.activity_param[0].message = '请输入天数';
                    this.rules.activity_param[0].trigger = 'blur';
                    break;
                case 3:
                    this.getPreCurriculumList();
                    this.rules.activity_param[0].type = 'array';
                    this.rules.activity_param[0].message = '请选择前置课程';
                    this.rules.activity_param[0].trigger = 'change';
                    break;
                default:
            }
        },
        handleSubmit(formName) {
            var vm = this;
            if(this.form.limit_count)
            {
                this.form.max_file_count = 3;
            }
            else
            {
                this.form.max_file_count = 0;
            }
            var task_require = this.$refs.require_editor.editor.getContent();
            if (this.payload.type == 1) {
                this.$refs[formName].validate(val => {
                    if (val) {
                        this.add_task({
                            task_category_id: this.payload.separage.id,
                            name: this.form.name,
                            duration: this.form.duration,
                            grade_id: this.form.grade_id,
                            subject_id: this.form.subject_id,
                            type: this.payload.separage.type,
                            result_type: this.form.result_type,
                            activity_type: this.form.activity_type,
                            activity_param: (this.form.activity_param instanceof Array) ? JSON.stringify(this.form.activity_param) : this.form.activity_param,
                            // activity_param:this.form.activity_param,
                            task_require: task_require,
                            upload_files: JSON.stringify(this.form.upload_files),
                            max_file_count: this.form.max_file_count,
                            callback() {
                                vm.handleClose();
                                vm.showPop('创建成功！',1000);
                            }
                        });
                    } else {
                        return false;
                    }
                });
            } else {
                this.$refs[formName].validate(val => {
                    if (val) {
                        this.edit_task({
                            task_category_id: this.payload.separage.id,
                            task_id: this.payload.row.id,
                            name: this.form.name,
                            duration: this.form.duration,
                            result_type: this.form.result_type,
                            task_require: task_require,
                            upload_files: JSON.stringify(this.form.upload_files),
                            callback() {
                                vm.handleClose();
                                vm.showPop('修改成功！',1000);
                            }
                        });
                    } else {
                        return false;
                    }
                });
            }
        },
        getPreCurriculumList() {
            if (this.isInited) {
                get_curriculumlist({
                    project_id: this.$store.state.project.select_project_id,
                    subject_id: this.form.subject_id,
                    grade_id: this.form.grade_id
                }).then(res => {
                    if (res.data.res_code === 1) {
                        this.preCurriculum = res.data.msg;
                    }
                })
            }
        },
        typeStr(a,b) {
            if(this.payload.selectedType == 0)
                return a + '任务' + b;
            return a + '作业' + b;
        }
    },
    components: {
        'base-input': BaseInput,
        'upload-panel': UploadPanel,
        'text-editor':Editor
    },
}
</script>
<style lang="scss" scoped>
    /deep/.ivu-modal-body{
      width: 80%;
      margin-left: 10%;
    }
    .btn-orange{
        width: 170px;
    }
    .float_left{
        float: left !important;
    }
    #add-task-container {
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
    }
</style>
