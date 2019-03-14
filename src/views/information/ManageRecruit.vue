<template>
<div class='manage-recruit-view'>
    <header-component title='招生管理' :type='0' :showAdd='true' addText='导师管理' @addClick='teacherArrangementHandler'></header-component>
    <Row>
        <Form :inline="true" :model="formInline" class="find-by-term">
            <FormItem label="学科" :label-width="40">
                <Select multiple v-model="formInline.subject_id" placeholder="请选择学科" @on-change='changeFilterHandler'>
                    <Option v-for="item in subjectList" :key="item.id" :label="item.name" :value="item.id"></Option>
                </Select>
           </FormItem>
            <FormItem label="面试结果" :label-width="80">
                <Select v-model="formInline.interview_state" placeholder="请选择面试结果" @on-change='changeFilterHandler'>
                    <Option label="笔试通过" :value="3"></Option>
                    <Option label="未面试" :value="0"></Option>
                    <Option label="面试通过" :value="1"></Option>
                    <Option label="面试未通过" :value="2"></Option>
                </Select>
           </FormItem>
            <FormItem label="" :label-width="80">
              <Input placeholder="请输入内容" v-model="input" class="input-with-select" style="width:450px">
                <Select v-model="select" slot="prepend" placeholder="请选择" style="width:100px">
                  <Option label="姓名" :value="1"></Option>
                  <Option label="电话号" :value="2"></Option>
                </Select>
                <Button slot="append" class="append-btn" @click='handleRealname'>搜索</Button>
              </Input>
           </FormItem>
        </Form>
    </Row>
    <data-list class='data-list light-header' @withdraw='withdrawHandler' @interviewTimeChange='interviewTimeChangeHandler' @sendMessage='sendMessageHandler' @showDetail='showDetailHandler' :table-data='dataList'
               :header-data='dataHeader' :column-formatter='listColumnFormatter' :column-formatter-data='listColumnFormatterData' :comboModelList='comboDataList' />
    <Row class='pager' type='flex' justify='end' align='middle'>
        <Page @on-page-size-change="handleSizeChange" @on-change="handleCurrentChange"
        :current="curPage" :page-size="pageSize"  :total="total">
        </Page>
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
import { Loading } from "element-ui";
import { Dialog } from "../dialogs";
import { RECRUIT_DETAIL,  INTERVIEW_TEACHER_ARRANGEMENT } from "../dialogs/types";
import { Config } from "../../config/base";
import { mapState, mapActions } from "vuex";
import { doDateFormat, doTimeFormat } from "../../components/Util";
export default {
  mixins: [Dialog, MPop],
  components: { "header-component": Header, "data-list": BaseList, "back-to-top": BackToTop },
  data() {
    return {
      user: {
        user_id: 0,
        realname: "",
        subject_id: 1,
        period_id: 1,
        start_school_time: "",
        times: 0,
        more: "",
        type: "1"
      },
      formInline: {
        subject_id: [],
        interview_state: 0
      },
      input: '',
      select: '',
      realname: '',
      phone: '',
      loadingInstance: null,
      searchData: "",
      searchType: "phone",
      curPage: 1,
      pageSize: 20
    };
  },
  watch: {
    isLoading(val){
      // if (val) {
      //     this.loadingInstance = this.$LoadingY({message: "加载中，请稍后",show: true})
      //     setTimeout(() => {
      //         this.loadingInstance.close()
      //     }, Config.base_timeout);
      // }else if(this.loadingInstance) this.loadingInstance.close()
    }
  },
  methods: {
    ...mapActions([ "get_recruit_list", "get_subject_list", "get_grade_list", "get_dealer_list",
    "get_teachers", "drop_student_signup", "get_production_list" ]),
    withdrawHandler(index, row) {
    this.$Modal.confirm({
          title:'提示',
          content: "是否确认打回改报名信息？",
          onOk: () => {
          var vm = this;
            this.drop_student_signup({
              id: row.id,
              _fn: function() {
                vm.showPop("打回成功！", 1000);
              }
            });
        }
      });
    },
    teacherArrangementHandler() {
      this.handleSelModal(INTERVIEW_TEACHER_ARRANGEMENT);
    },
    interviewTimeChangeHandler() {
       this.$Modal.confirm({
          title: '提示',
          content:  "注意，确认面试时间后请点击发送短信，否则新的面试时间将不会被保存。",
          onOk: () => {}
      });
    },
    // 姓名筛选
    handleRealname () {
      var formData = this.getData();
      this.get_recruit_list(formData);
    },
    sendMessageHandler(index, row) {
       this.$Modal.confirm({
            title: '提示',
            content:"注意，确认后，该面试时间会立即以短信形式发送到学员手机，确认发送？",
            onOk: () => {
              send_interview_msg(row.id, row.interview_time).then(res => {
                if (res.data.res_code === 1)  this.showPop("发送成功！", 1000);
              });
            }
        });
    },
    showDetailHandler(index, row) {
      this.handleSelModal(RECRUIT_DETAIL, row.id);
    },
    changeFilterHandler() {
      var formData = this.getData();
      this.get_recruit_list(formData);
    },
    getData() {
      var states, results, written_hg,realname, phone;
      let _state = this.formInline.interview_state;
      states = _state === 0 ? 0 : 1;
      results = _state === 1 ? 1 : 0;
      if (this.select == 1) {
        realname = this.input;
      } else if (this.select == 2) {
        phone = this.input;
      }
      // 笔试通过
      if (this.formInline.interview_state === 3) {
        written_hg = 1;
        states = null;
        results = null;
      }
      var formData = {
        curPage: 1,
        pageSize: this.pageSize,
        project_id: this.$store.state.project.select_project_id,
        subject_id: this.formInline.subject_id.length === 0 ? null : this.formInline.subject_id,
        interview_state: states,
        interview_result: results,
        written_hg,
        realname: realname,
        phone: phone
      };
      formData[this.formInline.classify] = this.formInline.classifyValue;
      return formData;
    },
    handleSizeChange(val) {
      if (val !== this.pageSize) {
        this.pageSize = val;
        var data = this.getData();
        data.curPage = this.curPage;
        data.pageSize = val;
        // this.$store.dispatch('get_student_list', {
        //     curPage: this.curPage,
        //     pageSize: val,
        //     project_id: this.$store.state.project.select_project_id
        // });
        this.get_recruit_list(formData);
      }
    },
    onSubmit() {
      var formData = this.getData();
      this.$store.dispatch("get_student_list", formData);
    },
    onClear() {
      this.formInline.classifyValue = "";
      this.formInline.is_test_user = 0;
      var formData = this.getData();
      this.$store.dispatch("get_student_list", formData);
    },
    handleCurrentChange(val) {
      this.curPage = val;
      var data = this.getData();
      data.curPage = val;
      data.pageSize = this.pageSize;
      this.get_recruit_list(data);
    }
  },
  mounted() {
    this.get_subject_list();
    this.get_grade_list();
    this.get_dealer_list();
    var data = this.getData();
    this.get_recruit_list(data);
    this.get_teachers();
    this.get_production_list({ project_id: this.projectId, page_index: 0, page_size: 999 });
  },
  computed: {
    ...mapState({
      isLoading: state => state.recruit.isLoading,
      dataList: state => state.recruit.recruit_list,
      subjectList: state => state.subject.subject_list,
      gradeList: state => state.grade.grade_list,
      dealerList: state => state.dealer.dealer_list,
      resultList: state => state.recruit.result_list,
      total: state => state.recruit.total,
      teacherList: state => state.user.getTeachers,
      projectId: state => state.project.select_project_id,
      productList: state => state.production.production_list
    }),
    comboDataList() {
      var r = [];
      var v = [];
      for (var i = 0; i < this.dataList.length; i++) {
        r.push(this.dataList[i].interview_time);
      }
      return r;
    },
    columnComboData() {
      return [this.resultList];
    },
    searchResult() {
      return this.$store.state.student.search_result;
    },
    resultMsg() {
      return this.$store.state.student.search_msg;
    },
    dataHeader() {
      return [
        {
          prop: "user_id",
          label: "用户ID",
          width: 80
        },
        {
          prop: "create_time",
          label: "报名时间",
          width: 150
        },
        {
          prop: "realname",
          label: "姓名",
          width: 100
        },
        {
          prop: "phone",
          label: "电话",
          width: 130
        },
        {
          prop: "school_grade",
          label: "学历",
          width: 100
        },
        {
          prop: "grade_id",
          label: "学段",
          width: 100
          // useFilter:true
        },
        {
          prop: "subject_id",
          label: "学科",
          width: 100
          // useFilter:true
        },
        {
          prop: "product_id",
          label: "产品",
          width: 160
        },
        {
          prop: "from_domain",
          label: "分站",
          width: 160
        },
        {
          prop: "",
          label: "笔试成绩",
          width: 150,
          mixColumn: true,
          mixFunc: function(data) {
            let text ="通过(" + data.score + "/" + data.total_score + ")"
            let score = (n) => {
              return data.score >= n ? text : '不' + text
            }
            if (data.school_grade.indexOf("研") === 0) {
              return "免笔试";
            } else if (!data.total_score && !data.score) {
              return "未笔试";
            } else if (data.score === data.total_score) {
              return "满分(" + data.score + "/" + data.total_score + ")";
            }
            if (data.subject_id === 1 || data.subject_id === 4 || data.subject_id === 5) {
              return score(60)
            } else if (data.subject_id === 2 || data.subject_id === 3) {
              return score(70)
            }
          }
        },
        {
          prop: "interview_time",
          label: "面试安排",
          useTimePicker: true,
          width: 250,
          actionName: "change_interview_time",
          param: "interviewTimeChange"
        },
        {
          prop: "interview_user_id",
          label: "面试导师",
          width: 100
        },
        {
          prop: "",
          label: "面试结果",
          mixColumn: true,
          minwidth: 100,
          mixFunc: function(data) {
            if (data.interview_state === 0) {
              return "未面试";
            } else {
              if (data.interview_result === 0) return "未通过";
              else return "已通过";
            }
          }
        },
        {
          label: "操作",
          width: 280,
          groupBtn: [
            {
              text: "查看",
              param: "showDetail"
            },
            {
              text: "打回",
              param: "withdraw"
            },
            {
              text: "发送短信",
              param: "sendMessage"
            }
          ]
        }
      ];
    },
    listColumnFormatter() {
      return [
        {
          columnName: "create_time",
          doFormat: doTimeFormat
        },
        {
          columnName: "grade_id",
          dataIndex: 0,
          dataProp: "id",
          dataValue: "name"
        },
        {
          columnName: "subject_id",
          dataIndex: 1,
          dataProp: "id",
          dataValue: "name"
        },
        {
          columnName: "interview_user_id",
          dataIndex: 2,
          dataProp: "user_id",
          dataValue: "nickname"
        },
        {
          columnName: "product_id",
          dataIndex: 3,
          dataProp: "id",
          dataValue: "title"
        },
        {
          columnName: "from_domain",
          dataIndex: 4,
          dataProp: "id",
          dataValue: "company"
        }
      ];
    },
    listColumnFormatterData() {
      return [this.gradeList, this.subjectList, this.teacherList, this.productList, this.dealerList ];
    },
    listHeight() {
      return window.innerHeight - 60 - 20 - 97;
    }
  }
};
</script>
<style lang="scss" scoped>
.manage-recruit-view {
  .base-list-container {
    .base-list-row {
      height: 60px;
    }
  }
  .find-by-term {
    padding-top: 22px;
    text-align: left;
    margin-left: 20px;
    .ivu-select{ width: 200px }
    .ivu-select-selection{ border-radius: 0; }
    button {
      background: #3DAAFF;
      border: 1px solid #3DAAFF;
      border-radius: 4px;
      width: 100px;
      height: 36px;
    }
    .append-btn {
      width: 70px;
      color: #fff;
      border: none;
    }
  }
  .pager {
    margin: 30px 0;
    padding-right: 40px;
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
  }
  .result {
    margin: 15px 0 76px;
    .data-form {
      width: 550px;
      background-color: #ffffff;
      // border: 1px solid #ebebec;
      border-radius: 6px;
      padding: 20px 0;
      .user-info {
        font-size: 14px;
        margin-bottom: 24px;
        border-bottom: 1px solid #ebebec;
        padding: 0 20px;
        span {
          color: #657180 !important;
          margin-right: 15px;
        }
      }
      .user-data {
        font-size: 14px;
        margin-bottom: 15px;
        padding: 0 20px;
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
