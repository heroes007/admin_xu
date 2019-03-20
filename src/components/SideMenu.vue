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
            <Tooltip v-if="userName" :content="userNameAll">{{userName}}</Tooltip>
            <div v-else>{{userNameAll}}</div>
        </Row>
        <!--<Row class='user-name' v-if="userInfo.name">-->
            <!--<Tooltip :content="userInfo.name" placement="right" theme="light">-->
                <!--<p><span>{{ userInfo.name }}</span></p >-->
            <!--</Tooltip>-->
        <!--</Row>-->
        <!-- <Row class='user-name' type='flex' justify='center' align='middle'> {{userInfo.nickname}}</Row> -->
        <Row class="menu-list">
            <Col>
                <Menu ref="side_menu" class="slider-menu" @on-open-change="openChange" @on-select="selectItem"
                      :active-name='activeIndex' :open-names="menuOpenName">
                    <div v-for="(it,index) in menuList" :key="index">
                        <Submenu  v-if="it&&it.list" :name="it.name">
                            <template class="menu-padding" slot="title"><div class="menu-item" ><Icon :type="it.icon" size="20"/><span style="margin-left: 10px;font-size: 16px">{{it.title}}</span></div></template>
                            <div v-for="(t, index) in it.list" :key="index">
                                <!-- <div v-if="t.check">
                                    <MenuItem class="sub-item-title" v-if="routeName == t.name[1]" :name="t.name[1]">{{t.title}}</MenuItem>
                                    <MenuItem class="sub-item-title" v-if="routeName != t.name[1]" :name="t.name[0]">{{t.title}}</MenuItem>
                                </div> -->
                                <MenuItem :name="t.name" class="sub-item-title">
                                    <Badge v-if="t.name === 'notification-chat'" :count="unread_count"> {{t.title}}</Badge>
                                    <span v-else>{{t.title}}</span>
                                </MenuItem>
                            </div>
                        </Submenu>
                        <!-- <MenuItem v-else-if="it.checkItem && it.checkItem ==='product-information' && checkRole(it.checkItem)" :name="routeName == it.name[1] ? it.name[1] : it.name[0]">
                            <div class="menu-item" @mouseout="outImg(it)" @mouseover="overImg(it)"><img :src="iconImg + it.icon + png"/>{{it.title}}</div>
                        </MenuItem>
                        <MenuItem v-else-if="it.checkItem && checkRole(it.checkItem)" :name="it.name">
                            <div class="menu-item" @mouseout="outImg(it)" @mouseover="overImg(it)"><img :src="iconImg + it.icon + png"/>{{it.title}}</div>
                        </MenuItem> -->
                        <MenuItem v-else :name="it.name">
                            <Icon :type="it.icon" size="20"/><span style="margin-left: 10px;font-size: 16px">{{it.title}}</span>
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
  import { mapActions, mapGetters } from 'vuex'
  import { MenuList } from './Util'
  import postData from '../api/postData'
  export default {
    data() {
      return {
        use_router: true,
        activeIndex: "user-manage",
        menuOpenName: ['6', '2'],
        menuList: [],
        iconImg: '../../static/img/menu/',
        png: '.png',
        name:'',
        userName: '',
        userNameAll: ''
      }
    },
    computed: {
      ...mapGetters({ unread_count: 'unread_message_count' }),
      roleList() {
        return this.$store.state.roles.role_list;
      },
      userInfo() {
        return JSON.parse(localStorage.getItem('PERSONALDETAILS'))
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
        // this.initMenu();
        //  if((this.activeIndex === 'manage-production') || (this.activeIndex === 'manage-production-curriculum')){
        //    this.selectItem(this.activeIndex)
        //  }
      }
    },
    methods: {
      // openChangeMenu(name){
      //   console.log(name)
      // },
      // selectItemMenu(index){
      //   console.log(index)
      //   localStorage.setItem('menuActiveIndex', index);
      //   this.menuList.forEach((it) => {
      //     if(!it.icon.includes('_gray')) it.icon = it.icon + '_gray';
      //     if(it.name === index) it.icon = it.icon.split('_')[0];
      //   })
      //   if((index === 'manage-production') || (index === 'manage-production-curriculum')) this.menuList[3].icon = '04.product'
      //   this.name = index
      //   this.$router.push({name: index});
      // },
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
        // this.menuList.forEach((it) => {
        //   if(!it.icon.includes('_gray')) it.icon = it.icon + '_gray';
        //   if(it.name === index) it.icon = it.icon.split('_')[0];
        // })
        // if((index === 'manage-production') || (index === 'manage-production-curriculum')) this.menuList[3].icon = '04.product'
        // this.name = index
        this.$router.push({name: index});
        this.activeIndex = index
      },
      initMenu() {
        // this.activeIndex = this.$route.name;
      },
      logout() {
        api.post('user/logout', {from: 'web'}).then((res) => {
          if (res.data.res_code === 1) {
            // login_user
            let d = localStorage.getItem('login_user')
            localStorage.clear()
            // this.$localStorage.set('token', '');
            this.$router.push({path: '/login'});
            localStorage.setItem('login_user', d)
            // this.$localStorage.remove('organizationId');
            // this.$localStorage.remove('menuOpenName');
            // localStorage.removeItem('menuActiveIndex');
            // localStorage.removeItem('PERMISSIONS');
            // localStorage.removeItem('menuActiveIndex');
            // localStorage.removeItem('login_user');
          }
        });
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
      },
      handleMenuList(){
        if(localStorage.getItem('PERMISSIONS')){
          let d = Base64.decode(localStorage.getItem('PERMISSIONS'));
          let d1 = JSON.parse(d.slice(4))
            if(d1&&d1.length>0){
              d1.forEach(t => {
                let num = +t.permission_code.slice(0,2)
                if(num !== 3) this.menuList.push(MenuList[num - 1])
              });
              // if(this.menuList.length>0) this.activeIndex = this.menuList[0].name
            }
          }
        },
      getName(){
        if(JSON.parse(localStorage.getItem('PERSONALDETAILS')).role_id == 1) {
          this.userNameAll = JSON.parse(localStorage.getItem('PERSONALDETAILS')).name
          if(this.userNameAll.length > 10) {
            this.userName = this.userNameAll.substring(0, 4) + '***' + this.userNameAll.substring(this.userNameAll.length - 4, this.userNameAll.length)
          }
        }else{
          postData('components/getOrganization').then(res => {
            res.data.forEach(item => {
              if(item.id == JSON.parse(localStorage.getItem('PERSONALDETAILS')).organization_id) {
                this.userNameAll = item.title + JSON.parse(localStorage.getItem('PERSONALDETAILS')).name
                if(this.userNameAll.length > 10) {
                  this.userName = this.userNameAll.substring(0, 4) + '***' + this.userNameAll.substring(this.userNameAll.length - 4, this.userNameAll.length)
                }
              }
            })
          })
        }
      }
    },
    mounted() {
      this.handleMenuList()
      if (localStorage.getItem('menuOpenName')) this.menuOpenName = JSON.parse(localStorage.getItem('menuOpenName'))
      let menuActive = localStorage.getItem('menuActiveIndex') ? localStorage.getItem('menuActiveIndex') : 'user-manage'
      this.activeIndex = menuActive
      if(this.$route.name ==='user-manage') this.activeIndex = 'user-manage'
      this.$nextTick(() => {
          this.$refs.side_menu.updateOpened();
          this.$refs.side_menu.updateActiveName();
      })
      this.getName()
    }
  }
