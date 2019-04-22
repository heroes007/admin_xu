<template>
 <div>
    <h2 @click="toLink">{{ text }}</h2>
 </div>
</template>

<script>
  export default {
    data(){
        return{
            text: '辅导老师后台首页'
        }
    },
    methods: {
        toLink(){
            this.$router.push('/job-list')
        }
    },
    mounted() {

    }
  }
</script>
<style lang="less" scoped>
</style>
