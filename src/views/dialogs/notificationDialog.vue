
<template>
<el-dialog title="提示" v-model="notificationDialog" @close="handleRemoveModal(remove)" size="auto" :closeOnClickModal="false">
  <p>{{payload.title}}</p>
  <span slot="footer" class="dialog-footer">
    <el-button @click="notificationDialog = false">取 消</el-button>
    <el-button type="primary" @click="handleDeleteOk">确 定</el-button>
  </span>
</el-dialog>
</template>

<script>
import {
    RemoveModal
} from './mixins'
export default {
    mixins: [RemoveModal],
    props: {
        remove: {
            type: String
        },
        payload: {
        }
    },
    data(){
      return {
        notificationDialog: true
      }
    },
    methods: {
      handleDeleteOk(){
        if(this.payload.can_delete){
            this.payload.fn();
        }
        this.notificationDialog = false;
      }
    }
}
</script>
<style lang="scss">
#notification-container {
    @import "base.scss";

}
</style>
