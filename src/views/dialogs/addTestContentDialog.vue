<template>
    <Modal :transfer=false title="添加测验" v-model="addTestContentDialog" :footer-hide="true"
           @on-cancel="handleRemoveModal(remove)" size="auto" :mask-closable="false" width="800">
        <base-input @closedialog="handleClose">
            <Row slot="body">
                <Form :inline="true" :model="formInline1" class="row1-test-form" label-position="left">
                    <FormItem label="测验名称" class="form-title">
                        <Input class="formInput" v-model="formInline1.title" placeholder="请输入测验的名称" :disabled='isEdit'></Input>
                    </FormItem>
                    <!--<FormItem label="测验权限">-->
                        <!--<Select v-model="formInline1.video_test_roles" placeholder="选择测验权限" :disabled='isEdit' multiple>-->
                            <!--<Option v-for="item in roleList" :key="item.id" :label="item.role_name" :value="item.role_id"></Option>-->
                        <!--</Select>-->
                    <!--</FormItem>-->
                    <!--<FormItem class="save-test">-->
                        <!--<Button type="primary" @click="handleSaveTest" class="save-test-btn" v-if='!isEdit'>保存测验</Button>-->
                        <!--<Button @click="handleEditTest" class="edit-test-btn" v-if='isEdit'>编辑测验</Button>-->
                    <!--</FormItem>-->
                </Form>
                <Form :inline="true" :model="formInline2" class="row2-test-form">
                    <FormItem label="题干名称">
                        <Input type="textarea" :rows="5" placeholder="请输入内容" v-model="formInline2.body" class="input-text"></Input>
                        <div class="route-link" ref="formInput">
                            <div class="route-data" v-for="(item, index) in accessoryList" :key="index">
                                <span style="cursor: pointer" @click="handleModel(item)">{{item.name}}</span>
                            </div>
                        </div>
                        <div class="upload-list">
                            <div class="upload-title">* 只能上传 jpg/png/mp4/mov/avi 文件，且不超过2m</div>
                            <uploadBtn class="upload-img" text="上传附件" bucket="dscj-app" @uploadcomplete="uploadImg"/>
                        </div>
                    </FormItem>
                    <FormItem label="选项数量">
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
                    <FormItem v-for='(item, index) in answerList' :key="item.id">
                        <div class="answer">
                            <div class="answer-title"><span v-if="index == 0">选项结果</span></div>
                            <Checkbox class="answer-checkbox" v-model="item.answer">{{item.name}}</Checkbox>
                            <Input placeholder="请输入内容" v-model="item.desc"></Input>
                        </div>
                    </FormItem>
                    <!-- <span style="clear: left"></span> -->
                    <FormItem class="save-test-item">
                        <!--<Button @click="cancelSaveHandler" class="cancel-test-item-btn">取消</Button>-->
                        <Button type="primary" @click="saveTestDetailHandler" class="save-test-item-btn">保存</Button>
                    </FormItem>
                    <Row class="quetion-list">
                        <data-list @edit='editHandler' @delete='deleteHandler' class='data-list light-header' :table-data='dataList'
                                   :header-data='dataHeader' :column-formatter='listColumnFormatter' :is-stripe='false'></data-list>
                    </Row>
                </Form>
            </Row>
        </base-input>
        <Modal v-model="modalAccessory" :title="accessoryName" :mask-closable="false" :footer-hide="true" :closable="true" @on-cancel="closeAccessory" width="600">
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
  import { get_detail, get_test_detail_list, add_test_detail, update_test_detail, delete_test_detail } from '../../api/modules/tools_video_test'
  import { RemoveModal } from './mixins'
  import { MPop } from '../../components/MessagePop'

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
          select_count: -1,
          orderby: 1,
          answerList: [],
          result: [],
          content: ''
        },
        dataList: [],
        isEdit: false,
        accessoryList: [],
        modalAccessory: false,
        accessoryImg: '',
        accessoryVideo: '',
        accessoryName: ''
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
          this.setSelectCount(detail.select_count);
          this.formInline2.orderby = detail.orderby;
          for (i = 0; i < detailData.answerList.length; i++) {
            this.formInline2.answerList[i].answer = detailData.answerList[i].answer;
            this.formInline2.answerList[i].desc = detailData.answerList[i].desc;
          }
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
        if (this.formInline1.video_test_id === 0)  this.formInline1.video_test_id = val;
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
      roleList() {
        return this.$store.state.roles.role_list;
      },
      dataHeader() {
        return [
          {label: '排序', width: 90, sort: true},
          {prop: 'content', label: '题干名称'},
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
      }
    },
    methods: {
      uploadImg(val){
        this.accessoryList.push(val)
      },
      handleModel(item){
        console.log(item.name.split('.')[item.name.split('.').length-1])
        if(item.name.split('.')[item.name.split('.').length-1] == 'jpg' || item.name.split('.')[item.name.split('.').length-1] == 'png'){
          this.accessoryImg = item.url
        }else{
          this.accessoryVideo = item.url
        }
        this.accessoryName = item.name
        this.modalAccessory = true
      },
      closeAccessory(){
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
      handleSubmit() { },
      handleSaveTest() {
        if (this.payload.video_test_id) this.$store.dispatch('edit_online_curriculum_test', this.formInline1)
        else this.$store.dispatch('add_online_curriculum_test', this.formInline1)
        this.isEdit = true;
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
            delete_test_detail(row.id).then(res => {
              if (res.data.res_code === 1) {
                this.dataList.splice(index, 1);
                this.$Modal.info({
                  title: '提示',
                  content: '删除成功。'
                });
                this.clearDetail();
              }
            })
          },
        });
      },
      cancelSaveHandler() {
        this.clearDetail();
      },
      saveTestDetailHandler() {
        // if (this.formInline1.video_test_id === 0) {
        //   this.$Modal.info({
        //     title: '提示',
        //     content: '请先保存测验，再添加题干。'
        //   });
        // } else if (this.formInline1.video_test_roles.length === 0) {
        //   this.$Modal.info({
        //     title: '提示',
        //     content: '请选择测验权限',
        //     onOk: () => {
        //       action => { }
        //     },
        //   });
        // } else {
        // new Promise((resolve, reject)=>{
        //   this.$store.dispatch('add_online_curriculum_test', this.formInline1)
        //   resolve()
        // }).then(res=>{
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
          this.formInline2.curriculum_catalog_id = this.payload.curriculum_catalog_id
          this.formInline2.title = this.formInline1.title;
          this.formInline2.select_count = +this.formInline2.select_count
          // console.log(this.formInline2,'this.formInline2',this.payload)
          if (this.formInline2.video_test_detail_id > 0) {
            update_test_detail(this.formInline2.video_test_detail_id, this.formInline2).then(res => {
              if (res.data.res_code === 1) {
                for (var i = 0; i < this.dataList.length; i++) {
                  if (this.dataList[i].id === this.formInline2.video_test_detail_id) {
                    this.dataList[i].content = this.formInline2.content;
                    this.dataList[i].orderby = this.formInline2.orderby;
                    this.dataList[i].result = this.formInline2.result;
                    this.dataList[i].select_count = this.formInline2.select_count;
                    break;
                  }
                }
                this.cancelSaveHandler()
                this.$Modal.info({
                  title: '提示',
                  content: '保存成功。'
                });
              }
            })
          } else {
            add_test_detail(this.formInline2).then(res => {
              if (res.data.res_code === 1) {
                // this.dataList.push({
                //   id: res.data.msg,
                //   content: this.formInline2.content,
                //   orderby: this.formInline2.orderby,
                //   result: this.formInline2.result,
                //   select_count: this.formInline2.select_count,
                //   video_test_id: this.formInline1.video_test_id
                // })
                this.cancelSaveHandler()
                this.$Modal.info({
                  title: '提示',
                  content: '添加成功。'
                });
              }
            })
          }
          // this.cancelSaveHandler()
        // })

        // }
      },
      clearDetail() {
        this.formInline2.video_test_detail_id = 0;
        this.formInline2.body = '';
        this.formInline2.answerList = [];
        this.setSelectCount(0);
        this.setSelectCount(4);
        this.formInline2.orderby = this.dataList.length > 0 ? this.dataList[this.dataList.length - 1].orderby + 1 : 1;
      },
      getList(){

      }
    },
    mounted() {
      // this.$store.dispatch('get_role_list');
      this.formInline1.curriculum_id = this.payload.curriculum_id;
      this.formInline1.group_name = this.payload.group_name;
      this.formInline1.group_orderby = this.payload.group_orderby;
      this.formInline1.orderby = this.payload.orderby;
      this.formInline2.select_count = 4;
      if (this.payload.video_test_id) {
        this.formInline1.video_test_id = this.payload.video_test_id;
        this.isEdit = true;
        get_detail(this.payload.video_test_id).then(res => {
          if (res.data.res_code === 1) {
            this.formInline1.video_test_id = this.payload.video_test_id;
            this.formInline1.title = res.data.msg.video_test[0].title;
            this.formInline1.video_test_roles = res.data.msg.role ? res.data.msg.role : [];
          }
        })
        get_test_detail_list(this.payload.video_test_id).then(res => {
          if (res.data.res_code === 1) {
            this.dataList = res.data.msg;
            this.clearDetail();
          }
        })
      } else {
        this.formInline2.orderby = 1;
      }
    }
  }
