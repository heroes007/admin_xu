<template>
    <div class='manage-production-view'>
        <screen :types="10" selectType1 btnType title="行业资讯" btnName="创建文章" @handleClick="addNewsHandler" style="background:#ffffff"/>
        <FormModal :detail-data="tableRow"  :show-modal='show' :form-list="formList" @close="closeModal" :title="modalTitle"
                   :upload-btn="false" :rule-validate="rules" @from-submit="fromSubmit"></FormModal>
        <!-- <data-list class='data-list light-header' @edit='editHandler' @delete='deleteHandler' :table-data='dataList'
                   :header-data='dataHeader' :column-formatter='listColumnFormatter'
                   :column-formatter-data='listColumnFormatterData'></data-list> -->
        <Tables :is-serial=true @operation1="lowerShelf" @operation2="edit" @operation3="deletes" :column="columns1" :table-data="list" :tabel-height="tabelHeight"/>
        <page-list :current="current" :total="total" :page-size="pageSize" @page-list="pageList"/>
    </div>
</template>


<script>
  import Tables from '../../components/tables.vue'
  import screen from '../../components/ScreenFrame'
  import FormModal from '../../components/FormModal'
  import FormModalMixin from '../UserManage/Mixins/FormModalMixin'
  import pageList from '../../components/Page'
  import pageMixin from '../mixins/pageMixins.js'
  import postData from 'src/api/postData'
  export default {
    mixins: [FormModalMixin, pageMixin],
    components: { screen, FormModal, pageList, Tables },
    data() {
      return {
        tableRow: {},
        columns1: [
          {
            key: 'title',
            title: '新闻标题'
          },
          {
            key: 'click_count',
            title: '浏览量',
            width: 100
          },
          {
            key: 'state',
            title: '状态',
          },
          {
            key: 'create_time',
            title: '发布时间',
            width: 160
          },
          {
            key: 'create_time',
            title: '发布人',
          },
          {
            title: '操作',
            width: 260,
            slot: 'operation',
            operation: [['下架','operation1'],['编辑','operation2'],['删除','operation3']]
          }],
        list: [],
        show: false,
        formList: [
          { type: 'input', name: '文章标题',  field: 'textname'},
          { type: 'textarea', name:'文章摘要',field:  'textdesc'},
          { type: 'upload', name: '文章正文', field: 'uploading' }
        ],
        modalTitle: '创建文章',
        rules:{
          textname: [{ required: true, message: '请输入文章标题', trigger: 'blur' } ],
          textdesc: [{ required: true, message: '请输入文章摘要'}],
          // uploading: [{ required: true, message: '请输入文章正文'} ],
        },
        tabelHeight: null
      }
    },

    methods: {
      addNewsHandler() {
        // this.handleSelModal(ADD_NEWS);
        this.show = true
      },
      lowerShelf(row,rowIndex){
        console.log(row,'lowerShelf');
      },
      edit(row,rowIndex){

      },
      deletes(row,rowIndex){
        // this.$Modal.confirm({
        //   title: '提示',
        //   content: '<p>是否确认删除该产品？</p >',
        //   onOk: () => {
        //   },
        // });
      },
      getList() {
        let d = {
          page_size: this.pageSize,
          page_num: this.current
        }
        postData('/platform/news/getNewsListAdmin',d).then((res) => {
          this.list = res.data.list
          this.total = res.data.count
        })
      },
      closeModal(val){
        console.log(val,'00');
      },
      fromSubmit(val){
        console.log(val)
      }
    },
    mounted() {
      this.getList()
      this.tabelHeight = window.innerHeight - 130
    }
  }

</script>
<style lang="scss" scoped>

</style>
