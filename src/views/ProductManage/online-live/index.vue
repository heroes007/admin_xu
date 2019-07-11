<template>
    <div style="height: 100%;">
        <div class="box">
            <div v-if="!dataList.length" class="hint-none">暂无内容</div>
            <Row :gutter="20">
                <Col :span="8" v-for="(item, index) in dataList" :key="index" style="padding: 0 10px;margin-bottom: 20px;">
                    <Card class="card">
<!--                        <Icon type="md-close" class="card-icon" @click="deleteLive(item)"/>-->
                        <div class="card-type">
                            <div class="card-type-name">{{item.state == -1 ? '下架' : item.state == 0 ? '未上架' : item.state == 1 ? '测试' : item.state == 2 ? '上架' : item.state == 3 ? '推荐' : '删除'}}</div>
                            <div class="card-type-num">共{{item.catalog_num}}节课 | 已播<span style="color: #4098ff;">{{item.catalog_finish_num}}</span>节</div>
                        </div>
                        <div class="card-title">{{item.title}}</div>
                        <div class="card-content">{{item.short_description}}</div>
                        <div class="card-message">
                            <div v-if="item.model == 2 || item.model == 3" class="card-message-price">
                                <span style="color: #F54802">¥{{item.price}}</span><span style="color: #686F92;margin-left: 10px;">¥{{item.original_price}}</span>
                            </div>
                            <div v-if="item.model == 1" class="card-message-product">
                                产品：<div style="color: #4098ff;cursor: pointer;overflow: hidden;text-overflow: ellipsis;white-space: nowrap">
                                <span v-for="(item1, index1) in item.products" :key="index1">{{index1 > 0 ? '、' : ''}}{{item1.product_title}}</span>
                            </div>
                            </div>
                        </div>
                        <div class="card-handle">
                            <div class="card-handle-left">
                                <span class="card-handle-left" v-if="item.model == 2 || item.model == 3" style="margin-right: 20px;">
                                    <img style="width: 16px;" class="card-handle-img" src="../../../assets/img/live_num.png" alt="">
                                    <span>{{item.student_num}}人报名</span>
                                </span>
                                <span class="card-handle-left" v-if="item.model == 1 || item.model == 3">
                                    <img class="card-handle-img" src="../../../assets/img/live_editor.jpg" alt="">
                                    <span>{{item.product_num}}个关联</span>
                                </span>
                            </div>
                            <div class="card-handle-right">
                                <span style="cursor: pointer" @click="check(item)">查看</span>
                                <span style="margin-left: 15px; cursor: pointer" @click="editor(item)">编辑</span>
                                <span style="margin-left: 15px; cursor: pointer" @click="deleteLive(item)">删除</span>
                            </div>
                        </div>
                    </Card>
                </Col>
            </Row>
        </div>
        <page-list v-if="dataList.length" :current="current" :total="total" :page-size="pageSize" @page-list="pageList"/>
    </div>
</template>

<script>
    import pageList from '../../../components/Page'
    import pageMixin from '../../mixins/pageMixins'
    import postData from '../../../api/postData'

    export default {
        components: {pageList},
        mixins: [pageMixin],
        data() {
            return {
                boxHeight: null,
                dataList: []
            }
        },
        methods: {
            check(val) {
                this.$router.push({path: '/dashboard/live-check', query: {id: val.live_id, organization_id: val.organization_id, title: val.title}})
            },
            deleteLive(val) {
                this.$Modal.confirm({
                    title: '提示',
                    content: '<p>确认删除该直播课</p>',
                    onOk: () => {
                        postData('live/deleteLiveByProduct', {live_id: val.live_id, product_id: JSON.parse(sessionStorage.getItem('PRODUCTINFO')).id}).then(res => {
                            if(res.res_code == 1) {
                                this.$Message.success(res.msg)
                                this.getList()
                            }
                        })
                    },
                });
            },
            getList() {
                let data = {
                    page_size: this.pageSize,
                    page_num: this.current,
                    product_id: JSON.parse(sessionStorage.getItem('PRODUCTINFO')).id,
                    search: '',
                    state: ''
                }
                postData('live/getLivesByProduct', data).then(res => {
                    if(res.res_code == 1) {
                        this.dataList = res.data.data
                        this.total = res.data.count
                    }
                })
            }
        },
        mounted() {
            this.boxHeight = window.innerHeight - 130
            this.getList()
        }
    }
</script>

<style scoped lang="less">
    .box{
        padding: 20px;
        height: calc(100% - 62px);
        overflow: hidden;
        overflow-y: auto;
    }
    .card{
        height: 247px;
        text-align: left;

        .card-icon{
            width: 24px;
            height: 24px;
            position: absolute;
            right: 6px;
            top: 10px;
            cursor: pointer;
            display: none;
        }

        &:hover{
            .card-icon{
                display: inline-block;
            }
        }

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
            height: 50px;
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
    .hint-none{
        height: 100%;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 16px
    }
</style>