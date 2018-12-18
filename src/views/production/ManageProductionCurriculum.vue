<template>
    <div class='manage-production-curriculum'>
        <header-component :show-add='false' :type='0'/>
        <el-row class='course-name' type='flex' justify='space-between' align='middle'>
            <div>
                <h2>产品：{{currentProduction.title}}</h2>
            </div>
            <div>
                <el-button type='text' @click='backClickHandler'>返回</el-button>
            </div>
            <el-button class='btn-add' type='primary' @click='addProductionCurriculum()' v-if="activeName == 'online'">添加</el-button>
        </el-row>
        <el-tabs v-model="activeName" active-name='online'>
            <el-tab-pane class='online-content' label="线上课" name="online">
                <data-list class='data-list' :table-data='currentProduction.online_curriculum_list' :header-data='onlineHeader' :columnComboData='columnComboData'
                    :comboModelList='comboDataList' @delete='deleteHandler' />

            </el-tab-pane>
            <el-tab-pane class='offline-content' label="线下课" name="offline">

            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
    import Header from '../../components/ProjectHeader'
    import BaseList from '../../components/BaseList'
    import SaveOrder from '../../components/SaveOrder'
    import { doTimeFormat } from '../../components/Util'
    import { Dialog } from '../dialogs'
    import { SELECT_CURRICULUM } from '../dialogs/types'
    import { Loading, MessageBox } from 'element-ui';
    import { Config } from '../../config/base'
    import { doSortFormatCatalogList } from '../../components/Util'
        import {
    MPop
} from '../../components/MessagePop'
    import {
        mapState,
        mapActions
    } from 'vuex'
    export default {
        mixins: [Dialog,MPop],
        data() {
            return {
                activeName: 'online'
            }
        },
        computed: {
            ...mapState({
                isLoading: state => state.production.isLoading,
                productionList: state => state.production.production_list,
                projectId: state => state.project.select_project_id
            }),
            onlineHeader() {
                return [
                    { label: '排序', width: 90, sort: true },
                    { prop: 'teacher_name', label: '讲师', width: 200 },
                    { prop: 'title', label: '课程名称', minwidth:300}, {
                        label: '前置课',
                        prop: 'pre_curriculums',
                        useCombo: true,
                        comboListIndex: 0,
                        listLabel: 'title',
                        listValue: 'curriculum_id',
                        actionName: 'change_production_curriculum_pre_curriculum',
                        minwidth:500
                    },
                    {
                        label: '操作', width: 100, groupBtn: [{ text: '删除', param: 'delete' }]
                    }
                ]
            },
            productionId() {
                return parseInt(this.$route.params.id);
            },
            currentProduction() {
                for (var i = 0; i < this.productionList.length; i++) {
                    if (this.productionList[i].id == this.productionId) {
                        return this.productionList[i];
                    }
                }
                return {
                    title: '',
                    online_curriculum_list: []
                };
            },
            comboDataList() {
                var r = [];
                var v = []
                for (var i = 0; i < this.currentProduction.online_curriculum_list.length; i++) {
                    v = [];
                    for (var j = 0; j < this.currentProduction.online_curriculum_list[i].pre_curriculums.length; j++) {
                        v.push(this.currentProduction.online_curriculum_list[i].pre_curriculums[j]);
                    }
                    r.push(v);
                }
                return r;
            },
            columnComboData() {
                return [this.currentProduction.online_curriculum_list];
            },
        },
        watch: {
            isLoading(val) {
                if (val) {
                    this.loadingInstance = Loading.service({ text:'加载中，请稍后',fullscreen: true });
                    setTimeout(() => {
                        this.loadingInstance.close();
                    }, Config.base_timeout);
                }
                else {
                    this.loadingInstance.close();
                    this.dirty = false;
                }
            }
        },
        methods: {
            ...mapActions([
                'get_production_curriculums',
                'get_production_list',
                'delete_production_curriculums',
                'set_cur_production'
            ]),
            backClickHandler() {
                this.$router.replace({ name: 'manage-production' });
            },
            addProductionCurriculum() {
                this.handleSelModal(SELECT_CURRICULUM,{productionId:this.productionId,list:this.currentProduction.online_curriculum_list});
            },
            deleteHandler(index, row) {
                var vm = this;
                this.$confirm('是否确认删除该课程？', '提示', {
                    type: 'info'
                }).then(() => {
                    this.delete_production_curriculums({
                        id:this.productionId,
                        curriculum_id: row.curriculum_id, _fn: function () {
                            vm.showPop('删除成功！');
                        }
                    })
                }).catch(() => { });
            },
            handleClick() {

            }
        },
        mounted() {
            var vm = this;
            this.set_cur_production(this.productionId);
            if (this.productionList.length === 0) {
                this.get_production_list({
                    project_id: this.projectId,
                    page_index: 0,
                    page_size: 999,
                    callback: function () {
                        if (vm.currentProduction.online_curriculum_list.length === 0) {
                            vm.get_production_curriculums(vm.productionId);
                        }
                    }
                });
            }
            else if (this.currentProduction.online_curriculum_list.length === 0) {
                this.get_production_curriculums(this.productionId);
            }

        },
        components: {
            'header-component': Header,
            'data-list': BaseList,
            'save-order': SaveOrder
        }
    }

