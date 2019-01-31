<template>
    <div id="app">
        <router-view></router-view>
    </div>
</template>

<script>
    import api from './api/modules/config'
    import {logout} from './api/modules/auth';
    import {mapState} from 'vuex'
    export default {
        data() {
            return { fullscreenLoading: null}
        },
        computed : {
            ...mapState({ projectShowLoading: state => state.project.isLoading })
        },
        beforeCreate() {
            var vm = this;
            api.interceptors.request
                .use(function (config) {
                    if (config.data)  config.data.token = '' || vm.$localStorage.get('token');
                    else  config.data = { token: vm.$localStorage.get('token') }
                    return config;
                },function (error) {
                    return Promise.reject(error);
                });
            api.interceptors.response
                .use(function (response) {
                    if (response.data.res_code < 0) {
                        let code = response.data.res_code;
                        if ((code >= -999 && code <= -995) || (code == -6))  vm.$router.push({path: '/login'});
                        else vm.$Message.warning(response.data.msg);
                    }
                    return response;
                }, function (error) {
                    return Promise.reject(error);
                });
        },
        watch : {
            projectShowLoading(val) {
                if (val) this.fullscreenLoading = this.$LoadingY({message: "正在读取项目列表，请稍后...", show: true})
                else if (this.fullscreenLoading) this.fullscreenLoading.close()
            }
        }
    }
</script>
<style lang="scss">
    html {
        height: 100%;
    }
    body {
        display: flex;
        height: 100%;
        margin: 0;
    }
    #app {
        color: #2c3e50;
        width: 100%;
        height: 100%;
        padding: 0;
        font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
        text-align: center;
        a {
            text-decoration: none;
        }
    }
    .sub-header {
        margin: 20px;
    }

</style>
