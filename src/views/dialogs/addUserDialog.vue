<template>
<el-dialog title="创建用户" v-model="addUserDialog" @close="handleRemoveModal(remove)" size="auto" :closeOnClickModal="false" :show-close="false">
    <base-input @closedialog="handleClose">
        <Row slot="body">
            <Row class="body-top" v-if="true">
                <Form ref="form" :model="form" :label-width="80" class="add-teacher-form">
                    <FormItem label="是否注册">
                          <el-checkbox v-model="form.doRegist"></el-checkbox>
                   </FormItem>
                    <FormItem class="btn-content">
                        <Button type="primary" class="sub-btn" @click="createHandler">创建</Button>
                   </FormItem>
                </Form>
            </Row>
                            <Row class='msg'>
                    勾选注册将会提供一个新的注册账号，不勾选将会返回一个手机验证码需要手动注册。
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
    get_student_detail,
} from '../../api/modules/tools_student'
import {
    create_test_user
} from '../../api/modules/tools_user'

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
            addUserDialog: true,
            form: {
                doRegist:true
            },
            loadingInstance: null,
            isSend: false
        }
    },
    computed: {
        
    },
    methods: {
        handleClose() {
            this.addUserDialog = false;
        },
        createHandler() {
            create_test_user(this.form.doRegist?1:0).then(res => {
                if(res.data.res_code === 1)
                {
                    if(this.form.doRegist)
                    {
                        this.$alert('用户名：' + res.data.msg.username + '密码：' + res.data.msg.password, '创建成功', {
                                        confirmButtonText: '确定',
                                        customClass:'add-user-dialog-alert',
                                        callback: action => { }
                                    });
                    }
                    else
                    {
                        this.$alert('用户名：' + res.data.msg.username + '验证码（请在30分钟内使用注册）：' + res.data.msg.sms_code, '创建成功', {
                                        confirmButtonText: '确定',
                                        customClass:'add-user-dialog-alert',
                                        callback: action => { }
                                    });
                    }
                }
            })
        }
    },
    mounted() {
        
    }
}
</script>
<style lang="scss">
.add-user-dialog-alert {
    -webkit-user-select:text;
    -moz-user-select:text;
    -o-user-select:text;
    user-select:text;
}
#add-user-container {
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

        .msg {
            
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
            .el-date-editor--date {
                width: 100%;
            }
            .send-offline-course{
              text-align: left;
              .el-checkbox__inner {
                  border-color: #5FA137;
              }
              .is-checked{
                .el-checkbox__inner {
                    border-color: #5FA137;
                    background-color: #5FA137;
                }
              }
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
                // line-height: 0;
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
