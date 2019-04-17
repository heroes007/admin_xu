<template>
  <h2 @click="toLink">{{ text }}</h2>
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
            this.$router.push('/tutor/1/job-list')
        }
    },
    mounted() {

    }
  }
</script>
