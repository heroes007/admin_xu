<template>
    <div class='login-container'>
        <div class="login-view" :style="loginViewStyl">
            <div class="login-left"></div>
            <div class='login-right'>
                <div class='logo'>
                    <img src='/static/img/logo_copy.png'>
                </div>
                <h1 class="login-title">九划医疗后台管理系统</h1>
                <div class='data-input'>
                    <div class="elRow">
                        <img class="input-img" src='/static/img/head.png'>
                        <span class="input-span">|</span>
                        <input  class="el-input" placeholder="输入用户名" v-model="name" />
                    </div>
                    <div class="elRow">
                        <img class="input-img" src='/static/img/lock.png'>
                        <span class="input-span">|</span>
                        <input class="el-input" type='password' placeholder="输入密码" v-model="password" @keyup.enter="doLogin"/>
                    </div>
                    <!-- <div class='remember elRowJustifyLeft'>
                        <Switch v-model="remember" />
                        <span class="rememberMeText">记住我</span>
                    </div> -->
                </div>
                <div class='submit'>
                    <Button class="Button login-btn" :class='{isLogining:isLogining}' :disabled='isLogining' @click='doLogin' long>
                        <div class="elRow"><span>登录</span>
                            <EllipsisAni v-if='isLogining' diameter="5px" pColor="#ffffff"></EllipsisAni>
                        </div>
                    </Button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import EllipsisAni from '../components/EllipsisAni';
    import api from '../api/modules/config';
    import { login_pwd, user_info } from '../api/modules/auth';
    import { Base64 } from 'js-base64';
    import { mapState, mapActions } from 'vuex';
    import Vue from 'vue'
    export default {
        components: {  EllipsisAni  },
        data() {
            return {
                name: '',
                password: '',
                remember: true,
                isLogining: false,
                loginViewStyl: {},
                projectData: []
            }
        },
        computed: {
            ...mapState({ isLoading: state => state.project.isLoading })
        },
        watch: {
            isLoading(val) {
               this.$config.IsLoading(val);
            }
        },
        methods: {
             ...mapActions([ "get_project_list", "change_selected_project_id", "clear_store" ]),
            doLogin() {
                this.isLogining = true;
                login_pwd(this.name, this.password).then((res) => {
                    if (res.data.res_code === 1) {
                        this.isLogining = false;
                        let d = res.data.data;
                        localStorage.setItem('organizationId',d.userInfo[0].organization_id)
                        this.$store.dispatch('set_user_info', d.userInfo[0]);
                        localStorage.setItem('PERSONALDETAILS',JSON.stringify(d.userInfo[0]))
                        this.$router.push({ path: 'dashboard' });
                        localStorage.setItem('PERMISSIONS',Base64.encode('学格科技' + JSON.stringify(d.permissions)))
                        localStorage.setItem('token',d.token)
                        this.remember ? this.$localStorage.set('login_user', Base64.encode('天涯'+JSON.stringify({name:this.name,pass:this.password}))) : this.$localStorage.remove('login_user');
                    } else {
                        this.$Message.warning(res.data.msg);
                        this.isLogining = false;
                    }
                });
            },
            setUser({name,pass}){
              this.name = name
              this.password = pass
            }
        },
        mounted() {
            if(this.$localStorage.get('login_user')){
              let user = Base64.decode(this.$localStorage.get('login_user'))
              let u = JSON.parse(user.slice(2))
              this.setUser(u)
            }else this.setUser({name:'',pass:''})
            let hei = document.documentElement.clientHeight * .555;
            this.loginViewStyl = { 'width' :  (hei > 480 ? hei : 480) * 2 + 'px'}
            this.get_project_list();
        }
    }

</script>
<style lang="scss" scoped>
    .login-container {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 100%;
        background-image: url("../../static/img/bitmap_bg.jpg");
        background-repeat: no-repeat;
        background-size: 100% 100%;
    }
    .login-view{
        // width: 62.5%;
        height: 55.5%;
        display: flex;
        flex-wrap: nowrap;
        min-height: 480px;
        .login-left {
            width: 50%;
            height: 100%;
            background-image: url("../../static/img/bitmap.png");
            background-repeat: no-repeat;
            background-size: 100% 100%;
            min-height: 480px;
        }
        .login-right {
            width: 50%;
            height: 100%;
            min-height: 480px;
            position: relative;
            background-color: #fff;
            padding-left: 10%;
            padding-right: 10%;
            padding-top: 9%;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: flex-start;
            .logo {
                width: 100%;
                margin-bottom:10.8%;
                position: relative;
                height: 38px;
                img {
                    height: 38px;
                    width: 136px;
                    float: left;
                }
            }
            .login-title{
                width: 100%;
                font-family: PingFangSC-Semibold;
                font-size: 24px;
                color: #333333;
                letter-spacing: 0;
                text-align: left;
                margin-bottom: 10.8%;
            }
            .data-input{
               width: 100%;
               .elRow {
                    margin-bottom: 14px;
                    border-bottom: 1px solid #EEE;
                    .input-img{
                        width: 18px;
                        height: 18px;
                        margin-right: 10px;
                    }
                    .input-span{
                        margin-right: 10px;
                        color: #EEE
                    }
                    /deep/ .ivu-select-single .ivu-select-selection{
                        width: 100%;
                        height: 48px;
                    }
                    /deep/ .ivu-select-selection{
                        border:none
                    }
                    /deep/ .ivu-select-visible .ivu-select-selection{
                        box-shadow: none
                    }
                    .el-input {
                        width: 100%;
                        height: 48px;
                        border: none;
                        color: #1f2d3d;
                        &:focus {
                            border-color: #3DAAFF;
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
            .submit{
                margin-top: 10.8%;
                width: 60%;
                height: 50px;
            }
        }
    }
    .ivu-switch-checked{
        background-color: #69BA6D !important;
        border-color: #69BA6D !important
    }
    .ivu-btn,.ivu-btn:hover{
        width: 100%;
        height: 50px;
        border-radius: 25px;
        border: 0;
        background-color: #3DAAFF;
        color: #ffffff;
        font-size: 16px;
        line-height: 29px;
    }
</style>
