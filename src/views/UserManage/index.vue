<template>
    <Tabs v-model="tabName" @on-click="tabs" class="tab-name">
        <TabPane v-if='permissionCode1' label="管理列表" name="item1"><ManagementList v-if="pane1" :permission-item1="permissionItem1" /></TabPane>
        <TabPane v-if='permissionCode2' label="机构列表" name="item2"><ListInstitutions v-if="pane2" :permission-item2="permissionItem2" /></TabPane>
        <TabPane v-if='permissionCode3' label="导师列表" name="item3"><MentorList v-if="pane3" :permission-item3="permissionItem3" /></TabPane>
        <TabPane v-if='permissionCode4' label="学员列表" name="item4"><StudentList v-if="pane4" :permission-item4="permissionItem4" /></TabPane>
        <TabPane v-if='permissionCode5' label="讲师列表" name="item5"><LecturerList  v-if="pane5" :permission-item5="permissionItem5" /></TabPane>
    </Tabs>
</template>
<script>
  import Vue from 'vue'
  import ManagementList from './ManagementList/index'
  import ListInstitutions from './ListInstitutions/index'
  import StudentList from './StudentList/index'
  import MentorList from './MentorList/index'
  import LecturerList from './LecturerList/index'
  import postData from 'src/api/postData'
  export default {
    name: "UserManage",
    components: { ManagementList, ListInstitutions, StudentList, MentorList, LecturerList },
    data(){
      return{
        permissionCode1: false,
        permissionCode2: false,
        permissionCode3: false,
        permissionCode4: false,
        permissionCode5: false,
        pane1: false,
        pane2: false,
        pane3: false,
        pane4: false,
        pane5: false,
        permissionItem1: null,
        permissionItem2: null,
        permissionItem3: null,
        permissionItem4: null,
        permissionItem5: null,
        tabName: ''
      }
    },
    methods: {
      setAuth(n,t) {
        this[ 'permissionCode' + n ] = true
        this['permissionItem' + n] = t
      },
      tabs(v){
        localStorage.setItem('UserManagePane',v)
        let n = +v.replace(/[^0-9]/ig,"");
        if(this[ 'permissionCode' + n ]) this['pane' + n] = true
      },
      handleAuth(){
        let d = this.$config.getAuth(1)
        if(d){
            d.forEach((t, k) => {
            let n = +t.permission_code.slice(2,4)
            this.setAuth(n,t)
            if(k === 0) this['pane' + n] = true
          }); 
        }
        if(localStorage.getItem('UserManagePane')){
          this.tabName = localStorage.getItem('UserManagePane')   
          this.tabs(this.tabName)
        }     
      }
    },
    mounted(){
       this.$nextTick(() => {
        this.handleAuth()
       })  
    }
  }
</script>

<style lang="scss" scoped>
  .tab-name, /deep/.ivu-tabs-content, .user-manage-main{
    height: 100% !important;
  }
  .user-manage-main{
    position: relative;
  }
  /deep/ .ivu-page{
    position: absolute;
    bottom: 60px;
    left: 0;
    right: 0;
    margin: 0 auto;
  }
</style>
