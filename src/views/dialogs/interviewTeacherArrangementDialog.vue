<template>
<el-dialog title="导师安排" v-model="interviewTeacherArrangementDialog" @close="handleRemoveModal(remove)" size="auto" :closeOnClickModal="false" :show-close="false">
    <base-input @closedialog="handleClose">
        <Row slot="body">
            <Row class="body-top" v-if="true">
                <Form ref="form" :model="form" :label-width="80" class="add-teacher-form">
                    <FormItem v-for='(item, index) in subjectList' :key='item.id' :label="item.name">
                        <Select v-model="form.arrangement[index]" placeholder="请选择学科">
                            <Option v-for="t in teacherList" :key="t.user_id" :label="t.nickname" :value="t.user_id"></Option>
                        </Select>
                   </FormItem>
                    <FormItem class="btn-content">
                        <Button type="primary" class="sub-btn" @click="saveHandler">保存</Button>
                   </FormItem>
                </Form>
            </Row>
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
import { get_interview_tutor, set_interview_tutor } from '../../api/modules/exam'
import { Loading } from 'element-ui'
import { Config } from '../../config/base'
import {
    mapActions,
    mapState
} from 'vuex'
    import {
    MPop
} from '../../components/MessagePop'
export default {
    mixins: [RemoveModal,MPop],
    props: {
        remove: {
            type: String
        },
        payload: {
        }
    },
    components: {
        'base-input': BaseInput,
        'upload-button': UploadButton,
        'upload-panel': UploadPanel
    },
    data() {
        return {
            interviewTeacherArrangementDialog: true,
            form: {
                arrangement:[],
                _fn:null
            },
            loadingInstance:null
        }
    },
    computed:{
        ...mapState({
            isLoading:state => state.user.isLoading,
            subjectList:state => state.subject.subject_list,
            teacherList:state => state.user.getTeachers
        })
    },
    methods: {
        ...mapActions([
            'get_teachers',
            'get_subject_list'
        ]),
        saveHandler() {
            var result = [];
            for(var i=0;i<this.subjectList.length;i++)
            {
                result.push({subject_id:this.subjectList[i].id,interview_user_id:this.form.arrangement[i]});
            }
            var vm = this;
            set_interview_tutor(result).then(res => {
                if(res.data.res_code === 1)
                {
                    vm.handleClose();
                    vm.showPop('保存成功！',1000);
                }
            })
        },
        handleClose() {
            this.interviewTeacherArrangementDialog = false;
        }
    },
    mounted(){
        var vm = this;
        this.form._fn = function(){
            vm.handleClose();
            vm.showPop('保存成功！',1000);
        };
        this.get_teachers();
        this.get_subject_list();
        get_interview_tutor().then(res => {
            if(res.data.res_code === 1)
            {
                var found;
                for(var i=0;i<this.subjectList.length;i++)
                {
                    found = false;
                    for(var j=0;j<res.data.msg.length;j++)
                    {
                        if(res.data.msg[j].subject_id === this.subjectList[i].id)
                        {
                            this.form.arrangement.push(res.data.msg[j].interview_user_id);
                            found = true;
                            break;
                        }
                    }
                    if(!found)
                    {
                        this.form.arrangement.push(null);
                    }
                }
            }
        })
    }
}
</script>
<style lang="scss">
#interview-teacher-arrangement-container {
@import "base.scss";
    input,
    textarea {
        resize: none;
        outline: none;
    }
    .close-dialog-panel{
      position: absolute;
      top: -70px;
      right: -13.5px;
      z-index: 99999;
      font-size: 30px;
      cursor: pointer;
      &:before{
        // color: #fff;
        color: #757575;
      }
    }
    .el-dialog {
        width: 600px;
        background: none;

        .el-dialog__header {
            background: #333333;
            border-radius: 4px 4px 0 0;
            padding: 16px;
        }

        .el-dialog__body {
            margin-bottom: -20px;
            background-color: #fff;
            border-radius: 0 0 4px 4px;
            padding-bottom: 10px;
            .el-form-item__label {
                font-size: 14px;
                color: #141111;
                letter-spacing: 0;
            }
        }
        .add-teacher-form {
            width: 80%;
            margin: 0 auto;
            .el-select {
                width: 100%;
            }
            input {
                border-radius: 0;
                border: 1px solid #CCCCCC;
            }
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
            .btn-content {

              margin-top: 50px;
                .el-form-item__content {
                    margin-left: 0 !important;
                    line-height: 0;
                    button {
                        margin-left: 0;
                        background: #FB843E;
                        border-radius: 4px;
                        width: 200px;
                        height: 36px;
                        border: 0;
                    }
                }
            }
            .el-form-item__content {
                // margin-left: 0 !important;
                line-height: 0;
                .el-textarea {
                    .el-textarea__inner {
                        background: #FFFFFF;
                        border: 1px solid #CCCCCC;
                        height: 140px;
                        border-radius: 0;
                        // width: 390px;
                    }
                }
            }
            .sub-btn {
                background: #FB843E;
                border-radius: 4px;
                width: 200px;
                height: 36px;
                border: 0;
            }
        }
    }
}
</style>
