<template>
  <div class="manage-production-view">
    <screen
      :types="3"
      size-title1="证书总数"
      :size-num1="courseNums1"
      size-title2="已关联"
      :size-num2="courseNums2"
      btn-name="添加证书"
      :select1="selectList"
      :select2="selectList"
      @selectChange1="selectChange1"
      @inputChange="inputChange"
      @handleClick="addOfflineSemesterHandler"
    />
    <Row class="card-houner" >
      <Card
        class="card-houner-col"
        v-for="(item, index) in cardList1"
        :key="index"
      >
        <Col class="card-houner-img" span="11" >
             <img width="100%" height="100px" :src="cardImg1" alt="">
        </Col>
        <Col span="12" class="card-houner-desc" >
             <Row>
                <h1>全科医生临床能力合格证书</h1>
             </Row>
              <Row>
                   <Col span="9">
                       <p>关联产品3</p>
                   </Col>
                   <Col span="2">
                       |
                   </Col>
                    <Col span="12">
                        <p>已颁发17</p>
                    </Col>
              </Row>
              <Row>
                  <Col span="9">
                    <a>取消关联</a>
                  </Col>
                <Col span="5">
                    <a @click="hadleChange()">编辑</a>
                </Col>
                <Col span="5">
                    <a>统计</a>
                </Col>
                <Col span="5">
                  <a @click="sendOfflineCourseHandler()">发证</a>  
                </Col>
              </Row>
        </Col>
      </Card>
        <Card
        class="card-houner-col"
        v-for="(item, index) in cardList2"
        :key="item"
      >
        <Col class="card-houner-img" span="11" >
             <img width="100%" height="100px" :src="cardImg2" alt="">
        </Col>
        <Col span="12" class="card-houner-desc" >
             <Row>
                <h1>医师资格证书</h1>
             </Row>
              <Row>
                   <Col span="9">
                       <p>关联产品0</p>
                   </Col>
                   <Col span="2">
                       |
                   </Col>
                    <Col span="12">
                        <p>已颁发0</p>
                    </Col>
              </Row>
              <Row>
                  <Col span="5">
                    <a>关联</a>
                  </Col>
                <Col span="5">
                    <a @click="hadleChange()">编辑</a>
                </Col>
              </Row>
        </Col>
      </Card>
    </Row>
    <Row class="pager" type="flex" justify="end" align="middle">
      <Page :current="curPage" :page-size="20" @on-change="handleCurrentChange" :total="total"/>
    </Row>
  </div>
</template>
<script>
import Header from "../../components/Header";
import BaseList from "../../components/BaseList";
import BackToTop from "../../components/BackToTop";
import { MPop } from "../../components/MessagePop";
import api from "../../api/modules/config";
import { set_user_student_mrzx } from "../../api/modules/student";
import { send_interview_msg } from "../../api/modules/exam";
import { Dialog } from "../dialogs";
import { ADD_PRODUCTION, EDIT_PROTOCOL } from "../dialogs/types";
import { Config } from "../../config/base";
import { mapState, mapActions, mapGetters } from "vuex";
import { doDateFormat, doTimeFormat, reunitPrice } from "../../components/Util";
import tableHeadData from "./consts";
import screen from "../../components/ScreenFrame";
import * as types from '../dialogs/types';

