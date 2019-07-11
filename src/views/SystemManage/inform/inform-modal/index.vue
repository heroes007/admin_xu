<template>
    <Modal v-model="show" :mask-closable="false" :footer-hide="true" @on-cancel="handleClose" :title="title" width="640">
        <div class="title">{{message.title}}</div>
        <div class="send-time">{{message.send_time}}</div>
        <div class="content" v-html="message.content"></div>
    </Modal>
</template>

<script>
    export default {
        data() {
            return {
                show: false
            }
        },
        props: {
            isShow: {
                type: Boolean
            },
            title: {
                type: String
            },
            message: {
                type: Object
            }
        },
        watch: {
            isShow(val) {
              this.show = val
            }
        },
        methods: {
            handleClose() {
                this.$emit('handleClose')
            }
        }
    }
</script>

<style scoped lang="less">
    .title{
        font-family: PingFangSC-Medium;
        font-size: 20px;
        color: #333;
        letter-spacing: 0;
        text-align: center;
        line-height: 28px;
    }
    .send-time{
        opacity: .5;
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: #333;
        letter-spacing: .88px;
        text-align: center;
        padding-top: 15px;
        padding-bottom: 20px;
    }
    .content{
        padding-bottom: 110px;
    }
    /deep/ .ivu-modal-body{
        padding: 0px 50px;
    }
</style>