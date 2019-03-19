<template>
    <div class='manage-online-course-chapter'>
        <screen :types="6" btn-name="添加章节" @handleClick="handleClick" @handleBack="handleBack" :title="screenTitle" :btnType="true"/>
        <div class='chapter-container'>
            <div class='scroll-wrap'>
                <div class='chapter-list'>
                    <div class='chapter-item' v-for='(item,index) in chapterList'>
                        <div>
                            <Row class='chapter-title' type='flex' justify='space-between' align='middle'>
                                <div style="display: flex;align-items: center">
                                    <span class="row-title">第{{index + 1}}章</span>
                                    <Input v-model="item.group_name" @on-change="editorNote(item, index)"
                                         @on-blur="outInput(index)" @on-focus="showDataState(index)" class="textInput" style="width: 300px;"/>
                                </div>
                                <div style="margin-right: 25px;">
                                    <Button type='text' @click="addVideo(item)">添加视频</Button>
                                    <Button type='text' @click="addTest(item, index)">添加测验</Button>
                                    <Button v-if='showListState[index] == 0' type="text"  @click="toggleListShow(index,item)">展开</Button>
                                    <Button v-else-if='showListState[index] == 1' type="text"  @click="toggleListShow(index)">收起</Button>
                                </div>
                            </Row>
                        </div>
                        <data-list @edit='editHandler' @moveUp='moveUpHandler' @moveDown='moveDownHandler'
                                   @delete='deleteHandler' class='data-list light-header'
                                   :table-data='item.children' :header-data='dataHeader'
                                   :is-stripe='false'
                                    v-if='showListState[index] == 1 && item.hasOwnProperty("children") && item.children.length > 0'></data-list>
                    </div>
                    <div class='chapter-item' v-if='newChapterData.showAddChapter'>
                        <Row class='chapter-title' type='flex' justify='space-between' align='middle'>
                            <div style="display: flex;align-items: center">
                                <span class="row-title">第{{chapterList.length + 1}}章</span>
                                <Input v-model="newChapterData.group_name"   @on-blur="saveChapter(newChapterData,true)" placeholder="请输入章节名称"
                                       @on-focus="showDataState(0)" class="textInput" style="width: 300px;"/>
                            </div>
                            <div style="margin-right: 25px;">
                                <Button type='text' @click="addVideo()">添加视频</Button>
                                <Button type='text' @click="addTest()">添加测验</Button>
                                <!--<Button v-if='showListState[0] == 0' type="text"  @click="toggleListShow(0)">展开</Button>-->
                                <!--<Button v-else-if='showListState[0] == 1' type="text"  @click="toggleListShow(0)">收起</Button>-->
                            </div>
                        </Row>
                    </div>
                </div>
            </div>
        </div>
        <save-order v-if='dirty' @saveOrder='saveOrderHandler' @cancelChange='resetOrder'/>
    </div>
</template>

