<template>
    <Modal :transfer=false :title="stateName == 1 ? '添加课程' : '编辑课程'" :footer-hide="true" :styles="{top: '60px'}"
           v-model="addCourseDialogVisible" @on-cancel="handleRemoveModal(remove)" size="auto" width="654"
           :mask-closable="false">
        <base-input @closedialog="handleClose">
            <Row slot="body">
                <Row class="body-top" v-if="dialogIndex==1">
                    <Form class="add-course-form" :label-position="labelPosition" :label-width="100"
                          :rules="ruleValidate" ref="form" :model="form">
                        <Col>
                            <FormItem label="课程名称" prop="title">
                                <Input v-model="form.title" placeholder="请输入课程名称"></Input>
                            </FormItem>
                            <FormItem label="课程讲师" prop="teacher_id">
                                <Select v-model="form.teacher_id" placeholder="请选择观讲师">
                                    <Option v-for="item in teacherList" :key="item.id" :label="item.name"
                                            :value="item.id"></Option>
                                </Select>
                            </FormItem>
                            <FormItem label="科室" prop="department_id">
                                <Select v-model="form.department_id" placeholder="请选择科室">
                                    <Option v-for="item in detpysList" :key="item.id" :label="item.name"
                                            :value="item.id"></Option>
                                </Select>
                            </FormItem>
                            <FormItem label="年级" prop="grade_id">
                                <Select v-model="form.grade_id" placeholder="请选择学段">
                                    <Option v-for="item in gradesList" :key="item.id" :label="item.name"
                                            :value="item.id"></Option>
                                </Select>
                            </FormItem>
                            <FormItem label="解锁方式" prop="unlock_type">
                                <Select v-model="form.unlock_type" placeholder="请选择解锁方式">
                                    <Option v-for="item in clearList" :key="item.id" :label="item.name"
                                            :value="item.id"></Option>
                                </Select>
                            </FormItem>
                            <FormItem label="课程状态" prop="state">
                                <Select v-model="form.state" placeholder="请选择课程状态">
                                    <Option v-for="item in query_state_list" :key="item.id" :label="item.name"
                                            :value="item.id"></Option>
                                </Select>
                            </FormItem>
                            <FormItem label="课程介绍" prop="description">
                                <Input type="textarea" :rows="7" placeholder="请输入课程介绍"
                                       v-model="form.description"></Input>
                            </FormItem>
                            <FormItem ref="upload" label="展示封面" required>
                                <upload-panel ref="upload_panel" :resourse="form.img_default" :upload-config="uploadConfig"
                                              @uploadcomplete="handleDefaultUploadComplete" :maxFileSize="2" types="image/gif, image/jpeg, image/png">
                                    <span slot="file-require" class="font-hint">*只能上传 jpg/png 文件，且图片比例为16:9，建议尺寸768*432px</span>
                                </upload-panel>
                            </FormItem>
                            <FormItem class="btns">
                                <Button type="primary" class="next-btn" @click="handleSubmit">保存</Button>
                            </FormItem>
                        </Col>
                    </Form>
                </Row>
                <Row v-if="dialogIndex==2">
                    <Row class="primary-course">
                        <Col :span="12">
                            <Row class="course-list-container">
                                <Row class="un-top-course">
                                    <Col :span="12">可选课程</Col>
                                </Row>
                                <Row class="course-list">
                                    <CheckboxGroup v-model="unchecked_top_courses"
                                                   @on-change="handleCheckedCitiesChange" class="course-item">
                                        <Checkbox class="course-option"
                                                  v-for="(item, index) in query_replace_online_course_list"
                                                  :key="item.id" :label="item._index">
                                            <span class="course-num">{{item._index}}</span>{{item.title}}
                                        </Checkbox>
                                    </CheckboxGroup>
                                </Row>
                            </Row>
                        </Col>
                        <Col :span="12">
                            <Row class="course-list-container">
                                <Row class="top-course">
                                    <Col :span="12">已选课程</Col>
                                </Row>
                                <Row class="course-list">
                                    <CheckboxGroup v-model="checked_top_courses"
                                                   @on-change="handleUnCheckedCitiesChange" class="course-item">
                                        <Checkbox class="course-option" v-for="(item, index) in top_course_list"
                                                  :key="item.id" :label="item._index">
                                            <span class="course-num">{{item._index}}</span>{{item.title}}
                                        </Checkbox>
                                    </CheckboxGroup>
                                </Row>
                            </Row>
                        </Col>
                    </Row>
                    <Row class="btns">
                        <!-- {{this.result_msg1}}
                        <Button type="text" @click="dialogIndex = 1" class="pre-btn">上一步</Button> -->
                        <Button type="primary" class="public-btn" @click="handleSubmit">保存</Button>
                    </Row>
                </Row>
            </Row>
        </base-input>
    </Modal>
