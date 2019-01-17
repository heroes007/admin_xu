    <template>
    <Modal :transfer=false v-model="addOfflineSemesterDialog" @on-cancel="handleRemoveModal(remove)" size="auto" :footer-hide="true" :mask-closable="false" :styles="{width: '640px'}" :closable="true">
        <base-input :baseInputWidth="600" @closedialog="handleClose">
            <Row slot="body" class="top-nav">
                <Tabs type="line">
                    <TabPane :label="payload.type == 2 ? '编辑学期' : '添加学期'">
                        <Form ref="myForm1" :rules="rules1" :model="form1" :label-width="80">
                            <FormItem label="学期名称" prop="name1" required>
                                <Input v-model="form1.name1" placeholder="请输入学期名称"></Input>
                           </FormItem>
                            <FormItem label="学期阶段" prop="level1" required>
                                <Select v-model="form1.level1" placeholder="请选择学期阶段">
                                    <Option label="一阶" :value="0"></Option>
                                    <Option label="二阶" :value="1"></Option>
                                </Select>
                           </FormItem>
                            <FormItem label="开课日期" prop="stage1" required>
                                <DatePicker v-model="form1.stage1" type="datetimerange" placeholder="请选择时间范围" :transfer="true"></DatePicker>
                           </FormItem>
                            <FormItem label="截止报名日期">
                                <DatePicker v-model="form1.signupDeadline" type="date" placeholder="选择日期" :picker-options="pickerOptions" @change='changeDeadlineHandler' :transfer="true">
                                </DatePicker>
                           </FormItem>
                                <FormItem label="学期描述" class="semester-description" prop="description1" required>
                                    <Input type="textarea" :rows="8" placeholder="请输入学期描述内容" v-model="form1.description1">
                                    </Input>
                               </FormItem>
                                <div style="text-align: center">
                                    <Button type="primary" class="sub-btn" @click="handleSubmit('myForm1')">保存</Button>
                               </div>
                        </Form>
                    </TabPane>
                    <TabPane label="复制学期" v-if="payload.type == 1">
                        <Form ref="myForm2" :rules="rules2" :model="form2" :label-width="80">
                            <FormItem label="选择学期" prop="semester" required>
                                <Select v-model="form2.semester" placeholder="请选择学期" @change="handleSelectItem">
                                    <Option v-for="(item,index) in offline_term_list1" :key="item.id" :label="item.name" :value="index"></Option>
                                </Select>
                           </FormItem>
                            <FormItem label="学期名称">
                                <Input v-model="form2.name2" placeholder="请输入学期名称"></Input>
                           </FormItem>
                            <FormItem label="学期阶段">
                                <Select v-model="form2.level2" placeholder="请选择学期阶段">
                                    <Option label="一阶" value="0"></Option>
                                    <Option label="二阶" value="1"></Option>
                                </Select>
                           </FormItem>
                            <FormItem label="开课日期">
                                <DatePicker v-model="form2.stage2" type="datetimerange" placeholder="请选择时间范围" :transfer="true"></DatePicker>
                           </FormItem>
                            <FormItem label="学期描述" class="semester-description">
                                <Input type="textarea" :rows="8" placeholder="请输入学期描述" v-model="form2.description2">
                                </Input>
                           </FormItem>
                            <div style="text-align: center">
                                <Button type="primary" class="sub-btn" @click="handleSave('myForm2')">保存</Button>
                           </div>
                        </Form>
                    </TabPane>
                </Tabs>
            </Row>
        </base-input>
    </Modal>
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
                        // console.log('error submit!!');
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
                            // console.log('error submit!!');
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
                        // this.$alert('截止日期距开课日期小于14天！', '提示', {
                        //                 confirmButtonText: '确定',
                        //                 callback: action => { }
                        //             });
                      this.$Modal.warning({
                        title: '提示',
                        content: '截止日期距开课日期小于14天！'
                      });
                    }
                }
            }
        }
    }

</script>
<style scoped lang="scss">
    .sub-btn{
        width: 170px;
    }
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
    }
    .ivu-modal-close .ivu-icon-ios-close,.ivu-modal-close .ivu-icon-ios-close:hover{
        color: #999 !important;
    }
    /deep/ .ivu-form-item-content{
        text-align: left;
    }
</style>
