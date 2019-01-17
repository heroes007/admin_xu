<template>
<Modal :transfer=false v-model="videoManageDialog" @on-cancel="handleRemoveModal(remove)" size="auto" :mask-closable="false" :footer-hide="true" :styles="{width: '600px'}">
    <base-input :baseInputWidth="560" @closedialog="handleClose">
        <Row slot="body">
            <!-- <span class="dscj-webfont-remove-sign"></span> -->
            <Tabs type="line">
                <TabPane label="视频设置">
                    <Form ref="form" :model="form" :label-width="80">
                        <FormItem label="小节名称">
                            <Input v-model="form.title" placeholder="请输入小节名称"></Input>
                       </FormItem>
                        <!--<FormItem label="视频状态">-->
                            <!--<Select v-model="form.region" placeholder="请选择视频状态">-->
                                <!--<Option label="区域一" value="shanghai"></Option>-->
                                <!--<Option label="区域二" value="beijing"></Option>-->
                            <!--</Select>-->
                        <!--</</FormItem>>-->
                        <FormItem label="视频时长（分）">
                            <Input v-model="form.duration" placeholder="请输入视频时长"></Input>
                       </FormItem>
                        <FormItem label="观看权限（多选）">
                            <Select v-model="form.video_roles" placeholder="请选择观看权限" multiple>
                                <Option v-for="item in roleList" :key="item.id" :label="item.role_name" :value="item.role_id">
                                </Option>
                            </Select>
                       </FormItem>
                        <FormItem label="上传视频" class="upload-form">
                            <upload-panel :resourse='form.video_url' @uploadcomplete='uploadCompleteHandler' :upload-config='uploaderConfig'>
                                <span slot="file-require">只能上传 MP4/MOV/AVI 文件，且不超过2M</span>
                            </upload-panel>
                       </FormItem>
                        <FormItem class="btns">
                            <Button type="primary" class="sub-btn" @click="handleSubmit">发布</Button>
                       </FormItem>
                    </Form>
                </TabPane>
                <TabPane label="复制视频">
                    <Form ref="form" :model="form" :label-width="80" class="has-video-form">
                        <FormItem label="所属项目">
                            <Select v-model="projectId" @on-change='changeProjectHandler'>
                                <Option :label='item.name' :value='item.id' v-for='item in projectList' :key="item.id"></Option>
                            </Select>
                       </FormItem>
                        <FormItem class="course-list">
                            <Collapse @on-change='toggleCurriculum' :accordion='true'>
                                <Panel :name="index" v-for='(item,index) in curriculumList' :key="item.id">
                                    {{item.title}}
                                    <Row slot="content" class="course-item" v-for='catalog in item.chapterList' :key="catalog.id">
                                        <Col :span="3">
                                            第{{catalog.chapterIndex + 1}}章
                                        </Col>
                                        <Col :span="18">
                                            <span class="el-icon-star-on"></span><span>{{item.orderIndex}}</span> {{catalog.video_title?catalog.video_title:''}}{{catalog.video_test_title?catalog.video_test_title:''}}
                                        </Col>
                                        <Col :span="3">
                                            <Checkbox class="radio" v-model="catalog.isSelected" @on-change='changeVideoSelect(catalog)'></Checkbox>
                                        </Col>
                                    </Row>
                                </Panel>
                            </Collapse>
                        </FormItem>
                        <FormItem class="btns">
                            <Button type="primary" class="sub-btn" @click="handleSelect">保存</Button>
                       </FormItem>
                    </Form>
                </TabPane>
            </Tabs>
        </Row>
    </base-input>
</Modal>
</template>

