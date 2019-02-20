<template>
    <Modal width="800px" :title="payload.row.name" :transfer=false v-model="addTaskAssignmentDialog" @on-cancel="handleRemoveModal(remove)"
       :footer-hide="true" :mask-closable="false">
        <base-input @closedialog="handleClose">
            <Row slot="body">
                <Row class="body-top">
                    <div class='data-container'>
                        <Row class='file-item' type='flex' justify='space-between' align='middle' v-for='item in jsonParse(data.upload_files)' :key="item.id">
                            <div class='title'>
                                <i class='xght-webfont-film'></i>{{item.name}}
                            </div>
                            <div class='link'>
                                <a class='preview' :href='item.url' target="_blank" v-if="item.name.indexOf('.mp4') > -1">播放</a>
                                <Poptip ref="pic_preview" placement="bottom" :width="400" title="" trigger="hover" popper-class='task-assignment-pop'>
                                    <div slot="content">
                                        <img :src='item.url'/>
                                        <a slot='reference' class='preview' v-if="item.name.indexOf('.png') > -1 || item.name.indexOf('.jpg')> -1 || item.name.indexOf('.jpeg') > -1">预览</a>
                                    </div>
                                </Poptip>
                                <a :href="item.url" target="_blank" :download='item.name'>下载</a>
                            </div>
                        </Row>
                        <div class='readover-content'>
                            <Input class="from-textarea" type="textarea" :rows="20" placeholder="请输入评价内容" v-model="data.read_over_content"></Input>
                        </div>
                        <Row class='btn-submit' type='flex' justify='center'>
                            <Button class="btns" type='primary' @click='doSubmit'>确定</Button>
                        </Row>
                    </div>
                </Row>
            </Row>
        </base-input>
        </Modal>
</template>
<script>
    import BaseInput from '../../components/BaseInput'
    import UploadPanel from '../../components/UploadPanel'
    import { RemoveModal } from './mixins'
    import { mapActions } from 'vuex';
    import { get_readover_detail } from '../../api/modules/tools_task'
    import { MPop } from '../../components/MessagePop'
    export default {
        mixins: [ RemoveModal, MPop ],
        components: { 'base-input': BaseInput, 'upload-panel': UploadPanel },
        props: {
            remove: {
                type: String
            },
            payload: {}
        },
        data() {
            return {
                addTaskAssignmentDialog: true,
                data: {
                    user_task_id: 0,
                    upload_files: '',
                    read_over_content: '',
                    callback: undefined
                }
            }
        },
        mounted() {
            this.data.user_task_id = this.payload.row.user_task_id;
            let vm = this;
            this.data.callback = function () {
                vm.handleClose();
                vm.showPop('评价成功！',1000);
            }
            get_readover_detail(this.data.user_task_id).then(res => {
                if (res.data.res_code === 1) {
                    this.data.upload_files = res.data.msg.upload_files;
                    this.data.read_over_content = res.data.msg.read_over_content;
                }
            })
        },
        methods: {
            ...mapActions([ 'readover_task' ]),
            handleClose() {
                this.addTaskAssignmentDialog = false;
            },
            jsonParse(str) {
                return str && JSON.parse(str);
            },
            doSubmit() {
                this.readover_task(this.data);
            }
        }
    }

</script>
<style lang="scss" scoped>
/deep/ .ivu-input{padding: 15px !important;}
.btn-submit {
    margin-top: 40px;
    .btns {
        background-color: #3DAAFF;
        border: 1px solid #3DAAFF;
        border-radius: 4px;
        color: #ffffff;
        width: 200px;
        height: 36px;
    }
}
.task-assignment-pop {
    img {
        width: 100%;
    }
}
/deep/ .ivu-modal-body{padding: 40px;}
#add-task-assignment-container {
    input,textarea {
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
            color: #757575;
        }
    }
    .data-container {
        .file-item {
            margin-bottom: 15px;
            &:last-child {
                margin-bottom: 0;
            }
            .title {
                font-size: 16px;
                color: #171515;
                letter-spacing: 0;
                i {
                    font-size: 20px;
                    margin-right: 8px;
                }
            }
            .link {
                a {
                    font-size: 16px;
                    color: #697784;
                    letter-spacing: 0;
                }
                .preview {
                    border-right: 1px solid #697784;
                    padding-right: 15px;
                    margin-right: 15px;
                    cursor: pointer;
                }
            }
        }
        .readover-content {
            textarea {
                min-height: 420px;
                background-color: #FBFBFB;
                border: 1px solid #E5E5E5;
            }
        }
    }
}
</style>