<template>
    <div>
<!--        <div @click="handleBack" style="position: absolute;display: flex;top: 20px;left: 20px;cursor: pointer;z-index: 1">-->
<!--            <img class="back-img" src="../../../assets/icons/icon/back.png" alt="">-->
<!--            <div class="back-title">返回</div>-->
<!--        </div>-->
        <Tabs @on-click="tabs" v-model="online">
            <TabPane label="线上自学" v-if="item1" name="product1">
                <online/>
            </TabPane>
            <TabPane label="线上集中" v-if="item6" name="product6">
                <online-live/>
            </TabPane>
            <TabPane label="线下集中" v-if="item2" name="product2">
                <offline/>
            </TabPane>
            <TabPane label="作业" v-if="item3" name="product3">
                <task/>
            </TabPane>
            <TabPane label="资料" v-if="item4" name="product4">
                <course/>
            </TabPane>
            <TabPane label="证书" v-if="item5" name="product5">
                <houner/>
            </TabPane>
        </Tabs>
    </div>
</template>

<script>
    import online from '../Online/ManageOnlineCourse'
    import offline from '../Offline/ManageOfflineList'
    import task from '../Task/ManageTask'
    import course from '../Course/ManageCourseDownloadData'
    import houner from '../Houner/ManageHouner'
    import onlineLive from '../online-live'

    export default {
        name: "OpenProduct",
        components: {online, offline, task, course, houner, onlineLive},
        data() {
            return {
                online: '',
                item1: false,
                item2: false,
                item3: false,
                item4: false,
                item5: false,
                item6: false
            }
        },
        methods: {
            tabs(name) {
                this.online = name
                sessionStorage.setItem('onlinePane', name)
            },
            setAuth() {
                if (sessionStorage.getItem('PERSONALDETAILS')) {
                    this.item1 = true;
                    this.item2 = true;
                    this.item3 = true;
                    this.item4 = true;
                    this.item5 = true;
                    this.item6 = true;
                }
            },
            handleBack() {
                this.$router.go(-1)
            }
        },
        mounted() {
            this.setAuth()
            if (sessionStorage.getItem('onlinePane')) {
                this.online = sessionStorage.getItem('onlinePane')
            }
        }
    }
</script>

<style scoped lang="less">
    .back-img {
        width: 23px;
        height: 19px;
    }

    .back-title {
        margin-left: 10px;
        font-family: PingFangSC-Regular;
        font-size: 16px;
        color: #474C63;
        letter-spacing: 0;
    }
</style>
