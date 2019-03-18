<template>
    <div class="manage-production-view">
        <screen :types="3" size-title1="证书总数" :size-num1="courseNums1" size-title2="已关联" :size-num2="courseNums2" btn-name="添加证书" :select1="selectList"
                :select2="selectList" @selectChange1="selectChange1" @inputChange="inputChange" @handleClick="addOfflineSemesterHandler" btnType/>
        <div class="card-houner">
            <Card class="card-houner-col" v-for="(item, index) in cardList1" :key="index">
                <div class="card-houner-img">
                    <img class="houner-image" :src="cardImg1" alt="">
                    <div class="houner-image-title" v-if="item == 2">已关联</div>
                </div>
                <div class="card-houner-desc">
                    <Row class="houner-row-title">
                        <div class="houner-title">{{item.name}}</div>
                    </Row>
                    <Row class="houner-row-content">
                        <div>关联产品 3 <span style="margin: 0 4px;">|</span> 已颁发 17</div>
                    </Row>
                    <Row class="houner-row-btn" style="display: flex;">
                        <div><a v-if="item == 2">取消关联</a><a href="" v-else>关联</a></div>
                        <div class="ml10"><a @click="hadleChange()">编辑</a></div>
                        <div v-if="item == 2" class="ml10"><a>统计</a></div>
                        <div v-if="item == 2" class="ml10"><a @click="sendOfflineCourseHandler()">发证</a></div>
                    </Row>
                </div>
            </Card>
        </div>
        <div v-if="isHouner">
          暂无证书
        </div>
        <!--<Row class="pager" type="flex" justify="end" align="middle">-->
            <!--<Page :current="curPage" :page-size="20" @on-change="handleCurrentChange" :total="total"/>-->
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
  import {send_interview_msg,get_houner_list} from "../../api/modules/exam";
  import {Dialog} from "../dialogs";
  import {ADD_PRODUCTION, EDIT_PROTOCOL} from "../dialogs/types";
  import {Config} from "../../config/base";
  import {mapState, mapActions, mapGetters} from "vuex";
  import {doDateFormat, doTimeFormat, reunitPrice} from "../../components/Util";
  import tableHeadData from "./consts";
  import screen from "../../components/ScreenFrame";
  import * as types from '../dialogs/types';

  export default {
    mixins: [Dialog, MPop],
    components: {"header-component": Header, "data-list": BaseList, screen},
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
        cardList1: {},
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
        cardImg1: "http://dscj-app.oss-cn-qingdao.aliyuncs.com/user_task/20190222115758.jpeg",
        cardImg2: "http://dscj-app.oss-cn-qingdao.aliyuncs.com/user_task/20190222121345.jpeg",
        isHouner:false
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
        this.handleSelModal(types.ADD_HOUNER, {type: 1})
      },
      hadleChange() {
        this.handleSelModal(types.ADD_HOUNER, {type: 2})
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
        get_houner_list().then(res=>{ 
          if (res.data.res_code == 1) {
            if (res.data.data.length == 0) {
                this.isHouner = true
            }else{
                this.cardList1 = res.data.data
            }
          }
          // console.log(res);
        })
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
    .card-houner{
        display: flex;
        flex-wrap: wrap;
        /*justify-content: space-around;*/
        padding: 20px;
    }
    .card-houner-col{
        width: 442px;
        height: 130px;
        margin: 15px 5px 0 5px;
        display: flex;
    }

    .houner-title{
        font-family: PingFangSC-Medium;
        font-size: 20px;
        color: #474C63;
        letter-spacing: 0;
        width: 100%;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        text-align: left;
    }
    .ml10{
        margin-left: 10px;
    }

    .houner-image{
        width: 160px;
        height: 100px;
    }
    .card-houner-img{
        overflow: hidden;
        position: relative;
    }
    .houner-image-title{
        position: absolute;
        top: 12px;
        background: #2EBF07;
        color: #fff;
        transform: rotate(45deg);
        width: 100px;
        right: -30px;
    }
    .card-houner-desc{
        margin-left: 10px;
        width: 60%;
    }
    .houner-row-content{
        margin-top: 10px;
        font-family: PingFangSC-Regular;
        font-size: 16px;
        color: #686F92;
        letter-spacing: 0;
        text-align: left;
    }
    .houner-row-btn{
        margin-top: 14px;
        font-family: PingFangSC-Regular;
        font-size: 16px;
        color: #4098FF;
        letter-spacing: 0;
    }
    /deep/ .ivu-card-body{
        padding: 15px;
        width: 100%;
        display: flex;
    }
</style>
