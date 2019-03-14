<template>
    <Tabs value="tabName">
        <TabPane v-if="permissionCode1" label="广告图" name="lb">
            <lb/>
        </TabPane>
        <TabPane v-if="permissionCode2" label="行业资讯" name="news">
            <news/>
        </TabPane>
        <TabPane v-if="permissionCode3" label="通知管理" name="notification">
            <notification/>
        </TabPane>
    </Tabs>
</template>

<script>
    import lb from '../lb/ManageLb'
    import news from '../news/ManageNews'
    import notification from '../information/ManageNotification'
    export default {
        name: "index",
        components:{lb, news, notification},
        data(){
            return{
                permissionCode1: true ,
                permissionCode2: true ,
                permissionCode3: true ,
                permissionItem1: null,
                permissionItem2: null,
                permissionItem3: null,
                tabName: ''
            }
        },
        methods: {
            setAuth(n,t) {
                this[ 'permissionCode' + n ] = true
                this['permissionItem' + n] = t
            },
            handleAuth(){
                console.log(this.$PERMISSIONS4,'this.$PERMISSIONS4');
                if(this.$PERMISSIONS4&&this.$PERMISSIONS4.hasOwnProperty('child')){
                    let d = this.$PERMISSIONS4.child;
                    d.forEach(t => {
                        let n = +t.permission_code.slice(2,4)
                        console.log(t,n,'aaaaa');
                        // this.setAuth(n,t)
                    });
                }
            }
        },
        mounted(){
            this.$nextTick(() => {
                if(this.$PERMISSIONS4)  this.handleAuth()
                else{
                    this.$config.setAuth()
                    this.handleAuth()
                }
            })
        }
    }
</script>

<style scoped>

</style>
