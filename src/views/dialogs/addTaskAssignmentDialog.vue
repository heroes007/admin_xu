<template>
    <el-dialog :title="payload.row.name" :show-close="false" v-model="addTaskAssignmentDialog" @close="handleRemoveModal(remove)"
        size="auto" :closeOnClickModal="false">
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
                                <el-popover
  ref="pic_preview"
  placement="bottom"
  width="400"
  trigger="hover"
  popper-class='task-assignment-pop'>
  <img :src='item.url'/>
   <a slot='reference' class='preview' v-if="item.name.indexOf('.png') > -1 || item.name.indexOf('.jpg')> -1 || item.name.indexOf('.jpeg') > -1">预览</a>
</el-popover>
                                <a :href="item.url" target="_blank" :download='item.name'>下载</a>
                            </div>
                        </Row>
                        <div class='readover-content'>
                            <el-input type="textarea" :rows="20" placeholder="请输入评价内容" v-model="data.read_over_content">
                            </el-input>
                        </div>
                        <Row class='btn-submit' type='flex' justify='center'>
                            <el-button type='primary' @click='doSubmit'>确定</el-button>
                        </Row>
                    </div>
                </Row>
            </Row>
        </base-input>
        </el-dialog>
</template>
<!-- task_id = 19 -->
<script>
    import BaseInput from '../../components/BaseInput'
    import UploadPanel from '../../components/UploadPanel'
    import {
        RemoveModal
    } from './mixins'
    import {
        mapActions,
        mapState
    } from 'vuex';
    import {
        get_readover_detail
    } from '../../api/modules/tools_task'
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
        computed: {
            ...mapState({

            })
        },
        methods: {
            ...mapActions([
                'readover_task'
            ]),
            handleClose() {
                this.addTaskAssignmentDialog = false;
            },
            jsonParse(str) {
                return str && JSON.parse(str);
            },
            doSubmit() {
                this.readover_task(this.data);
            }
        },
        components: {
            'base-input': BaseInput,
            'upload-panel': UploadPanel
        },
    }

</script>
<style lang="scss">
.task-assignment-pop {
    img {
        width: 100%;
    }
}
    #add-task-assignment-container {
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
        .el-dialog {
            width: 900px;
            background: none;
            .body-top {
                padding-bottom: 10px;
            }
            .el-dialog__header {
                background: #333333;
                border-radius: 4px 4px 0 0;
                padding: 16px;
            }
            .el-dialog__body {
                padding: 0;
                background: #fff;
                border-radius: 0 0 4px 4px;
            }
            .data-container {
                width: 80%;
                margin: 40px auto;
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
                .btn-submit {
                    margin-top: 40px;
                    .el-button {
                        background-color: #FB843E;
                        border: 1px solid #F06B1D;
                        border-radius: 4px;
                        color: #ffffff;
                        width: 200px;
                        height: 36px;
                    }
                }
            }
        }
    }
</style>