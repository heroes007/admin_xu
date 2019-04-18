<template>
<div>
    <div class="head">
        <img class="logo-img" src='../../assets/img/logo-white1.jpg'>
        <div class="logo-title">九划医教</div>
        <div class="logout">
            <Poptip trigger="hover" title="">
                <template slot="content">
                    <Button type='text' class='quit' @click='logout'>退出登录</Button>
                </template>
                <img class="head-img" src="https://tse3-mm.cn.bing.net/th?id=OIP.GjSwE14LltvsZRy3PCxNEgHaEo&w=300&h=187&c=7&o=5&dpr=2&pid=1.7"/>
            </Poptip>
        </div>
    </div>
    <router-view :key="$route.fullPath"/>
</div>  
</template>

<script>
  export default {
    methods: {
        logout(){
            this.$router.push('/login')
        }
    },
    mounted() {

    }
  }
</script>
<style lang="less" scoped>
.head{
    height: 60px;
    display: flex;
    align-items: center;
    position: relative;
    background: #2d2d2d;
    padding: 0 50px;
    .logout{
        position: absolute;
        right: 40px;
    }
    .head-img{
        width: 34px;
        height: 34px;
        border-radius: 17px
    }
}
/deep/ .ivu-poptip-body{
    padding: 0;
}
/deep/ .ivu-poptip-popper{
    min-width: 96px;
}
</style>

