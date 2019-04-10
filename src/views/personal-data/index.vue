<template>
  <div class="personal">
      <h4>个人资料</h4>
  </div>
</template>

<script>
  export default {
    props: ['text', 'hide'],
    computed: {
      userInfo() {
        return JSON.parse(localStorage.getItem('PERSONALDETAILS'))
      },
    },
    mounted() {
     console.log(this.userInfo);
    }
  }
</script>
<style lang="less" scoped>
.personal{
   margin-top: 14%;
   margin: 0 auto;
}
</style>
