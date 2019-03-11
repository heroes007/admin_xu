<template>
    <Tabs value="name1">
        <TabPane label="管理列表" name="manage"><ManagementList /></TabPane>
        <TabPane label="机构列表" name="product"><ListInstitutions /></TabPane>
        <TabPane label="导师列表" name="teacher"><MentorList /></TabPane>
        <TabPane label="学员列表" name="user"><StudentList/></TabPane>
        <TabPane label="讲师列表" name="lecturer"><LecturerList/></TabPane>
    </Tabs>
</template>

<script>
  import ManagementList from './ManagementList/index'
  import ListInstitutions from './ListInstitutions/index'
  import StudentList from './StudentList/index'
  import MentorList from './MentorList/index'
  import LecturerList from './LecturerList/index'
  export default {
    name: "UserManage",
    components: { ManagementList, ListInstitutions, StudentList, MentorList, LecturerList }
  }
</script>

<style scoped lang="scss">

</style>
