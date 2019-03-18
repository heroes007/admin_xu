<template>
   <div>
        <screen :types="9"  @handleBack="handleBack" :title="screenTitle"/>
        <screen :types="1" size-title1="提交作业人数" :size-num1=total btn-name="上传批阅" :select1="selectList"
                    @selectChange1="selectChange1"  @inputChange="inputChange" @handleClick="handleClick"/>
        <Tables :is-serial=true @operation1="see" @operation2="edit" @operation3="deletes"  :column="columns1" :table-data="list" />
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

  export default {
    mixins: [Dialog, pageMixin],
    name: "MarkingHomework",
    components: { Tables, screen, pageList },
    data (){
        return{
            selectList: [],
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
            list: [
                // {
                //     "user_id": 13186,
                //     "nickname": "150****1134",
                //     "sex": "呼吸内科",
                //     "realname": "王晓东",
                //     "phone": "住培一年级",
                //     "from_domain": '正常',
                //     "create_time": "2019/01/12 21:34",
                //     "state1": 0
                // },
                //  {
                //     "user_id": 13186,
                //     "nickname": "150****1134",
                //     "sex": "呼吸内科",
                //     "realname": "王晓东",
                //     "phone": "住培一年级",
                //     "from_domain": '正常',
                //     "create_time": "2019/01/12 21:34",
                //     "state1": 1 //1--已批阅 0 -- 未批阅
                // }
            ]
        }
    },
    methods: {
        selectChange1(val){
        console.log(val)
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
            this.getList()
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
                page_num: this.current
            }).then(res =>  {
              res.data.data.forEach(item => {
                item.isState = item.mark_state == 1 ? '已批阅' : '未批阅'
                item.stateText = item.mark_state == 1 ? true : false;
                // this.columns1[7].operation[0][2] = item.mark_state == 0 ? false : true
              })
                this.list = res.data.data
                this.total = res.data.total
            })
        }
    },
    mounted() {
        this.handleList()
        if(localStorage.getItem('MarkingHomework')){
            this.screenTitle = JSON.parse(localStorage.getItem('MarkingHomework')).name
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
</style>
