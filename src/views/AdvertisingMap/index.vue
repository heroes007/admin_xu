<template>
    <Row>
        <Tabs v-model="tabName" @on-click="changeatub" >
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
                 localStorage.setItem('AdvertisingMap',name)
            },
            addatub(){
                if (this.tabName == "lb") {
                    this.$refs.HomePageBroadcast.addLb()
                }else{
                    this.$refs.CoursePageRotation.addNew()
                }
            }
        },
        mounted(){
            if(localStorage.getItem('AdvertisingMap')) this.tabName = localStorage.getItem('AdvertisingMap')
        }
    }
</script>

<style scoped>
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
</style>
