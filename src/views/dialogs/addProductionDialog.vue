<template>
<div>
    <Modal :transfer=false :title="!payload? '添加培训' : '编辑培训'" :footer-hide=true :width="654"
    v-model="addProductionDialog" @on-cancel="handleRemoveModal(remove)" >
        <base-input @closedialog="handleClose">
            <Row slot="body">
                <Row class="body-top">
                    <Form ref="form" :model="form" :label-width="fromLabelWidth" class="add-task-form">
                        <FormItem v-show="nextStep == 0" label="产品名称" required>
                            <Input v-model="form.title" placeholder="请输入产品名称"></Input>
                        </FormItem>
                        <FormItem v-show="nextStep == 0"  label="原价" required>
                            <Input placeholder="售价必须小于等于定价" v-model="form.original_price"></Input>
                        </FormItem>
                        <FormItem v-show="nextStep == 0" label="实际售价" required>
                            <Input placeholder="0为免费，单位默认（元）" v-model="form.price"></Input>
                        </FormItem>
                        <FormItem v-show="nextStep == 0" label="解锁方式" required>
                            <Select v-model="form.unlock_type" placeholder="不限/按课程/按章节/按视频">
                                <Option v-for="item in selectList1" :value="item.id" :key="item.id">{{item.title}}</Option>
                            </Select>
                        </FormItem>
                        <FormItem v-if="organizationList&&nextStep == 0" label="机构" required>
                            <Select v-model="form.organization_id" placeholder="请选择机构">
                                <Option v-for="item in organizationList" :value="item.id" :key="item.id">{{item.title}}</Option>
                            </Select>
                        </FormItem>
                        <!-- organizationList -->
                        <FormItem v-show="nextStep == 0" label="产品状态" required>
                            <Select v-model="form.state" placeholder="下架/测试/上架" @on-change="changeState">
                                <Option v-for="item in selectList2" :value="item.id" :key="item.id">{{item.title}}</Option>
                            </Select>
                        </FormItem>
                        <!--<FormItem v-show="nextStep == 0" label="荣誉证书" >
                            <Select v-model="form.certificate" multiple >
                                <Option v-for="(item, index) in certificate" :key="item.id" :value="item.id" :label="item.name"></Option>
                            </Select>
                        </FormItem>-->
                        <!--<FormItem v-show="nextStep == 0" label="跳转配置">
                            <Row class='row-container' type='flex' justify='start' align='middle'>
                            <Switch  v-model="form.redirectType" size="large">
                                <span slot="open">自定义</span><span slot="close">默认</span>
                            </Switch>
                            </Row>
                        </FormItem>
                        <FormItem v-if="nextStep == 0 && form.redirectType" label="跳转地址">
                        <Input v-model="form.h5_url" placeholder="请输入跳转地址"></Input>
                        </FormItem>-->
                        <FormItem v-show="nextStep == 0" label="产品介绍" required>
                            <Input type="textarea" :rows="6" placeholder="请输入产品介绍" v-model="form.short_description"></Input>
                        </FormItem>
                        <Tabs v-model="paneItem" v-show="nextStep == 0">
                            <TabPane label="展示图片"  :disabled="disabled1" name="displayImg">
                                <FormItem label="展示图片" v-if="nextStep == 0" required>
                                    <Row :gutter="10" class="upload-img-row">
                                        <Col class="upload-img-col" span="8" v-for="(t,i) in form.imgList" :key="i">
                                            <div class="upload-img-main">
                                                <Icon @click="deleteImgList(i)" class="upload-img-main-icon" v-if="t !== 'upload-btn'" type="ios-close-circle" />
                                                <UploadImgs v-if="t === 'upload-btn'" :imgtypes=1 bucket="dscj-app" @uploadcomplete="uploadcomplete" />
                                                <img v-else class="upload-img-item"  :src="t" />
                                            </div>
                                        </Col>
                                    </Row>
                                </FormItem>
                            </TabPane>
                            <TabPane label="展示视频" :disabled="disabled2" name="displayVideo">
                                <FormItem label="展示视频" v-show="nextStep == 0">
                                    <upload-panel :resourse='form.video_url' @uploadcomplete='uploadCompleteHandler2' :upload-config='uploaderConfig2'>
                                        <span slot="file-require">只能上传 MP4/MOV/AVI 文件，且不超过2M</span>
                                    </upload-panel>
                                </FormItem>
                            </TabPane>
                        </Tabs>
                        <FormItem v-show="nextStep == 0"> <p class="upload-img-text">* 支持jpg/png/mp4/mov/avi文件；图片可上传1～5张，建议尺寸475*250px；视频可上传1个，且大小不超过2m</p></FormItem>

                         <!--可插入输入框-->
                        <FormItem v-if="nextStep == 2" label=""  class="upload">
                            <div class="form-message" ref="inputStyl" contentEditable="true" v-html="descriptionHtml"></div>
                            <!-- <div v-if="descriptionHtml" ref="inputStyl" contentEditable="true" v-html="descriptionHtml"></div> -->
                            <div ref="divStyle" style="display: flex;margin-top: 15px;margin-left: 10px">
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
                            </div>
                        </FormItem>
                        <div v-if="nextStep == 2" class="btns">
                            <Button type='text' class='btn-pre' @click='handlePreStep'>上一步</Button>
                            <Button  class="btn-orange" @click="handleSubmit('form')">提交</Button>
                        </div>
                        <Button v-if="nextStep == 0 || nextStep == 1" class="btn-orange btn-center" @click="handleNextStep(form)">下一步</Button>
                    </Form>
                </Row>
            </Row>
        </base-input>
    </Modal>
