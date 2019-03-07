<template>
    <div class='manage-my-interview-view'>
        <header-component title='我的面试' :type='0'></header-component>
        <Row>
            <Form :inline="true" :model="formInline" class="find-by-term">
                <FormItem label="面试状态" :label-width="80">
                    <Select v-model="formInline.interview_state" placeholder="请选择面试状态" @on-change='changeFilterHandler' style="width: 300px">
                        <Option label="未面试" :value="0"></Option>
                        <Option label="面试通过" :value="1"></Option>
                        <Option label="面试未通过" :value="2"></Option>
                    </Select>
                </FormItem>
                <div class="" style="position:absolute;top:22px;left:500px;">
                    <Input placeholder="请输入内容" v-model="input" class="input-with-select" style="width:450px">
                        <Select v-model="select" slot="prepend" placeholder="请选择" style="width:100px">
                            <Option label="姓名" :value="1"></Option>
                            <Option label="电话号" :value="2"></Option>
                        </Select>
                        <Button slot="append" class="append-btn" @click='handleRealname'>搜索</Button>
                    </Input>
                </div>
            </Form>
        </Row>
        <!--<keep-alive>-->
        <data-list class='data-list light-header' @finishInterview='finishInterviewHandler'
                   @showComment='showCommentHandler' @showDetail='showDetailHandler' :table-data='dataList'
                   :header-data='dataHeader' :column-formatter='listColumnFormatter'
                   :column-formatter-data='listColumnFormatterData'></data-list>
        <!--</keep-alive>-->
        <Row class='pager' type='flex' justify='end' align='middle'>
            <Page @on-page-size-change="handleSizeChange" @on-change="handleCurrentChange" :current="curPage"
                  :page-size="pageSize" :total="total" show-sizer>
            </Page>
        </Row>
    </div>
</template>

