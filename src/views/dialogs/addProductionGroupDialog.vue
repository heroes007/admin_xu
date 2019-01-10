<template>
<el-dialog :title="!payload? '创建专题' : '编辑专题'" :show-close="false" v-model="addProductionGroupDialog" @close="handleRemoveModal(remove)" size="auto" :closeOnClickModal="false">
    <base-input @closedialog="handleClose">
        <Row slot="body">
            <Row class="body-top">
                <el-form ref="form" :model="form" label-width="121px" class="add-task-form">
                    <el-form-item label="专题名称">
<el-input v-model="form.name" placeholder="请输入专题名称"></el-input>
                    </el-form-item>
                    <el-form-item label="专题展示">
                                <upload-panel ref="upload_panel" :resourse="form.img_url" :upload-config="uploadConfig" @uploadcomplete="uploadCompleteHandler">
                                    <span slot="file-require">只能上传 jpg/png 文件，且图片480*270</span>
                                </upload-panel>
                            </el-form-item>
                    <el-form-item label="专题简介">
                        <el-input type="textarea" :rows="6" placeholder="请输入专题简介" v-model="form.short_description">
                        </el-input>
                    </el-form-item>
                    <el-form-item label="编辑产品课程图文详情:" label-width='160px'>
                    </el-form-item>
                    <el-form-item label="" label-width='0'>
                        <text-editor ref='description_editor' :content='form.description'/>
                    </el-form-item>
                    <el-form-item class="btns">
                        <el-button class="btn-orange" @click="handleSubmit('form')">保存</el-button>
                    </el-form-item>
                </el-form>
            </Row>
        </Row>
    </base-input>
</el-dialog>
</template>
<!-- task_id = 19 -->
<script>
import BaseInput from '../../components/BaseInput'
import UploadPanel from '../../components/UploadPanel'
import Editor from '../../components/Editor'
import BaseList from '../../components/BaseList'
import { Loading } from 'element-ui'
import { Config } from '../../config/base'
import {
    RemoveModal
} from './mixins'
import {
    mapActions,
    mapState
} from 'vuex';
import {
    get_detail
} from '../../api/modules/tools_special'
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
            addProductionGroupDialog: true,
            form: {
                special_id:0,
                name: '',
                short_description:'',
                description:''
            },
            uploadConfig: {
                bucket: 'dscj-app',
                dir: 'production',
                type: 1
            },
            loadingInstance:null
        }
    },
    mounted() {
        if(this.payload)
        {
            this.form.special_id = this.payload.id;
            this.loadingInstance = Loading.service({
                text:'加载中，请稍后',
                    fullscreen: true
                });
                setTimeout(() => {
                    this.loadingInstance.close();
                }, Config.base_timeout);
            get_detail(this.payload.id).then(res => {
                if(res.data.res_code === 1)
                {
                    this.form.name = res.data.msg.name;
                    this.form.short_description = res.data.msg.short_description;
                    this.form.description = res.data.msg.description;

                    var arrObj = JSON.parse(res.data.msg.img_url_arr);
                    this.form.img_url = arrObj.default;
                    this.loadingInstance.close();
                }
            })
        }

        var vm = this;

        this.form.project_id = this.projectId;

        this.form._fn = function(){
            vm.handleClose();
            vm.showPop('保存成功！');
        }
    },
    computed: {
        ...mapState({
            subjectList: state => state.subject.subject_list,
            gradeList: state => state.grade.grade_list,
            onlineCurrriculumList: state => state.online_curriculum.online_curriculum_list
        }),
    },
    methods: {
        ...mapActions([
            'add_production_group',
            'update_production_group'
        ]),
        uploadCompleteHandler(url){
            this.form.img_url = url;
        },
        handleClose() {
            this.form.description = '';
            this.addProductionGroupDialog = false;
        },
        handleSubmit(formName) {
            var arrObj = {
                default:this.form.img_url
            }
            var description= this.$refs.description_editor.editor.getContent();
            this.form.description = description;
            this.form.img_url_arr =JSON.stringify(arrObj);
            if(this.payload)
            {
                this.update_production_group(this.form);
            }
            else
            {
                this.add_production_group(this.form);
            }
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
#add-production-group-container {
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
