<template>
  <Modal v-model="show" :title="detailData.name" :width="800" @on-cancel="closeModal"  :mask-closable=false :footer-hide="true" >
    <Tables :is-serial=true @operation1="see" @operation2="edit"  :column="columns1" :table-data="list" />
  </Modal>
</template>

<script>
import Tables from  '../../components/tables'
export default {
    components: { Tables },
    props:{
        showModal: {
            type: Boolean,
            default: false
        },
        detailData: {
          type: Object,
          default: () => {}
        }
    },
    data (){
        return{
            show: false,
            columns1: [
            {
                title: '课程名称',
                key: 'name',
                align: 'left'
            },{
                title: '类型',
                key: 'num',
            },{
                title: '讲师',
                key: 'user_name',
            },
            {
                title: '开课时间',
                key: 'start_time',
            },
             {
                title: '结课时间',
                key: 'end_time',
            },
            {
                title: '操作',
                width: 150,
                slot: 'operation',
                operation: ['查看', '编辑']
            }],
            list: [
                {
                    name: '天下',
                    num: 14,
                    "user_name": "王思思",
                    "start_time": "2019/03/08",
                    "end_time": '"2019/03/08",',
                }
            ],
        }
    },
    watch:{
        showModal(_new){
            this.show = _new
        }
    },
    methods: {
        closeModal(){
            this.show = false;
            this.$emit("close")
        },
        see(row,rowIndex){
            console.log(row,rowIndex);
        },
        edit(row,rowIndex){
            console.log(row,rowIndex);
        //   this.get_offline_curriculum_detail({ index, row,
        //     callback() {
        //       vm.handleSelModal(types.ADD_OFFLINE_COURSE, { type: 2, row, index, data: vm.offline_curriculum_detail1 });
        //     }
        //   });
        }
    }
}
</script>
<style lang="less" scoped>
</style>