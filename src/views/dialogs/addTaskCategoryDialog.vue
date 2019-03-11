<!--<template>
<Modal :transfer=false title="添加分类" width="600px" v-model="addTaskCategoryDialog" @on-cancel="handleRemoveModal(remove)" size="auto" :mask-closable="false" :footer-hide="true">
    <base-input @closedialog="handleClose">
        <Row slot="body">
            <Row class="body-top" v-if="true">
                <p class="title">任务和类型不一样的喔，创建类型前请先选择好</p>
                <Form ref="form" :model="form" :label-width="80" class="add-teacher-form">
                    <FormItem class='radio-container'>
                        <RadioGroup v-model="form.type"  justify='start' align='middle' @on-change="handleChangeRadio">
                            <Radio class="radio" :label="0">
                                <span :style="isChanged ? '':'border-color: #3DAAFF; color: #3DAAFF'" class="radioBtn">线上任务</span>
                            </Radio>
                            <Radio class="radio" :label="1">
                                <span :style="isChanged ? 'border-color: #3DAAFF; color: #3DAAFF':''" class="radioBtn">线下作业</span>
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
        border: 1px solid #3DAAFF;
        color: #3DAAFF;
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
        background: #3DAAFF;
        border-radius: 4px;
        width: 200px;
        height: 36px;
        border: 0;
    }
</style> -->

<template>
    <Modal :title="!payload? '添加作业' : '编辑作业'" :footer-hide="true" v-model="addNewsDialog" @on-cancel="handleRemoveModal(remove)" size="auto"  width="1000">
        <base-input @closedialog="handleClose">
            <Row slot="body" class="body">
                <Row class="body-top">
                    <Form ref="form" :model="form" :label-width="121" class="add-task-form">
                        <FormItem label="作业名称">
                            <Input v-model="form.title" placeholder="请输入文章标题"></Input>
                       </FormItem>
                        <FormItem label="作业类型">
                            <!-- <InputNumber placeholder="请输入阅读数" v-model="form.default_count" :min='0'></InputNumber> -->
                            <Select v-model="option">
                                <Option v-for="item in option" :value="value" :key="item"></Option>
                            </Select>
                       </FormItem>
                        <FormItem label="绑定课程">
                            <!-- <Input type="textarea" style="resize: none" :autosize='{minRows:4}' v-model="form.description" placeholder="请输入文章摘要"></Input> -->
                            <Select v-model="option">
                                <Option v-for="item in option" :value="value" :key="item"></Option>
                            </Select>
                       </FormItem>
                        <FormItem label="作业描述">
                            <text-editor ref='content_editor' :content='contentData' />
                       </FormItem>
                       <FormItem :label-width='120' label="上传附件" >
                        <file-uploader :filters="dataFilters" maxFileCount="1"
                                    :maxFileSize="30000"  @uploadComplete="uploadComplete"
                                    bucket="dscj-static-file" :dir='getDir()'/>
                        </FormItem>
                        <FormItem class="btns">
                            <Button class="btn-orange" type="primary" @click="handleSubmit">保存</Button>
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
import { Loading } from 'element-ui'
import { Config } from '../../config/base'
import {RemoveModal} from './mixins'
import {mapActions, mapState, mapGetters} from 'vuex';
import { get_detail } from '../../api/modules/tools_news'
import dateFormat from '../../config/dateFormat'
import {MPop} from '../../components/MessagePop'
import {Dialog} from './index'
import {RECORD_DETAIL} from './types'
import Uploader from '../../components/Upload'
import { doTimeFormat } from '../../components/Util'

export default {
    mixins: [RemoveModal, MPop],
    props: {
        remove: {
            type: String
        },
        payload: {}
    },
    data() {
        return {
            addNewsDialog: true,
            form: {
                id: 0,
                title: '',
                description: '',
                default_count: 0,
                is_valid:false,
                state:0,
                content: '',
                _fn: null
            },
            contentData: '',
            loadingInstance: null,
            option:''
        }
    },
    mounted() {
        var vm = this;

        if (this.payload) {
            get_detail(this.payload).then(res => {
                if (res.data.res_code === 1) {
                    this.form = res.data.msg[0];
                    this.contentData = res.data.msg[0].content;
                    this.form.news_id = this.payload;
                    this.form.id = this.payload;
                    this.form._fn = function () {
                        vm.handleClose();
                        vm.showPop('保存成功！');
                    }
                }
            })
        }
        else {
            this.form._fn = function () {
                vm.handleClose();
                vm.showPop('保存成功！');
            }
        }
    },
    computed: {
        ...mapState({
              dataFilters(){
            var str = ['doc','pdf','zip'];
            return str;
            }
        })
    },
    methods: {
        ...mapActions([
            'add_news',
            'update_news'
        ]),
        handleClose() {
            this.contentData = '';
            this.addNewsDialog = false;
        },
        handleSubmit() {
            var vm = this;
            var content = this.$refs.content_editor.editor.getContent();
            this.form.content = content;
            if (this.payload) {
                this.update_news(this.form);
            }
            else {
                this.add_news(this.form);
            }
        },
         uploadComplete(id,result) {
            this.form.download_url = result.url;
        },
        getDir() {
            if(this.payload === 0) return 'datacenter/public/' + doTimeFormat(new Date().toString());
            return 'datacenter/curriculum/' + doTimeFormat(new Date().toString());
         },
    },
    components: {
        'base-input': BaseInput,
        'upload-panel': UploadPanel,
        'text-editor': Editor,
        'data-list': BaseList,
        'file-uploader': Uploader
    },
}
</script>
<style lang="scss">
#add-news-container {
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
    .btns{
        text-align: center;

        .btn-orange{
            width: 150px;
        }
    }
    .body{
        margin: 10px 50px 10px 0;
    }
</style>

