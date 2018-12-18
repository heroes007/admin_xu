<template>
    <div class='manage-production-view'>
        <header-component title='产品管理' :type='0' :showAdd='true' addText='新建产品' @addClick='addProductionHandler'></header-component>
        <el-row>
            <el-form :inline="true" :model="formInline" class="find-by-term">
                <el-form-item label="产品名称" label-width="80px">
                    <el-row>
                        <el-col>
                            <el-input v-model="formInline.searchData" placeholder="请输入搜索内容"></el-input>
                        </el-col>
                    </el-row>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="search">查询</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="clearSearch">清除</el-button>
                </el-form-item>
            </el-form>
        </el-row>
        <data-list class='data-list light-header' 
            @editProtocol = 'editProtocol'
            @edit='editHandler' 
            @detail='showCourseDetailHandler' 
            @delete='deleteHandler' 
            :table-data='dataList'
            :header-data='dataHeader' 
            :column-formatter='listColumnFormatter' 
            :column-formatter-data='listColumnFormatterData' 
            :comboIsSelect='true' 
            :columnComboData='columnComboData'
            :comboModelList='comboDataList'>
        </data-list>
            <el-row class='pager' type='flex' justify='end' align='middle'>
                <el-pagination @current-change="handleCurrentChange" :current-page="curPage" :page-size='20' layout="prev, pager, next" :total="total">
                </el-pagination>
            </el-row>
    </div>
</template>



<script>
import Header from "../../components/Header";
import SubjectFilter from "../../components/SubjectFilter";
import BaseList from "../../components/BaseList";
import BackToTop from "../../components/BackToTop";
import { MPop } from "../../components/MessagePop";
import api from "../../api/modules/config";
import { set_user_student_mrzx } from "../../api/modules/student";
import { send_interview_msg } from "../../api/modules/exam";
import { Loading, Message } from "element-ui";
import { Dialog } from "../dialogs";
import { ADD_PRODUCTION, EDIT_PROTOCOL } from "../dialogs/types";
import { Config } from "../../config/base";
import { mapState, mapActions, mapGetters } from "vuex";
import { doDateFormat, doTimeFormat, reunitPrice } from "../../components/Util";

export default {
  mixins: [Dialog, MPop],
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
    ...mapActions([
      "get_production_list",
      "change_production_vailid",
      "delete_production",
      "get_production_group_list"
    ]),
    addProductionHandler() {
      this.handleSelModal(ADD_PRODUCTION);
    },
    editHandler(index, row) {
      this.handleSelModal(ADD_PRODUCTION, row);
    },
    editProtocol(index, row) {
      // console.log(index, row);
      this.handleSelModal(EDIT_PROTOCOL, row.id);
    },
    showCourseDetailHandler(index, row) {
      this.$router.push({
        name: "manage-production-curriculum",
        params: {
          id: row.id
        }
      });
    },
    deleteHandler(index, row) {
      var vm = this;
      this.$confirm("是否确认删除该产品？", "提示", {
        type: "info"
      })
        .then(() => {
          this.delete_production({
            id: row.id,
            _fn: function() {
              vm.showPop("删除成功！");
            }
          });
        })
        .catch(() => {});
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
        this.loadingInstance = Loading.service({
          text: "加载中，请稍后",
          fullscreen: true
        });
        setTimeout(() => {
          this.loadingInstance && this.loadingInstance.close();
        }, Config.base_timeout);
      } else {
        this.loadingInstance && this.loadingInstance.close();
        this.dirty = false;
      }
    }
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
      if (this.projectType === 0) {
        return [
          {
            prop: "code",
            label: "编码",
            width: 150
          },
          {
            prop: "title",
            label: "产品名称",
            width: 300
          },
          {
            prop: "original_price",
            label: "定价",
            width: 100
          },
          {
            prop: "price",
            label: "售价",
            width: 100
          },
          {
            prop: "belong_specials",
            label: "所属组合",
            minwidth: 260
          },
          {
            label: "产品协议",
            width: 120,
            groupBtn: [
              {
                text: "编辑",
                param: "editProtocol"
              }
            ]
          },
          {
            label: "产品状态",
            prop: "state",
            useCombo: true,
            comboListIndex: 0,
            listLabel: "name",
            listValue: "id",
            actionName: "change_production_state",
            width: 200
          },
          {
            label: "操作",
            width: 320,
            groupBtn: [
              {
                // isSwitch: true,
                // switchKey: 'is_valid',
                // onText: '启用',
                // offText: '停用',
                // disableText: '失效',
                // actionName: 'change_production_vailid'
              },
              {
                text: "编辑",
                param: "edit"
              },
              {
                text: "查看",
                param: "detail"
              },
              {
                text: "el-icon-delete",
                param: "delete",
                isIcon: true
              }
            ]
          }
        ];
      } else {
        return [
          {
            prop: "code",
            label: "编码",
            width: 150
          },
          {
            prop: "title",
            label: "产品名称",
            width: 300
          },
          {
            prop: "original_price",
            label: "定价",
            width: 100
          },
          {
            prop: "price",
            label: "售价",
            width: 100
          },
          {
            prop: "belong_specials",
            label: "所属组合",
            minwidth: 300
          },
          {
            prop: "protocal",
            label: "产品协议",
            groupBtn: [
              {
                text: "编辑",
                param: "editProtocol"
              }
            ],
            width: 120
          },
          {
            label: "产品状态",
            prop: "state",
            useCombo: true,
            comboListIndex: 0,
            listLabel: "name",
            listValue: "id",
            actionName: "change_production_state",
            width: 300
          },
          {
            label: "操作",
            width: 320,
            groupBtn: [
              {
                // isSwitch: true,
                // switchKey: 'is_valid',
                // onText: '启用',
                // offText: '停用',
                // disableText: '失效',
                // actionName: 'change_production_vailid'
              },
              {
                text: "编辑",
                param: "edit"
              },
              {
                text: "el-icon-delete",
                param: "delete",
                isIcon: true
              }
            ]
          }
        ];
      }
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
  },
  components: {
    "header-component": Header,
    "subject-filter": SubjectFilter,
    "data-list": BaseList,
    "back-to-top": BackToTop
  }
};
</script>
<style lang="scss">
.el-tooltip__popper {
  &.is-light {
    background: #ffffff;
    border: 1px solid #e7e8ea;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.12), 0 0 6px 0 rgba(0, 0, 0, 0.04);
    .more-tip {
      max-width: 278px;
      line-height: 1.2;
      font-size: 14px;
      color: #2e3e47;
      & + .popper__arrow {
        border-top-color: #e7e8ea;
        &:after {
          //border-top-color:#E7E8EA;
        }
      }
    }
  }
}

