<template>
    <Row>
        <Tabs value="tabName" @on-click="changeatub" >
            <TabPane  v-if="permissionCode1" label="首页轮播" name="lb">
                <lb ref="mychild"/>
            </TabPane>
            <TabPane v-if="permissionCode2" label="课程页轮播" name="news">
                <lb ref="mychild"/>
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
                tabName: 'lb'
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
            },
            changeatub(name){
                this.tabName = name
            },
            addatub(){
                if (this.tabName == "lb") {
                    this.$refs.mychild.addLb()
                }else{
                    this.$refs.mychild.addNew()
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
