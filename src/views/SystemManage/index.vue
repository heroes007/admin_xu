<template>
    <Tabs value="lb">
        <TabPane label="广告图" name="lb">
            <lb/>
        </TabPane>
        <TabPane label="行业资讯" name="news">
            <news/>
        </TabPane>
        <TabPane label="通知管理" name="notification">
            <notification/>
        </TabPane>
    </Tabs>
</template>

<script>
    import lb from '../lb/ManageLb'
    import news from '../news/ManageNews'
    import notification from '../information/ManageNotification'
  export default {
    name: "index",
    components:{lb, news, notification}
  }
</script>

<style scoped>

</style>
