<template>
    <div>
        <Table @on-row-click="rowClick" :row-class-name="rowClassName" highlight-row :columns="columns" :data="datas" :height="tabelHeight" >
            <template slot-scope="{ column, row, index }" slot="operation">
              <span v-for="(t,i) in column.operation" :key="i">
              <!-- poptip_state -->
               <Poptip v-if="column.poptip_state&&handleBtnText(t,row,column) === '查看'" width="254" placement="bottom">
                    <Button type="text">查看</Button>
                    <div class="poptip-main" slot="content">
                      <img class="poptip-img" src="../assets/icons/mn.jpeg"/>
                      <div class="poptip-content"><h2>王晓东</h2><p>用户ID：ur9812</p></div>
                    </div>
               </Poptip>
               <span v-else-if="handleBtnShow(column,row,t)" :class="handleBtnShowClass(column,row,t)">
                 <Button  type="text"  size="small"
                      style="margin-right: 5px" @click="show(row,index,t[1])">
                   {{handleBtnText(t,row,column)}}
                 </Button>
               </span>
              </span>
              <Switch class="operation_btn_show" v-if="column.isSwitch" v-model="row[column.switchKey]" size="large" @on-change="change(row)">
                 <span slot="open">启用</span>
                 <span slot="close">停用</span>
               </Switch>
            </template>
            <template slot-scope="{ column, row, index }" slot="radio-item">
                <Radio @on-change="radioChange(row,column)" v-model="row[column.key]"></Radio>
            </template>
            <template slot-scope="{ column, row, index }" slot="state-item">
                <span v-if="column.stateOther"
                      :class="'state-key-other'+row[column.stateKey]">{{row[column.key]}}</span>
                <span v-else :class="'state-key'+row[column.stateKey]">{{row[column.key]}}</span>
            </template>
            <template slot-scope="{ column, row, index }" slot="sex">{{row.sex == 0 ? '女' : '男'}}</template>
            <template slot-scope="{ column, row, index }" slot="_index">{{row.state == 0 ? '未认证' : '已认证'}}</template>
        </Table>
    </div>
</template>
<script>
  import postData from 'src/api/postData'
  export default {
    data() {
      return {
        datas: [],
        columns: [],
        btnList: []
      }
    },
    props: {
      column: {
        type: Array,
        default: []
      },
      tableData: {
        type: Array,
        default: () => []
      },
      // isSerial -->  序号
      isSerial: {
        type: Boolean,
        default: false
      },
      // 选项
      isSelection: {
        type: Boolean,
        default: false
      },
      // 选项
      isSelectionRight: {
        type: Boolean,
        default: false
      },
      //筛选选项
      selectList: {
        type: Array,
      },
      seeUrl: {
        type: String,
        default: ''
      },
      tabelHeight: {
        type: Number
      }
    },
    watch: {
      tableData(_new) {
        this.tableData = _new;
        this.handleTableData(this.tableData)
      }
    },
    methods: {
      rowClassName(r){
       if(r.hasOwnProperty('states'))  return r.states ? '' : 'row-switch-disable'
       return ''
      },
      rowClick(row,rowIndex){
        this.show(row,rowIndex,'row-click')
      },
      handleBtnShowClass(c,r,t){
         if (!c.hasOwnProperty('operation_btn_hide')){
           if(c.operation[0][0] == t[0]) return 'operation_btn_see'
           if(!r.operation_btn_show) return 'operation_btn_show'
           return ''
         }
         return ''
      },
      handleBtnShow(c,r,t){
        if (c.hasOwnProperty('operation_btn_hide')){
          return c.operation_btn_hide&&t[2] ? r.mark_state : true
        }else return true
      },
      radioChange(r, c) {
        this.datas.map((t, k) => {
          t.state = false
          if (t.id === r.id) {
            t.state = true;
            this.$emit('radioChange', t)
          }
        })
      },
      handleTableData(d) {
        let d3 = [];
        if(d.length>0){
          let d1 = JSON.stringify(d)
          let d2 = d1.replace(/null/g, '"-"').replace(/""/g, '"-"');
          d3 = JSON.parse(d2)
          d3.map((t, k) => {
            if (this.isSerial) t.serial_number = this.$config.addZero(k+1)
            if (t.hasOwnProperty('slot')) {
              if (t.operation.length > 0) this.btnList = t.operation
            }
            t.operation_btn_show = false
          })
        }
        this.datas = d3
      },
      show(row, rowIndex, params) {
        if(this.seeUrl){
           postData(this.seeUrl, {id: row.organization_id}).then((res) => {
            if(res.data){
              row = {...row, ...res.data[0]}
              row.head_img_url = res.data[0].admin[0].head_img_url
              if (this.selectList) row.list = this.getArray(this.selectList, res.data[0].admin[0])
              this.$emit(params, row, rowIndex)
            }
          })
        }else{
          if (this.selectList) row.list = this.getArray(this.selectList, row)
          this.$emit(params, row, rowIndex)
        }
      },
      handleColumns(c) {
        if (this.isSerial) c.unshift({title: '序号', key: 'serial_number', minWidth: 80})
        if (this.isSelection) c.unshift({type: 'selection', width: 60, align: 'center'})
        if (this.isSelectionRight) c.push({type: 'selection', width: 60, align: 'center'})
        c.map((t) => {
          if(t.hasOwnProperty('slot')&&t.slot == "operation" && !t.hasOwnProperty('align'))  t.align = 'left'
          if (!t.hasOwnProperty('align')) t.align = 'center'
          t.tooltip = true
        })
        this.columns = c
      },
      change(row) {
        this.$emit('table-swtich', row)
      },
      handleBtnText(t, r, c) {
        // operation_state -- 处理 兑换码
        if (Array.isArray(t[0])) {
          if (c.operation_state ) return r.state == 1 ? t[0][0] : t[0][1]
          return c.operation_state && r.use_state ? t[0][0] : c.operation_state && r.use_state === 0 ? t[0][1] : t[0]
        } else return t[0]
      },
      getArray(name, string) {
        string.role_name = this.$config.status(string.role_id)
        let arr = [], str
        name.forEach((item, index) => {
          for (var x in string) {
            if (x == item.title) {
              if (item.title == 'role_id' && x == 'role_id' && string[x] == 1) {
                arr.push(`${item.name}: ${string.realname}`)
              } else {
                str = item.name + ':' + ' ' + (string[x]||string[x]==0 ? string[x] : '—')
                arr.push(str)
              }
            }
          }
        })
        return arr
      }
    },
    mounted() {
      this.handleColumns(this.column)
      this.handleTableData(this.tableData)
    }
  }
