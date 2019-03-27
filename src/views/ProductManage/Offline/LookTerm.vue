<template>
  <Modal v-model="show" :title="detailData.name" :width="800" @on-cancel="closeModal"  :mask-closable=false :footer-hide="true" >
    <Tables :is-serial=true @operation1="edit" @operation2="deletes"  :column="columns1" :table-data="list" />
  </Modal>
</template>

<script>
import Tables from '../../../components/tables'
import { Dialog } from '../../dialogs';
import * as types from '../../dialogs/types';
import { mapState, mapActions } from 'vuex'
export default {
    mixins: [Dialog],
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
    ...mapState({
        offline_curriculum_detail1: state => state.offline_curriculum.offline_curriculum_detail
    }),
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
                operation: [['编辑','operation1'], ['删除','operation2']],
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
            this.show = _new;
            if(_new) {
                // this.$store.dispatch('get_offline_curriculum_list', { offline_term_id: this.detailData.id })
            }
        }
    },
    methods: {
        ...mapActions([ 'delete_offline_curriculum']),
        closeModal(){
            this.show = false;
            this.$emit("close")
        },
        edit(row,rowIndex){
          // this.handleSelModal(types.ADD_OFFLINE_COURSE, { type: 2, row })
            //   this.get_offline_curriculum_detail({ index, row,
            //     callback() {
            //       vm.handleSelModal(types.ADD_OFFLINE_COURSE, { type: 2, row, index, data: vm.offline_curriculum_detail1 });
            //     }
            //   });
        },
        deletes(row,index){
            this.$Modal.confirm({
            title: '提示',
            content: '<p>确定要删除该课程吗!</p>',
            onOk: () => {
            //   this.delete_offline_curriculum({ index, row });
            },
          });
        }
    }
}
</script>
<style lang="less" scoped>
</style>
