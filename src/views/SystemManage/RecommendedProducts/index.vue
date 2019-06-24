<template>
    <div>
        <form-modal :show-modal="show" :detail-data="tableRow" @from-submit="handleSubmit" :form-list="formList"
                    @close="closeModal" :title="modalTitle" :rule-validate="rules"
                    btnName="确认" @change-list="changeList"/>
        <screen :types="10" title="首页推荐产品" btnType btnName="添加产品" @handleClick="handleClick"
                style="background:#ffffff"/>
        <div class="hint">提示：首页最少展示1个产品，最多展示3个产品</div>
        <div class="recommended-content">
            <div class="content">
                <div v-for="(item, index) in dataList" :key="index" class="product">
                    <img v-if="item.img_url ? true : JSON.parse(item.url_arr).default.length" class="product-img"
                         :src="item.img_url ? item.img_url : JSON.parse(item.url_arr).default[0]" alt="">
                    <video v-else :src="JSON.parse(item.url_arr).video" class="product-img"></video>
                    <div class="product-content">
                        <div class="product-content-title">{{item.title}}</div>
                        <div style="position: relative">
                            <Input v-model="item.front_description ? item.front_description: item.short_description" type="textarea" class="product-content-input"
                                   placeholder="请输入产品介绍" :maxlength="100" @on-change="changeContent"/>
                            <div class="font-num">{{item.front_description.length}}/100</div>
                        </div>
                        <div class="product-content-tab">
                            <img :src="upImg" alt="" @click="handleUp(index)">
                            <img :src="downImg" alt="" @click="handleDown(index)">
                            <img :src="deleteImg" alt="" @click="handleDelete(index)">
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="isShow" class="btn">
            <Button type="primary" ghost @click="cancel">取消</Button>
            <Button type="primary" @click="save">保存</Button>
        </div>
    </div>
</template>

<script>
    import screen from '../../../components/ScreenFrame'
    import formModal from '../../../components/FormModal'
    import postData from '../../../api/postData'
    import upImg from '../../../assets/icons/img/up.png'
    import downImg from '../../../assets/icons/img/down.png'
    import deleteImg from '../../../assets/icons/img/delete.png'

    export default {
        components: {screen, formModal},
        data() {
            return {
                show: false,
                tableRow: {},
                modalTitle: '',
                formList: [
                    {
                        type: 'select',
                        name: '所属机构',
                        field: 'company',
                        selectList: [{id: 1, title: '1'}],
                        selectField: ['id', 'title'],
                        selectChange: true
                    },
                    {
                        type: 'select',
                        name: '产品名称',
                        field: 'productIndex',
                        selectList: [{index: 1, title: ''}],
                        selectField: ['index', 'title']
                    },
                ],
                rules: {
                    company: [{required: true, message: '请输入所属机构'}],
                    productIndex: [{required: true, message: '请输入产品名称'}],
                },
                dataList: [],
                isShow: false,
                isLoad: false,
                upImg, downImg, deleteImg
            }
        },
        watch: {
            dataList(val) {
                if (this.isLoad) this.isShow = true
            }
        },
        methods: {
            handleClick() {
                this.show = true
                this.modalTitle = '添加产品'
            },
            handleSubmit(val) {
                if (val.productIndex == 0 || val.productIndex) {
                    if (this.formList[1].selectList[val.productIndex].type == "collection") {
                        postData('product/collection/get_detail', {collection_id: this.formList[1].selectList[val.productIndex].id}).then(res => {
                            if (res.res_code == 1) {
                                if (this.dataList.length == 3) this.$Message.info('首页最多展示3个产品，请先删除再添加')
                                else this.dataList.push(res.data[0])
                            }
                        })
                    } else {
                        postData('product/product/get_detail', {product_id: this.formList[1].selectList[val.productIndex].id}).then(res => {
                            if (res.res_code == 1) {
                                if (this.dataList.length == 3) this.$Message.info('首页最多展示3个产品，请先删除再添加')
                                else this.dataList.push(res.data[0])
                            }
                        })
                    }
                }
            },
            changeContent() {
                this.isShow = true
            },
            closeModal() {
                this.show = false
                this.formList[1].selectList = [{index: 1, title: ''}]
            },
            changeList(val) {
                postData('components/getProductsCollection', {organization_id: val}).then(res => {
                    if (res.res_code == 1) {
                        res.data.forEach((item, index) => {
                            item.index = index
                        })
                        this.formList[1].selectList = res.data
                    } else this.$Message.info(res.msg)
                })
            },
            initData() {
                postData('product/product/get_recommend_list').then(res => {
                    if (res.res_code == 1) {
                        this.dataList = res.data
                    }
                }).then(() => {
                    this.isLoad = true
                })
            },
            handleUp(index) {
                if (index == 0) this.$Message.info('无法上移')
                else this.dataList[index] = this.dataList.splice(index - 1, 1, this.dataList[index])[0]
            },
            handleDown(index) {
                if (index == this.dataList.length - 1) this.$Message.info('无法下移')
                else this.dataList[index] = this.dataList.splice(index + 1, 1, this.dataList[index])[0]
            },
            handleDelete(index) {
                this.dataList.splice(index, 1)
            },
            cancel() {
                this.isShow = false
                this.isLoad = false
                this.initData()
            },
            save() {
                if (this.dataList.length == 0) this.$Message.info('请至少添加一个推荐产品')
                else {
                    let rep = true
                    this.dataList.forEach((item, index) => {
                        this.dataList.forEach((item1, index1) => {
                            if ((index != index1) && (item.id == item1.id)) {
                                rep = false
                            }
                        })
                    })
                    if (rep) {
                        postData('product/product/recomment_change', {data: this.dataList}).then(res => {
                            if (res.res_code == 1) {
                                this.isShow = false
                                this.$Message.success('保存成功')
                            }
                        })
                    } else this.$Message.info('不能重复添加同一个产品')
                }
            }
        },
        mounted() {
            postData('components/getOrganization').then(res => {
                this.formList[0].selectList = res.data
            })
            this.initData()
        }
    }
</script>

<style scoped lang="less">
    .recommended-content {
        height: calc(100% - 200px);
        overflow: hidden;
        overflow-y: auto;
        position: absolute;
        width: 100%;
    }

    .hint {
        height: 40px;
        line-height: 40px;
        background: #FCF6E5;
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: #F54802;
        letter-spacing: 0;
        text-align: center;
    }

    .content {
        position: relative;
        height: auto;
        margin-top: 20px;
        min-width: 930px;
    }

    .product {
        height: 200px;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;

        .product-img {
            width: 288px;
            height: 162px;
        }

        .product-content {
            margin-left: 30px;
            text-align: left;

            .product-content-title {
                font-family: PingFangSC-Medium;
                font-size: 18px;
                color: #333333;
                letter-spacing: 0;
                line-height: 24px;
            }

            .product-content-input {
                height: 90px;
                width: 600px;
                margin-top: 15px;

                /deep/ .ivu-input {
                    height: 90px;
                }
            }

            .product-content-tab {
                margin-top: 18px;
                text-align: right;

                img {
                    margin-left: 20px;
                }
            }
        }
    }

    .btn {
        width: 100%;
        display: flex;
        justify-content: center;
        position: absolute;
        bottom: 20px;

        /deep/ .ivu-btn {
            width: 150px;
            margin-left: 20px;
        }
    }

    .font-num {
        display: inline-block;
        position: absolute;
        top: 77px;
        right: 18px;
    }
</style>
