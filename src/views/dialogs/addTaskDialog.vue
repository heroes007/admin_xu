<template>
<el-dialog :title="payload.selectedType == 0 ? payload.type == 1 ? '创建任务' : '编辑任务' : payload.type == 1 ? '创建作业' : '编辑作业'" :show-close="false" v-model="addTaskDialog" @close="handleRemoveModal(remove)" size="auto" :closeOnClickModal="false">
    <base-input @closedialog="handleClose">
        <el-row slot="body">
            <el-row class="body-top">
                <el-form ref="form" :rules="rules" :model="form" label-width="121px" class="add-task-form">
                    <el-form-item v-show="nextStep == 0" :label="typeStr('','名称')" prop="name" required>
                        <el-input v-model="form.name" :placeholder="typeStr('请输入','名称')"></el-input>
                    </el-form-item>
                    <el-form-item v-show="nextStep == 0" :label="typeStr('','持续时间')" prop="duration" required>
                        <el-input-number placeholder="持续时间（天）" v-model="form.duration" :min='0'></el-input-number>
                    </el-form-item>
                    <el-form-item v-show="nextStep == 0" label="选择学科" prop="subject_id" required>
                        <el-select v-model="form.subject_id" placeholder="请选择学科" :disabled='payload.type == 2' @change="handleChangeType1">
                            <el-option v-for="item in subjectList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item v-show="nextStep == 0" label="选择学段" prop="grade_id" required>
                        <el-select v-model="form.grade_id" placeholder="请选择学段" :disabled="disabled" @change="handleChangeType1">
                            <el-option v-for="item in gradeList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item v-show="nextStep == 0" class="approval" label="批阅形式" prop="result_type" required>
                        <el-radio-group v-model="form.result_type" :disabled="disabled">
                            <el-radio :label="1">常规批阅</el-radio>
                            <el-radio :label="2">内置打分批阅</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item v-show="nextStep == 0" :disabled="disabled" class="approval" v-if="payload.selectedType == 0" label="激活方式">
                        <el-radio-group v-model="form.activity_type" :disabled="disabled" @change="handleChangeType">
                            <el-radio :label="1">手动激活</el-radio>
                            <el-radio :label="2">定时激活</el-radio>
                            <!--<el-radio :label="3">前置课激活</el-radio>-->
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item v-show="payload.selectedType == 1 && nextStep == 0" v-if="payload.selectedType == 1" label="前置课">
                        <el-select v-model="form.activity_param" placeholder="请选择" :disabled="disabled1">
                            <el-option v-for="item in preCurriculum" :key="item.id" :label="item.title" :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item :class="{'inter-data': form.activity_type == 2}" v-show="payload.selectedType == 0 && nextStep == 0" v-if="!(form.activity_type == 1)" :disabled="disabled" :label="form.activity_type == 2 ? '学员入学后:' : form.activity_type == 3 ? '前置课': ''" prop="activity_param" required>
                        <el-input v-if="form.activity_type == 2" v-model="form.activity_param" :disabled="disabled" placeholder="请输入天数"></el-input>
                        <el-select v-if="form.activity_type == 3" v-model="form.activity_param" placeholder="请选择" :disabled="disabled">
                            <el-option v-for="item in preCurriculum" :key="item.id" :label="item.title" :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item v-show="nextStep == 1" :label="typeStr('','内容')" prop="task_require">
                        <!--<el-input type="textarea" :rows="6" :placeholder="typeStr('请填写','内容')" v-model="form.task_require">
                        </el-input>-->
                        <text-editor ref='require_editor' :content='form.task_require'/>
                    </el-form-item>
                    <el-form-item class="check-upload" v-show="nextStep == 1">
                        <el-checkbox-group v-model="form.limit_count" >
                            <el-checkbox :label="typeStr('要求学员上传','附件')" :disabled="disabled" name="type" value="true"></el-checkbox>
                        </el-checkbox-group>
                    </el-form-item>
                    <el-form-item v-show="nextStep == 1" label="上传附件" class="upload-form1">
                        <upload-panel ref="upload_panel" :upload-config="uploadConfig" @getuploadfile="handleGetUrl">
                            <!--<span slot="file-require">只能上传 MP4/MOV/AVI 文件，且不超过2M</span>-->
                        </upload-panel>
                        <!-- <el-input type="file" :change="getMyForm.teacher_img_url"></el-input> -->
                        <el-row class="upload-file-list">
                            <el-row class="file-item" v-for="(item,index) in form.upload_files" :key="item.id">
                                <span class="filename">{{item.name}}</span>
                                <span class="el-icon-delete" @click="handleDeleteUploadItem(index)"></span>
                                <span class="datetime">{{ item. datetime | zonetime }}</span>
                            </el-row>
                        </el-row>
                    </el-form-item>
                    <el-form-item class="btns">
                        <el-button type='text' v-show='nextStep == 1' class='btn-pre' @click='handlePreStep'>上一步</el-button>
                        <el-button v-show="nextStep == 1" class="btn-orange" @click="handleSubmit('form')">提交</el-button>
                        <el-button v-show="nextStep == 0" class="btn-orange" @click="handleNextStep('form')">下一步</el-button>
                    </el-form-item>
                </el-form>
            </el-row>
            <!-- <el-form ref="form" :rules="rules" :inline="true" :model="form" label-width="80px" class="add-homework-form">
                <el-form-item prop="name" required>
                    <el-input placeholder="作业名称" v-model="form.name"></el-input>
                </el-form-item>
                <el-form-item prop="subject_id" required>
                    <el-select v-model="form.subject_id" placeholder="请选择学科" :disabled='payload.type == 2'>
                        <el-option v-for="item in subjectList" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="grade_id" required>
                    <el-select v-model="form.grade_id" placeholder="请选择学段" :disabled='payload.type == 2'>
                        <el-option v-for="item in gradeList" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="批阅形式" prop="result_type" required>
                    <el-radio-group v-model="form.result_type">
                        <el-radio :label="1">常规批阅</el-radio>
                        <el-radio :label="2">内置打分批阅</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="激活方式">
                    <el-radio-group v-model="form.activity_type" :disabled="disabled" @change="handleChangeType">
                        <el-radio :label="1">手动激活</el-radio>
                        <el-radio :label="2">定时激活</el-radio>
                        <el-radio :label="3">前置课激活</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item v-if="!(form.activity_type == 1)" :disabled="disabled" :label="form.activity_type == 2 ? '学员入学后:' : ''" prop="activity_param" required>
                    <el-input v-if="form.activity_type == 2" v-model="form.activity_param" placeholder="请输入天数"></el-input>
                    <el-select v-if="form.activity_type == 3" v-model="form.activity_param" multiple placeholder="请选择">
                        <el-option v-for="item in preCurriculum" :label="item.title" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="task_require" required>
                    <el-input type="textarea" v-model="form.task_require"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-checkbox-group v-model="form.max_file_count">
                        <el-checkbox label="要求学员上传作业附件" name="type" value=""></el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item>
                    <el-row>
                        <el-col>
                            <upload-button :bucket="upload.bucket" :dir="upload.dir" :host="upload.host" @uploadcomplete="handleGetUrl"></upload-button>
                        </el-col>
                        <el-col>
                            <el-row v-for="(item,index) in form.upload_files">
                                <span>{{item.name}}</span>
                                <span @click="handleDeleteUploadItem(index)">删除</span>
                            </el-row>
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item>
                    <el-button @click="handleSubmit('form')">提交</el-button>
                </el-form-item>
            </el-form> -->
        </el-row>
    </base-input>
