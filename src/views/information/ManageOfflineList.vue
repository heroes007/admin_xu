<template>
    <div class="content">
        <Card class="card" @click.native="handleTabAdd">
            <img class="card-img" src="../../../static/icon/addIcon.png" alt="">
            <div class="card-add">添加主题</div>
        </Card>
        <Card class="card" v-for="(item ,index) in dataList" :key="index">
            <div class="card-row">
                <div class="card-title-state">开课中</div>
                <div class="card-title-num">已开课<span style="color: #4098FF;margin: 0 5px;">4</span>期</div>
            </div>
            <div class="mt14">
                <div class="card-content-title">这是一个线下课主题名称XXXXXXXXXXX</div>
                <div class="card-content-details">
                    以提升基层全科医师临床能力为目的，通过对医共体全科医生进行理论、临床实践技能的培训，进一步提高全科医生的临床实践能力水平，培养一支能看病的全科医生团队
                </div>
            </div>
            <div class="card-row mt20">
                <div class="card-end-time">创建时间：{{time}}</div>
                <Button class="card-end-btn r0" type="text" ghost @click="handleEdit(item)">编辑</Button>
                <Button class="card-end-btn r48" type="text" ghost @click="handleAdd(item)">添加</Button>
            </div>
        </Card>

        <form-modal :detail-data="tableRow" :show-modal='show' :form-list="formList" @close="closeModal" :title="modalTitle" :rule-validate="rules" @handleSubmit="handleSubmit"/>
    </div>
</template>

<script>
  import formModal from '../../components/FormModal'

  export default {
    name: "ManageOfflineList",
    data() {
      return {
        dataList: [1, 2, 3, 4, 5],
        time: '2019/01/02',
        tableRow: {},
        formList: [
          { type: 'input', name: '主题名称',  field: 'realname'},
          { type: 'textarea', name: '主题描述',  field: 'introduce' }
        ],
        modalTitle: '',
        rules:{
          realname: [{ required: true, message: '请输入主题名称', trigger: 'blur' } ],
          introduce: [{ required: true, message: '请输入主题描述', trigger: 'blur' } ]
        },
        show: false
      }
    },
    components: {formModal},
    methods: {
      handleTabAdd() {
        this.show = true
      },
      handleEdit(item) {
        this.$router.push('open-product/offline-course')
      },
      handleAdd(item) {
        this.show = true
      },
      handleSubmit() {

      },
      closeModal() {
        this.show = false
      }
    }
  }
</script>

<style scoped lang="scss">
    .content {
        display: flex;
        flex-wrap: wrap;
        padding: 15px;
        justify-content: center;

        .card {
            width: 440px;
            height: 230px;
            margin-right: 10px;
            margin-bottom: 10px;

            .card-img {
                margin-top: 32px;
            }

            .card-add {
                margin-top: 25px;
                font-family: PingFangSC-Regular;
                font-size: 18px;
                color: #4098FF;
                letter-spacing: 1.2px;
            }
        }

        /deep/ .ivu-btn-text {
            color: #4098ff;
        }

        .card-row {
            display: flex;
            align-items: center;

            .card-title-state {
                width: 60px;
                height: 20px;
                background: #74C818;
                border-radius: 100px;
                color: #fff;
                text-align: center;
            }

            .card-title-num {
                margin-left: 20px;
                font-family: PingFangSC-Regular;
                font-size: 16px;
                color: #474C63;
                letter-spacing: 0;
                text-align: justify;
            }

            .card-end-time {
                font-family: PingFangSC-Regular;
                font-size: 14px;
                color: #686F92;
                letter-spacing: 0;
            }

            .card-end-btn {
                position: absolute;
                font-family: PingFangSC-Medium;
                font-size: 14px !important;
                color: #4098FF;
                letter-spacing: 0;
            }

            .r0 {
                right: 0;
            }

            .r48 {
                right: 48px;
            }
        }

        .mt14 {
            margin-top: 14px;

            .card-content-title {
                font-family: PingFangSC-Medium;
                font-size: 20px;
                color: #474C63;
                letter-spacing: 0;
                text-align: justify;
            }

            .card-content-details {
                font-family: PingFangSC-Regular;
                font-size: 14px;
                color: #686F92;
                letter-spacing: 0;
                text-align: justify;
                line-height: 22px;
                margin-top: 10px;
            }
        }
    }

    .mt20 {
        margin-top: 20px;
    }
</style>
