<template>
    <Modal
        title="导师安排"
        v-model="interviewTeacherArrangementDialog"
        @on-cancel="handleRemoveModal(remove)"
        width="600px"
        :footer-hide="true">
        <base-input @closedialog="handleClose">
            <Row slot="body">
                <Row class="body-top" v-if="true">
                    <Form ref="form" :model="form" :label-width="80" class="add-teacher-form">
                        <FormItem
                            v-for='(item, index) in subjectList'
                            :key='item.id'
                            :label="item.name">
                            <Select v-model="form.arrangement[index]" placeholder="请选择学科">
                                <Option
                                    v-for="t in teacherList"
                                    :key="t.user_id"
                                    :label="t.nickname"
                                    :value="t.user_id"></Option>
                            </Select>
                        </FormItem>
                        <FormItem class="btn-content">
                            <Button type="primary" class="sub-btn" @click="saveHandler">保存</Button>
                        </FormItem>
                    </Form>
                </Row>
            </Row>
        </base-input>
    </Modal>
</template>

<script>
    import BaseInput from '../../components/BaseInput'
    import UploadButton from '../../components/UploadButton'
    import {RemoveModal} from './mixins'
    import UploadPanel from '../../components/UploadPanel'
    import {get_interview_tutor, set_interview_tutor} from '../../api/modules/exam'
    import {Loading} from 'element-ui'
    import {Config} from '../../config/base'
    import {mapActions, mapState} from 'vuex'
    import {MPop} from '../../components/MessagePop'
    export default {
        mixins : [
            RemoveModal, MPop
        ],
        props : {
            remove: {
                type: String
            },
            payload: {}
        },
        components : {
            'base-input': BaseInput,
            'upload-button': UploadButton,
            'upload-panel': UploadPanel
        },
        data() {
            return {
                interviewTeacherArrangementDialog: true,
                form: {
                    arrangement: [],
                    _fn: null
                },
                loadingInstance: null
            }
        },
        computed : {
            ...mapState({
                isLoading: state => state.user.isLoading,
                subjectList: state => state.subject.subject_list,
                teacherList: state => state.user.getTeachers
            })
        },
        methods : {
            ...mapActions(['get_teachers', 'get_subject_list']),
            saveHandler() {
                var result = [];
                for (var i = 0; i < this.subjectList.length; i++) {
                    result.push({subject_id: this.subjectList[i].id, interview_user_id: this.form.arrangement[i]});
                }
                var vm = this;
                set_interview_tutor(result).then(res => {
                    if (res.data.res_code === 1) {
                        vm.handleClose();
                        vm.showPop('保存成功！', 1000);
                    }
                })
            },
            handleClose() {
                this.interviewTeacherArrangementDialog = false;
            }
        },
        mounted() {
            var vm = this;
            this.form._fn = function () {
                vm.handleClose();
                vm.showPop('保存成功！', 1000);
            };
            this.get_teachers();
            this.get_subject_list();
            get_interview_tutor().then(res => {
                if (res.data.res_code === 1) {
                    var found;
                    for (var i = 0; i < this.subjectList.length; i++) {
                        found = false;
                        for (var j = 0; j < res.data.msg.length; j++) {
                            if (res.data.msg[j].subject_id === this.subjectList[i].id) {
                                this
                                    .form
                                    .arrangement
                                    .push(res.data.msg[j].interview_user_id);
                                found = true;
                                break;
                            }
                        }
                        if (!found) {
                            this
                                .form
                                .arrangement
                                .push(null);
                        }
                    }
                }
            })
        }
    }
</script>
<style lang="scss" scoped>
    /deep/ .ivu-modal-body{ width: 80%; margin-left: 10%; }
    /deep/ .btn-content { text-align: center; }
</style>