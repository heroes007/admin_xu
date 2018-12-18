/**
 * Created by lesonli on 2016/11/16.
 */
<template>
    <div class='dashboard-view'>
        <el-row type='flex' class='col-container'>
            <el-col class='menu-bar'>
                <side-menu/>
            </el-col>
            <el-col class='sub-view'>
                <keep-alive>
                    <router-view v-if="$route.meta.keepAlive"></router-view>
                </keep-alive>
                <router-view v-if="!$route.meta.keepAlive"></router-view>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import SideMenu from '../components/SideMenu'
    export default{
        data(){
            return{
                msg:'hello vue'
            }
        },
        components:{
            'side-menu':SideMenu
        },
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
        /*border-radius:10px;*/
        width:100%;
        //height:100%;
        //min-height:100%;
        background-color:#ffffff;
        .col-container {
            //height:100%;
            .menu-bar {
                max-width:200px;
                min-width:200px;
                //height:100%;
                min-height:800px;
                background-color: #333333;
                box-shadow: 2px 0 10px 0 rgba(51,51,51,0.06);

            }
            .sub-view {
                background-color: #ffffff;
                padding-bottom: 50px;
                position: relative;
                min-height: 100vh;
                /*background-color:#f9f9f9;*/
                /*border-radius:0 20px 20px 0;*/
            }
        }
    }
</style>