</script>
<style lang='scss'>
    .manage-production-curriculum {
        .course-name {
            height: 60px;
            background-color: #ffffff;
            padding: 0 40px;
            h2 {
                font-size: 16px;
                color: #141111;
                letter-spacing: 0;
                font-weight: 400;
            }
            .el-button {
                font-size: 14px;
                color: #141111;
                letter-spacing: 0;
            }
            .btn-add {
                    position: absolute;
                    z-index: 999;
                    background-color: #F06B1D;
                    color:#ffffff;
                    border: 0;
                    padding: 0;
                    border-radius: 2px;
                    width: 120px;
                    height: 26px;
                    top: 82px;
                    right: 50px;
                }
        }
        .el-tabs {
            .el-tabs__header {
                text-align: center;
                line-height: 60px;
                height: 60px;
                margin-bottom: 0;
                .el-tabs__active-bar {
                    background-color: #F06B1D;
                    border-radius: 8px;
                    position: relative;
                    margin: 0 auto;
                    top: 58px;
                    left: -52px;
                }
                .el-tabs__item {
                    float: none;
                    display: inline-block;
                    font-size: 18px;
                    color: #141111;
                    letter-spacing: 5px;
                }
            }
            .el-tabs__content {}
            .online-content {
                
            }
        }
        .data-list {
            .base-list-row {
                .handle-component {
                    margin-right: 30px;
                    +.handle-component {
                        margin-right: 2px;
                    }
                    // &:last-child {
                    //     margin-left: 50px;
                    // }
                }
            }
        }
        .chapter-container {
            box-sizing: border-box;
            width: 100%;
            height: 100%;
            top: 0;
            padding-top: 120px;
            position: absolute;
            z-index: 0;
            pointer-events: none;
            .scroll-wrap {
                overflow-y: scroll;
                height: 100%;
                width: 100%;
                pointer-events: auto;
            }
        }
        .chapter-list {
            .chapter-item {
                .chapter-title {
                    padding: 0 40px;
                    background-color: #FBFBFB;
                    border: 1px solid #E5E5E5;
                    height: 60px;
                    span,
                    h3 {
                        font-size: 16px;
                        color: #141111;
                        letter-spacing: 0;
                        font-weight: 400;
                        display: inline-block;
                    }
                    input {
                        outline: 0;
                        font-size: 16px;
                        color: #141111;
                        letter-spacing: 0;
                        border: 0;
                        background-color: transparent;
                    }
                    i {
                        color: #cccccc;
                        cursor: pointer;
                    }
                }
                .chapter-btns {
                    margin-top: 25px;
                    padding: 0 40px;
                    .warning {
                        font-size: 14px;
                        color: #F06B1D;
                    }
                    .el-button {
                        font-size: 14px;
                        color: #3B3B3B;
                        letter-spacing: 0;
                        &:hover {
                            color: #F06B1D;
                        }
                    }
                    .line {
                        width: 1px;
                        background-color: #e5e5e5;
                        height: 14px;
                        display: inline-block;
                        margin: 0 8px;
                    }
                }
            }
        }
        .save-order {
            position: absolute;
            right: 100px;
            top: 70px;
        }
    }
</style>