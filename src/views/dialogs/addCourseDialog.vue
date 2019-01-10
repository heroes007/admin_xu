
<template>
<el-dialog :title="dialogIndex == 1 ? '基础信息' : '前置课程'" :show-close="false" v-model="addCourseDialogVisible" @close="handleRemoveModal(remove)" size="auto" :closeOnClickModal="false">
    <base-input @closedialog="handleClose">
        <Row slot="body">
            <Row class="body-top" v-if="dialogIndex==1">
                <el-form ref="form" :model="form" label-width="80px" class="add-course-form" :label-position="labelPosition">
                    <Row>
                        <Col :span="11">
                            <el-form-item label="课程名称">
                                <el-input v-model="form.title" placeholder="请输入课程名称"></el-input>
                            </el-form-item>
                            <el-form-item label="课程讲师">
                                <el-select v-model="form.teacher_id" placeholder="请选择观讲师">
                                    <el-option v-for="item in query_teacher_list" :key="item.id" :label="item.name" :value="item.id"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="学段">
                                <el-select v-model="form.grade_id" placeholder="请选择学段">
                                    <el-option v-for="item in query_grade_list" :key="item.id" :label="item.name" :value="item.id"></el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="课程状态">
                                <el-select v-model="form.state" placeholder="请选择课程状态">
                                    <el-option v-for="item in query_state_list" :key="item.id" :label="item.name" :value="item.id"></el-option>
                                </el-select>
                            </el-form-item>
                        </Col>
                        <Col :span="11" :offset="2">
                            <el-form-item label="开课时间">
                                <el-date-picker v-model="selectDateRange" type="daterange" placeholder="选择日期范围">
                                </el-date-picker>
                            </el-form-item>
                            <el-form-item label="操作权限（多选）">
                                <el-select v-model="form.curriculum_roles" multiple placeholder="请选择权限">
                                    <el-option v-for="item in query_teacher_roles" :key="item.id" :label="item.role_name" :value="item.role_id">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                            <el-form-item label="学科">
                                <el-select v-model="form.subject_id" placeholder="请选择学科">
                                    <el-option v-for="item in query_subject_list" :key="item.id" :label="item.name" :value="item.id"></el-option>
                                </el-select>
                            </el-form-item>
                             <el-form-item label="课程资料">
                                <el-select v-model="form.data_center_id" placeholder="请选择课程资料(没有请重新上传)">
                                    <el-option v-for="item in curriculum_data_list" :key="item.id" :label="item.name" :value="item.id"></el-option>
                                </el-select>
                                <Row type='flex' justify='end'>
                                    <el-button type='text' v-if='!newData.show' @click='showAddData'>新建资料</el-button>
                                    <el-button class='save-data' type='text' v-if='newData.show' @click='saveData'>保存资料</el-button>
                                    <el-button type='text' v-if='newData.show' @click='cancelAddData'>取消</el-button>
                                </Row>
                            </el-form-item>
                        </Col>
                    </Row>
                    <Row>
                        <div class='add-download-data' v-if='newData.show'>
                            <Row type='flex' align='middle'>
                                <Col :span='4'>
                                    资料名称：
                                </Col>
                                <Col>
                                    <el-input v-model="newData.name" placeholder="请输入课程名称"></el-input>
                                </Col>
                            </Row>
                            <file-uploader :filters="dataFilters" maxFileCount="1"
                                    :maxFileSize="10000"  @uploadComplete="uploadComplete" 
                                     bucket="dscj-static-file" :dir="getDir"/>
                        </div>
                    </Row>
                    <Row>
                        <Col :span="11">
                            <el-form-item label="展示图片">
                                <upload-panel ref="upload_panel" :resourse="form.img_default" :upload-config="uploadConfig" @uploadcomplete="handleDefaultUploadComplete">
                                    <span slot="file-require">只能上传 jpg/png 文件，且图片480*270</span>
                                </upload-panel>
                            </el-form-item>
                        </Col>
                        <Col :span="11" :offset="2">
                            <el-form-item label="文字图片">
                                <upload-panel ref="upload_panel" :resourse="form.img_3_8" :upload-config="uploadConfig" @uploadcomplete="handle38UploadComplete">
                                    <span slot="file-require">只能上传 jpg/png 文件，且图片480*180</span>
                                </upload-panel>
                            </el-form-item>
                        </Col>
                    </Row>
                    <Row class="course-description">
                        <el-form-item label="课程简介">
                            <el-input type="textarea" :rows="9" placeholder="请输入内容" v-model="form.description">
                            </el-input>
                        </el-form-item>
                    </Row>
                    <Row>
                        <el-form-item class="btns">
                            <el-button type="primary" class="next-btn" @click="handleNextStep(2)">下一步</el-button>
                        </el-form-item>
                    </Row>
                </el-form>
            </Row>
            <Row v-if="dialogIndex==2">
                <Row class="primary-course">
                    <Col :span="12">
                        <Row class="course-list-container">
                            <Row class="un-top-course">
                                <Col :span="12">
                                    <!-- <el-checkbox label="全选" name="type" v-model="checkAll" @change="handleCheckAllChange"></el-checkbox> -->
                                    可选课程
                                </Col>
                            </Row>
                            <Row class="course-list" style="height: ">
                                <el-checkbox-group v-model="unchecked_top_courses" @change="handleCheckedCitiesChange" class="course-item">
                                    <el-checkbox v-for="(item, index) in query_replace_online_course_list" :key="item.id" :label="item">
                                        <span class="course-num">{{item._index}}</span>{{item.title}}
                                    </el-checkbox>
                                </el-checkbox-group>
                            </Row>
                        </Row>
                    </Col>
                    <Col :span="12">
                        <Row class="course-list-container">
                            <Row class="top-course">
                                <Col :span="12">
                                    <!-- <el-checkbox label="全选" name="type" v-model="checkAll" @change="handleCheckAllChange"></el-checkbox> -->
                                    已选课程
                                </Col>
                            </Row>
                            <Row class="course-list">
                                <el-checkbox-group v-model="checked_top_courses" @change="handleUnCheckedCitiesChange" class="course-item">
                                    <el-checkbox v-for="(item, index) in top_course_list" :key="item.id" :label="item">
                                        <span class="course-num">{{item._index}}</span>{{item.title}}
                                    </el-checkbox>
                                </el-checkbox-group>
                            </Row>
                        </Row>
                    </Col>
                </Row>
                <Row class="btns">
                    {{this.result_msg1}}
                    <el-button type="text" @click="dialogIndex = 1" class="pre-btn">上一步</el-button>
                    <el-button type="primary" class="public-btn" @click="handleSubmit">保存</el-button>
                </Row>
            </Row>

        </Row>
    </base-input>
