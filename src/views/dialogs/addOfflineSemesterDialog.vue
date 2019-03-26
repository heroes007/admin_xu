<template>
    <Modal :transfer=false v-model="addOfflineSemesterDialog" :title="payload.type == 2 ? '编辑学期' : '添加学期'" @on-cancel="handleRemoveModal(remove)" size="auto"
           :footer-hide="true" :mask-closable="false" :styles="{width: '640px'}" style="border-radius:6px !important" :closable="true">

        <base-input :baseInputWidth="600" @closedialog="handleClose">
            <Row slot="body" class="top-nav">
                <Form ref="myForm1" label-position="left" :rules="rules1" :model="form1" :label-width="120">
                    <FormItem label="学期名称" prop="title" required>
                        <Input v-model="form1.title" placeholder="请输入学期名称"></Input>
                    </FormItem>
                    <FormItem label="开课日期" prop="stage1">
                        <DatePicker v-model="form1.stage1" type="daterange" format="yyyy/MM/dd" placeholder="请选择时间范围" :transfer="true"></DatePicker>
                    </FormItem>
                    <FormItem label="报名截止" prop="register_end_time">
                        <DatePicker v-model="form1.register_end_time" type="date" format="yyyy/MM/dd" placeholder="请选择报名截止" :picker-options="pickerOptions" @on-change='changeDeadlineHandler' :transfer="true"></DatePicker>
                    </FormItem>
                    <FormItem label="学期描述" class="semester-description" prop="description" required>
                        <Input type="textarea" :rows="8" placeholder="请输入学期描述内容" v-model="form1.description"></Input>
                    </FormItem>
                    <div style="text-align: center">
                        <Button style="margin: 40px 227px" type="primary" class="sub-btn" @click="handleSubmit('myForm1')">保存</Button>
                    </div>
                </Form>
            </Row>
        </base-input>
    </Modal>
</template>