export default {
  mixins: [Dialog, MPop],
  components: { "header-component": Header, "data-list": BaseList, screen },
  data() {
    return {
      model1: "",
      model2: "",
      loadingInstance: null,
      curPage: 1,
      formInline: {
        searchData: ""
      },
      cityList: "",
      cardList1: [1, 2, 3, 4, 5],
      cardList2: [6, 7, 8, 9, 10],
      selectList: [
        {
          value: "all",
          label: "全部机构"
        },
        {
          value: "zj",
          label: "浙江医院"
        },
        {
          value: "bj",
          label: "北京医院"
        }
      ],
      courseNums1: 12,
      courseNums2: 99,
      cardImg1:"http://dscj-app.oss-cn-qingdao.aliyuncs.com/user_task/20190222115758.jpeg",
      cardImg2:"http://dscj-app.oss-cn-qingdao.aliyuncs.com/user_task/20190222121345.jpeg"
    };
  },
  methods: {
    ...mapActions([
      "get_production_list",
      "change_production_vailid",
      "delete_production",
      "get_production_group_list"
    ]),
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
      console.log("open modal");
    },
    addOfflineSemesterHandler() {
      this.handleSelModal(types.ADD_HOUNER, { type: 1 })
    },
    hadleChange() {
      this.handleSelModal(types.ADD_HOUNER, { type: 2 })
    },
    sendOfflineCourseHandler(index, row) {
        this.handleSelModal(types.SEND_HOUNER, {row: row});
    },
    handleJump() {
      let routeData = this.$router.resolve({
        query: "",
        params: "",
        name: "open-product"
      });
      window.open(routeData.href, "_blank");
    },
    // addProductionHandler() {
    // this.handleSelModal(ADD_PRODUCTION);
    // },
    // addCertificate(){
    //
    // },
    // editHandler(index, row) {
    // this.handleSelModal(ADD_PRODUCTION, row);
    // },
    // editProtocol(index, row) {
    // this.handleSelModal(EDIT_PROTOCOL, row.id);
    // },
    // showCourseDetailHandler(index, row) {
    // this.$router.push({
    // name: "manage-production-curriculum",
    // params: {id: row.id}
    // });
    // },
    // deleteHandler(index, row) {
    // let vm = this;
    // this.$Modal.confirm({
    // title: '提示',
    // content: '是否确认删除该产品?',
    // onOk: () => {
    // this.delete_production({
    // id: row.id,
    // _fn: function () {
    // vm.showPop('删除成功！');
    // }
    // });
    // }
    // });
    // },
    // clearSearch() {
    // this.formInline.searchData = "";
    // this.curPage = 1;
    // var data = this.getData();
    // },
    // search() {
    // this.curPage = 1;
    // var data = this.getData();
    // },
    handleCurrentChange(val) {
      this.curPage = val;
      var data = this.getData();
    }
    // getData() {
    // var data = {
    // project_id: this.projectId,
    // page_index: this.curPage - 1,
    // page_size: 20,
    // title: this.formInline.searchData
    // };
    // this.get_production_list(data);
    // },
    // handleJump(){
    // let routeData = this.$router.resolve({
    // query: '',
    // params: '',
    // name: "open-product",
    // });
    // window.open(routeData.href, "_blank")
    // },
  },
  mounted() {
    // this.getData();
    // this.get_production_group_list({
    // page_index: 0,
    // page_size: 20,
    // state: [0, 1, 2, 3]
    // });
  },
  watch: {
    // isLoading(val) {
    // if (val) {
    // this.loadingInstance = this.$LoadingY({message: "加载中，请稍后", show: true})
    // setTimeout(() => {
    // this.loadingInstance.close()
    // }, Config.base_timeout);
    // } else if (this.loadingInstance) this.loadingInstance.close()
    // }
  },
  computed: {
    ...mapState({
      isLoading: state => state.production.isLoading,
      dataList: state => state.production.production_list,
      total: state => state.production.total,
      projectId: state => state.project.select_project_id,
      productionGroupList: state =>
        state.production_group.production_group_list,
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
      return tableHeadData(this.projectType);
    },
    listColumnFormatter() {
      return [
        {
          columnName: "price",
          doFormat: reunitPrice
        },
        {
          columnName: "original_price",
          doFormat: reunitPrice
        },
        {
          columnName: "belong_specials",
          dataIndex: 0
        }
      ];
    },
    listColumnFormatterData() {
      return [this.productionGroupList];
    }
  }
};
</script>
<style lang="scss" scoped>
.manage-production-view {
  // background: #f0f0f7;
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
      background: #3daaff;
      border: 1px solid #3daaff;
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
  .al-left {
    text-align: left;
  }
  .al-right {
    text-align: right;
  }
  .cad-top-left {
    font-family: PingFangSC-Regular;
    font-size: 14px;
    color: #474c63;
    letter-spacing: 0;
  }
  .cad-top-right {
    width: 50px;
    height: 20px;
    float: right;
    background: #74c818;
    font-family: PingFangSC-Medium;
    font-size: 14px;
    color: #ffffff;
    letter-spacing: 0;
    text-align: center;
    border-radius: 20px;
  }
  .cad-btm-price {
    font-family: PingFangSC-Medium;
    font-size: 16px;
    color: #f54802;
    letter-spacing: 0;
  }
  .cad-btn-relprice {
    font-family: PingFangSC-Regular;
    font-size: 16px;
    color: #474c63;
    letter-spacing: 0;
    text-decoration: line-through;
  }
  .cad-btn-people {
    font-family: PingFangSC-Regular;
    font-size: 14px;
    color: #474c63;
    letter-spacing: 0;
  }
}
.product-title {
  font-family: PingFangSC-Medium;
  font-size: 18px;
  color: #474c63;
  letter-spacing: 0;
  text-align: left;
  margin: 15px 0;
}
.card-houner{
    padding:20px;
    display:flex;
    flex-wrap:wrap;
    .card-houner-col{
    min-width:350px;
    min-height:127px;
    margin:20px;
    max-width:440px;
      .card-houner-img{
        margin-right:15px
      }
      .card-houner-desc{
        text-align:left;line-height:35px;
        h1{
            font-family: PingFangSC-Medium;
            font-size: 16px;
            color: #474C63;
            letter-spacing: 0;

        }
      }
    }

}
</style>
