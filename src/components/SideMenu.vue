<template>
    <div class='side-menu'>
        <Row class='logo' type='flex' justify='center' align='middle'>
            <img class="logo-img" src='../assets/img/logo-white1.jpg'>
            <div class="logo-title">九划医疗</div>
        </Row>
        <Row class="head-img-row" type='flex' justify='center' align='middle'>
            <div class='head-img'>
                <img :src='userHeader'>
            </div>
            <Poptip trigger="hover" placement="right">
                <Button class='setting'>
                    <Icon class="icon-setting" type="md-settings"/>
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
                <p><span>{{ getRoleStr() }}</span></p >
            </Tooltip>
        </Row>
        <!-- <Row class='user-name' type='flex' justify='center' align='middle'> {{userInfo.nickname}}</Row> -->
        <Row class="menu-list">
            <Col>
                <Menu ref="SideMenu" class="slider-menu" @on-open-change="openChange" @on-select="selectItem"
                      :active-name='activeIndex' :open-names="menuOpenName">
                    <div v-for="(it,index) in menuList" :key="index">
                        <Submenu  v-if="it.list&&it.check&&checkRole(it.check)" :name="it.name">
                            <template class="menu-padding" slot="title"><div class="menu-item" @mouseout="outImg(it)" @mouseover="overImg(it)"><img :src='iconImg + it.icon + png'/>{{it.title}}</div></template>
                            <div v-for="(t, index) in it.list" :key="index">
                                <div v-if="t.check">
                                    <MenuItem class="sub-item-title" v-if="routeName == t.name[1]" :name="t.name[1]">{{t.title}}</MenuItem>
                                    <MenuItem class="sub-item-title" v-if="routeName != t.name[1]" :name="t.name[0]">{{t.title}}</MenuItem>
                                </div>
                                <MenuItem v-else :name="t.name" class="sub-item-title">
                                    <Badge v-if="t.name === 'notification-chat'" :count="unread_count"> {{t.title}}</Badge>
                                    <span v-else>{{t.title}}</span>
                                </MenuItem>
                            </div>
                        </Submenu>
                        <MenuItem v-else-if="it.checkItem && it.checkItem ==='product-information' && checkRole(it.checkItem)" :name="routeName == it.name[1] ? it.name[1] : it.name[0]">
                            <div class="menu-item" @mouseout="outImg(it)" @mouseover="overImg(it)"><img :src="iconImg + it.icon + png"/>{{it.title}}</div>
                        </MenuItem>
                        <MenuItem v-else-if="it.checkItem && checkRole(it.checkItem)" :name="it.name">
                            <div class="menu-item" @mouseout="outImg(it)" @mouseover="overImg(it)"><img :src="iconImg + it.icon + png"/>{{it.title}}</div>
                        </MenuItem>
                        <MenuItem v-else :name="it.name">
                            <div class="menu-item" @mouseout="outImg(it)" @mouseover="overImg(it)"><img :src="iconImg + it.icon + png"/>{{it.title}}</div>
                        </MenuItem>
                    </div>
                </Menu>
            </Col>
        </Row>
    </div>
