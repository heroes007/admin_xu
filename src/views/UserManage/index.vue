<template>
    <Tabs value="manage">
        <TabPane label="管理列表" name="manage">标签一的内容</TabPane>
        <TabPane label="机构列表" name="product">标签二的内容</TabPane>
        <TabPane label="导师列表" name="teacher">标签三的内容</TabPane>
        <TabPane label="学员列表" name="user"><student/></TabPane>
    </Tabs>
</template>

<script>
    import student from '../student/ManageStudent'
  export default {
    name: "index",
    components: {student}
  }
</script>

<style scoped lang="scss">

</style>