<script>
  import Header from '../../components/ProjectHeader'
  import screen from '../../components/ScreenFrame'
  import BaseList from '../../components/BaseList'
  import SaveOrder from '../../components/SaveOrder'
  import {doTimeFormat} from '../../components/Util'
  import {Dialog} from '../dialogs'
  import {VIDEO_MANAGE, ADD_QUESTION} from '../dialogs/types'
  import {Config} from '../../config/base'
  import {doSortFormatCatalogList} from '../../components/Util'
  import updateVideoGroupName from '../../api/modules/onlineCourseChapter'

  export default {
    mixins: [Dialog],
    components: {'header-component': Header, 'data-list': BaseList, 'save-order': SaveOrder, screen},
    data() {
      return {
        dirty: false,
        showListState: {},
        newChapterData: {
          showAddChapter: false,
          group_name: '',
          group_orderby: -1
        },
        isInited: false,
        isChapterInited: false,
        curriculumItem: {},
        screenTitle: '这是一个作业名称',
      }
    },
    computed: {
      roleList() {
        return this.$store.state.roles.role_list;
      },
      dataHeader() {
        return [
          {label: '排序', width: 90, sort: true},
          {
            prop: 'group_name', label: '小节名称'
          },
          // {
          //   prop: '',
          //   label: '观看权限',
          //   width: 200,
          //   mixColumn: true,
          //   useFormatter: true,
          //   mixprop: 'mix_role',
          //   mixFunc: (function (data) {
          //     var roles;
          //     if (data.type === 0) {
          //       roles = data.video_role;
          //     } else if (data.type === 1) {
          //       roles = data.video_test_role;
          //     }
          //     return roles;
          //   })
          // },
          {prop: 'create_time', label: '创建时间', width: 200},
          {
            label: '操作', width: 350, groupBtn: [
              {text: '编辑', param: 'edit'},
              {text: '上移', param: 'moveUp' },
              {text: '下移', param: 'moveDown' },
              {text: '删除', param: 'delete' }]
          }
        ]
      },
      listColumnFormatter() {
        return [
          {columnName: 'create_time', doFormat: doTimeFormat},
          {
            columnName: 'mix_role',
            dataIndex: 0,
            dataProp: 'id',
            dataValue: 'name'
          },
        ]
      },
      listColumnFormatterData() {
        return [this.roleList];
      },
      isLoading() {
        return this.$store.state.online_curriculum.showChapterLoading;
      },
      curriculumName() {
         var curriculumList = this.$config.copy(this.$store.state.online_curriculum.online_curriculum_list,[]);
        if (Array.isArray(curriculumList) && curriculumList.length > 0) {
          var curriculumId = this.$route.params.id;
          for (var i = 0; i < curriculumList.length; i++) {
            if (curriculumList[i].curriculum_id == curriculumId) return curriculumList[i].title;
          }
        }
        return '';
      },
      chapterList() {
          var curriculumList = this.$config.copy(this.$store.state.online_curriculum.online_curriculum_list,[]);
        if (Array.isArray(curriculumList) && curriculumList.length > 0) {
          var curriculumId = this.$route.params.id;
          for (var i = 0; i < curriculumList.length; i++) {
            if (curriculumList[i].curriculum_id == curriculumId) {
              // curriculumList[i].children = []
                // return doSortFormatCatalogList(curriculumList[i].chapterList);
            }
          }
        }
        return curriculumList || [];
      },
      curriculumList() {
        return this.$store.state.online_curriculum.online_curriculum_list;
      }
    },
    watch: {
      isLoading(val) {
        this.$config.IsLoading(val);
      },
      chapterList(list) {
        if (Array.isArray(list)) {
          if (list.length === 0) {
            this.newChapterData.showAddChapter = true;
            this.newChapterData.group_orderby = 1;
          } else {
            this.newChapterData.showAddChapter = false;
            this.newChapterData.group_orderby = list[list.length - 1].group_orderby + 1;
            this.newChapterData.group_name = '';
          }
          this.setChapterShowState();
        }
      },
      curriculumList(val) {
        if (!this.isInited) this.initChapter();
      },
      $route(to, from) {
        if (this.$route.name == "online-course-chapter") this.getLists()
      }
    },
    methods: {
      saveChapter2(t,i){

      },
      saveChapter(t,i){
        let d = {}
        d.curriculum_id = +this.$route.params.id
        d.curriculum_online_id =  +this.$route.params.id
        if(i === true){
          d.group_name = t.group_name
        }else{
         d = t
         delete d.duration
         delete d.video_url
        }
        this.$store.dispatch('add_online_curriculum_video',d)
      },
      handleClick(val) {
        this.newChapterData.showAddChapter = true;
      },
      handleBack() {
        // if (this.dirty) this.resetOrder();
        this.$router.replace({name: 'open-product'});
      },
      showDataState(i) {
        // this.showListState[i] = 0
        document.querySelectorAll('.ivu-input')[i].style.backgroundColor = '#fff'
        this.$set(this.showListState, i, 0);
      },
      outInput(index){
        document.querySelectorAll('.ivu-input')[index].style.backgroundColor = '#FBFBFB'
      },
      editorNote(val, nums) {
        let d = {
          id: val.id,
          group_name: val.group_name
        }
        updateVideoGroupName(d).then((res) => {
          if(res.data.res_code === 1) {
          // this.$Message.success(res.data.msg);
          }
        })
      },
      openModal(modal, row, type) {
        let item = type == 1 ? {video_id: row.video_id} : {video_test_id: row.video_test_id}
        this.handleSelModal(modal, {
          curriculum_id: row.curriculum_id,
          group_name: row.group_name,
          group_orderby: row.group_orderby,
          ...item
        });
      },
      editHandler(i, row) {
        if(row.type === 0) {
          this.handleSelModal(VIDEO_MANAGE,{...row,video_edit: true,curriculum_catalog_id: row.id, curriculum_online_id: parseInt(this.$route.params.id)})
        }else{
          this.handleSelModal(ADD_QUESTION, {
            curriculum_online_id: parseInt(this.$route.params.id),
            // curriculum_catalog_id: row.id,
            // group_name: row.group_name,
            // group_orderby: row.id,
            // orderby: row.orderby + 1,
            // curriculum_id: row.curriculum_id,
            // list_index: i,
            isEdit: true,
            section_id: row.id
          });
        }
        // if (row.type === 0) this.openModal(VIDEO_MANAGE, {y: 1111,...row}, 1)
        // else if (row.type === 1) this.openModal(ADD_QUESTION, row, 2)
      },
      moveHandler(row, type) {
        this.dirty = true;
        this.$store.dispatch('change_online_curriculum_chapter_orderby', {
          curriculum_id: this.$route.params.id,
          dir: type,
          catalog_id: row.catalog_id,
          group_orderby: row.group_orderby
        });
      },
      moveUpHandler(index, row) {
        this.moveHandler(row, 0)
      },
      moveDownHandler(index, row) {
        this.moveHandler(row, 1)
      },
      deleteHandler(index, row) {
        if (this.dirty) {
          this.$Modal.confirm({
            title: '提示',
            content: '<p>您已修改小节排序，是否放弃保存</p>',
            onOk: () => {
              this.resetOrder();
              this.showDeleteConfirm(row.id);
            },
          });
        } else this.showDeleteConfirm(row.id);
      },
      showDeleteConfirm(d) {
        this.$Modal.confirm({
          title: '提示',
          content: '<p>是否确定删除该小节？</p>',
          onOk: () => {
            this.$store.dispatch('delete_online_curriculum_catalog',d)
          },
        });
      },
      toggleListShow(index,t) {
        this.showListState[index] = 1 - this.showListState[index];
      },
      addChapterHandler() {
        this.newChapterData.showAddChapter = true;
      },
      saveOrderHandler() {
        this.$store.dispatch('save_online_curriculum_chapter_orderby', {curriculum_id: this.$route.params.id})
      },
      resetOrder() {
        this.$store.dispatch('reset_online_curriculum_chapter_orderby', {curriculum_id: this.$route.params.id})
        this.dirty = false;
      },
      backClickHandler() {
        if (this.dirty) this.resetOrder();
        this.$router.replace({name: 'open-product'});
      },
      initChapter() {
        this.newChapterData.showAddChapter = false;
        this.dirty = false;
        this.$store.dispatch('get_online_curriculum_chapter_list', {curriculum_online_id: parseInt(this.$route.params.id)})
        // if (this.chapterList.length === 0) this.$store.dispatch('get_online_curriculum_chapter_list', {curriculum_online_id: parseInt(this.$route.params.id)})
        // else this.setChapterShowState();
        this.isInited = true;
      },
      setChapterShowState() {
        var i;
        if (!this.isChapterInited && this.chapterList.length > 0) {
          for (i = 0; i < this.chapterList.length; i++) {
            this.$set(this.showListState, i, 0);
          }
          this.isChapterInited = true;
        }
        if (this.showListState[this.chapterList.length - 1] == undefined) {
          for (i = 0; i < this.chapterList.length; i++) {
            if (this.showListState[i] == undefined) this.$set(this.showListState, i, 1);
          }
        }
      },
      addVideo(item) {
        if (!item) {
          // if (this.newChapterData.group_name) {
          //   this.handleSelModal(VIDEO_MANAGE, {
          //     curriculum_id: parseInt(this.$route.params.id),
          //     group_name: this.newChapterData.group_name,
          //     group_orderby: this.newChapterData.group_orderby,
          //     orderby: 1,
          //     parent_id: parseInt(this.$route.params.id)
          //   })
          // } else
          this.$Modal.info({title: '提示', content: '<p>请先添加章节名称</p>'});
        } else {
          this.handleSelModal(VIDEO_MANAGE, {
            curriculum_online_id: +this.$route.params.id,
            curriculum_id: item.curriculum_id,
            parent_id: item.id,
            group_name: item.group_name,
            group_orderby: item.group_orderby,
            orderby: item.orderby + 1,
            type: 0
          });
        }
      },
      addTest(item, index) {
        // console.log(item, index, 'add')
        if (!item) {
          // if (this.newChapterData.group_name) {
          //   this.handleSelModal(ADD_QUESTION, {
          //     curriculum_id: parseInt(this.$route.params.id),
          //     group_name: this.newChapterData.group_name,
          //     group_orderby: this.newChapterData.group_orderby,
          //     orderby: 1
          //   })
          // } else
          this.$Modal.info({title: '提示', content: '<p>请先添加章节名称</p>'});
        } else {
          this.handleSelModal(ADD_QUESTION, {
            curriculum_online_id: parseInt(this.$route.params.id),
            curriculum_catalog_id: item.id,
            group_name: item.group_name,
            group_orderby: item.id,
            orderby: item.orderby + 1,
            curriculum_id: item.curriculum_id,
            list_index: index,
            section_id: item.id,
            curriculum_data: item
          });
        }
      },
      getLists() {
        //   console.log(this.$store.state.online_curriculum.online_curriculum_list,'this.$store.state.online_curriculum.online_curriculum_list')
        // if (this.$store.state.online_curriculum.online_curriculum_list.length === 0) this.$store.dispatch('get_online_curriculum_chapter_list', {curriculum_online_id: this.$store.state.project.select_project_id});
        // else
        this.initChapter();
        // this.$store.dispatch('get_role_list');
      }
    },
    mounted() {
      this.getLists()
    }
  }

