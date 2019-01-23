<template>
    <div class='manage-student-view'>
        <header-component title='查看学员' @reRenderList="reRenderList" :showAdd='true' addText='创建学员' @addClick='addStudentHandler' />
        <Row>
            <Form :inline="true" :model="formInline" :label-width="40" class="find-by-term">
                <FormItem label="类型">
                    <Select v-model="formInline.is_test_user" placeholder="请选择类型" @on-change='changeFilterHandler'>
                        <Option label="全部" :value="-1"></Option>
                        <Option label="正式" :value="0"></Option>
                        <Option label="测试" :value="1"></Option>
                    </Select>
                </FormItem>
                <FormItem label="学段">
                    <Select multiple v-model="formInline.grade_id" placeholder="请选择学段" @on-change='changeFilterHandler'>
                        <Option v-for="item in gradeList" :key="item.id" :label="item.name" :value="item.id"></Option>
                    </Select>
                </FormItem>
                <FormItem label="学科">
                    <Select multiple v-model="formInline.subject_id" placeholder="请选择学科" @on-change='changeFilterHandler'>
                        <Option v-for="item in subjectList" :key="item.id" :label="item.name" :value="item.id"></Option>
                    </Select>
                </FormItem>
                <FormItem label="状态">
                    <Select multiple v-model="formInline.state_id" placeholder="请选择学员状态" @on-change='changeFilterHandler'>
                        <Option v-for="item in stateList" :key="item.id" :label="item.name" :value="item.id"></Option>
                    </Select>
                </FormItem>
                <FormItem label="产品">
                    <Select v-model="formInline.product_id" placeholder="请选择产品" @on-change='changeFilterHandler'>
                        <Option v-for="item in productList" :key="item.id" :label="item.title" :value="item.id"></Option>
                    </Select>
                </FormItem>
            </Form>
        </Row>
        <Row>
            <Form :inline='true' :model='formInline' class='find-by-term'>
                <FormItem class="from-item-input">
                    <Row>
                        <Col :span="10">
                            <Select class="select-user" v-model="formInline.classify" placeholder="">
                                <Option label="手机号" value="phone"></Option>
                                <Option label="昵称" value="username"></Option>
                                <Option label="真实姓名" value="realname"></Option>
                                <Option label="用户ID" value="user_id"></Option>
                            </Select>
                        </Col>
                        <Col :span="14">
                            <Input size='large' v-model="formInline.classifyValue" placeholder="请输入搜索内容"></Input>
                        </Col>
                    </Row>
                </FormItem>
                <FormItem>
                    <Button type="primary" @click="onSubmit">查询</Button>
                </FormItem>
                <FormItem>
                    <Button type="primary" @click="onClear">清除</Button>
                </FormItem>
            </Form>
        </Row>
        <Row class='total-num' type='flex' justfy='start' align='middle'>
            <span>当前学员 {{total}} 人</span>
        </Row>
        <data-list class='data-list light-header' @showDetail='showDetailHandler' @queryHomework='queryHomeworkHandler'
                   @queryTask='queryTaskHandler' @queryOffline='queryOfflineHandler' @query='queryHandler' @edit='editHandler'
                   :table-data='dataList' :header-data='dataHeader' :column-formatter='listColumnFormatter' :column-formatter-data='listColumnFormatterData'></data-list>
        <back-to-top/>
        <Row class='pager' type='flex' justify='end' align='middle'>
            <Page :current="curPage" @on-page-size-change="handleSizeChange" :page-size='pageSize' @on-change="handleCurrentChange" :total="total"/>
        </Row>
    </div>
