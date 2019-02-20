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
        <Row><Col>
            <Menu  @on-open-change="openChange" @on-select="selectItem" :active-name='activeIndex'>
                <MenuItem  name="">项目管理</MenuItem>
            </Menu>
        </Col></Row>
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
            openChange(name) {},
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
            }
        },
        watch: {
            $route() {
                this.initMenu();
            }
        },
        mounted() {
            this.initMenu();
            if (this.$store.state.roles.role_list.length === 0) this.$store.dispatch('get_role_list');
        },
        computed: {
            userInfo() {
                return this.$store.state.auth.userInfo;
            },
            userHeader() {
                if (!this.userInfo)  return defaultHeader;
                if (this.userInfo.head_img_url) return this.userInfo.head_img_url;
                else return defaultHeader;
            }
        }
    }

</script>
<style lang="scss" scoped>
    /deep/.ivu-menu{
        background-color: #333;
        width: 100% !important;
    }
    /deep/.ivu-menu-item,.ivu-menu-item:hover{
        text-align: left;
        color: #3DAAFF !important;
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
        .setting {
            position: absolute;
            top: 74px;
            right: 50px;
            width: 26px;
            height: 26px;
            padding: 0;
            border-radius: 50%;
            border-color: #3DAAFF;
            background-color: #3DAAFF;
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
                color: #3DAAFF;
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
    }
</style>