</script>
<style scoped lang='scss'>
    /deep/ .ivu-input {
        border: none;
        background-color: #FBFBFB;
        font-size: 16px !important;
    }

    /deep/ .ivu-icon {
        font-size: 24px
    }

    /deep/ .ivu-btn-text:focus{
        box-shadow: none;
    }

    .textInput{
        margin-left: 40px;
        width: 300px;
        font-family: PingFangSC-Medium;
        color: #474C63;
        letter-spacing: 0;
    }
    .row-title{
        font-family: PingFangSC-Medium;
        font-size: 16px;
        color: #474C63;
        letter-spacing: 0;
    }

    .manage-online-course-chapter {
        height: 100%;

        .course-name {
            height: 60px;
            background-color: #ffffff;
            padding: 0 40px;

            h2 {
                font-size: 16px;
                color: #141111;
                letter-spacing: 0;
                font-weight: 400;
            }
        }

        .data-list {
            .base-list-row {
                .handle-component {
                    margin-right: 30px;

                    + .handle-component {
                        margin-right: 2px;
                    }

                    &:last-child {
                        margin-left: 50px;
                    }
                }
            }
        }

        .chapter-container {
            box-sizing: border-box;
            width: 100%;
            height: 100%;
            top: 0;
            z-index: 0;
            pointer-events: none;

            .scroll-wrap {
                overflow-y: auto;
                height: 100%;
                width: 100%;
                pointer-events: auto;
            }
        }

        .chapter-list {
            .chapter-item {
                .chapter-title {
                    padding: 0 40px;
                    background-color: #FBFBFB;
                    border: 1px solid #E5E5E5;
                    height: 60px;


                    /deep/ .ivu-btn-text{
                        border: none !important;
                        font-family: PingFangSC-Regular;
                        font-size: 16px;
                    }


                    span,
                    h3 {
                        font-size: 16px;
                        color: #141111;
                        letter-spacing: 0;
                        font-weight: 400;
                        display: inline-block;
                    }

                    input {
                        outline: 0;
                        font-size: 16px;
                        color: #141111;
                        letter-spacing: 0;
                        border: 0;
                        background-color: transparent;
                    }

                    i {
                        color: #cccccc;
                        cursor: pointer;
                    }
                }

                .chapter-btns {
                    margin-top: 25px;
                    padding: 0 40px;

                    .warning {
                        font-size: 14px;
                        color: #3DAAFF;
                    }

                    .el-button {
                        font-size: 14px;
                        color: #3B3B3B;
                        letter-spacing: 0;

                        &:hover {
                            color: #3DAAFF;
                        }
                    }

                    .line {
                        width: 1px;
                        background-color: #e5e5e5;
                        height: 14px;
                        display: inline-block;
                        margin: 0 8px;
                    }
                }
            }
        }

        .save-order {
            position: absolute;
            right: 100px;
            top: 70px;
        }
    }
</style>
