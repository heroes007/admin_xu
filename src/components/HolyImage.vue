<template>
    <div class='holy-img' @click="showDetail">
        <div class='container'>
            <div class='mask'>
                <div class='bg'></div>
                <p>这里是描述文字</p>
            </div>
            <img class='back-img' :src='imgUrl'/>
        </div>
    </div>
</template>

<script>
    export default{
        data(){
            return{

            }
        },
        props:{
            imgUrl:{
                type:String,
                default:''
            },
            id:{
                type:Number,
                required:true
            }
        },
        computed:{
        },
        methods:{
            showDetail(){
                this.$emit('showDetail',this.id);
            }
        }
    }
</script>
<style lang='scss'>
   .holy-img {
       display: inline-block;
        .container {
            position: relative;
            .mask {
                display: none;
                position: absolute;
                top:0;
                left:0;
                width: 100%;
                height: 100%;
                .bg {
                    background-color: rgba(0,0,0,0.8);
                    width: 100%;
                    height: 100%;
                }
                p {
                    color: #ffffff;
                    font-size: 14;
                    width: 100%;
                    text-align: center;
                    padding: 0 10px;
                    position: absolute;
                    bottom: 10%;
                }
            }
            .back-img {
                display: block;
                width: 100%;
                height: auto;
            }
        }
        &:hover {
            .mask {
                display: block;
            }
        }
   }
</style>
