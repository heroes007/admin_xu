<template>
    <Modal :transfer=false v-model="videoManageDialog" @on-cancel="handleRemoveModal(remove)" size="auto"
           :mask-closable="false" :footer-hide="true" width="600" :title="video_edit?'编辑视频':'添加视频'">
        <base-input :baseInputWidth="560" @closedialog="handleClose">
            <Row slot="body">
                <!-- <span class="dscj-webfont-remove-sign"></span> -->
                <!--<Tabs type="line">-->
                    <!--<TabPane label="视频设置">-->
                        <Form ref="form" :model="form" :label-width="80">
                            <FormItem label="小节名称">
                                <Input v-model="form.group_name" placeholder="请输入小节名称"></Input>
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
                            <!--<FormItem label="观看权限（多选）">-->
                                <!--<Select v-model="form.video_roles" placeholder="请选择观看权限" multiple>-->
                                    <!--<Option v-for="item in roleList" :key="item.id" :label="item.role_name"-->
                                            <!--:value="item.role_id">-->
                                    <!--</Option>-->
                                <!--</Select>-->
                            <!--</FormItem>-->
                            <FormItem label="上传视频" class="upload-form">
                                <upload-panel :resourse='form.video_url' @uploadcomplete='uploadCompleteHandler'
                                              :upload-config='uploaderConfig'>
                                    <span slot="file-require">只能上传 MP4/MOV/AVI 文件，且不超过2M</span>
                                </upload-panel>
                            </FormItem>
                            <div class="btns">
                                <Button type="primary" class="sub-btn" @click="handleSubmit">发布</Button>
                            </div>
                        </Form>
                    <!--</TabPane>-->
                    <!--<TabPane label="复制视频">-->
                        <!--<Form ref="form" :model="form" :label-width="80" class="has-video-form">-->
                            <!--<FormItem label="所属项目">-->
                                <!--<Select v-model="projectId" @on-change='changeProjectHandler'>-->
                                    <!--<Option :label='item.name' :value='item.id' v-for='item in projectList'-->
                                            <!--:key="item.id"></Option>-->
                                <!--</Select>-->
                            <!--</FormItem>-->
                            <!--<FormItem class="course-list">-->
                                <!--<Collapse @on-change='toggleCurriculum' :accordion='true'>-->
                                    <!--<Panel :name="index" v-for='(item,index) in curriculumList' :key="item.id">-->
                                        <!--{{item.title}}-->
                                        <!--<Row slot="content" class="course-item" v-for='catalog in item.chapterList'-->
                                             <!--:key="catalog.id">-->
                                            <!--<Col :span="3">-->
                                                <!--第{{catalog.chapterIndex + 1}}章-->
                                            <!--</Col>-->
                                            <!--<Col :span="18">-->
                                                <!--<Icon type="md-star" /><span>{{item.orderIndex}}</span>-->
                                                <!--{{catalog.video_title?catalog.video_title:''}}{{catalog.video_test_title?catalog.video_test_title:''}}-->
                                            <!--</Col>-->
                                            <!--<Col :span="3">-->
                                                <!--<Checkbox class="radio" v-model="catalog.isSelected"-->
                                                          <!--@on-change='changeVideoSelect(catalog)'></Checkbox>-->
                                            <!--</Col>-->
                                        <!--</Row>-->
                                    <!--</Panel>-->
                                <!--</Collapse>-->
                            <!--</FormItem>-->
                            <!--<div class="btns">-->
                                <!--<Button type="primary" class="sub-btn" @click="handleSelect">保存</Button>-->
                            <!--</div>-->
                        <!--</Form>-->
                    <!--</TabPane>-->
                <!--</Tabs>-->
            </Row>
        </base-input>
    </Modal>
</template>

