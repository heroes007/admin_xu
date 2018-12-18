<template>
    <div class='manage-app'>
        <header-component title='平台更新' :noSelect="noSelect"></header-component>
        <data-list class='data-list light-header' @edit='editPlatform' :table-data='dataList' :column-formatter='listColumnFormatter'
            :column-formatter-data='listColumnFormatterData' :header-data='dataHeader'></data-list>
    </div>
</template>
<script>
    import Header from '../../components/Header'
    import BaseList from '../../components/BaseList'
    import {
        mapActions,
        mapState
    } from 'vuex'
    import {
        Loading
    } from 'element-ui';
    import {
        Dialog
    } from '../dialogs/index';
    import {
        MANAGE_PLATFORM
    } from '../dialogs/types'
    export default {
        mixins: [Dialog],
        data() {
            return {
                noSelect: true,
                loadingInstance: null
            }
        },
        mounted() {
            this.getPlatformList();
        },
        computed: {
            dataHeader() {
                return [{
                    prop: 'id',
                    label: '序号',
                    width: 80
                }, {
                    prop: 'version',
                    label: '名称',
                    width: 100
                }, {
                    prop: 'platform_type',
                    label: '平台',
                    width: 130
                }, {
                    prop: 'download_url',
                    label: '地址',
                    isLink: true
                }, {
                    prop: 'state',
                    label: '状态',
                    width: 80
                }, {
                    label: '操作',
                    width: 350,
                    groupBtn: [{
                        text: '修改',
                        param: 'edit'
                    }]
                }]
            },
            listColumnFormatter() {
                return [{
                    columnName: 'state',
                    dataIndex: 0,
                    dataProp: 'id',
                    dataValue: 'name'
                }]
            },
            listColumnFormatterData() {
                return [
                    [{
                        id: 1,
                        name: '正常'
                    },{
                        id: 2,
                        name: '失效'
                    }]
                ];
            },
            isLoading() {
                return this.$store.state.platform_update.showMainLoading;
            },
            ...mapState({
                dataList: state => state.platform_update.platforms
            })
        },
        methods: {
            ...mapActions([
                'getPlatformList'
            ]),
            editPlatform(index, row) {
                this.handleSelModal(MANAGE_PLATFORM, row);
            }
        },
        watch: {
            isLoading(val) {
                if (val) {
                    this.loadingInstance = Loading.service({
                        text:'加载中，请稍后',
                        fullscreen: true
                    });
                } else {
                    this.loadingInstance.close();
                }
            },
        },
        components: {
            'header-component': Header,
            'data-list': BaseList
        }
    }
</script>
<style lang="scss">

</style>