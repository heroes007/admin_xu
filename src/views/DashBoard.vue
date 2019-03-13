<template>
    <div class='dashboard-view'>
        <Row type='flex' class='col-container'>
             <Col  v-if="menushow" class='menu-bar'>
               <side-menu/>
            </Col>
            <Col  v-if="!menushow">
             <HideMenu />
            </Col>
            <Col class='sub-view' :style="viewStyl">
                <div class="hide-menu-btn" @click="hideMenu"><Icon class="hide-icon" :type="hideIcon" /></div>
                <router-view />
            </Col>
        </Row>
    </div>
</template>
<script>
    import SideMenu from '../components/SideMenu'
    import hideMenuMixins from './ProductManage/MainProduct/hideMenuMixins'
    import HideMenu from '../components/HideMenu'
    import Vue from 'vue'
    export default{
        mixins: [hideMenuMixins],
        components:{ 'side-menu':SideMenu, HideMenu },
        methods: {
               setAuth(){
                if(localStorage.getItem('PERMISSIONS')){
                let d = Base64.decode(localStorage.getItem('PERMISSIONS'));
                let d1 = JSON.parse(d.slice(4))
                d1.forEach(t => {
                    let num = +t.permission_code.slice(0,2)
                    Vue.prototype['$PERMISSIONS' + num] = t
                });
                }
            }
        },
        mounted(){
            this.setAuth()
            this.$store.dispatch('get_subject_list');
        }
    }
</script>
<style lang="scss">
    body{
        background-color:#333333;
    }
    .dashboard-view {
        box-sizing:border-box;
        width:100%;
        height: 100%;
        background-color:#ffffff;
        .col-container {
            height: 100%;
            flex-wrap: nowrap !important;
            .menu-bar {
                height: 100%;
                max-width:260px;
                min-width:260px;
                min-height:800px;
                background-color: #333333;
                box-shadow: 2px 0 10px 0 rgba(51,51,51,0.06);
            }
            .sub-view {
                background-color: #ffffff;
                position: relative;
                min-height: 100vh;
                padding-bottom: 50px;
                .hide-menu-btn{
                    z-index: 1000;
                    position: absolute;
                    top: 0;
                    bottom: 0;
                    right: 0;
                    left: 0;
                    margin: auto 0;
                    height: 110px;
                    width: 15px;
                    padding: 0;
                    background: #333333;
                    border-top-right-radius: 2px;
                    border-bottom-right-radius: 2px;
                    display: flex;
                    align-items: center;
                    .hide-icon{
                        font-size: 14px;
                        color: #fff
                    }
                }
            }
        }
    }
</style>
