<template>
    <Modal :transfer=false title="添加讲师" width="600px" v-model="addTeacherDialog" @on-cancel="handleRemoveModal(remove)" size="auto" :mask-closable="false" :footer-hide="true">
        <base-input @closedialog="handleClose">
            <Row slot="body">
                <Row class="body-top" v-if="true">
                    <Form ref="form" :model="form" :label-width="80" class="add-teacher-form">
                        <FormItem label="讲师名称">
                            <Input v-model="form.name" placeholder="请输入讲师名称"></Input>
                       </FormItem>
                        <FormItem label="讲师描述">
                            <Input type="textarea" style="resize: none" :autosize="{ minRows: 6, maxRows: 6}" placeholder="请对讲师进行描述" v-model="form.description"></Input>
                       </FormItem>
                        <FormItem label="讲师照片" class="upload-form1">
                            <upload-panel ref="upload_panel" :resourse="form.img_url" :upload-config="uploadConfig" @uploadcomplete="handleUploadComplete">
                                <span slot="file-require">只能上传 jpg/png 文件，且不超过1000kb</span>
                            </upload-panel>
                       </FormItem>
                        <div class="btn-content">
                            <Button type="primary" class="sub-btn" @click="saveHandler">保存</Button>
                       </div>
                    </Form>
                </Row>
            </Row>
        </base-input>
    </Modal>
</template>

<script>
import BaseInput from '../../components/BaseInput'
import UploadButton from '../../components/UploadButton'
import UploadPanel from '../../components/UploadPanel'
import { RemoveModal } from './mixins'
import { get_detail } from '../../api/modules/tools_teacher'
import { Config } from '../../config/base'
import { MPop } from '../../components/MessagePop'

export default {
    mixins: [RemoveModal,MPop],
    props: {
        remove: { type: String },
        payload: { }
    },
    components: {
        'base-input': BaseInput,
        'upload-button': UploadButton,
        'upload-panel': UploadPanel
    },
    data() {
        return {
            addTeacherDialog: true,
            form: {
                id:0,
                name: '',
                description: '',
                img_url:'',
                _fn:null
            },
            loadingInstance:null,
            uploadConfig: {
              bucket: 'dscj-app',
              dir: 'user_task',
              type: 1
            }
        }
    },
    methods: {
        saveHandler() {
            if(this.payload) this.$store.dispatch('edit_teacher',this.form);
            else  this.$store.dispatch('add_teacher',this.form);
        },
        handleClose() {
            this.addTeacherDialog = false;
        },
        handleUploadComplete(url){
          this.form.img_url = url;
        }
    },
    mounted(){
        var vm = this;
        this.form._fn = function(){
            vm.handleClose();
            vm.showPop('保存成功！',1000);
        };
        if(this.payload){
            this.loadingInstance = this.$LoadingY({message: "加载中，请稍后",show: true})
            setTimeout(() => {
            this.loadingInstance.close();
        }, Config.base_timeout);
            get_detail(this.payload).then(res => {
              if(res.data.res_code === 1){
                    this.form = res.data.msg[0];
                    this.form._fn = function(){
                        vm.handleClose();
                        vm.showPop('保存成功！',1000);
                    };
                       if(this.loadingInstance) this.loadingInstance.close();
                }
            })
        }
    }
}
</script>
<style lang="scss" scoped>
/deep/.ivu-modal-body{
    width: 80%;
    margin-left: 10%;
}
.sub-btn{
    width: 170px;
    margin-bottom: 10px;
}
#add-teacher-container {
@import "base.scss";
    input,
    textarea {
        resize: none;
        outline: none;
    }
    .close-dialog-panel{
      position: absolute;
      top: -70px;
      right: -13.5px;
      z-index: 99999;
      font-size: 30px;
      cursor: pointer;
      &:before{
        color: #757575;
      }
    }
}
</style>
