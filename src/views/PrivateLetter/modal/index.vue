<template>
    <Modal v-model="show" :title="title" :mask-closable="false" :footer-hide="true" @on-cancel="cancelModal" :width="modalWidth" :styles="{top: state == 1 ? '10%' : '2%'}">
        <div v-if="creat">
            <Input v-model="inputData" v-show="state == 1" class="input-textarea" type="textarea" placeholder="请输入私信内容"/>
            <div v-show="state == 2">
                <screen :types="14" :selectType1="true" :selectType2="true" :valueSelect2="valueSelect2" :placehodle="placehodle" :select2Placeholder="select2Placeholder" :select2="select2"
                        @inputChange="inputChange" @selectChange1="selectChange1" @selectChange2="selectChange2"/>
                <Row style="height: 650px;">
                    <Col :span="14">
                        <tables :column="columns1" :table-data="list" :select-index="selectIndex" :tabel-height="tableHeight" @select-tables="selectTable" @on-select-all="selectAllTable"/>
                        <page-list :current="current" :total="total" :page-size="pageSize" @page-list="pageList"/>
                    </Col>
                    <Col :span="10" style="height: 619px;border: 1px solid #f0f0f7;">
                        <div class="select-student">已选学员</div>
                        <div v-if="selectList.length == 0" class="none-student">暂未选择学员</div>
                        <div v-else style="height: 560px;">
                            <div style="height: 480px; overflow-y: auto">
                                <div class="change-student" v-for="(item, index) in changeList">
                                    <div class="change-name">{{item.realname}}</div>
                                    <div class="change-num">{{item.username}}</div>
                                    <img class="change-img" @click="deletStudent(item, index)" :src="deleteImg" alt="">
                                </div>
                            </div>
                            <div style="height: 88px;border-bottom:1px solid #f0f0f7;display: flex;align-items: center;justify-content: center">
                                <Button type="primary" @click="submit">发送</Button>
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>
            <Button v-if="state == 1 " class="btn" type="primary" @click="handleSubmit">下一步</Button>
        </div>
        <div v-if="!creat && personMessage.content">
            <div class="message">{{personMessage.content}}</div>
            <div class="message-num">收信学员（{{personMessage.students.length}}人）:</div>
            <div class="message-box">
                <div v-for="item in personMessage.students" class="message-info">
                    <img class="info-img" :src="item.head_img_url" alt="">
                    <div class="info-name">{{item.realname}}</div>
                </div>
            </div>
        </div>
    </Modal>
</template>

<script>
    import screen from '../../../components/ScreenFrame'
    import tables from '../../../components/tables'
    import pageList from '../../../components/Page'
    import pageMixins from '../../mixins/pageMixins'
    import deleteImg from '../../../assets/icons/img/deleteData.png'
    import postData from '../../../api/postData';

    export default {
        components: {screen, tables, pageList},
        mixins: [pageMixins],
        data() {
            return {
                show: false,
                placehodle: '搜索学员姓名/账号',
                select2Placeholder: '选择产品',
                select2: [],
                valueSelect2: [],
                columns1: [
                    {type: 'selection'},
                    {title: '姓名', key: 'realname', width: 120},
                    {title: '用户ID', key: 'username', width: 220}
                ],
                list: [],
                tableHeight: 530,
                selectList: [{}],
                changeList: [],
                selectIndex: null,
                organization_id: '',
                product_id: '',
                keyword: '',
                inputData: '',
                deleteImg
            }
        },
        props: {
            isShow: {
                type: Boolean,
                default: false
            },
            title: {
                type: String,
                default: ''
            },
            state: {
                type: Number,
                default: 1
            },
            creat: {
                type: Boolean,
                default: true
            },
            message: {
                type: String
            },
            modalWidth: {
                type: Number,
                default: 600
            },
            personMessage: {
                type: Object,
            },
        },
        watch: {
            isShow(val) {
                this.show = val
            }
        },
        methods: {
            cancelModal(val) {
                this.$emit('handle-close')
            },
            handleSubmit() {
                this.$emit('handle-submit', this.state)
            },
            selectChange1(val) {
                this.organization_id = val
                this.initData()
                this.getProducts()
            },
            selectChange2(val) {
                this.product_id = val
                this.initData()
            },
            inputChange(val) {
                this.keyword = val
                this.initData()
            },
            initData() {
                let data = {
                    page_size: this.pageSize,
                    page_num: this.current,
                    organization_id: this.organization_id,
                    product_id: this.product_id,
                    keyword: this.keyword
                }
                postData('pmsg/getStudents', data).then(res => {
                    if(res.res_code == 1) {
                        this.total = res.data.count
                        res.data.list.forEach((item, index) => {
                            item.index = index
                        })
                        this.list = res.data.list
                    }
                })
            },
            selectTable(selection, row) {
                this.changeList = selection
            },
            selectAllTable(selection, row) {
                this.changeList = selection
            },
            deletStudent(item, index) {
                this.changeList.splice(index, 1)
                this.selectIndex = item.index
            },
            getProducts() {
                postData('components/getProducts', {organization_id: this.organization_id}).then(res => {
                    this.select2 = res.data
                })
            },
            submit() {
                let data = {
                    content: this.inputData,
                    student_ids: []
                }
                this.changeList.forEach(item => {
                    data.student_ids.push(item.id)
                })
                postData('pmsg/addPMsg', data).then(res => {
                    if(res.res_code == 1) {
                        this.show = false
                        this.$Message.success(res.msg)
                        this.inputData = ''
                        this.changeList = []
                        this.$emit('submit')
                    }else this.$Message.info(res.msg)
                })
            }
        },
        mounted() {
            this.pageSize = 10
            this.initData()
        }
    }
