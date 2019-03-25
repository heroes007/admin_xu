<template>
    <div>
        <ExchangeContent title="兑换内容" :show-modal="exchangeContentShow" :list="exchangeContentList" @close="exchangeContentClose" @selectChecked="exchangeContentChecked" />
        <Modal v-model="show" :title="title" :width="645" @on-cancel="closeModal"  :mask-closable=false :footer-hide="true" >
            <div v-if="uploadFlie" class="upload-flie">
                <Upload ref="upload" :show-upload-list="false" action="http://dscj-app.oss-cn-qingdao.aliyuncs.com/" :format="['jpg','jpeg','png']" :data="uploadData" accept="image/jpeg,image/png,image/jpg,image/bmp"
                        :before-upload="handleBeforeUpload" :on-format-error="handleFormatError" >
                    <div v-if="!img_url" class="modal-upload-flie">
                        <img class="upload-flie-img" src="../assets/icons/icon/upload.png"/>
                        <p>点击上传</p >
                    </div>
                    <img v-if="img_url" class="upload-flie-img-2" :src="img_url"/>
                </Upload>
            </div>
            <Form ref="formValidate" :model="formItem" :label-width="100" :rules="ruleValidate ? ruleValidate : {}">
                <div v-for="(t,index) in formList" :key="index">
                    <FormItem v-if="t.type==='input'" :label="t.name" :prop="t.field">
                        <Input v-model="formItem[t.field]" :placeholder="'请输入'+t.name"></Input>
                    </FormItem>
                    <FormItem v-if="t.type==='password'" :label="t.name" :prop="t.field">
                        <Input type="password" v-model="formItem[t.field]" :placeholder="'请输入'+t.name"></Input>
                    </FormItem>
                    <FormItem v-if="t.type==='inputTab'" :label="t.name" :prop="t.field">
                        <Input disabled :value="t.content"></Input>
                    </FormItem>
                    <FormItem v-if="t.type==='textarea'" :label="t.name" :prop="t.field">
                        <Input type="textarea" :rows="6" v-model="formItem[t.field]" :placeholder="'请输入'+t.name"></Input>
                    </FormItem>
                    <!-- input-number -->
                    <FormItem v-if="t.type==='input-number'" :label="t.name" :prop="t.field">
                        <InputNumber :disabled="t.disable" :min='0' v-model="formItem[t.field]" :placeholder="'请输入'+t.name"></InputNumber>
                    </FormItem>
                    <!-- 处理兑换码 -- 兑换内容 exchange_content -->
                    <FormItem v-if="t.type==='select'&&t.selectList.length>0&&t.exchange_content" :label="t.name" :prop="t.field">
                        <Select class="exchange-content-select" v-model="formItem[t.field]" @on-open-change="exchangeContentOpen" :placeholder="'请选择'+t.name">
                            <Option v-for="(m,i) in t.selectList" :key="i" :value="m[t.selectField[0]]">{{m[t.selectField[1]]}}</Option>
                        </Select>
                    </FormItem>
                    <FormItem v-else-if="t.type==='select'&&t.selectList.length>0&&t.change" :label="t.name" :prop="t.field">
                        <Select v-model="formItem[t.field]" :placeholder="'请选择'+t.name" :disabled="t.disable">
                            <Option v-for="(m,i) in t.line == 1 ? t.selectList[0] : t.selectList[1]" :key="i" :value="m[t.selectField[0]]">{{m[t.selectField[1]]}}</Option>
                        </Select>
                    </FormItem>
                    <FormItem v-else-if="t.type==='select'&&t.selectList.length>0" :label="t.name" :prop="t.field" :class="t.clas ? t.clas: ''">
                        <Select v-model="formItem[t.field]" :placeholder="'请选择'+t.name" :disabled="t.disable"  @on-change="selectChange">
                            <Option v-for="(m,i) in t.selectList" :key="i" :value="m[t.selectField[0]]">{{m[t.selectField[1]]}}</Option>
                        </Select>
                    </FormItem>
                    <!-- date datetime -->
                     <FormItem v-if="t.type == 'date'" :label="t.name" :prop="t.field">
                        <DatePicker class="form-item-date" type="date" v-model="formItem[t.field]"
                              :format="handleDateType(t)"  :placeholder="handlePlaceholder(t)" ></DatePicker>
                    </FormItem>
                    <!-- switch-datetimerange-->
                    <FormItem v-if="(t.type==='switch')" :label="t.name" :prop="handleField(t,1)">
                        <Switch class="form-item-swtich" size="large" v-if="t.switchList&&t.switchList.length>0" v-model="formItem[handleField(t,0)]" @on-change="switchChange" >
                            <span slot="open">{{t.switchList[0]}}</span>
                            <span slot="close">{{t.switchList[1]}}</span>
                        </Switch>
                        <DatePicker class="form-item-date" v-if="handleDateShow(t)" :type="handleType(t)" :format="handleDateType(t)" v-model="formItem[handleField(t,1)]"
                                 :value="formItem[handleField(t,1)]"  :placeholder="handlePlaceholder(t)" ></DatePicker>
                    </FormItem>
                    <!--可插入输入框-->
                    <FormItem v-if="(t.type==='upload')" :label="t.name" :prop="t.field" class="upload" ref="formInput" >
                        <div class="form-message" ref="inputStyle" contentEditable="true" v-html="descriptionHtml"></div>
                        <div ref="divStyle" style="display: flex;margin-top: 15px;">
                            <Dropdown trigger="click" @on-click="handleDrop">
                                <a href="javascript:void(0)"><img :src="iconFont" alt="" class="up-img" @mouseover="overImg"></a >
                                <DropdownMenu slot="list">
                                    <DropdownItem v-for="(item, index) in fontList" :name="item.size" :key="index">{{item.name}}</DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                            <Dropdown trigger="click" @on-click="handleDrop1">
                                <a href="javascript:void(0)"><img :src="iconColor" alt="" class="up-img"></a >
                                <DropdownMenu slot="list">
                                    <DropdownItem v-for="(item, index) in colorList" :name="item.color" :key="index">
                                        <span class="drop-box" :style="{backgroundColor: item.color}"/>
                                        <span>{{item.name}}</span>
                                    </DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                            <upload-btn bucket="dscj-app" :iconType="iconCopy" @uploadcomplete="addImg" type="image/jpeg,image/png,image/jpg,image/bmp"/>
                            <upload-btn v-if="uploadBtn" class="upload-img" text="上传附件" bucket="dscj-app" @uploadcomplete="uploadImg"/>
                        </div>
                        <down-loading :formData="downList"/>
                    </FormItem>
                </div>
            </Form>
            <p v-if="modalText2" class="modal-text">* {{modalText2}}</p >
            <div class="foot-btn">
                <Button class="btn-orange" type="primary" @click="handleSubmit('formValidate')">保存</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
  import { get_sign } from '../api/modules/ali_oss'
  import axios from 'axios'
  const ossHostImage = 'http://dscj-app.oss-cn-qingdao.aliyuncs.com/';
  import ExchangeContent from './ExchangeContent'
  import uploadBtn from '../components/UploadButton'
  import downLoading from './DownLoading'
  import iconFont from '../assets/icons/icon/font.png'
  import iconColor from '../assets/icons/icon/color.png'
  import iconCopy from '../assets/icons/icon/photo.png'

  export default {
    components: { ExchangeContent, uploadBtn, downLoading },
    props:{
      modalFalse: {
        type: Boolean,
        default: false
      },
      showModal: {
        type: Boolean,
        default: false
      },
      dateTimes: {
        type: Boolean,
        default: false
      },
      //控制上传附件按钮
      uploadBtn: {
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
        type: String,
        default: ''
      },
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
        descriptionHtml: '',
        iconFont,iconColor,iconCopy,
        exchangeContentShow: false,
        exchangeContentList: [],
        show: false,
        formItem: {},
        copyFormItem: {},
        uploadData: {},
        img_url: '',
        resourse_url: '',
        uploadConfig: {
          bucket: 'dscj-app',
          dir: 'user_task',
          type: 1
        },
        downList:[],
        fontList:[
          {
            name: '标题',
            size: 32,
            weight: true
          },
          {
            name: '小标题',
            size: 24
          },
          {
            name: '正文',
            size: 16
          },
        ],
        colorList:[
          {
            name: '红色',
            color: '#f00'
          },
          {
            name: '绿色',
            color: '#0f0'
          },
          {
            name: '蓝色',
            color: '#00f'
          },
        ],
        color: '',
        modalText2: '',
        imgUrl: ''
      }
    },
    watch:{
      modalText(_new){
        this.modalText2 = _new
      },
      showModal(_new){
        this.ModalState(_new)
        this.$nextTick(() => {
          if(_new){
            this.formItem = this.dateTimes ? this.detailData : this.$config.copy(this.detailData,{})
            if(this.formItem.upload) this.downList = this.formItem.upload
            else this.downList = []
            if(this.formItem.uploading) {
              this.descriptionHtml = this.formItem.uploading
              this.descriptionHtml = this.descriptionHtml.replace('class="form-message"','')
            } else this.descriptionHtml = ''
            if(this.formItem.hasOwnProperty('img_url')){
              this.img_url = this.formItem.img_url
            }else this.img_url = ''
            if(this.formItem.hasOwnProperty('password')){
              this.formItem.password = this.formItem.password.slice(0,6)
            }
            this.copyFormItem = this.$config.copy(this.formItem,{});
            this.modalText2 = this.modalText;
          }
          else this.$refs.formValidate.resetFields()
        })
      },
      show(val){
        if(!val) {
          // this.$refs.formValidate.resetFields()
          if(this.$refs.inputStyle) this.$refs.inputStyle[0].innerHTML = ''
        }
      },
      detailData(_new){
        this.detailData = _new
      },
      formList(_new){
        this.formList = _new
      },
    },
    methods: {
      selectChange(val){
        if(val == 'online') this.formList[2].line = 1
        else if(val == 'underline') this.formList[2].line = 0
        if(this.modalText2){
          if(val == 3) this.modalText2 = '获得所属机构后台发布产品及动态等操作权限'
          if(val == 4) this.modalText2 = '获得所属机构后台批阅作业等操作权限'
        }
      },
      handleDateType(t){
        return t.type.includes('time') ? 'yyyy/MM/dd HH:mm' : 'yyyy/MM/dd'
      },
      overImg(val){
        console.log(val);
      },
      handleColor(){
        // this.$refs.color[0].$el.children[0].children[0].click()
      },
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
        // this.formItem = {};
        this.$refs.formValidate.resetFields();
        this.$emit("close");
      },
      handleFormatError (file) {
        this.$Message.warning('请上传图片');
      },
      switchChange(_new){

      },
      exchangeContentChecked(t){
        this.formItem[this.formList[2].field] = t.id
      },
      exchangeContentClose(){
        this.exchangeContentShow = false
      },
      exchangeContentOpen(v){
        this.exchangeContentShow = true
        this.exchangeContentList = this.formList[2].selectList
      },
      ModalState(_new){
        this.show = _new
      },
      handleBeforeUpload(file){
        this.handleGetassignKey(file);
        return false
      },
      handleFormData(){
        if(this.uploadFlie) this.formItem.img_url = this.img_url
        if(this.$refs.inputStyle) this.formItem.uploading = this.$refs.inputStyle[0].outerHTML
        if(this.downList&&this.downList.length>0) this.formItem.downList = this.downList
        if(this.formItem.hasOwnProperty('password')){
          if(this.copyFormItem.password === this.formItem.password){
            delete this.formItem.password
          }
        }
        let d = this.$config.copy(this.formItem,{})
        let close = () => {  if(!this.modalFalse) this.closeModal() }
        ( async () => {
          await  this.$emit('from-submit',this.formItem)
          await  close()
        } )()
      },
      handleSubmit(name){
        let d = this.$refs.inputStyle&&this.$refs.inputStyle[0].innerText || this.imgUrl
        this.$refs[name].validate((valid) => {
          if (valid) {
            if(this.formList.length === 3&&this.formList[2].type === 'upload'&&!d) this.$Message.warning('请输入文章正文');
            else if(this.uploadFlie&&!this.img_url) this.$Message.warning('请上传头像');
            else if(this.formList.length>4&&this.formList[4].type==='switch-datetimerange'){
              if(!this.formItem.isswitch&&!this.formItem.effective_time[0]) this.$Message.success('请选择有效时间');
              else this.handleFormData()
            }else this.handleFormData()
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
          this.img_url = url + this.resourse_url;
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
              this.resourse_url = res.data.data.filename;
              formData.append('key', res.data.data.filename);
              formData.append('OSSAccessKeyId', res.data.data.accessKeyID);
              formData.append('success_action_status', '200');
              formData.append('signature', res.data.data.sign);
              formData.append('policy', res.data.data.policyBase64);
              formData.append('file', file_item);
              this.handleUploadFile(formData, encodeURI(ossHostImage));
            }
          })
      },
      uploadImg(val){
        this.downList.push(val)
        this.formItem.downList = this.downList
      },
      addImg(val){
        var img = new Image()
        img.src = val.url
        img.style.width = '100%'
        img.style.display = 'block'
        this.$refs.inputStyle[0].appendChild(img)
        this.imgUrl = val.url
      },
      handleDrop(val){
        this.$refs.inputStyle[0].style.fontSize = val + 'px'
        if(val == 32) this.$refs.inputStyle[0].style.fontWeight = 'bold'
        else  this.$refs.inputStyle[0].style.fontWeight = 'normal'
      },
      handleDrop1(val){
        this.$refs.inputStyle[0].style.color = val
      }
    },
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
    .form-item-other {padding-left: 30px;}
    .exchange-content-select /deep/ .ivu-select-dropdown{display: none !important;}
    /*/deep/ .ivu-modal-wrap{ display: flex;align-items: center; }*/
    /*/deep/ .ivu-modal{top: 0}*/
    .upload{
        /deep/ .ivu-input{height: 400px;}
        /deep/ .ivu-form-item-content{flex-direction: column}
    }
    .upload-img{
        margin-left: 260px;
    }
    .form-message{
        padding: 0 15px;
        width: 475px;
        height: 300px;
        border: 1px solid #d7dde4;
        outline: none;
        overflow: hidden;
        overflow-y: auto;
        font-size: 16px;
    }
    .up-img{
        margin-right: 10px;
    }
    .drop-box{
        width: 10px;
        height: 10px;
        display: inline-block;
        margin-right: 10px;
    }
    /deep/ .ivu-input[disabled]{
        font-family: PingFangSC-Regular;
        color: #474C63;
    }
</style>
