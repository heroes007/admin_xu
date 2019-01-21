<template>
    <Modal :width="600" :transfer=false :title="payload.type == 1 ? '创建学员' : '编辑学员'" v-model="addStudentDialog" :footer-hide="true"
               @on-cancel="handleRemoveModal(remove)"  :mask-closable="false" :styles="{ fontsize: '14px'}">
        <base-input @closedialog="handleClose">
            <Row slot="body">
                <Row class="body-top" v-if="payload.showList">
                    <Row class='search-bar' type='flex' justify='center' align='middle'>
                        <Form :inline='true' class='find-by-term edirTable' :label-width="0">
                            <FormItem class="select-user-item">
                                <Row>
                                    <Col :span="10">
                                        <Select class="select-user" v-model="searchType" placeholder="">
                                            <Option label="昵称" value="nickname"></Option>
                                            <Option label="手机号" value="phone"></Option>
                                            <Option label="用户ID" value="user_id"></Option>
                                        </Select>
                                    </Col>
                                    <Col :span="14">
                                        <Input v-model="searchData" placeholder="请输入搜索内容"></Input>
                                    </Col>
                                </Row>
                            </FormItem>
                            <FormItem>
                                <Button class="sub-btn" type="primary" @click="searchStudent">查询</Button>
                            </FormItem>
                        </Form>
                         <data-list class="edirTable" @create='createStudentHandler' :table-data='userList' :header-data='dataHeader'/>
                    </Row>
                </Row>
                <Row class="body-top-showList" v-if="!payload.showList">
                    <Form ref="form" :model="form" :label-width="80" class="add-teacher-form">
                        <FormItem label="选择项目">
                            <Select v-model="form.project_id" placeholder="请选择项目" disabled>
                                <Option v-for="item in projectList" :key="item.id" :label="item.name"
                                        :value="item.id"></Option>
                            </Select>
                        </FormItem>
                        <FormItem label="选择产品">
                            <Select multiple v-model="form.product_id" placeholder="请选择项目">
                                <Option v-for="item in productList" :key="item.id" :label="item.title"
                                        :value="item.id"></Option>
                            </Select>
                        </FormItem>
                        <FormItem label="真实姓名">
                            <Input v-model="form.realname" placeholder="请输入学员真实姓名"></Input>
                        </FormItem>
                        <FormItem label="选择学段">
                            <Select v-model="form.grade_id" placeholder="请选择学段">
                                <Option v-for="item in gradeList" :key="item.id" :label="item.name"
                                        :value="item.id"></Option>
                            </Select>
                        </FormItem>
                        <FormItem label="选择学科">
                            <Select v-model="form.subject_id" placeholder="请选择学科">
                                <Option v-for="item in subjectList" :key="item.id" :label="item.name"
                                        :value="item.id"></Option>
                            </Select>
                        </FormItem>
                        <FormItem v-if="false || payload.type == 1" class="send-offline-course">
                            <Checkbox v-model="isSend" @on-change="handleGetOfflineTermList">是否发送线下课</Checkbox>
                        </FormItem>
                        <FormItem :label-width="110" label="请选择线下课" v-if="isSend">
                            <Select v-model="form.offline_term_id" placeholder="请选择学科">
                                <Option v-for="item in dataList" :key="item.id" :label="item.name"
                                        :value="item.id"></Option>
                            </Select>
                        </FormItem>
                        <FormItem label="开课时间" v-if="payload.type == 2">
                            <DatePicker v-model="form.start_school_time" type="date" placeholder="选择日期" :transfer="true">
                            </DatePicker>
                        </FormItem>
                        <FormItem label="毕业时间" v-if="payload.type == 2">
                            <DatePicker v-model="form.finish_school_time" type="date" placeholder="选择日期" :transfer="true">
                            </DatePicker>
                        </FormItem>
                        <FormItem label="离校时间" v-if="payload.type == 2">
                            <DatePicker v-model="form.leave_school_time" type="date" placeholder="选择日期" :transfer="true">
                            </DatePicker>
                        </FormItem>
                        <FormItem label="学员类型" v-if="payload.type == 2">
                            <Select v-model="form.type" placeholder="请选择学员类型">
                                <Option label="普通" value="1"></Option>
                                <Option label="协议" value="2"></Option>
                                <Option label="个人返钱" value="3"></Option>
                                <Option label="个人不返钱" value="4"></Option>
                                <Option label="内部账号" value="-1"></Option>
                            </Select>
                        </FormItem>
                        <FormItem label="选择导师" v-if="payload.type == 2">
                            <Select v-model="form.tutor_user_id" placeholder="请选择导师">
                                <Option v-for="item in teachers" :key="item.id" :label="item.nickname"
                                        :value="item.user_id"></Option>
                            </Select>
                        </FormItem>
                        <FormItem label="选择学管" v-if="payload.type == 2">
                            <Select v-model="form.xg_user_id" placeholder="请选择学管">
                                <Option v-for="item in studentManagers" :key="item.id" :label="item.nickname"
                                        :value="item.user_id"></Option>
                            </Select>
                        </FormItem>
                        <FormItem label="状态" v-if="payload.type == 2">
                            <Select v-model="form.state" placeholder="请选择学员状态">
                                <Option label="正常" value="1"></Option>
                                <Option label="毕业" value="2"></Option>
                                <Option label="退学" value="3"></Option>
                                <Option label="延缓" value="4"></Option>
                                <Option label="删除" value="-1"></Option>
                            </Select>
                        </FormItem>
                        <FormItem label="特殊类型">
                            <Select v-model="form.is_test_user" placeholder="请选择学员特殊类型">
                                <Option label="正式学员" :value="0"></Option>
                                <Option label="测试学员" :value="1"></Option>
                            </Select>
                        </FormItem>
                        <div style="text-align: center">
                            <Button type="primary" class="sub-btn" @click="saveHandler">保存</Button>
                        </div>
                    </Form>
                </Row>
            </Row>
        </base-input>
    </Modal>
