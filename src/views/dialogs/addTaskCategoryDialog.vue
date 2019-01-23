<template>
<Modal :transfer=false title="添加分类" width="600px" v-model="addTaskCategoryDialog" @on-cancel="handleRemoveModal(remove)" size="auto" :mask-closable="false" :footer-hide="true">
    <base-input @closedialog="handleClose">
        <Row slot="body">
            <Row class="body-top" v-if="true">
                <p class="title">任务和类型不一样的喔，创建类型前请先选择好</p>
                <Form ref="form" :model="form" :label-width="80" class="add-teacher-form">
                    <FormItem class='radio-container'>
                        <RadioGroup v-model="form.type"  justify='start' align='middle' @on-change="handleChangeRadio">
                            <Radio class="radio" :label="0">
                                <span :style="isChanged ? '':'border-color: #FB843E; color: #FB843E'" class="radioBtn">任务</span>
                            </Radio>
                            <Radio class="radio" :label="1">
                                <span :style="isChanged ? 'border-color: #FB843E; color: #FB843E':''" class="radioBtn">作业</span>
                            </Radio>
                        </RadioGroup>
                   </FormItem>
                    <FormItem label="分类名称">
                        <Input v-model="form.name" placeholder="请输入分类名称"></Input>
                   </FormItem>
                    <FormItem class="btn-content">
                        <Button type="primary" class="sub-btn" @click="saveHandler">保存</Button>
                   </FormItem>
                </Form>
            </Row>
        </Row>
    </base-input>
</Modal>
</template>

<script>
import BaseInput from '../../components/BaseInput'
import { RemoveModal } from './mixins'
import UploadPanel from '../../components/UploadPanel'
import { get_category_by_id } from '../../api/modules/tools_task'
import { Config } from '../../config/base'
import { MPop } from '../../components/MessagePop'
export default {
    mixins: [RemoveModal,MPop],
    props: {
        remove: {
            type: String
        },
        payload: {}
    },
    components: {
        'base-input': BaseInput
    },
    data() {
        return {
            addTaskCategoryDialog: true,
            form: {
                project_id: this.$store.state.project.select_project_id,
                name: '',
                type: 0,
                orderby: 0,
                _fn: null
            },
            isChanged: false,
            loadingInstance: null
        }
    },
    methods: {
        saveHandler() {
            if (this.payload.cid) {
                this.$store.dispatch('edit_task_category', this.form);
            } else {
                this.$store.dispatch('add_task_category', this.form);
            }
        },
        handleClose() {
            this.addTaskCategoryDialog = false;
        },
        handleUploadComplete(url) {
            this.form.img_url = url;
        },
        handleChangeRadio(v){
          this.isChanged = v;
        }
    },
    mounted() {
        var vm = this;
        this.form._fn = function() {
            vm.handleClose();
            vm.showPop('创建成功！',1000);
        };

        if (this.payload.cid) {
            this.loadingInstance = this.$LoadingY({message: "加载中，请稍后",show: true})
            setTimeout(() => {
                this.loadingInstance.close();
            }, Config.base_timeout);
            get_category_by_id(this.payload.cid).then(res => {
                if (res.data.res_code === 1) {
                    this.form = res.data.msg;
                    this.form.task_category_id = this.payload.cid;
                    this.form._fn = function() {
                        vm.handleClose();
                        vm.showPop('创建成功！',1000);
                    };
                   if(this.loadingInstance) this.loadingInstance.close();
                }
            })
        } else {
            this.form.orderby = this.payload.orderby;
        }
    }
}
</script>
<style lang="scss" scoped>
    .radioBtn{
        display: inline-block;
        background-color: #fff;
        color: #979797;
        width: 90px;
        height: 36px;
        margin-right: 40px;
        border: 1px solid #979797;
        border-radius: 4px;
    }
    .is-changed{
        border: 1px solid #FB843E;
        color: #FB843E;
    }
    /deep/ .ivu-modal-body{
        width: 80%;
        margin-left: 10%;
    }
    .title {
        font-size: 14px;
        color: #757575;
        letter-spacing: 1px;
        line-height: 20px;
        margin: 24px;
    }
    .sub-btn {
        background: #FB843E;
        border-radius: 4px;
        width: 200px;
        height: 36px;
        border: 0;
    }
</style>
