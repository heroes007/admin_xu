<template>
    <Modal v-model="showModal" :title="'预约学员（'+total+'）'" :width="960" @on-cancel="closeModal" :mask-closable=false
           :footer-hide="true" :styles="{top: '6%'}">
        <div class="title-bg grey-medium1">{{details.title}}</div>
        <Tables class="tables" :is-serial="pageDataCount" :column="columns1" :table-data="list" :tabel-height="tabelHeight"></Tables>
    </Modal>
</template>

<script>
    import Tables from '../../../components/tables'
    import postData from '../../../api/postData'
    export default {
        components: {Tables},
        props: {
            show: {
                type: Boolean,
                default: false
            },
            details: {
                type: Object,
                default: {}
            }
        },
        data() {
            return {
                showModal: false,
                list:[],
                pageDataCount: {},
                total: '',
                tabelHeight: 480,
                columns1:[
                    {
                        title: '用户ID',
                        key: 'id',
                        minWidth: 100
                    },
                    {
                        title: '真实姓名',
                        key: 'realname',
                        minWidth: 100
                    },
                    {
                        title:'性别',
                        key:'sex',
                        minWidth: 100
                    },
                    {
                        title:'学科',
                        key:'department_name',
                        minWidth: 100
                    },
                    {
                        title:'年级',
                        key:'grade_name',
                        minWidth: 100
                    },
                    {
                        title:'预约时间',
                        key:'reserve_time',
                        minWidth: 200
                    }
                ],
            }
        },
        watch: {
            show(_new) {
                this.showModal = _new
                if(_new) {
                    this.getList()
                }
            }
        },
        methods: {
            closeModal() {
                this.showModal = false
                this.$emit('close-modal')
                this.formList = [this.clearItem]
            },
            getList() {
                var data = {
                    product_id: JSON.parse(sessionStorage.getItem('PRODUCTINFO')).id,
                    term_id: this.details.id
                }
                postData('/product/curriculum_offline/subject_reserve_student_get_list', data).then(res => {
                    res.data.data.forEach(item => {
                        item.sex = item.sex == 1 ? '男' : '女'
                    })
                    this.total = res.data.count
                    this.list = res.data.data
                })
            }
        }
    }
</script>
<style lang="less" scoped>
    /deep/ .ivu-modal-header-inner{
        font-family: PingFangSC-Medium;
    }
    /deep/ .ivu-modal-header{
        border: none;
    }
    /deep/ .ivu-modal-body{
        padding: 0;
        padding-bottom: 20px;
        img{
            margin-left: 25px;
            padding-top: 14px;
        }
    }
    .title-bg{
        background: #F7F7F7;
        height: 48px;
        width: 100%;
        padding-left: 20px;
        line-height: 48px;
    }
    /deep/ .ivu-table:before, /deep/ .ivu-table:after{
        display: none;
    }
    /deep/ .ivu-table-wrapper{
        border: none
    }
    /deep/ .ivu-modal-content{
        padding: 10px 30px;
    }
    /deep/ .ivu-table:after{
        display: none;
    }
    /deep/ .ivu-table:before{
        display: none;
    }
    /deep/ .ivu-table-wrapper{
        border: none;
    }
    .tables{
        margin-top: 20px;
    }
</style>
