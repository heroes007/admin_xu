
<template>
<el-dialog title="提示" v-model="notificationDialog" @close="handleRemoveModal(remove)" size="auto" :closeOnClickModal="false">
  <p>{{payload.title}}</p>
  <span slot="footer" class="dialog-footer">
    <Button @click="notificationDialog = false">取 消</Button>
    <Button type="primary" @click="handleDeleteOk">确 定</Button>
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
