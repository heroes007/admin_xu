<template>
   <div class="user-manage-main">
        <screen  select-type1 selectType2 :types="14" :select2="select2" placehodle="搜索产品名称/支付账号" @selectChange1="selectChange1" @selectChange2="selectChange2"  @inputChange="inputChange" />
        <Tables :tabel-height="tableHeight" :is-serial=true :column="columns1" :table-data="list"/>
        <page-list :current="current" :total="total" :page-size="pageSize" @page-list="pageList"/>
   </div>
</template>
<script>
  import Tables from '../../../components/tables.vue'
  import screen from '../../../components/ScreenFrame'
  import UserMixins from '../../UserManage/Mixins/UserMixins'
  import postData from 'src/api/postData'
  import pageList from '../../../components/Page'
  import pageMixin from '../../mixins/pageMixins'
  export default {
    name: "ManagementList",
    components: { Tables, screen, pageList },
    mixins: [UserMixins, pageMixin],
    data (){
        return{
            keyword: '',
            organization_id:'',
            tableHeight: 0,
            list: [],
            pay_state: 'all',
            select2: [
              {id: 'all', title: '全部订单'},
              {id: 1, title: '已支付'},
              {id: 0, title: '未支付'},
            ],
        }
    },
    computed: {
         columns1(){
            return [
            {
                title: '产品名称',
                key: 'title',
                align: 'left',
                minWidth: 200
            },
            {
                title: '产品价格',
                key: 'price',
                minWidth: 100
            },
            {
                title: '支付价格',
                key: 'pay_amount',
                minWidth: 100
            },
            {
                key: 'state',
                title: '订单状态',
                minWidth: 100,
                render: (h, params) => {
                    let d = params.row.state == -1 ? '支付失败' : params.row.state == 1 ? '已支付' :'未支付'
                    return h('span', {style: {color: params.row.state == -1 ? '#F54802' : params.row.state == 1 ? '#2EBF07' :'#474c63'}}, d)
                }
            },
            {
                key: '',
                title: '支付方式',
                minWidth: 100,
                render: (h, params) => {
                  let d = params.row.method == 6 ? '支付宝' : params.row.method == 5 ? '微信' :''
                    return h('span', d)
                }
            },
            {
                title: '支付账号',
                key: 'username',
                align: 'left',
                minWidth: 100
            },
            {
              title: '支付时间',
              key: 'update_time',
              align: 'left',
              minWidth: 150
            }]
         }
    },
    beforeDestroy() {
      this.getList = null;
    },
    methods: {
        selectChange1(val){
          this.organization_id = val
          this.getList()
        },
        selectChange2(val){
          this.pay_state = val
          this.getList()
        },
        inputChange(val){
          this.keyword = val
          this.getList()
        },
        getList(){
            let d = {
              keyword: this.keyword,
              page_size: this.pageSize,
              page_num: this.current,
              organization_id: this.$config.setSelVal(this.organization_id),
              pay_state: this.$config.setSelVal(this.pay_state)
            }
            postData('order/getOrderListAdmin', d).then((res) => {
                 if(res.res_code == 1){
                    this.list = res.data.list
                    this.total = res.data.count
                 }
            })
        },
    },
    mounted() {
        this.tableHeight = window.innerHeight - 116
        this.getList()
    }
  }
</script>
<style lang="less" scoped>
    /deep/.screen{
      background: #fff;
    }
</style>

