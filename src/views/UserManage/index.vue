<template>
    <Tabs value="name1">
        <TabPane label="管理列表" name="manage">
          <ManagementList />
        </TabPane>
        <TabPane label="机构列表" name="product">标签二的内容</TabPane>
        <TabPane label="导师列表" name="teacher">标签三的内容</TabPane>
        <TabPane label="学员列表" name="user">标签三的内容</TabPane>
    </Tabs>
</template>

<script>
  import ManagementList from './ManagementList'
  export default {
    name: "UserManage",
    components: { ManagementList }
  }
</script>

<style scoped>

</style>
