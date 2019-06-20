<template>
    <div>
        <Modal v-model="show" :mask-closable="false" :footer-hide="true" title="添加培训" @on-cancel="handleClose" width="740">
            <screen :types="14" :selectType2="true" :select2="select2" :selectType1="true"></screen>
            <tables :column="columns1" :table-data="list" :isSelection="true" :tabelHeight="438"></tables>
            <page-list :current="current" :total="total" :page-size="pageSize" @page-list="pageList"/>
        </Modal>
    </div>
</template>

<script>
    import screen from '../../../../../components/ScreenFrame'
    import tables from '../../../../../components/tables'
    import pageList from  '../../../../../components/Page'
    import pageMixin from '../../../../mixins/pageMixins'
    import postData from '../../../../../api/postData'

    export default {
        components: {screen, tables, pageList},
        mixins: [pageMixin],
        data() {
            return {
                show:false,
                select2: [
                    {id: 1, title: 1},
                    {id: 2, title: 2}
                ],
                columns1: [
                    {
                        title: '产品名称',
                        key: 'productName',
                        align: 'left',
                        minWidth: 200
                    },
                    {
                        title: '分类',
                        key: 'classify',
                        align: 'left',
                        minWidth: 200
                    },
                    {
                        title: '状态',
                        key: 'state',
                        align: 'left',
                        minWidth: 100
                    },
                    {
                        title: '售价',
                        key: 'price',
                        align: 'left',
                        minWidth: 100
                    }
                ],
                list: [
                    {productName: '产品1', classify: '分类1', state: '1', price: '100'},
                    {productName: '产品1', classify: '分类1', state: '1', price: '100'},
                    {productName: '产品1', classify: '分类1', state: '1', price: '100'},
                    {productName: '产品1', classify: '分类1', state: '1', price: '100'},
                    {productName: '产品1', classify: '分类1', state: '1', price: '100'},
                    {productName: '产品1', classify: '分类1', state: '1', price: '100'},
                    {productName: '产品1', classify: '分类1', state: '1', price: '100'},
                    {productName: '产品1', classify: '分类1', state: '1', price: '100'},
                ]
            }
        },
        props: {
            isShow: {
                type: Boolean,
                default: false
            }
        },
        watch: {
            isShow(val) {
                this.show = val
            }
        },
        methods: {
            handleClose() {
                this.$emit('handleClose')
            },
            getList() {
                let data = {
                    organization_id: '',
                    category_id: '',
                    add_state: '',
                    search: '',
                    page_num: '',
                    page_size: ''
                }
                postData('/product/collection/getProductByCollection', data).then(res => {
                    console.log(res, 'res')
                })
            }
        }
    }
</script>

<style scoped lang="less">
    .screen{
        min-width: unset;
    }
    /deep/ .input{
        width: 300px !important;
    }
</style>