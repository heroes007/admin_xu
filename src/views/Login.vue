/** * Created by lesonli on 2016/11/16. */
<template>
    <div class='login-container'>
        <div class='login-view'>
            <div class='left-bar'></div>
            <!--<div class='middle-bar'></div>-->
            <el-row class='logo' type='flex' justify='left' align='middle'>
                <img src='../assets/img/logo-white.png'>
            </el-row>
            <div class='data-input'>
                <el-row justify='center' align='middle'>
                    <el-input placeholder="输入用户名" v-model="name">
                    </el-input>
                </el-row>
                <el-row justify='center' align='middle'>
                    <el-input type='password' placeholder="输入密码" v-model="password">
                    </el-input>
                </el-row>
                <el-row class='remember' type='flex' justify='space-between' align='middle'>
                    <div>
                        <el-switch v-model="remember" off-color='#cecece' on-color="#69BA6D" on-text='' off-text=''>
                        </el-switch>
                        记住我
                    </div>
                </el-row>
            </div>
            <el-row class='submit'>
                <el-button v-bind:class='{isLogining:isLogining}' :disabled='isLogining' v-on:click='doLogin'>
                    <el-row type='flex' justify='center' align='middle'><span>登录</span>
                        <ellipsis-ani v-if='isLogining' diameter="5px" pColor="#ffffff"></ellipsis-ani>
                    </el-row>
                </el-button>
            </el-row>
        </div>
    </div>
</template>

<script>
    import ellipsisAni from '../components/EllipsisAni';
    import api from '../api/modules/config';
    import { login_pwd, user_info } from '../api/modules/auth'

    export default {
        data() {
            return {
                name: '',
                password: '',
                remember: true,
                isLogining: false
            }
        },
        methods: {
            doLogin() {
                this.isLogining = true;
                var vm = this;
                login_pwd(this.name, this.password, 1).then((res) => {
                    if (res.data.res_code === 1) {
                        this.isLogining = false;
                        //                        this.$store.dispatch('get_role');


                        // this.$store.dispatch('get_user_info', { callback(){
                        //   vm.$router.replace({path: 'dashboard'});
                        // }});
                        user_info().then((res) => {
                            if (res.data.res_code === 1) {
                                if (res.data.msg.role_arr.indexOf(1) > -1 || res.data.msg.role_arr.indexOf(7) > -1
                                 || res.data.msg.role_arr.indexOf(8) > -1 || res.data.msg.role_arr.indexOf(9) > -1) {
                                    vm.$store.dispatch('set_user_info', res.data.msg);
                                    vm.$router.replace({ path: 'project' });
                                }
                                else {
                                    // vm.$alert('权限错误，请重新登录！', '提示', {
                                    //     confirmButtonText: '确定',
                                    //     callback: action => { }
                                    // });
                                }
                            }
                        })

                        this.remember ? this.$localStorage.set('login_user', this.name) : this.$localStorage.remove('login_user');
                        this.$localStorage.set('token', res.data.token);
                    }
                    else {
                        this.isLogining = false;
                        // alert('登录失败，' + res.data.msg);
                    }
                });
            }
        },
        mounted() {
            this.$localStorage.get('login_user') ? this.name = this.$localStorage.get('login_user') : this.name = '';
        },
        components: {
            'ellipsis-ani': ellipsisAni
        }
    }

</script>
<style lang="scss">
    body {
        background-color: #fff;
        height: 100%;
    }
    
    .login-container {
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        background: #ffffff;
    }
    
    .login-view {
        margin-top: -100px;
        max-width: 600px;
        position: relative;
        background-color: #333333;
        box-shadow: 0 0 20px 0 rgba(51, 51, 51, 0.30);
        padding: 111px 0 170px 20px;
        border-radius: 0 20px 20px 0;
        .left-bar {
            position: absolute;
            left: 0;
            top: 0;
            width: 20px;
            height: 100%;
            background-color: #141111;
        }
        .middle-bar {
            position: absolute;
            left: 40px;
            top: 0;
            width: 10px;
            height: 100%;
            background-color: #fc7643;
            z-index: 999;
        }
        img {
            width: 136px;
            margin-left: 75px;
        }
        .data-input {
            background-color: #ffffff;
            //width:380px;
            padding: 20px 40px 20px 60px;
        }
        .el-row {
            &.logo {
                margin-bottom: 25px;
                img {
                    opacity: 0.5;
                }
            }
            margin-bottom: 14px;
            &.remember {
                margin-bottom: 0;
                margin-top: 13px;
                .el-switch {
                    margin-right: 12px;
                }
                font-size: 14px;
                color: #858585;
            }
            &.submit {
                .el-button {
                    width: 100%;
                    height: 40px;
                    border-radius: 0;
                    border: 0;
                    background-color: #FB843E;
                    &.isLogining {
                        color: #ffffff;
                    }
                    color: #ffffff;
                    font-size: 16px;
                    .el-row {
                        margin-bottom: 0;
                        span {
                            margin-right: 5px;
                        }
                    }
                }
            }
            .el-input {
                .el-input__inner {
                    width: 278px;
                    height: 48px;
                    border-color: #b0bec5;
                    border-radius: 0 8px 8px 0;
                    background-color: #f7f9fa;
                    color: #1f2d3d;
                    &:focus {
                        border-color: #69BA6D;
                        background-color: #ffffff;
                    }
                }
                ::-webkit-input-placeholder {
                    color: #99ABB4;
                }
                :-moz-placeholder {
                    color: #99ABB4;
                }
                ::-moz-placeholder {
                    color: #99ABB4;
                }
                :-ms-input-placeholder {
                    color: #99ABB4;
                }
            }
        }
    }
</style>