</script>
<style lang="scss" scoped>
    .row1-test-form{
        background: #F0F0F7;
        padding: 0 30px;
    }
    .form-title{
        display: flex;
        align-items: center;
        height: 50px;
    }
    /deep/ .ivu-form-item{
        display: flex !important;
        width: 100%;
    }
    .formInput{
        width: 630px;
    }
    .input-text{
        width: 630px;
    }
    /deep/ textarea.ivu-input{
        resize: none;
    }
    /deep/ .ivu-form-item-label{
        text-align: left;
    }
    .row2-test-form{
        padding: 0 30px;
        margin-top: 30px;
    }
    .upload-list{
        display: flex;
        margin-top: 15px;

        .upload-title{
            font-family: PingFangSC-Regular;
            font-size: 14px;
            color: #F54802;
            letter-spacing: 0;
        }
        .upload-img{
            margin-left: 160px;
        }
        .upload-video{
            margin-left: 10px;
        }
    }
    .answer{
        display: flex;
        width: 700px;

        .answer-title{
            width: 80px;
            text-align: left;
            font-family: PingFangSC-Regular;
            font-size: 14px;
            color: #474C63;
            letter-spacing: 0;
        }
        .answer-checkbox{
            width: 40px;
        }
    }
    .save-test-item{
        display: flex;
        justify-content: center;

        .save-test-item-btn{
            width: 200px;
        }
    }
    .route-link{
        width: 630px;
        text-align: left;

        .route-data{
            color: #4098ff;
            margin: 0 10px;
        }
    }
    .accessory{
        text-align: center;
        width: 100%;
    }
    .maxw{
        max-width: 100%;
    }
</style>
