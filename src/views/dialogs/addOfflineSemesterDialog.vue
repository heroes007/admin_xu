<template>
    <el-dialog v-model="addOfflineSemesterDialog" @close="handleRemoveModal(remove)" size="auto" :closeOnClickModal="false">
        <base-input :baseInputWidth="600" @closedialog="handleClose">
            <Row slot="body" class="top-nav">
                <el-tabs type="border-card">
                    <el-tab-pane :label="payload.type == 2 ? '编辑学期' : '添加学期'">
                        <el-form ref="myForm1" :rules="rules1" :model="form1" label-width="80px">
                            <el-form-item label="学期名称" prop="name1" required>
                                <el-input v-model="form1.name1" placeholder="请输入学期名称"></el-input>
                            </el-form-item>
                            <el-form-item label="学期阶段" prop="level1" required>
                                <el-select v-model="form1.level1" placeholder="请选择学期阶段">
                                    <el-option label="一阶" :value="0"></el-option>
                                    <el-option label="二阶" :value="1"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="开课日期" prop="stage1" required>
                                <el-date-picker v-model="form1.stage1" type="datetimerange" placeholder="请选择时间范围">
                                </el-date-picker>
                            </el-form-item>
                            <el-form-item label="截止报名日期">
                                <el-date-picker v-model="form1.signupDeadline" type="date" placeholder="选择日期" :picker-options="pickerOptions" @change='changeDeadlineHandler'>
                                </el-date-picker>
                            </el-form-item>
                                <el-form-item label="学期描述" class="semester-description" prop="description1" required>
                                    <el-input type="textarea" :rows="8" placeholder="请输入学期描述内容" v-model="form1.description1">
                                    </el-input>
                                </el-form-item>
                                <el-form-item class="btn-content">
                                    <el-button type="primary" class="sub-btn" @click="handleSubmit('myForm1')">保存</el-button>
                                </el-form-item>
                        </el-form>
                    </el-tab-pane>
                    <el-tab-pane label="复制学期" v-if="payload.type == 1">
                        <el-form ref="myForm2" :rules="rules2" :model="form2" label-width="80px">
                            <el-form-item label="选择学期" prop="semester" required>
                                <el-select v-model="form2.semester" placeholder="请选择学期" @change="handleSelectItem">
                                    <el-option v-for="(item,index) in offline_term_list1" :key="item.id" :label="item.name" :value="index"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="学期名称">
                                <el-input v-model="form2.name2" placeholder="请输入学期名称"></el-input>
                            </el-form-item>
                            <el-form-item label="学期阶段">
                                <el-select v-model="form2.level2" placeholder="请选择学期阶段">
                                    <el-option label="一阶" value="0"></el-option>
                                    <el-option label="二阶" value="1"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="开课日期">
                                <el-date-picker v-model="form2.stage2" type="datetimerange" placeholder="请选择时间范围">
                                </el-date-picker>
                            </el-form-item>
                            </el-date-picker>
                            </el-form-item>
                            <el-form-item label="学期描述" class="semester-description">
                                <el-input type="textarea" :rows="8" placeholder="请输入学期描述" v-model="form2.description2">
                                </el-input>
                            </el-form-item>
                            <el-form-item class="btn-content">
                                <el-button type="primary" class="sub-btn" @click="handleSave('myForm2')">保存</el-button>
                            </el-form-item>
                        </el-form>
                    </el-tab-pane>
                </el-tabs>
            </Row>
        </base-input>
    </el-dialog>
</template>

