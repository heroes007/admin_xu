<template>
    <div class='manage-student-view'>
        <header-component title='查看用户' :noSelect="noSelect" :showAdd='true' addText='创建用户' @addClick='addUserHandler'></header-component>
        <Row class='sub-header'>
            <Breadcrumb separator="/">
                <BreadcrumbItem>用户管理</BreadcrumbItem>
                <BreadcrumbItem>查看用户</BreadcrumbItem>
            </Breadcrumb>
        </Row>
        <Row class='sub-header' type='flex' justify='space-between' align='middle'>
            <Row class='search-bar' type='flex' justify='end' align='middle'>
                <Select class='search-role' v-model="searchRole" placeholder="请选择" @on-change='searchStudent'>
                    <Option :label="item.role_name" :value="item.role_id" v-for='item in roleList' :key="item.id"></Option>
                </Select>
                <Form :inline='true' class='find-by-term'>
                    <FormItem>
                        <Row>
                            <Col :span="10">
                                <Select class="select-user" v-model="searchType" placeholder="" style="width: 100px">
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
                        <Button type="primary" @click="searchStudent">查询</Button>
                    </FormItem>
                    <FormItem>
                        <Button type="primary" @click="clearSearch">清除</Button>
                    </FormItem>
                </Form>
            </Row>
            <Modal v-model="showDealerDialog"
                   :styles="{width: '440px'}"
                   size="small"
                   :footer-hide="true"
                   class='add-student-view'>
                <div slot="header" class="modal-title">修改分站</div>
                <Row class='modal-user' type='flex' justify='center' align='middle'>
                    用户分站：
                    <Select v-model="userInfo.from_domain"  style="width:300px;">
                        <Option
                                v-for="(dealer_item,index) in dealer_list"
                                :key="index"
                                :label="dealer_item.company"
                                :value="dealer_item.id">
                        </Option>
                    </Select>
                </Row>
                <Row style="margin-top:50px;" type='flex' justify='center' align='middle'>
                    <Button type="primary" class="modal-btn-save" @click='changeDealer'>保存</Button>
                </Row>
            </Modal>
            <Modal :width="840" :transfer=false v-model="dialogVisible" size="small"
                   class='add-student-view'
                   :footer-hide="true"
                    :styles="{width: '900px'}">
                <div slot="header" class="modal-title">
                    用户信息
                </div>
                <Row class='result' type='flex' justify='center' align='middle'>
                    <div class='data-form' v-if='!isLoading'>
                        <Row class='user-info' type='flex' justify='start' align='middle'>
                            用户权限：
                            <Select v-model="userData.user_roles" multiple placeholder="请选择用户权限" style="width:300px;" @change='roleChangeHandler'>
                                <Option v-for='item in filterRoles' :key="item.id" :label="item.role_name" :value="item.role_id">
                                </Option>
                            </Select>
                        </Row>
                        <Row class='user-info' type='flex' justify='start' align='middle'>
                            用户ID：<span>{{userData.user_id}}</span>
                        </Row>
                        <Row class='user-info' type='flex' justify='start' align='middle'>
                            昵称：<span>{{userData.nickname}}</span>
                        </Row>
                        <Row class='user-info' type='flex' justify='start' align='middle'>
                            真实姓名：<span>{{userData.realname}}</span>
                        </Row>
                        <Row class='user-info' type='flex' justify='start' align='middle'>
                            电话：<span>{{userData.phone}}</span>
                        </Row>
                        <Row class='user-info' type='flex' justify='start' align='middle'>
                            用户头像：<img v-if="userData.head_img_url" :src='userData.head_img_url'>
                        </Row>
                        <Row class='user-info' type='flex' justify='start' align='middle'>
                            用户描述：<span>{{userData.description}}</span>
                        </Row>
                        <Row class='user-info' type='flex' justify='start' align='middle'>
                            性别：<span>{{userData.sex === 1?'男':'女'}}</span>
                        </Row>
                        <Row class='user-info' type='flex' justify='start' align='middle'>
                            用户邮箱：<span>{{userData.email}}</span>
                        </Row>
                        <Row class='user-info' type='flex' justify='start' align='middle'>
                            用户qq：<span>{{userData.qq}}</span>
                        </Row>
                        <Row class='user-info' type='flex' justify='start' align='middle'>
                            用户金币数：<span>{{userData.gold_count}}</span>
                        </Row>
                        <Row class='user-info' type='flex' justify='start' align='middle'>
                            使用的邀请码：<span>{{userData.from_invitation_code_id}}</span>
                        </Row>
                        <Row class='user-data' type='flex' justify='center' align='middle'>
                            <Button class="modal-btn-save" type="primary" @click='submit'>保存</Button>
                        </Row>
                    </div>
                </Row>
            </Modal>
        </Row>
        <Row class='total-num' type='flex' justfy='start' align='middle'>
            <span>当前用户 {{total}} 人</span>
        </Row>
        <Row class='data-container'>
            <div class='list'>
                <Table :columns="columns1" :data="list">
                    <template slot-scope="{ column, row, index }" slot="action">
                        <Button type="text" size="small" class="btn-text" @click="editDealer(row)">修改分站</Button>
                        <Button type="text" size="small" class="btn-text" @click="editUser(row)">编辑</Button>
                        <Button type="text" size="small" class="btn-text" @click="createStudent(row)">创建学员</Button>
                    </template>
                </Table>
                <Row class='pager' type='flex' justify='end' align='middle'>
                    <Page @on-page-size-change="handleSizeChange" @on-change="handleCurrentChange" :current="curPage" :page-size-opts="[20, 50, 100]"
                                   :page-size="pageSize" :total="total">
                    </Page>
                </Row>
            </div>
        </Row>
    </div>
