<template>
   <div>
        <screen :types="9"  @handleBack="handleBack" :title="screenTitle"/>
        <screen :types="11" size-title1="提交作业人数" :size-num1="total" btn-name="上传批阅" :select2="selectList" :select-type2="true"
                    @selectChange2="selectChange1"  @inputChange="inputChange" @handleClick="handleClick"/>
        <Tables :is-serial=true @operation1="see" @operation2="edit" @operation3="deletes"  :column="columns1" :table-data="list" :tabel-height="tabelHeight"/>
       <page-list :current="current" :total="total" :page-size="pageSize" @page-list="pageList"/>
   </div>
</template>

<script>
  import Tables from '../../../components/tables.vue';
  import screen from '../../../components/ScreenFrame';
  import * as types from '../../dialogs/types';
  import { Dialog } from '../../dialogs/index';
  import {get_read_over} from '../../../api/modules/tools_task';
  import postData from '../../../api/postData'
  import pageMixin from '../../mixins/pageMixins'
  import pageList from '../../../components/Page'
  import {mapState} from 'vuex'

  export default {
    mixins: [Dialog, pageMixin],
    name: "MarkingHomework",
    components: { Tables, screen, pageList },
    data (){
        return{
            selectList: [
              {title: '全部', id: ''},
              {title: '未批阅', id:'0'},
              {title: '已批阅', id:'1'},
            ],
            mark_state: '',
            screenTitle: '',
            search: '',
            count: null,
            columns1: [
            {
                title: '用户名',
                key: 'username',
                align: 'left',
            },{
                title: '真实姓名',
                key: 'realname',
            },{
                title: '科室',
                key: 'department_name',
            },
            {
                title: '年级',
                key: 'grade_name',
                align: 'left',
            },
            {
                title: '状态',
                key: 'isState',
                // slot: 'state-item',
                // stateKey: 'state'
            },
                {
                title: '提交作业时间',
                key: 'create_time',
                align: 'left',
            },
            {
                title: '操作',
                width: 260,
                slot: 'operation',
                operation_btn_hide: true,
                operation: [['查看','operation1',true], ['批阅','operation2']],
            }],
            list: [],
            listStyle: {}
        }
    },
    computed:{
      ...mapState(['taskState']),
      tabelHeight() {
        return window.innerHeight - 60 - 50 - 70;
      }
    },
    watch: {
      taskState() {
        this.initData()
      }
    },
    methods: {
        selectChange1(val){
          this.mark_state = val;
          this.initData()
        },
        see(row,rowIndex){
            // console.log(row,rowIndex,'see');
           this.handleSelModal(types.READ_OVER, { type: 2, row })
        },
        edit(row,rowIndex){
            // console.log(row,rowIndex);
            this.handleSelModal(types.READ_OVER, { type: 1, row })
        },
        deletes(row,rowIndex){
            console.log(row,rowIndex);
        },
        inputChange(val){
            this.search = val
            this.initData()
        },
        handleClick(){
            console.log('open modal')
        },
        handleBack(){
            this.$router.replace({path:'/product/open-product'})
            // this.$router.replace({name: 'open-product'});
        },
        handleList(){
            // this.list.map((it) => {
            //     it.state1 = it.state ? '已批阅' : '未批阅'
            // })
        },
      initData(){
            postData('product/homework/student_homework_get_list',{
                homework_id: parseInt(this.$route.params.id),
                search: this.search,
                page_size: this.pageSize,
                page_num: this.current,
                mark_state: this.mark_state
            }).then(res =>  {
              res.data.data.forEach(item => {
                item.isState = item.mark_state == 1 ? '已批阅' : '未批阅'
              })
              res.data.data.forEach(item => {
                if(item.mark_state == 0) item.cellClassName =  {isState: 'demo-table-info-column'}
              })
                this.list = res.data.data
                this.total = res.data.count
            })
        }
    },
    mounted() {
        this.handleList()
        if(localStorage.getItem('MarkingHomework')){
            this.screenTitle = JSON.parse(localStorage.getItem('MarkingHomework')).title
        }
        // get_read_over().then(res=>{
        //     console.log(res);
        //     this.list = res.data.data.data
        // })
        // console.log(this.$route.params.id,'$route')
       this.initData()
    }
  }
</script>

<style scoped>
    /deep/ .all-size{
        height: 100%;
        display: flex;
        align-items: center;
    }
</style>
