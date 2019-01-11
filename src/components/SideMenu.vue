/** * Created by lesonli on 2016/11/16. */
<template>
    <div class='side-menu'>
        <Row class='logo' type='flex' justify='center' align='middle'>
            <img src='../assets/img/logo-white.png'>
        </Row>
        <Row class="head-img-row" type='flex' justify='center' align='middle'>
            <div class='head-img'>
                <img :src='userHeader'>
            </div>
           <Poptip trigger="hover" placement="right">
                <Button class='setting'>
                    <Icon class="icon-setting" type="md-settings" />
                    <div class='hover-glow'></div>
                </Button>
            <div slot="content">
                <Button type='text' class='quit' @click='logout'>
                    退出登录
                </Button>
            </div>
            </Poptip>
        </Row>
        <Row class='user-name'>
            <Tooltip :content="getRoleStr()" placement="right" theme="light">
                <p><Icon class="md-alerts" type="md-alert" /><span>{{ getRoleStr() }}</span></p>
            </Tooltip>
        </Row>
        <!-- <Row class='user-name' type='flex' justify='center' align='middle'> {{userInfo.nickname}}</Row> -->
        <Row>
            <Col>
             <Menu class="slider-menu" @on-open-change="openChange" @on-select="selectItem" :active-name='activeIndex' :open-names="openNames">
               <div v-for="it in menuList" :key="it.name">
                <Submenu  v-if="it.list&&it.check&&checkRole(it.check)" :name="it.name">
                    <template slot="title"><Icon :type="it.icon" />{{it.title}}</template>
                    <div v-for="(t, index) in it.list" :key="index">
                        <div v-if="t.check">
                            <MenuItem  v-if="routeName == t.name[1]" :name="t.name[1]">{{t.title}}</MenuItem>
                            <MenuItem  v-if="routeName != t.name[1]" :name="t.name[0]">{{t.title}}</MenuItem>
                        </div>
                        <MenuItem v-else :name="t.name">
                            <Badge v-if="t.name === 'notification-chat'" :count="unread_count"> {{t.title}}</Badge>
                            <span v-else>{{t.title}}</span>
                        </MenuItem>
                    </div>
                </Submenu>
                <MenuItem v-else :name="it.name"><Icon :type="it.icon" />{{it.title}}</MenuItem>
               </div>
            </Menu>
            </Col>
        </Row>
    </div>
</template>
<script>
    import api from '../api/modules/config'
    import defaultHeader from '../assets/img/side-menu/default-header.jpg'
    const server = require('socket.io-client')('http://api2.laoshi123.com:4006');
    import { mapActions,mapGetters } from 'vuex'
    import { MenuList } from './Util'
    export default {
        data() {
            return {
                use_router: true,
                activeIndex: "",
                openNames: ['6'],
                menuList: MenuList
            }
        },
        computed: {
            ...mapGetters({
                unread_count: 'unread_message_count'
            }),
            roleList() {
                return this.$store.state.roles.role_list;
            },
            userInfo() {
                return this.$store.state.auth.userInfo;
            },
            userHeader() {
                if (!this.userInfo) return defaultHeader;
                if (this.userInfo.head_img_url)  return this.userInfo.head_img_url;
                else return defaultHeader;
            },
            routeName() {
                return this.$route.name;
            }
        },
        watch: {
            $route() {
                this.initMenu();
            }
        },
        methods: {
            ...mapActions(['get_unread_list','add_unread_count']),
            checked(n){
                return this.userInfo.role_arr.includes(n)
            },
            checkRole(name){
                let role1 = this.checked(1);
                let role7 = this.checked(7);
                let role8 = this.checked(8);
                let role9 = this.checked(9);
                if(name === 'admin') return role1
                else if(name === 'manager'){
                    if(role1 || role7) return true
                    else return false
                }else if(name === 'teacher'){
                    if(role1 || role8) return true
                    else return false
                }
                else if(name === 'trader'){
                    if(role1 || role9) return true
                    else return false
                }
                // return true;
            },
            openChange(name) {
                console.log(name);
            },
            selectItem(index) {
                this.$router.push({ name: index });
            },
            initMenu() {
               this.activeIndex = this.$route.name;
            },
            logout() {
                api.post('api/user/logout', {}).then((res) => {
                    if (res.data.res_code === 1) {
                        this.$localStorage.set('token', '');
                        this.$router.push({ path: '/login' });
                    }
                });
            },
            getRoleStr() {
                var result = '';
                if (this.userInfo && this.roleList) {
                    for (var i = 0; i < this.userInfo.role_arr.length; i++) {
                        for (var j = 0; j < this.roleList.length; j++) {
                            if (this.userInfo.role_arr[i] === this.roleList[j].role_id) {
                                if (this.userInfo.role_arr[i] == 0) {
                                    continue;
                                }
                                if (result !== '') result = result + ',' + this.roleList[j].role_name;
                                else result = result + this.roleList[j].role_name;
                                break;
                            }
                        }
                    }
                }
                return result;
            }
        },
        mounted() {
            this.initMenu();
            if (this.$store.state.roles.role_list.length === 0) this.$store.dispatch('get_role_list');
            server.on('connect', () => {
                console.log(server.id); // 'G5p5...'
            });
            server.on(this.userInfo.user_id, data => {
                    this.$Notice.open({
                    title: '通知',
                    desc: '你收到一条新私信，请在我的通知里查看。'
                });
                this.add_unread_count(data);
            });
            server.on('disconnect', res => {
                console.log('disconnect')
                server.disconnect();
                server.close();
            });
            server.on('error', error => {
                console.log(error);
            })
            this.get_unread_list();
        }
    }
