<template>
    <Tabs value="tabName">
        <TabPane v-show='permissionCode1' label="管理列表" name="item1"><ManagementList :permission-item1="permissionItem1" /></TabPane>
        <TabPane v-show='permissionCode2' label="机构列表" name="item2"><ListInstitutions :permission-item2="permissionItem2" /></TabPane>
        <TabPane v-show='permissionCode3' label="导师列表" name="item3"><MentorList :permission-item3="permissionItem3" /></TabPane>
        <TabPane v-show='permissionCode4' label="学员列表" name="item4"><StudentList :permission-item4="permissionItem4" /></TabPane>
        <TabPane v-show='permissionCode5' label="讲师列表" name="item5"><LecturerList :permission-item5="permissionItem5" /></TabPane>
    </Tabs>
</template>

<script>
  import Vue from 'vue'
  import ManagementList from './ManagementList/index'
  import ListInstitutions from './ListInstitutions/index'
  import StudentList from './StudentList/index'
  import MentorList from './MentorList/index'
  import LecturerList from './LecturerList/index'
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
        permissionItem1: null,
        permissionItem2: null,
        permissionItem3: null,
        permissionItem4: null,
        permissionItem5: null,
        title1: '天涯',
        tabName: ''
      }
    },
    methods: {
      setAuth(n,t) {
        this[ 'permissionCode' + n ] = true
        this['permissionItem' + n] = t
      },
      handleAuth(){
        if(this.$PERMISSIONS1&&this.$PERMISSIONS1.hasOwnProperty('child')){
          let d = this.$PERMISSIONS1.child;
          d.forEach(t => {
            let n = +t.permission_code.slice(2,4)
            this.setAuth(n,t)
          });
          let num = + d[0].permission_code.slice(2,4)
          this.tabName = 'item' + num;
          this.permissionItem1 = d[0]
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

<style scoped lang="scss">

</style>
