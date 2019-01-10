<template>
<el-dialog :title="!payload? '创建产品' : '编辑产品'" :show-close="false" v-model="addProductionDialog" @close="handleRemoveModal(remove)" size="auto" :closeOnClickModal="false">
    <base-input @closedialog="handleClose">
        <Row slot="body">
            <Row class='curriculum-list' v-if='nextStep == 1'>
                <Row class='title' type='flex' justify='start' align='middle'>
                    <h2>添加课程：（只能选择一个课）</h2>
                </Row>
                <Row class='search-bar' type='flex' justify='start' align='middle'>
                    <Col :span="18">
                        <el-input v-model="searchData" placeholder="请输入搜索内容"></el-input>
                    </Col>
                    <Col :span="6">
                        <el-button class="sub-btn" type="primary" @click="searchCurriculum">查询</el-button>
                        <el-button class="sub-btn" type="primary" @click="clearSearch">清除</el-button>
                    </Col>
                </Row>
                <Row>
                    <data-list class='data-list light-header' @changeSelect='changeRowSelectHandler' :table-data='curriculumList'
            :header-data='dataHeader'></data-list>
                </Row>
            </Row>
            <Row class="body-top">
                <el-form ref="form" :model="form" label-width="121px" class="add-task-form">
                    <el-form-item v-show="nextStep == 0" label="编码">
                        <el-input v-model="form.code" placeholder="请输入产品编码"></el-input>
                    </el-form-item>
                    <el-form-item label='考试类型'>
                    <el-select v-model="form.examine_type" placeholder="请选择考试类型">
                        <el-option v-for="item in examineTypeList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                    <el-form-item v-show="nextStep == 0" label="产品名称">
<el-input v-model="form.title" placeholder="请输入产品名称"></el-input>
                    </el-form-item>
                    <el-form-item v-show="nextStep == 0" label="定价">
                        <el-input placeholder="0为免费，单位默认（元）" v-model="form.show_original_price"></el-input>
                    </el-form-item>
                    <el-form-item v-show="nextStep == 0" label="真实售价">
                        <el-input placeholder="售价必须小于等于定价" v-model="form.show_price"></el-input>
                    </el-form-item>
                    <el-form-item v-show="nextStep == 0" label="跳转配置">
                        <Row class='row-container' type='flex' justify='start' align='middle'>
<el-switch
  v-model="form.redirectType"
  on-text="自定义"
  off-text="默认"
  :width='75'>
</el-switch>  
                        </Row>
                  </el-form-item>
                    <el-form-item v-if="nextStep == 0 && form.redirectType" label="跳转地址">
<el-input v-model="form.h5_url" placeholder="请输入跳转地址"></el-input>
                    </el-form-item>
                    <el-form-item label="展示图片" v-if="nextStep == 0">
                                <upload-panel ref="upload_panel" :resourse="form.img_url" :upload-config="uploadConfig" @uploadcomplete="uploadCompleteHandler1">
                                    <span slot="file-require">只能上传 jpg/png 文件，且图片480*270</span>
                                </upload-panel>
                            </el-form-item>
                                                <el-form-item v-show="nextStep == 0" label="产品视频">
                        <Row class='row-container' type='flex' justify='start' align='middle'>
                        <el-switch
  v-model="form.displayVideo"
  on-text="使用"
  off-text="不使用"
  :width='75'>
