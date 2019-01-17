<template>
    <div class='teacher-item' @click="editTeacher">
        <div class='head'>
            <div class='mask'>
                <div class='bg'></div>
                <i class='el-icon-view'></i>
                <i class='el-icon-circle-cross' @click.stop="deleteHandler"></i>
            </div>
            <img :src='headImg'/>
        </div>
        <p class='name'>{{teacherName}}</p>
    </div>
</template>
<script>
    import defaultHeader from '../assets/img/side-menu/default-header.jpg'
    import { Dialog } from '../views/dialogs'
    import { ADD_TEACHER } from '../views/dialogs/types'
    export default{
        mixins: [Dialog],
        props:{
            imgUrl:{
                type:String,
                default:''
            },
            teacherName:{
                type:String,
                default:''
            },
            tid:{
                type:Number,
                required:true
            }
        },
        computed:{
            headImg(){
                if(this.imgUrl)
                {
                    return this.imgUrl;
                }
                else
                {
                    return defaultHeader;
                }
            }
        },
        methods:{
            deleteHandler(){
                this.$Modal.confirm({
                    title: '提示',
                    content: '是否确定删除该讲师？',
                    onOk: () => {
                         this.$store.dispatch('delete_teacher',{id:this.tid})
                    }
                });
            },
            editTeacher(){
              this.handleSelModal(ADD_TEACHER, this.tid)
            }
        }
    }
</script>
<style lang='scss'>
    .teacher-item {
        .head {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            position: relative;
            margin: 0 auto;
            img {
                width: 100%;
                height: 100%;
                display: block;
                border-radius: 50%;
            }

            .mask {
                width: 100%;
                height: 100%;
                position: absolute;
                z-index: 2;
                display: none;
                .bg {
                    width: 100%;
                    height: 100%;
                    border-radius: 50%;
                    background-color: rgba(0,0,0,0.60);;
                }

                i {
                    cursor:pointer;
                }
                .el-icon-view {
                    position: absolute;
                    color: #ffffff;
                    font-size: 18px;
                    left: 11px;
                    top:11px;
                }
                .el-icon-circle-cross {
                    font-size: 14px;
                    color: #e93f00;
                    position: absolute;
                    top: 0;
                    right: -14px;
                }
            }

            &:hover {
                .mask {
                    display: block;
                }
            }
        }
        .name {
            width: 100%;
            text-align: center;
            font-size: 14px;
            color: #141111;
            letter-spacing: 0;
        }
    }
</style>
