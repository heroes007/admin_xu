<template>
    <div class='manage-online-course'>
        <screen :types="1" sizeTitle1="线上课总数" placehodle="搜索线上课程" :sizeNum1="pageTotal" btnName="添加课程" @inputChange="inputChange" @handleClick="handleClick" :btn-type="btnType"/>
        <data-list @editChapter='editChapterHandler' @editCourse='editCourseHandler' @moveUp='moveUpHandler' @moveDown='moveDownHandler'
                   @deleteCourse='deleteCourseHandler' class='data-list light-header' :table-data='dataList' :header-data='dataHeader'
                   :column-formatter='listColumnFormatter' :column-formatter-data='listColumnFormatterData' :table-height='listHeight'>
        </data-list>
        <page-list :current="current" :total="pageTotal" :page-size="pageSize" @page-list="pageList"/>
    </div>
</template>

<script>
  import BaseList from '../../../components/BaseList'
  import SaveOrder from '../../../components/SaveOrder'
  import {doTimeFormat} from '../../../components/Util'
  import {Dialog} from '../../dialogs';
  import {ADD_COURSE} from '../../dialogs/types'
  import {Config} from '../../../config/base'
  import screen from '../../../components/ScreenFrame'
  import pageMixin from '../../mixins/pageMixins'
  import pageList from '../../../components/Page'
  import setAuthMixins from '../setAuthMixins'
  export default {
    mixins: [Dialog, pageMixin, setAuthMixins],
    data() {
      return {
        dirty: false,
        loadingInstance: null,
        keyword: ''
      }
    },
    computed: {
      dataHeader() {
        let auth = this.btnType
        let d = [{ text: '添加章节',  param: 'editChapter'  }, { text: '编辑课程', param: 'editCourse' },{ text: '删除', param: 'deleteCourse' }]
        let btnList = auth ? d : [{ text: '查看',  param: 'editChapter'  }]
        return [{
          sort: true,
          label: '序号',
          width: 90
        },
        {
          prop: 'title',
          label: '课程名称',
          minWidth: 160,
          align: 'left'
        },
        {
          prop: 'teacher_name',
          label: '讲师',
          width: 100
        },
         {
          prop: 'department_name',
          label: '科室',
          width: 80
        },
        {
          prop: 'grade_name',
          label: '年级',
          width: 120
        },
         {
          prop: 'state',
          label: '状态',
          width: 120
        }, {
          prop: 'create_time',
          label: '创建时间',
          width: 120
        }, {
          label: '操作',
          width: 320,
          align: 'center',
            groupBtn: btnList
        }]
      },
      listColumnFormatter() {
        return [{
          columnName: 'create_time',
          doFormat: doTimeFormat
        }, {
          columnName: 'grade_id',
          dataIndex: 0,
          dataProp: 'id',
          dataValue: 'name'
        }, {
          columnName: 'subject_id',
          dataIndex: 1,
          dataProp: 'id',
          dataValue: 'name'
        }, {
          columnName: 'state',
          dataIndex: 2,
          dataProp: 'id',
          dataValue: 'name'
        }]
      },
      listColumnFormatterData() {
        return [[], [], this.stateList];
      },
      dataList() {
        return this.$store.state.online_curriculum.online_curriculum_list;
      },
      pageTotal() {
        return this.$store.state.online_curriculum.total;
      },
      stateList() {
        return this.$store.state.online_curriculum.stateList;
      },
      // isLoading() {
      //   return this.$store.state.online_curriculum.showMainLoading;
      // },
      listHeight() {
        return window.innerHeight - 60 - 50 - 70;
      },
    },
    watch: {
      // isLoading(val) {
      //   if (val) {
      //     this.loadingInstance = this.$LoadingY({message: "加载中，请稍后", show: true})
      //     setTimeout(() => {
      //       this.loadingInstance.close();
      //     }, Config.base_timeout);
      //   } else {
      //     if (this.loadingInstance) this.loadingInstance.close();
      //     this.dirty = false;
      //   }
      // },
    },
    methods: {
      submit(){
        this.initData()
      },
      inputChange(val){
        this.keyword = val
        this.initData()
      },
      handleClick(val){
        this.handleSelModal(ADD_COURSE, {
            page: {page_size: this.pageSize, page_num: this.current},
            keyword: this.keyword,
            state: 1,
            modify: 1
        });
      },
      editChapterHandler(index) {
        this.$router.push({
          name: 'online-course-chapter',
          params: {
            id: this.dataList[index].id,
            title: this.dataList[index].title
          }
        });
      },
      editCourseHandler(index,row) {
        this.handleSelModal(ADD_COURSE, {
              page: {page_size: this.pageSize, page_num: this.current},
              keyword: this.keyword,
              state: 0,
              index,
              row,
              modify: 0
        });
      },
      moveUpHandler(index) {
        this.dirty = true;
        this.$store.dispatch('change_online_curriculum_orderby', {
          curriculum_id: this.dataList[index].curriculum_id,
          dir: 0
        });
      },
      moveDownHandler(index) {
        this.dirty = true;
        this.$store.dispatch('change_online_curriculum_orderby', {
          curriculum_id: this.dataList[index].curriculum_id,
          dir: 1
        });
      },
      resetCurriculumOrder() {
        this.$store.dispatch('reset_online_curriculum_orderby');
        this.dirty = false;
      },
      deleteCourseHandler(index, item) {
        this.$Modal.confirm({
          title: '提示',
          content: '<p>是否确定删除该课程？</p>',
          onOk: () => {
            this.$store.dispatch('delete_online_curriculum', {
              id: this.dataList[index].id
            })
          },
        });
      },
      showDeleteConfirm(id) {
        this.$Modal.confirm({
          title: '提示',
          content: '<p>是否确定删除该课程？</p>',
          onOk: () => {
            this.$store.dispatch('delete_online_curriculum', {
              id: id
            })
          },
        });
      },
      addCourseHandler() {
        if (this.dirty) {
          this.$Modal.confirm({
            title: '提示',
            content: '<p>您已修改课程排序，是否放弃保存</p>',
            onOk: () => {
              this.resetCurriculumOrder();
              this.handleSelModal(ADD_COURSE);
            },
          });
        } else this.handleSelModal(ADD_COURSE);
      },
      initData() {
        var vm = this;
          vm.$store.dispatch('get_online_curriculum_list', {
            // project_id: v,
            page: {page_size: this.pageSize, page_num: this.current},
            keyword: this.keyword
          }).then(res => {});
      }
    },
    mounted() {
      this.initData();
      this.$store.dispatch('get_online_curriculum_chapter_list', {curriculum_online_id: parseInt(this.$route.params.id)})
    },
    components: {
      'data-list': BaseList,
      'save-order': SaveOrder,
       screen, pageList
    }
  }

</script>
<style scoped lang="less">
    /deep/ .ivu-btn-text{
      font-family: PingFangSC-Medium;
      font-size: 16px;
      color: #4098FF;
      letter-spacing: 0;
    }
    .manage-online-course{
        overflow: hidden;
        overflow-y: auto;
    }
</style>
