<template>
    <Modal :transfer=false :title="payload.type == 1 ? '添加课程' : '编辑课程'" width="600px" :footer-hide="true"
           v-model="addOfflineCourseDialog" @on-cancel="handleRemoveModal(remove)" :mask-closable="false">
        <base-input @closedialog="handleClose">
            <Row slot="body">
                <Row class="body-top">
                    <Form ref="myForm" :rules="rules" :model="form" :label-width="80" class="add-offline-course-form">
                        <FormItem label="课程名称" prop="name" required>
                            <Input v-model="form.name" placeholder="请输入课程名称"></Input>
                        </FormItem>
                        <FormItem label="开课时间" prop="start_time" required>
                            <DatePicker v-model="form.start_time" type="datetime" placeholder="选择时间" :transfer="true">
                            </DatePicker>
                        </FormItem>
                        <FormItem label="结课时间" prop="end_time" required>
                            <DatePicker v-model="form.end_time" type="datetime" placeholder="选择时间" :transfer="true">
                            </DatePicker>
                        </FormItem>
                        <FormItem label="课程讲师" prop="teacher_id" required>
                            <Select v-model="form.teacher_id" placeholder="请选择讲师">
                                <Option v-for="item in query_teacher_list" :key="item.id" :label="item.name"
                                        :value="item.id"></Option>
                            </Select>
                        </FormItem>
                        <FormItem label="课程类型" prop="type" required>
                            <Select v-model="form.type" placeholder="请选择课程类型">
                                <Option label="讲座" value="1">讲座</Option>
                                <Option label="实践" value="2">实践</Option>
                            </Select>
                        </FormItem>
                        <!--<FormItem label="讲师描述" prop="teacher_description">
                            <Input type="textarea" :rows="6" placeholder="请对讲师进行描述" v-model="form.teacher_description">
                            </Input>
                       </FormItem>
                        <FormItem label="讲师照片" prop="teacher_img_url" class="upload-form1">
                            <upload-panel ref="upload_panel" :resourse="form.teacher_img_url" :upload-config="uploadConfig" @uploadcomplete="handleUploadComplete">
                                <span slot="file-require">只能上传 jpg/png 文件，且不超过1000kb</span>
                            </upload-panel>
                             <Input type="file" :change="getMyForm.teacher_img_url"></Input>
                       </FormItem>-->
                        <div class="btns">
                            <Button @click="handleSave('myForm',true)" class="btns-true">完成</Button>
                            <Button type="primary" class="finish-btn" @click="handleReset('myForm')"
                                    v-if='payload.type == 1'>继续添加
                            </Button>
                        </div>
                    </Form>
                </Row>
            </Row>
        </base-input>
    </Modal>
</template>

