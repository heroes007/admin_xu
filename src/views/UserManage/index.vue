<template>
    <Tabs value="name1">
        <TabPane label="管理列表" name="manage">
          <ManagementList />
        </TabPane>
        <TabPane label="机构列表" name="product"><ListInstitutions /></TabPane>
        <TabPane label="导师列表" name="teacher"><MentorList /></TabPane>
        <TabPane label="学员列表" name="user"><StudentList/></TabPane>
    </Tabs>
</template>

<script>
  import ManagementList from './ManagementList/index'
  import ListInstitutions from './ListInstitutions/index'
  import StudentList from './StudentList/index'
  import MentorList from './MentorList/index'
  export default {
    name: "UserManage",
    components: { ManagementList, ListInstitutions, StudentList, MentorList }
  }
</script>

<style scoped lang="scss">

</style>