</el-switch>  
                        </Row>
                    </el-form-item>
                            <el-form-item label="展示视频" v-if="nextStep == 0 && form.displayVideo">
                                <upload-panel :resourse='form.video_url' @uploadcomplete='uploadCompleteHandler2' :upload-config='uploaderConfig2'>
                                <span slot="file-require">只能上传 MP4/MOV/AVI 文件，且不超过2M</span>
                            </upload-panel>
                            </el-form-item>
                    <el-form-item v-show="nextStep == 0" label="产品简介">
                        <el-input type="textarea" :rows="6" placeholder="请输入产品简介" v-model="form.short_description">
                        </el-input>
                    </el-form-item>
                    <el-form-item v-show="nextStep == 2" label="编辑产品课程图文详情:" label-width='160px'>
                    </el-form-item>
                    <el-form-item v-show="nextStep == 2" label="" label-width='0'>
                        <text-editor ref='description_editor' :content='form.description'/>
                    </el-form-item>
                    <el-form-item class="btns">
                        <el-button type='text' v-show='nextStep == 2 || nextStep == 1' class='btn-pre' @click='handlePreStep'>上一步</el-button>
                        <el-button v-show="nextStep == 2" class="btn-orange" @click="handleSubmit('form')">提交</el-button>
                        <el-button v-show="nextStep == 0 || nextStep == 1" class="btn-orange" @click="handleNextStep('form')">下一步</el-button>
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
    mapState,
    mapGetters
} from 'vuex';
import {
   get_list
} from '../../api/modules/tools_curriculum'
import {
    get_detail
} from '../../api/modules/tools_product'
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
            addProductionDialog: true,
            form: {
                project_id:0,
                product_id:0,
                code:'',
                title:'',
                price:0,
                original_price:0,
                short_description:'',
                description:'',
                img_url_arr:'',
                h5_url:'',
                redirectType:false,
                displayVideo:false,
                curriculum_id:null,
                img_url:'',
                video_url:'',
                show_price:'',
                show_original_price:'',
                examine_type:0,
                _fn:null
            },
            nextStep: 0,
            isInited: false,
            uploadConfig: {
                bucket: 'dscj-app',
                dir: 'production',
                type: 1
            },
            uploaderConfig2:{
                bucket:'dscj-static-file',
                dir:'video/production',
                type:4
            },
            searchData:'',
            curriculumList:[],
            loadingInstance:null
        }
    },
    mounted() {
        if(this.projectType === 1)
        {
            get_list(this.projectId).then(res => {
                if(res.data.res_code === 1)
                {
                    for(var i=0;i<res.data.msg.length;i++)
                    {
                        res.data.msg[i].is_valid = false;
                    }
                    this.curriculumList = res.data.msg;
                    this.checkCurriculum();
                }
            })
        }

        if(this.payload)
        {
            this.loadingInstance = Loading.service({
                text:'加载中，请稍后',
                    fullscreen: true
                });
                setTimeout(() => {
                    this.loadingInstance.close();
                }, Config.base_timeout);
            this.form.product_id = this.payload.id;
            get_detail(this.payload.id).then(res => {
                if(res.data.res_code === 1)
                {
                    this.form.code = res.data.msg.code;
                    this.form.title = res.data.msg.title;
                    this.form.show_price = (res.data.msg.price / 100).toString();
                    this.form.show_original_price = (res.data.msg.original_price / 100).toString();
                    this.form.short_description = res.data.msg.short_description;
                    this.form.description = res.data.msg.description;
                    this.form.curriculum_id = res.data.msg.curriculum_id;
                    this.form.h5_url = res.data.msg.h5_url;
                    this.form.examine_type = res.data.msg.examine_type;
                    if(this.form.h5_url)
                        this.form.redirectType = true;

                    var arrObj = JSON.parse(res.data.msg.img_url_arr);
                    this.form.img_url = arrObj.default;
                    this.form.video_url = arrObj.video;
                    if(this.form.video_url)
                        this.form.displayVideo = true;
                    this.checkCurriculum();
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
            projectId:state => state.project.select_project_id,
            examineTypeList:state => state.production.examineTypeList
        }),
        ...mapGetters({
            projectType: 'select_project_type'
        }),
        selectSubject() {
            return this.form.subject_id;
        },
        selectGrade() {
            return this.form.grade_id;
        },
        dataHeader() {
             return [{
                    label:'排序',
                    width:90,
                    sort:true
                }, {
                    prop: 'teacher_name',
                    label: '讲师',
                    width: 150
                }, {
                    prop: 'title',
                    label: '课程名称'
                },  {
                    label: '操作',
                    width: 100,
                    groupBtn: [{
                        text: '',
                        param: 'changeSelect',
                        switchKey:'is_valid',
                        useCheckBox:true
                    }]
                }]
        }
    },
    methods: {
        ...mapActions([
            'add_production',
            'update_production'
        ]),
        checkCurriculum() {
            if(this.curriculumList.length > 0 && this.form.curriculum_id)
            {
                for(var i=0;i<this.curriculumList.length;i++)
                {
                    if(this.curriculumList[i].curriculum_id === this.form.curriculum_id)
                    {
                        this.curriculumList[i].is_valid = true;
                    }
                }
            }
        },
        clearSearch(){
            this.searchData = '';
            get_list(this.projectId).then(res => {
                if(res.data.res_code === 1)
                {
                    for(var i=0;i<res.data.msg.length;i++)
                    {
                        res.data.msg[i].is_valid = false;
                    }
                    this.curriculumList = res.data.msg;
                    this.checkCurriculum();
                }
            })
        },
        searchCurriculum() {
            get_list(this.projectId,this.searchData).then(res => {
                if(res.data.res_code === 1)
                {
                    for(var i=0;i<res.data.msg.length;i++)
                    {
                        res.data.msg[i].is_valid = false;
                    }
                    this.curriculumList = res.data.msg;
                    this.checkCurriculum();
                }
            })
        },
        changeRowSelectHandler(row) {
            if(row.is_valid)
            {
                for(var i=0;i<this.curriculumList.length;i++)
                {
                    if(this.curriculumList[i].curriculum_id !== row.curriculum_id)
                    {
                        this.curriculumList[i].is_valid = false;
                    }
                    else
                    {
                        this.form.curriculum_id = row.curriculum_id;
                    }
                }
            }
            else
            {
                this.form.curriculum_id = null;
            }
        },
        uploadCompleteHandler1(url){
            this.form.img_url = url;
        },
        uploadCompleteHandler2(url){
            this.form.video_url = url;
        },
        handleClose() {
            this.form.description = '';
            this.addProductionDialog = false;
        },
        handleNextStep(formName) {
            if(this.projectType === 1)
            {
                if(this.nextStep === 0)
                    this.nextStep = 1;  
                else
                    this.nextStep = 2;
            }
            else
            {
                this.nextStep = 2;
            }
        },
        handlePreStep() {
            if(this.projectType === 1)
            {
                if(this.nextStep === 2)
                {
                    this.nextStep = 1;
                }
                else
                {
                    this.nextStep = 0;
                }
            }
            else
                this.nextStep = 0;
        },
        handleSubmit() {
            var arrObj = {
                default:this.form.img_url,
                video:this.form.video_url
            }
            var description= this.$refs.description_editor.editor.getContent();
            this.form.description = description;
            this.form.img_url_arr =JSON.stringify(arrObj);
             this.form.price = Math.round(parseFloat(this.form.show_price) * 100);
             this.form.original_price = Math.round(parseFloat(this.form.show_original_price) * 100);

             if(this.form.price > this.form.original_price)
             {
                this.$alert('真实售价不能高于定价！', '提示', {
                                        confirmButtonText: '确定',
                                        callback: action => { }
                                    });
                                    return;
             }

            if(this.payload)
            {
                this.update_production(this.form);
            }
            else
            {
                this.add_production(this.form);
            }
        }
    },
    components: {
        'base-input': BaseInput,
        'upload-panel': UploadPanel,
        'text-editor':Editor,
        'data-list': BaseList,
    },
}
</script>
<style lang="scss">
#add-production-container {
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

        .curriculum-list {
            .title {
                padding: 0 20px;
                h2 {
                    font-size: 16px;
                }
            }
            .search-bar {
                padding: 0 20px;
                margin-bottom: 20px;
                .el-button {
                    background: #FB843E;
                    border-radius: 4px;
                    border:0;
                }
            }
        }

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
            
            .row-container {
                height:36px;
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