<script>
  import BaseInput from '../../components/BaseInput'
  import UploadButton from '../../components/UploadButton'
  import {RemoveModal} from './mixins'
  import UploadPanel from '../../components/UploadPanel'
  import {mapActions, mapState} from 'vuex';
  import dateFormat from '../../config/timeFormat'
  import {MPop} from '../../components/MessagePop'

  export default {
    mixins: [RemoveModal, MPop],
    props: {
      remove: {type: String},
      payload: {}
    },
    components: {
      'base-input': BaseInput,
      'upload-button': UploadButton,
      'upload-panel': UploadPanel
    },
    mounted() {
      if (this.$store.state.teacher.teacher_list.length == 0) {
        this.get_teacher_list();
      }
      if (this.payload.type == 2) {
        console.log(this.payload.data,'this.payload')
        // this.rules.teacher_description[0].required = true;
        // this.rules.teacher_img_url[0].required = true;
        this.form = {
          name: this.payload.data[0].title,
          teacher_id: this.payload.data[0].teacher_id,
          // stage: [this.payload.data[0].start_time, this.payload.data[0].end_time],
          start_time: new Date(this.payload.data[0].start_time),
          end_time: new Date(this.payload.data[0].end_time),
          // teacher_description: this.payload.data[0].teacher_description,
          type: this.payload.data[0].type == 1 ? '讲座' : '实践'
          // teacher_img_url: this.payload.data[0].teacher_img_url
        }
      }
    },
    computed: {
      ...mapState({
        query_teacher_list: state => state.teacher.teacher_list,
        query_teacher_roles: state => state.roles.role_list,
        query_offline_course_list: state => state.offline_curriculum.offline_curriculum_list,
        result_msg1: state => state.offline_curriculum.result_msg
      }),
      selectTeacherName() {
        for (var i = 0; i < this.query_teacher_list.length; i++) {
          if (this.form.teacher_id === this.query_teacher_list[i].id) {
            return this.query_teacher_list[i].name;
          }
        }
        return '';
      }
    },
    data() {
      return {
        addOfflineCourseDialog: true,
        uploadConfig: {
          bucket: 'dscj-app',
          dir: 'user_task',
          type: 1
        },
        form: {
          name: '',
          teacher_id: '',
          roles: [],
          // stage: [],
          start_time: '',
          end_time: '',
          teacher_description: '',
          type: '',
          teacher_img_url: ''
        },
        rules: {
          name: [{
            required: true,
            message: '请输入课程名称',
            trigger: 'blur'
          }],
          // stage: [{
          //     type: 'array',
          //     required: true,
          //     message: '请选择时间范围',
          //     trigger: 'change'
          // }],
          start_time: [{
            type: 'date',
            required: true,
            message: '请输入开课时间',
            trigger: 'change'
          }],
          end_time: [{
            type: 'date',
            required: true,
            message: '请输入结课时间',
            trigger: 'change'
          }],
          teacher_id: [{
            type: 'number',
            required: true,
            message: '请选择讲师',
            trigger: 'change'
          }],
          type: [{
            required: true,
            message: '请选择课程类型',
            trigger: 'change'
          }]
          // teacher_description: [{
          //     required: false,
          //     message: '请输入讲师描述',
          //     trigger: 'blur'
          // }],
          // teacher_img_url: [{
          //     required: false,
          //     message: '请选择讲师照片',
          //     trigger: 'change'
          // }]
        }
      }
    },
    methods: {
      ...mapActions([
        'get_teacher_list',
        'get_role_list',
        'get_offline_curriculum_list',
        'add_offline_curriculum',
        'edit_offline_curriculum'
      ]),
      handleClose() {
        this.addOfflineCourseDialog = false;
      },
      handleTypeTransform(v) {
        switch (v) {
          case 1:
            return '讲座';
          case 2:
            return '实践';
        }
      },
      handleSave(formName, closeAfterSave) {
        var vm = this;
        if (this.payload.type == 1) {
          this.$refs[formName].validate((valid) => {
            if (valid) {
              this.add_offline_curriculum({
                offline_term_id: this.payload.row.id,
                title: this.form.name,
                type: this.form.type,
                start_time: this.form.start_time,
                end_time: this.form.end_time,
                teacher_id: this.form.teacher_id,
                teacher_name: this.selectTeacherName,
                // teacher_img_url: this.form.teacher_img_url,
                // teacher_description: this.form.teacher_description,
                description: '',
                callback() {
                  if (closeAfterSave) {
                    vm.handleClose();
                    vm.showPop('添加成功！', 1000);
                  } else {
                    vm.$refs[formName].resetFields();
                  }
                }
              })
              return true;
            } else {
              return false;
            }
          });
        } else {
          this.$refs[formName].validate((valid) => {
            if (valid) {
              this.edit_offline_curriculum({
                curriculum_id: this.payload.row.childData[this.payload.index].id,
                offline_term_id: this.payload.row.id,
                title: this.form.name,
                type: this.form.type == '讲座' ? 1 : 2,
                start_time: this.form.start_time,
                end_time: this.form.end_time,
                teacher_id: this.form.teacher_id,
                teacher_name: this.selectTeacherName,
                // teacher_img_url: this.form.teacher_img_url,
                // teacher_description: this.form.teacher_description,
                description: this.form.teacher_description,
                index: this.payload.index,
                callback() {
                  if (closeAfterSave) {
                    vm.handleClose();
                    vm.showPop('修改成功！', 1000);
                  } else {
                    vm.$refs[formName].resetFields();
                  }
                }
              });
              return true;
            } else {
              return false;
            }
          });
        }
      },
      handleReset(formName) {
        this.handleSave(formName, false);
      },
      handleUploadComplete(v) {
        this.form.teacher_img_url = v;
      }
    }
  }

</script>
<style lang="scss" scoped>
    .btns {
        text-align: center;
        margin: 10px 0;
    }

    .btns-true {
        background-color: #fff;
        width: 100px;
        margin-right: 10px;
    }

    .finish-btn {
        width: 170px;
    }

    /deep/ .ivu-modal-body {
        width: 80%;
        margin-left: 10%
    }
    /deep/.ivu-modal-header{background-color: #ffffff !important;padding: 22px 16px;}
    /deep/.ivu-modal-header-inner{
    font-family: PingFangSC-Regular;
    font-size: 20px !important;
    color: #474C63 !important;
    letter-spacing: 0;
    }
    /deep/ .ivu-modal-close .ivu-icon-ios-close { color:#9397AD !important;font-size: 42px !important;}
    /deep/ .ivu-form-item{margin-bottom: 15px;}

    #add-offline-course-container {
        @import "base.scss";

        .close-dialog-panel {
            position: absolute;
            top: -70px;
            right: -10px;
            z-index: 99999;
            font-size: 30px;
            cursor: pointer;

            &:before {
                // color: #fff;
                color: #757575;
            }
        }

        input,
        textarea {
            resize: none;
            outline: none;
        }
    }
</style>
