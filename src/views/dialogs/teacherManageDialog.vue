
<template>
<el-dialog title="" v-model="teacherManageDialog" @close="handleRemoveModal(remove)" :show-close="false" size="auto" :closeOnClickModal="false">
    <base-input @closedialog="handleClose">
        <Row slot="body" class="top-nav">
            <span class="dscj-webfont-remove-sign"></span>
            <el-tabs type="border-card">
                <el-tab-pane label="讲师信息">
                    <Form ref="form" :model="form" :label-width="80" class="add-teacher-form">
                        <FormItem label="讲师名称">
                            <Input v-model="form.teacher_name" placeholder="请输入课程名称"></Input>
                       </FormItem>
                        <FormItem label="讲师描述">
                            <Input type="textarea" :autosize="{ minRows: 6, maxRows: 6}" placeholder="请对讲师进行描述" v-model="form.teacher_description">
                            </Input>
                       </FormItem>
                        <FormItem label="讲师照片" class="upload-form1">
                            <upload-panel ref="upload_panel">
                                <span slot="file-require">只能上传 jpg/png 文件，且不超过1000kb</span>
                            </upload-panel>
                       </FormItem>
                        <FormItem class="btn-content">
                            <Button type="primary" class="sub-btn" @click="handleSave">保存</Button>
                       </FormItem>
                    </Form>
                </el-tab-pane>
                <el-tab-pane label="讲师课程">
                    <el-table :data="tableData" style="width: 100%" class="teacher-course-table">
                        <el-table-column prop="course_name" label="课程名称">
                          <template slot-scope="props">
                            <span class="el-icon-menu"></span>{{props.row.course_name}}
                          </template>
                        </el-table-column>
                        <el-table-column prop="date" label="创建时间" width="160">
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>
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
export default {
    mixins: [RemoveModal],
    props: {
        remove: {
            type: String
        }
    },
    data() {
        return {
            teacherManageDialog: true,
            form: {
                teacher_name: '',
                teacher_description: '',
            },
            imgSrc: '',
            file_name: '',
            upload_address: '',
            file_list: [],
            show_file_name: false,
            percentage: 0,
            form_data: null,
            is_show: true,
            tableData: [{
                date: '2016-05-02',
                name: '王小虎',
                course_name: '上海市普陀区金沙江路 1518 弄'
            }, {
                date: '2016-05-04',
                name: '王小虎',
                course_name: '上海市普陀区金沙江路 1517 弄'
            }, {
                date: '2016-05-01',
                name: '王小虎',
                course_name: '上海市普陀区金沙江路 1519 弄'
            }, {
                date: '2016-05-03',
                name: '王小虎',
                course_name: '上海市普陀区金沙江路 1516 弄'
            }]
        }
    },
    components: {
        'base-input': BaseInput,
        'upload-button': UploadButton,
        'upload-panel': UploadPanel
    },
    methods: {
        handleClose() {
            this.addOfflineCourseDialog = false;
        },
        handleSave() {
            this.$refs.upload_panel.handleSave();
        },
        handleSubmit() {

        }

    }
}
</script>
<style lang="scss">
#teacher-manage-container {

    @import "base.scss";
    textarea, input{
      resize: none;
      outline: none;
    }
    .close-dialog-panel{
      position: absolute;
      top: 10px;
      right: 13.5px;
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
            display: none;
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
            .el-tabs__header {
                background: #333333;
                border-radius: 4px 4px 0 0;
                height: 50px;
                .el-tabs__item:first-child {
                    margin-left: 0;
                    border-top-left-radius: 4px;
                }
                .el-tabs__item {
                    font-size: 16px;
                    letter-spacing: 0;
                    color: #fff;
                    height: 51px;
                    line-height: 51px;
                    padding: 0 30px;
                }
                .is-active {
                    font-size: 16px;
                    color: #141111;
                    letter-spacing: 0;
                }

            }
            .el-tabs__content {
                border-radius: 0 0 4px 4px;
                background: #fff;
                padding: 0;
            }
            .el-form {
                width: 80%;
                margin: 20px auto;
                input{
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
            .teacher-course-table {
                height: 558px;
                margin-top: -1px;
                thead {
                    div,
                    th {
                        background: #fbfbfb;
                        border: none;
                        font-size: 14px;
                        color: #757575;
                        letter-spacing: 0;
                    }
                    th:last-child {
                        background: #fbfbfb;

                    }
                    div {
                        padding-left: 40px;
                    }
                }
                tbody {
                    td {
                        border: 0;
                        text-align: left;
                        font-size: 16px;
                        letter-spacing: 0;
                        span{
                          margin-right: 10.4px;
                        }
                    }
                    td:first-child {
                        color: #141111;
                    }
                    td:last-child {
                        color: #757575;
                    }
                    div {
                        padding-left: 40px;
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
            }
            @mixin el-upload-common($w) {
                .el-upload {
                    text-align: left;
                    width: 100%;
                    .el-icon-upload {
                        color: #999999;
                    }
                    .el-dragger {
                        border-radius: 0;
                        background-color: #F6F6F6;
                        border: 1px solid #CCCCCC;
                        width: 100%;
                        height: $w;
                        .el-icon-upload {
                            margin-left: 0;
                        }

                    }
                }
            }
            .upload-form1 {
                @include el-upload-common(200px);
                .upload-space {
                    height: 200px;
                    background: #F6F6F6;
                    border: 1px solid #CCCCCC;
                    display: block;
                    .el-dragger__text {
                        font-size: 14px;
                        color: #757575;
                        letter-spacing: 0;
                        line-height: 14px;
                        margin-top: 20px;
                    }

                    .el-icon-upload {
                        font-size: 4.5em;
                        color: #999999;
                        margin-top: 40px;
                    }
                    .file-require {
                        font-size: 12px;
                        color: #757575;
                        letter-spacing: 0;
                        line-height: 20px;
                        text-align: left;
                        margin-top: 75px;
                    }
                    input[type=file] {
                        width: 100%;
                        height: 200px;
                        position: absolute;
                        top: 0;
                        right: 0;
                        margin: 0;
                        padding: 0;
                        cursor: pointer;
                        opacity: 0;
                        filter: alpha(opacity=0);
                    }
                }
            }
            .btn-content {
              padding-bottom: 8px;
                .el-form-item__content {
                    margin-left: 0 !important;
                    line-height: 0;
                    button {
                        margin-left: 0;
                        margin-top: 40px;
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