</template>
<script>
  import Header from '../../components/Header'
  import SubjectFilter from '../../components/SubjectFilter'
  import BaseList from '../../components/BaseList'
  import BackToTop from '../../components/BackToTop'
  import api from '../../api/modules/config'
  import { set_user_student_mrzx } from '../../api/modules/student'
  import { Dialog } from '../dialogs'
  import { doDateFormat, doTimeFormat } from "../../components/Util";
  import { ADD_STUDENT, QUERY_STUDENT_COURSE, QUERY_STUDENT_OFFLINE_COURSE, QUERY_STUDENT_TASK, STUDENT_INFO_DETAIL } from '../dialogs/types'
  import {Config} from '../../config/base'

  export default {
    mixins: [Dialog],
    components: { 'header-component': Header, 'subject-filter': SubjectFilter, 'data-list': BaseList, 'back-to-top': BackToTop
    },
    data() {
      return {
        user: {
          user_id: 0,
          realname: '',
          subject_id: 1,
          period_id: 1,
          start_school_time: '',
          times: 0,
          more: '',
          type: '1'
        },
        formInline: {
          grade_id: [],
          subject_id: [],
          state_id: [],
          is_test_user: 0,
          classify: 'phone',
          classifyValue: '',
          product_id: null,
        },
        loadingInstance: null,
        searchData: '',
        searchType: 'phone',
        initData: false,
        dialogVisible: false,
        isChange: false,
        isSelected: false
      }
    },
    methods: {
      showDetailHandler(index, row) {
        this.handleSelModal(STUDENT_INFO_DETAIL, row)
      },
      addStudentHandler() {
        this.handleSelModal(ADD_STUDENT, {showList: true})
      },
      changeFilterHandler() {
        var formData = this.getData();
        this.$store.dispatch('get_student_list', formData);
      },
      getData() {
        var formData = {
          is_test_user: this.formInline.is_test_user,
          project_id: this.$store.state.project.select_project_id,
          grade_id: this.formInline.grade_id,
          subject_id: this.formInline.subject_id,
          states: this.formInline.state_id,
          product_id: this.formInline.product_id
        }
        formData[this.formInline.classify] = this.formInline.classifyValue;
        return formData;
      },
      handleSizeChange(val) {
        if (val !== this.pageSize) {
          var data = this.getData();
          data.curPage = this.curPage;
          data.pageSize = val;
          this.$store.dispatch('get_student_list', data);
        }
      },
      onSubmit() {
        var formData = this.getData();
        this.$store.dispatch('get_student_list', formData);
      },
      onClear() {
        this.formInline.classifyValue = '';
        this.formInline.is_test_user = 0;
        this.formInline.product_id = null;
        var formData = this.getData();
        this.$store.dispatch('get_student_list', formData);
      },
      handleCurrentChange(val) {
        var data = this.getData();
        data.curPage = val;
        data.pageSize = this.pageSize;
        this.$store.dispatch('get_student_list', data);
      },
      searchStudent() {
        if (!this.initData)
          this.initData = true;
        this.$store.dispatch('search_userinfo_by_nickname_or_phone', {
          searchType: this.searchType,
          searchData: this.searchData
        });
      },
      reRenderList(v) {
        if (this.$store.state.project.project_list.length > 0 && this.dataList.length === 0) {
          var data = this.getData();
          data.no_group = 0;
          data.is_test_user = 0;
          data.project_id = v
          this.$store.dispatch('get_student_list', data);
        }
      },
      setStudent() {
        this.user.user_id = this.searchResult.user_id;
        set_user_student_mrzx(this.user).then((res) => {
          if (res.data.res_code === 1) {
            this.showPop('保存成功！')
            this.$store.dispatch('get_student_list', {
              curPage: 1,
              pageSize: 100000,
              is_test_user: 0
            });
          } else this.showPop('保存失败，' + res.data.msg);
        });
      },
      editData(index) {
        this.$Notice.open({
          title: '提示',
          duration: 0,
          render: h => {
            render: h => {
              return h('div', [
                h('p', '显示按钮'),
                h('br'), h('br'),
                h('Button', '保存')
              ])
            }
          }
        })
      },
      deleteData(index) {
      },
      editHandler(index, row) {
        this.handleSelModal(ADD_STUDENT, {
          type: 2,
          user_id: row.user_id,
          nickname: row.nickname,
          sid: row.id
        });
      },
      queryHandler(index, row) {
        this.handleSelModal(QUERY_STUDENT_COURSE, row)
      },
      queryOfflineHandler(index, row) {
        this.handleSelModal(QUERY_STUDENT_OFFLINE_COURSE, row)
      },
      queryTaskHandler(index, row) {
        this.handleSelModal(QUERY_STUDENT_TASK, {project_id: row.project_id, user_id: row.user_id, type: 0});
      },
      queryHomeworkHandler(index, row) {
        this.handleSelModal(QUERY_STUDENT_TASK, {project_id: row.project_id, user_id: row.user_id, type: 1})
      }
    },
    mounted() {
      var vm = this;
      if (!this.$store.state.project.project_list || this.$store.state.project.project_list == 'token错误' || this.$store.state.project.project_list.length === 0) {
        this.$store.dispatch('get_project_list', {
          callback(v) {
            if (vm.$store.state.student.student_list.length === 0) {
              var data = vm.getData();
              data.no_group = 0;
              data.is_test_user = 0;
              data.project_id = v
              vm.$store.dispatch('get_student_list', data);
            }
            vm.$store.dispatch('get_production_list', {
              project_id: v,
              page_index: 0,
              page_size: 999,
            })
          }
        });
      } else {
        if (this.dataList.length === 0) {
          var data = this.getData();
          data.no_group = 0;
          data.is_test_user = 0;
          data.project_id = this.$store.state.project.select_project_id;
          this.$store.dispatch('get_student_list', data);
        }
        this.$store.dispatch('get_production_list', {
          project_id: this.$store.state.project.select_project_id,
          page_index: 0,
          page_size: 999,
        })
      }
      this.$store.dispatch('get_subject_list');
      this.$store.dispatch('get_grade_list')
    },
    watch: {
      isLoading(val) {
        this.$config.IsLoading(val);
      }
    },
    computed: {
      list() {
        return this.$store.state.student.student_list;
      },
      pageSize() {
        return this.$store.state.student.pageSize;
      },
      curPage() {
        return this.$store.state.student.curPage;
      },
      total() {
        return this.$store.state.student.total;
      },
      isLoading() {
        return this.$store.state.student.showLoading;
      },
      searchResult() {
        return this.$store.state.student.search_result;
      },
      resultMsg() {
        return this.$store.state.student.search_msg;
      },
      dataHeader() {
        return [{
          prop: 'user_id',
          label: '用户ID',
          width: 80
        }, {
          prop: 'nickname',
          label: '昵称',
          width: 150
        }, {
          prop: 'realname',
          label: '真实姓名',
          width: 100
        }, {
          prop: 'phone',
          label: '手机号',
          width: 130
        }, {
          prop: 'roles',
          label: '权限'
        }, {
          prop: 'product_id',
          label: '产品',
          width: 160
        }, {
          prop: 'grade_id',
          label: '学段',
          width: 80,
          // useFilter:true
        }, {
          prop: 'subject_id',
          label: '学科',
          width: 80,
          // useFilter:true
        }, {
          prop: 'state',
          label: '学员状态',
          width: 100,
          // useFilter:true
        }, {
          prop: 'create_time',
          label: '入学时间',
          width: 130
        }, {
          prop: 'times',
          label: '学期',
          width: 80
        }, {
          label: '操作',
          width: 120,
          groupBtn: [{
            text: '查看详情',
            param: 'showDetail'
          }]
        }]
      },
      listColumnFormatter() {
        return [{
          columnName: 'grade_id',
          dataIndex: 0,
          dataProp: 'id',
          dataValue: 'name'
        }, {
          columnName: "create_time",
          doFormat: doTimeFormat
        }, {
          columnName: 'subject_id',
          dataIndex: 1,
          dataProp: 'id',
          dataValue: 'name'
        }, {
          columnName: 'state',
          dataIndex: 2,
          dataProp: 'id',
          dataValue: 'name'
        }, {
          columnName: 'roles',
          dataIndex: 3,
          dataProp: 'role_id',
          dataValue: 'role_name'
        }, {
          columnName: 'product_id',
          dataIndex: 4,
          dataProp: 'id',
          dataValue: 'title'
        }]
      },
      listColumnFormatterData() {
        return [this.gradeList, this.subjectList, this.stateList, this.$store.state.roles.role_list, this.productList];
      },
      dataList() {
        return this.$store.state.student.student_list;
      },
      subjectList() {
        return this.$store.state.subject.subject_list;
      },
      gradeList() {
        return this.$store.state.grade.grade_list;
      },
      stateList() {
        return this.$store.state.student.stateList;
      },
      productList() {
        return this.$store.state.production.production_list;
      },
      listHeight() {
        return window.innerHeight - 60 - 20 - 97;
      }
    }
  }
</script>
<style lang="scss" scoped>
    .manage-student-view {
        .find-by-term {
            padding-top: 22px;
            text-align: left;
            margin-left: 20px;
            .from-item-input{
                width: 380px
            }
            .ivu-select {
                width: 200px;
                .ivu-select-selection{
                    border-radius: 0;
                }
                &.select-user{ width: 100% }
            }

            button {
                background: #FB843E;
                border: 1px solid #F06B1D;
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

                        .Button {
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

                    .Button {
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
                border: 1px solid #EBEBEC;
                border-radius: 6px;
                padding: 20px 0;

                .user-info {
                    font-size: 14px;
                    margin-bottom: 24px;
                    border-bottom: 1px solid #EBEBEC;
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

                    .Button {
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
