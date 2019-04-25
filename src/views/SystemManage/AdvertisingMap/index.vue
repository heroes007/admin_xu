<template>
    <Row class="advertising-map">
        <Tabs v-model="tabName" @on-click="changeatub" class="tab-name">
            <TabPane  v-if="permissionCode1" label="首页轮播" name="lb">
                <lb ref="HomePageBroadcast" :type=true />
            </TabPane>
            <TabPane v-if="permissionCode2" label="课程页轮播" name="news">
                <lb ref="CoursePageRotation" />
            </TabPane>
        </Tabs>
         <Button class="add-advert" type="primary" @click="addatub()">添加广告</Button>
    </Row>
</template>
<script>
    import lb from '../lb/ManageLb'
    export default {
        name: "index",
        components:{lb},
        data(){
            return{
                permissionCode1: true,
                permissionCode2: true,
                permissionItem1: null,
                permissionItem2: null,
                tabName: ''
            }
        },
        methods: {
            setAuth(n,t) {
                this[ 'permissionCode' + n ] = true
                this['permissionItem' + n] = t
            },
            changeatub(name){
                 sessionStorage.setItem('AdvertisingMap',name)
            },
            addatub(){
                if (this.tabName == "lb") this.$refs.HomePageBroadcast.addLb()
                else this.$refs.CoursePageRotation.addNew()
            }
        },
        mounted(){
            if(sessionStorage.getItem('AdvertisingMap')) this.tabName = sessionStorage.getItem('AdvertisingMap')
        }
    }
</script>

<style lang="less" scoped>
    .add-advert{
        width: 130px;
        height: 36px;
        background: #4098FF;
        border-radius: 4px;
        font-family: PingFangSC-Regular;
        font-size: 16px;
        color: #FFFFFF;
        letter-spacing: 0;
        text-align: center;
        position: absolute;
        top:12px;
        right: 18px;
    }
    .tab-name, /deep/.ivu-tabs-content, .advertising-map{
      height: 100% !important;
    }
    /deep/ .ivu-page{
        position: absolute;
        bottom: 60px;
        left: 0;
        right: 0;
        margin: 0 auto;
    }
</style>
