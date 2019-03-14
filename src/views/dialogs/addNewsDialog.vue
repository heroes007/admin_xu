<template>
    <Modal :title="!payload? '创建文章' : '编辑文章'" :footer-hide="true" v-model="addNewsDialog" @on-cancel="handleRemoveModal(remove)" size="auto"  width="1000">
        <base-input @closedialog="handleClose">
            <Row slot="body" class="body">
                <Row class="body-top">
                    <Form ref="form" :model="form" :label-width="121" class="add-task-form">
                        <FormItem label="文章标题">
                            <Input v-model="form.title" placeholder="请输入文章标题"></Input>
                       </FormItem>
                        <FormItem label="阅读数">
                            <InputNumber placeholder="请输入阅读数" v-model="form.default_count" :min='0'></InputNumber>
                       </FormItem>
                        <FormItem label="文章摘要">
                            <Input type="textarea" style="resize: none" :autosize='{minRows:4}' v-model="form.description" placeholder="请输入文章摘要"></Input>
                       </FormItem>
                        <FormItem label="文章正文">
                            <text-editor ref='content_editor' :content='contentData' />
                       </FormItem>
                        <FormItem class="btns">
                            <Button class="btn-orange" type="primary" @click="handleSubmit">保存</Button>
                       </FormItem>
                    </Form>
                </Row>
            </Row>
        </base-input>
    </Modal>
    <!-- <FormModal :detail-data="tableRow" :show-modal='show'  :form-list="formList" @close="closeModal" :title="modalTitle" :rule-validate="rules" ></FormModal> -->
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
import FormModal from '../../components/FormModal'

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
            tableRow:{},
            formList: [
            { type: 'input', name: '作业名称',  field: 'realname'},
            { type: 'select', name: '作业类型', field: 'jurisdiction' ,
                selectList: [ {id: 1, name: '线上作业'},{id: 0, name: '线下作业'} ], selectField: [ 'id','name' ]
            },
            { type: 'select', name: '绑定课程', field: 'binding_course' ,
                selectList: [ {id: 1, name: '天涯'},{id: 2, name: '天下'} ], selectField: [ 'id','name' ]
            },
            { type: 'upload', name: '作业描述', field: 'uploading' }
            ],
            rules:{
            realname: [{ required: true, message: '请输入作业名称', trigger: 'blur' } ],
            jurisdiction: [{ required: true, message: '请选择作业类型'} ],
            binding_course: [{ required: true, message: '请选择绑定课程'} ],
            uploading: [{ required: true, message: '请输入课程介绍'} ],
             },
            modalTitle:'创建文章',
            show:true
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
        }
    },
    components: {
        'base-input': BaseInput,
        'upload-panel': UploadPanel,
        'text-editor': Editor,
        'data-list': BaseList,
        FormModal
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