<script>
  import BaseInput from '../../components/BaseInput'
  import UploadButton from '../../components/UploadButton'
  import { RemoveModal } from './mixins'
  import UploadPanel from '../../components/UploadPanel'
  import { mapActions, mapState } from 'vuex'
  import dateFormat from '../../config/dateFormat'
  import { MPop } from '../../components/MessagePop'
  import postData from '../../api/postData.js'
  export default {
    mixins: [RemoveModal, MPop],
    props: {
      remove: {
        type: String
      },
      payload: {}
    },
    components: { 'base-input': BaseInput, 'upload-button': UploadButton, 'upload-panel': UploadPanel },
    data() {
      return {
        addOfflineSemesterDialog: true,
        form1: {
          title: this.payload.row && this.payload.row.title || '',
          stage1: this.payload.row && [this.payload.row.start_time, this.payload.row.register_end_time] || [],
          description: this.payload.row && this.payload.row.description || '',
          register_end_time: this.payload.row && this.payload.row.register_end_time || null,
          state: this.payload.row && this.payload.row.state || 0
        },
        form2: {
          name2: '',
          stage2: [],
          level2: 0,
          description2: '',
          semester: ''
        },
        rules1: {
          title: [{
            required: true,
            message: '请输入学期名称',
            trigger: 'blur'
          }],
          stage1: [{
            type: 'array',
            required: true,
            fields: { 0: {type: 'date', required: true, message: '请输入开课日期'},1: {type: 'date', required: true, message: '请输入结课日期'}}
          }],
          description: [{
            required: true,
            message: '请输入学期描述内容',
            trigger: 'blur'
          }],
          register_end_time: [{type: 'date', required: true, message: '请选择报名截止'}],
        },
        rules2: {
          semester: [{
            required: true,
            type: 'number',
            message: '请选择学期名称',
            trigger: 'change'
          }]
        }
      }
    },
    computed: {
      ...mapState({
        result_msg1: state => state.offline_curriculum.result_msg,
        subject1: state => state.subject.subject_list,
        offline_term_list1: state => state.offline_curriculum.offline_term_list
      }),
      pickerOptions() {
        var vm = this;
        if (this.form1.stage1 && this.form1.stage1.length > 0) {
          return {
            disabledDate(time) {
              return time.getTime() >= new Date(vm.form1.stage1[0]).getTime();
            }
          }
        }
        return {}
      }
    },
    methods: {
      ...mapActions([ 'add_offline_term', 'edit_offline_term', 'get_subject_list', 'get_offline_term_list' ]),
      handleClose() {
        this.addOfflineSemesterDialog = false;
      },
      handleSelectItem(idx) {
        this.form2.name2 = this.offline_term_list1[idx].name;
        this.form2.stage2 = [this.offline_term_list1[idx].start_time, this.offline_term_list1[idx].register_end_time];
        this.form2.level2 = this.offline_term_list1[idx].level || '';
        this.form2.description2 = this.offline_term_list1[idx].description || '';
      },
      handleSave(formName) {
        var vm = this;
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.add_offline_term({
              project_id: 1,
              name: vm.form2.name2,
              level: vm.form2.level2,
              description: vm.form2.description2,
              start_time: dateFormat(vm.form2.stage2[0]),
              register_end_time: dateFormat(vm.form2.stage2[1]),
              callback() {
                vm.handleClose();
                vm.showPop('添加成功！', 1000);
              }
            })
          } else {
            return false;
          }
        });
      },
      handleSubmit(formName) {
        let vm = this;
        this.$refs[formName].validate((valid) => {
          if (valid) {
           let obj = vm.payload.type == 1 ? {subject_id: JSON.parse(localStorage.getItem('OffLineClassTheme')).id} : {term_underline_id: vm.payload.row.id}
           let url = vm.payload.type == 1 ? 'product/curriculum_offline/term_add' : '/product/curriculum_offline/term_change'
            let d = {
              ...obj,
              title: vm.form1.title,
              description: vm.form1.description,
              start_time: dateFormat(vm.form1.stage1[0]),
              end_time: dateFormat(vm.form1.stage1[1]),
              register_end_time: dateFormat(vm.form1.register_end_time),
            }
            postData(url, d).then((res) => {
                if(res.res_code == 1){
                  this.$Message.success(res.msg);
                  this.addOfflineSemesterDialog = false;
                    let d = {
                    subject_id: JSON.parse(localStorage.getItem('OffLineClassTheme')).id,
                    page_size: vm.payload.page_size,
                    page_num:  vm.payload.page_num
                  }
                  this.$store.dispatch('get_offline_term_list', d);
                }
            })
          }
        });
      },
      changeDeadlineHandler() {
        if (this.form1.stage1 && this.form1.stage1.length > 0 && this.form1.register_end_time) {
          if (new Date(this.form1.register_end_time.getTime() - this.form1.stage1[0]).getTime() > (0)) {
            this.$Modal.warning({
              title: '提示',
              content: '截止日期需小于开课日期！'
            });
            this.form1.register_end_time = this.payload.row && this.payload.row.register_end_time || null
          }
        }
      }
    }
  }
</script>

<style scoped lang="scss">
    .sub-btn {
        width: 170px;
    }
    .ivu-modal-close .ivu-icon-ios-close, .ivu-modal-close .ivu-icon-ios-close:hover {
        color: #999 !important;
    }
    /deep/ .ivu-modal-close .ivu-icon-ios-close, /deep/ .ivu-modal-close .ivu-icon-ios-close:hover {
        color: #999 !important;
    }

    /deep/ .ivu-tabs-nav .ivu-tabs-tab:hover {
        color: #3DAAFF
    }
    /deep/ .ivu-form-item-content {
        text-align: left;
    }
    /deep/ textarea.ivu-input{
        resize: none;
    }
    /deep/.ivu-modal-header{background-color: #ffffff !important;padding: 22px 16px;}
    /deep/.ivu-modal-header-inner{
    font-family: PingFangSC-Regular;
    font-size: 20px !important;
    color: #474C63 !important;
    letter-spacing: 0;
    }
    /deep/ .ivu-modal-close .ivu-icon-ios-close { color:#9397AD !important;font-size: 42px !important;}
    /deep/ .ivu-form-item{margin-bottom: 22px;}
    #add-offline-semester-container {
        @import "base.scss";
        input,
        textarea {
            resize: none;
            outline: none;
        }
        .close-dialog-panel {
            position: absolute;
            top: 10px;
            right: 13.5px;
            z-index: 99999;
            font-size: 30px;
            cursor: pointer;

            &:before {
                // color: #fff;
                color: #757575;
            }
        }
    }

</style>
