<template>
<Modal :transfer=false :title="!payload? '创建产品' : '编辑产品'" :footer-hide=true 
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
                    <FormItem v-show="nextStep == 0" label="编码">
                        <Input v-model="form.code" placeholder="请输入产品编码"></Input>
                    </FormItem>
                    <!-- <FormItem label='考试类型' :label-width="formItemLabelWidth">
                    <Select v-model="form.examine_type" placeholder="请选择考试类型">
                        <Option v-for="item in examineTypeList" :key="item.id" :label="item.name" :value="item.id"></Option>
                    </Select>
                    </FormItem> -->
                    <FormItem v-show="nextStep == 0" label="产品名称">
                        <Input v-model="form.title" placeholder="请输入产品名称"></Input>
                    </FormItem>
                    <FormItem v-show="nextStep == 0" label="定价">
                        <Input placeholder="0为免费，单位默认（元）" v-model="form.show_original_price"></Input>
                    </FormItem>
                    <FormItem v-show="nextStep == 0" label="真实售价">
                        <Input placeholder="售价必须小于等于定价" v-model="form.show_price"></Input>
                    </FormItem>
                    <FormItem v-show="nextStep == 0" label="荣誉证书" >
                        <Select v-model="form.certificate" multiple >
                            <Option v-for="(item, index) in certificate" :key="item.id" :value="item.id" :label="item.name"></Option>
                        </Select>
                    </FormItem>
                    <FormItem v-show="nextStep == 0" label="跳转配置">
                        <Row class='row-container' type='flex' justify='start' align='middle'>
                        <Switch  v-model="form.redirectType" size="large">
                            <span slot="open">自定义</span><span slot="close">默认</span>
                        </Switch>
                        </Row>
                    </FormItem>
                    <FormItem v-if="nextStep == 0 && form.redirectType" label="跳转地址">
                       <Input v-model="form.h5_url" placeholder="请输入跳转地址"></Input>
                    </FormItem>
                     <FormItem v-show="nextStep == 0" label="产品图片">
                        <Row class='row-container' type='flex' justify='start' align='middle'>
                        <Switch  v-model="form.displayImg" @on-change="displayImgChage" size="large">
                            <span slot="open">使用</span><span slot="close">不使用</span>
                        </Switch>
                        </Row>
                    </FormItem>
                    <FormItem label="展示图片" v-if="nextStep == 0 && form.displayImg">
                        <Row>
                            <Col :span="8">
                            <upload-panel :close=true ref="upload_panel" :resourse="form.img_url" :upload-config="uploadConfig" @uploadcomplete="uploadCompleteHandler1">
                            </upload-panel>
                            </Col>
                            <Col :span="8">
                            <upload-panel :close=true ref="upload_panel2" :resourse="form.img_url2" :upload-config="uploadConfig" @uploadcomplete="uploadCompleteHandler2s">
                            </upload-panel>
                             </Col>
                            <Col :span="8">
                            <upload-panel :close=true ref="upload_panel3" :resourse="form.img_url3" :upload-config="uploadConfig" @uploadcomplete="uploadCompleteHandler3">
                            </upload-panel>
                             </Col>
                            <Col :span="8">
                            <upload-panel :close=true ref="upload_panel4" :resourse="form.img_url4" :upload-config="uploadConfig" @uploadcomplete="uploadCompleteHandler4">
                            </upload-panel>
                             </Col>
                            <Col :span="8">
                            <upload-panel :close=true ref="upload_panel5" :resourse="form.img_url5" :upload-config="uploadConfig" @uploadcomplete="uploadCompleteHandler5">
                            </upload-panel>
                             </Col>
                        </Row>
                         <p>只能上传 jpg/png 文件，且图片480*270</p>
                    </FormItem>
                    <FormItem v-show="nextStep == 0" label="产品视频">
                        <Row class='row-container' type='flex' justify='start' align='middle'>
                        <Switch  v-model="form.displayVideo" @on-change="displayVideoChage" size="large">
                            <span slot="open">使用</span><span slot="close">不使用</span>
                        </Switch>
                        </Row>
                    </FormItem>
                    <FormItem label="展示视频" v-if="nextStep == 0 && form.displayVideo">
                        <upload-panel :resourse='form.video_url' @uploadcomplete='uploadCompleteHandler2' :upload-config='uploaderConfig2'>
                             <span slot="file-require">只能上传 MP4/MOV/AVI 文件，且不超过2M</span>
                        </upload-panel>
                    </FormItem>
                    <FormItem v-show="nextStep == 0" label="产品简介">
                        <Input type="textarea" :rows="6" placeholder="请输入产品简介" v-model="form.short_description"></Input>
                    </FormItem>
                    <FormItem v-show="nextStep == 2" label="编辑产品课程图文详情:" :label-width='160'>
                    </FormItem>
                    <FormItem v-show="nextStep == 2" label="" :label-width='0'>
                        <text-editor ref='description_editor' :content='form.description'/>
                    </FormItem>
                    <FormItem class="btns">
                        <Button type='text' v-show='nextStep == 2 || nextStep == 1' class='btn-pre' @click='handlePreStep'>上一步</Button>
                        <Button v-show="nextStep == 2" class="btn-orange" @click="handleSubmit('form')">提交</Button>
                        <Button v-show="nextStep == 0 || nextStep == 1" class="btn-orange btn-next" @click="handleNextStep(form)">下一步</Button>
                    </FormItem>
                </Form>
            </Row>
        </Row>
    </base-input>
