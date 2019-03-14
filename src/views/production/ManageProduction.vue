<template>
    <div class='manage-production-view'>
        <screen :types="4" size-title1="管理总数" :size-num1="courseNums" btn-name="添加管理" :select1="selectList" :select2="selectList"
                @selectChange1="selectChange1"  @selectChange2="selectChange2" @inputChange="inputChange" @handleClick="handleClick"/>
        <Row style="padding-top:20px;display:flex;flex-wrap:wrap;">
             <Card @click.native="handleJump" style="min-width:350px;min-height:127px;margin:20px;" v-for="(item, index) in cardList" :key="index">
                  <Row>
                    <Col span="2" class="al-left cad-top-left" >
                     <p>ID:</p>
                    </Col>
                    <Col span="9" class="al-left cad-top-left" >
                      <p>2109981</p>
                    </Col>
                    <Col span="13" class="al-right" >
                        <div class="cad-top-right">上架</div>
                    </Col>
                  </Row>
                  <Row>
                    <h2 class="product-title">浙江医院全科医生临床能力提升计划</h2>
                  </Row>
                  <Row>
                     <Col span="4" class="al-left cad-btm-price">¥1980</Col>
                     <Col span="4" class="al-left cad-btn-relprice">¥2298</Col>
                     <Col span="16" class="al-right cad-btn-people">171人报名</Col>
                  </Row>
             </Card>
        </Row>
        <!--<Row class='pager' type='flex' justify='end' align='middle'>-->
          <!--<Page :current="curPage" :page-size='20' @on-change="handleCurrentChange" :total="total"/>-->
        <!--</Row>-->
    </div>
</template>

<script>
  import Header from "../../components/Header";
  import BaseList from "../../components/BaseList";
  import BackToTop from "../../components/BackToTop";
  import {MPop} from "../../components/MessagePop";
  import api from "../../api/modules/config";
  import {set_user_student_mrzx} from "../../api/modules/student";
  import {send_interview_msg} from "../../api/modules/exam";
  import {Dialog} from "../dialogs";
  import {ADD_PRODUCTION, EDIT_PROTOCOL} from "../dialogs/types";
  import {Config} from "../../config/base";
  import {mapState, mapActions, mapGetters} from "vuex";
  import {doDateFormat, doTimeFormat, reunitPrice} from "../../components/Util";
  import tableHeadData from './consts'
  import screen from '../../components/ScreenFrame'
  import postData from '../../api/postData'

  export default {
    mixins: [Dialog, MPop],
    components: {"header-component": Header, "data-list": BaseList, screen},
    data() {
      return {
        model1: '',
        model2: '',
        loadingInstance: null,
        curPage: 1,
        formInline: {
          searchData: ""
        },
        cityList:"",
        cardList: [1,2,3,4,5],
        selectList:[
          {
            id:'all',
            name:'全部机构'
          },
          {
            id:'zj',
            name:'浙江医院'
          },
          {
            id:'bj',
            name:'北京医院'
          },
        ],
        courseNums:12
      };
    },
    methods: {
      ...mapActions(["get_production_list", "change_production_vailid", "delete_production", "get_production_group_list"]),
      selectChange1(val){
        console.log(val)
      },
      selectChange2(val){
        console.log(val)
      },
      inputChange(val){
        console.log(val)
      },
      handleClick(){
        console.log('open modal')
      },
      handleJump(){
        let routeData = this.$router.resolve({
          query: '',
          params: '',
          name: "open-product",
        });
        window.open(routeData.href, "_blank")
      },
      // addProductionHandler() {
      //   this.handleSelModal(ADD_PRODUCTION);
      // },
      // addCertificate(){
      //
      // },
      // editHandler(index, row) {
      //   this.handleSelModal(ADD_PRODUCTION, row);
      // },
      // editProtocol(index, row) {
      //   this.handleSelModal(EDIT_PROTOCOL, row.id);
      // },
      // showCourseDetailHandler(index, row) {
      //   this.$router.push({
      //     name: "manage-production-curriculum",
      //     params: {id: row.id}
      //   });
      // },
      // deleteHandler(index, row) {
      //   let vm = this;
      //   this.$Modal.confirm({
      //     title: '提示',
      //     content: '是否确认删除该产品?',
      //     onOk: () => {
      //       this.delete_production({
      //         id: row.id,
      //         _fn: function () {
      //           vm.showPop('删除成功！');
      //         }
      //       });
      //     }
      //   });
      // },
      // clearSearch() {
      //   this.formInline.searchData = "";
      //   this.curPage = 1;
      //   var data = this.getData();
      // },
      // search() {
      //   this.curPage = 1;
      //   var data = this.getData();
      // },
      handleCurrentChange(val) {
        this.curPage = val;
        var data = this.getData();
      },
      // getData() {
      //   var data = {
      //     project_id: this.projectId,
      //     page_index: this.curPage - 1,
      //     page_size: 20,
      //     title: this.formInline.searchData
      //   };
      //   this.get_production_list(data);
      // },
      // handleJump(){
      //   let routeData = this.$router.resolve({
      //     query: '',
      //     params: '',
      //     name: "open-product",
      //   });
      //   window.open(routeData.href, "_blank")
      // },
    },
    mounted() {
      // this.getData();
      // this.get_production_group_list({
      //   page_index: 0,
      //   page_size: 20,
      //   state: [0, 1, 2, 3]
      // });
    },
    watch: {
      // isLoading(val) {
      //   if (val) {
      //     this.loadingInstance = this.$LoadingY({message: "加载中，请稍后", show: true})
      //     setTimeout(() => {
      //       this.loadingInstance.close()
      //     }, Config.base_timeout);
      //   } else if (this.loadingInstance) this.loadingInstance.close()
      // }
    },
    computed: {
      ...mapState({
        isLoading: state => state.production.isLoading,
        dataList: state => state.production.production_list,
        total: state => state.production.total,
        projectId: state => state.project.select_project_id,
        productionGroupList: state => state.production_group.production_group_list,
        stateList: state => state.production.stateList
      }),
      ...mapGetters({
        projectType: "select_project_type"
      }),
      comboDataList() {
        var r = [];
        for (var i = 0; i < this.dataList.length; i++) {
          r.push(this.dataList[i].state);
        }
        return r;
      },
      columnComboData() {
        return [this.stateList];
      },
      dataHeader() {
        return tableHeadData(this.projectType)
      },
      listColumnFormatter() {
        return [{
          columnName: "price",
          doFormat: reunitPrice
        }, {
          columnName: "original_price",
          doFormat: reunitPrice
        }, {
          columnName: "belong_specials",
          dataIndex: 0
        }];
      },
      listColumnFormatterData() {
        return [this.productionGroupList];
      }
    }
  };
