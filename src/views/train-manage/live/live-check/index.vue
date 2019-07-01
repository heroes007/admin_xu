<template>
    <div>
        <screen :types="18" title="直播课名称" btn-name="创建直播" btn-name2="微吼直播" :btnType="true" @handleBack="handleBack" @handleClick="handleClick"/>
<!--        <form-modal  :detail-data="tableRow" @from-submit="saveHomework" :show-modal='show' :form-list="formList"-->
<!--                     @close="closeModal" :title="modalTitle" :rule-validate="rules" @change-list="changeList" uploadBtn />-->
        <tables :tabel-height="tableHeight" :column="columns1" :table-data="list" :is-serial=true></tables>
        <page-list :current="current" :total="total" :page-size="pageSize" @page-list="pageList"/>
    </div>
</template>

<script>
    import screen from '../../../../components/ScreenFrame'
    import tables from '../../../../components/tables'
    import pageList from '../../../../components/Page'
    import pageMixin from '../../../mixins/pageMixins'
    import formModal from '../../../../components/FormModal'

    export default {
        components: {screen, tables, pageList, formModal},
        mixins:  [pageMixin],
        data() {
            return {
                columns1: [
                    {
                        title: '名称',
                        key: 'title',
                        minWidth: 180,
                    },
                    {
                        title: '状态',
                        key: 'state',
                        minWidth: 80,
                    },
                    {
                        title: '直播时常',
                        key: 'duration',
                        minWidth: 100,
                    },
                    {
                        title: '上课时间',
                        key: 'class_time',
                        minWidth: 120,
                    },
                    {
                        title: '累计在线',
                        key: 'num',
                        minWidth: 100,
                    },
                    {
                        title: '操作',
                        minWidth: 300,
                        slot: 'operation',
                        // operation_btn_hide: true,
                        operation: [['直播间','operation1',true], ['编辑','operation2'], ['上移 ','operation3'], ['下移 ','operation4'], ['删除','operation5']],
                    },
                ],
                list: [
                    {title: '标题', state: '预告', duration: '50分钟', class_time: '2019/01/01', num: '23人'},
                ],
                tableHeight: null,
                tableRow: {},
                show: false,
                formList: [
                    {type: 'input', name: '名称', field: 'title', double: true},
                    {type: 'textarea', name: '介绍', field: 'interaction', double: true, maxlength:  100},
                    {type: 'switch-datetimerange',  name: '上课时间'},


                ]
            }
        },
        methods: {
            handleBack() {
                this.$router.go(-1)
            },
            handleClick() {
                this.show = true
            }
        },
        mounted() {
            this.tableHeight = window.innerHeight - 130
        }
    }
</script>

<style scoped>

</style>