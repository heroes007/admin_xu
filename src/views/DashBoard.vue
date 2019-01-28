<template>
    <div class='dashboard-view'>
        <Row type='flex' class='col-container'>
            <Col class='menu-bar'> <side-menu/> </Col>
            <Col class='sub-view'>
                <keep-alive> <router-view /> </keep-alive>
            </Col>
        </Row>
    </div>
</template>
<script>
    import SideMenu from '../components/SideMenu'
    export default{
        components:{ 'side-menu':SideMenu },
        mounted(){
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
        background-color:#ffffff;
        .col-container {
            flex-wrap: nowrap !important;
            .menu-bar {
                max-width:200px;
                min-width:200px;
                min-height:800px;
                background-color: #333333;
                box-shadow: 2px 0 10px 0 rgba(51,51,51,0.06);
            }
            .sub-view {
                background-color: #ffffff;
                /*padding-bottom: 50px;*/
                position: relative;
                min-height: 100vh;
                width: calc(100% - 200px)
            }
        }
    }
</style>