</template>

<style scoped lang="scss" scoped>
    .modal-btn-save{
      width: 140px;
      height: 36px;
    }
     /deep/.ivu-btn:active, /deep/.ivu-btn.active{
      background-color: #7ab854 !important;
      color: #ffffff !important;
      border: none !important
    }
    /deep/.ivu-btn:focus{ box-shadow: none }
    /deep/ .ivu-table th { height: 50px; }
    /deep/ .ivu-breadcrumb{
        text-align: left;
        margin-left: 20px;
    }
    /deep/ .ivu-select-selected-value{
        font-size: 14px !important;
        padding: 3px 25px 3px 10px;
        line-height: 28px !important;
    }
    /deep/ .ivu-select-item{
        font-size: 14px !important;
        padding: 8px 10px;
        color: #48576a;
        line-height: 1.5;
    }
    /deep/ .ivu-modal-header{
        padding: 0;
    }
    /deep/ .ivu-icon-ios-close{
        color: #bfcbd9 !important;

        &:hover{
            color: #4098ff !important;
        }
    }
    /deep/ .ivu-modal-body{
        padding: 30px 20px;
    }
    /deep/ .ivu-table-cell{
        font-size: 16px;
        color: #657180;
        text-align: center;
    }
    /deep/ .ivu-table th{
        text-align: center;
    }
    /deep/ .ivu-select-placeholder{
        color: #8391a5 !important;
        font-size: 14px !important;
    }
    /deep/ .ivu-select-multiple .ivu-select-item-selected{
        color: #20a0ff;
    }
    /deep/ .ivu-select-multiple .ivu-select-item-selected:after{
        color: #20a0ff;

    }
    .modal-title{
        padding: 20px;
        text-align: center;
        background-color: #546573;
        color: #fff;
        font-size: 16px;
        font-weight: 700;
        border-radius: 6px 6px 0 0;
    }
    .modal-user{
        font-size: 14px;
    }
    .btn-text{
        color: #5fa137;
        font-size: 14px;
    }
    .total-num{
        font-size: 12px;
        color: #5fa137;
        margin: 0 20px 10px 20px;
    }
    .search-role{
        width: 200px;
        text-align: left;
    }
</style>

