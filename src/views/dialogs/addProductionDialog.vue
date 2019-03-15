<template>
<div>
    <Modal :transfer=false :title="!payload? '添加培训' : '编辑培训'" :footer-hide=true :width="654"
    v-model="addProductionDialog" @on-cancel="handleRemoveModal(remove)" >
        <base-input @closedialog="handleClose">
            <Row slot="body">
                <Row class='curriculum-list' v-if='nextStep == 1'>
                    <Row class='title' type='flex' justify='start' align='middle'>
                        <h2>添加课程：（只能选择一个课）</h2>
                    </Row>
                    <Row class='search-bar' type='flex' justify='start' align='middle'>
                        <Col :span="18">
                            <Input v-model="searchData" placeholder="请输入搜索内容"></Input>
                        </Col>
                        <Col :span="6">
                            <Button class="sub-btn" type="primary" @click="searchCurriculum">查询</Button>
                            <Button class="sub-btn" type="primary" @click="clearSearch">清除</Button>
                        </Col>
                    </Row>
                    <Row>
                    <data-list class='data-list light-header' @changeSelect='changeRowSelectHandler' :table-data='curriculumList' :header-data='dataHeader'></data-list>
                    </Row>
                </Row>
                <Row class="body-top">
                    <Form ref="form" :model="form" :label-width="fromLabelWidth" class="add-task-form">
                        <FormItem v-show="nextStep == 0" label="产品名称">
                            <Input v-model="form.title" placeholder="请输入产品名称"></Input>
                        </FormItem>
                        <FormItem v-show="nextStep == 0" style="letter-spacing:14px;" label="原价">
                            <Input placeholder="售价必须小于等于定价" v-model="form.original_price"></Input>
                        </FormItem>
                        <FormItem v-show="nextStep == 0" label="实际售价">
                            <Input placeholder="0为免费，单位默认（元）" v-model="form.price"></Input>
                        </FormItem>
                        <FormItem v-show="nextStep == 0" label="解锁方式">
                            <Select v-model="form.unlock_type" placeholder="不限/按课程/">
                                <Option v-for="item in selectList1" :value="item.id" :key="item.id">{{item.title}}</Option>
                            </Select>
                        </FormItem>
                        <FormItem v-show="nextStep == 0" label="产品状态">
                            <Select v-model="form.state" placeholder="推荐/已上架/已下架/测试中">
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
                        <FormItem v-show="nextStep == 0" label="产品介绍">
                            <Input type="textarea" :rows="6" placeholder="请输入产品介绍" v-model="form.short_description"></Input>
                        </FormItem>
                        <Tabs v-model="paneItem" v-show="nextStep == 0">
                            <TabPane label="展示图片"  :disabled="disabled1" name="displayImg">
                                <FormItem label="展示图片" v-if="nextStep == 0">
                                    <Row :gutter="10" class="upload-img-row">
                                        <Col class="upload-img-col" span="8" v-for="(t,i) in form.imgList" :key="i">
                                            <div class="upload-img-main">
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

                         <!--可插入输入框-->
                        <FormItem v-if="nextStep == 2" label=""  class="upload">
                            <div class="form-message" ref="inputStyl" contentEditable="true"></div>
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
                                <upload-btn bucket="dscj-app" :iconType="iconCopy" @uploadcomplete="addImg" type="image/jpeg"/>
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
            selectList1: [{id: 0,title:'不限'},{id: 1,title:'按课程'}],
            show: false,
            selectList2: [{id: -1,title:'下架'},{id: 0,title:'未上架'},{id: 1,title:'测试'},{id: 2,title:'上架'},{id: 3,title:'推荐'}],
            form: {
                project_id: 0,
                product_id: 0,
                unlock_type: '',
                state: '',
                title:'',
                price:0,
                original_price:0,
                short_description:'',
                description:'',
                url_arr:'',
                h5_url:'',
                redirectType:false,
                curriculum_id:null,
                imgList: ['upload-btn'],
                video_url:'',
                original_price:'',
                price:'',
                _fn:null,
                certificate:[],
                description: ''
            },
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
            searchData:'',
            curriculumList:[],
            loadingInstance:null,
            fromLabelWidth:121,
            formItemLabelWidth:121,
            paneItem: '',
            disabled2: false,
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
            paneItem: 'displayImg'
        }
    },
    mounted() {
        // this.get_certificate_list()
        if(this.payload){
          this.$nextTick(()=>{
            get_product_certificate(this.form).then(res => {
              res.data.data.forEach((item) => {
                this.form.certificate.push(item.honour_id)
              })
            })
          })
        }
        if(this.projectType === 1){
            get_list(this.projectId).then(res => {
                if(res.data.res_code === 1){
                    for(var i=0;i<res.data.msg.length;i++){
                        res.data.msg[i].is_valid = false;
                    }
                    this.curriculumList = res.data.msg;
                    this.checkCurriculum();
                }
            })
        }
        if(this.payload){
            this.loadingInstance = this.$LoadingY({message: "加载中，请稍后",show: true})
                setTimeout(() => {
                    this.loadingInstance.close();
                }, Config.base_timeout);
            this.form.product_id = this.payload.id;
            get_detail(this.payload.id).then(res => {
                if(res.data.res_code === 1){
                    this.form.title = res.data.msg.title;
                    this.form.original_price = (res.data.msg.price).toString();
                    this.form.price = (res.data.msg.original_price).toString();
                    this.form.short_description = res.data.msg.short_description;
                    this.form.description = res.data.msg.description;
                    this.form.curriculum_id = res.data.msg.curriculum_id;
                    this.form.h5_url = res.data.msg.h5_url;
                    this.form.examine_type = res.data.msg.examine_type;
                    if(this.form.h5_url) this.form.redirectType = true;
                    var arrObj = JSON.parse(res.data.msg.img_url_arr);
                    if(arrObj.default.includes("[")){
                       let d = JSON.parse(arrObj.default);
                    //    this.form.img_url = d[0]
                    //    this.form.img_url2 = d[1]
                    //    this.form.img_url3 = d[2]
                    //    this.form.img_url4 = d[3]
                    //    this.form.img_url5 = d[4]
                    }else this.form.img_url = arrObj.default;
                    this.form.video_url = arrObj.video;
                    if(this.form.video_url)
                        this.form.displayVideo = true;
                    this.checkCurriculum();
                  if(this.loadingInstance)  this.loadingInstance.close();
                }
            })
        }
        var vm = this;
        this.form.project_id = this.projectId;
        this.form._fn = function(){
            vm.handleClose();
            vm.showPop('保存成功！');
        }
    },
    computed: {
        ...mapState({
            projectId:state => state.project.select_project_id,
            examineTypeList:state => state.production.examineTypeList,
            certificate:state => state.production.certificate_list
        }),
        ...mapGetters({ projectType: 'select_project_type' }),
        selectSubject() {
            return this.form.subject_id;
        },
        selectGrade() {
            return this.form.grade_id;
        },
        dataHeader() {
             return [{
                    label:'排序',
                    width:90,
                    sort:true
                }, {
                    prop: 'teacher_name',
                    label: '讲师',
                    width: 150
                }, {
                    prop: 'title',
                    label: '课程名称'
                },  {
                    label: '操作',
                    width: 100,
                    groupBtn: [{
                        text: '',
                        param: 'changeSelect',
                        switchKey:'is_valid',
                        useCheckBox:true
                    }]
                }]
        }
    },
    methods: {
        ...mapActions([ 'add_production', 'update_production', 'get_certificate_list', 'change_certificate_list' ]),
        checkCurriculum() {
            if(this.curriculumList.length > 0 && this.form.curriculum_id){
                for(var i=0;i<this.curriculumList.length;i++){
                    if(this.curriculumList[i].curriculum_id === this.form.curriculum_id){
                        this.curriculumList[i].is_valid = true;
                    }
                }
            }
        },
        overImg(val){

        },
        addImg(val){
            var img = new Image()
            img.src = val.url
            img.width = 100
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
        clearSearch(){
            this.searchData = '';
            get_list(this.projectId).then(res => {
                if(res.data.res_code === 1){
                    for(var i=0;i<res.data.msg.length;i++){
                        res.data.msg[i].is_valid = false;
                    }
                    this.curriculumList = res.data.msg;
                    this.checkCurriculum();
                }
            })
        },
        searchCurriculum() {
            get_list(this.projectId,this.searchData).then(res => {
                if(res.data.res_code === 1){
                    for(var i=0;i<res.data.msg.length;i++){
                        res.data.msg[i].is_valid = false;
                    }
                    this.curriculumList = res.data.msg;
                    this.checkCurriculum();
                }
            })
        },
        changeRowSelectHandler(row) {
            if(row.is_valid){
                for(var i=0;i<this.curriculumList.length;i++){
                    if(this.curriculumList[i].curriculum_id !== row.curriculum_id) this.curriculumList[i].is_valid = false;
                    else this.form.curriculum_id = row.curriculum_id;
                }
            } else this.form.curriculum_id = null;
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
            this.fromLabelWidth = 0;
            this.formItemLabelWidth = 0
            console.log(this.form,'this.form')
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
        handleSubmit() {
            this.form.imgList.shift('upload-btn')
            var arrObj = {
                default: JSON.stringify(this.form.imgList),
                video:  this.form.video_url 
            }
            this.form.url_arr = JSON.stringify(arrObj);
            if(this.$refs.inputStyl) this.form.description = this.$refs.inputStyl.outerHTML
            this.form.price = Number(this.form.original_price).toFixed(2)
            this.form.original_price = Number(this.form.price).toFixed(2)
            if(this.payload)  this.update_production(this.form);
            else this.add_production(this.form);
        }
    }
}
</script>
<style lang="scss" scoped>
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
.upload-img-main{
   width: 100%;
   height: 100%;
   border: 1px solid #C8CCDD;
   display: flex;
   align-items: center;
   justify-content: center;
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
}
.up-img{
    margin-right: 10px;
}
</style>
