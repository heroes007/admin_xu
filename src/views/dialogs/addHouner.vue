<template>
    <Modal :transfer=false :title="payload.type == 1 ? '添加证书' : '编辑证书'" :footer-hide="true"
           v-model="addCourseDialogVisible" @on-cancel="handleRemoveModal(remove)" size="auto" width="654"
           :mask-closable="false">
        <base-input @closedialog="handleClose">
            <Row slot="body">
                <Row class="body-top">
                    <Form ref="formHouner" class="add-course-form" :model="form" :rules="rules"
                          :label-position="labelPosition" :label-width="100">
                        <Col>
                            <FormItem label="证书名称" prop="name">
                                <Input v-model="form.name" placeholder="请输入证书名称"></Input>
                            </FormItem>
                            <FormItem v-show="organizationList&&organizationList.length>0" label="所属机构"
                                      prop="organization_id">
                                <Select v-model="form.organization_id" placeholder="请选择所属机构" disabled>
                                    <Option v-for="item in organizationList" :value="item.id" :key="item.id">
                                        {{item.title}}
                                    </Option>
                                </Select>
                            </FormItem>
                            <FormItem label="证书描述">
                                <Input type="textarea" :rows="9" placeholder="请输入内容" v-model="form.detail"></Input>
                            </FormItem>
                            <FormItem label="证书照片" required>
                                <upload-panel ref="upload_panel" :resourse="form.img_url" :upload-config="uploadConfig"
                                              @uploadcomplete="handleDefaultUploadComplete"  :maxFileSize="2">
                                    <span slot="file-require">只能上传 jpg/png 文件，且图片480*270,大小不超过2M</span>
                                </upload-panel>
                            </FormItem>
                            <FormItem class="btns">
                                <Button v-if="payload.type==2" type="error" class="next-btn" style="width: 120px;"
                                        @click="handleDelete">删除证书
                                </Button>
                                <Button type="primary" class="next-btn" :style="payload.type==2 ? btnStyl : ''"
                                        @click="handleSubmit('formHouner')">保存
                                </Button>
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
  import {mapActions, mapState} from 'vuex';
  import {cleanHtmlLabel} from '../../components/Util'
  import {Config} from '../../config/base'
  import {doTimeFormat} from '../../components/Util'
  import {MPop} from '../../components/MessagePop'
  import postData from 'src/api/postData';
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
          organization_id: '',
          detail: '',
          name: '',
          img_url: ''
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
          bucket: 'jhyl-static-file',
          dir: 'user_task',
          type: 1
        },
        resourse1: '',
        resourse2: '',
        organizationList: null,
        btnStyl: 'margin-left: 40px;',
        rules: {
          name: {required: true, message: '请输入证书名称'},
          organization_id: {required: true, message: '请选择所属机构'}
        }
      }
    },
    mounted() {
      if (JSON.parse(localStorage.getItem('PERSONALDETAILS')).role_id == 1) this.getOrganization()
      this.$store.commit('set_houner_state', false)
      if (this.payload.hasOwnProperty('row')) this.form = this.payload.row
      this.form.organization_id = JSON.parse(localStorage.getItem('PRODUCTINFO')).organization_id
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
        'add_course_download_data',
        'get_curriculum_donwload_data_list'
      ]),
      getDir() {
        return 'datacenter/curriculum/' + doTimeFormat(new Date().toString());
      },
      getOrganization() {
        postData('/components/getOrganization').then((res) => {
          this.organizationList = res.data
        })
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
      handleNextStep(idx) {
        this.dialogIndex = idx
        if (this.query_online_course_list.length === 0) this.get_online_curriculum_list(this.project_id);
      },
      handleDelete() {
        let d = this.payload.row;
        if (d.state) this.$Message.info('证书使用中，请先解除关联。')
        else {
          this.$Modal.confirm({
            title: '提示',
            content: '<p>删除证书后所有统计数据不可查看，是否确认删除</p>',
            onOk: () => {
              postData('/product/remove_honour_certificate', {id: d.id}).then((res) => {
                this.addCourseDialogVisible = false;
                this.$store.commit('set_houner_state', true)
              })
            },
            onCancel: () => {
            }
          });
        }
      },
      handleSubmit(name) {
        this.$refs[name].validate((valid) => {
          if (valid) {
            if (this.form.img_url) {
              let url = this.payload.hasOwnProperty('row') ? '/product/modify_honour_certificate' : '/product/add_new_honour_certificate';
              postData(url, this.form).then((res) => {
                this.addCourseDialogVisible = false;
                this.$store.commit('set_houner_state', true)
              })
            } else this.$Message.warning('请上传证书照片');
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
        this.form.img_url = url;
      }
    }
  }
</script>
<style scoped lang="scss">
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
        margin-bottom: 20px;
    }
    /deeep/ .upload-panel .upload-space {
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
        /deep/ .ivu-form-item-content {
            display: flex;
            justify-content: center;
        }
    }
    .pre-btn {
        position: absolute;
        left: 0;
    }
    .public-btn {
        width: 170px;
    }
</style>