</Modal>
</template>
<script>
import BaseInput from '../../components/BaseInput'
import UploadPanel from '../../components/UploadPanel'
import Editor from '../../components/Editor'
import BaseList from '../../components/BaseList'
import { Config } from '../../config/base'
import { RemoveModal } from './mixins'
import { mapActions, mapState, mapGetters } from 'vuex';
import { get_list } from '../../api/modules/tools_curriculum'
import { get_detail, get_product_certificate } from '../../api/modules/tools_product'
import dateFormat from '../../config/dateFormat'
import { MPop } from '../../components/MessagePop'
export default {
    mixins: [RemoveModal,MPop],
    components: { 'base-input': BaseInput,'upload-panel': UploadPanel,'text-editor':Editor,'data-list': BaseList },
    props: {
        remove: {
            type: String
        },
        payload: {}
    },
    data() {
        return {
            addProductionDialog: true,
            form: {
                project_id:0,
                product_id:0,
                code:'',
                title:'',
                price:0,
                original_price:0,
                short_description:'',
                description:'',
                img_url_arr:'',
                h5_url:'',
                redirectType:false,
                displayVideo:false,
                displayImg: true,
                curriculum_id:null,
                img_url:'',
                img_url2:'',
                img_url3:'',
                img_url4:'',
                img_url5:'',
                video_url:'',
                show_price:'',
                show_original_price:'',
                examine_type:3,
                _fn:null,
                certificate:[]
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
            formItemLabelWidth:121
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
                    this.form.code = res.data.msg.code;
                    this.form.title = res.data.msg.title;
                    this.form.show_price = (res.data.msg.price).toString();
                    this.form.show_original_price = (res.data.msg.original_price).toString();
                    this.form.short_description = res.data.msg.short_description;
                    this.form.description = res.data.msg.description;
                    this.form.curriculum_id = res.data.msg.curriculum_id;
                    this.form.h5_url = res.data.msg.h5_url;
                    this.form.examine_type = res.data.msg.examine_type;
                    if(this.form.h5_url) this.form.redirectType = true;
                    var arrObj = JSON.parse(res.data.msg.img_url_arr);
                    if(arrObj.default.includes("[")){
                       let d = JSON.parse(arrObj.default);
                       this.form.img_url = d[0]
                       this.form.img_url2 = d[1]
                       this.form.img_url3 = d[2]
                       this.form.img_url4 = d[3]
                       this.form.img_url5 = d[4]
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
             console.log(this.from,'from')
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
        },
        handleClose() {
            this.form.description = '';
            this.addProductionDialog = false;
        },
        handleNextStep(formName) {
          var arrObj = {
            default: this.form.displayImg ? JSON.stringify([this.form.img_url,this.form.img_url2,this.form.img_url3,this.form.img_url4,this.form.img_url5]) : '',
            video: this.form.displayVideo ? this.form.video_url : ''
          }
          var description= this.$refs.description_editor.editor.getContent();
          this.form.description = description;
          this.form.img_url_arr = JSON.stringify(arrObj);
          if(Number(this.form.show_price) > Number(this.form.show_original_price)){
            this.$Modal.info({
              title: '提示',
              content: '真实售价不能高于定价！'
            });
          }else{
            this.fromLabelWidth = 0;
            this.formItemLabelWidth = 80
            this.nextStep = this.projectType === 1 ? ( this.nextStep === 0 ? 1 : 2 ) : 2
          }
        },
        handlePreStep() {
            this.fromLabelWidth = 121
            this.formItemLabelWidth = 121
            this.nextStep = this.projectType !== 1 ? 0 : this.nextStep === 2 ? 1 : 0
        },
        handleSubmit() {
              this.form.price = Number(this.form.show_price).toFixed(2)
              this.form.original_price = Number(this.form.show_original_price).toFixed(2)
              if(this.payload)  this.update_production(this.form);
              else this.add_production(this.form);
        }
    }
}
</script>
<style lang="scss" scoped>
/deep/.ivu-switch-large { width: 75px }
/deep/ .ivu-switch-large.ivu-switch-checked:after{ left: 55px; }
/deep/ .ivu-modal{ width: 800px !important }
/deep/ .upload-space, /deep/ .upload-space>input{ height: 150px !important; }
/deep/ .upload-panel .img img { width: 160px;height: 148px; }
.add-task-form{
    width: 80% !important;
    margin-left: 10%;
}
.btn-next{ margin-left: 20%; }
.btn-orange:hover,.btn-next:hover{
    background: #3DAAFF;
    color: #fff;
}
.btn-orange{
    margin-left: 20%;
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
</style>
