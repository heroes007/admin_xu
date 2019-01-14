<template>
<Modal :title="!payload? '创建专题' : '编辑专题'" :footer-hide=true v-model="addProductionGroupDialog" @on-cancel="handleRemoveModal(remove)" >
    <base-input @closedialog="handleClose">
        <Row slot="body">
            <Row class="body-top">
                <Form ref="form" :model="form" :label-width="121" class="add-task-form">
                    <FormItem label="专题名称">
                    <Input v-model="form.name" placeholder="请输入专题名称"></Input>
                   </FormItem>
                    <FormItem label="专题展示">
                        <upload-panel ref="upload_panel" :resourse="form.img_url" :upload-config="uploadConfig" @uploadcomplete="uploadCompleteHandler">
                            <span slot="file-require">只能上传 jpg/png 文件，且图片480*270</span>
                        </upload-panel>
                    </FormItem>
                    <FormItem label="专题简介">
                        <Input type="textarea" :rows="6" placeholder="请输入专题简介" v-model="form.short_description">
                        </Input>
                   </FormItem>
                    <FormItem label="编辑产品课程图文详情:" :label-width='160'>
                   </FormItem>
                    <FormItem label="" :label-width='0'>
                        <text-editor ref='description_editor' :content='form.description'/>
                   </FormItem>
                    <FormItem class="btns">
                        <Button class="btn-orange" @click="handleSubmit('form')">保存</Button>
                   </FormItem>
                </Form>
            </Row>
        </Row>
    </base-input>
</Modal>
</template>
<!-- task_id = 19 -->
<script>
import BaseInput from '../../components/BaseInput'
import UploadPanel from '../../components/UploadPanel'
import Editor from '../../components/Editor'
import BaseList from '../../components/BaseList'
import { Config } from '../../config/base'
import { RemoveModal } from './mixins'
import { mapActions, mapState } from 'vuex';
import { get_detail } from '../../api/modules/tools_special'
import dateFormat from '../../config/dateFormat'
import { MPop } from '../../components/MessagePop'
export default {
    mixins: [RemoveModal,MPop],
    components: {
        'base-input': BaseInput,
        'upload-panel': UploadPanel,
        'text-editor':Editor
    },
    props: {
        remove: {
            type: String
        },
        payload: {}
    },
    data() {
        return {
            addProductionGroupDialog: true,
            form: {
                special_id:0,
                name: '',
                short_description:'',
                description:''
            },
            uploadConfig: {
                bucket: 'dscj-app',
                dir: 'production',
                type: 1
            },
            loadingInstance:null
        }
    },
    mounted() {
        if(this.payload){
            this.form.special_id = this.payload.id;
            this.loadingInstance = this.$LoadingY({message: "加载中，请稍后",show: true})
                setTimeout(() => {
                    this.loadingInstance.close();
                }, Config.base_timeout);
                get_detail(this.payload.id).then(res => {
                    if(res.data.res_code === 1)
                    {
                        this.form.name = res.data.msg.name;
                        this.form.short_description = res.data.msg.short_description;
                        this.form.description = res.data.msg.description;
                        var arrObj = JSON.parse(res.data.msg.img_url_arr);
                        this.form.img_url = arrObj.default;
                        this.loadingInstance.close();
                    }
                })
        }
        var vm = this;
        this.form.project_id = this.projectId;
        this.form._fn = function(){
            vm.handleClose();
            vm.showPop('保存成功！');
        }
    },
    computed: {
        ...mapState({
            subjectList: state => state.subject.subject_list,
            gradeList: state => state.grade.grade_list,
            onlineCurrriculumList: state => state.online_curriculum.online_curriculum_list
        }),
    },
    methods: {
        ...mapActions([
            'add_production_group',
            'update_production_group'
        ]),
        uploadCompleteHandler(url){
            this.form.img_url = url;
        },
        handleClose() {
            this.form.description = '';
            this.addProductionGroupDialog = false;
        },
        handleSubmit(formName) {
            var arrObj = {
                default:this.form.img_url
            }
            var description= this.$refs.description_editor.editor.getContent();
            this.form.description = description;
            this.form.img_url_arr =JSON.stringify(arrObj);
            if(this.payload) this.update_production_group(this.form);
            else  this.add_production_group(this.form);
        }
    }
}
</script>
<style lang="scss" scoped>
/deep/ .ivu-modal{ width: 800px !important }
.add-task-form{
    width: 80% !important;
    margin-left: 10%;
}
.btn-orange:hover{
    background: #FB843E !important;
    color: #fff;
}
.btn-orange{ 
    margin-left: 20%;
    background: #FB843E;
    border: 1px solid #F06B1D;
    border-radius: 4px;
    color: #fff;
    width: 200px;
    height: 36px;}
#add-production-group-container {
    @import "base.scss";
    input,
    textarea {
        resize: none;
        outline: none;
    }
    .close-dialog-panel {
        position: absolute;
        top: -40px;
        right: 13.5px;
        z-index: 99999;
        font-size: 30px;
        cursor: pointer;
        &:before {
            // color: #fff;
            color: #757575;
        }
    }
}
</style>
