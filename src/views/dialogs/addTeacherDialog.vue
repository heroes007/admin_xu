

<template>
<el-dialog title="添加讲师" v-model="addTeacherDialog" @close="handleRemoveModal(remove)" size="auto" :closeOnClickModal="false" :show-close="false">
    <base-input @closedialog="handleClose">
        <el-row slot="body">
            <el-row class="body-top" v-if="true">
                <el-form ref="form" :model="form" label-width="80px" class="add-teacher-form">
                    <el-form-item label="讲师名称">
                        <el-input v-model="form.name" placeholder="请输入讲师名称"></el-input>
                    </el-form-item>
                    <el-form-item label="讲师描述">
                        <el-input type="textarea"  :autosize="{ minRows: 6, maxRows: 6}" placeholder="请对讲师进行描述" v-model="form.description">
                        </el-input>
                    </el-form-item>
                    <el-form-item label="讲师照片" class="upload-form1">
                        <upload-panel ref="upload_panel" :resourse="form.img_url" :upload-config="uploadConfig" @uploadcomplete="handleUploadComplete">
                            <span slot="file-require">只能上传 jpg/png 文件，且不超过1000kb</span>
                        </upload-panel>
                    </el-form-item>
                    <el-form-item class="btn-content">
                        <el-button type="primary" class="sub-btn" @click="saveHandler">保存</el-button>
                    </el-form-item>
                </el-form>
            </el-row>
        </el-row>
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
import { get_detail } from '../../api/modules/tools_teacher'
import { Loading } from 'element-ui'
import { Config } from '../../config/base'
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
            addTeacherDialog: true,
            form: {
                id:0,
                name: '',
                description: '',
                img_url:'',
                _fn:null
            },
            loadingInstance:null,
            uploadConfig: {
              bucket: 'dscj-app',
              dir: 'user_task',
              type: 1
            }
        }
    },
    methods: {
        saveHandler() {
            if(this.payload)
            {
                this.$store.dispatch('edit_teacher',this.form);
            }
            else
            {
                this.$store.dispatch('add_teacher',this.form);
            }
        },
        handleClose() {
            this.addTeacherDialog = false;
        },
        handleUploadComplete(url){
          this.form.img_url = url;
        }
    },
    mounted(){
        var vm = this;
        this.form._fn = function(){
            vm.handleClose();
            vm.showPop('保存成功！',1000);
        };
        if(this.payload)
        {
            this.loadingInstance = Loading.service({ text:'加载中，请稍后',fullscreen:true });
            setTimeout(() => {
            this.loadingInstance.close();
        }, Config.base_timeout);
            get_detail(this.payload).then(res => {
                if(res.data.res_code === 1)
                {
                    this.form = res.data.msg[0];
                    this.form._fn = function(){
                        vm.handleClose();
                        vm.showPop('保存成功！',1000);
                    };
                    this.loadingInstance.close();
                }
            })
        }
    }
}
</script>
<style lang="scss">
#add-teacher-container {
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