</el-dialog>
</template>

<script>
import BaseInput from '../../components/BaseInput'
import UploadButton from '../../components/UploadButton'
import Uploader from '../../components/Upload'
import {
    RemoveModal
} from './mixins'
import UploadPanel from '../../components/UploadPanel'
import {
    mapActions,
    mapState
} from 'vuex';
import { Loading } from 'element-ui'
import { get_detail } from '../../api/modules/tools_curriculum'
import { cleanHtmlLabel } from '../../components/Util'
import { Config } from '../../config/base'
import {
    doTimeFormat
} from '../../components/Util'
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
    data() {
        return {
            addCourseDialogVisible: true,
            videoManageDialog: true,
            form: {
                title: '',
                teacher_id: '',
                start_time: new Date(),
                end_time: new Date(),
                subject_id: 0,
                grade_id: 0,
                state:0,
                img_default: '',
                img_3_8: '',
                img_url_arr: null,
                description: '',
                orderby: 0,
                curriculum_roles: [0],
                pre_curriculum_ids: [],
                data_center_id:0,
            },
            newData:{
                show:false,
                name:'',
                download_url:'',
                type:1,
                project_id:1
            },
            dialogIndex: 1,
            labelPosition: 'top',
            panelOptions: {
                panelHeight: 158
            },
            value3: [],
            unchecked_top_courses: [],
            checked_top_courses: [],
            top_course_list: [],
            loadingInstance:null,
            // type: 1 -- 图片， 2 -- 视频
            uploadConfig: {
                bucket: 'dscj-app',
                dir: 'user_task',
                type: 1
            },
            resourse1: '',
            resourse2: ''
        }
    },
    mounted() {
        if(this.query_teacher_list.length === 0)
        {
            this.get_teacher_list();
        }
        this.get_role_list();
        this.get_subject_list();
        this.get_grade_list();
        this.checkPayload();
        this.get_curriculum_donwload_data_list({project_id: this.project_id});
    },
    watch:{
        query_subject_list(val)
        {
            this.checkPayload();
        },
        query_grade_list(val)
        {
            this.checkPayload();
        },
        query_teacher_list(val)
        {
            this.checkPayload();
        },
        query_teacher_roles(val)
        {
            this.checkPayload();
        },
        query_online_course_list(val)
        {
            this.checkPayload();
        }
    },
    computed: {
        ...mapState({
            query_subject_list: state => state.subject.subject_list,
            query_grade_list: state => state.grade.grade_list,
            query_state_list: state => state.online_curriculum.stateList,
            query_teacher_list: state => state.teacher.teacher_list,
            query_teacher_roles: state => state.roles.role_list,
            query_online_course_list: state => state.online_curriculum.online_curriculum_list,
            project_id: state => state.project.select_project_id,
            result_msg1: state => state.offline_curriculum.result_msg,
            curriculum_data_list: state => state.download_data.course_download_data_list
        }),
        dataFilters(){
            var str = ['doc','pdf','zip'];
            return str;
        },
        query_replace_online_course_list() {
            this.query_online_course_list.map((item, index) => {
                item._index = index < 10 ? '0' + (index + 1) : '' + index
            });

            return this.query_online_course_list
        },
        selectDateRange: {
            get: function() {
                return [this.form.start_time, this.form.end_time];
            },
            set: function(newVal) {
                this.form.start_time = newVal[0];
                this.form.end_time = newVal[1];
            }
        }
    },
    components: {
        'base-input': BaseInput,
        'upload-button': UploadButton,
        'upload-panel': UploadPanel,
        'file-uploader': Uploader
    },
    methods: {
        ...mapActions([
            'get_teacher_list',
            'get_role_list',
            'get_subject_list',
            'get_grade_list',
            'get_online_curriculum_list',
            'add_online_curriculum',
            'edit_online_curriculum',
            'add_course_download_data',
            'get_curriculum_donwload_data_list'
        ]),
        getDir(){
            return 'datacenter/curriculum/' + doTimeFormat(new Date().toString());
        },
        selectCurriculumData(id){
            this.form.data_center_id = id;
            this.cancelAddData();
        },
        showAddData(){
            this.newData.name = '';
            this.newData.download_url = '';
            this.newData.show = true;
            this.form.project_id = this.project_id;
        },
        cancelAddData(){
            this.newData.show = false;
        },
        saveData(){
            var vm = this;
            this.newData._fn = function(id){
                vm.selectCurriculumData(id);
            }
            this.add_course_download_data(this.newData)
        },
        uploadComplete(id,result) {
            this.newData.download_url = result.url;
        },
        handleClose() {
            this.addCourseDialogVisible = false;
        },
        handleNextStep(idx) {
            this.dialogIndex = idx
            if (this.query_online_course_list.length === 0)
                this.get_online_curriculum_list(this.project_id);
        },
        handleSubmit() {
            //            var vm = this;
            //            this.add_offline_curriculum({
            //              offline_term_id: this.payload,
            //              title: this.form.name,
            //              type: '',
            //              start_time: moment(this.form.date[0]).format('YYYY-MM-DD'),
            //              end_time: moment(this.form.date[1]).format('YYYY-MM-DD'),
            //              teacher_name: this.form.teacher_name,
            //              teacher_img_url: '',
            //              teacher_description: '',
            //              description: this.form.desc,
            //              _fn(){
            //                vm.handleClose();
            //              }
            //            })
            this.form.img_url_arr = {
                'default': this.form.img_default,
                '3_8': this.form.img_3_8
            };
            this.form.project_id = this.project_id;
            this.form.orderby = this.query_online_course_list[this.query_online_course_list.length - 1].orderby + 1;
            var vm = this;
            this.form._fn = function() {
                vm.handleClose();
                vm.showPop('保存成功！',1000);
            };
            if (this.checked_top_courses.length > 0) {
                var preList = [];
                for (var i = 0; i < this.checked_top_courses.length; i++) {
                    preList.push(this.checked_top_courses[i].curriculum_id);
                }
                this.form.pre_curriculum_ids = preList;
            }
            if(!this.payload)
                this.add_online_curriculum(this.form);
            else
            {
                this.edit_online_curriculum({curriculum_id:this.payload.curriculum_id,data:this.form});
            }
        },
        handleRemove(file, fileList) {
            console.log(file, fileList);
        },
        handlePreview(file) {
            console.log(file);
        },
        handleCheckedCitiesChange(value) {
            this.top_course_list = value;
            this.checked_top_courses = value;
        },
        handleUnCheckedCitiesChange(value) {
            // this.top_course_list = value;
            this.top_course_list = value;
            //取消已制定状态
            // this.unchecked_top_courses = _.difference(this.query_replace_online_course_list, value);
            //取消未指定选定状态
            this.unchecked_top_courses = value;
            //取消全选状态
            // this.checkAll = [];
        },
        handleCheckAllChange(event) {
            // this.checked_top_courses = event.target.checked ? this.top_course_list : [];
        },
        handleClearTop() {
            this.top_course_list = _.difference(this.top_course_list, this.checked_top_courses);
            //取消已制定状态
            this.checked_top_courses = [];
            //取消未指定选定状态
            this.unchecked_top_courses = [];
            //取消全选状态
            this.checkAll = [];
        },
        checkPayload(){
            if(this.payload
                    &&this.query_teacher_list.length != 0
                    &&this.query_teacher_roles.length != 0
                    &&this.query_subject_list.length != 0
                    &&this.query_grade_list.length != 0
                    &&this.query_online_course_list.length !=0
                    &&!this.loadingInstance
                    &&!this.form.title)
            {
                this.loadingInstance = Loading.service({ text:'加载中，请稍后',fullscreen:true });
                setTimeout(() => {
                    this.loadingInstance.close();
                }, Config.base_timeout);
                get_detail(this.payload.curriculum_id).then(res => {
                if(res.data.res_code === 1)
                {
                    this.form.title = res.data.msg.curriculum[0].title;
                    this.form.teacher_id = res.data.msg.curriculum[0].teacher_id;
                    this.form.start_time = new Date(res.data.msg.curriculum[0].start_time);
                    this.form.end_time = new Date(res.data.msg.curriculum[0].end_time);
                    this.form.subject_id = res.data.msg.curriculum[0].subject_id;
                    this.form.grade_id = res.data.msg.curriculum[0].grade_id;
                    this.form.state = res.data.msg.curriculum[0].state;
                    this.form.data_center_id = res.data.msg.data_center_id;
                    var imgList = JSON.parse(res.data.msg.curriculum[0].img_url_arr);
                    this.form.img_default = imgList.default;
                    this.form.img_3_8 = imgList['3_8'];
                    this.form.description = cleanHtmlLabel(res.data.msg.curriculum[0].description);
                    this.form.orderby = res.data.msg.curriculum[0].orderby;
                    this.form.curriculum_roles = res.data.msg.curriculum_role;
                    this.form.pre_curriculum_ids = res.data.msg.pre_curriculum;
                    this.loadingInstance.close();
                    this.top_course_list = [];
                    this.checked_top_courses = [];
                    this.unchecked_top_courses = [];
                    for(var i=0;i<this.form.pre_curriculum_ids.length;i++)
                    {
                        for(var j=0;j<this.query_replace_online_course_list.length;j++)
                        {
                            if(this.query_replace_online_course_list[j].curriculum_id === this.form.pre_curriculum_ids[i])
                            {
                                this.top_course_list.push(this.query_replace_online_course_list[j]);
                                this.unchecked_top_courses.push(this.query_replace_online_course_list[j]);
                                this.checked_top_courses.push(this.query_replace_online_course_list[j]);
                            }
                        }

                    }
                }
            });
            }

            // this.top_course_list = _.difference(this.top_course_list, this.checked_top_courses);
            // //取消已制定状态
            // this.checked_top_courses = [];
            // //取消未指定选定状态
            // this.unchecked_top_courses = [];
            // //取消全选状态
            // this.checkAll = [];

        },
        handleDefaultUploadComplete(url){
            this.form.img_default = url;
        },
        handle38UploadComplete(url){
            this.form.img_3_8 = url;
        }
    }
}
</script>
<style lang="scss">
#add-course-container {
    @import "base.scss";
    input,
    textarea {
        resize: none;
        outline: none;
    }
    .close-dialog-panel{
      position: absolute;
      top: -40px;
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
        width: 700px;
        background: none;

        .body-top {
            padding-bottom: 10px;
        }
        .el-dialog__header {
            background: #333333;
            border-radius: 4px 4px 0 0;
            padding: 16px;
        }
        .el-form-item {
            text-align: left;
            &.hide {
                opacity: 0;
                padding-bottom: 35px;
            }
        }
        .el-dialog__body {
            padding: 0;
            background: #fff;
            border-radius: 0 0 4px 4px;
            .el-icon-upload {
                margin-top: 30px;
            }
            .el-form-item__label {
                font-size: 14px;
                color: #141111;
                letter-spacing: 0;
            }
            .file-require {
                margin-top: 45px;
            }
            .course-description {
                margin-top: 45px;
                textarea {
                    background: #FFFFFF;
                    border: 1px solid #E5E5E5;
                    border-radius: 0;
                    font-size: 14px;
                    // color: #999999;
                    letter-spacing: 0;
                    line-height: 14px;
                }
            }
        }
        .add-course-form {
            padding: 30px 50px 0;
            margin: 0 auto;
            .el-date-editor--datetimerange,
            .el-select {
                width: 100%;
            }
            input {
                border-radius: 0;
                border: 1px solid #CCCCCC;
            }
            .add-download-data {
                .upload-field {
                    border: 0;
                }
            }
            .save-data {
                color:#F06B1D;
            }
            @mixin el-upload-common($_top, $w) {
                .el-upload {
                    text-align: left;
                    .el-icon-upload {
                        color: #999999;
                    }
                    .el-upload__tip {
                        font-size: 12px;
                        color: #757575;
                        letter-spacing: 0;
                        line-height: 20px;
                    }
                    .el-dragger {
                        float: left;
                        width: 240px;
                        height: $w;
                        margin-right: 10px;
                        background: #F6F6F6;
                        border: 1px solid #CCCCCC;
                        border-radius: 0;
                        .el-icon-upload {
                            margin-left: 0;
                            margin-top: $_top;
                        }
                        .el-dragger__text {
                            font-size: 14px;
                            color: #757575;
                            letter-spacing: 0;
                            line-height: 14px;
                        }
                    }
                }
            }
            .upload-form1 {
                @include el-upload-common(20px, 135px);
            }
            .upload-form2 {
                @include el-upload-common(7px, 90px);
                .el-dragger__text {
                    margin-top: -6px;
                }
            }
            .el-form-item__content {
                line-height: 0;
            }

        }
        .btns {
            text-align: center;
            .el-form-item__content {
                margin-left: 0 !important;
                button {
                    margin-left: 0;
                    margin-top: 10px;
                    margin-bottom: 4px;
                    background: #FB843E;
                    border-radius: 4px;
                    width: 200px;
                    height: 36px;
                    border: 0;
                }
            }
            .pre-btn {
                position: absolute;
                left: 20px;
                top: 30px;
                font-size: 14px;
                color: #757575;
                letter-spacing: 0;
            }
        }
        .add-description-form {
            margin: 0;
            .text-area-container {
                .el-form-item__content {
                    margin-left: 0 !important;
                    line-height: 0;
                    textarea {
                        width: 640px;
                        margin-left: -28px;
                        height: 444px;
                        background: #F6F6F6;
                        border: 1px solid #CCCCCC;
                        border-radius: 2px;
                    }
                }
            }
            .next-btn {
                background: #FB843E;
                border-radius: 4px;
                width: 200px;
                height: 36px;
                border: 0;
            }
        }
        .primary-course {
            height: 640px;
            overflow: hidden;
            border-bottom: 1px solid #E5E5E5;
            .course-num {
                margin-left: 10px;
                margin-right: 10px;
            }
            .course-list-container {

                p {
                    margin: 0;
                    text-align: left;
                    margin-bottom: 10px;
                    font-size: 14px;
                    color: #141111;
                    letter-spacing: 0;
                    line-height: 14px;
                }
            }
            .course-list {
                height: 640px;
                width: 100%;
                background: #FBFBFB;
                border-top: 1px solid #E5E5E5;
                border-right: 1px solid #E5E5E5;
                margin-left: 1px;
                overflow: auto;
                label {
                    display: block;
                    padding-left: 15px;
                    &:hover {
                        background-color: #E5E5E5;
                    }
                }
                .el-checkbox {
                    margin-left: 0;
                }
                .course-item {
                    height: 30px;
                    width: 100%;
                    line-height: 30px;
                    text-align: left;
                }
                &:first-child {
                    border-right: 0;
                }
            }

            .top-course {
                width: 100%;
                height: 36px;
                background: #FFFFFF;
                border-top: 1px solid #E5E5E5;
                border-left: 1px solid #E5E5E5;
                border-bottom: 0;
                // border-right: 1px solid #E5E5E5;
                line-height: 36px;
                padding-left: 10px;
                color: #468F19;
                .Col-12 {

                    text-align: left;
                    // .add-btn {
                    //     margin-right: 20px;
                    //     font-size: 14px;
                    //     color: #468F19;
                    //     letter-spacing: 0;
                    // }
                    // .delete-btn {
                    //     @extend .add-btn;
                    //     color: #9F350D;
                    // }
                }
                // .check-all {
                //     text-align: left;
                //     label {
                //         margin-left: 15.7px;
                //         height: 36px;
                //         line-height: 36px;
                //     }
                // }
            }
            .un-top-course {
                @extend .top-course;
            }
            .ml12 {
                margin-left: -12px;
            }
            .operation-container {
                margin-right: 4px;
                width: 80px;
                height: 420px;
                position: relative;
            }
            .operation {
                display: inline-block;
                position: absolute;
                top: 50%;
                right: 3px;
                margin-top: -40px;
                span {
                    display: inline-block;
                    width: 30px;
                    height: 30px;
                    line-height: 30px;
                    cursor: pointer;
                    &:hover {
                        background-color: #E5E5E5;
                    }
                }
            }
        }
        .public-btn {
            width: 200px;
            height: 36px;
            border: 0;
            margin-top: 27px;
            margin-bottom: 27px;
            background: #F06B1D;
            border-radius: 4px;
        }
    }
}
</style>
