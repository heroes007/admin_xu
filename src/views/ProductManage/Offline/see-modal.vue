<template>
   <Modal v-model="showModal" title="查看详情" :width="960" @on-cancel="closeModal" :mask-closable=false
    :footer-hide="true">
    <div>
        <span class="title">{{details.title}}</span>
        <span class="title2">预约人数：{{details.student_num}}</span>
    </div>
    <div>
        <span class="title2">开课日期：{{details.start_time}}至{{details.end_time}}</span>
        <span class="title2">报名截止日期：{{details.register_end_time}}</span>
    </div>

   </Modal>
</template>

<script>
  export default {
    props: {
        show:{
            type: Boolean,
            default: false
        },
        details: {
            type: Object,
            default: {}
        }
    },
    data(){
        return{
            showModal: false,
        }
    },
    watch: {
        show(_new){
            this.showModal = _new
        }
    },
    methods:{
        closeModal(){
          this.showModal = false
          this.$emit('close-modal')
        }
    }
  }
</script>
<style lang="less" scoped>
.title{
    font-family: PingFangSC-Medium;
    font-size: 18px;
    color: #474C63;
}
.title2{
    font-family: PingFangSC-Regular;
    font-size: 16px;
    color: #474C63;
}
</style>