</template>

<script>
  import BaseInput from '../../components/BaseInput'
  import BaseList from '../../components/BaseList'
  import {RemoveModal} from './mixins'
  import UploadPanel from '../../components/UploadPanel'
  import {get_student_detail} from '../../api/modules/tools_student'
  import {get_list} from '../../api/modules/tools_product'
  import {search_user} from '../../api/modules/tools_user'
  import {Loading} from 'element-ui'
  import {Config} from '../../config/base'
  import {MPop} from '../../components/MessagePop'
  import {mapState} from 'vuex'

  export default {
    mixins: [RemoveModal, MPop],
    props: {
      remove: {
        type: String
      },
      payload: {}
    },
    components: {
      'base-input': BaseInput,
      'data-list': BaseList
    },
    data() {
      return {
        addStudentDialog: true,
        form: {
          project_id: this.$store.state.project.select_project_id,
          product_id: [],
          grade_id: 0,
          subject_id: 0,
          user_id: '',
          nickname: '',
          state: '',
          type: '',
          tutor_user_id: '',
          xg_user_id: '',
          _fn: null,
          is_send_offline_term: '',
          offline_term_id: '',
          realname: '',
          is_test_user: 0
        },
        searchType: 'phone',
        searchData: '',
        userList: [],
        loadingInstance: null,
        isSend: false,
        productList: []
      }
    },
    computed: {
      ...mapState({
        projectId: state => state.project.select_project_id
      }),
      projectList() {
        return this.$store.state.project.project_list;
      },
      subjectList() {
        return this.$store.state.subject.subject_list;
      },
      gradeList() {
        return this.$store.state.grade.grade_list;
      },
      teachers() {
        return this.$store.state.user.getTeachers;
      },
      studentManagers() {
        return this.$store.state.user.getStudentManagers;
      },
      dataList() {
        return this.$store.state.offline_curriculum.offline_term_list;
      },
      roleList() {
        return this.$store.state.roles.role_list;
      },
      dataHeader() {
        return [
          {
            prop: 'user_id',
            label: '用户ID',
            width: 80
          },
          {
            prop: 'nicname',
            label: '用户昵称',
            width: 100
          },
          {
            prop: 'phone',
            label: '手机号',
            width: 150
          },
          {
            label: '操作',
            groupBtn: [{
              text: '创建学员',
              param: 'create'
            }]
          }
        ]
      }
    },
    methods: {
        createStudentHandler(index, row){
            this.form.user_id = row.user_id;
            this.form.nickname = row.nickname;
            this.payload.showList = false;
        },
        searchStudent(){
            search_user(this.searchType, this.searchData, 0, 10, 0).then((res) => {
                    if (res.data.res_code === 1)  this.userList = res.data.msg.list;
            });
        },
        saveHandler() {
            if (this.payload.sid) {
                this.$store.dispatch('edit_student', this.form);
            } else {
                var formInline = this.form;
                this.$store.dispatch('add_student', formInline);
                formInline.callback = () => {
                  this.handleClose();
                    this.showPop('保存成功！',1000);
                }
            }
        },
      handleClose() {
        this.addStudentDialog = false;
      },
      handleUploadComplete(url) {
        this.form.img_url = url;
      },
      handleGetOfflineTermList() {
        this.form.is_send_offline_term = 1;
        if (this.$store.state.offline_curriculum.offline_term_list.length == 0) {
          this.$store.dispatch('get_offline_term_list', {
            project_id: this.$store.state.project.select_project_id,
            last_count: 0
          });
        }
      }
    },
    mounted() {
      this.$store.dispatch('get_grade_list');
      this.$store.dispatch('get_subject_list');
      this.$store.dispatch('get_teachers');
      this.$store.dispatch('get_student_managers');
      this.$store.dispatch('get_role');
      var vm = this;
      this.form._fn = function () {
        vm.handleClose();
      };
      this.form.user_id = this.payload.user_id;
      this.form.nickname = this.payload.nickname;

      get_list({project_id: this.projectId, page_index: 0, page_size: 99999}).then(res => {
        if (res.data.res_code === 1) {
          this.productList = res.data.msg.products;
        }
      })

      if (this.payload.sid) {
        this.loadingInstance = this.$LoadingY({message: "加载中，请稍后",show: true});
        setTimeout(() => {
          this.loadingInstance.close();
        }, Config.base_timeout);
        get_student_detail(this.payload.sid).then(res => {
                if (res.data.res_code === 1) {
                    this.form = res.data.msg;
                    this.form.student_id = this.payload.sid;
                    this.form.user_id = this.payload.user_id;
                    this.form.nickname = this.payload.nickname;
                    this.form.start_school_time = res.data.msg.start_school_time;
                    this.form.finish_school_time = res.data.msg.finish_school_time;
                    this.form.leave_school_time = res.data.msg.leave_school_time;
                    this.form.state = String(res.data.msg.state);
                    this.form.type = String(res.data.msg.type);
                    this.form.tutor_user_id = res.data.msg.tutor_user_id == 0 ? '' : res.data.msg.tutor_user_id;
                    this.form.xg_user_id = res.data.msg.xg_user_id;
                    this.form.realname = res.data.msg.realname;
                    this.form.is_test_user = res.data.msg.is_test_user;
                    this.form._fn = function() {
                        vm.handleClose();
                        vm.showPop('创建成功！',1000);
                    };
                   if(this.loadingInstance) this.loadingInstance.close();
                }
            })
        }
    }
  }
</script>
<style lang="scss" scoped>
/deep/.ivu-modal-body{
    padding: 24px 0 24px 0;
}
.body-top-showList{
    padding: 16px;
}
/deep/ .ivu-form-inline .ivu-form-item { margin-right: 0; }
.select-user-item{
    width: calc(100% - 75px)
}
/deep/ .ivu-select-selected-value {
    font-size: 14px !important;
}
.edirTable{
   width: 100%;
}
.sub-btn {
    background: #FB843E;
    border-radius: 4px;
    width: 60px;
    height: 36px;
    border: 0;
    position: relative;
    left: -2.6px;
}
#add-student-container {
    @import "base.scss";
    input,
    textarea {
        resize: none;
        outline: none;
    }
    .close-dialog-panel {
        position: absolute;
        top: -70px;
        right: -13.5px;
        z-index: 99999;
        font-size: 30px;
        cursor: pointer;
        &:before {
            // color: #fff;
            color: #757575;
        }
    }
        .search-bar {
            .select-user {
                margin-right: 10px;
            }
        }
}
</style>
