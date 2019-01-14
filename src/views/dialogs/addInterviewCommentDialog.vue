<template>
    <el-dialog title="面试评价" :show-close="false" v-model="addInterviewCommentDialog" @close="handleRemoveModal(remove)"
        size="auto" :closeOnClickModal="false">
        <base-input @closedialog="handleClose">
            <Row slot="body">
                <Row class="body-top">
                    <div class='data-container'>
                        <div class='readover-content'>
                            <Input type="textarea" placeholder="请输入评价内容" v-model="data.interview_comment">
                            </Input>
                        </div>
                        <Row class='result' type='flex' justify='start'>
                            <el-radio class="radio" v-model="data.interview_result" :label="1">通过</el-radio>
                            <el-radio class="radio" v-model="data.interview_result" :label="0">未通过</el-radio>
                        </Row>
                        <Row class='btn-submit' type='flex' justify='center'>
                            <Button type='primary' @click='doSubmit'>确定</Button>
                        </Row>
                    </div>
                </Row>
            </Row>
        </base-input>
        </el-dialog>
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
<style lang="scss">
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
        .el-dialog {
            width: 900px;
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
            .data-container {
                width: 80%;
                margin: 40px auto;
                .file-item {
                    margin-bottom: 15px;
                    &:last-child {
                        margin-bottom: 0;
                    }
                    .title {
                        font-size: 16px;
                        color: #171515;
                        letter-spacing: 0;
                        i {
                            font-size: 20px;
                            margin-right: 8px;
                        }
                    }
                    .link {
                        a {
                            font-size: 16px;
                            color: #697784;
                            letter-spacing: 0;
                        }
                        .preview {
                            border-right: 1px solid #697784;
                            padding-right: 15px;
                            margin-right: 15px;
                            cursor: pointer;
                        }
                    }
                }
                .result {
                    padding: 10px 0;
                }
                .readover-content {
                    textarea {
                        min-height: 420px !important;
                        background-color: #FBFBFB;
                        border: 1px solid #E5E5E5;
                    }
                }
                .btn-submit {
                    margin-top: 40px;
                    .el-button {
                        background-color: #FB843E;
                        border: 1px solid #F06B1D;
                        border-radius: 4px;
                        color: #ffffff;
                        width: 200px;
                        height: 36px;
                    }
                }
            }
        }
    }
</style>