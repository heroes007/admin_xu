<template>
    <div class='dashboard-view'>
        <Row type='flex' class='col-container'>
            <Col v-if="menushow" :style="widthStyle" class='menu-bar'><side-menu/></Col>
            <Col v-if="!menushow" ><HideMenu :stateClasses="hideClass"/></Col>
            <Col class='sub-view' :style="viewStyl">
                <div class="hide-menu-btn" @click="hideMenu"><Icon class="hide-icon" :type="hideIcon" /></div>
                <router-view :key="$route.fullPath" />
            </Col>
        </Row>
    </div>
</template>
<script>
    import SideMenu from '../components/SideMenu'
    import hideMenuMixins from './ProductManage/MainProduct/hideMenuMixins'
    import HideMenu from '../components/HideMenu'
    export default{
        mixins: [hideMenuMixins],
        components:{ 'side-menu':SideMenu, HideMenu }
    }
</script>
<style lang="less">
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
                background-color: #333333;
                box-shadow: 2px 0 10px 0 rgba(51,51,51,0.06);
            }
            .sub-view {
                background-color: #ffffff;
                position: relative;
                min-height: 100vh;
                padding-bottom: 10px;
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
                    cursor: pointer;
                    .hide-icon{
                        font-size: 14px;
                        color: #fff
                    }
                }
            }
        }
    }
</style>
