<template>
  <Modal v-model="show" :title="title" :width="590" @on-cancel="closeModal"  :mask-closable=false :footer-hide="true" >
      <div v-if="uploadFlie" class="upload-flie">
           <Upload ref="upload" :show-upload-list="false" action="http://dscj-app.oss-cn-qingdao.aliyuncs.com/" :format="['jpg','jpeg','png']" :data="uploadData"
          :before-upload="handleBeforeUpload" :on-format-error="handleFormatError" >
                <div v-if="!headImg" class="modal-upload-flie">
                    <img class="upload-flie-img" src="/static/icon/upload.png"/>
                    <p>点击上传</p>
                </div>
                <img v-if="headImg" class="upload-flie-img-2" :src="headImg"/>
            </Upload>
      </div>
       <Form ref="formValidate" :model="formItem" :label-width="100" :rules="ruleValidate ? ruleValidate : {}">
           <div v-for="(t,index) in formList" :key="index">
                <FormItem v-if="t.type==='input'" :label="t.name" :prop="t.field">
                    <Input v-model="formItem[t.field]" :placeholder="'请输入'+t.name"></Input>
                </FormItem>
                <FormItem v-if="t.type==='textarea'" :label="t.name" :prop="t.field">
                     <Input type="textarea" :rows="6" v-model="formItem[t.field]" :placeholder="'请输入'+t.name"></Input>
                </FormItem>
                <!-- input-number -->
                 <FormItem v-if="t.type==='input-number'" :label="t.name" :prop="t.field">
                      <InputNumber :disabled="t.disable" :min='0' v-model="formItem[t.field]" :placeholder="'请输入'+t.name"></InputNumber>
                </FormItem>
                 <FormItem v-if="t.type==='select'&&t.selectList.length>0" :label="t.name" :prop="t.field">
                    <Select v-model="formItem[t.field]">
                        <Option v-for="(m,i) in t.selectList" :key="i" :value="m[t.selectField[0]]">{{m[t.selectField[1]]}}</Option>
                    </Select>
                </FormItem>
                <!-- switch-datetimerange-->
                <FormItem v-if="(t.type==='switch') || (t.type.includes('date'))" :label="t.name" :prop="handleField(t,1)">
                     <Switch class="form-item-swtich" size="large" v-if="t.switchList&&t.switchList.length>0" v-model="formItem[handleField(t,0)]" @on-change="switchChange" >
                         <span slot="open">{{t.switchList[0]}}</span>
                         <span slot="close">{{t.switchList[1]}}</span>
                    </Switch>
                    <DatePicker class="form-item-date" v-if="handleDateShow(t)" :type="handleType(t)" format="yyyy/MM/dd HH:mm" v-model="formItem[handleField(t,1)]"
                    :placeholder="handlePlaceholder(t)" ></DatePicker>
                </FormItem>
           </div>
        </Form>
        <div class="form-item-other">
            <slot name="form-other"></slot>
        </div>
        <p v-if="modalText" class="modal-text">* 获得九划后台所有操作权限</p>
        <div class="foot-btn">
             <Button class="btn-orange" type="primary" @click="handleSubmit('formValidate')">保存</Button>
        </div>
    </Modal>
