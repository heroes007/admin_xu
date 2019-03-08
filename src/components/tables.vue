<template>
<div>
    <Table :columns="columns" :data="datas" >
       <template slot-scope="{ column, row, index }" slot="operation">
            <Switch v-if="column.isSwitch" v-model="row[column.switchKey]" size="large" @on-change="change(row)" >
                <span slot="open">启用</span>
                <span slot="close">禁用</span>
            </Switch>
            <Button type="text" v-for="(t,i) in column.operation" :key="i" size="small" style="margin-right: 5px" @click="show(row,index,i)">{{t}}</Button>
        </template>
    </Table>
</div>
</template>

<script>
  export default {
    data(){
      return{
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
            default: []
       },
       // isSerial --> true -- 序号  false -- 选项
       isSerial: {
          type: Boolean,
          default: false
       },
       isSelection: {
          type: Boolean,
          default: false
       }
    },
    methods:{
      handleTableData(d){
        d.map((t,k) => {
         if(this.isSerial) t.serial_number = this.$config.addZero(k)
         if(t.hasOwnProperty('slot')){
           if(t.operation.length>0) this.btnList = t.operation
         }
        })
        this.datas = d
      },
      show(row,rowIndex,index) {
        switch(index){
        case 0:
        this.$emit('operation1',row,rowIndex)
        break;
        case 1:
        this.$emit('operation2',row,rowIndex)
        break;
        case 2:
        this.$emit('operation3',row,rowIndex)
        break;
        }
      },
      handleColumns(c){
        if(this.isSerial) c.unshift({ title: '序号', key: 'serial_number' })
        if(this.isSelection) c.unshift( { type: 'selection', width: 60, align: 'center' })
        c.map((t) => {
          if(!t.hasOwnProperty('align')) t.align = 'center'
          t.tooltip = true
        })
        this.columns = c
      },
      change(row){
        this.$emit('table-swtich', row)
      }
    },
    mounted() {
      this.handleTableData(this.tableData)
      this.handleColumns(this.column)
    } 
  }
</script>
<style scoped>
    /deep/ .ivu-table th {
        height: 50px;
    }
    /deep/ .ivu-btn{ color: #4098FF; }
    /deep/ .ivu-btn-text:focus{ box-shadow: none }
</style>
