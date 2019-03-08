<template>
   <div>
        <see :detail-data="tableRowData" title="查看信息" :show-modal='detailShow' @close="close" />
        <screen :types="5" size-title1="导师总数" :size-num1="23" btn-name="添加导师" :select1="selectList" 
                size-title2="付费学员" :size-num2="14"   @selectChange1="selectChange1"  @inputChange="inputChange" @handleClick="handleClick"/>
        <Tables :is-serial=true @operation1="see" @operation2="edit" @operation3="deletes" @table-swtich="swtichChange" :column="columns1" :table-data="list" />
   </div>
</template>

<script>
  import Tables from '../../../components/tables.vue'
  import screen from '../../../components/ScreenFrame'
  import see from '../../../components/SeeInfo.vue'
  import details from './const'
  import seeMixin from '../seeMixin'
  export default {
    name: "ManagementList",
    components: { Tables, screen, see },
    mixins: [seeMixin],
    data (){
        return{
            tableRowData: {},
            selectList:[
            {
                value:'all',
                label:'全部机构'
            },
            {
                value:'zj',
                label:'浙江医院'
            },
            {
                value:'bj',
                label:'北京医院'
            }],
            columns1: [
            {
                title: '用户名',
                key: 'nickname',
                align: 'left',
            },{
                title: '真实姓名',
                key: 'realname',
            },{
                title: '性别',
                key: 'sex',
            },
            {
                title: '学科',
                key: 'admin',
                align: 'left',
            },
                {
                title: '年级',
                key: 'phone',
                align: 'left',
            },
            {
                title: '所属机构',
                key: 'company',
                align: 'left'
            },
                {
                title: '最近登录时间',
                key: 'create_time',
                align: 'left',
            },
            {
                title: '操作',
                width: 260,
                slot: 'operation',
                operation: ['查看'],
                isSwitch: true, // true --> 启用 false --> 禁用
                switchKey: 'switch_state'
            }],
            list: [
                {
                    "user_id": 13186,
                    "nickname": "150****1134",
                    sex: "男",
                    "realname": "王晓东",
                    "phone": "15022211134",
                    "from_domain": '正常',
                    "create_time": "2019/01/12 21:34",
                    "action": "action",
                    admin: '超级管理员',
                    company: "北京大学人民医院",
                    switch_state: true
                }
            ]
        }
    },
    methods: {
        see(row,rowIndex){
            this.detailShow = true;
            this.tableRowData = details;
            console.log(row,rowIndex,'see',this.detailShow);
        },
        edit(row,rowIndex){
            console.log(row,rowIndex);
        },
        deletes(row,rowIndex){
            console.log(row,rowIndex);
        },
        swtichChange(row){
             console.log(row);
        },
        selectChange1(val){
            console.log(val)
        },
        selectChange2(val){
            console.log(val)
        },
        inputChange(val){
            console.log(val)
        },
        handleClick(){
            this.modalTitle = '添加学员'
            this.show = true
            this.tableRow = {}
            console.log('open modal')
        }
    },
    mounted() {}
  }
</script>

<style scoped>
</style>