</template>

<script>
    import BaseInput from '../../components/BaseInput'
    import UploadButton from '../../components/UploadButton'
    import Uploader from '../../components/Upload'
    import {RemoveModal} from './mixins'
    import UploadPanel from '../../components/UploadPanel'
    import {mapActions, mapState} from 'vuex';
    import {cleanHtmlLabel} from '../../components/Util'
    import {Config} from '../../config/base'
    import {doTimeFormat} from '../../components/Util'
    import {MPop} from '../../components/MessagePop'
    import postData from '../../api/postData'

    export default {
        mixins: [RemoveModal, MPop],
        props: {
            remove: {type: String},
            payload: {}
        },
        data() {
            return {
                addCourseDialogVisible: true,
                videoManageDialog: true,
                stateName: 1,
                form: {
                    title: '',
                    teacher_id: '',
                    start_time: new Date(),
                    end_time: new Date(),
                    subject_id: 0,
                    grade_id: 0,
                    state: this.payload.hasOwnProperty('row') && this.payload.row.state || 0,
                    img_default: '',
                    img_3_8: '',
                    img_url_arr: null,
                    description: '',
                    orderby: 0,
                    curriculum_roles: [0],
                    pre_curriculum_ids: [],
                    data_center_id: 0,
                    unlock_type: this.payload.hasOwnProperty('row') && this.payload.row.unlock_type || JSON.parse(localStorage.getItem('PRODUCTINFO')).unlock_type
                },
                newData: {
                    show: false,
                    name: '',
                    download_url: '',
                    type: 1,
                },
                dialogIndex: 1,
                labelPosition: 'left',
                panelOptions: {
                    panelHeight: 158
                },
                value3: [],
                unchecked_top_courses: [],
                checked_top_courses: [],
                top_course_list: [],
                loadingInstance: null,
                // type: 1 -- 图片， 2 -- 视频
                uploadConfig: {
                    bucket: 'jhyl-static-file',
                    dir: 'user_task',
                    type: 1
                },
                resourse1: '',
                resourse2: '',
                teacherList: [],
                detpysList: [],
                gradesList: [],
                clearList: [
                    {
                        id: 0,
                        name: '不限'
                    },
                    {
                        id: 2,
                        name: '按章节解锁'
                    },
                    {
                        id: 3,
                        name: '按视频解锁'
                    }
                ],
                ruleValidate: {
                    title: [
                        {required: true, message: '请输入课程名称', trigger: 'blur'}
                    ],
                    teacher_id: [
                        {required: true, message: '请选择课程讲师'}
                    ],
                    department_id: [
                        {required: true, message: '请选择科室'}
                    ],
                    grade_id: [
                        {required: true, message: '请选择年级'}
                    ],
                    unlock_type: [
                        {required: true, message: '请选择解锁方式'}
                    ],
                    state: [
                        {required: true, message: '请选择课程状态'}
                    ],
                    description: [
                        {required: true, message: '请输入课程介绍', trigger: 'blur'}
                    ]
                }
            }
        },
        mounted() {
            if(JSON.parse(localStorage.getItem('PRODUCTINFO')).unlock_type == 2) this.clearList = this.clearList.slice(1,2)
            else if(JSON.parse(localStorage.getItem('PRODUCTINFO')).unlock_type == 3) this.clearList = this.clearList.slice(2,3)
            this.stateName = this.payload.state
            this.getListTeacher()
            // this.form.unlock_type = JSON.parse(localStorage.getItem('PRODUCTINFO')).unlock_type == 1 ? 0 : JSON.parse(localStorage.getItem('PRODUCTINFO')).unlock_type
            if (this.payload.modify === 0) {
                let d = this.payload.row
                this.form = d
                this.form.img_default = d.img_url
            }
        },
        computed: {
            ...mapState({
                query_state_list: state => state.online_curriculum.stateList,
                query_teacher_list: state => state.teacher.teacher_list,
                query_online_course_list: state => state.online_curriculum.online_curriculum_list,
                result_msg1: state => state.offline_curriculum.result_msg,
                curriculum_data_list: state => state.download_data.course_download_data_list
            }),
            dataFilters() {
                var str = ['doc', 'pdf', 'zip'];
                return str;
            },
            query_replace_online_course_list() {
                this.query_online_course_list.map((item, index) => {
                    item._index = index < 9 ? '0' + (index + 1) : '' + (index + 1)
                });
                return this.query_online_course_list
            },
            selectDateRange: {
                get: function () {
                    return [this.form.start_time, this.form.end_time];
                },
                set: function (newVal) {
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
                'get_role_list',
                'get_online_curriculum_list',
                'add_online_curriculum',
                'edit_online_curriculum',
                'add_course_download_data',
                'get_curriculum_donwload_data_list'
            ]),
            getDir() {
                return 'datacenter/curriculum/' + doTimeFormat(new Date().toString());
            },
            selectCurriculumData(id) {
                this.form.data_center_id = id;
                this.cancelAddData();
            },
            cancelAddData() {
                this.newData.show = false;
            },
            saveData() {
                var vm = this;
                this.newData._fn = function (id) {
                    vm.selectCurriculumData(id);
                }
                this.add_course_download_data(this.newData)
            },
            uploadComplete(id, result) {
                this.newData.download_url = result.url;
            },
            handleClose() {
                this.addCourseDialogVisible = false;
            },
            handleSubmit() {
                this.$refs.form.validate((valid) => {
                    if (valid) {
                        if (this.form.img_default) {
                            var vm = this;
                            this.form._fn = function () {
                                vm.handleClose();
                                vm.showPop('保存成功！', 1000);
                            };
                            this.getName([{
                                list: this.teacherList,
                                id: this.form.teacher_id,
                                name: 'teacher_name'
                            }, {
                                list: this.detpysList,
                                id: this.form.department_id,
                                name: 'department_name'
                            }, {list: this.gradesList, id: this.form.grade_id, name: 'grade_name'}])
                            this.form.page = this.payload.page
                            if (this.stateName == 1) {
                                this.add_online_curriculum(this.form)
                            } else {
                                this.edit_online_curriculum({data: this.form});
                                this.addCourseDialogVisible = false
                            }
                        } else {
                            this.$Message.info('请上传展示封面')
                        }
                    }
                })
            },
            handleRemove(file, fileList) {
            },
            handlePreview(file) {
            },
            CheckedMap(d) {
                let d2 = []
                this.query_replace_online_course_list.map((it) => {
                    d.map((t) => {
                        if (it._index == t) d2.push(it)
                    })
                })
                return d2
            },
            handleCheckedCitiesChange(value) {
                this.top_course_list = this.CheckedMap(value)
                this.checked_top_courses = value
                // this.$forceUpdate()
            },
            handleUnCheckedCitiesChange(value) {
                // this.top_course_list = value;
                this.top_course_list = this.CheckedMap(value)
                //取消已制定状态
                // this.unchecked_top_courses = _.difference(this.query_replace_online_course_list, value);
                //取消未指定选定状态
                this.unchecked_top_courses = value
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
            handleDefaultUploadComplete(url) {
                this.form.img_default = url;
            },
            handle38UploadComplete(url) {
                this.form.img_3_8 = url;
            },
            getListTeacher() {
                postData('components/getTeachers', {organization_id: JSON.parse(localStorage.getItem('PRODUCTINFO')).organization_id}).then((res) => {
                    this.teacherList = res.data
                })
                postData('components/getDepts').then((res) => {
                    this.detpysList = res.data
                })
                postData('components/getGrades').then((res) => {
                    this.gradesList = res.data
                })
            },
            getName(arr) {
                arr.forEach((item, index) => {
                    item.list.forEach(it => {
                        if (item.id == it.id) {
                            this.form[item.name] = it.name
                        }
                    })
                })
            }
        }
    }
</script>
<style scoped lang="less">
    /deep/ .ivu-form-item-error-tip {
        padding: 0;
    }

    /deep/ .upload-panel .img img {
        height: 250px;
    }

    /deep/ .ivu-modal-header {
        background-color: #ffffff !important;
        padding: 22px 16px;
    }

    /deep/ .ivu-modal-header-inner {
        font-family: PingFangSC-Regular;
        font-size: 20px !important;
        color: #474C63 !important;
        letter-spacing: 0;
    }

    /deep/ .ivu-modal-close .ivu-icon-ios-close {
        color: #9397AD !important;
        font-size: 42px !important;
    }

    /deep/ .ivu-form-item {
        margin-bottom: 15px;
    }

    /deeep/ .upload-panel .upload-space {
        height: 250px !important;
    }

    /deep/ .ivu-modal-body {
        padding: 30px 50px;
    }

    .btns {
        text-align: center;

        /deep/ .ivu-form-item-content {
            display: flex;
            justify-content: center;
            margin: 0 !important;
        }

        .next-btn {
            width: 170px;
        }
    }

    .upload-field {
        border: none;

        /deep/ .file-name-field {
            margin-bottom: 10px;
        }
    }

    .course-list {
        height: 640px;
        overflow-y: auto;
        text-align: left;
    }

    .course-item {
        display: flex;
        flex-direction: column;
    }

    .course-option {
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        font-size: 14px;
        line-height: 28px;
    }

    .btns {
        margin-top: 30px;
        position: relative;
    }

    .pre-btn {
        position: absolute;
        left: 0;
    }

    .public-btn {
        width: 170px;
    }
    .font-hint{
        color: #F54802;
    }
</style>
