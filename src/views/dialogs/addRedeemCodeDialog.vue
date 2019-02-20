<template>
<el-dialog title="添加兑换码" v-model="addRedeemCodeDialog" @close="handleRemoveModal(remove)" size="auto" :closeOnClickModal="false" :show-close="false">
    <base-input @closedialog="handleClose">
        <Row slot="body">
            <Row class="body-top" v-if="true">
                <Form ref="form" :model="form" :label-width="100" class="add-teacher-form">
                    <FormItem label="兑换码名称">
                        <Input v-model="form.code_name" placeholder="请输入分类名称"></Input>
                   </FormItem>
                    <FormItem label="选择产品">
                        <Select v-model="form.product_id" placeholder="请选择产品">
                            <Option v-for="item in productionList" :key="item.id" :label="item.title" :value="item.id"></Option>
                        </Select>
                   </FormItem>
                    <FormItem label="起止日期">
                                <el-date-picker v-model="form.time" type="daterange" placeholder="请选择兑换码起止日期">
                                </el-date-picker>
                   </FormItem>
                     <FormItem label="兑换码数量">
                                <el-input-number placeholder="请输入1～10000的兑换码数量" v-model="form.count" :min='1'></el-input-number>
                   </FormItem>
                    <FormItem label="线下学期次数">
                                <el-input-number placeholder="请输入包含的线下学期次数" v-model="form.offline_term_count" :min='0'></el-input-number>
                   </FormItem>
                    <FormItem class="btn-content" label-width='0'>
                        <Button type="primary" class="cancel-btn" @click="handleClose">取消</Button>
                        <Button type="primary" class="sub-btn" @click="saveHandler">提交</Button>
                   </FormItem>
                </Form>
            </Row>
        </Row>
    </base-input>
</el-dialog>
</template>

<script>
import BaseInput from '../../components/BaseInput'
import {
    RemoveModal
} from './mixins'
import UploadPanel from '../../components/UploadPanel'
import {
    get_category_by_id
} from '../../api/modules/tools_task'
import {
    Loading
} from 'element-ui'
import {
    Config
} from '../../config/base'
import {
    mapState,
    mapActions
} from 'vuex'
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
    components: {
        'base-input': BaseInput
    },
    computed:{
         ...mapState({
                projectId:state => state.project.select_project_id,
                productionList:state => state.production.production_list
            }),
    },
    data() {
        return {
            addRedeemCodeDialog: true,
            form: {
                project_id:1,
                product_id:0,
                code_name:'',
                time:[],
                open_time: null,
                ex_time: null,
                count: 1,
                offline_term_count:0,
                _fn: null
            },
            isChanged: false,
            loadingInstance: null
        }
    },
    methods: {
        ...mapActions([
            'add_code_group',
            'get_production_list'
        ]),
        saveHandler() {
            if(this.form.time.length === 0)
            {
                this.$alert('请选择兑换码起止时间！', '提示', {
                                        confirmButtonText: '确定',
                                        callback: action => { }
                                    });
            }
            else
            {
                this.form.project_id = this.projectId;
                this.form.open_time = this.form.time[0];
                this.form.ex_time = this.form.time[1];
                this.add_code_group(this.form);
            }
        },
        handleClose() {
            this.addRedeemCodeDialog = false;
        }
    },
    mounted() {
        var vm = this;
        this.form._fn = function() {
            vm.handleClose();
            vm.showPop('创建成功！',1000);
        };
        this.get_production_list({
                project_id: this.projectId,
                page_index: 0,
                page_size: 999,
                state: [0, 1]
            });
    }
}
</script>
<style lang="scss">
#add-remeed-code-container {
    @import "base.scss";
    input,
    textarea {
        resize: none;
        outline: none;
    }
    .close-dialog-panel {
        position: absolute;
        top: -70px;
        right: -13.5px;
        z-index: 99999;
        font-size: 30px;
        cursor: pointer;
        &:before {
            // color: #fff;
            color: #757575;
        }
    }
    .el-dialog {
        width: 600px;
        background: none;
        .title {
            font-size: 14px;
            color: #757575;
            letter-spacing: 1px;
            line-height: 20px;
            margin-top: 0;
        }
        .el-dialog__header {
            background: #333333;
            border-radius: 4px 4px 0 0;
            padding: 16px;
        }

        .el-dialog__body {
            margin-bottom: -20px;
            background-color: #fff;
            border-radius: 0 0 4px 4px;
            padding-bottom: 10px;
            .el-form-item__label {
                font-size: 14px;
                color: #141111;
                letter-spacing: 0;
            }
        }
        .add-teacher-form {
            width: 80%;
            margin: 0 auto;
            .el-select {
                width: 100%;
            }
            input {
                border-radius: 0;
                border: 1px solid #CCCCCC;
            }

            .el-input-number {
                width: 100%;
            }
            .el-date-editor--daterange {
                width: 100%;
            }
            .btn-content {

                margin-top: 50px;
            }
            .el-form-item__content {
                // margin-left: 0 !important;
                line-height: 0;
                .el-textarea {
                    .el-textarea__inner {
                        background: #FFFFFF;
                        border: 1px solid #CCCCCC;
                        height: 140px;
                        border-radius: 0;
                        // width: 390px;
                    }
                }
            }
            .sub-btn {
                background: #3DAAFF;
                border-radius: 4px;
                width: 200px;
                height: 36px;
                border: 0;
            }
            .cancel-btn {
                background: #FFFFFF;
border: 1px solid #999999;
border-radius: 4px;
width: 100px;
height: 36px;
color:#000000;
            }
        }
    }
}
</style>
