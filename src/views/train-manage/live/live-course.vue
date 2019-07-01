<template>
    <div class="manage-production-view">
        <screen :types="4" :selectType2="true" :select2="select2" @selectChange2="selectChange2" :btnType="true" @handleClick="handleClick" btnName="新建课程"
            :placehodle="select2Placeholder" sizeTitle1="课程总数" :sizeNum1="sizeNum1"></screen>
        <form-modal :show-modal='show' :detail-data="tableRow" :form-list="formList" :rule-validate='rules' @from-submit="handleSubmit" @close="closeModal"
                    :title="modalTitle" @change-list="changeList" :handleFloor="handleFloor" @multiple-change="multipleChange" @handle-next="handleNext"
                    @handle-last="handleLast" @showContent="showContent" :modal-false="true" @modal-close="modalClose"></form-modal>
        <div class="box">
            <Row :gutter="20">
                <Col :span="8" v-for="(item, index) in dataList" :key="index" style="padding: 0 10px;margin-bottom: 20px;">
                    <Card class="card">
                        <div class="card-type">
                            <div class="card-type-name">测试</div>
                            <div class="card-type-num">共3节课 | 已播<span style="color: #4098ff;">0</span>节</div>
                        </div>
                        <div class="card-title">直播课名称直播课名称直播课名称直播</div>
                        <div class="card-content">课程描述课程描述课程描述课程描述课程描述课程描述课程描述课程描述课程描述课程描。</div>
                        <div class="card-message">
                            <div v-if="index%2" class="card-message-price">
                                <span style="color: #F54802">¥12000</span><span style="color: #686F92;margin-left: 10px;">¥13400</span>
                            </div>
                            <div v-else class="card-message-product">
                                产品：<div style="color: #4098ff;cursor: pointer;overflow: hidden;text-overflow: ellipsis;white-space: nowrap">全科医生岗位技能水平提升全科医生岗位技能水平提升全科医生岗位技能水平提升</div>
                            </div>
                        </div>
                        <div class="card-handle">
                            <div class="card-handle-left">
                                <img style="width: 16px;" class="card-handle-img" src="../../../assets/img/live_num.png" alt="">
                                <span>12人报名</span>
                                <img style="margin-left: 20px;" class="card-handle-img" src="../../../assets/img/live_editor.jpg" alt="">
                                <span>1个关联</span>
                            </div>
                            <div class="card-handle-right">
                                <span style="cursor: pointer" @click="check">查看</span><span style="margin-left: 15px; cursor: pointer" @click="editor">编辑</span>
                            </div>
                        </div>
                    </Card>
                </Col>
            </Row>
        </div>
        <page-list :current="current" :total="total" :page-size="pageSize" @page-list="pageList"/>
    </div>
</template>