</template>
<script>
  import api from '../api/modules/config'
  import defaultHeader from '../assets/img/side-menu/default-header.jpg'
  // const server = require('socket.io-client')('http://api2.laoshi123.com:4006');
  import { mapActions, mapGetters } from 'vuex'
  import { MenuList } from './Util'

  export default {
    data() {
      return {
        use_router: true,
        activeIndex: "manage-production",
        menuOpenName: ['6', '2'],
        menuList: MenuList,
        iconImg: '../../static/img/menu/',
        png: '.png',
        name:''
      }
    },
    computed: {
      ...mapGetters({ unread_count: 'unread_message_count' }),
      roleList() {
        return this.$store.state.roles.role_list;
      },
      userInfo() {
        return this.$store.state.auth.userInfo;
      },
      userHeader() {
        if (!this.userInfo) return defaultHeader;
        if (this.userInfo.head_img_url) return this.userInfo.head_img_url;
        else return defaultHeader;
      },
      routeName() {
        return this.$route.name;
      }
    },
    watch: {
      $route() {
        this.initMenu();
         if((this.activeIndex === 'manage-production') || (this.activeIndex === 'manage-production-curriculum')){
           this.selectItem(this.activeIndex)
         }
      }
    },
    methods: {
      setProductInfoIcon(it,str){
         let d = this.$config.copy(it)
         d.icon = str
         this.menuList.splice(3,1,d)
      },
      outImg(it) {
        if(Array.isArray(it.name)){
          if((this.activeIndex === 'manage-production') || (this.activeIndex === 'manage-production-curriculum')){
            this.setProductInfoIcon(it,'04.product')
          }else if(it.title === "产品信息")  this.setProductInfoIcon(it,'04.product_gray')
        }else{
          if(it.name !== this.activeIndex && !it.icon.includes('_gray')) it.icon = it.icon + '_gray'
        }
      },
      overImg(it) {
        it.icon = it.icon.split('_')[0];
      },
      ...mapActions(['get_unread_list', 'add_unread_count']),
      checked(n) {
        return this.userInfo.role_arr.includes(n)
      },
      checkRole(name){
        let role1 = this.checked(1);
        let role7 = this.checked(7);
        let role8 = this.checked(8);
        let role9 = this.checked(9);
        if((name === 'admin') || (name === 'product-information')) return role1
        else if(name === 'manager'){
          if(role1 || role7) return true
          else return false
        }else if(name === 'student'){
          if(role1 || role7 || role8) return true
          else return false
        }else if(name === 'teacher'){
          if(role1 || role8) return true
          else return false
        }else if(name === 'platform'){
          if(role1 || role7) return true
          else return false
        }
        // return true;
      },
      openChange(name) {
        localStorage.setItem('menuOpenName', JSON.stringify(name));
        this.menuOpenName = name;
      },
      selectItem(index) {
        localStorage.setItem('menuActiveIndex', index);
        this.menuList.forEach((it) => {
          if(!it.icon.includes('_gray')) it.icon = it.icon + '_gray';
          if(it.name === index) it.icon = it.icon.split('_')[0];
        })
        if((index === 'manage-production') || (index === 'manage-production-curriculum')) this.menuList[3].icon = '04.product'
        this.name = index
        this.$router.push({name: index});
      },
      initMenu() {
        this.activeIndex = this.$route.name;
      },
      logout() {
        api.post('api/user/logout', {from: 'web'}).then((res) => {
          if (res.data.res_code === 1) {
            this.$localStorage.set('token', '');
            this.$router.push({path: '/login'});
            this.$localStorage.remove('lastSelectedProject');
            this.$localStorage.remove('menuOpenName');
            localStorage.removeItem('menuActiveIndex');
          }
        });
      },
      getRoleStr() {
        var result = '';
        if (this.userInfo && this.roleList) {
          for (var i = 0; i < this.userInfo.role_arr.length; i++) {
            for (var j = 0; j < this.roleList.length; j++) {
              if (this.userInfo.role_arr[i] === this.roleList[j].role_id) {
                if (this.userInfo.role_arr[i] == 0) { continue;}
                if (result !== '') result = result + ',' + this.roleList[j].role_name;
                else result = result + this.roleList[j].role_name;
                break;
              }
            }
          }
        }
        return result;
      },
      setSubmenuTitleIconMouse(){
        let doc = document.querySelectorAll('.ivu-menu-submenu-title-icon');
        doc.forEach((it,k) => {
          let previousSbilingText = it.parentNode.children[0].innerText,item = null;
          this.menuList.forEach((res) => {
            if(res.title === previousSbilingText)  item = res
          })
          if(item){
            it.addEventListener('mouseover' ,() => { this.overImg(item) })
            it.addEventListener('mouseout' ,() => { this.outImg(item) })
          }
        })
      }
    },
    mounted() {
      this.setSubmenuTitleIconMouse()
      let menuActive = localStorage.getItem('menuActiveIndex') ? localStorage.getItem('menuActiveIndex') : 'manage-production'
      this.selectItem(menuActive)
      this.initMenu();
      if (this.$store.state.roles.role_list.length === 0) this.$store.dispatch('get_role_list');
      // server.on('connect', () => {
      //     console.log(server.id); // 'G5p5...'
      // });
      // server.on(this.userInfo.user_id, data => {
      //         this.$Notice.open({
      //         title: '通知',
      //         desc: '你收到一条新私信，请在我的通知里查看。'
      //     });
      //     this.add_unread_count(data);
      // });
      // server.on('disconnect', res => {
      //     console.log('disconnect')
      //     server.disconnect();
      //     server.close();
      // });
      // server.on('error', error => {
      //     console.log(error);
      // })
      this.get_unread_list();
      if (localStorage.getItem('menuOpenName')) this.menuOpenName = JSON.parse(localStorage.getItem('menuOpenName'))
      this.$nextTick(() => {
        this.$refs.SideMenu.updateOpened();
      })
    }
  }
