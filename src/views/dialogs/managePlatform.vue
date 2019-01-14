<template>
    <el-dialog title="修改内容" @close="handleRemoveModal(remove)" v-model="ManagePlatformDialog" :show-close="false" size="auto"
        :closeOnClickModal="false">
        <base-input @closedialog="handleClose" :baseInputWidth="400">
            <Row slot="body">
                <Form :model="formInline" class="row1-test-form" label-width="50px">
                    <FormItem label="名称">
                        <el-input v-model="formInline.version"></el-input>
                   </FormItem>
                    <FormItem label="平台">
                        <el-input v-model="formInline.platform_type"></el-input>
                   </FormItem>
                    <FormItem label="网址">
                        <el-input v-model="formInline.download_url"></el-input>
                   </FormItem>
                    <FormItem label="apk">
                        <upload-panel :resourse='formInline.apk_url' @uploadcomplete='uploadCompleteHandler' :upload-config='uploaderConfig'>
                            <span slot="file-require">只能上传.apk文件</span>
                        </upload-panel>
                   </FormItem>
                    <FormItem class="btns">
                        <Button type="primary" class="sub-btn" @click="saveHandler">确认</Button>
                        <Button type="primary" class="sub-btn" @click="handleClose">取消</Button>
                   </FormItem>
                </Form>
            </Row>
        </base-input>
    </el-dialog>
</template>
<script>
    import {
        RemoveModal
    } from './mixins'
    import UploadPanel from '../../components/UploadPanel'
    import BaseInput from '../../components/BaseInput'
    import {
        mapActions,
        mapState
    } from 'vuex';
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
                ManagePlatformDialog: true,
                formInline: {
                    version: '',
                    platform_type: '',
                    download_url: '',
                    apk_url: ''
                },
                uploaderConfig: {
                    bucket: 'dscj-static-file',
                    dir: 'download/app',
                    type: 3
                }
            }
        },
        mounted() {
            console.log(this.payload.version);
            this.formInline.version = this.payload.version;
            this.formInline.platform_type = this.payload.platform_type;
            this.formInline.download_url = this.payload.download_url;
        },
        methods: {
            handleClose() {
                this.ManagePlatformDialog = false;
            },
            uploadCompleteHandler(v) {
                this.formInline.download_url = v;
            },
            saveHandler() {
                var vm = this;

                this.editVersion({
                    id: this.payload.id,
                    ver: this.formInline.version,
                    type: this.formInline.platform_type,
                    platform_type: this.formInline.platform_type,
                    info: this.payload.info,
                    download_url: this.formInline.download_url,
                    state: this.payload.state,
                    callback() {
                        vm.handleClose();
                        vm.showPop('保存成功！',1000);
                    }
                })
            },
            ...mapActions([
                'editVersion'
            ])
        },
        components: {
            'base-input': BaseInput,
            'upload-panel': UploadPanel
        },
    }
</script>
<style lang="scss">
    #manage-platform-container {
        @import "base.scss";
        .close-dialog-panel {
            position: absolute;
            top: -70px;
            right: -10px;
            z-index: 99999;
            font-size: 30px;
            cursor: pointer;
            &:before {
                // color: #fff;
                color: #757575;
            }
        }
        input,
        textarea {
            resize: none;
            outline: none;
        }
        .el-dialog {
            width: 480px;
            background: none;
            .body-top {
                padding-bottom: 15px;
            }
            .el-dialog__header {
                background: #333333;
                border-radius: 4px 4px 0 0;
                padding: 16px;
            }
            .el-dialog__body {
                padding-bottom: 0;
                margin-bottom: -20px;
                background-color: #fff;
                border-radius: 0 0 4px 4px;
                .el-form-item__label {
                    font-size: 14px;
                    color: #141111;
                    letter-spacing: 0;
                    &:before {
                        margin-right: 0;
                    }
                }
            }
            .btns {
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                .sub-btn {
                    background: #FB843E;
                    border-radius: 4px;
                    width: 120px;
                    height: 36px;
                    border: 0;
                    &:last-child {
                        background: #ccc;
                    }
                }
            }
        }
    }
</style>