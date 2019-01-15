<template>
<el-dialog title="视频设置" v-model="editVideoDialog" @close="handleRemoveModal(remove)" size="auto" :closeOnClickModal="false">
    <base-input @closedialog="handleClose" :baseInputWidth="600">
        <Row slot="body">
            <span class="dscj-webfont-remove-sign"></span>
            <Form ref="form" :model="form" :label-width="80">
                <FormItem label="小节名称">
                    <Input v-model="form.name" placeholder="请输入小节名称"></Input>
               </FormItem>
                <FormItem label="视频状态">
                    <Select v-model="form.region" placeholder="请选择视频状态">
                        <Option label="区域一" value="shanghai"></Option>
                        <Option label="区域二" value="beijing"></Option>
                    </Select>
               </FormItem>
                <FormItem label="观看权限">
                    <Select v-model="form.region" placeholder="请选择观看权限">
                        <Option label="区域一" value="shanghai"></Option>
                        <Option label="区域二" value="beijing"></Option>
                    </Select>
               </FormItem>
                <FormItem label="上传视频" class="upload-form">
                    <upload-panel>
                        <span slot="file-require">只能上传 MP4/MOV/AVI 文件，且不超过2M</span>
                    </upload-panel>
               </FormItem>
                <FormItem class="btns">
                    <Button type="primary" class="sub-btn" @click="handleSubmit">保存</Button>
               </FormItem>
            </Form>
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
    MPop
} from '../../components/MessagePop'
export default {
    mixins: [RemoveModal,MPop],
    props: {
        remove: {
            type: String
        }
    },
    components: {
        'base-input': BaseInput,
        'upload-button': UploadButton,
        'upload-panel': UploadPanel
    },
    data() {
        return {
            editVideoDialog: true,
            form: {
                name: '',
                region: '',
                date1: '',
                date2: '',
                delivery: false,
                type: [],
                resource: '',
                desc: ''
            },
        }
    },
    methods: {
        handleClose() {
            this.videoManageDialog = false;
        },
        handleSubmit() {

        }
    }
}
</script>
<style lang="scss">
#edit-video-container {
    @import "base.scss";
    input,
    textarea {
        resize: none;
        outline: none;
    }
    .el-dialog {
        .el-dialog__title {
            font-weight: 500;
        }
        .el-dialog__header {
            background: #333333;
            border-radius: 4px 4px 0 0;
            padding: 16px;
        }
        .el-dialog__body {
            padding: 0;
            .el-tabs--border-card {
                border: none;
                background: none;
            }
            .el-form-item__label {
                font-size: 14px;
                color: #141111;
                letter-spacing: 0;
            }

            .el-form {
                width: 80%;
                margin: 20px auto;
                input {
                    border: 1px solid #CCCCCC;
                }

                .upload-form {
                    text-align: left;
                    margin-bottom: 0;
                    .el-radio-group {
                        margin-top: 50px;
                    }
                }
                .el-select {
                    width: 100%;
                }
                .el-form-item__content {

                    line-height: 0;
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
            .btns {
                padding-top: 10px;
                padding-bottom: 8px;
                .el-form-item__content {
                    margin-left: 0 !important;
                    button {
                        margin-left: 0;
                    }
                }
            }
        }
    }
    .dscj-webfont-remove-sign {
        position: absolute;
        top: 100px;
        right: 40px;
        z-index: 999;
    }
}
</style>
