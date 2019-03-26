<template>
    <Modal :transfer=false title="添加测验" v-model="addTestContentDialog" :footer-hide="true"
           @on-cancel="handleRemoveModal(remove)" size="auto" :mask-closable="false" width="800">
        <base-input @closedialog="handleClose">
            <Row slot="body">
                <Form :inline="true" :model="formInline2" class="row2-test-form" :rules="rulesList" ref="formValidate">
                    <FormItem label="测验名称" class="form-title" prop="title">
                        <Input class="formInput" v-model="formInline2.title" placeholder="请输入测验的名称"
                               :disabled='isEdit'></Input>
                    </FormItem>
                    <FormItem label="题干名称" prop="body" style="text-align: left">
                        <Input type="textarea" :rows="5" placeholder="请输入内容" v-model="formInline2.body"
                               class="input-text"></Input>
                    </FormItem>
                    <FormItem style="padding-left: 67px;">
                        <div class="route-link" ref="formInput">
                            <div class="route-data" v-for="(item, index) in formInline2.attachment" :key="index">
                                <span class="titleFile" @click="handleModel(item)">{{item.name}}</span>
                                <Icon size="22" type="ios-trash-outline" @click="deleteFile(index)"/>
                            </div>
                        </div>
                        <div class="upload-list">
                            <div class="upload-title">* 只能上传 jpg/png/jpeg/mp4/mov/avi 文件，且不超过2m</div>
                            <uploadBtn class="upload-img" text="上传附件" bucket="dscj-app" @uploadcomplete="uploadImg" type="image/jpeg,image/png,image/jpg,video/mp4,video/avi,video/mov"/>
                        </div>
                    </FormItem>
                    <FormItem label="选项数量" prop="select_count">
                        <Select v-model="formInline2.select_count" placeholder="选项数量" style="width: 260px;">
                            <Option label="2" value="2"></Option>
                            <Option label="3" value="3"></Option>
                            <Option label="4" value="4"></Option>
                            <Option label="5" value="5"></Option>
                            <Option label="6" value="6"></Option>
                        </Select>
                    </FormItem>
                    <!--<FormItem label="排列序号">-->
                    <!--<InputNumber v-model="formInline2.orderby" :min="1"></InputNumber>-->
                    <!--</FormItem>-->
                    <FormItem v-for='(item, index) in answerList' :key="item.id" prop="desc">
                        <div class="answer">
                            <div class="answer-title"><span v-if="index == 0">选项结果</span></div>
                            <Checkbox class="answer-checkbox" v-model="item.answer">{{item.name}}</Checkbox>
                            <Input placeholder="请输入内容" v-model="item.desc"></Input>
                        </div>
                    </FormItem>
                    <!-- <span style="clear: left"></span> -->
                    <FormItem class="save-test-item">
                        <!--<Button @click="cancelSaveHandler" class="cancel-test-item-btn">取消</Button>-->
                        <div class="save-btn">
                            <Button type="primary" @click="saveTestDetailHandler" class="save-test-item-btn">保存</Button>
                            <!--<Button  @click="clearDetail" class="clear-btn" >清空</Button>-->
                        </div>
                    </FormItem>
                    <Row class="quetion-list">
                        <data-list @edit='editHandler' @delete='deleteHandler' class='data-list light-header'
                                   :table-data='dataList'
                                   :header-data='dataHeader' :column-formatter='listColumnFormatter'
                                   :is-stripe='false'></data-list>
                    </Row>
                </Form>
            </Row>
        </base-input>
        <Modal v-model="modalAccessory" :title="accessoryName" :mask-closable="false" :footer-hide="true"
               :closable="true" @on-cancel="closeAccessory" width="600">
            <div class="accessory">
                <img class="maxw" v-if="accessoryImg" :src="accessoryImg" alt="">
                <video class="maxw" v-if="accessoryVideo" :src="accessoryVideo" controls autoplay></video>
            </div>
        </Modal>
    </Modal>
</template>

