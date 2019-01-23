<template>
    <div class='manage-production-view'>
        <header-component title='产品管理' :type='0' :showAdd='true' addText='新建产品' @addClick='addProductionHandler'></header-component>
        <Row>
            <Form :inline="true" :model="formInline" class="find-by-term">
                <FormItem label="产品名称" :label-width="80">
                   <Input v-model="formInline.searchData" placeholder="请输入搜索内容"></Input>
                </FormItem>
                <FormItem>
                    <Button type="primary" @click="search">查询</Button>
                </FormItem>
                <FormItem>
                    <Button type="primary" @click="clearSearch">清除</Button>
                </FormItem>
            </Form>
        </Row>
        <data-list class='data-list light-header' @editProtocol = 'editProtocol' @edit='editHandler'
            @detail='showCourseDetailHandler' @delete='deleteHandler'
            :table-data='dataList' :header-data='dataHeader' :column-formatter='listColumnFormatter'
            :column-formatter-data='listColumnFormatterData'
            :comboIsSelect='true' :columnComboData='columnComboData' :comboModelList='comboDataList'>
        </data-list>
        <Row class='pager' type='flex' justify='end' align='middle'>
            <Page :current="curPage" :page-size='20' @on-change="handleCurrentChange" :total="total" />
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
import tableHeadData from './consts'
export default {
  mixins: [Dialog, MPop],
  components: { "header-component": Header, "data-list": BaseList },
  data() {
    return {
      loadingInstance: null,
      curPage: 1,
      formInline: {
        searchData: ""
      }
    };
  },
  methods: {
    ...mapActions([ "get_production_list", "change_production_vailid", "delete_production", "get_production_group_list" ]),
    addProductionHandler() {
      this.handleSelModal(ADD_PRODUCTION);
    },
    editHandler(index, row) {
      this.handleSelModal(ADD_PRODUCTION, row);
    },
    editProtocol(index, row) {
      this.handleSelModal(EDIT_PROTOCOL, row.id);
    },
    showCourseDetailHandler(index, row) {
      this.$router.push({
        name: "manage-production-curriculum",
        params: { id: row.id }
      });
    },
    deleteHandler(index, row) {
      this.$Modal.confirm({
          title: '提示',
          content: '是否确认删除该产品?',
          onOk: () => {
           this.delete_production({
            id: row.id,
            _fn: function() {
             vm.showPop('删除成功！');
            }
           });
          }
      });
    },
    clearSearch() {
      this.formInline.searchData = "";
      this.curPage = 1;
      var data = this.getData();
    },
    search() {
      this.curPage = 1;
      var data = this.getData();
    },
    handleCurrentChange(val) {
      this.curPage = val;
      var data = this.getData();
    },
    getData() {
      var data = {
        project_id: this.projectId,
        page_index: this.curPage - 1,
        page_size: 999,
        title: this.formInline.searchData
      };
      this.get_production_list(data);
    }
  },
  mounted() {
    console.log(process);
    this.getData();
    this.get_production_group_list({
      page_index: 0,
      page_size: 999,
      state: [0, 1]
    });
  },
  watch: {
    isLoading(val) {
      if (val) {
          this.loadingInstance = this.$LoadingY({message: "加载中，请稍后",show: true})
          setTimeout(() => {
              this.loadingInstance.close()
          }, Config.base_timeout);
      }else if(this.loadingInstance) this.loadingInstance.close()
    }
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
        },{
          columnName: "original_price",
          doFormat: reunitPrice
        },{
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
  .base-list-container {
    .base-list-row {
      height: 60px;
    }
  }
  .find-by-term {
    padding-top: 22px;
    text-align: left;
    margin-left: 20px;
    /deep/.ivu-input{
      width: 200px;
    }
    button {
      background: #fb843e;
      border: 1px solid #f06b1d;
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
}
</style>
