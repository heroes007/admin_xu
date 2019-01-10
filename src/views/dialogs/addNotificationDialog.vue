<template>
<el-dialog :title="this.payload?'编辑通知':'创建通知'" :show-close="false" v-model="manulActiveDialog" @close="handleRemoveModal(remove)" size="auto" :closeOnClickModal="false">
    <base-input @closedialog="handleClose">
        <Row slot="body">
                <el-input type="textarea" :autosize='false' placeholder="请输入内容" v-model="notificationContent">
                            </el-input>
                <el-button class='btn-submit' type='primary' @click='submitHandler'>提交</el-button>
          </Row>
      </base-input>
  </el-dialog>
</template>

<script>
import BaseInput from '../../components/BaseInput'
import {
    RemoveModal
} from './mixins'
import {
    mapActions
} from 'vuex'
import {
    MPop
} from '../../components/MessagePop'
export default {
    mixins: [RemoveModal,MPop],
    props: {
        remove: {
            type: String
        },
        payload: {}
    },
    data() {
        return {
            notificationContent:'',
            manulActiveDialog: true
        }
    },
    mounted() {
        if(this.payload)
        {
            this.notificationContent = this.payload.content;
        }
    },
    methods: {
        ...mapActions([
            'add_notification',
            'update_notification'
        ]),
        handleClose() {
            this.manulActiveDialog = false;
        },
        submitHandler(){
            var vm = this;
            if(this.payload)
            {
                this.update_notification({
                    id:this.payload.id,
                    content:this.notificationContent,
                    title:this.notificationContent,
                    fn:function(){
                        vm.handleClose();
                        vm.showPop('修改成功！',1000);
                    }
            });
            }
            else
            {
                this.add_notification({
                    content:this.notificationContent,
                    title:this.notificationContent,
                    fn:function(){
                        vm.handleClose();
                        vm.showPop('创建成功！',1000);
                    }});
            }
        }
    },
    computed: {
    },
    components: {
        'base-input': BaseInput
    },
}
</script>

<style lang="scss">
#add-notification-container {
     @import "base.scss";
        .close-dialog-panel {
            position: absolute;
            top: -70px;
            right: -10px;
            z-index: 99999;
            font-size: 30px;
            cursor: pointer;
            &:before {
                // color: #fff;
                color: #757575;
            }
        }
        input,
        textarea {
            resize: none;
            outline: none;
            height: 220px;
        }
        .el-dialog {
            width: 600px;
            background: none;
            .body-top {
                padding-bottom: 15px;
            }
            .el-dialog__header {
                background: #333333;
                border-radius: 4px 4px 0 0;
                padding: 16px;
            }
            .el-dialog__body {
                padding-bottom: 0;
                margin-bottom: -20px;
                background-color: #fff;
                border-radius: 0 0 4px 4px;
                .el-form-item__label {
                    font-size: 14px;
                    color: #141111;
                    letter-spacing: 0;
                    &:before {
                        margin-right: 0;
                    }
                }
            }

            .btn-submit {
                background-color: #FB843E;
                    border: 0;
border-radius: 4px;
font-size: 16px;
color: #FFFFFF;
letter-spacing: 2px;
padding: 0;
width: 150px;
height:36px;
float: right;
position: relative;
margin: 20px 0 54px;
            }
        }
}
</style>