</script>
<style lang="scss" scoped>
    .sub-item-title {        
        padding-top: 14px !important;
        padding-bottom: 14px !important; 
      }
    .menu-item{
        display: flex;
        width: 100%;
        height: 100%;
        align-items: center;
        padding: 14px 24px;
        img{
            margin-right: 6px;
        }
    }
    /deep/ .ivu-menu-item{  padding: 0; }
    /deep/ .ivu-menu-submenu-title-icon{ 
      top: 18px ;
      position: absolute;
      right: 0;
    }
    /deep/ .ivu-menu-submenu-title{
        padding: 0;
        display: flex;
        flex-direction: row;
        i{
            height: 14px;
        }
    }

    /deep/ .ivu-menu {
        background-color: #333;
        width: 100% !important;
    }

    /deep/ .ivu-menu-item, /deep/ .ivu-menu-submenu-title {
        text-align: left;
        color: #fff;
    }

    /deep/ .ivu-menu-vertical.ivu-menu-light:after {
        content: none !important
    }

    /deep/ .ivu-menu-item-active {
        background-color: #333 !important;
    }

    /deep/ .ivu-menu-item-active:not(.ivu-menu-submenu):after {
        background-color: #333 !important;
    }

    /deep/ .ivu-poptip-body {
        padding: 0
    }

    /deep/ .ivu-poptip-popper {
        top: 60px !important
    }

    /deep/ .ivu-btn-text, /deep/ .ivu-btn {
        border: none
    }

    /deep/ .ivu-btn:focus {
        box-shadow: none
    }

    .side-menu {
        padding: 27px 0;
        height: calc(100% - 240px);

        .logo {
            margin-bottom: 40px;

            .logo-img {
                width: 34px;
            }

            .logo-title {
                color: #fff;
                font-size: 18px;
                margin-left: 4px;
            }
        }

        .head-img-row {
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

        .setting, .setting:hover {
            position: absolute;
            top: 0px;
            right: 0px;
            width: 26px;
            height: 26px;
            padding: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            border-radius: 50%;
            border-color: #3DAAFF;
            background-color: #3DAAFF;
            color: #ffffff;
            text-align: center;
            line-height: 10px;

            .icon-setting {
                font-size: 18px;
            }

            cursor: pointer;

            .hover-glow {
                width: 34px;
                height: 34px;
                position: absolute;
                top: -4px;
                left: -4px;
                background-color: rgba(61, 170, 255, 0.2);
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
                    color: #3DAAFF;
                    margin-right: 10px;
                    font-size: 18px
                }
            }

            margin-bottom: 50px;
        }
        .menu-list{
            height: 100%;
            overflow: hidden;
            overflow-y: auto;
        }
    }
</style>
