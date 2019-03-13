<template>
   <div class="user-manage-main">
        <see :detail-data="tableRowData" title="查看信息" :show-modal='detailShow' @close="close" />
        <FormModal :detail-data="tableRow" :uploadFlie=true :show-modal='show' :form-list="formList" @close="closeModal" @from-submit="handleSubmit" :title="modalTitle" :rule-validate="rules" />

        <screen :btn-type="btnType" :types="1" size-title1="讲师总数" :size-num1="23" btn-name="添加讲师" placehodle="搜索讲师姓名" @inputChange="inputChange" @handleClick="handleClick"/>
        <div class="lecturer-list">
           <Row :gutter="20">
            <Col span="6" v-for="(t,i) in list" :key="i">
                <div class="lecturer-list-item">
                    <img class="lecturer-item-img" :src="t.img_url" />
                    <div class="lecturer-item-content">
                        <h2>{{t.name}}</h2>
                        <p>绑定课程：{{t.num}}个</p>
                    </div>
                    <div class="lecturer-item-btn">
                       <img v-if="lectureesItem2" @click="edit(t)" class="lecturer-btn-icon" src="/static/icon/write.jpg" />
                       <img v-if="lectureesItem3" @click="deletes(t)" src="/static/icon/delete.jpg" />
                    </div>
                </div>
            </Col>
        </Row>
       </div>

         <page-list :current="current" :total="total" :page-size="pageSize" @page-list="pageList"/>
   </div>
</template>

<script>
  import FormModal from '../../../components/FormModal.vue'
  import screen from '../../../components/ScreenFrame'
  import see from '../../../components/SeeInfo.vue'
  import seeMixin from '../seeMixin'
  import FormModalMixin from '../FormModalMixin'
  import postData from 'src/api/postData'
  import UserMixins from '../Mixins/UserMixins'
  import pageList from '../../../components/Page'
  import pageMixin from '../../mixins/pageMixins'
  export default {
    name: "LecturerList",
    components: { FormModal, screen, see, pageList },
    mixins: [seeMixin, FormModalMixin, UserMixins, pageMixin],
    props: {
        permissionItem5: {
            type: Object,
            default: null
        }
    },
    watch: {
        permissionItem5(_new){
            this.handleAuth(_new)
        }
    },
    data (){
        return{
            modalTitle: '',
            tableRow: {},
            tableRowData: {},
            lectureesItem2: false,
            lectureesItem3: false,
            keyword: '',
            selectList:[
                {
                    value:'all',
                    label:'全部机构'
                },
                {
                    value:'zj',
                    label:'浙江医院'
                }
            ],
            formList: [
                { type: 'input', name: '讲师姓名',  field: 'name'},
                { type: 'textarea', name: '讲师介绍',  field: 'description' }
            ],
            rules:{
                name: [{ required: true, message: '请输入讲师姓名', trigger: 'blur' } ],
                description: [{ required: true, message: '请输入讲师介绍', trigger: 'blur' } ]
            },
            operationList: null,
            list: [
               {
                   img: 'static/mn.jpeg',
                   name: '王金金',
                   num: 5
               },
               {
                   img: 'static/mn.jpeg',
                   name: '王金金',
                   num: 6
               }
            ]
        }
    },
    methods: {
        edit(t){
            this.modalTitle = '编辑讲师'
            this.show = true
            this.tableRow = {}
            console.log(t,'edit')
        },
        deletes(t){
            postData('user/removeTeacher', {id: t.id}).then((res) => {
                this.getList()
            })
        },
        inputChange(val){
            this.keyword = val;
            this.getList()
        },
        handleClick(){
            this.modalTitle = '添加讲师'
            this.show = true
            this.tableRow = {}
            console.log('open modal')
        },
        handleSubmit(val){
           if(this.modalTitle == '添加讲师') this.fromAddAndEdit('user/addTeacher',val)
           else this.fromAddAndEdit('user/modifyTeacher',val)
        },
        getList(){
            let d = {
                keyword: this.keyword,
                page_size: this.pageSize,
                page_num: this.current
            }
            postData('user/getTeacherList', d).then((res) => {
                  this.list = res.data.list
                  this.total = res.data.count
            })
        }
    },
    mounted() {
       this.getList()
       if(this.permissionItem5) this.handleAuth(this.permissionItem5)
    }
  }
</script>

<style lang="less" scoped>
.lecturer-list-item{
   background: #F0F0F7;
   border-radius: 8px;
   height: 110px;
   padding-left: 10px;
   display: flex;
   flex-direction: row;
   flex-wrap: nowrap;
   align-items: center;
   position: relative;
   .lecturer-item-img{
       width: 59px;
       height: 60px;
       border-radius: 30px;
   }
   .lecturer-item-content{
     margin-left: 15.5px;
     display: flex;
     flex-direction: column;
     justify-content: flex-start;
     h2,p{
         text-align: left;
         color: #474C63;
     }
     h2{
        font-family: PingFangSC-Medium;
        font-size: 18px;
        margin-bottom: 15px;
     }
     p{
         font-family: PingFangSC-Regular;
         font-size: 14px;
     }
   }
   .lecturer-item-btn{
       position: absolute;
       right: 0;
       width: 35px;
       height: 110px;
       background-color: #fff;
       background: #9397AD;
       display: none;
       border-top-right-radius: 8px;
       border-bottom-right-radius: 8px;
       display: none;
       .lecturer-btn-icon{
           margin-top: 20px;
           margin-bottom: 30px;
       }
       img{
           width: 17.5px;
           height: 17.5px;
       }
   }
}
.lecturer-list-item:hover .lecturer-item-btn{
    display: block;
}
.lecturer-list{
    margin: 20px;
}
/deep/ .ivu-col-span-6{margin-bottom: 20px;}
/deep/ .ivu-page {
    
}
</style>
