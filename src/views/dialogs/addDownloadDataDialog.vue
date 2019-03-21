<template>
<Modal :transfer=false :title="payload.state === 0?'编辑资料':'添加资料'" v-model="addDownloadDataDialog" @on-cancel="handleRemoveModal(remove)" :mask-closable="false"
       :footer-hide="true" :styles="{top: '17.3%'}" width="645">
    <base-input @closedialog="handleClose">
        <Row slot="body">
            <Row class="body-top" v-if="true">
                <Form ref="formData" :model="form" :rules="rules" :label-width="80" class="add-teacher-form">
                    <FormItem label="资料名称" prop="name">
                        <Input v-model="form.name" placeholder="请输入资料名称"></Input>
                   </FormItem>
                   <FormItem label="绑定课程" prop="subject_id" >
                        <Select v-model="form.subject_id" placeholder="请选择绑定课程">
                            <Option v-for="item in curricumList" :key="item.id" :label="item.title" :value="item.id"></Option>
                        </Select>
                    </FormItem>
                    <!-- <FormItem label="学科" v-if='payload === 0'>
                                <Select v-model="form.subject_id" placeholder="请选择学科">
                                    <Option v-for="item in query_subject_list" :key="item.id" :label="item.name" :value="item.id"></Option>
                                </Select>
                           </FormItem>
                    <FormItem label="学段" v-if='payload === 0'>
                                <Select v-model="form.grade_id" placeholder="请选择学段">
                                    <Option v-for="item in query_grade_list" :key="item.id" :label="item.name" :value="item.id"></Option>
                                </Select>
                           </FormItem> -->
                    <FormItem label="上传附件" v-if="isupdata" required>
                        <!-- <file-uploader :filters="dataFilters" maxFileCount="1"
                                    :maxFileSize="30000"  @uploadComplete="uploadComplete"
                                    bucket="dscj-static-file" :dir='getDir()'/> -->
                            <upload-btn bucket="dscj-app" @uploadcomplete="uploadComplete" type="doc/pdf/zip"/>
                   </FormItem>
                   <FormItem  label="上传附件" required v-else>
                       <div style="display:flex">
                           <p style="text-align:left">{{this.form.url_name}}</p>
                           <!--<Button style="margin:0 auto" type="error" @click="delUrl">删除</Button>-->
                           <Icon style="margin-left:60px;" size="24" color="#ff5c33" type="ios-trash-outline"  @click="delUrl"/>
                       </div>
                   </FormItem>
                    <FormItem class="btn-content" :label-width='0'>
                        <Button type="primary" class="sub-btn" @click="saveHandler('formData')">完成</Button>
                   </FormItem>
                </Form>
            </Row>
        </Row>
    </base-input>
</Modal>
</template>
<script>
import BaseInput from '../../components/BaseInput'
import { RemoveModal } from './mixins'
import UploadPanel from '../../components/UploadPanel'
import Uploader from '../../components/Upload'
import uploadPanel from '../../components/UploadPanel'
import { get_category_by_id,save_datalist } from '../../api/modules/tools_task'
import { Config } from '../../config/base'
import { doTimeFormat } from '../../components/Util'
import { mapState, mapActions } from 'vuex'
import { MPop } from '../../components/MessagePop'
import UploadImgs  from '../../components/UploadButton'
import UploadBtn from '../../components/UploadButton'
import postData from '../../api/postData'

