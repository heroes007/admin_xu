<template>
    <div class='manage-offline-course'>
        <FormModal modalFalse date-times :detail-data="tableRow" :show-modal='show' :form-list="formList" @close="closeModal2" @from-submit="handleSubmit" :title="modalTitle" :rule-validate="rules"/>
        <screen :btn-type="btnType" :types="6" :title="title" btnName="添加学期" @handleBack="handleBack" @handleClick="addOfflineSemesterHandler"/>
        <data-list @copy="copyItem" @detail='showCourseDetailHandler' @editCourse='editCourseHandler' @moveUp='moveUpHandler' @moveDown='moveDownHandler' @deleteCourse='deleteCourseHandler'
                   @childBtnClick='childBtnClickHandler' @add='addOfflineCourse' @edit='editOfflineSemester' @expandOpen='rowExpandHandler' @delete='deleteOfflineSemester'
                   @sendOfflineCourse="sendOfflineCourseHandler" @manageSignup='manageSignupHandler' class='data-list light-header' :table-data='dataList' @add-off-line-courses="addOffLineCourses"
                   :header-data='dataHeader' :is-stripe='false' :table-height='listHeight'></data-list>
         <Page :current="page_num" :total="page_conut" :page-size="pageSize" @on-change="pageList"></Page>
    </div>
</template>

