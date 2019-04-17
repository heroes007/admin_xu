<template>
<div>
    <h1 @click="toLink">{{ text }}</h1>
    <router-view :key="$route.fullPath"/>
</div>  
</template>

<script>
  export default {
    data(){
        return{
            text: '九划医教'
        }
    },
    methods: {
        toLink(){
            this.$router.push('/login')
        }
    },
    mounted() {

    }
  }
</script>
<style lang="less" scoped>
// h1{
//     background: #2d2d2d;
// }
</style>

