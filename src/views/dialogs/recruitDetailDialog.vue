<template>
<el-dialog title="报名详情" v-model="recruitDetailDialog" @close="handleRemoveModal(remove)" size="auto" :closeOnClickModal="false" :show-close="false">
    <base-input @closedialog="handleClose">
        <Row slot="body">
            <Row class="body-top">
                <Form ref="form" :model="form" :label-width="80" class="add-teacher-form">
                    <FormItem label="ID">
                         <Input v-model="form.user_id" disabled></Input>
                   </FormItem>
                    <FormItem label="姓名">
                         <Input v-model="form.realname" placeholder="请输入考生真实姓名"></Input>
                   </FormItem>
                    <FormItem label="电话">
                         <Input v-model="form.phone" placeholder="请输入考生电话"></Input>
                   </FormItem>
                    <FormItem label="选择学段">
                        <Select v-model="form.grade_id" placeholder="请选择学段">
                            <Option v-for="item in gradeList" :key="item.id" :label="item.name" :value="item.id"></Option>
                        </Select>
                   </FormItem>
                    <FormItem label="选择学科" >
                        <Select v-model="form.subject_id" placeholder="请选择学科">
                            <Option v-for="item in subjectList" :key="item.id" :label="item.name" :value="item.id"></Option>
                        </Select>
                   </FormItem>
                    <!--<FormItem label="笔试成绩">
                         <Select v-model="form.written_result" placeholder="请选择学段">
                            <Option v-for="item in written_results" :key="item.id" :label="item.name" :value="item.id"></Option>
                        </Select>
                   </FormItem>-->
                    <FormItem label="笔试成绩">
                         <Input v-model="form.written_result" placeholder="请输入考生笔试成绩"></Input>
                   </FormItem>
                    <FormItem label="出生年月">
                        <el-date-picker v-model="form.birth" type="date" placeholder="选择日期">
                        </el-date-picker>
                   </FormItem>
                    <FormItem label="邮箱">
                         <Input v-model="form.email" placeholder="请输入考生邮箱"></Input>
                   </FormItem>
                    <FormItem label="所在院校">
                         <Input v-model="form.school" placeholder="请输入考生所在院校"></Input>
                   </FormItem>
                    <FormItem label="所学专业">
                         <Input v-model="form.school_subject" placeholder="请输入考生所学专业"></Input>
                   </FormItem>
                     <FormItem label="在读年级">
                         <Input v-model="form.school_grade" placeholder="请输入考生在读年级"></Input>
                   </FormItem>
                     <FormItem label="期望就业城市" :label-width='100'>
                         <Input v-model="form.ex_citys" placeholder="请输入考生期望就业城市"></Input>
                   </FormItem>
                    <FormItem label="验证图片">
                         <img :src="form.certificate"/>
                   </FormItem>
                    <!--<FormItem class="btn-content">
                        <Button type="primary" class="sub-btn" @click="saveHandler" :v-if='false'>保存</Button>
                   </FormItem>-->
                </Form>
            </Row>
        </Row>
    </base-input>
</el-dialog>
</template>

<script>
import BaseInput from '../../components/BaseInput'
import BaseList from '../../components/BaseList'
import {
    RemoveModal
} from './mixins'
import UploadPanel from '../../components/UploadPanel'
import {
    get_signup_info
} from '../../api/modules/exam'
import {
    Loading
} from 'element-ui'
import {
    Config
} from '../../config/base'
import {
    mapState
} from 'vuex'
export default {
    mixins: [RemoveModal],
    props: {
        remove: {
            type: String
        },
        payload: {}
    },
    components: {
        'base-input': BaseInput,
        'data-list': BaseList
    },
    data() {
        return {
            recruitDetailDialog: true,
            form: {
                user_id:0,
                realname:'',
                phone:'',
                grade_id:0,
                subject_id:0,
                written_result:0,
                birth:null,
                email:'',
                school:'',
                school_subject:'',
                school_grade:'',
                ex_citys:'',
                certificate:'',
                _fn: null
            },
            searchType:'phone',
            searchData:'',
            userList:[],
            loadingInstance: null,
            isSend: false
        }
    },
    computed: {
        ...mapState({
            subjectList:state => state.subject.subject_list,
            gradeList:state => state.grade.grade_list,
            written_results:state => state.recruit.result_list
        })
    },
    methods: {
        saveHandler() {
            if (this.payload.sid) {
                this.$store.dispatch('edit_student', this.form);
            } else {
                var formInline = this.form;
                this.$store.dispatch('add_student', formInline);
                formInline.callback = () => {
                  this.handleClose();
                  setTimeout(()=>{
                    this.$alert('成功创建学员!', '提示', {
                        confirmButtonText: '确定',
                        callback: action => {}
                    });
                  }, 800)
                }
            }
        },
        handleClose() {
            this.recruitDetailDialog = false;
        }
    },
    mounted() {
        this.$store.dispatch('get_grade_list');
        this.$store.dispatch('get_subject_list');

        var vm = this;
        this.form._fn = function() {
            vm.handleClose();
        };

            this.loadingInstance = Loading.service({
                text:'加载中，请稍后',
                fullscreen: true
            });
            setTimeout(() => {
                this.loadingInstance.close();
            }, Config.base_timeout);
            get_signup_info(this.payload).then(res => {

                if (res.data.res_code === 1) {
                    this.form = res.data.msg;
                    this.form._fn = function() {
                        vm.handleClose();
                    };
                    this.loadingInstance.close();
                }
            })
    }
}
</script>
<style lang="scss">
#recruit-detail-container {
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
        .search-bar {
            .select-user {
                margin-right: 10px;
            }

            .el-input-group {
            width: 380px;
            .el-input__inner {
                height: 36px;
            }
            .el-input-group__append {
                background-color: #7ab854;

                .el-button {
                    height: 100%;
                    width: 80px;
                    color: #ffffff;
                    font-size: 16px;
                }
            }
            .el-input-group__prepend {
                background-color: #7ab854;

                .el-select {
                    height: 100%;
                    width: 110px;
                    color: #ffffff;
                    font-size: 16px;
                }

                i {
                    color: #ffffff;
                }
            }
        }

            .btn-clear {
                margin-left: 20px;
                color:#7ab854;
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
            img {
                width: 100%;
                display: block;
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