</script>

<style scoped lang="less">
    .input-textarea{
        resize: none;
        padding: 10px;
        margin: 18px;
        width: calc(100% - 32px);

        /deep/ textarea.ivu-input{
            height: 400px;
            padding: 10px;
        }
    }
    /deep/ .ivu-btn{
        width: 150px;
        height: 38px;
    }
    .message{
        font-family: PingFangSC-Regular;
        font-size: 18px;
        color: #474C63;
        letter-spacing: 0.22px;
        padding: 30px;
    }
    .message-num{
        font-family: PingFangSC-Regular;
        font-size: 18px;
        color: #474C63;
        letter-spacing: 0.22px;
    }
    .message-box{
        display: flex;
        margin-top: 20px;
    }
    .message-info{
        text-align: center;
        margin-right: 15px;

        .info-img{
            width: 50px;
            height: 50px;
        }
        .info-name{
            font-family: PingFangSC-Regular;
            font-size: 16px;
            color: #474C63;
            letter-spacing: 0.19px;
        }
    }
    .btn{
        margin: 20px auto;
    }
    /deep/ .ivu-page{
        height: 89px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin: 0 !important;
        border-right: 1px solid #F0F0F7;
        border-bottom: 1px solid #F0F0F7;
    }
    .select-student{
        height: 50px;
        display: flex;
        align-items: center;
        justify-content: center;
        border-bottom: 1px solid #F0F0F7;
        font-family: PingFangSC-Medium;
        font-size: 16px;
        color: #474C63;
    }
    .none-student{
        height: calc(100% - 50px);
        display: flex;
        align-items: center;
        justify-content: center;
        font-family: PingFangSC-Regular;
        font-size: 16px;
        color: #9397AD;
        border: 1px solid #F0F0F7;
    }
    .change-student{
        display: flex;
        align-items: center;
        height: 48px;
        border-bottom: 1px solid #f0f0f7;
        justify-content: space-around;

        &:hover{
            .change-img{
                opacity: 1;
            }
        }
    }
    .change-name{
        width: 120px;
        text-align: center;
        overflow: hidden;
        text-overflow: ellipsis;
        font-family: PingFangSC-Regular;
        font-size: 16px;
        color: #474C63;
        letter-spacing: 0;
    }
    .change-num{
        width: 120px;
        text-align: center;
        overflow: hidden;
        text-overflow: ellipsis;
        font-family: PingFangSC-Regular;
        font-size: 16px;
        color: #474C63;
        letter-spacing: 0;
    }
    .change-img{
        width: 17.5px;
        height: 17.5px;
        opacity: 0;
        cursor: pointer;
    }
</style>