<script>
    import screen from '../../../components/ScreenFrame'
    import pageList from '../../../components/Page'
    import pageMixin from '../../mixins/pageMixins'
    import formModal from '../../../components/FormModal'

    export default {
        components: {screen, pageList, formModal},
        mixins: [pageMixin],
        data() {
            return {
                select2: [
                    {id: 'all', title: '全部'},
                    {id: 1, title: 11},
                    {id: 2, title: 22}
                ],
                select2Placeholder: '搜索课程名称',
                sizeNum1: 10,
                dataList: [{},{},{},{},{},{},{},{}],
                show: false,
                tableRow: {},
                formList: [
                    {type: 'input', name: '名称', field: 'title', double: true, isShow: 1},
                    {type: 'select', name: '机构', field: 'organization', double: true,
                        selectList: [{id: 1, title: '机构1'}], selectField: ['id', 'title'], isShow: 1},
                    {type: 'select', name: '销售形式', field: 'pattern', selectChange: true, clas: 'local-left',
                        selectList: [{id: 1, title: '产品销售'},{id: 2, title: '单品销售'},{id: 3, title: '双重销售'}], selectField: ['id', 'title'], isShow: 1},
                    {type: 'select', name: '状态', field: 'state', double: true, clas: 'local-right',
                        selectList: [{id: 1, title: '状态1'}], selectField: ['id', 'title'], isShow: 1},
                    {type: 'input-number', name: '原价', field: 'price', double: true, class: 'local-left', isShow: 1},
                    {type: 'input-number', name: '实际原价', field: 'real_price', class: 'local-right', isShow: 1},
                    {type: 'multiple', name: '绑定产品', field: 'product', isShow: 1,
                        selectList: [{id: 1, title: '产品1产品1产品1产品1产品1产品1产品1'},{id: 2, title: '产品2产品2产品2产品2产品2产品2产品2产品2'},{id: 3, title: '产品3产品3产品3产品3产品3产品3产品3产品3产品3产品3产品3'}], selectField: ['id', 'title']},
                    {type: 'textarea', name: '介绍', field: 'introduce', maxlength: 100, double: true, isShow: 1},
                    {type: 'uploadBtn', name: '封面', field: 'img_url', double: true, isShow: 1},
                    {type: 'upload',  field: 'uploading', isShow: 2, showAll: 0}
                ],
                rules: {
                    title: [{ required: true, message: '请输入产品名称', trigger: 'blur' }],
                    organization: [{ required: true, message: '请选择产品机构' }],
                    pattern: [{ required: true, message: '请选择产品模式' }],
                    state: [{ required: true, message: '请选择产品状态' }],
                    product: [{ required: true, message: '请选择培训产品' }],
                    price: [{ required: true, message: '请选择产品原价' }],
                    real_price: [{ required: true, message: '请选择产品原价' }],
                    introduce: [{ required: true, message: '请输入产品介绍', trigger: 'blur'  }],
                },
                modalTitle: '',
                handleFloor: 1
            }
        },
        methods: {
            selectChange2(val) {
                console.log(va);
            },
            handleClick() {
                this.modalTitle = '新建课程'
                this.show = true
            },
            handleSubmit(val) {
                console.log(val);
                this.show = false
            },
            changeList(val) {
                switch (val) {
                    case 1:
                        this.formList[4].type = ''
                        this.formList[5].type = ''
                        this.formList[6].type = 'select'
                        this.handleFloor = 0
                        break
                    case 2:
                        this.formList[4].type = 'input-number'
                        this.formList[5].type = 'input-number'
                        this.formList[6].type = ''
                        this.handleFloor = 1
                        break
                    case 3:
                        this.formList[4].type = 'input-number'
                        this.formList[5].type = 'input-number'
                        this.formList[6].type = 'select'
                        this.handleFloor = 1
                        break
                }
            },
            multipleChange(val) {
                console.log(val);
            },
            setShow() {
                this.formList.forEach(item => {
                    item.isShow == 1 ? item.isShow = 2 : item.isShow = 1
                })
            },
            isShow() {
                this.$nextTick(() => {
                    if(document.querySelector('.w-e-text').clientHeight < 500) {
                        this.formList[9].showAll = 0
                    }else if(document.querySelector('.w-e-text').clientHeight > 500 && this.formList[9].showAll == 0){
                        this.formList[9].showAll = 2
                    }
                })
            },
            handleNext() {
                this.isShow()
                this.setShow()
                this.handleFloor = 2
            },
            handleLast() {
                this.setShow()
                this.handleFloor = 1
            },
            showContent(val) {
                this.formList[9].showAll = val == 1 ? 2 : 1
            },
            closeModal() {
                // if(this.formList[0].isShow == 2) this.setShow()
                // this.handleFloor = 1
                // this.show = false
                // console.log(this.handleFloor)
            },
            modalClose() {
                if(this.formList[0].isShow == 2) this.setShow()
                this.handleFloor = 1
                this.show = false
            },
            editor() {
                this.show = true
            },
            check() {
                this.$router.push('live-check')
            }
        }
    }
</script>

<style scoped lang="less">
    .manage-production-view{
        background-color: #f0f0f7;
        height: 100%;
    }
    .box{
        padding: 20px;
        height: calc(100% - 120px);
        overflow: hidden;
        /*overflow-y: auto;*/
    }
    .card{
        height: 247px;
        text-align: left;

        .card-type{
            display: flex;

            .card-type-name{
                border-radius: 20px;
                background-color:#4098ff;
                color: #fff;
                width: 50px;
                line-height: 22px;
                height: 22px;
                text-align: center;
            }

            .card-type-num{
                margin-left: 20px;
                font-family: PingFangSC-Regular;
                font-size: 16px;
                color: #686F92;
                letter-spacing: 0.25px;
            }
        }

        .card-title{
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            font-family: PingFangSC-Medium;
            font-size: 20px;
            color: #474C63;
            letter-spacing: 0;
            margin-top: 20px;
        }
        .card-content{
            font-family: PingFangSC-Regular;
            font-size: 14px;
            color: #686F92;
            letter-spacing: 1px;
            line-height: 25px;
            text-overflow: -o-ellipsis-lastline;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            line-clamp: 2;
            -webkit-box-orient: vertical;
            margin-top: 10px;
        }
        .card-message{
            margin-top: 20px;

            .card-message-price{
                font-family: PingFangSC-Medium;
                font-size: 16px;
                letter-spacing: 0.17px;
            }
            .card-message-product{
                display: flex;
                font-family: PingFangSC-Regular;
                font-size: 14px;
                color: #686F92;
                letter-spacing: 0.22px;
                line-height: 20px;
                white-space: nowrap;
            }
        }
        .card-handle{
            display: flex;
            margin-top: 15px;
            justify-content: space-between;

            .card-handle-left{
                font-family: PingFangSC-Medium;
                font-size: 14px;
                color: #686F92;
                letter-spacing: 0.15px;
                display: flex;
                align-items: center;

                .card-handle-img{
                    height: 15px;
                    width: 15px;
                    margin-right: 7px;
                }
            }

            .card-handle-right{
                font-family: PingFangSC-Medium;
                font-size: 14px;
                color: #4098FF;
                letter-spacing: 0;
            }
        }
    }
</style>