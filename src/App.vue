/**
* Created by lesonli on 2016/11/15.
*/
<template>
<div id="app" v-loading.fullscreen.lock='fullscreenLoading' element-loading-text="正在读取项目列表，请稍后...">
    <router-view></router-view>
</div>
</template>

<script>
import api from './api/modules/config'
import {
  logout
} from './api/modules/auth';
import {
    mapState
} from 'vuex'
import { Loading } from 'element-ui';
export default {
    data() {
        return {
            loadingInstance:null,
            fullscreenLoading:false
        }
    },
    computed: {
        ...mapState({
            projectShowLoading:state => state.project.isLoading
        }),
        userInfo() {
            return this.$store.state.auth.userInfo;
        },
        isLogin() {
            return this.$store.state.auth.isLogin;
        }
    },
    beforeCreate() {
        var vm = this;
        api.interceptors.request.use(function(config) {
            // Do something before request is sent
            if (config.data) {
                config.data.token = '' || vm.$localStorage.get('token');
            }
            else
            {
                config.data = {token:vm.$localStorage.get('token')}
            }

            return config;
        }, function(error) {
            // Do something with request error
            return Promise.reject(error);
        });
        api.interceptors.response.use(function(response) {
            // Do something with response data
            if (response.data.res_code < 0) {
                    if(response.data.res_code >= -999 &&  response.data.res_code <= -995)
                    {
                        vm.$router.push({
                            path: '/login'
                        });
                    }
                    else if (response.data.res_code == -6) {
                        vm.$router.push({
                            path: '/login'
                        });
                    } else {
                        vm.$alert(response.data.msg, '提示', {
                            confirmButtonText: '确定',
                            callback: action => {}
                        });
                    }
            }
            return response;
        }, function(error) {
            // Do something with response error
            return Promise.reject(error);
        });
        // if (vm.$route.name !== 'login')
        //     this.$store.dispatch('get_user_info');
    },
    mounted() {
        
    },
    watch: {
        userInfo(val) {
            //                if(val.role_arr.indexOf(1) > -1 || val.role_arr.indexOf(20) > -1)
            //                {
            //
            //                }
            //                else
            //                {
            //                    if(this.$route.name !== 'login')
            //                    {
            ////                            alert('权限验证错误，请重新登录！');
            ////                            api.post('api/user/logout',{}).then((res) => {
            ////                            if(res.data.res_code === 1)
            ////                            {
            ////                                this.$router.replace({path:'/login'});
            ////                            }
            ////                        });
            //                    }
            //                }
        },
        isLogin(val) {
            //                if(!val)
            //                {
            //                    if(this.$route.name !== 'login') {
            //                        alert('请先登录！');
            //                        api.post('api/user/logout', {}).then(res =>
            //                        {
            //                            if (res.data.res_code === 1) {
            //                                this.$router.replace({path: '/login'});
            //                            }
            //                        });
            //                    }
            //                }
        },
        projectShowLoading(val) {
            if(val)
            {
                // this.loadingInstance1 = Loading.service({ fullscreen: true,text:'正在读取项目列表，请稍后...' });
                this.fullscreenLoading = true;
           }
            else
            {
                // this.loadingInstance1.close();
                this.fullscreenLoading = false;
            }
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
    //align-items: center;
    //ustify-content: center;
    //height: 100%;
    margin: 0;
}

#app {
    color: #2c3e50;
    width: 100%;
    padding: 0;
    //margin-top: -100px;
    //max-width: 600px;
    //font-family: Source Sans Pro, Helvetica, sans-serif;
    font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
    text-align: center;
    a {
        //color: #42b983;
        text-decoration: none;
    }

    .el-dialog {
        border-radius: 10px;
        .el-dialog__header {
            border-radius: 10px 10px 0 0;
            background-color: #546573;
            padding: 20px;
            .el-dialog__title {
                color: #ffffff;
            }
        }
    }

    .el-breadcrumb {
        .el-breadcrumb__item {
            .el-breadcrumb__item__inner {
                color: #2E3E47;
            }
            &:last-child {
                .el-breadcrumb__item__inner {
                    color: #8B9FA9;
                }
            }
        }
    }
}

    .el-loading-mask {
        &.is-fullscreen {
            .el-loading-spinner {
                svg {
                    &.circular {
                    width: 80px;
                    height:80px
                }
                }
                
            }
            .el-loading-text {
                font-size: 18px;
            }
        }
    }

.sub-header {
    margin: 20px;
}
</style>
