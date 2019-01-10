/** * Created by lesonli on 2016/11/16. */
<template>
    <div class='side-menu'>
        <Row class='logo' type='flex' justify='center' align='middle'>
            <img src='../assets/img/logo-white.png'>
        </Row>
        <Row type='flex' justify='center' align='middle'>
            <div class='head-img'>
                <img :src='userHeader'>
            </div>
            <el-popover popper-class='setting-popover' ref="popover1" placement="right" trigger="hover">
                <el-button type='text' class='quit' @click='logout'>
                    退出登录
                </el-button>
            </el-popover>

            <el-button class='setting' v-popover:popover1>
                <i class='el-icon-setting'>

                </i>
                <div class='hover-glow'></div>
            </el-button>
        </Row>
        <Row class='user-name'>
            <el-tooltip :content="getRoleStr()" placement="right" effect="light">
                <p><i class='el-icon-information'></i><span>{{ getRoleStr() }}</span></p>
            </el-tooltip>
        </Row>
        <!--<Row class='user-name' type='flex' justify='center' align='middle'>-->
        <!--{{userInfo.nickname}}-->
        <!--</Row>-->
        <Row>
            <Col>
                <el-menu class="slider-menu" @open="handleOpen" @close="handleClose" @select="selectItem" :default-active='activeIndex'>
                    <el-submenu index="1" v-if="checkRole('admin')">
                        <template slot="title"><i class="xght-webfont-folder-open"></i>超级管理员</template>
                        <el-menu-item index="manage-user">查看用户</el-menu-item>
                        <el-menu-item index="manage-lb">广告图管理</el-menu-item>
                        <el-menu-item index="manage-app">平台更新</el-menu-item>
                        <el-menu-item index="manage-news">点师动态</el-menu-item>
                        <el-menu-item index="statistics-data">点击量统计</el-menu-item>
                        <el-menu-item index="from-page-data">页面来源统计</el-menu-item>
                    </el-submenu>
                    <el-submenu index="2" v-if="checkRole('manager')">
                        <template slot="title"><i class="xght-webfont-folder-open"></i>学员管理</template>
                        <el-menu-item index="manage-student">查看学员</el-menu-item>
                        <el-menu-item index="manage-recruit">招生管理</el-menu-item>
                        <el-menu-item index="redeem-code">兑换码管理</el-menu-item>
                        <el-menu-item index="notification-chat">
                            我的通知<el-badge class="mark" :value="unread_count" />
                        </el-menu-item>
                    </el-submenu>
                     <el-submenu index="3" v-if="checkRole('teacher')">
                        <template slot="title"><i class="xght-webfont-folder-open"></i>我是导师</template>
                        <el-menu-item index="manage-my-assignment">我的指导</el-menu-item>
                        <el-menu-item index="manage-my-interview">我的面试</el-menu-item>
                    </el-submenu>
                    <el-submenu index="4" v-if="checkRole('manager')">
                        <template slot="title"><i class="xght-webfont-folder-open"></i>创建管理</template>
                        <el-menu-item index="online-course" v-show="routeName != 'online-course-chapter'">线上课</el-menu-item>
                        <el-menu-item index="online-course-chapter" v-show="routeName == 'online-course-chapter'">线上课</el-menu-item>
                        <el-menu-item index="offline-course" v-show="routeName != 'offline-course-manage-signup'">线下课</el-menu-item>
                        <el-menu-item index="offline-course-manage-signup" v-show="routeName == 'offline-course-manage-signup'">线下课</el-menu-item>
                        <el-menu-item index="task">任务包</el-menu-item>
                        <el-menu-item index="course-download-data">课程资料</el-menu-item>
                        <el-menu-item index="public-download-data">推荐资料</el-menu-item>
                    </el-submenu>
                    <!--<el-submenu index="5" v-if="checkRole('manager')">
                        <template slot="title"><i class="xght-webfont-folder-open"></i>资料管理</template>
                        <el-menu-item index="course-download-data">课程资料</el-menu-item>
                        <el-menu-item index="public-download-data">推荐资料</el-menu-item>
                    </el-submenu>-->
                    <el-submenu index="6" v-if="checkRole('admin')">
                        <template slot="title"><i class="xght-webfont-folder-open"></i>产品管理</template>
                        <el-menu-item index="manage-production" v-show="routeName != 'manage-production-curriculum'">产品信息</el-menu-item>
                        <el-menu-item index="manage-production-curriculum" v-show="routeName == 'manage-production-curriculum'">产品信息</el-menu-item>
                        <el-menu-item index="manage-production-group">产品组合</el-menu-item>
                    </el-submenu>
                    <el-menu-item index="manage-project"><i class="xght-webfont-folder-open"></i>项目管理</el-menu-item>
                </el-menu>
            </Col>
        </Row>
    </div>
</template>

