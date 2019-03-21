<template>
    <Modal :transfer=false :title="stateName == 1 ? '添加课程' : '编辑课程'" :footer-hide="true" :styles="{top: '60px'}"
           v-model="addCourseDialogVisible" @on-cancel="handleRemoveModal(remove)" size="auto" width="654" :mask-closable="false">
        <base-input @closedialog="handleClose">
            <Row slot="body">
                <Row class="body-top" v-if="dialogIndex==1">
                    <Form  class="add-course-form" :label-position="labelPosition" :label-width="100" :rules="ruleValidate" ref="formRule">
                        <!--<Row>-->
                            <Col>
                                <FormItem label="课程名称" prop="title">
                                    <Input v-model="form.title" placeholder="请输入课程名称"></Input>
                                </FormItem>
                                <FormItem label="课程讲师" prop="teacher_id">
                                    <Select v-model="form.teacher_id" placeholder="请选择观讲师">
                                        <Option v-for="item in teacherList" :key="item.id" :label="item.name" :value="item.id"></Option>
                                    </Select>
                                </FormItem>
                                <FormItem label="科室" prop="department_id">
                                    <Select v-model="form.department_id" placeholder="请选择科室">
                                        <Option v-for="item in detpysList" :key="item.id" :label="item.name" :value="item.id"></Option>
                                    </Select>
                                </FormItem>
                                <FormItem label="年级" prop="grade_id">
                                    <Select v-model="form.grade_id" placeholder="请选择学段">
                                        <Option v-for="item in gradesList" :key="item.id" :label="item.name" :value="item.id"></Option>
                                    </Select>
                                </FormItem>
                                <FormItem label="解锁方式" prop="unlock_type">
                                    <Select v-model="form.unlock_type" placeholder="请选择解锁方式">
                                        <Option v-for="item in clearList" :key="item.id" :label="item.name" :value="item.id"></Option>
                                    </Select>
                                </FormItem>
                                <FormItem label="课程状态" prop="state">
                                    <Select v-model="form.state" placeholder="请选择课程状态">
                                        <Option v-for="item in query_state_list" :key="item.id" :label="item.name" :value="item.id"></Option>
                                    </Select>
                                </FormItem>
                               <FormItem label="课程介绍" prop="description">
                                    <Input type="textarea" :rows="7" placeholder="请输入课程介绍" v-model="form.description"></Input>
                                </FormItem>
                                <FormItem label="展示封面">
                                    <upload-panel ref="upload_panel" :resourse="form.img_default" :upload-config="uploadConfig" @uploadcomplete="handleDefaultUploadComplete">
                                        <span slot="file-require">只能上传 jpg/png 文件，且图片比例为16:9，建议尺寸768*432px</span>
                                    </upload-panel>
                                </FormItem>
                                <FormItem class="btns">
                                <!--<Button type="primary" class="next-btn" @click="handleNextStep(2)">下一步</Button>-->
                                    <Button type="primary" class="next-btn" @click="handleSubmit">保存</Button>
                                </FormItem>
                            </Col>
                            <!--<Col :span="11" :offset="2">
                                <FormItem label="开课时间">
                                    <DatePicker v-model="selectDateRange" type="daterange" placeholder="选择日期范围" :transfer="true"></DatePicker>
                                </FormItem>
                                <FormItem label="操作权限（多选）">
                                    <Select v-model="form.curriculum_roles" multiple placeholder="请选择权限">
                                        <Option v-for="item in query_teacher_roles" :key="item.id" :label="item.role_name" :value="item.role_id"></Option>
                                    </Select>
                                </FormItem>
                                <FormItem label="学科">
                                    <Select v-model="form.subject_id" placeholder="请选择学科">
                                        <Option v-for="item in query_subject_list" :key="item.id" :label="item.name" :value="item.id"></Option>
                                    </Select>
                                </FormItem>
                                <FormItem label="课程资料">
                                    <Select v-model="form.data_center_id" placeholder="请选择课程资料(没有请重新上传)">
                                        <Option v-for="item in curriculum_data_list" :key="item.id" :label="item.name" :value="item.id"></Option>
                                    </Select>
                                    <Row type='flex' justify='end'>
                                        <Button type='text' v-if='!newData.show' @click='showAddData'>新建资料</Button>
                                        <Button class='save-data' type='text' v-if='newData.show' @click='saveData'>保存资料</Button>
                                        <Button type='text' v-if='newData.show' @click='cancelAddData'>取消</Button>
                                    </Row>
                                </FormItem>
                            </Col>-->
                        <!--</Row>-->
                        <!--<Row>
                            <div class='add-download-data' v-if='newData.show'>
                                <Row type='flex' align='middle'>
                                    <Col :span='4'>资料名称：</Col>
                                    <Col>
                                        <Input v-model="newData.name" placeholder="请输入课程名称"></Input>
                                    </Col>
                                </Row>
                                <file-uploader :filters="dataFilters" maxFileCount="1" :maxFileSize="10000" @uploadComplete="uploadComplete" bucket="dscj-static-file" :dir="getDir()"/>
                            </div>

                        </Row>-->
                       <!-- <Row>

                            <Col :span="11" :offset="2">
                                <FormItem label="文字图片">
                                    <upload-panel ref="upload_panel" :resourse="form.img_3_8" :upload-config="uploadConfig" @uploadcomplete="handle38UploadComplete">
                                        <span slot="file-require">只能上传 jpg/png 文件，且图片480*180</span>
                                    </upload-panel>
                                </FormItem>
                            </Col>
                        </Row>-->
                        <!--<Row class="course-description">
                            <FormItem label="课程简介">
                                <Input type="textarea" :rows="9" placeholder="请输入内容" v-model="form.description"></Input>
                            </FormItem>
                        </Row>-->

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
                                    <CheckboxGroup v-model="unchecked_top_courses" @on-change="handleCheckedCitiesChange" class="course-item">
                                        <Checkbox class="course-option" v-for="(item, index) in query_replace_online_course_list" :key="item.id" :label="item._index">
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
                                    <CheckboxGroup v-model="checked_top_courses" @on-change="handleUnCheckedCitiesChange" class="course-item">
                                        <Checkbox class="course-option" v-for="(item, index) in top_course_list" :key="item.id" :label="item._index">
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
  import { mapActions, mapState } from 'vuex';
  import { get_detail } from '../../api/modules/tools_curriculum'
  import { cleanHtmlLabel } from '../../components/Util'
  import { Config } from '../../config/base'
  import { doTimeFormat } from '../../components/Util'
  import { MPop } from '../../components/MessagePop'
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
          state: 0,
          img_default: '',
          img_3_8: '',
          img_url_arr: null,
          description: '',
          orderby: 0,
          curriculum_roles: [0],
          pre_curriculum_ids: [],
          data_center_id: 0,
          unlock_type: 0
        },
        newData: {
          show: false,
          name: '',
          download_url: '',
          type: 1,
          project_id: 1
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
          bucket: 'dscj-app',
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
        ruleValidate:{
          title: [
            { required: true, message: '请输入课程名称', trigger: 'blur' }
          ],
          teacher_id:[
            { required: true, message: '请选择课程讲师', trigger: 'blur' }
          ],
          department_id:[
            { required: true, message: '请选择科室', trigger: 'blur' }
          ],
          grade_id:[
            { required: true, message: '请选择年级', trigger: 'blur' }
          ],
          unlock_type:[
            { required: true, message: '请选择解锁方式', trigger: 'blur' }
          ],
          state:[
            { required: true, message: '请选择课程状态', trigger: 'blur' }
          ],
          description:[
            { required: true, message: '请输入课程介绍', trigger: 'blur' }
          ]
        }
      }
    },
    mounted() {
      this.stateName = this.payload.state
      this.getListTeacher()
      this.form.unlock_type = JSON.parse(localStorage.getItem('PRODUCTINFO')).unlock_type == 1 ? 0 : JSON.parse(localStorage.getItem('PRODUCTINFO')).unlock_type
      let d = this.$config.copy(this.$store.state.online_curriculum.online_curriculum_list,[])
      if(this.payload.state == 0){
        this.form = d[this.payload.index]
        this.form.img_default = d[this.payload.index].img_url
      }
        // if (this.query_teacher_list.length === 0) this.get_teacher_list();
      // this.get_role_list();
      // this.get_subject_list();
      // this.get_grade_list();
      this.checkPayload();
      // this.get_curriculum_donwload_data_list({project_id: this.project_id});
    },
    watch: {
      query_subject_list(val) {
        this.checkPayload();
      },
      query_grade_list(val) {
        this.checkPayload();
      },
      query_teacher_list(val) {
        this.checkPayload();
      },
      query_teacher_roles(val) {
        this.checkPayload();
      },
      query_online_course_list(val) {
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
      dataFilters() {
        var str = ['doc', 'pdf', 'zip'];
        return str;
      },
      query_replace_online_course_list() {
        this.query_online_course_list.map((item, index) => {
          item._index = index < 9 ? '0' + (index + 1) : '' + ( index + 1 )
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
      getDir() {
        return 'datacenter/curriculum/' + doTimeFormat(new Date().toString());
      },
      selectCurriculumData(id) {
        this.form.data_center_id = id;
        this.cancelAddData();
      },
      showAddData() {
        this.newData.name = '';
        this.newData.download_url = '';
        this.newData.show = true;
        this.form.project_id = this.project_id;
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
      handleNextStep(idx) {
        this.dialogIndex = idx
        if (this.query_online_course_list.length === 0) this.get_online_curriculum_list(this.project_id);
      },
      handleSubmit() {
        this.$refs.formRule.validate((valid) => {
          if(valid) {
            var vm = this;
            this.form._fn = function () {
              vm.handleClose();
              vm.showPop('保存成功！', 1000);
            };
            this.getName([{list: this.teacherList, id:this.form.teacher_id, name:'teacher_name'}, {list:this.detpysList, id: this.form.department_id, name: 'department_name'}, {list: this.gradesList, id:this.form.grade_id, name:'grade_name'}])
            this.form.page = this.payload.page
            if (this.stateName == 1) {
              this.add_online_curriculum(this.form)
            }
            else {
              this.edit_online_curriculum({data: this.form});
              this.addCourseDialogVisible = false
            }
          }
        })
        // this.form.img_url_arr = {
        //   'default': this.form.img_default,
        //   '3_8': this.form.img_3_8
        // };
        // this.form.project_id = this.project_id;
        // this.form.orderby = this.query_online_course_list.length ? this.query_online_course_list[this.query_online_course_list.length - 1].orderby + 1 : 1;

        // if (this.top_course_list.length > 0 && this.checked_top_courses.length > 0) {
        //   var preList = [];
        //   for (var i = 0; i < this.top_course_list.length; i++) {
        //     preList.push(this.top_course_list[i].curriculum_id);
        //   }
        //   this.form.pre_curriculum_ids = preList;
        // }
      },
      handleRemove(file, fileList) {},
      handlePreview(file) {},
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
      checkPayload() {
        if (this.payload
          && this.query_teacher_list.length != 0
          && this.query_teacher_roles.length != 0
          && this.query_subject_list.length != 0
          && this.query_grade_list.length != 0
          && this.query_online_course_list.length != 0
          && !this.loadingInstance
          && !this.form.title) {
          this.loadingInstance = this.$LoadingY({message: "加载中，请稍后", show: true})
          setTimeout(() => {
            this.loadingInstance.close();
          }, Config.base_timeout);
          get_detail(this.payload.curriculum_id).then(res => {
            if (res.data.res_code === 1) {
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
              this.form.curriculum_roles = res.data.msg.curriculum_role ? res.data.msg.curriculum_role : [0];
              this.form.pre_curriculum_ids = res.data.msg.pre_curriculum;
              if (this.loadingInstance) this.loadingInstance.close();
              this.top_course_list = [];
              this.checked_top_courses = [];
              this.unchecked_top_courses = [];
              for (var i = 0; i < this.form.pre_curriculum_ids.length; i++) {
                for (var j = 0; j < this.query_replace_online_course_list.length; j++) {
                  if (this.query_replace_online_course_list[j].curriculum_id === this.form.pre_curriculum_ids[i]) {
                    this.top_course_list.push(this.query_replace_online_course_list[j]);
                    this.unchecked_top_courses.push(this.query_replace_online_course_list[j]._index);
                    this.checked_top_courses.push(this.query_replace_online_course_list[j]._index);
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
      getName(arr){
          arr.forEach((item, index) => {
              item.list.forEach(it => {
                  if(item.id == it.id){
                      this.form[item.name] = it.name
                  }
              })
          })
      }
    }
  }
</script>
<style scoped lang="scss">
    /deep/ .ivu-form-item-error-tip{padding: 0;}
/deep/ .upload-panel .img img { height: 250px; }
/deep/.ivu-modal-header{background-color: #ffffff !important;padding: 22px 16px;}
/deep/.ivu-modal-header-inner{
font-family: PingFangSC-Regular;
font-size: 20px !important;
color: #474C63 !important;
letter-spacing: 0;
}
/deep/ .ivu-modal-close .ivu-icon-ios-close { color:#9397AD !important;font-size: 42px !important;}
/deep/ .ivu-form-item{margin-bottom: 15px;}
/deeep/.upload-panel .upload-space{
  height: 250px !important;
}
    /deep/ .ivu-modal-body {
        padding: 30px 50px;
    }
    .btns {
        text-align: center;

        /deep/ .ivu-form-item-content{
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
</style>