<script>
    import BaseInput from '../../components/BaseInput'
    import UploadButton from '../../components/UploadButton'
    import {
        RemoveModal
    } from './mixins'
    import UploadPanel from '../../components/UploadPanel'
    import {
        mapActions,
        mapState
    } from 'vuex'
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
        components: {
            'base-input': BaseInput,
            'upload-button': UploadButton,
            'upload-panel': UploadPanel
        },
        data() {
            return {
                addOfflineSemesterDialog: true,
                form1: {
                    name1: this.payload.row && this.payload.row.name || '',
                    stage1: this.payload.row && [this.payload.row.start_time, this.payload.row.end_time] || [],
                    level1: this.payload.row && this.payload.row.level || 0,
                    description1: this.payload.row && this.payload.row.description || '',
                    signupDeadline: this.payload.row && this.payload.row.ex_time || null,
                    state:this.payload.row && this.payload.row.state || 0
                },
                form2: {
                    name2: '',
                    stage2: [],
                    level2: 0,
                    description2: '',
                    semester: ''
                },
                rules1: {
                    name1: [{
                        required: true,
                        message: '请输入学期名称',
                        trigger: 'blur'
                    }],
                    stage1: [{
                        type: 'array',
                        required: true,
                        message: '请选择时间范围',
                        trigger: 'change'
                    }],
                    level1: [{
                        required: true,
                        type: 'number',
                        message: '请选择学期阶段',
                        trigger: 'change'
                    }],
                    description1: [{
                        required: true,
                        message: '请输入学期描述内容',
                        trigger: 'blur'
                    }]
                },
                rules2: {
                    semester: [{
                        required: true,
                        type: 'number',
                        message: '请选择学期名称',
                        trigger: 'change'
                    }]
                }
            }
        },
        mounted() {
            this.get_subject_list();
        },
        computed: {
            ...mapState({
                result_msg1: state => state.offline_curriculum.result_msg,
                subject1: state => state.subject.subject_list,
                offline_term_list1: state => state.offline_curriculum.offline_term_list
            }),
            pickerOptions() {
                var vm = this;
                if (this.form1.stage1 && this.form1.stage1.length > 0) {
                    return {
                        disabledDate(time) {
                            return time.getTime() >= new Date(vm.form1.stage1[0]).getTime();
                        }
                    }
                }
                return {

                }
            }
        },
        methods: {
            ...mapActions([
                'add_offline_term',
                'edit_offline_term',
                'get_subject_list',
                'get_offline_term_list'
            ]),
            handleClose() {
                this.addOfflineSemesterDialog = false;
            },
            handleSelectItem(idx) {
                this.form2.name2 = this.offline_term_list1[idx].name;
                this.form2.stage2 = [this.offline_term_list1[idx].start_time, this.offline_term_list1[idx].end_time];
                this.form2.level2 = this.offline_term_list1[idx].level || '';
                this.form2.description2 = this.offline_term_list1[idx].description || '';
            },
            handleSave(formName) {
                var vm = this;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.add_offline_term({
                            project_id: 1,
                            name: vm.form2.name2,
                            level: vm.form2.level2,
                            description: vm.form2.description2,
                            start_time: dateFormat(vm.form2.stage2[0]),
                            end_time: dateFormat(vm.form2.stage2[1]),
                            callback() {
                                vm.handleClose();
                                vm.showPop('添加成功！',1000);
                            }
                        })
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                });
            },
            handleSubmit(formName) {
                var vm = this;
                if (vm.payload.type == 1) {
                    this.$refs[formName].validate((valid) => {
                        if (valid) {
                            if (formName == 'myForm2') {
                                this.add_offline_term({
                                    project_id: 1,
                                    name: vm.form2.name2,
                                    level: vm.form2.level2,
                                    description: vm.form2.description2,
                                    start_time: dateFormat(vm.form2.stage1[0]),
                                    end_time: dateFormat(vm.form2.stage1[1]),
                                    callback() {
                                        vm.handleClose();
                                        vm.showPop('添加成功！',1000);
                                    }
                                })
                                return;
                            }
                            this.add_offline_term({
                                project_id: 1,
                                name: vm.form1.name1,
                                level: vm.form1.level1,
                                description: vm.form1.description1,
                                start_time: dateFormat(vm.form1.stage1[0]),
                                end_time: dateFormat(vm.form1.stage1[1]),
                                ex_time: dateFormat(vm.form1.signupDeadline),
                                callback() {
                                    vm.handleClose();
                                    vm.showPop('添加成功！',1000);
                                }
                            })
                        } else {
                            console.log('error submit!!');
                            return false;
                        }
                    });
                } else {
                    this.$refs[formName].validate((valid) => {
                        if (valid) {
                            this.edit_offline_term({
                                offline_term_id: vm.payload.row.id,
                                name: vm.form1.name1,
                                level: vm.form1.level1,
                                description: vm.form1.description1,
                                start_time: dateFormat(vm.form1.stage1[0]),
                                end_time: dateFormat(vm.form1.stage1[1]),
                                ex_time: dateFormat(vm.form1.signupDeadline),
                                state:vm.form1.state,
                                callback() {
                                    vm.handleClose();
                                    vm.showPop('修改成功！',1000);
                                }
                            })
                        } else {
                            console.log('error submit!!');
                            return false;
                        }
                    });
                }
            },
        changeDeadlineHandler() {
                if (this.form1.stage1 && this.form1.stage1.length > 0) {
                    if (new Date(this.form1.stage1[0]).getTime() - this.form1.signupDeadline.getTime() < (14 * 24 * 60 * 60 * 1000)) {
                        this.$alert('截止日期距开课日期小于14天！', '提示', {
                                        confirmButtonText: '确定',
                                        callback: action => { }
                                    });
                    }
                }
            }
        }
    }

