<template>
    <div class='manage-production-view'>
        <screen :types="10" selectType2 :select2="selectList2" btnType @selectChange2="selectChange2" title="行业资讯"
                btnName="创建文章" @handleClick="addNewsHandler" style="background:#ffffff"/>
        <FormModal @from-submit="fromSubmit" :detail-data="tableRow" :show-modal='show' :form-list="formList"
                   @close="closeModal" :title="modalTitle" :modalWidth="modalWidth" :panelOptions="panelOptions"
                   :upload-btn="false" :rule-validate="rules" :handleFloor="handleFloor" @handle-next="handleNext"
                   @handle-last="handleLast" @showContent="showContent" @editor-change="editChange"></FormModal>
        <Tables :tabel-height="tabelHeight" :is-serial="pageDataCount" @operation1="lowerShelf" @operation2="edit"
                @operation3="deletes" :column="columns1" :table-data="list"/>
        <page-list :current="current" :total="total" :page-size="pageSize" @page-list="pageList"/>
    </div>
</template>
<script>
    import Tables from '../../../components/tables.vue'
    import screen from '../../../components/ScreenFrame'
    import FormModal from '../../../components/FormModal'
    import pageList from '../../../components/Page'
    import pageMixin from '../../mixins/pageMixins.js'
    import postData from '../../../api/postData'

    export default {
        mixins: [pageMixin],
        components: {screen, FormModal, pageList, Tables},
        data() {
            return {
                tableRow: {},
                selectList2: [{id: '', title: '全部'}, {id: '1', title: '上架'}, {id: '-1', title: '下架'}, {
                    id: '0',
                    title: '测试'
                }],
                columns1: [
                    {
                        key: 'title',
                        title: '新闻标题',
                        align: 'left',
                        minWidth: 200
                    },
                    {
                        key: 'click_count',
                        title: '浏览量',
                        minWidth: 100
                    },
                    {
                        key: 'state_name',
                        title: '状态',
                        minWidth: 100
                    },
                    {
                        key: 'create_time',
                        title: '发布时间',
                        minWidth: 100
                    },
                    {
                        key: 'realname',
                        title: '发布人',
                        minWidth: 100
                    },
                    {
                        title: '操作',
                        minWidth: 260,
                        slot: 'operation',
                        operation_state: true,
                        operation: [['编辑', 'operation2'], ['删除', 'operation3']]
                    }],
                list: [],
                show: false,
                state: null,
                formList: [
                    {type: 'input', name: '文章标题', field: 'title', isShow: 1},
                    {
                        type: 'select',
                        name: '状态',
                        field: 'state',
                        disable: false,
                        clas: 'manage-news-state',
                        isShow: 1,
                        selectList: [{state: 1, title: '上架'}, {state: 0, title: '测试'}, {state: -1, title: '下架'}],
                        selectField: ['state', 'title']
                    },
                    {type: 'textarea', name: '文章摘要', field: 'description', isShow: 1, maxlength: 100},
                    {type: 'uploadPanel', name: '上传封面', field: 'img_default', isShow: 1},
                    // {type: 'editors', name: '编辑器', field: 'editors'},
                    {type: 'upload',  field: 'uploading', isShow: 2, showAll: 0},
                ],
                modalTitle: '创建文章',
                tabelHeight: null,
                rules: {
                    title: [{required: true, message: '请输入文章标题', trigger: 'blur'}],
                    description: [{required: true, message: '请输入文章摘要'}],
                    state: [{required: true, message: '请选择产品状态'}],
                    uploading: [],
                },
                isAdd: true,
                handleFloor: 1,
                modalWidth: 760,
                panelOptions: {
                    panelWidth: 580,
                    panelHeight: 310
                }
            }
        },
        beforeDestroy() {
            this.list = null;
            this.addNewsHandler = null;
            this.fromSubmit = null;
            this.setLowerShelf = null;
            this.edit = null;
            this.deletes = null;
            this.getList = null;
        },
        methods: {
            addNewsHandler() {
                this.tableRow = {}
                this.isAdd = true
                this.modalTitle = '创建文章'
                this.show = true
            },
            fromSubmit(v) {
                if (this.isAdd) {
                    postData('platform/news/addNews', {
                        title: v.title,
                        description: v.description,
                        content: v.uploading,
                        state: v.state,
                        img_url: v.img_default
                    }).then(res => {
                        if (res.res_code == 1) {
                            this.$Message.success(res.msg)
                            this.getList()
                        }
                    })
                } else {
                    postData('platform/news/modifyNews', {
                        title: v.title,
                        description: v.description,
                        content: v.uploading,
                        state: v.state,
                        id: v.id,
                        img_url: v.img_default
                    }).then(res => {
                        if (res.res_code == 1) {
                            this.$Message.success(res.msg)
                            this.getList()
                        }
                    })
                }
            },
            lowerShelf(row, rowIndex) {
                this.setLowerShelf(row, rowIndex, -row.state)
            },
            setLowerShelf(row, rowIndex, type) {
                postData('/platform/news/modifyNews', {id: row.id, state: type}).then((res) => {
                    if (res.res_code == 1) this.getList()
                })
            },
            edit(row, rowIndex) {
                this.isAdd = false
                this.modalTitle = '编辑文章'
                this.tableRow = row
                this.tableRow.img_default = row.img_url
                this.tableRow.uploading = row.content
                this.show = true
            },
            selectChange2(val) {
                this.state = val
                this.getList()
            },
            deletes(row, rowIndex) {
                this.$config.deleteModal(() => {
                    postData('/platform/news/removeNews', {id: row.id}).then((res) => {
                        if (res.res_code == 1) this.getList()
                    })
                });
            },
            getList() {
                let d1 = (this.state != null && this.state != '') ? +this.state : null
                let d = {
                    page_size: this.pageSize,
                    page_num: this.current,
                    state: d1
                }
                postData('/platform/news/getNewsListAdmin', d).then((res) => {
                    this.list = res.data.list
                    this.list.map((t) => {
                        t.state_name = t.state == 1 ? '上架' : t.state == -1 ? '下架' : '测试'
                    })
                    this.total = res.data.count
                })
            },
            setShow() {
                this.formList.forEach(item => {
                    item.isShow == 1 ? item.isShow = 2 : item.isShow = 1
                })
            },
            handleNext() {
                this.isShow()
                this.setShow()
                this.handleFloor = 2
            },
            isShow() {
                this.$nextTick(() => {
                    if(document.querySelector('.w-e-text').clientHeight < 500) {
                        this.formList[4].showAll = 0
                    }else if(document.querySelector('.w-e-text').clientHeight > 500 && this.formList[4].showAll == 0){
                        this.formList[4].showAll = 2
                    }
                })
            },
            handleLast() {
                this.setShow()
                this.handleFloor = 1
            },
            closeModal() {
                if(this.formList[0].isShow == 2) this.setShow()
                this.handleFloor = 1
                this.show = false
            },
            showContent(val) {
                this.formList[4].showAll = val == 1 ? 2 : 1
            },
            editChange() {
                this.isShow()
            }
        },
        mounted() {
            this.getList()
            this.tabelHeight = window.innerHeight - 130
        }
    }
</script>
<style lang="less" scoped>
    .manage-production-view {
        position: relative;
        height: 100%;
    }

    .ivu-page {
        position: absolute;
        left: 0;
        right: 0;
        bottom: 0;
        margin: 0 auto;
    }

    /deep/ .manage-news-state {
        /deep/ .ivu-form-item-label {
            letter-spacing: 9px !important;
        }
    }
    /deep/ .w-e-text-container{
        height: 700px !important;
    }
    /deep/ .w-e-text{
        overflow: hidden;
        overflow-y: unset;
        height: auto !important;
        min-height: 100%;
    }
    /deep/ .md-cloud-upload {
        margin-top: 100px !important;
    }
</style>
