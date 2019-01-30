<template>
    <Modal :title="this.payload?'编辑通知':'创建通知'" width="600px" :footer-hide="true" v-model="manulActiveDialog" @on-cancel="handleRemoveModal(remove)" :mask-closable="false">
        <base-input @closedialog="handleClose">
            <Row slot="body">
                <Input type="textarea" :autosize='false' placeholder="请输入内容" v-model="notificationContent"></Input>
                <Button class="notification-btn" type='primary' @click='submitHandler'>提交</Button>
            </Row>
        </base-input>
    </Modal>
</template>

<script>
  import BaseInput from '../../components/BaseInput'
  import { RemoveModal } from './mixins'
  import { mapActions } from 'vuex'
  import { MPop } from '../../components/MessagePop'

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
    computed: {},
    components: {
      'base-input': BaseInput
    },
  }
</script>

<style scoped lang="scss">
    /deep/ .ivu-modal-body{ padding: 20px; }
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
                color: #757575;
            }
        }
        input,
        textarea {
            resize: none;
            outline: none;
            height: 220px;
        }
    }
    /deep/ textarea.ivu-input{
        resize: none;
        width: 560px;
        height: 220px;
        border-radius: 4px;
        padding: 15px;
    }
    .notification-btn{
        margin: 20px;
        float: right;
        width: 150px;
    }
</style>
