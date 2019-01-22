<template>
    <Modal :transfer=false title="产品协议" :width="800" :footer-hide=true v-model="selectProductionDialog" @on-cancel="handleRemoveModal(remove)">
        <base-input @closedialog="handleClose">
            <Row slot="body">
                <Row class="body-top">
                    <data-list class='data-list light-header' @changeSelect='changeRowSelectHandler' :table-data='dataList' :header-data='dataHeader'
                        :column-formatter='listColumnFormatter' :column-formatter-data='listColumnFormatterData'></data-list>
                </Row>
               <Row class="elRow">
                    <Button type="primary" class="ok-btn" @click="addHandler">保存</Button>
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
    import {
        get_list
    } from '../../api/modules/tools_product'
    import {
        get_production_group_list,
        get_products
    } from '../../api/modules/tools_special'
    import {
        RemoveModal
    } from './mixins'
    import {
        mapActions,
        mapState
    } from 'vuex';
    import { Config } from '../../config/base'
    import {
        reunitPrice
    }   from '../../components/Util'
    import {
        MPop
    } from '../../components/MessagePop'
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
                selectProductionDialog: true,
                dataList: [],
                loadingInstance: null,
                selectList: [],
                productionGroupList: []
            }
        },
        mounted() {
            this.loadingInstance = this.$LoadingY({message: "加载中，请稍后",show: true})
            setTimeout(() => {
                this.loadingInstance.close();
            }, Config.base_timeout);
            get_list({
                project_id: this.projectId,
                page_index: 0,
                page_size: 999,
                state: [0, 1]
            }).then(res => {
                if (res.data.res_code === 1) {
                    this.dataList = [];
                    var founded = false;
                    for (var i = 0; i < res.data.msg.products.length; i++) {
                        res.data.msg.products[i].is_select = false;
                    }
                    this.dataList = res.data.msg.products;
                    this.checkSelect();
                }
              if(this.loadingInstance)  this.loadingInstance.close();
            })
            get_production_group_list({
                page_index: 0,
                page_size: 999,
                state: [0, 1]
            }).then(res => {
                if (res.data.res_code === 1) {
                    this.productionGroupList = res.data.msg.specials;
                }
            })
            get_products(this.payload).then(res => {
                if (res.data.res_code === 1) {
                    this.selectList = res.data.msg;
                    this.checkSelect();
                }
            })
        },
        computed: {
            ...mapState({
                projectId: state => state.project.select_project_id
            }),
            dataHeader() {
                return [
                    {
                        label: '产品编码',
                        prop: 'code',
                        width: 150,
                    }, {
                        prop: 'title',
                        label: '产品名称'
                    }, {
                        prop: 'price',
                        label: '定价',
                        width: 100
                    }, {
                        prop: 'original_price',
                        label: '售价',
                        width: 100
                    }, {
                        prop: 'belong_specials',
                        label: '已在专题',
                        minwidth: 150,
                    }, {
                        label: '操作',
                        width: 120,
                        groupBtn: [{
                            text: '',
                            param: 'changeSelect',
                            switchKey: 'is_select',
                            useCheckBox: true
                        }]
                    }]
            } ,
            listColumnFormatter() {
                return [
                    {
                        columnName:'price',
                        doFormat:reunitPrice
                    },
                    {
                        columnName:'original_price',
                        doFormat:reunitPrice
                    },
                    {
                        columnName: 'belong_specials',
                        dataIndex: 0
                    }
                ]
            },
            listColumnFormatterData() {
                return [this.productionGroupList];
            }
        },
        methods: {
            ...mapActions([
                'add_production_group_products'
            ]),
            checkSelect() {
                    for (var i = 0; i < this.dataList.length; i++) {
                        for (var j = 0; j < this.selectList.length; j++) {
                            if (this.selectList[j].product_id === this.dataList[i].id) {
                                this.dataList[i].is_select = true;
                                break;
                            }
                        }
                    }

            },
            changeRowSelectHandler(index, row) {

            },
            handleClose() {
                this.selectProductionDialog = false;
            },
            addHandler(formName) {
                var result = [];
                var datas = []
                for (var i = 0; i < this.dataList.length; i++) {
                    if (this.dataList[i].is_select) {
                        result.push(this.dataList[i].id);
                        datas.push(this.dataList[i]);
                    }
                }

                if (result.length === 0) {
                    this.$Modal.confirm({
                    title: '提示',
                    content: '请选择至少一个课程！',
                    onOk: () => {}
                });
                }
                else {
                    var vm = this;
                    this.add_production_group_products({
                        id: this.payload, products: result, productData: datas, _fn: function () {
                            vm.handleClose();
                            vm.showPop('保存成功！');
                        }
                    })
                }
            }
        },
        components: {
            'base-input': BaseInput,
            'upload-panel': UploadPanel,
            'text-editor': Editor,
            'data-list': BaseList,
        },
    }

</script>
<style lang="scss" scoped>
/deep/.ivu-btn{
     border-radius: 4px;
        width: 200px !important;
        height: 36px;
        border: 0;
        margin: 30px 0;
}
    #select-production-container {
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
        .body-top {
            padding-bottom: 10px;
        }
    }
</style>