.manage-production-view {
  .base-list-container {
    .base-list-row {
      height: 60px;
      .cell {
        .el-button {
          margin-right: 2px;
          &:last-child {
            margin-left: 10px;
          }
        }
      }
    }
  }
  .find-by-term {
    padding-top: 22px;
    text-align: left;
    margin-left: 20px;
    .el-input__inner {
      border-radius: 0;
      background: #ffffff;
      border: 1px solid #e5e5e5;
    }
    .el-form-item__label {
      font-size: 14px;
      color: #141111;
      letter-spacing: 0;
    }
    .el-select {
      width: 300px;
      &.select-user {
        width: 100%;
        .el-input__inner {
          border-right: 0;
        }
      }
    }
    button {
      background: #fb843e;
      border: 1px solid #f06b1d;
      border-radius: 4px;
      width: 100px;
      height: 36px;
    }
  }
  .pager {
    margin: 30px 0;
    padding-right: 40px;
    .el-pagination {
      button {
        &.disabled {
          background-color: #ebebec;
          border-color: #b0b3c5;
          color: #8b9fa9;
        }
      }
      .el-pager {
        li {
          &.active {
            background-color: #8b9fa9;
          }
        }
      }
    }
  }
  .btn-add {
    color: #5fa137;
  }
  .data-container {
    background-color: #ffffff;
    margin: 0 20px 20px;
    .list {
      .data-header {
        height: 50px;
        .el-col {
          line-height: 50px;
        }
      }
      .data-item {
        height: 40px;
        border-top: 1px solid #cecece;
        &.bg-gray {
          background-color: #fbfbfb;
        }
        .el-col {
          line-height: 40px;
          .el-button {
            a {
              color: #5fa137;
              font-size: 14px;
            }
          }
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
        .el-pagination {
          button {
            &.disabled {
              background-color: #ebebec;
              border-color: #b0b3c5;
              color: #8b9fa9;
            }
          }
          .el-pager {
            li {
              &.active {
                background-color: #8b9fa9;
              }
            }
          }
        }
      }
    }
  }
  .back-to-top {
    top: 80%;
    right: 20px;
  }
}

//添加框
.add-student-view {
  .img {
    margin-top: 100px;
    img {
      width: 150px;
      height: 150px;
    }
  }
  .title {
    margin-top: 25px;
    h1 {
      font-size: 28px;
      color: #2e3e47;
      font-weight: 200;
      font-family: MicrosoftYaHei;
      margin: 0;
    }
  }
  .search-bar {
    margin-top: 40px;
    .el-input-group {
      width: 380px;
      .el-input__inner {
        height: 46px;
      }
      .el-input-group__append {
        background-color: #7ab854;
        .el-button {
          height: 100%;
          width: 80px;
          color: #ffffff;
          font-size: 16px;
        }
      }
      .el-input-group__prepend {
        background-color: #7ab854;
        .el-select {
          height: 100%;
          width: 110px;
          color: #ffffff;
          font-size: 16px;
        }
        i {
          color: #ffffff;
        }
      }
    }
  }
  .result {
    margin: 15px 0 76px;
    .data-form {
      width: 550px;
      background-color: #ffffff;
      border: 1px solid #ebebec;
      border-radius: 6px;
      padding: 20px 0;
      .user-info {
        font-size: 14px;
        margin-bottom: 24px;
        border-bottom: 1px solid #ebebec;
        padding: 0 20px;
        span {
          color: #7ab854;
          margin-right: 15px;
        }
      }
      .user-data {
        font-size: 14px;
        margin-bottom: 15px;
        padding: 0 20px;
        .el-button {
          width: 140px;
          height: 36px;
          background-color: #7ab854;
          color: #ffffff;
        }
        &.desc {
          width: 100%;
          .el-input {
            width: 330px;
          }
        }
      }
    }
  }
}
</style>