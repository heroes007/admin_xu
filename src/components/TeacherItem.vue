<template>
    <div class='teacher-item' @click="editTeacher">
        <div class='head'>
            <div class='mask'>
                <div class='bg'></div>
                <img class="ios-add-circle-outline" :src="addIcon" />
                <Icon class="md-close-circle" type="md-close-circle" @click.stop="deleteHandler" />
            </div>
            <img :src='headImg'/>
        </div>
        <Tooltip style="width: 100%" :content="teacherName" theme="light" :delay="300" placement="top">
            <p class='name'>{{teacherName}}</p>
        </Tooltip>
    </div>
</template>
<script>
    import defaultHeader from '../assets/img/side-menu/default-header.jpg'
    import { Dialog } from '../views/dialogs'
    import { ADD_TEACHER } from '../views/dialogs/types'
    import addIcon from 'assets/img/el-icon-zoom-in.svg'
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
        data(){
            return { addIcon }
        },
        computed:{
            headImg(){
                return this.imgUrl ? this.imgUrl : defaultHeader
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
                cursor:pointer;
                .bg {
                    width: 100%;
                    height: 100%;
                    border-radius: 50%;
                    background-color: rgba(0,0,0,0.60);;
                }
                .ios-add-circle-outline {
                    position: absolute;
                    color: #ffffff;
                    width: 20px;
                    height: 20px;
                    left: 10px;
                    top:10px;
                }
                .md-close-circle {
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
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
        }
    }
</style>
