<template>
   <div>
        <see :detail-data="tableRowData" title="查看信息" :show-modal='detailShow' @close="close" />
        <FormModal :detail-data="tableRow" :uploadFlie=true :show-modal='show' :form-list="formList" @close="closeModal" :title="modalTitle" :rule-validate="rules" />

        <screen :types="1" size-title1="讲师总数" :size-num1="23" btn-name="添加讲师" placehodle="搜索讲师姓名" @inputChange="inputChange" @handleClick="handleClick"/>
        <div class="lecturer-list">
           <Row :gutter="20">
            <Col span="6" v-for="(t,i) in list" :key="i">
                <div class="lecturer-list-item">
                    <img class="lecturer-item-img" :src="t.img" />
                    <div class="lecturer-item-content">
                        <h2>{{t.name}}</h2>
                        <p>绑定课程：{{t.num}}个</p>
                    </div>
                    <div class="lecturer-item-btn">
                       <img @click="edit(t)" class="lecturer-btn-icon" src="/static/icon/edit/edit-a.png" />
                       <img @click="deletes(t)" src="/static/icon/edit/Group14.png" />
                    </div>
                </div>
            </Col>
        </Row>
       </div>
   </div>
</template>

<script>
  import FormModal from '../../../components/FormModal.vue'
  import screen from '../../../components/ScreenFrame'
  import see from '../../../components/SeeInfo.vue'
  import seeMixin from '../seeMixin'
  import userModalMixin from '../userModalMixin'

  export default {
    name: "LecturerList",
    components: { FormModal, screen, see },
    mixins: [seeMixin, userModalMixin],
    data (){
        return{
            modalTitle: '',
            tableRow: {},
            tableRowData: {},
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
                { type: 'input', name: '讲师姓名',  field: 'realname'},
                { type: 'textarea', name: '讲师介绍',  field: 'introduce' }
            ],
            rules:{
                realname: [{ required: true, message: '讲师姓名', trigger: 'blur' } ],
                introduce: [{ required: true, message: '讲师介绍', trigger: 'blur' } ]
            },
            list: [
               {
                   img: 'static/mn.jpeg',
                   name: '王金金',
                   num: 5,
                   edit: true,
                   delete: true
               },
               {
                   img: 'static/mn.jpeg',
                   name: '王金金',
                   num: 6,
                   edit: true,
                   delete: true
               },
               {
                   img: 'static/mn.jpeg',
                   name: '王金金',
                   num: 7,
                   edit: true,
                   delete: true
               },
               {
                   img: 'static/mn.jpeg',
                   name: '王金金',
                   num: 8,
                   edit: true,
                   delete: true
               },
               {
                   img: 'static/mn.jpeg',
                   name: '王金金',
                   num: 9,
                   edit: true,
                   delete: true
               },
               {
                   img: 'static/mn.jpeg',
                   name: '王金金',
                   num: 10,
                   edit: true,
                   delete: true
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
           console.log(t,'delete')
        },
        inputChange(val){
            console.log(val)
        },
        handleClick(){
            this.modalTitle = '添加讲师'
            this.show = true
            this.tableRow = {}
            console.log('open modal')
        }
    },
    mounted() {
        console.log(this.projectList);
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
</style>