<script>
    import api from '../api/modules/config'
    import defaultHeader from '../assets/img/side-menu/default-header.jpg'
    const server = require('socket.io-client')('http://api2.laoshi123.com:4006');
    import {
        mapActions,mapGetters
    } from 'vuex'
    export default {
        data() {
            return {
                use_router: true,
                activeIndex: ''
            }
        },
        methods: {
            ...mapActions([
                'get_unread_list',
                'add_unread_count'
            ]),
            checkRole(name){
                if(name === 'admin')
                {
                    if(this.userInfo.role_arr.indexOf(1) > -1)
                    {
                        return true;
                    }
                    return false;
                }
                else if(name === 'manager')
                {
                    if(this.userInfo.role_arr.indexOf(1) > -1 || this.userInfo.role_arr.indexOf(7) > -1)
                    {
                        return true;
                    }
                    return false;
                }
                else if(name === 'teacher')
                {
                    if(this.userInfo.role_arr.indexOf(1) > -1 || this.userInfo.role_arr.indexOf(8) > -1)
                    {
                        return true;
                    }
                    return false;
                }
                else if(name === 'trader')
                {
                    if(this.userInfo.role_arr.indexOf(1) > -1 || this.userInfo.role_arr.indexOf(9) > -1)
                    {
                        return true;
                    }
                    return false;
                }
                return true;
            },
            handleOpen(key, keyPath) {
                //console.log(key, keyPath);
            },
            handleClose(key, keyPath) {
                //console.log(key, keyPath);
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
                                if (result !== '')
                                    result = result + ',' + this.roleList[j].role_name;
                                else
                                    result = result + this.roleList[j].role_name;
                                break;
                            }
                        }
                    }
                }
                return result;
            }
        },
        watch: {
            $route() {
                this.initMenu();
            }
        },
        mounted() {
            this.initMenu();
            if (this.$store.state.roles.role_list.length === 0)
                this.$store.dispatch('get_role_list');


            server.on('connect', () => {
                console.log(server.id); // 'G5p5...'
            });

            server.on(this.userInfo.user_id, data => {
                  this.$notify({title: '通知',
                        message: '你收到一条新私信，请在我的通知里查看。'
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
                if (!this.userInfo)
                    return defaultHeader;
                if (this.userInfo.head_img_url) {
                    return this.userInfo.head_img_url;
                }
                else {
                    return defaultHeader;
                }
            },
            routeName() {
                return this.$route.name;
            }
        }
    }

</script>
<style lang="scss">
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
        .head-img {
            width: 100px;
            height: 100px;
            margin-bottom: 18px;
            img {
                width: 100%;
                border-radius: 50%;
            }
        }
        .setting-popover {}
        .setting {
            position: absolute;
            top: 74px;
            right: 50px;
            width: 26px;
            height: 26px;
            padding: 0;
            border-radius: 50%;
            border-color: #fc7643;
            background-color: #fc7643;
            color: #ffffff;
            text-align: center;
            line-height: 26px;
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
            i {
                color: #F06B1D;
                margin-right: 10px;
            }
            p {
                display: -webkit-box;
                white-space: normal;
                -webkit-box-orient: vertical;
                overflow: hidden;
                -webkit-line-clamp: 1;
            }
            margin-bottom:50px;
        }
        .el-menu {
            background-color: #333333;

            .el-menu-item {
                border-left: 4px solid transparent;
                    background-color: #333333;
                    color: #ffffff;
                    font-size: 14px;
                    font-weight: 200;
                    text-align: left;
                    padding-left: 75px;
                    &:hover {
                        color: #FC7643;
                    }
                    i {
                        font-size: 22px;
                        position: relative;
                        top: 4px;
                        margin-right: 10px;
                        /*left:40px*/
                    }
                    &.is-active {
                            color: #FC7643;
                        }
            }

            .el-submenu {
                &.is-opened {
                    .el-submenu__title {
                        /*border-color:#FC7643;*/
                        color: #FC7643;
                    }
                }
                .el-submenu__title {
                    border-left: 4px solid transparent;
                    background-color: #333333;
                    color: #ffffff;
                    font-size: 14px;
                    font-weight: 200;
                    text-align: left;
                    padding-left: 75px;
                    &:hover {
                        color: #FC7643;
                    }
                    i {
                        font-size: 22px;
                        position: relative;
                        top: 4px;
                        margin-right: 10px;
                        /*left:40px*/
                    }
                    .el-submenu__icon-arrow {
                        display: none;
                    }
                }
                .el-menu {
                    .el-menu-item {
                        background-color: rgba(0, 0, 0, 0.20);
                        font-size: 14px;
                        font-weight: 200;
                        color: #ffffff;
                        &:hover {
                            color: #FC7643;
                        }
                        &.is-active {
                            color: #FC7643;
                        }
                        .el-badge {
                            margin-left: 10px;
                            .el-badge__content {
                                border: 0;
                                position: relative;
                                top:2px;
                            }
                        }
                    }
                }
            }
        }
    }
</style>