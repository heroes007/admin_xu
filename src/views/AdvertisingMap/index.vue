<template>
    <Tabs value="tabName">
        <TabPane v-if="permissionCode1" label="首页轮播" name="lb">
            <lb/>
        </TabPane>
        <TabPane v-if="permissionCode2" label="课程页轮播" name="news">
            
        </TabPane>
    </Tabs>
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
