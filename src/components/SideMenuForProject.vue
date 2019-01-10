/** * Created by lesonli on 2016/11/16. */
<template>
    <div class='side-menu-for-project'>
        <div class='logo elRow' type='flex' justify='center' align='middle'>
            <img src='../assets/img/logo-white.png'>
        </div>
        <div class="elRow" type='flex' justify='center' align='middle'>
            <div class='head-img'>
                <img :src='userHeader'>
            </div>
        </div>
        <Row>
            <Col>
                <el-menu class="slider-menu" @open="handleOpen" @close="handleClose" @select="selectItem" :default-active='activeIndex'>
                    <el-menu-item index=""><i></i>项目管理</el-menu-item>
                </el-menu>
            </Col>
        </Row>
    </div>
</template>

<script>
    import api from '../api/modules/config'
    import defaultHeader from '../assets/img/side-menu/default-header.jpg'
    export default {
        data() {
            return {
                use_router: true,
                activeIndex: ''
            }
        },
        methods: {
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
        },
        computed: {
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
    
    .side-menu-for-project {
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
                    }
                }
            }
        }
    }
</style>