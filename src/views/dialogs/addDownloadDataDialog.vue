<template>
<el-dialog :title="payload === 0?'添加公共资料':'课程资料上传'" v-model="addDownloadDataDialog" @close="handleRemoveModal(remove)" size="auto" :closeOnClickModal="false" :show-close="false">
    <base-input @closedialog="handleClose">
        <el-row slot="body">
            <el-row class="body-top" v-if="true">
                <el-form ref="form" :model="form" label-width="70px" class="add-teacher-form">
                    <el-form-item label="资料名称">
                        <el-input v-model="form.name" placeholder="请输入分类名称"></el-input>
                    </el-form-item>
                    <el-form-item label="学科" v-if='payload === 0'>
                                <el-select v-model="form.subject_id" placeholder="请选择学科">
                                    <el-option v-for="item in query_subject_list" :key="item.id" :label="item.name" :value="item.id"></el-option>
                                </el-select>
                            </el-form-item>
                    <el-form-item label="学段" v-if='payload === 0'>
                                <el-select v-model="form.grade_id" placeholder="请选择学段">
                                    <el-option v-for="item in query_grade_list" :key="item.id" :label="item.name" :value="item.id"></el-option>
                                </el-select>
                            </el-form-item>
                    <el-form-item label-width='0'>
                        <file-uploader :filters="dataFilters" maxFileCount="1"
                                    :maxFileSize="30000"  @uploadComplete="uploadComplete" 
                                    bucket="dscj-static-file" :dir='getDir()'/>
                    </el-form-item>
                    <el-form-item class="btn-content" label-width='0'>
                        <el-button type="primary" class="sub-btn" @click="saveHandler">完成</el-button>
                    </el-form-item>
                </el-form>
            </el-row>
        </el-row>
    </base-input>
</el-dialog>
</template>

<script>
import BaseInput from '../../components/BaseInput'
import {
    RemoveModal
} from './mixins'
import UploadPanel from '../../components/UploadPanel'
import Uploader from '../../components/Upload'
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
    doTimeFormat
} from '../../components/Util'
import {
    mapState,
    mapActions
} from 'vuex'
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
        'base-input': BaseInput,
        'file-uploader': Uploader
    },
    computed:{
         ...mapState({
                projectId:state => state.project.select_project_id,
            query_grade_list: state => state.grade.grade_list,
            query_subject_list: state => state.subject.subject_list,
            }),
        dataFilters(){
            var str = ['doc','pdf','zip'];
            return str;
        },
    },
    data() {
        return {
            addDownloadDataDialog: true,
            form: {
                project_id:1,
                name:'',
                subject_id:null,
                grade_id: null,
                download_url:'',
                type:0
            },
            loadingInstance: null
        }
    },
    methods: {
        ...mapActions([
            'add_course_download_data',
            'add_public_download_data'
        ]),
        getDir() {
            if(this.payload === 0)
            {
                return 'datacenter/public/' + doTimeFormat(new Date().toString());
            } 
            return 'datacenter/curriculum/' + doTimeFormat(new Date().toString());
         },
        uploadComplete(id,result) {
            this.form.download_url = result.url;
        },
        saveHandler() {
           if(this.payload === 0)
           {
               this.add_public_download_data(this.form);
           }
           else
           {
               this.add_course_download_data(this.form);
           }
        },
        handleClose() {
            this.addDownloadDataDialog = false;
        }
    },
    mounted() {
        var vm = this;
        this.form._fn = function() {
            vm.handleClose();
            vm.showPop('添加成功！',1000);
        };
        this.form.project_id = this.projectId;
        this.form.type = this.payload;
        if(this.form.type === 0)
        {
            this.form.grade_id = 0;
            this.form.subject_id = 0;
        }
    }
}
</script>
<style lang="scss">
#add-download-data-container {
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
        width: 500px;
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
            width: 90%;
            margin: 0 auto;
            .el-select {
                width: 100%;
            }
            input {
                border-radius: 0;
                border: 1px solid #CCCCCC;
            }
            
            .el-input-number {
                width: 100%;
            }
            .el-date-editor--daterange {
                width: 100%;
            }
            .btn-content {

                margin-top: 50px;
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
                .upload-field {
                    padding:16px 0;
                    border: 0;
                }
            }
            .sub-btn {
                background: #FB843E;
                border-radius: 4px;
                width: 200px;
                height: 36px;
                border: 0;
            }
            .cancel-btn {
                background: #FFFFFF;
border: 1px solid #999999;
border-radius: 4px;
width: 100px;
height: 36px;
color:#000000;
            }
        }
    }
}
</style>
