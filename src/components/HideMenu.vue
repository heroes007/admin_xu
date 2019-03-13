<template>
  <div class="hide-menu-main">
      <img class="hide-menu-img" src="../assets/img/logo-white1.jpg" />
  </div>
</template>

<script>
  export default {
    props: ['text', 'hide'],
    mounted: function () {
      document.title = this.text;
    }
  }
</script>
<style lang="scss" scoped>
.hide-menu-main{
    width: 60px;
    height: 100%;
    background: #333333;
    box-shadow: 2px 0 10px 0 rgba(51,51,51,0.06);
    .hide-menu-img{
      margin-top: 30px;
      width: 40px;
      height: 39px;
    }
}
</style>
