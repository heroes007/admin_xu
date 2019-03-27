<template>
    <div :style="`height: ${windowHight}px`" class="box">
        <div class="content">
            <Card v-if="btnType" class="card" @click.native="handleTabAdd">
                <img class="card-img" src="../../../assets/icons/icon/addIcon.png" alt="">
                <div class="card-add">添加主题</div>
            </Card>
            <Card class="card" v-for="(t ,index) in list" :key="index">
                <div class="card-row">
                    <div class="card-title-state">开课中</div>
                    <div class="card-title-num">已开课<span style="color: #4098FF;margin: 0 5px;">{{t.term_num}}</span>期</div>
                </div>
                <div class="mt14">
                    <div class="card-content-title">{{t.title}}</div>
                    <div class="card-content-details">
                        {{t.description}}
                    </div>
                </div>
                <div class="card-row mt20">
                    <div class="card-end-time">创建时间：{{t.create_time}}</div>
                    <Button v-if="btnType" class="card-end-btn r0"  type="text" ghost @click="handleEdit(t)">编辑</Button>
                    <Button class="card-end-btn"  :class="btnType ? 'r48' : 'r0'" type="text" ghost @click="handleSee(t)">查看</Button>
                    <Button v-if="btnType" class="card-end-btn r58" type="text" ghost @click="handleDelete(t)">删除</Button>
                </div>
        </Card>
        </div>
        <form-modal :detail-data="tableRow" :show-modal='show' :form-list="formList" :detailData="detailData" @close="closeModal" :title="modalTitle" :rule-validate="rules" @from-submit="handleSubmit"/>
    </div>
</template>

<script>
  import formModal from '../../../components/FormModal'
  import postData from '../../../api/postData'
  import postMixins from '../../mixins/postMixins.js'
  import setAuthMixins from '../setAuthMixins'

  export default {
    name: "ManageOfflineList",
    mixins: [postMixins, setAuthMixins],
    data() {
      return {
        list: [],
        tableRow: {},
        formList: [
          { type: 'input', name: '主题名称',  field: 'title'},
          { type: 'textarea', name: '主题描述',  field: 'description' }
        ],
        modalTitle: '',
        rules:{
          title: [{ required: true, message: '请输入主题名称', trigger: 'blur' } ],
          description: [{ required: true, message: '请输入主题描述', trigger: 'blur' } ]
        },
        show: false,
        detailData:{},
        product_id: JSON.parse(localStorage.getItem('PRODUCTINFO')).id,
        windowHight:'',
        role: JSON.parse(localStorage.getItem('PERSONALDETAILS')).role_id
      }
    },
    components: {formModal},
    methods: {
      handleTabAdd() {
        this.modalTitle = '添加主题'
        this.show = true
      },
      handleEdit(item) {
        this.modalTitle = '编辑主题'
        this.detailData = {
          subject_id: item.id,
          title: item.title,
          description: item.description
        }
        this.show = true
      },
      handleSee(item) {
        this.$router.push('open-product/offline-course')
        localStorage.setItem('OffLineClassTheme',JSON.stringify(item))
      },
      handleSubmit(v) {
           let d = { ...v , product_id: this.product_id}
         if(this.modalTitle === '添加主题') this.fromAddAndEdit('/product/curriculum_offline_subject/add',d)
         else this.fromAddAndEdit('/product/curriculum_offline_subject/change',v)
      },
      closeModal() {
        this.detailData = {}
        this.show = false
      },
      getList(){
          let d = {
              product_id: this.product_id
          }
          postData('product/curriculum_offline/subject_get_list',d).then((res) => {
              this.list = res.data;
          })
      },
      handleDelete(t){
          postData('/product/curriculum_offline_subject/delete',{subject_id: t.id}).then((res) => {
            if(res.res_code == 1){
              this.getList()
            }
          })
      }
    },
    mounted() {
       this.getList()
       this.windowHight = window.innerHeight - 60
    },
  }
</script>

<style scoped lang="scss">
    /deep/ .card-content-details{
        height: 65px;
        overflow:hidden;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 3;
        text-overflow:ellipsis;
    }
    .content {
        display: flex;
        flex-wrap: wrap;
        padding: 15px;
        height: 100%;
        overflow-y: auto;
        align-content: start;
        /*justify-content: center;*/

        .card {
            width: 440px;
            height: 230px;
            margin-right: 10px;
            margin-bottom: 10px;

            .card-img {
                margin-top: 32px;
            }

            .card-add {
                margin: 25px auto 0 auto;
                font-family: PingFangSC-Regular;
                font-size: 18px;
                color: #4098FF;
                letter-spacing: 1.2px;
                cursor: pointer;
                width: 140px;
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
                right: 98px;
            }
            .r58 {
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
                overflow:hidden;
                word-break:keep-all;
                white-space:nowrap;
                text-overflow:ellipsis;
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
    .box{
        overflow: hidden;
        overflow-y: auto;
    }
</style>