<script>
  import BaseList from '../../../components/BaseList'
  import SaveOrder from '../../../components/SaveOrder'
  import screen from '../../../components/ScreenFrame'
  import { doTimeFormat, doDateFormat, doOfflineCurriculumTypeFormat } from '../../../components/Util'
  import { Dialog } from '../../dialogs';
  import * as types from '../../dialogs/types';
  import { mapActions, mapState } from 'vuex'
  import { Config } from '../../../config/base'
  import postData from '../../../api/postData.js'
  import FormModal from '../../../components/FormModal.vue'
  import setAuthMixins from '../setAuthMixins'

  export default {
    mixins: [Dialog, setAuthMixins],
    components: { 'data-list': BaseList, 'save-order': SaveOrder, screen, FormModal },
    data() {
      return {
        show: false,
        gradeList: [{
          id: 1,
          name: '小学'
        }],
        subjectList: [{
          id: 1,
          name: '英语'
        }],
        dirty: false,
        loadingInstance: null,
        isdelete: false,
        deleteData: null,
        courseNums: 12,
        showModal: false,
        detailData: {},
        subject_id: JSON.parse(localStorage.getItem('OffLineClassTheme')).id,
        title: JSON.parse(localStorage.getItem('OffLineClassTheme')).title,
        current: 1,
        total: null,
        pageSize: 12,
        page_num: 1,
        tableRow: {},
        modalTitle: '',
        show: false,
        formList: [
            { type: 'input', name: '课程名称',  field: 'title'},
            { type: 'date', name: '开课时间',  field: 'start_time' },
            { type: 'date', name: '结课时间',  field: 'end_time' },
            { type: 'select', name: '课程讲师', field: 'teacher_id' ,
                selectList: [], selectField: [ 'id','name' ]
            },
            { type: 'select', name: '课程类型', field: 'type' ,
                selectList: [{id: 1, name: '讲座'},{id: 2, name: '实践'}], selectField: [ 'id','name' ]
            }
        ],
        rules:{
            title: [{ required: true, message: '请输入课程名称', trigger: 'blur' } ],
            start_time: [{ type: 'date', required: true, message: '请输入开课时间'} ],
            end_time: [{  type: 'date', required: true, message: '请输入结课时间'}],
            teacher_id: [{required: true, message: '请选择课程讲师'}],
            type: [{required: true, message: '请选择课程类型'}],
        },
        term_row: null,
        listHeight: null
      }
    },
    computed: {
      ...mapState({
        offline_curriculum_detail1: state => state.offline_curriculum.offline_curriculum_detail,
        page_conut: state => state.offline_curriculum.page_conut,
      }),
      dataHeader() {
        let d =  [
              { text: '编辑', param: 'edit' },
              { text: '复制', param: 'copy' },
              { text: '发送', param: 'sendOfflineCourse' },
              { text: '删除', param: 'delete', }];
        let btnList2 = [{ text: '编辑', param: 'editCourse' }, { text: '删除', param: 'deleteCourse' }]
        let btnList = this.btnType ? d : [{ text: '发送', param: 'sendOfflineCourse' }]
        let data = [
          {
            sort: true,
            label: '序号',
            width: 60
          }, {
            prop: 'title',
            label: '学期名称',
            align: 'left',
            minWidth: 200
          },
          {
            prop: 'curriculum_num',
            label: '课程数量',
            width: 100
          },
          {
            prop: 'student_num',
            label: '参加人数',
            width: 100
          }, {
            prop: '',
            label: '开课日期',
            width: 260,
            mixColumn: true,
            mixFunc: (function (data) {
              var open_date = doTimeFormat(data.start_time);
              var end_date = doTimeFormat(data.end_time);
              let d = end_date ? '至' + end_date : ''
              return open_date + d;
            })
          },
          {
            prop: 'register_end_time',
            label: '报名截止日期',
            width: 150,
          },
          {
            label: '操作',
            width: 260,
            groupBtn: btnList
          },
          {
            listExpand: true,
            width: 90,
            listExpandBtn: this.btnType,
            childHeader: [
            {
              prop: '',
              label: '',
              width: 100,
              className: 'prop_key_0'
            },{
              prop: 'title',
              label: '课程名称',
              align: 'left'
            },
             {
              prop: 'type_text',
              label: '类型',
              width: 120
            },
              {
                prop: 'teacher_name',
                label: '讲师',
                width: 180
              },
             {
              prop: 'start_time',
              label: '开课时间',
              width: 180
            },
            {
              prop: 'end_time',
              label: '结课时间',
              width: 180
             }
            ]
          }
        ]
        if(this.btnType) data[7].childHeader.push({ label: '操作', width: 260,  groupBtn: btnList2 })
        return data
      },
      dataList() {
        return this.$store.state.offline_curriculum.offline_term_list;
      },
    },
    methods: {
      ...mapActions([ 'delete_offline_curriculum', 'delete_offline_term', 'get_offline_curriculum_detail']),
      handleBack() {
        this.$router.replace({name: 'open-product'})
      },
      getLecturerList(){
        postData('/components/getTeachers', {organization_id: JSON.parse(localStorage.getItem('PRODUCTINFO')).organization_id}).then((res) => {
          if(res.res_code === 1)  this.formList[3].selectList = res.data
        })
      },
      closeModal2(){
        this.show = false
      },
      addOffLineCourses(row, type, index){
        this.term_row = row
        this.modalTitle = type ? '编辑课程' : '添加课程'
        this.tableRow = {}
        if(type){
          let d = row.childData[index];
          this.tableRow = this.$config.copy(d)
        }
        this.show = true
      },
      handleSubmit(v){
        let d1 = this.modalTitle === '添加课程' ? { term_underline_id: this.term_row.id} : {curriculum_underline_term_id: this.tableRow.id}
        let url = this.modalTitle === '添加课程' ? '/product/curriculum_offline/term_curriculum_add' : '/product/curriculum_offline/term_curriculum_change'
        v.end_time = this.$config.formatDate( v.end_time )
        v.start_time = this.$config.formatDate( v.start_time )
        postData(url,{...d1,...v}).then((res) => {
          if(res.res_code === 1){
            this.$Message.success(res.msg);
            this.rowExpandHandler(this.term_row)
            this.closeModal2()
          }
        })
      },
      handleClick() {},
      inputChange(val) {
      },
      closeModal(){
        this.showModal = false;
      },
      showCourseDetailHandler(index, row) {
        this.detailData = row;
        this.showModal = true;
      },
      //复制
      copyItem(index, row){
         this.$Modal.confirm({
            title: '提示',
            content: '确定你要复制该学期？',
            onOk: () => {
                postData('/product/curriculum_offline/term_copy',{...this.dataList[index], term_underline_id:row.id}).then((res) => {
                if(res.res_code === 1){
                  this.getList()
                  this.$Message.success(res.msg);
                }
              })
            },
            onCancel: () => {}
        });
      },
      sendOfflineCourseHandler(index, row) {
        this.handleSelModal(types.SEND_OFFLINE_COURSE, {row: row});
      },
      handleShowDialog() {
        this.handleSelModal(types.ADD_QUESTION);
      },
      editChapterHandler(index) {
        this.$router.push({ name: 'online-course-chapter', params: { id: '1' } })
      },
      editCourseHandler(param, index, row) {

      },
      editOfflineSemester(index, row) {
        this.handleSelModal(types.ADD_OFFLINE_SEMESTER, { type: 2, row,page_size: this.pageSize,
            page_num: this.page_num })
      },
      addOfflineSemesterHandler() {
        this.handleSelModal(types.ADD_OFFLINE_SEMESTER, { type: 1, page_size: this.pageSize,
            page_num: this.page_num,})
      },
      moveUpHandler(index) {
        this.dirty = true;
      },
      moveDownHandler(index) {
        this.dirty = true;
      },
      deleteCourseHandler(index, data) {},
      deleteOfflineSemester(index, row) {
        var vm = this;
        if (row.can_delete == 0) {
          this.$Modal.info({ title: '提示', content: '<p>无法删除该学期!</p >' });
        } else {
          this.$Modal.confirm({
            title: '提示',
            content: '<p>确定您要删除该学期?</p >',
            onOk: () => {
              vm.delete_offline_term({ index, row });
            },
          });
        }
      },
      addOfflineCourse(index, row) {
        // this.handleSelModal(types.ADD_OFFLINE_COURSE, { type: 1, row })
      },
      childBtnClickHandler(param, index, row) {
        var vm = this;
        if (param == 'deleteCourse') {
          this.$Modal.confirm({
            title: '提示',
            content: '<p>确定要删除该课程吗!</p >',
            onOk: () => {
              vm.delete_offline_curriculum({ index, row });
            },
          });
        } else {
         this.addOffLineCourses(row , 1 , index)
        }
      },
      setData(){
        return {
           subject_id: JSON.parse(localStorage.getItem('OffLineClassTheme')).id,
           page_size: this.pageSize,
           page_num: this.page_num,
        }
      },
      rowExpandHandler(row) {
        this.$store.dispatch('get_offline_curriculum_list', { page_size: this.pageSize,
           page_num: this.page_num,term_underline_id: row.id})
      },
      manageSignupHandler(index, row) {
        this.$router.replace({ name: 'offline-course-manage-signup', params: { id: row.id } })
      },
      pageList(val){
        this.page_num = val;
        this.getList()
      },
      getList(){
        this.$store.dispatch('get_offline_term_list', this.setData());
      }
    },
    mounted() {
     this.getList()
     this.getLecturerList()
     this.listHeight = window.innerHeight - 130
    }
  }
</script>
<style scoped lang='scss'>
    /deep/.ivu-btn-text{
        font-family: PingFangSC-Medium;
        font-size: 16px;
        color: #4098FF;
        letter-spacing: 0;
    }
    /deep/.prop_key_0>.ivu-table-cell>span{
      display: none
    }
</style>
