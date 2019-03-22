<template>
    <div class='manage-production-view'>
        <screen :types="10" selectType2 :select2="selectList2" btnType @selectChange2="selectChange2" title="行业资讯" btnName="创建文章" @handleClick="addNewsHandler" style="background:#ffffff"/>
        <FormModal @from-submit="fromSubmit" :detail-data="tableRow"  :show-modal='show' :form-list="formList" @close="closeModal" :title="modalTitle" :upload-btn="false" :rule-validate="rules" ></FormModal>
         <Tables :tabel-height="tabelHeight" :is-serial=true @operation1="lowerShelf" @operation2="edit" @operation3="deletes"   :column="columns1" :table-data="list" />
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
        selectList2: [{id: '',title:'全部'},{id: '1',title:'上线'},{id: '-1',title:'下架'},{id: '0',title:'测试'}],
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
          key: 'state_name',
          title: '状态',
        },
        {
          key: 'create_time',
          title: '发布时间',
          width: 160
        },
         {
          key: 'realname',
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
        state: null,
        formList: [
            { type: 'input', name: '文章标题',  field: 'textname'},
            { type: 'textarea', name:'文章摘要', field:  'textdesc'},
            { type: 'upload', name: '文章正文', field: 'uploading' }
        ],
        modalTitle: '创建文章',
        tabelHeight: null,
        rules:{
            textname: [{ required: true, message: '请输入文章标题', trigger: 'blur' } ],
            textdesc: [{ required: true, message: '请输入文章摘要'}],
            uploading: [],
        },
      }
    },

    methods: {
      addNewsHandler() {
        this.show = true
      },
      fromSubmit(v){
        console.log(v,'v');
      },
      lowerShelf(row,rowIndex){
        postData('/platform/news/modifyNews',{id: row.id, state: -1 }).then((res) => {
           if(res) this.getList()
        })
      },
      edit(row,rowIndex){
        
      },
      selectChange2(val){
          this.state = val
          this.getList()
      },
      deletes(row,rowIndex){
         this.$Modal.confirm({
          title: '提示',
          content: '<p>是否确认删除该产品？</p>',
          onOk: () => {
            postData('/platform/news/removeNews',{id:row.id}).then((res)=> {
              if(res) this.getList()
            })
          },
        });
      },
      getList() {
        let d1 = (this.state != null && this.state != '') ? +this.state : null
        let d = {
            page_size: this.pageSize,
            page_num: this.current,
            state: d1
        }
        postData('/platform/news/getNewsListAdmin',d).then((res) => {
              this.list = res.data.list
              this.list.map((t) => {
                t.state_name = t.state == 1 ? '上线' : t.state == -1 ? '下架' : '测试'
              })
              this.total = res.data.count
        })
      }
    },
    mounted() {
      this.getList()
      this.tabelHeight = window.innerHeight - 130
    }
  }
</script>
<style lang="scss" scoped>
   .manage-production-view{
     position: relative;
     height: 100%;
   }
   .ivu-page{
     position: absolute;
     left: 0;
     right: 0;
     bottom: 0;
     margin: 0 auto;
   }
</style>