</script>
<style lang="scss" scoped>
    .manage-production-view {
      background: #f0f0f7;
      min-height: 1200px;
        .base-list-container {
            .base-list-row {
                height: 60px;
            }
        }

        .find-by-term {
            padding-top: 22px;
            text-align: left;
            margin-left: 20px;

            /deep/ .ivu-input {
                width: 200px;
            }

            button {
                background: #3DAAFF;
                border: 1px solid #3DAAFF;
                border-radius: 4px;
                width: 100px;
                height: 36px;
            }
        }

        .data-container {
            background-color: #ffffff;
            margin: 0 20px 20px;

            .list {
                .data-header {
                    height: 50px;

                    .Col {
                        line-height: 50px;
                    }
                }

                .data-item {
                    height: 40px;
                    border-top: 1px solid #cecece;

                    &.bg-gray {
                        background-color: #fbfbfb;
                    }

                    .Col {
                        line-height: 40px;

                        p {
                            margin: 0;
                            display: -webkit-box;
                            white-space: normal;
                            -webkit-box-orient: vertical;
                            overflow: hidden;
                            -webkit-line-clamp: 1;
                        }
                    }
                }

                .pager {
                    margin: 30px 0;
                    padding-right: 40px;
                }
            }
        }
        .al-left{
          text-align: left;
        }
        .al-right{
          text-align: right;
        }
        .cad-top-left{
          font-family: PingFangSC-Regular;
          font-size: 14px;
          color: #474C63;
          letter-spacing: 0;
        }
        .cad-top-right{
          width: 50px;
          height: 20px;
          float: right;
          background: #74C818;
          font-family: PingFangSC-Medium;
          font-size: 14px;
          color: #FFFFFF;
          letter-spacing: 0;
          text-align: center;
          border-radius: 20px;
        }
        .cad-btm-price{
          font-family: PingFangSC-Medium;
          font-size: 16px;
          color: #F54802;
          letter-spacing: 0;
        }
        .cad-btn-relprice{
          font-family: PingFangSC-Regular;
          font-size: 16px;
          color: #474C63;
          letter-spacing: 0;
          text-decoration: line-through;
        }
        .cad-btn-people{
          font-family: PingFangSC-Regular;
          font-size: 14px;
          color: #474C63;
          letter-spacing: 0;
        }
    }
    .product-title{
        font-family: PingFangSC-Medium;
        font-size: 18px;
        color: #474C63;
        letter-spacing: 0;
        text-align: left;
        margin:15px 0
    }
</style>