<script>
  import BaseInput from '../../components/BaseInput'
  import UploadButton from '../../components/UploadButton'
  import {RemoveModal} from './mixins'
  import UploadPanel from '../../components/UploadPanel'
  import {get_detail, get_video_source} from '../../api/modules/tools_video'
  import {get_list} from '../../api/modules/tools_curriculum'
  import {get_catalog} from '../../api/modules/tools_curriculum_catalog'
  import {doSortFormatCatalogList} from '../../components/Util'
  import {Config} from '../../config/base'
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
    data() {
      return {
        videoManageDialog: true,
        form: {
          video_id: 0,
          title: '',
          duration: '',
          video_roles: [0],
          dir: null,
          filename: null,
          video_url: null,
          format: null,
          curriculum_id: '',
          group_orderby: 0,
          group_name: '',
          orderby: 0,
          _fn: null
        },
        projectId: 0,
        curriculumList: [],
        uploaderConfig: {
          bucket: 'dscj-video',
          dir: 'mspx',
          type: 2
        },
        selectedVideo: null,
        video_edit: false,
        loading: null
      }
    },
    watch: {
      projectId(val) {

      }
    },
    computed: {
      roleList() {
        return this.$store.state.roles.role_list;
      },
      projectList() {
        return this.$store.state.project.project_list;
      }
    },
    methods: {
      changeVideoSelect(item) {
        var i, j;
        if (item.isSelected)
          this.selectedVideo = item;
        else
          this.selectedVideo = null;
        for (i = 0; i < this.curriculumList.length; i++) {
          for (j = 0; j < this.curriculumList[i].chapterList.length; j++) {
            if (item.video_id !== this.curriculumList[i].chapterList[j].video_id)
              this.curriculumList[i].chapterList[j].isSelected = false;
          }
        }
      },
      changeProjectHandler(val) {
        this.loading = this.$LoadingY({message: "加载中，请稍后", show: true})
        setTimeout(() => {
          this.loading.close();
        }, Config.base_timeout);
        get_list(val).then(res => {
          if (res.data.res_code === 1) {
            for (var i = 0; i < res.data.msg.length; i++) {
              res.data.msg[i].chapterList = [];
            }
            this.curriculumList = res.data.msg;
            if (this.loading) this.loading.close();
          }
        })
      },
      toggleCurriculum(index) {
        if (!index) return;
        var item = this.curriculumList[index];
        var i, j;
        for (i = 0; i < this.curriculumList.length; i++) {
          if (this.curriculumList[i].chapterList) {
            for (j = 0; j < this.curriculumList[i].chapterList.length; j++) {
              this.curriculumList[i].chapterList[j].isSelected = false;
            }
          }
        }
        if (item.chapterList.length === 0) {
          this.loading = this.$LoadingY({message: "加载中，请稍后", show: true})
          setTimeout(() => {
            this.loading.close();
          }, Config.base_timeout);
          get_catalog(item.curriculum_id).then(res => {
            if (res.data.res_code === 1) {
              var catalogList = doSortFormatCatalogList(res.data.msg);
              for (i = 0; i < catalogList.length; i++) {
                for (j = 0; j < catalogList[i].classList.length; j++) {
                  catalogList[i].classList[j].chapterIndex = i;
                  catalogList[i].classList[j].orderIndex = j;
                  catalogList[i].classList[j].isSelected = false;
                }
                item.chapterList = item.chapterList.concat(catalogList[i].classList);
              }
              if (this.loading) this.loading.close();
            }
          })
        }
      },
      handleClose() {
        this.videoManageDialog = false;
      },
      handleSubmit() {
        // if (this.form.video_roles.length === 0) {
        //   this.$Modal.info({
        //     title: '提示',
        //     content: '<p>请选择观看权限</p>'
        //   });
        //   return;
        // }
        this.form._fn =  () =>{
          this.handleClose();
          this.showPop('保存成功！', 1000);
        }
        let d = this.form.duration
        this.form.duration = +(parseFloat(d)).toFixed(2)
        if (this.payload.video_id) {
          this.form.curriculum_online_id = this.payload.curriculum_online_id
          this.$store.dispatch('edit_online_curriculum_video', this.form);
          // this.handleRemoveModal(this.remove)
        } else {
          this.form.parent_id = this.payload.parent_id
          this.form.curriculum_online_id = this.payload.curriculum_online_id
          // this.form.parent_id = this.payload
          this.$store.dispatch('add_online_curriculum_video', this.form);
          this.handleRemoveModal(this.remove)
        }
      },
      handleSelect() {
        if (!this.selectedVideo) {
          this.$Modal.info({
            title: '提示',
            content: '<p>请选择一个已有视频</p>'
          });
          return;
        }
        this.form.title = this.selectedVideo.video_title;
        this.form.video_id = this.selectedVideo.video_id;
        this.$store.dispatch('select_online_curriculum_video', this.form);
      },
      uploadCompleteHandler(url) {
        this.form.video_url = url;
        var l = url.split('/');
        this.form.filename = l[l.length - 1];
        this.form.dir = this.uploaderConfig.dir;
        this.form.format = 720;
      }
    },
    mounted() {
      // this.$store.dispatch('get_role_list');
      this.form.curriculum_id = this.payload.curriculum_id;
      this.form.group_orderby = this.payload.group_orderby;
      this.form.orderby = this.payload.orderby;
      if(this.payload.hasOwnProperty('video_edit')&&this.payload.video_edit){
       this.$nextTick(() => {
        this.form = this.payload
        this.video_edit = true
       })
      }
      // if (this.payload.video_id) {
      //   get_detail(this.payload.video_id).then(res => {
      //     if (res.data.res_code === 1) {
      //       this.form.video_id = this.payload.video_id;
      //       this.form.title = res.data.msg.video[0].title;
      //       this.form.duration = res.data.msg.video[0].duration;
      //       this.form.video_roles = res.data.msg.video_role ? res.data.msg.video_role : [];
      //     }
      //   })
      //   get_video_source(this.payload.video_id, 720).then(res => {
      //     if (res.data.res_code === 1) {
      //       this.form.video_url = res.data.msg;
      //     }
      //   })
      // } else {
      //   this.form.format = 720;
      // }
    }
  }
</script>
<style scoped lang="scss">
  /deep/ .upload-panel .img img { width: 160px;height: 148px; }
    .btns{
        display: flex;
        justify-content: center;
    }
    .sub-btn {
        width: 170px;
        margin-bottom: 10px;
    }
    #video-manage-container {
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
    /deep/ .ivu-modal-close .ivu-icon-ios-close, /deep/ .ivu-modal-close .ivu-icon-ios-close:hover {
        color: #999 !important;
    }
</style>