</div>
</template>
<script>
import BaseInput from '../../components/BaseInput'
import UploadPanel from '../../components/UploadPanel'
import BaseList from '../../components/BaseList'
import { Config } from '../../config/base'
import { RemoveModal } from './mixins'
import { mapActions, mapState, mapGetters } from 'vuex'
import { get_list } from '../../api/modules/tools_curriculum'
import { get_detail, get_product_certificate } from '../../api/modules/tools_product'
import dateFormat from '../../config/dateFormat'
import { MPop } from '../../components/MessagePop'
import UploadImgs  from '../../components/UploadButton'
import UploadBtn from '../../components/UploadButton'
import iconFont from '../../../static/icon/font.png'
import iconColor from '../../../static/icon/color.png'
import iconCopy from '../../../static/icon/photo.png'
import iconFontCopy from '../../../static/icon/font_copy.png'
import iconColorCopy from '../../../static/icon/color_copy.png'
import iconCopyCopy from '../../../static/icon/photo_copy.png'
import postData from '../../api/postData';

export default {
    mixins: [RemoveModal,MPop],
    components: { 'base-input': BaseInput,'upload-panel': UploadPanel,'data-list': BaseList, UploadImgs, 'upload-btn': UploadBtn },
    props: {
        remove: {
            type: String
        },
        payload: {}
    },
    data() {
        return {
            iconFont,iconColor,iconCopy,
            addProductionDialog: true,
            unlock_type: '',
            states: '',
            selectList1: [{id: 0,title:'不限'},{id: 1,title:'按课程'},{id: 2,title:'按章节'},{id: 3,title:'按视频'}],
            show: false,
            selectList2: [{id: -1,title:'下架'},{id: 1,title:'测试'},{id: 2,title:'上架'}],
            form: {
                unlock_type: '',
                product_id: '',
                state: null,
                title:'',
                price:0,
                original_price:0,
                short_description:'',
                description:'',
                url_arr:'',
                redirectType:false,
                curriculum_id:null,
                imgList: ['upload-btn'],
                video_url:'',
                original_price:'',
                price:'',
                organization_id: null,
                _fn:null,
                description: ''
            },
            descriptionHtml: '',
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
            loadingInstance:null,
            fromLabelWidth:121,
            formItemLabelWidth:121,
            // certificate: [],
            paneItem: '',
            disabled2: true,
            disabled1: false,
            description: '',
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
            paneItem: 'displayImg',
            organizationList: null,
            formState: null,
            organizationId: null
        }
    },
    mounted() {
        this.organizationList = null
        if(JSON.parse(localStorage.getItem('PERSONALDETAILS')).role_id == 1){
            this.getOrganization()
        }
        if(this.payload && this.payload.hasOwnProperty('type') && this.payload.type == 2){
            let d = this.payload.row
            this.form.title = d.title;
            this.form.original_price = (d.price).toString();
            this.form.price = (d.original_price).toString();
            this.form.short_description = d.short_description;
            this.form.unlock_type = d.unlock_type;
            this.form.state = d.state;
            let arrObj = JSON.parse(d.url_arr);
            this.form.imgList = [...this.form.imgList,...arrObj.default]
            this.form.video_url = arrObj.video
            this.form.product_id = d.id
            // if(this.$refs.inputStyl) this.$refs.inputStyl.appendChild(d.description)
            this.descriptionHtml = d.description.replace('form-message')
            // this.form.organization_id = this.organization_id
                console.log(this.descriptionHtml,'this.descriptionHtml');
        }
        var vm = this;
        // this.form.project_id = this.projectId;
        this.form._fn = function(){
            vm.handleClose();
            vm.showPop('保存成功！');
        }
    },
    computed: {
        ...mapState({
            projectId:state => state.project.select_project_id,
            examineTypeList:state => state.production.examineTypeList,
            // certificate:state => state.production.certificate_list
        }),
        ...mapGetters({ projectType: 'select_project_type' }),
        selectSubject() {
            return this.form.subject_id;
        },
        selectGrade() {
            return this.form.grade_id;
        }
    },
    methods: {
        ...mapActions([ 'add_production', 'update_production', 'get_certificate_list', 'change_certificate_list' ]),
        overImg(val){

        },
        changeState(v){
            this.form.state = v
        },
        getOrganization(){
            postData('/components/getOrganization').then((res) => {
                this.organizationList = res.data
            })
        },
        deleteImgList(i){
            this.form.imgList.splice(i,1)
        },
        addImg(val){
            var img = new Image()
            img.src = val.url
            img.style.width = '100%'
            img.style.display = 'block'
            this.$refs.inputStyl.appendChild(img)
        },
        handleDrop(val){
            console.log(this.$refs.inputStyl,'this.$refs.inputStyl');
            this.$refs.inputStyl.style.fontSize = val + 'px'
            if(val == 32) this.$refs.inputStyl.style.fontWeight = 'bold'
            else  this.$refs.inputStyl.style.fontWeight = 'normal'
        },
        handleDrop1(val){
            this.$refs.inputStyl.style.color = val
        },
        uploadcomplete(v){
            this.disabled2 = true
            this.disabled1 = false
            if(this.form.imgList.length<6) this.form.imgList.push(v.url)
            else this.$Message.warning('最多上传5张图片');
        },
        displayVideoChage(){
            if(this.form.displayImg){
               this.$nextTick(() => {
                   this.form.displayVideo = false
               })
               this.$Message.warning('已选择图片，就不能上传视频了');
            }else{
                this.form.img_url = ''
                this.form.img_url2 = ''
                this.form.img_url3 = ''
                this.form.img_url4 = ''
                this.form.img_url5 = ''
            }
        },
        displayImgChage(){
            if(this.form.displayVideo){
                this.$nextTick(() => {
                   this.form.displayImg = false
               })
               this.$Message.warning('已选择视频，就不能上传图片了');
            }else if(this.form.video_url)  this.form.video_url = ''
        },
        uploadCompleteHandler1(url){
            this.form.img_url = url;
        },
        uploadCompleteHandler2s(url){
            this.form.img_url2 = url;
        },
        uploadCompleteHandler3(url){
            this.form.img_url3 = url;
        },
        uploadCompleteHandler4(url){
            this.form.img_url4 = url;
        },
        uploadCompleteHandler5(url){
            this.form.img_url5 = url;
        },
        uploadCompleteHandler2(url){
            this.form.video_url = url;
            this.disabled1 = true;
            this.disabled2 = false;
        },
        handleClose() {
            this.form.description = '';
            this.addProductionDialog = false;
        },
        handleNextStep(formName) {
          if(Number(this.form.price) > Number(this.form.original_price)){
            this.$Modal.info({
              title: '提示',
              content: '实际售价不能高于原价！'
            });
          }else{
            this.formState = this.form.state
            this.organizationId = this.form.organization_id
            this.fromLabelWidth = 0;
            this.formItemLabelWidth = 0
            this.nextStep = this.projectType === 1 ? ( this.nextStep === 0 ? 1 : 2 ) : 2
          }
        },
        handlePreStep() {
            this.fromLabelWidth = 121
            this.formItemLabelWidth = 121
            this.nextStep = this.projectType !== 1 ? 0 : this.nextStep === 2 ? 1 : 0
        },
        handleSubmit(name) {
            //  this.$refs[name].validate((valid) => {
            //   if (valid) {
                this.form.imgList.shift('upload-btn')
                var arrObj = {
                    default: this.form.imgList,
                    video:  this.form.video_url
                }
                this.form.state = this.formState;
                this.form.organization_id = this.organizationId;
                this.form.url_arr = JSON.stringify(arrObj);
                if(this.$refs.inputStyl) this.form.description = this.$refs.inputStyl.outerHTML
                this.form.price = Number(this.form.original_price).toFixed(2)
                this.form.original_price = Number(this.form.price).toFixed(2)
                if(this.payload)  this.update_production(this.form);
                else this.add_production(this.form);

        //    }
        // })
      }
    }
}
</script>
<style lang="scss" scoped>
/deep/ .ivu-select-selected-value, /deep/ .ivu-select-item{ letter-spacing: normal; }
/deep/ .ivu-btn{display: inline-block !important;}
/deep/.ivu-switch-large { width: 75px }
/deep/ .ivu-switch-large.ivu-switch-checked:after{ left: 55px; }
/deep/ .ivu-modal{ width: 654px !important }
/deep/ .upload-panel .img img { width: 160px;height: 148px; }
/deep/ .ivu-modal-header { background-color:#ffffff!important; padding:21px 16px;font-family: PingFangSC-Regular;font-size: 20px!important;color: #474C63!important;letter-spacing: 0!important;border-radius: 10px}
/deep/ .ivu-modal-header-inner { color:#474C63 !important; }
/deep/ .ivu-modal-close .ivu-icon-ios-close { color:#9397AD !important;font-size: 42px !important;}
/deep/ .ivu-modal-content {border-radius: 6px !important;}
/deep/ .ivu-form-item {margin-bottom: 15px;}
/deep/ .ivu-input {border-radius: 4px !important;}
.upload-img-col{
    height: 130px;
    margin-bottom: 10px;
}
.upload-img-row{
    margin: 10px 0px 0px 0px !important;
}
.upload-img-text{
    font-family: PingFangSC-Regular;
    font-size: 14px;
    color: #F54802;
    text-align: left;
}
.upload-img-main{
   width: 100%;
   height: 100%;
   border: 1px solid #C8CCDD;
   display: flex;
   align-items: center;
   justify-content: center;
   position: relative;
}
.upload-img-main-icon{
    position: absolute;
    right: 0px;
    top: 0px;
    z-index: 20;
    font-size: 20px;
    color: #fff
}
.upload-img-item{
    width: 100%;
    height: 100%;
}
 .add-task-form{
    width: 100% !important;
    padding-top: 30px;
    padding-right: 40px;
}
.btn-next{ margin-left: 20%; }
.btn-orange:hover,.btn-next:hover{
    background: #3DAAFF;
    color: #fff;
}
.btn-center{
    margin: 0 auto
}
.btn-orange{
    background: #3DAAFF;
    border: 1px solid #3DAAFF;
    border-radius: 4px;
    color: #fff;
    width: 200px;
    height: 36px;}
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
}
.btn-pre{
    color: #474C63;
    width: 150px;
    height: 36px;
    background: #FFFFFF;
    border: 1px solid #9397AD;
    border-radius: 4px;
}
 .upload-img{
     margin-left: 260px;
}
.form-message{
    padding: 0 15px;
    width: 604px;
    height: 648px;
    border: 1px solid #d7dde4;
    outline: none;
    overflow: hidden;
    overflow-y: auto;
    font-size: 16px;
    margin-left: 10px;
    text-align: left;
}
.up-img{
    margin-right: 10px;
}
</style>
