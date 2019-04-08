<template>
   <div>
       <SendCode title="发送兑换码" :show-modal="codeShow" :list="codeList" @close="codeClose" @selectChecked="codeChecked" />
       <screen :types="8" size-title1="兑换码总数" :code-name="codeName" placehodle="搜索兑换码" :size-num1="23"  :select1="selectList"
          size-title2="已使用"  :size-num2="17" @handleBack="handleBack"  @selectChange1="selectChange1"  @inputChange="inputChange" />
        <Tables :is-serial=true @operation1="see" @operation2="immediateFailure" :column="columns1" :table-data="list" />
   </div>
</template>
<script>
  import Tables from '../../../../components/tables.vue'
  import screen from '../../../../components/ScreenFrame'
  import SendCode from './SendCode'
  export default {
    name: "UsageRecord",
    components: { Tables, screen, SendCode },
    data (){
        return{
            codeName: '',
            codeShow: false,
            codeList: [],
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
                title: '兑换码',
                key: 'realname',
                align: 'left'
            },
            {
                title: '是否使用',
                key: 'state_text',
                slot: 'state-item',
                stateKey: 'state',
                stateOther: true
            },
            {
                title: '发送时间',
                key: 'create_time',
                align: 'left',
            },
            {
                title: '状态',
                key: 'state1',
            },
            {
                title: '操作',
                width: 320,
                slot: 'operation',
                operation_state: true,
                poptip_state: true,
                operation: [[['查看','发送'],'operation1'], [['立即失效','立即生效'],'operation2']],
            }],
            list: [
                {
                    "id": 13186,
                    jurisdiction: "培训",
                    "realname": "ANKXZPDD7Q",
                    "product": "浙江全科医生培训",
                    "num": 1000,
                    "create_time": "2019/01/12",
                    "state": 1,
                    use_state: 1, //1--已使用 0--未使用
                    isswitch: false,
                },
                 {
                    "id": 13187,
                    jurisdiction: "培训",
                    "realname": "ANKXZPDD7QA",
                    "product": "浙江全科医生培训",
                    "num": 1001,
                    "create_time": "2019/01/13",
                    "state": 0, // 1 -- 生效中 0 -- 已失效
                    use_state: 0, //1--已使用 0--未使用
                    isswitch: false,
                }
            ],
        }
    },
    methods: {
        codeClose(){
            this.codeShow = false;
        },
        codeChecked(val){
            console.log(val);
        },
        see(row,rowIndex){
            if(!row.use_state){
                this.codeShow = true
            }
        },
        immediateFailure(row,rowIndex){
            console.log(row,rowIndex,'immediateFailure');
        },
        selectChange1(val){
            console.log(val)
        },
        inputChange(val){
            console.log(val)
        },
        handleClick(){
            this.modalTitle = '添加学员'
            this.show = true
            this.tableRow = {}
        },
        handleBack(){
             this.$router.replace({path: `/dashboard/exchange-code`})
        },
        handleList(){
            this.list.map((it) => {
                it.state_text = it.use_state ? '已使用' : '未使用'
                it.state1 = it.state ? '生效中' : '已失效'
            })
        }
    },
    mounted() {
        this.handleList()
        if(localStorage.getItem('useRecords')){
            this.codeName = JSON.parse(localStorage.getItem('useRecords')).realname
        }
    }
  }
</script>

<style scoped>
</style>
