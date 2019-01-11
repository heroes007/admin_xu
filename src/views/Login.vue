<template>
    <div class='login-container'>
        <div class='login-view'>
            <div class='left-bar'></div>
            <div class='logo'>
                <img src='../assets/img/logo-white.png'>
            </div>
            <div class='data-input'>
                <div class="elRow">
                    <input  class="el-input" placeholder="输入用户名" v-model="name" />
                </div>
                <div class="elRow">
                    <input class="el-input" type='password' placeholder="输入密码" v-model="password" />
                </div>
                <div class='remember elRowJustifyLeft'>
                    <Switch v-model="remember" />
                    <span class="rememberMeText">记住我</span>
                </div>
            </div>
            <div class='submit'>
                <Button class="el-button" :class='{isLogining:isLogining}' :disabled='isLogining' @click='doLogin' long>
                    <div class="elRow"><span>登录</span>
                        <EllipsisAni v-if='isLogining' diameter="5px" pColor="#ffffff"></EllipsisAni>
                    </div>
                </Button>
            </div>
        </div>
    </div>
</template>
<script>
    import EllipsisAni from '../components/EllipsisAni';
    import api from '../api/modules/config';
    import { login_pwd, user_info } from '../api/modules/auth'
    export default {
        components: {  EllipsisAni  },
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
                let vm = this;
                login_pwd(this.name, this.password, 1).then((res) => {
                    if (res.data.res_code === 1) {
                        this.isLogining = false;
                        // this.$store.dispatch('get_role');
                        // this.$store.dispatch('get_user_info', { callback(){
                        //   vm.$router.replace({path: 'dashboard'});
                        // }});
                        user_info().then((res) => {
                            console.log(res);
                            if (res.data.res_code === 1) {
                                let roleArr = res.data.msg.role_arr
                               if (roleArr.includes(1) || roleArr.includes(7) || roleArr.includes(8) || roleArr.includes(9)) {
                                    vm.$store.dispatch('set_user_info', res.data.msg);
                                    vm.$router.replace({ path: 'project' });
                                }else vm.$Message.warning('权限错误，请重新登录');
                            }
                        })
                        this.remember ? this.$localStorage.set('login_user', this.name) : this.$localStorage.remove('login_user');
                        this.$localStorage.set('token', res.data.token);
                    } else {
                        vm.$Message.warning(res.data.msg);
                        this.isLogining = false;
                    }
                });
            }
        },
        mounted() {
            this.$localStorage.get('login_user') ? this.name = this.$localStorage.get('login_user') : this.name = '';
        }
    }

</script>
<style lang="scss" scoped>
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
        img {
            width: 136px;
        }
        .data-input {
            background-color: #ffffff;
            //width:380px;
            padding: 20px 40px 20px 60px;
        }
        .elRow {
            &.logo {
                margin-bottom: 25px;
                display: flex;
                align-items: center;
                box-sizing: border-box;
                img {
                    opacity: 0.5;
                }
            }
            margin-bottom: 14px;
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
                    .elRow {
                        margin-bottom: 0;
                        span {
                            margin-right: 5px;
                        }
                    }
                }
            }
            .el-input {
                width: 278px;
                height: 48px;
                border: 1px solid #b0bec5;
                border-radius: 0 8px 8px 0;
                background-color: #f7f9fa;
                color: #1f2d3d;
                &:focus {
                    border-color: #69BA6D;
                    background-color: #ffffff;
                    outline: none
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
        .remember {
            margin-bottom: 0;
            margin-top: 13px;
            font-size: 14px;
            color: #858585;
            .rememberMeText {
                margin-left: 12px
            }
        }
    }
    .ivu-switch-checked{
        background-color: #69BA6D !important;
        border-color: #69BA6D !important
    }
    .ivu-btn,.ivu-btn:hover{
        width: 100%;
        height: 40px;
        border-radius: 0;
        border: 0;
        background-color: #FB843E;
        color: #ffffff;
        font-size: 16px;
        line-height: 29px;
    }
</style>