</script>
<style lang="scss" scoped>
    /deep/.ivu-menu{
        background-color: #333;
        width: 100% !important;
    }
    /deep/.ivu-menu-item, /deep/.ivu-menu-submenu-title{
        text-align: left;
        color: #fff;
    }
    /deep/.ivu-menu-vertical.ivu-menu-light:after{
        content: none !important
    }
    /deep/.ivu-menu-item-active{
         background-color: #333 !important;
    }
    /deep/.ivu-menu-item-active:not(.ivu-menu-submenu):after{
         background-color: #333 !important;
    }
    /deep/.ivu-poptip-body{
        padding: 0 
    }
    /deep/.ivu-poptip-popper{
        top: 60px !important
    }
    /deep/.ivu-btn-text, /deep/.ivu-btn{
        border: none
    }
    /deep/ .ivu-btn:focus{
        box-shadow: none
    }
    .el-popover {
        min-width: 105px;
        padding: 0;
        .quit {
            width: 105px;
            font-size: 14px;
            color: #1f2d3d;
            padding-left: 10px;
            text-align: left;
        }
    }
    .side-menu {
        padding: 27px 0;
        .logo {
            margin-bottom: 40px;
            img {
                width: 120px;
            }
        }
        .head-img-row{
            position: relative;
            .head-img {
            width: 100px;
            height: 100px;
            margin-bottom: 18px;
            img {
                width: 100%;
                border-radius: 50%;
            }
          }
        }
        .setting-popover {}
        .setting,.setting:hover {
            position: absolute;
            top: 0px;
            right: 0px;
            width: 26px;
            height: 26px;
            padding: 0;
            border-radius: 50%;
            border-color: #fc7643;
            background-color: #fc7643;
            color: #ffffff;
            text-align: center;
            line-height: 20px;
            .icon-setting{
                font-size: 18px;
            }
            cursor: pointer;
            .hover-glow {
                width: 34px;
                height: 34px;
                position: absolute;
                top: -4px;
                left: -4px;
                background-color: rgba(252, 118, 67, 0.2);
                border-radius: 50%;
                border: 0;
                display: none;
            }
            &:hover {
                .hover-glow {
                    display: block;
                }
            }
        }
        .user-name {
            font-size: 14px;
            color: #FFFFFF;
            letter-spacing: 0;
            white-space: nowrap;
            padding: 0 35px;
            p {
                display: -webkit-box;
                white-space: normal;
                -webkit-box-orient: vertical;
                overflow: hidden;
                -webkit-line-clamp: 1;
                .md-alerts {
                    color: #F06B1D;
                    margin-right: 10px;
                    font-size: 18px
                }
            }
            margin-bottom:50px;
        }
    }
</style>