<template>
    <Row class="advertising-map">
        <Tabs v-model="tabName" @on-click="changeatub" class="tab-name">
            <TabPane label="官网首页" name="home">
                <HomeLb v-if="lbPane1" ref="HomePageBroadcast" />
            </TabPane>
            <TabPane label="官网课程页" name="Course">
                <CourseLb v-if="lbPane2" ref="CoursePageRotation" />
            </TabPane>
            <TabPane label="移动首页" name="mobile-home">
                <MobileHomeLb v-if="lbPane3"  ref="MobileHomePageBroadcast" :type=3 />
            </TabPane>
             <TabPane label="移动课程页" name="mobile-Course">
                <MobileCourseLb v-if="lbPane4"  ref="MobileCoursePageRotation" :type=4 />
            </TabPane>
        </Tabs>
         <Button class="add-advert" type="primary" @click="addatub()">添加广告</Button>
    </Row>
</template>
<script>
      import HomeLb from './HomeLb.vue'
      import CourseLb from './CourseLb.vue'
      import MobileCourseLb from './MobileCourseLb.vue'
      import MobileHomeLb from './MobileHomeLb.vue'

    export default {
        name: "index",
        components:{ HomeLb, CourseLb, MobileCourseLb, MobileHomeLb },
        data(){
            return{
                tabName: '',
                lbPane1: true,
                lbPane2: true,
                lbPane3: true,
                lbPane4: true,
            }
        },
        methods: {
            changeatub(name){
                sessionStorage.setItem('AdvertisingMap',name)
            },
            addatub(){
                switch(this.tabName) {
                    case 'home':
                    this.$refs.HomePageBroadcast.lb();
                    break;  
                    case 'Course':
                    this.$refs.CoursePageRotation.lb();
                    break;  
                    case 'mobile-home':
                    this.$refs.MobileHomePageBroadcast.lb();
                    break;  
                    case 'mobile-Course':
                    this.$refs.MobileCoursePageRotation.lb();
                    break;  
                }
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
    /deep/ .ivu-tabs-tab{
        width: 140px !important
    }
    /deep/.ivu-tabs-ink-bar{
        width: 100px !important;
        margin-left: 22px !important;
    }
</style>