</el-dialog>
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
                }]
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
        //   if(this.form.subject_id && this.form.grade_id){
        //     this.getPreCurriculumList();
        //     this.disabled1 = false;
        //   }
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
<style lang="scss">
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
    .el-dialog {
        width: 800px;
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
        .add-task-form {
            width: 80%;
            margin: 30px auto;
            .el-date-editor--datetimerange,
            .el-select {
                width: 100%;
            }
            input {
                border-radius: 0;
                border: 1px solid #CCCCCC;
            }
            .approval {
                .el-form-item__content {
                    text-align: left;
                    line-height: 38px;
                }
            }
            .el-input-number {
                width: 100%;
            }
            // -------- 修改了单选框样式 ------------

            .el-radio__inner {
                display: inline-block;
                position: relative;
                border: 1px solid #bfcbd9;
                border-radius: 4px;
                box-sizing: border-box;
                width: 18px;
                height: 18px;
                background-color: #fff;
                z-index: 1;
                transition: border-color 0.25s cubic-bezier(.71,-.46,.29,1.46),background-color 0.25s cubic-bezier(.71,-.46,.29,1.46);
                border-color: #979797;
                background-color: transparent;
                &::after {
                    box-sizing: content-box;
                    content: "";
                    border: 2px solid #fff;
                    border-left: 0;
                    border-top: 0;
                    height: 8px;
                    left: 5px;
                    position: absolute;
                    top: 1px;
                    transform: rotate(45deg) scaleY(0);
                    width: 4px;
                    transition: transform 0.15s cubic-bezier(.71,-.46,.88,.6) 0.05s;
                    transform-origin: center;
                    border-radius: 0;
                    background-color: transparent;
                }
            }
            .is-checked {

                .el-radio__label {
                    border: 1px solid #5FA137;
                    color: #5FA137;
                }

                .el-radio__inner {
                    border-color: #5FA137;
                    background-color: #5FA137;
                }
                .el-checkbox__inner {
                    border-color: #5FA137;
                    background-color: #5FA137;
                }
                .el-radio__inner::after {
                    transform: rotate(45deg) scaleY(1);
                }
            }
            // -------- 修改了单选框样式 ------------
            @mixin el-upload-common($w) {
                .el-upload {
                    text-align: left;
                    width: 100%;
                    .el-icon-upload {
                        color: #999999;
                    }
                    .el-upload__tip {
                        font-size: 12px;
                        color: #757575;
                        letter-spacing: 0;
                        line-height: 20px;
                        text-align: left;
                        margin-top: 0;
                    }
                    .el-dragger {
                        // float: left;
                        // width: 240px;
                        border-radius: 0;
                        background-color: #F6F6F6;
                        border: 1px solid #CCCCCC;
                        width: 100%;
                        height: $w;
                        .el-icon-upload {
                            margin-left: 0;
                            // margin-top: $_top;
                        }
                        .el-dragger__text {
                            font-size: 14px;
                            color: #757575;
                            letter-spacing: 0;
                            line-height: 14px;
                            margin-top: 20px;
                        }
                    }
                }
            }
            .upload-form1 {
                @include el-upload-common(200px);
            }
            .check-upload {
                text-align: left;
            }
            .inter-data {
                .el-form-item__label {
                    width: 100px !important;
                }
                .el-form-item__content {
                    margin-left: 102px !important;
                }
            }
            .upload-file-list {
                text-align: left;
                width: 40%;
                .datetime{
                  position: absolute;
                  right: -170px;
                  top: 16px;
                }
                .file-item {
                    cursor: pointer;
                    // padding-top: 6px;
                    // padding-bottom: 6px;
                    // margin-top: 15px;
                    // margin-bottom: 15px;
                    position: relative;

                    &:hover {
                        color: #FB843E;
                    }
                    .filename{
                      width: 150px;
                      overflow: hidden;
                      height: 30px;
                      line-height: 30px;
                      text-overflow: ellipsis;
                      white-space: nowrap;
                      display: inline-block;
                    }
                    .el-icon-delete {
                        position: absolute;
                        right: -20px;
                        top: 10px;
                    }
                }

            }
            .btns {
                margin-top: 50px;
                .el-form-item__content {
                    margin-left: 0 !important;
                    margin-top: 10px !important;
                    line-height: 0;
                    .finish-btn {
                        margin-left: 0;
                        margin-top: 20px;
                        background: #FB843E;
                        border-radius: 4px;
                        width: 160px;
                        height: 36px;
                        border: 0;
                        &:last-child {
                            margin-left: 8px;
                        }
                    }
                    // button {
                    //     width: 100px;
                    //     height: 36px;
                    //     background: #FFFFFF;
                    //     border: 1px solid #999999;
                    //     border-radius: 4px;
                    // }
                }

                .btn-pre {
                    float: left;
                    color:#333333;
                }

                .btn-orange {
                    background: #FB843E;
                    border: 1px solid #F06B1D;
                    border-radius: 4px;
                    color: #fff;
                    width: 200px;
                    height: 36px;
                }
            }
            .el-form-item__content {
                // margin-left: 0 !important;
                line-height: 0;
                .el-textarea {
                    .el-textarea__inner {
                        background: #FFFFFF;
                        border: 1px solid #CCCCCC;
                        // height: 140px;
                        border-radius: 0;
                        // width: 390px;
                    }
                }
                .editor {
                    .vueditor {
                        line-height:100%;
                    }
                }  
            }
        }
    }
}
</style>
