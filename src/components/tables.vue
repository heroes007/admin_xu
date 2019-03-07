<template>
<div>
    <Table border :columns="columns" :data="datas">
       <template slot-scope="{ column, row, index }" slot="operation">
            <Button v-for="(t,i) in column.operation" :key="i" type="primary" size="small" style="margin-right: 5px" @click="show(row,index,i)">{{t}}</Button>
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
        this.columns = c
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
</style>