</script>
<style lang="scss" scoped>
    .sub-item-title {
        padding-top: 14px !important;
        padding-bottom: 14px !important;
      }
    /deep/ .ivu-icon-ios-settings{
         position: relative;
         top: -2px;
         margin-right: 5px;
     }
    /deep/ .ivu-menu-vertical .ivu-menu-submenu-title-icon{
      position: absolute;
      top: 20px;
      right: 10px;
      clear: both;
    }
    /deep/ .sub-item-title{
      padding-left: 112px !important;
    }
    /deep/ .ivu-menu {
        background-color: #333;
        width: 100% !important;
    }

    /deep/ .ivu-menu-light.ivu-menu-vertical .ivu-menu-item-active:not(.ivu-menu-submenu){
        background: #292929 !important;
    }

    /deep/ .ivu-menu-item{
        display: flex;
        align-items: center;
    }

    /deep/ .ivu-menu-item, /deep/ .ivu-menu-submenu-title {
        text-align: left;
        color: #fff;
        padding-left: 78px;
    }

    /deep/ .ivu-menu-vertical.ivu-menu-light:after {
        content: none !important
    }

    /deep/ .ivu-menu-item-active {
        background-color: #292929 ;

        .ivu-menu-item{
            background-color: #292929 ;
        }
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
                margin-left: 10px;
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
