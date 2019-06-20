<template>
    <div>
        <screen :types="4" :selectType2="true" :select2="select2" :selectType1="true" :btnType="true" btnName="创建合集" sizeTitle1="合集总数" :sizeNum1="sizeNum1"
            @selectChange1="selectChange1" @selectChange2="selectChange2" @handleClick="handleClick" ></screen>
        <form-modal :show-modal='show' :detail-data="tableRow" :form-list="formList" :rule-validate='rules' @from-submit="handleSubmit" @close="closeModal" :title="modalTitle" ></form-modal>
        <div class="content">
            <Card class="intersection" v-for="(item, index) in list" :key="index" @click.native="handleJump">
                <div class="intersection-card">
                    <div class="intersection-card-img"></div>
                    <div class="intersection-card-name">下架</div>
                </div>
                <div class="intersection-content">
                    <div class="intersection-content-title">合集名称全位技能水平名称全位技能水平</div>
                    <div class="intersection-content-course">
                        <div class="intersection-content-course-money"><span>¥0</span> <span>¥0</span></div>
                        <div class="intersection-content-course-num">0人报名</div>
                    </div>
                </div>
            </Card>
        </div>
    </div>
</template>

<script>
    import screen from '../../../components/ScreenFrame'
    import formModal from '../../../components/FormModal'

    export default {
        components: {screen, formModal},
        data() {
            return {
                select2:[
                    {id: 1, title:'1'},
                    {id: 2, title:'2'},
                    {id: 3, title:'3'},
                ],
                sizeNum1: 10,
                list: [1,2,3,4,5,6],
                show: false,
                tableRow: {},
                modalTitle: '创建合集',
                formList: [
                    { type: 'input', name: '产品名称',  field: 'realname'},
                    { type: 'input', name: '所属机构',  field: 'organization' },
                    { type: 'textarea', name: '产品介绍',  field: 'introduce' },
                    { type: 'uploadPanel', name: '展示封面' },
                ],
                rules: {
                    realname: [{ required: true, message: '请输入产品名称', trigger: 'blur' } ],
                    organization: [{ required: true, message: '请输入所属机构', trigger: 'blur' } ],
                    introduce: [{ required: true, message: '请输入产品介绍', trigger: 'blur' } ],
                },
            }
        },
        methods: {
            selectChange1(val) {
                console.log(val);
            },
            selectChange2(val) {
                console.log(val);
            },
            inputChange(val) {
                console.log(val);
            },
            handleClick() {
                this.show = true
            },
            handleSubmit(val) {
                console.log(val);
            },
            closeModal() {
                this.show = false
            },
            handleJump() {
                this.$router.push('/product/intersection-detail')
            }
        }
    }
</script>

<style scoped lang="less">
    /deep/ .ivu-card-body{
        padding: 0;
    }
    .content{
        display: flex;
        flex-wrap: wrap;
    }
    .intersection{
        width: 320px;
        height: 273px;
        margin: 15px;

        .intersection-card{
            height: 180px;
            width: 320px;
            position: relative;

            .intersection-card-img{
                height: 180px;
                width: 320px;
                background-color: #f00;
            }

            .intersection-card-name{
                position: absolute;
                right: 10px;
                top: 10px;
                color: #fff;
                width: 50px;
                height: 20px;
                background: #888CA3;
                border-radius: 14.5px;
            }
        }

        .intersection-content{
            margin-top: 15px;

            .intersection-content-title{
                font-family: PingFangSC-Medium;
                font-size: 18px;
                color: #474C63;
                letter-spacing: 0.19px;
                line-height: 26px;
                text-align: start;
                margin: 0 14px;
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }

            .intersection-content-course{
                display: flex;
                justify-content: space-between;
                margin: 16px 14px 0 14px;

                .intersection-content-course-money{
                    font-family: PingFangSC-Medium;
                    font-size: 16px;
                    letter-spacing: 0.17px;
                }

                .intersection-content-course-num{
                    font-family: PingFangSC-Medium;
                    font-size: 14px;
                    color: #686F92;
                    letter-spacing: 0.15px;
                }
            }
        }
    }
    /deep/ .md-cloud-upload{
        margin-top: 100px !important;
    }
</style>