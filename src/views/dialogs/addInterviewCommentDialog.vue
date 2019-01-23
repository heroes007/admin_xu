<template>
    <modal title="面试评价" :footer-hide="true" v-model="addInterviewCommentDialog" @on-cancel="handleRemoveModal(remove)"
        :mask-closable="false" width="900">
        <base-input @closedialog="handleClose">
            <Row slot="body">
                <Row class="body-top">
                    <div class='data-container'>
                        <div class='readover-content'>
                            <Input type="textarea" placeholder="请输入评价内容" v-model="data.interview_comment" class="input-textarea"></Input>
                        </div>
                        <Row class='result' type='flex' justify='start'>
                            <RadioGroup v-model="data.interview_result">
                                <Radio class="radio" :label="1">通过</Radio>
                                <Radio class="radio" :label="0">未通过</Radio>
                            </RadioGroup>
                        </Row>
                        <Row class='btn-submit' type='flex' justify='center'>
                            <Button type='primary' @click='doSubmit' style="width: 170px;">确定</Button>
                        </Row>
                    </div>
                </Row>
            </Row>
        </base-input>
        </modal>
</template>
<script>
    import BaseInput from '../../components/BaseInput'
    import UploadPanel from '../../components/UploadPanel'
    import {
        RemoveModal
    } from './mixins'
    import {
        mapActions,
        mapState
    } from 'vuex';
    import {
        get_readover_detail
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
                addInterviewCommentDialog: true,
                data: {
                    id:0,
                    interview_result:1,
                    interview_comment: '',
                    callback: undefined
                }
            }
        },
        mounted() {
            let vm = this;
            this.data.id = this.payload.id;
            this.data.interview_result = this.payload.interview_result;
            this.data.interview_comment = this.payload.interview_comment;
            this.data.callback = function () {
                vm.handleClose();
                vm.showPop('评价成功！',1000);
            }
        },
        computed: {
            ...mapState({

            })
        },
        methods: {
            ...mapActions([
                'change_interview_result'
            ]),
            handleClose() {
                this.addInterviewCommentDialog = false;
            },
            doSubmit() {
                this.change_interview_result(this.data);
            }
        },
        components: {
            'base-input': BaseInput,
            'upload-panel': UploadPanel
        },
    }

</script>
<style scoped lang="scss">
.task-assignment-pop {
    img {
        width: 100%;
    }
}
    #add-interview-comment-container {
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
    .input-textarea{
        padding: 20px;
    }
    .result{
        padding: 0 20px;
    }
    .btn-submit{
        margin: 20px 0;
    }
    /deep/ textarea.ivu-input{
        height: 420px;
        resize: none;
    }
</style>