export default {
    mixins: [RemoveModal,MPop],
    props: {
        remove: {
            type: String
        },
        payload: {}
    },
    components: {
        'base-input': BaseInput,
        'file-uploader': Uploader,
        uploadPanel,
        UploadImgs,
        'upload-btn': UploadBtn
    },
    computed:{
         ...mapState({
            projectId:state => state.project.select_project_id,
            query_grade_list: state => state.grade.grade_list,
            query_subject_list: state => state.subject.subject_list,
            course_download_data_list: state => state.download_data,
            }),
        dataFilters(){
            var str = ['doc','pdf','zip'];
            return str;
        },
    },
    data() {
        return {
            addDownloadDataDialog: true,
            curricumList: [],
            form: {
                project_id:1,
                name:'',
                subject_id:null,
                grade_id: null,
                download_url:'',
                url_name:'',
                type:0
            },
            loadingInstance: null,
            isupdata:true,
            rules: {
                name: { required: true, message: '请输入资料名称', trigger: 'blur'},
                subject_id: { required: true, message: '请选择绑定课程'}
            }
        }
    },
    methods: {
        ...mapActions([ 'add_course_download_data', 'add_public_download_data',  'get_curriculum_donwload_data_list']),
        getDir() {
            if(this.payload.state === 0) return 'datacenter/public/' + doTimeFormat(new Date().toString());
            return 'datacenter/curriculum/' + doTimeFormat(new Date().toString());
         },
        uploadComplete(val) {
            if (val.url) {
                this.form.download_url = val.url;
                this.form.url_name = val.name
                this.isupdata = false
            }
        },
        handleSubmit(){
            this.form._fn = () => {
                this.addDownloadDataDialog = false
                 this.$Message.success('添加成功');
            }
            if(this.payload.state === 0) {
             postData('product/data/change', {
               data_id: this.form.id,
               title: this.form.name,
               curriculum_id: this.form.subject_id,
               attachment_url: this.form.download_url,
               attachment_name: this.form.url_name,
             }).then(res => {
                 if(res){
                    this.get_curriculum_donwload_data_list({
                        project_id: this.payload.projectId,
                        page: this.payload.page
                    })
                    this.addDownloadDataDialog = false
                 }
             })
           }else {
                this.form.project_id = this.payload.projectId
                this.form.page = this.payload.page
                this.add_course_download_data(this.form);
           }
        },
        saveHandler(name) {
            this.$refs[name].validate((valid) => {
                if (valid) {
                    if(this.form.url_name) this.handleSubmit()
                    else  this.$Message.warning('请上传附件');
                }
            })
        },
        handleClose() {
            this.addDownloadDataDialog = false;
        },
        delUrl(){
            this.form.download_url = '';
            this.form.url_name = '';
            this.isupdata = true;
        },
        getMyselflist(){
            postData('/product/curriculum_online/getMyselflist',{product_id: JSON.parse(localStorage.getItem('PRODUCTINFO')).id}).then((res) => {
               if(res) this.curricumList = res.data
            })
        }
    },
    mounted() {
        this.getMyselflist()
        var vm = this;
        this.form._fn = function() {
            vm.handleClose();
            vm.showPop('添加成功！',1000);
        };
        this.form.project_id = this.projectId;
        this.form.type = this.state;
        if(this.form.type === 0){
            this.form.grade_id = 0;
            this.form.subject_id = 0;
        }
        if(this.payload.state == 0) {
          this.form.subject_id = this.payload.form.curriculum_id
          this.form.curriculum_id = this.payload.form.curriculum_id
          this.form.name = this.payload.form.title
          this.form.id = this.payload.form.id
          if(this.payload.form.attachment_url){
            this.form.download_url = this.payload.form.attachment_url;
            this.form.url_name = this.payload.form.attachment_name
            this.isupdata = false
          }
          console.log(this.form, 'form')
        }
    }
}
</script>
<style lang="scss" scoped>

    #add-download-data-container {
        @import "base.scss";
        input,
        textarea {
            resize: none;
            outline: none;
        }
        .close-dialog-panel {
            position: absolute;
            top: -70px;
            right: -13.5px;
            z-index: 99999;
            font-size: 30px;
            cursor: pointer;
            &:before {
                // color: #fff;
                color: #757575;
            }
        }
    }
    .btn-content{
        text-align: center;
        display: flex;
        justify-content: center;
    }
    .sub-btn{
        width: 170px;
    }
    /deep/ .ivu-modal-body{
        padding: 40px 50px;
    }
</style>