</script>
<style lang="scss">
    #add-offline-semester-container {
        @import "base.scss";
        input,
        textarea {
            resize: none;
            outline: none;
        }
        .close-dialog-panel {
            position: absolute;
            top: 10px;
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
            .el-dialog__title {
                font-weight: 500;
            }
            .el-dialog__header {
                display: none;
            }
            .el-dialog__body {
                padding: 0;
                .el-date-editor {
                    width: 100%;
                }
                .el-tabs--border-card {
                    border: none;
                    background: none;
                }
                .el-form-item__label {
                    font-size: 14px;
                    color: #141111;
                    letter-spacing: 0;
                    &:before {
                        margin-right: 0;
                    }
                }
                .el-tabs__header {
                    background: #333333;
                    border-radius: 4px 4px 0 0;
                    height: 50px;
                    .el-tabs__item:first-child {
                        margin-left: 0;
                        border-top-left-radius: 4px;
                    }
                    .el-tabs__item {
                        font-size: 16px;
                        letter-spacing: 0;
                        color: #fff;
                        height: 51px;
                        line-height: 51px;
                        padding: 0 30px;
                    }
                    .is-active {
                        font-size: 16px;
                        color: #141111;
                        letter-spacing: 0;
                    }
                }
                .el-tabs__content {
                    border-radius: 0 0 4px 4px;
                    background: #fff;
                    padding: 0;
                }
                .el-form {
                    width: 80%;
                    margin: 20px auto;
                    input {
                        border: 1px solid #CCCCCC;
                    }
                    .semester-description {
                        text-align: left;
                        margin-bottom: 0;
                        .el-radio-group {
                            margin-top: 50px;
                        }
                        textarea {
                            background: #FFFFFF;
                            border: 1px solid #CCCCCC;
                            // height: 140px;
                            border-radius: 0;
                            // width: 390px;
                        }
                    }
                    .el-select {
                        width: 100%;
                    }
                    input {
                        border-radius: 0;
                    }
                    .el-dragger {
                        width: 100%;
                        background: #F6F6F6;
                        border: 1px solid #CCCCCC;
                        border-radius: 0;
                        .el-dragger__text {
                            font-size: 14px;
                            color: #757575;
                            letter-spacing: 0;
                            line-height: 14px;
                            margin-top: 20px;
                        }
                    }
                    .sub-btn {
                        background: #FB843E;
                        border-radius: 4px;
                        width: 200px;
                        height: 36px;
                        border: 0;
                        margin-left: 55px;
                        margin-top: 32px;
                    }
                    .el-form-item__content {
                        line-height: 0;
                    }
                }
                .has-video-form {
                    width: 100%;
                    margin: 0;
                    .el-form-item:first-child {
                        width: 80%;
                        margin: 20px auto;
                    }
                    .course-list {
                        .el-form-item__content {
                            margin-left: 0 !important;
                            line-height: 0;
                        }
                        .el-collapse-item__header__arrow {
                            position: absolute;
                            right: 18px;
                            margin-top: 15px;
                        }
                        .el-collapse-item__header {
                            padding-left: 20px;
                            text-align: left;
                            font-size: 16px;
                            color: #141111;
                            letter-spacing: 0;
                            i {
                                color: #CCCCCC;
                                transform: rotateZ(90deg);
                            }
                        }
                        .is-active {
                            i {
                                transform: rotateZ(-90deg);
                            }
                        }
                        .course-item {
                            margin-right: 8px;
                            font-size: 14px;
                            margin-left: -6px;
                            color: #3B3B3B;
                            letter-spacing: 0;
                            .el-icon-star-on {
                                margin-right: 10px;
                                margin-left: 4px;
                            }
                            .el-checkbox-group {
                                text-align: right;
                            }
                            .Col-18 {
                                text-align: left;
                            }
                        }
                    }
                }
                .btn-content {
                    padding-bottom: 10px;
                    .el-form-item__content {
                        margin-left: 0 !important;
                        button {
                            margin-left: 0;
                        }
                    }
                }
            }
        }
    }
</style>