<script>
import BaseInput from '../../components/BaseInput'
import UploadButton from '../../components/UploadButton'
import {
    RemoveModal
} from './mixins'
import UploadPanel from '../../components/UploadPanel'
import { get_detail,get_video_source } from '../../api/modules/tools_video'
import { get_list } from '../../api/modules/tools_curriculum'
import { get_catalog } from '../../api/modules/tools_curriculum_catalog'
import { doSortFormatCatalogList } from '../../components/Util'
import { Loading } from 'element-ui'
import { Config } from '../../config/base'
    import {
    MPop
} from '../../components/MessagePop'
export default {
    mixins: [RemoveModal,MPop],
    props: {
        remove: {
            type: String
        },
        payload:{

        }
    },
    components: {
        'base-input': BaseInput,
        'upload-button': UploadButton,
        'upload-panel': UploadPanel
    },
    data() {
        return {
            videoManageDialog: true,
            form: {
                video_id:0,
                title: '',
                duration: '',
                video_roles:[0],
                dir:null,
                filename:null,
                video_url:null,
                format:null,
                curriculum_id:'',
                group_orderby:0,
                group_name:'',
                orderby:0,
                _fn:null
            },
            projectId:0,
            curriculumList:[],
            uploaderConfig:{
                bucket:'dscj-video',
                dir:'mspx',
                type:2
            },
            selectedVideo:null,
            loading: null
        }
    },
    watch:{
        projectId(val) {

        }
    },
    computed:{
        roleList(){
            return this.$store.state.roles.role_list;
        },
        projectList(){
            return this.$store.state.project.project_list;
        }
    },
    methods: {
        changeVideoSelect(item) {
            var i,j;
            if(item.isSelected)
                this.selectedVideo = item;
            else
                this.selectedVideo = null;
            for(i=0;i<this.curriculumList.length;i++)
            {
                for(j=0;j<this.curriculumList[i].chapterList.length;j++)
                {
                    if(item.video_id !== this.curriculumList[i].chapterList[j].video_id)
                        this.curriculumList[i].chapterList[j].isSelected = false;
                }
            }
        },
        changeProjectHandler(val){
            this.loading = this.$LoadingY({message: "加载中，请稍后",show: true})
            setTimeout(() => {
                this.loading.close();
            }, Config.base_timeout);
            // console.log(val)
            get_list(val).then(res => {
                if(res.data.res_code === 1)
                {
                    for(var i=0;i<res.data.msg.length;i++)
                    {
                        res.data.msg[i].chapterList = [];
                    }
                    this.curriculumList = res.data.msg;
                   if(this.loading) this.loading.close();
                }
            })
        },
        toggleCurriculum(index){
            if(!index)
                return;
            var item = this.curriculumList[index];
            var i,j;
            for(i=0;i<this.curriculumList.length;i++)
            {
                if(this.curriculumList[i].chapterList)
                {
                    for(j=0;j<this.curriculumList[i].chapterList.length;j++)
                {
                    this.curriculumList[i].chapterList[j].isSelected = false;
                }
                }
            }
            if(item.chapterList.length === 0)
            {
                 this.loading = this.$LoadingY({message: "加载中，请稍后",show: true})
                setTimeout(() => {
                this.loading.close();
            }, Config.base_timeout);
                get_catalog(item.curriculum_id).then(res => {
                    if(res.data.res_code === 1)
                    {
                        var catalogList = doSortFormatCatalogList(res.data.msg);
                        for(i=0;i<catalogList.length;i++)
                        {
                            for(j=0;j<catalogList[i].classList.length;j++)
                            {
                                catalogList[i].classList[j].chapterIndex = i;
                                catalogList[i].classList[j].orderIndex = j;
                                catalogList[i].classList[j].isSelected = false;
                            }

                            item.chapterList = item.chapterList.concat(catalogList[i].classList);
                        }

                       if(this.loading) this.loading.close();
                    }
                })
            }
        },
        handleClose() {
            this.videoManageDialog = false;
        },
        handleSubmit() {

            if(this.form.video_roles.length === 0)
            {
              this.$Modal.info({
                title: '提示',
                content: '<p>请选择观看权限</p>'
              });
                return;
            }

            if(this.payload.video_id)
            {
                this.$store.dispatch('edit_online_curriculum_video',this.form);
                this.handleRemoveModal(this.remove)
            }
            else
            {
                this.$store.dispatch('add_online_curriculum_video',this.form);
                this.handleRemoveModal(this.remove)
            }
        },
        handleSelect() {

            if(!this.selectedVideo)
            {
              this.$Modal.info({
                title: '提示',
                content: '<p>请选择一个已有视频</p>'
              });
                return;
            }
            this.form.title = this.selectedVideo.video_title;
            this.form.video_id = this.selectedVideo.video_id;
            this.$store.dispatch('select_online_curriculum_video',this.form);
        },
        uploadCompleteHandler(url){
            this.form.video_url = url;
            var l = url.split('/');
            this.form.filename = l[l.length - 1];
            this.form.dir = this.uploaderConfig.dir;
            this.form.format = 720;
        }
    },
    mounted(){
        this.$store.dispatch('get_role_list');
        this.form.curriculum_id = this.payload.curriculum_id;
        this.form.group_name = this.payload.group_name;
        this.form.group_orderby = this.payload.group_orderby;
        this.form.orderby = this.payload.orderby;
        var vm = this;
        this.form._fn = function()
        {
            vm.handleClose();
            vm.showPop('保存成功！',1000);
        }
        if(this.payload.video_id)
        {
            get_detail(this.payload.video_id).then(res => {
                if(res.data.res_code === 1)
                {
                    this.form.video_id = this.payload.video_id;
                    this.form.title = res.data.msg.video[0].title;
                    this.form.duration = res.data.msg.video[0].duration;
                    this.form.video_roles = res.data.msg.video_role?res.data.msg.video_role:[];
                }
            })
            get_video_source(this.payload.video_id,720).then(res => {
                if(res.data.res_code === 1)
                {
                    this.form.video_url = res.data.msg;
                }
            })
        }
        else
        {
            this.form.format = 720;
        }
    }
}
</script>
<style lang="scss">
#video-manage-container {
    @import "base.scss";
    input,
    textarea {
        resize: none;
        outline: none;
    }
    .close-dialog-panel{
      position: absolute;
      top: 10px;
      right: 13.5px;
      z-index: 99999;
      font-size: 30px;
      cursor: pointer;
      &:before{
        // color: #fff;
        color: #757575;
      }
    }
    .el-dialog {
      .el-dialog__title{
        font-weight: 500;
      }
        .el-dialog__header {
            display: none;
        }
        .el-dialog__body {
            padding: 0;
            .el-tabs--border-card {
                border: none;
                background: none;
            }
            .el-form-item__label {
                font-size: 14px;
                color: #141111;
                letter-spacing: 0;
            }
            .el-tabs__header {
                background: #333333;
                border-radius: 4px 4px 0 0;
                height: 50px;
                .el-tabs__item:first-child {
                    margin-left: 0;
                    border-top-left-radius: 4px;
                }
                .el-tabs__item {
                    font-size: 16px;
                    letter-spacing: 0;
                    color: #fff;
                    height: 51px;
                    line-height: 51px;
                    padding: 0 30px;
                }
                .is-active {
                    font-size: 16px;
                    color: #141111;
                    letter-spacing: 0;
                }

            }
            .el-tabs__content {
                border-radius: 0 0 4px 4px;
                background: #fff;
                padding: 0;
            }
            .el-form {
                width: 80%;
                margin: 20px auto;
                input{
                  border: 1px solid #CCCCCC;
                }
                .upload-form {
                    text-align: left;
                    margin-bottom: 0;
                    .el-radio-group {
                        margin-top: 50px;
                    }
                }
                .el-select {
                    width: 100%;
                }
                .el-form-item__content {

                    line-height: 0;
                }
                input {
                    border-radius: 0;
                }
                .el-dragger {
                    width: 100%;
                    background: #F6F6F6;
                    border: 1px solid #CCCCCC;
                    border-radius: 0;
                    .el-dragger__text {
                        font-size: 14px;
                        color: #757575;
                        letter-spacing: 0;
                        line-height: 14px;
                        margin-top: 20px;
                    }
                }

                .sub-btn {
                    background: #FB843E;
                    border-radius: 4px;
                    width: 200px;
                    height: 36px;
                    border: 0;
                    margin-left: 55px;
                    margin-top: 32px;
                }

            }
            .has-video-form {
                width: 100%;
                margin: 0;
                .el-form-item:first-child {
                    width: 80%;
                    margin: 20px auto;
                }
                .course-list {
                    .el-form-item__content {
                        margin-left: 0 !important;
                        line-height: 0;
                    }
                    .el-collapse-item__header__arrow {
                        position: absolute;
                        right: 18px;
                        margin-top: 15px;

                    }
                    .el-collapse-item__header {
                        padding-left: 20px;
                        text-align: left;
                        font-size: 16px;
                        color: #141111;
                        letter-spacing: 0;
                        i {
                            color: #CCCCCC;
                            transform: rotateZ(90deg);
                        }
                    }
                    .is-active {
                        i {
                            transform: rotateZ(-90deg);
                        }
                    }
                    .course-item {
                        margin-right: 8px;
                        font-size: 14px;
                        margin-left: -6px;
                        color: #3B3B3B;
                        letter-spacing: 0;
                        .el-icon-star-on{
                          margin-right: 10px;
                          margin-left: 4px;
                        }
                        .el-checkbox-group {
                            text-align: right;
                        }
                        .Col-18 {
                            text-align: left;
                        }
                    }
                }
            }
            .btns {
              padding-top: 10px;
              padding-bottom: 8px;
                .el-form-item__content {
                    margin-left: 0 !important;
                    button {
                        margin-left: 0;
                    }
                }
            }
        }
    }
}
</style>
