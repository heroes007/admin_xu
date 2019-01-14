

<template>
<el-dialog title="添加分类" v-model="addTaskCategoryDialog" @close="handleRemoveModal(remove)" size="auto" :closeOnClickModal="false" :show-close="false">
    <base-input @closedialog="handleClose">
        <Row slot="body">
            <Row class="body-top" v-if="true">
                <p class="title">任务和类型不一样的喔，创建类型前请先选择好</p>
                <Form ref="form" :model="form" label-width="80px" class="add-teacher-form">
                    <FormItem class='radio-container'>
                        <el-radio-group v-model="form.type" type='flex' justify='start' align='middle' @change="handleChangeRadio">
                            <el-radio class="radio" :class="{'is-changed': isChanged == 0}" :label="0">
                                <span class=""></span>任务
                            </el-radio>
                            <el-radio class="radio" :class="{'is-changed': isChanged == 1}" :label="1">
                                <span class=""></span>作业
                            </el-radio>
                        </el-radio-group>
                   </FormItem>
                    <FormItem label="分类名称">
                        <Input v-model="form.name" placeholder="请输入分类名称"></Input>
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
import {
    RemoveModal
} from './mixins'
import UploadPanel from '../../components/UploadPanel'
import {
    get_category_by_id
} from '../../api/modules/tools_task'
import {
    Loading
} from 'element-ui'
import {
    Config
} from '../../config/base'
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
        'base-input': BaseInput
    },
    data() {
        return {
            addTaskCategoryDialog: true,
            form: {
                project_id: this.$store.state.project.select_project_id,
                name: '',
                type: 0,
                orderby: 0,
                _fn: null
            },
            isChanged: false,
            loadingInstance: null
        }
    },
    methods: {
        saveHandler() {
            if (this.payload.cid) {
                this.$store.dispatch('edit_task_category', this.form);
            } else {
                this.$store.dispatch('add_task_category', this.form);
            }
        },
        handleClose() {
            this.addTaskCategoryDialog = false;
        },
        handleUploadComplete(url) {
            this.form.img_url = url;
        },
        handleChangeRadio(v){
          this.isChanged = v;
        }
    },
    mounted() {
        var vm = this;
        this.form._fn = function() {
            vm.handleClose();
            vm.showPop('创建成功！',1000);
        };

        if (this.payload.cid) {
            this.loadingInstance = Loading.service({
                text:'加载中，请稍后',
                fullscreen: true
            });
            setTimeout(() => {
                this.loadingInstance.close();
            }, Config.base_timeout);
            get_category_by_id(this.payload.cid).then(res => {
                if (res.data.res_code === 1) {
                    this.form = res.data.msg;
                    this.form.task_category_id = this.payload.cid;
                    this.form._fn = function() {
                        vm.handleClose();
                        vm.showPop('创建成功！',1000);
                    };
                    this.loadingInstance.close();
                }
            })
        } else {
            this.form.orderby = this.payload.orderby;
        }

        //            if(this.payload)
        //            {
        //                this.loadingInstance = Loading.service({ fullscreen:true });
        //                get_detail(this.payload).then(res => {
        //                    if(res.data.res_code === 1)
        //                    {
        //                        this.form = res.data.msg[0];
        //                        this.form._fn = function(){
        //                            vm.handleClose();
        //                        };
        //                        this.loadingInstance.close();
        //                    }
        //                })
        //            }
    }
}
</script>
<style lang="scss">
#add-task-category-container {
    @import "base.scss";
    input,
    textarea {
        resize: none;
        outline: none;
    }
    .close-dialog-panel {
        position: absolute;
        top: -70px;
        right: -13.5px;
        z-index: 99999;
        font-size: 30px;
        cursor: pointer;
        &:before {
            // color: #fff;
            color: #757575;
        }
    }
    .el-dialog {
        width: 600px;
        background: none;
        .title {
            font-size: 14px;
            color: #757575;
            letter-spacing: 1px;
            line-height: 20px;
            margin-top: 0;
        }
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
            .radio-container {
                height: 36px;
                padding-top: 10px;
                padding-bottom: 10px;
                .el-form-item__content {
                    margin-left: 0 !important;
                    .el-radio {
                        margin-left: 40px;
                        margin-right: 40px;
                    }
                    // -------- 修改了单选框样式 ------------
                    .is-changed{
                      .el-radio__label{
                        border: 1px solid #5FA137;
                        color: #5FA137;


                      }
                      .el-radio__inner{
                        border-color: #5FA137;
                        background-color: #5FA137;
                      }
                    }
                    .el-radio__label {
                        border: 1px solid #979797;
                        border-radius: 4px;
                        width: 80px;
                        height: 32px;
                        display: inline-block;
                        line-height: 30px;
                        margin-left: 6px;
                        color: #979797;
                    }
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
                        // background-color: #20a0ff;
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
                    .is-checked{

                      .el-radio__inner::after{
                        transform: rotate(45deg) scaleY(1);
                      }
                    }
                    // -------- 修改了单选框样式 ------------
                }
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