<script>
  import Header from "../../components/Header";
  import SubjectFilter from "../../components/SubjectFilter";
  import BaseList from "../../components/BaseList";
  import BackToTop from "../../components/BackToTop";
  import api from "../../api/modules/config";
  import {Dialog} from "../dialogs";
  import {RECRUIT_DETAIL, ADD_INTERVIEW_COMMENT} from "../dialogs/types";
  import {Config} from "../../config/base";
  import {mapState, mapActions} from "vuex";
  import {doDateFormat, doTimeFormat} from "../../components/Util";

  export default {
    mixins: [Dialog],
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

    methods: {
      ...mapActions([
        "get_recruit_list",
        "get_subject_list",
        "get_grade_list",
        "change_interview_state"
      ]),
      finishInterviewHandler(index, row) {
        this.$Modal.confirm({
          title: '提示',
          content: '<p>确认面试已完成？点击后不可修改</p>',
          onOk: () => {
            this.change_interview_state({id: row.id, interview_state: 1});
          },
        });
      },
      showCommentHandler(index, row) {
        this.handleSelModal(ADD_INTERVIEW_COMMENT, row);
      },
      showDetailHandler(index, row) {
        this.handleSelModal(RECRUIT_DETAIL, row.id);
      },
      changeFilterHandler() {
        var formData = this.getData();
        this.get_recruit_list(formData);
      },
      getData() {
        var states, results, realname, phone;
        if (this.formInline.interview_state === 0) {
          states = 0;
          results = null;
        } else {
          if (this.formInline.interview_state === 1) {
            states = 1;
            results = 1;
          } else {
            states = 1;
            results = 0;
          }
        }
        if (this.select == 1) {
          realname = this.input;
        } else if (this.select == 2) {
          phone = this.input;
        }
        var formData = {
          curPage: 1,
          pageSize: this.pageSize,
          project_id: this.$store.state.project.select_project_id,
          interview_state: states,
          interview_result: results,
          realname: realname,
          phone: phone
        };
        return formData;
      },
      // 姓名筛选
      handleRealname() {
        var formData = this.getData();
        this.get_recruit_list(formData);
      },
      handleSizeChange(val) {
        if (val !== this.pageSize) {
          this.pageSize = val;
          var data = this.getData();
          data.curPage = this.curPage;
          data.pageSize = val;
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
        // if (val && val !== this.curPage) {
        this.curPage = val;
        var data = this.getData();
        data.curPage = val;
        data.pageSize = this.pageSize;
        this.get_recruit_list(data);
        // }
      }
    },
    mounted() {
      this.get_subject_list();
      this.get_grade_list();
      var data = this.getData();
      this.get_recruit_list(data);
    },
    watch: {
      isLoading(val) {
        this.$config.IsLoading(val);
      }
    },
    computed: {
      ...mapState({
        isLoading: state => state.recruit.isLoading,
        dataList: state => state.recruit.recruit_list,
        subjectList: state => state.subject.subject_list,
        gradeList: state => state.grade.grade_list,
        resultList: state => state.recruit.result_list,
        total: state => state.recruit.total,
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
            prop: "",
            label: "笔试成绩",
            width: 150,
            mixColumn: true,
            mixFunc: function (data) {
              if (data.school_grade.indexOf("研") === 0) {
                return "免笔试";
              } else if (!data.total_score && !data.score) {
                return "未笔试";
              } else if (data.score === data.total_score) {
                return "满分(" + data.score + "/" + data.total_score + ")";
              }
              if (data.subject_id === 1) {
                if (data.score >= 60) {
                  return "通过(" + data.score + "/" + data.total_score + ")";
                } else {
                  return "不通过(" + data.score + "/" + data.total_score + ")";
                }
              } else if (data.subject_id === 2) {
                if (data.score >= 70) {
                  return "通过(" + data.score + "/" + data.total_score + ")";
                } else {
                  return "不通过(" + data.score + "/" + data.total_score + ")";
                }
              } else if (data.subject_id === 3) {
                if (data.score >= 70) {
                  return "通过(" + data.score + "/" + data.total_score + ")";
                } else {
                  return "不通过(" + data.score + "/" + data.total_score + ")";
                }
              } else if (data.subject_id === 4) {
                if (data.score >= 60) {
                  return "通过(" + data.score + "/" + data.total_score + ")";
                } else {
                  return "不通过(" + data.score + "/" + data.total_score + ")";
                }
              } else if (data.subject_id === 5) {
                if (data.score >= 60) {
                  return "通过(" + data.score + "/" + data.total_score + ")";
                } else {
                  return "不通过(" + data.score + "/" + data.total_score + ")";
                }
              }
            }
          },
          {
            prop: "interview_time",
            label: "面试安排",
            width: 150
          },
          {
            prop: "",
            label: "状态",
            minwidth: 100,
            mixColumn: true,
            mixFunc: function (data) {
              if (data.interview_state === 0 && !data.interview_comment) {
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
                text: "详情",
                param: "showComment"
              },
              {
                text: "面试完成",
                disabledText: "已完成",
                canDisabled: true,
                param: "finishInterview",
                disabeldFunc: function (data) {
                  if (data.interview_state === 0) return false;
                  return true;
                }
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
            columnName: "interview_time",
            doFormat: doDateFormat
          },
          {
            columnName: "grade_id",
            dataIndex: 0,
            dataProp: "id",
            dataValue: "name"
          },
          {
            columnName: "product_id",
            dataIndex: 1,
            dataProp: "id",
            dataValue: "title"
          },
          {
            columnName: "subject_id",
            dataIndex: 2,
            dataProp: "id",
            dataValue: "name"
          }
        ];
      },
      listColumnFormatterData() {
        return [
          this.gradeList,
          this.productList,
          this.subjectList];
      },
      listHeight() {
        return window.innerHeight - 60 - 20 - 97;
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
<style scoped lang="scss">
    .manage-my-interview-view {
        .find-by-term {
            padding-top: 22px;
            text-align: left;
            margin-left: 20px;

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

        .back-to-top {
            top: 80%;
            right: 20px;
        }
    }
</style>