</script>
<style lang='less' scoped>
    .state-key1, .state-key-other1 {
        color: #2EBF07;
    }
    /deep/ .ivu-table-row{
      color: #474C63;
    }
    .state-key-other0 {
        color: #474C63;
    }

    .state-key0 {
        color: #F54802;
    }

    /deep/ .ivu-table th {
        height: 50px;
    }

    /deep/ .ivu-btn {
        color: #4098FF;
    }

    /deep/ .ivu-btn-text:focus {
        box-shadow: none
    }

    /deep/ .ivu-radio-inner {
        /*border-radius: unset;*/
        width: 22px;
        height: 22px;
        border-radius: 4px;
        border: 1px solid #9397AD;
    }

    /deep/ .ivu-radio-wrapper {
        font-size: 16px;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-right: 0;
    }

    /deep/ .ivu-radio .ivu-radio-inner {
        background-position: 1.5px 1.5px;
    }

    /deep/ .ivu-radio-checked .ivu-radio-inner {
        background-image: url('../assets/icons/icon/tick.png');
        background-repeat: no-repeat;
        background-size: 16px 16px;
        background-position: 1.5px 1.5px;
        border-color: #5298f7;
    }

    /deep/ .ivu-radio-inner::after {
        display: none;
    }

    /deep/ .ivu-tooltip-rel {
        width: 100%;
    }
    /deep/ .row-switch-disable{
      color: #9397AD;
    }
    .poptip-main {
        display: flex;
        margin-top: 20px;
        margin-bottom: 10px;
        align-items: center;

        .poptip-img {
            width: 80px;
            height: 80px;
            margin-right: 20px;
            border-radius: 40px;
        }

        .poptip-content {
            display: flex;
            flex-direction: column;
            justify-content: flex-start;

            h2 {
                font-family: PingFangSC-Medium;
                font-size: 20px;
                color: #474C63;
                text-align: left;
                margin-bottom: 10px;
            }

            p {
                font-family: PingFangSC-Regular;
                font-size: 16px;
                color: #474C63;
            }
        }
    }
    /deep/ .ivu-table td.demo-table-info-column{
        color: #F54802;
    }
    /deep/ .ivu-btn{
      display: flex;
    }
    .operation_btn_show{
       display: none
    }
    /deep/.operation_btn_see .ivu-btn-text{
      margin-left: -5px;
    }
    /deep/ .ivu-table-row:hover{
     .operation_btn_show{
      display: inline-block;
     }
    }
</style>