</template>
<script>
import { get_sign } from '../api/modules/ali_oss'
import axios from 'axios'
const ossHostImage = 'http://dscj-app.oss-cn-qingdao.aliyuncs.com/';
export default {
    props:{
        showModal: {
            type: Boolean,
            default: false
        },
        title: {
          type: String,
          default: ''
        },
        detailData: {
          type: Object,
          default: () => {}
        },
        modalText: {
            type: Boolean,
            default: false
        },
        // [
        //     { type: 'input', name: '真实姓名',  field: 'realname'},
        //     { type: 'select', name: '管理权限', field: 'jurisdiction' ,
        //     selectList: [ { value: 'New York', label: 'New York'} ],
        //     selectField: [ 'value','label' ]
        //     }
        // ]
       formList: {
          type: Array,
          default: []
       },
       ruleValidate: {
          type: Object,
          default: {}
       },
       uploadFlie: {
            type: Boolean,
            default: false
       }
    },
    data (){
        return{
            show: false,
            formItem: {},
            uploadData: {},
            headImg: '',
            resourse_url: '',
            uploadConfig: {
                bucket: 'dscj-app',
                dir: 'user_task',
                type: 1
            }
        }
    },
    watch:{
        showModal(_new){
            this.ModalState(_new)
            this.$nextTick(() => {
                this.formItem = this.detailData
            })
        },
        detailData(_new){
           this.formItem = _new
        },
        formList(_new){
            this.formList = _new
        }
    },
    methods: {
        handleDateShow(t){
            return t.type==='switch-datetimerange' ? !this.formItem[this.handleField(t,0)] : true
        },
        handlePlaceholder(t){
            return t.type==='switch-datetimerange' ? '请选择'+t.name + '范围' : '请选择'+t.name
        },
        handleType(t){
            return t.type==='switch-datetimerange' ? 'datetimerange' : t.type
        },
        handleField(t,n){
            return t.type==='switch-datetimerange' ? t.field[n]: t.field
        },
        closeModal(){
            this.show = false;
            this.$emit("close")
        },
        handleFormatError (file) {
            this.$Message.warning('请上传图片');
        },
        switchChange(_new){

        },
        ModalState(_new){
            this.show = _new
            console.log(this.projectList);
        },
        handleBeforeUpload(file){
            this.handleGetassignKey(file);
            return false
        },
        handleSubmit(name){
            this.$emit('handleSubmit',this.formItem)
            this.$refs[name].validate((valid) => {
                if (valid) {
                    this.$Message.success('Success!');
                    this.closeModal()
                } else {
                    this.$Message.error('Fail!');
                }
            })
        },
        // 上传到oss上
        handleUploadFile(form_data, url, fileItem) {
                var vm = this;
                axios({
                    method: 'POST',
                    url: url,
                    data: form_data,
                    onUploadProgress: function (progressEvent) {
                        var progress = Math.round(progressEvent.lengthComputable ? progressEvent.loaded *
                            100 / progressEvent.total : 0);
                        vm.percentage = progress;
                    },
                }).then(res => {
                    this.headImg = url + this.resourse_url;
                });
            },
         // 从oss上获取assignKey;
        handleGetassignKey(file_item) {
            var date = new Date(); //dscj-app,user_task
            date = date.toGMTString();
            get_sign(file_item.type, date, this.uploadConfig.bucket, this.uploadConfig.dir, file_item.name, 'POST')
                .then(res => {
                    if (res.data.res_code == 1) {
                        const formData = new FormData();
                        this.resourse_url = res.data.msg.filename;
                        formData.append('key', res.data.msg.filename);
                        formData.append('OSSAccessKeyId', res.data.msg.accessKeyID);
                        formData.append('success_action_status', '200');
                        formData.append('signature', res.data.msg.sign);
                        formData.append('policy', res.data.msg.policyBase64);
                        formData.append('file', file_item);
                        this.handleUploadFile(formData, encodeURI(ossHostImage));
                    }
                })
        },
    }
}
</script>
<style lang="less" scoped>
/deep/ .ivu-modal-header{background: #fff !important; padding: 0 !important;}
/deep/ .ivu-modal-close .ivu-icon-ios-close{ color:#9397AD !important; }
/deep/ .ivu-modal-header-inner{
    font-family: PingFangSC-Regular !important;
    font-size: 20px !important;
    color: #474C63 !important;
    height: 70px;
    line-height: 70px;
}
/deep/ .ivu-modal-body{
    padding: 40px;
}
.modal-text{
     margin-left: 100px;
     font-family: PingFangSC-Regular;
    font-size: 14px;
    color: #F54802;
}
.btn-orange{
    width: 150px;
}
.foot-btn{ display: flex; justify-content: center;margin-top: 30px; }
.upload-flie{ display: flex; justify-content: center;margin-bottom: 20px; }
.modal-upload-flie{
    width: 118px;
    height: 118px;
    background: #F0F0F7;
    border-radius: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
}
.upload-flie-img{ width: 40px;height: 35px; }
.upload-flie-img-2{width: 118px;height: 118px; border-radius: 100px}
/deep/ .ivu-form-item-content{ display: flex; }
.form-item-swtich{
    width: 80px;
    height: 34px;
    margin-right: 20px;
    line-height: 34px;
}
/deep/ .ivu-switch:after{ width: 30px;height: 30px; }
/deep/ .ivu-form-item-label{ font-size: 16px }
.form-item-date{flex:1}
/deep/ .ivu-switch-inner{left: 36px ;}
/deep/ .ivu-switch-checked .ivu-switch-inner{ left: 12px;}
/deep/ .ivu-switch-large.ivu-switch-checked:after{left: 48px;}
.form-item-other {padding-left: 100px;}
</style>

