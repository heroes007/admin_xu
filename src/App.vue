<template>
    <div id="app">
        <router-view></router-view>
    </div>
</template>

<script>
  import api from './api/modules/config'
  import {logout} from './api/modules/auth';

  export default {
    beforeCreate() {
      let vm = this;
      api.interceptors.request
        .use(function (config) {
          if (config.data) config.data.token = '' || vm.$localStorage.get('token');
          else config.data = {token: vm.$localStorage.get('token')}
          return config;
        }, function (error) {
          return Promise.reject(error);
        });
      api.interceptors.response
        .use(function (response) {
          if (response.data.res_code < 0) {
            let code = response.data.res_code;
            if ((code >= -999 && code <= -995) || (code == -6)) vm.$router.push({path: '/login'});
            // else vm.$Message.warning(response.data.msg);
          }
          return response;
        }, function (error) {
          return Promise.reject(error);
        });
    }
  }
</script>
<style lang="scss">
    html {
        height: 100%;
    }

    body {
        height: 100%;
        width: 100%;
        margin: 0;
    }

    #app {
        color: #2c3e50;
        width: 100%;
        height: 100%;
        padding: 0;
        font-family: "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
        text-align: center;

        a {
            text-decoration: none;
        }

        overflow: hidden;
    }

    .sub-header {
        // margin: 20px;
    }

</style>