<script>
  import Header from "../../components/Header";
  import SubjectFilter from "../../components/SubjectFilter.vue";
  import api from "../../api/modules/config";
  import { set_user_student_mrzx } from "../../api/modules/student";
  import { Loading } from "element-ui";
  import { get_detail,changeDealer } from "../../api/modules/tools_user";
  import { get_list, set_role } from "../../api/modules/tools_role";
  import { Dialog } from "../dialogs";
  import { ADD_STUDENT, ADD_USER } from "../dialogs/types";
  import { Config } from "../../config/base";
  import Vue from "vue";

  let tooltips = { ellipsis: true, tooltip: true };
  export default {
    mixins: [Dialog],
    data() {
      return {
        userData: {
          user_id: 0,
          nickname: "",
          realname: "",
          phone: "",
          head_img_url: "",
          description: "",
          sex: 0,
          email: "",
          qq: "",
          gold_count: 0,
          from_invitation_code_id: ""
        },
        userInfo:{
          from_domain: '',
        },
        preRoleList: [],
        searchData: "",
        searchType: "phone",
        searchRole: 0,
        initData: false,
        dialogVisible: false,
        showDealerDialog:false,
        noSelect: true,
        initingRole: false,
        columns1: [
          {
            title: '用户ID',
            key: 'user_id',
          },
          {
            title: '用户昵称',
            key: 'nickname',
            ...tooltips
          },
          {
            title: '用户权限',
            key: 'roles',
            ...tooltips
          },
          {
            title: '手机号',
            key: 'phone'
          },
          {
            title: '分站',
            key: 'from_domain',
            width: 260
          },
          {
            title: '注册时间',
            key: 'create_time',
          },
          {
            title: '操作',
            slot: 'action',
            width: 260
          },
        ],
        data1: [],
        loadingInstance: null
      };
    },
    methods: {
      addUserHandler() {
        this.handleSelModal(ADD_USER);
      },
      handleSizeChange(val) {
        if (val !== this.pageSize) {
          this.$store.dispatch("get_user_list", {
            curPage: this.curPage,
            pageSize: val,
            role_id: this.searchRole
          });
        }
      },
      handleCurrentChange(val) {
        if (val && val !== this.curPage) {
          this.$store.dispatch("get_user_list", {
            curPage: val,
            pageSize: this.pageSize,
            role_id: this.searchRole
          });
        }
      },
      changeDealer(){
        changeDealer({
          change_user_id:this.userInfo.user_id,
          dealer_id:this.userInfo.from_domain
        }).then(res =>{
          res = res.data;
          if(res.res_code == 1){
            this.showDealerDialog = false;
            this.$Message.success('修改成功！');
            this.$store.dispatch("get_user_list", {
              curPage: this.curPage,
              pageSize: this.pageSize,
              role_id: this.searchRole
            });
          }
        })
      },
      // searchStudent() {
      // //   this.$store.dispatch("get_user_list", {
      // //     curPage: 1,
      // //     pageSize: 20,
      // //     role_id: this.searchRole
      // //   });

      //   if (!this.initData) this.initData = true;
      //   this.$store.dispatch("search_userinfo_by_nickname_or_phone", {
      //     searchType: this.searchType,
      //     searchData: this.searchData,
      //     role_id: this.searchRole
      //   });
      // },
      editDealer(item){
        this.userInfo = Object.assign({},item);
        this.dealer_list.map((item) => {
          if(this.userInfo.from_domain == item.company){
            this.userInfo.from_domain = item.id
          }
        })
        this.showDealerDialog = true;
      },
      editUser(item) {
        this.loadingInstance = this.$LoadingY({message: "加载中，请稍后",show: true});
        setTimeout(() => {
          this.loadingInstance.close();
        }, Config.base_timeout);
        get_detail(item.user_id).then(res => {
          if(this.loadingInstance) this.loadingInstance.close();
          if (res.data.res_code === 1) {
            this.userData = res.data.msg;
            if (res.data.msg.user_roles) {
              var userRoles = res.data.msg.user_roles;
              this.initingRole = true;
              this.userData.user_roles = [];
              this.preRoleList = [];
              for (var i = 0; i < userRoles.length; i++) {
                if (userRoles[i] !== 0) {
                  this.userData.user_roles.push(userRoles[i]);
                  this.preRoleList.push(userRoles[i]);
                }
              }
              let vm = this;
              Vue.nextTick(function() {
                vm.initingRole = false;
              });
            }
            this.dialogVisible = true;
          }
        });
      },
      submit() {
        this.dialogVisible = false;
      },
      roleChangeHandler(val) {
        var i, j;
        var isIn;
        var role_id;
        if (this.initingRole) return;
        if (val.length > this.preRoleList.length) {
          for (i = 0; i < val.length; i++) {
            isIn = false;
            for (j = 0; j < this.preRoleList.length; j++) {
              if (this.preRoleList[j] === val[i]) {
                isIn = true;
                break;
              }
            }
            if (!isIn) {
              role_id = val[i];
              break;
            }
          }
        } else {
          for (i = 0; i < this.preRoleList.length; i++) {
            isIn = false;
            for (j = 0; j < val.length; j++) {
              if (this.preRoleList[i] === val[j]) {
                isIn = true;
                break;
              }
            }
            if (!isIn) {
              role_id = this.preRoleList[i];
              break;
            }
          }
        }

        set_role(
          this.userData.user_id,
          role_id,
          val.length > this.preRoleList.length ? 1 : -1
        ).then(res => {
          if (res.data.res_code === 1) {
            if (val.length > this.preRoleList.length) {
              this.preRoleList.push(role_id);
            } else {
              this.preRoleList.splice(this.preRoleList.indexOf(role_id), 1);
            }
            this.$store.dispatch("change_user_role", {
              user_id: this.userData.user_id,
              roles: this.preRoleList.concat([0])
            });
          }
        });
      },
      searchStudent() {
        console.log(1);
        this.$store.dispatch("search_user_list", {
          type: this.searchType,
          param: this.searchData,
          curPage: 1,
          pageSize: 20,
          role_id: this.searchRole
        });
      },
      clearSearch() {
        this.searchData = "";
        this.$store.dispatch("search_user_list", {
          type: this.searchType,
          param: this.searchData,
          curPage: 1,
          pageSize: 20,
          role_id: this.searchRole
        });
      },
      createStudent(item) {
        this.handleSelModal(ADD_STUDENT, {
          type: 1,
          user_id: item.user_id,
          nickname: item.nickname
        });
      },
      getDealerStr(id) {
        var dealerStr = "";
        this.$store.state.dealer.dealer_list.forEach(function(element) {
          if (element.id == id) {
            dealerStr = element.company;
          }
        }, this);
        return dealerStr;
      },
      getRoleStr(roles) {
        var result = "";
        for (var i = 0; i < roles.length; i++) {
          for (var j = 0; j < this.roleList.length; j++) {
            if (roles[i] === this.roleList[j].role_id) {
              if (result !== "")
                result = result + "," + this.roleList[j].role_name;
              else result = result + this.roleList[j].role_name;
              break;
            }
          }
        }
        return result;
      },
      searchRoleChangeHandler() {
        this.$store.dispatch("get_user_list", {
          curPage: 1,
          pageSize: 20,
          role_id: this.searchRole
        });
      }
    },
    mounted() {
      console.log(document.querySelector('#columnx'));
      var vm = this;
      if (
        !this.$store.state.project.project_list ||
        this.$store.state.project.project_list == "token错误" ||
        this.$store.state.project.project_list.length === 0
      ) {
        this.$store.dispatch("get_project_list", {
          callback(v) {
            if (vm.list.length === 0) {
              vm.$store.dispatch("get_user_list", {
                curPage: 1,
                pageSize: 20,
                role_id: this.searchRole
              });
            }
          }
        });
      } else {
        this.$store.dispatch("get_user_list", {
          curPage: 1,
          pageSize: 20,
          role_id: this.searchRole
        });
      }

      this.$store.dispatch("get_role_list");
      this.$store.dispatch("get_dealer_list");
    },
    computed: {
      roleList() {
        return this.$store.state.roles.role_list;
      },
      list() {
        let list = this.$store.state.user.user_list.map((e,i)=>{
          let user  = Object.assign({},e);
          user.roles = this.getRoleStr(user.roles)
          user.from_domain = this.getDealerStr(user.from_domain)
          user.create_time = user.create_time.slice(0,10)
          return user;
        });
        return list;
      },
      dealer_list(){
        return this.$store.state.dealer.dealer_list;
      },
      pageSize() {
        return this.$store.state.user.pageSize;
      },
      curPage() {
        return this.$store.state.user.curPage;
      },
      total() {
        return this.$store.state.user.total;
      },
      isLoading() {
        return this.$store.state.user.isLoading;
      },
      searchResult() {
        return this.$store.state.user.search_result;
      },
      resultMsg() {
        return this.$store.state.user.search_msg;
      },
      filterRoles() {
        return this.roleList.filter(function(role) {
          if (role.role_id != 0) return true;
          return false;
        });
      }
    },
    components: {
      "header-component": Header,
    }
  };
</script>
