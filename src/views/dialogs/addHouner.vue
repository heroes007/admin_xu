<template>
    <Modal :transfer=false :title="payload.type == 1 ? '添加证书' : '编辑证书'" :footer-hide="true"
           v-model="addCourseDialogVisible" @on-cancel="handleRemoveModal(remove)" size="auto" width="654"
           :mask-closable="false">
        <base-input @closedialog="handleClose">
            <Row slot="body">
                <Row class="body-top" v-if="payload.type==1">
                    <Form  class="add-course-form" :label-position="labelPosition" :label-width="100">
                            <Col>
                                <FormItem label="证书名称">
                                    <Input v-model="form.title" placeholder="请输入课程名称"></Input>
                                </FormItem>
                               <FormItem label="证书描述">
                                    <Input type="textarea" :rows="9" placeholder="请输入内容" v-model="form.description"></Input>
                                </FormItem>
                                <FormItem label="证书照片">
                                    <upload-panel ref="upload_panel" :resourse="form.img_default" :upload-config="uploadConfig" @uploadcomplete="handleDefaultUploadComplete">
                                        <span slot="file-require">只能上传 jpg/png 文件，且图片480*270</span>
                                    </upload-panel>
                                </FormItem> 
                                <FormItem class="btns">
                                <!--<Button type="primary" class="next-btn" @click="handleNextStep(2)">下一步</Button>-->
                                    <Button type="primary" class="next-btn" @click="handleSubmit">保存</Button>
                                </FormItem>
                            </Col>
                    </Form>
                </Row>
                <Row class="body-top" v-if="payload.type==2">
                    <Form  class="add-course-form" :label-position="labelPosition" :label-width="100">
                            <Col>
                                <FormItem label="证书名称">
                                    <Input v-model="form.title" placeholder="请输入课程名称"></Input>
                                </FormItem>
                               <FormItem label="证书描述">
                                    <Input type="textarea" :rows="9" placeholder="请输入内容" v-model="form.description"></Input>
                                </FormItem>
                                <FormItem label="证书照片">
                                    <upload-panel ref="upload_panel" :resourse="form.img_default" :upload-config="uploadConfig" @uploadcomplete="handleDefaultUploadComplete">
                                        <span slot="file-require">只能上传 jpg/png 文件，且图片480*270</span>
                                    </upload-panel>
                                </FormItem> 
                                <FormItem class="btns">
                                <!--<Button type="primary" class="next-btn" @click="handleNextStep(2)">下一步</Button>-->
                                    <Button type="primary" class="next-btn" @click="handleSubmit">保存</Button>
                                </FormItem>
                            </Col>
                    </Form>
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
        resourse2: ''
      }
    },
    mounted() {
      if (this.query_teacher_list.length === 0) this.get_teacher_list();
      this.get_role_list();
      this.get_subject_list();
      this.get_grade_list();
      this.checkPayload();
      this.get_curriculum_donwload_data_list({project_id: this.project_id});
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
        this.form.img_url_arr = {
          'default': this.form.img_default,
          '3_8': this.form.img_3_8
        };
        this.form.project_id = this.project_id;
        this.form.orderby = this.query_online_course_list.length ? this.query_online_course_list[this.query_online_course_list.length - 1].orderby + 1 : 1;
        var vm = this;
        this.form._fn = function () {
          vm.handleClose();
          vm.showPop('保存成功！', 1000);
        };
        if (this.top_course_list.length > 0 && this.checked_top_courses.length > 0) {
          var preList = [];
          for (var i = 0; i < this.top_course_list.length; i++) {
            preList.push(this.top_course_list[i].curriculum_id);
          }
          this.form.pre_curriculum_ids = preList;
        }
        if (!this.payload) this.add_online_curriculum(this.form);
        else this.edit_online_curriculum({curriculum_id: this.payload.curriculum_id, data: this.form});
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
      }
    }
  }
</script>
<style scoped lang="scss">
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
