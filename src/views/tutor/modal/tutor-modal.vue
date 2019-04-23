<template>
    <Modal v-model="isShow" :title="title" :styles="{top: '60px'}" :width="700" :mask-closable="false" :footer-hide="true" @on-cancel="closeModal">
       <div v-for="(t,i) in details" :key="i">
            <p class="grey-regular1">作业名称</p>
            <p class="job-details grey-regular2">养护一体化家庭医生签约服务数量指标。2018年签约服务数是指截止到年度考核</p>
            <down-loading text="附件" v-if="t.downList.length>0" :formData="t.downList"/>
       </div>
    </Modal>
</template>

<script>
import DownLoading from '../../../components/DownLoading'
export default {
    components: { DownLoading },
    props: {
        show: {
            type: Boolean,
            required: false
        },
        title: {
            type: String,
        },
        details: [Array||Object]
    },
    data() {
        return {
            isShow: false,
        }
    },
    watch: {
        show(val) {
            this.isShow = val;
            if(val){
                if(Array.isArray(this.details)){
                    this.details.map(t => {
                        let d = JSON.parse(t.attachment_url)
                        t.downList = [{name: d[0].attachment_name, url: d[0].attachment_url}]
                    });
                }
            }
            console.log(this.details,'this.details',this.downList)
        }
    },
    methods: {
        closeModal(val) {
            this.$emit('close-modal', val)
        }
    }
}
</script>

<style lang="less" scoped>
/deep/ .ivu-modal-body{
    padding: 19.8px 40px 40px 40px;
}
.job-details{
    margin-top: 10px;
    letter-spacing: 1.14px;
    line-height: 26px;
}
</style>