<script>
  import BaseInput from '../../components/BaseInput'
  import uploadBtn from '../../components/UploadButton'
  import BaseList from '../../components/BaseList'
  import {
    add_test_detail,
    update_test_detail,
    delete_test_detail
  } from '../../api/modules/tools_video_test'
  import {RemoveModal} from './mixins'
  import {MPop} from '../../components/MessagePop'
  import postData from '../../api/postData'

  export default {
    mixins: [RemoveModal, MPop],
    props: {
      remove: {
        type: String
      },
      payload: {}
    },
    components: {
      'base-input': BaseInput,
      'data-list': BaseList,
      uploadBtn
    },
    data() {
      return {
        addTestContentDialog: true,
        formInline1: {
          video_test_id: 0,
          title: '',
          video_test_roles: [0],
          curriculum_id: '',
          group_orderby: 0,
          group_name: '',
          orderby: 0
        },
        formInline2: {
          video_test_detail_id: 0,
          body: '',
          select_count: '4',
          orderby: 1,
          answerList: [],
          result: [],
          content: '',
          attachment: []
        },
        dataList: [],
        isEdit: false,
        accessoryList: [],
        modalAccessory: false,
        accessoryImg: '',
        accessoryVideo: '',
        accessoryName: '',
        section_id: null,
        rulesList: {
          title: [
            { required: true, message: '请输入测验名称',  trigger: 'blur' }
          ],
          body: [
            { required: true, message: '请输入题干名称',  trigger: 'blur' }
          ],
          select_count: [
            { required: true, message: '请设置选项数量',  trigger: 'blur' }
          ],
        }
      }
    },
    watch: {
      selectTestDetailId(val) {
        if (val !== 0) {
          var detail;
          var i;
          for (i = 0; i < this.dataList.length; i++) {
            if (this.dataList[i].id === val) {
              detail = this.dataList[i];
              break;
            }
          }
          var detailData = JSON.parse(detail.content);
          this.formInline2.body = detailData.body;
          if(Array.isArray(detail.attachment)) this.formInline2.attachment = detail.attachment
          else this.formInline2.attachment = JSON.parse(detail.attachment)
          this.formInline2.select_count = detail.select_count.toString()
          // this.setSelectCount(detail.select_count);
          this.formInline2.orderby = detail.orderby;
          for (i = 0; i < detailData.answerList.length; i++) {
            this.formInline2.answerList[i].answer = detailData.answerList[i].answer;
            this.formInline2.answerList[i].desc = detailData.answerList[i].desc;
          }
          // console.log(val, detail, 'detaildetail')
        }
      },
      selectCount(val) {
        var labelList = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
        if (this.formInline2.answerList.length === 0) {
          for (var i = 0; i < val; i++) {
            this.formInline2.answerList.push({name: labelList[i], index: i, desc: '', answer: false});
          }
        } else {
          if (this.formInline2.answerList.length > val) {
            while (this.formInline2.answerList.length > val) {
              this.formInline2.answerList.pop();
            }
          } else {
            while (this.formInline2.answerList.length < val) {
              this.formInline2.answerList.push({
                name: labelList[this.formInline2.answerList.length],
                index: this.formInline2.answerList.length,
                desc: '',
                answer: false
              })
            }
          }
        }
      },
      newVideoTestId(val) {
        if (this.formInline1.video_test_id === 0) this.formInline1.video_test_id = val;
      }
    },
    computed: {
      answerList() {
        return this.formInline2.answerList;
      },
      selectTestDetailId() {
        return this.formInline2.video_test_detail_id;
      },
      selectCount() {
        return this.formInline2.select_count;
      },
      dataHeader() {
        return [
          {label: '排序', width: 90, sort: true},
          {prop: 'title', label: '题干名称'},
          {width: 200, label: '操作', groupBtn: [{text: '编辑', param: 'edit'}, {text: '删除', param: 'delete'}]}
        ]
      },
      listColumnFormatter() {
        return [{
          columnName: 'content', doFormat: function (val) {
            var data = JSON.parse(val);
            return data.body;
          }
        }]
      },
      newVideoTestId() {
        return this.$store.state.online_curriculum.newVideoTestId;
      },
      chapterList() {
        var curriculumList = this.$config.copy(this.$store.state.online_curriculum.online_curriculum_list, []);
        if (Array.isArray(curriculumList) && curriculumList.length > 0) {
          var curriculumId = this.payload.curriculum_online_id;
          for (var i = 0; i < curriculumList.length; i++) {
            if (curriculumList[i].curriculum_id == curriculumId) {
              // curriculumList[i].children = []
              // console.log(doSortFormatCatalogList(curriculumList[i].chapterList),'logggggggggg');
              // return doSortFormatCatalogList(curriculumList[i].chapterList);
            }
          }
        }
        return curriculumList || [];
      },
    },
    methods: {
      deleteFile(index) {
        this.formInline2.attachment.splice(index, 1)
      },
      uploadImg(val) {
        this.formInline2.attachment.push(val)
      },
      handleModel(item) {
        if (item.name.split('.')[item.name.split('.').length - 1] == 'jpg' || item.name.split('.')[item.name.split('.').length - 1] == 'png' || item.name.split('.')[item.name.split('.').length - 1] == 'jpeg') {
          this.accessoryImg = item.url
        } else {
          this.accessoryVideo = item.url
        }
        this.accessoryName = item.name
        this.modalAccessory = true
      },
      closeAccessory() {
        this.accessoryImg = ''
        this.accessoryVideo = ''
        this.accessoryName = ''
      },
      setSelectCount(val) {
        var labelList = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
        this.formInline2.answerList = [];
        for (var i = 0; i < val; i++) {
          this.formInline2.answerList.push({name: labelList[i], index: i, desc: '', answer: false});
        }
        this.formInline2.select_count = val;
      },
      handleClose() {
        this.addTestContentDialog = false;
      },
      handleSubmit() {
      },
      handleEditTest() {
        this.isEdit = !this.isEdit;
      },
      editHandler(index, row) {
        this.formInline2.video_test_detail_id = row.id;
      },
      deleteHandler(index, row) {
        this.$Modal.confirm({
          title: '提示',
          content: '<p>是否确定删除该题目？</p>',
          onOk: () => {
            // delete_test_detail(row.id).then(res => {
            //   if (res.data.res_code === 1) {
            //     this.dataList.splice(index, 1);
            //     this.$Modal.info({
            //       title: '提示',
            //       content: '删除成功。'
            //     });
            //     this.clearDetail();
            //   }
            // })
            postData('product/curriculum_online_catalog/delete_video_test', {video_test_detail_id: row.id}).then(res => {
              if (res.res_code == 1) {
                postData('product/curriculum_online_catalog/get_video_test', {section_id: this.section_id}).then(res => {
                  this.dataList = res.data
                })
              }
            })
          },
        });
      },
      cancelSaveHandler() {
        this.clearDetail();
      },
      saveTestDetailHandler() {
        this.$refs.formValidate.validate((valid) => {
          if(valid){
            console.log(123);
            this.formInline2.result = [];
            for (var i = 0; i < this.formInline2.answerList.length; i++) {
              if (this.formInline2.answerList[i].answer) {
                this.formInline2.result.push(i);
              }
            }
            this.formInline2.result = JSON.stringify(this.formInline2.result);
            this.formInline2.content = JSON.stringify({
              body: this.formInline2.body,
              answerList: this.formInline2.answerList
            });
            this.formInline2.attachment = JSON.stringify(this.formInline2.attachment)
            this.formInline2.test_title = this.formInline2.body
            this.formInline2.curriculum_catalog_id = this.payload.curriculum_catalog_id
            // this.formInline2.title = this.formInline1.title;
            this.formInline2.select_count = +this.formInline2.select_count
            this.formInline2.curriculum_online_id = this.payload.curriculum_online_id

            if (this.formInline2.video_test_detail_id > 0) {
              update_test_detail({...this.formInline2, ...{section_id: this.section_id},}).then(res => {
                if (res.data.res_code === 1) {
                  postData('product/curriculum_online_catalog/get_video_test', {section_id: this.section_id}).then(res => {
                    console.log(res, 'qqqqq')
                    if(res.res_code == 1){
                      res.data.forEach(item => {
                        item.attachment = JSON.parse(item.attachment)
                      })
                      this.dataList = res.data
                      this.$store.dispatch('get_online_curriculum_chapter_list', {curriculum_online_id: this.payload.curriculum_online_id})
                    }
                  })
                  this.cancelSaveHandler()
                  this.$Modal.info({
                    title: '提示',
                    content: '保存成功。'
                  });
                }
              })
            } else {
              let formChapter
              this.formInline2.curriculum_id = this.payload.curriculum_online_id
              if (this.section_id) formChapter = {...this.formInline2, ...{section_id: this.section_id}}
              else formChapter = {...this.formInline2, ...{group_orderby: this.payload.group_orderby}}
              add_test_detail(formChapter).then(res => {
                if (res.data.res_code === 1) {
                  if (res.data.data.section_id) this.section_id = res.data.data.section_id
                  this.cancelSaveHandler()
                  this.$store.dispatch('get_online_curriculum_chapter_list', {curriculum_online_id: this.payload.curriculum_online_id})
                  postData('product/curriculum_online_catalog/get_video_test', {section_id: this.section_id}).then(res => {
                    this.dataList = res.data
                  })
                  this.$Modal.info({
                    title: '提示',
                    content: '添加成功。'
                  });
                }
              })
            }
            this.cancelSaveHandler()
          }
        })
      },
      clearDetail() {
        this.formInline2.video_test_detail_id = 0;
        this.formInline2.body = '';
        this.formInline2.answerList = [];
        this.formInline2.attachment = [];
        this.setSelectCount(0);
        this.setSelectCount(4);
        this.formInline2.orderby = this.dataList.length > 0 ? this.dataList[this.dataList.length - 1].orderby + 1 : 1;
      },
      getList() {

      }
    },
    mounted() {
      this.section_id = this.payload.section_id
      this.formInline2.select_count = 4;
      if (this.section_id) {
        this.$store.dispatch('get_online_curriculum_chapter_list', {curriculum_online_id: this.payload.curriculum_online_id})
        postData('product/curriculum_online_catalog/get_video_test', {section_id: this.payload.section_id}).then(res => {
          if(res.res_code == 1){
            res.data.forEach(item => {
              item.attachment = JSON.parse(item.attachment)
              this.formInline2.title = item.group_name
            })
            this.dataList = res.data
          }
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
    .row1-test-form {
        background: #F0F0F7;
        padding: 0 30px;
    }

    .form-title {
        display: flex;
        align-items: center;
        height: 50px;
    }

    /deep/ .ivu-form-item {
        display: flex !important;
        width: 100%;
    }

    .formInput {
        width: 620px;
    }

    .input-text {
        width: 620px;
    }

    /deep/ textarea.ivu-input {
        resize: none;
    }

    /deep/ .ivu-form-item-label {
        text-align: left;
    }

    .row2-test-form {
        padding: 0 30px;
        margin-top: 30px;
    }

    .upload-list {
        display: flex;
        margin-top: 15px;

        .upload-title {
            font-family: PingFangSC-Regular;
            font-size: 14px;
            color: #F54802;
            letter-spacing: 0;
        }

        .upload-img {
            margin-left: 160px;
        }

        .upload-video {
            margin-left: 10px;
        }
    }

    .answer {
        display: flex;
        width: 700px;

        .answer-title {
            width: 80px;
            text-align: left;
            font-family: PingFangSC-Regular;
            font-size: 14px;
            color: #474C63;
            letter-spacing: 0;
        }

        .answer-checkbox {
            width: 40px;
        }
    }

    .save-test-item {
        display: flex;
        justify-content: center;

        .save-test-item-btn {
            width: 200px;
        }
    }

    .route-link {
        width: 620px;
        text-align: left;

        .route-data {
            color: #4098ff;
            margin: 0 10px;
            padding: 0 20px;
            display: flex;
            justify-content: space-between;
        }
    }

    .accessory {
        text-align: center;
        width: 100%;
    }

    .maxw {
        max-width: 100%;
    }

    .save-btn{
        display: flex;

        .clear-btn{
            margin-left: 40px;
        }
    }
    .titleFile{
        cursor: pointer;
        width: calc(100% - 40px);
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
    /deep/ .ivu-form-item-label{
        padding: 10px 8px 10px 0
    }
</style>
