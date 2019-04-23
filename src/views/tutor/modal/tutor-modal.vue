<template>
    <Modal v-model="isShow" :title="title" :styles="{top: '60px'}" :width="700" :mask-closable="false" :footer-hide="true" @on-cancel="closeModal">
       <div v-if="type=='batch'" class="batch">
         <div class="batch-main" v-for="(m,k) in 10"  :class="k&&k%9 ? 'batch-marign' : ''" :key="k">
            <img class="batch-img" src="https://tse1-mm.cn.bing.net/th?id=OIP.zFHMM1nmacDSqmOp8Y564QHaHa&w=209&h=209&c=8&rs=1&qlt=90&dpr=2&pid=3.1&rm=2" />
            <span class="grey-regular3 batch-name">天涯</span>
         </div>
        <div class="batch-type">
            <span class="grey-regular2">方式：</span>
            <RadioGroup v-model="modeRadio">
                <Radio label="false"><span>单人批阅</span></Radio>
                <Radio label="true"><span>统一批阅</span></Radio>
            </RadioGroup>
         </div>
       </div>
       <div v-else>
            <div v-if="type=='seeTask'" class="student-info">
                <img class="batch-img" :src="studentInfo[0].head_img_url" />
                <div class="student-name">
                     <div class="grey-medium1">
                         {{studentInfo[0].realname}}
                        <img v-if="studentInfo[0].sex" src="../../../assets/img/female.png" />
                        <img v-else src="../../../assets/img/male.png" />
                    </div>
                     <span class="grey-regular4">ID: {{studentInfo[0].username}}</span>
                </div>
            </div>
            <div v-for="(t,i) in list" :key="i" class="task-list">
                <p class="grey-regular1">{{t.title}}</p >
                <p class="job-details grey-regular2" v-html="t.description"></p >
                <down-loading text="附件" v-if="t.downList && t.downList.length>0" :formData="t.downList"/>
                <div v-if="type=='seeTask'">
                    <div class="radio-type">
                        <span class="grey-regular2">批阅：</span>
                        <RadioGroup v-model="t.mark_state" :disabled="!Boolean(t.mark_state)">
                            <Radio :label="1"><span>通过</span></Radio>
                            <Radio :label="0"><span>不通过</span></Radio>
                        </RadioGroup>
                        <div v-if="t.mark_state">
                            <InputNumber class="marking-text" :max="100" :min="1" v-model="t.score"></InputNumber>
                            <span class="grey-regular2 branch">分（满分100）</span>
                        </div>
                    </div>
                    <Input  class="textarea" type="textarea" :rows="6" v-model="t.comment" placeholder="请输入评语"></Input>
                    <!-- <p v-else>评语: <span>{{t.comment}}</span></p> -->
                </div>
                <Divider v-if="i != (list.length-1)" />
            </div>
       </div>
       <div v-if="type !='subject'"> 
         <div v-if="type=='batch'">
            <div class="radio-type">
                <span class="grey-regular2">批阅：</span>
                <RadioGroup v-model="MarkingRadio">
                    <Radio label="true"><span>通过</span></Radio>
                    <Radio label="false"><span>不通过</span></Radio>
                </RadioGroup>
                <InputNumber class="marking-text" :max="100" :min="1" v-model="MarkingText"></InputNumber>
                <span class="grey-regular2 branch">分（满分100）</span>
            </div>
            <Input class="textarea" type="textarea" :rows="6" v-model="comment" placeholder="请输入评语"></Input>
         </div>
         <div class="submission"><Button type="primary" @click="submission">提交</Button></div>
       </div>

    </Modal>
</template>

<script>
import DownLoading from '../../../components/DownLoading'
import postData from '../../../api/postData';
export default {
    components: { DownLoading },
    props: {
        show: {
            type: Boolean,
            required: false
        },
        title: { type: String },
        type: { type: String },
        details: {
            type: Array,
            default: []
        },
        studentInfo: {
            type: Array,
            default: []
        }
    },
    data() {
        return {
            isShow: false,
            list: [],
            modeRadio: 'false',
            MarkingRadio: 'true',
            MarkingText: 0,
            comment: ''
        }
    },
    watch: {
        details(_new){
            this.list = _new
        },
        show(val) {
            this.isShow = val;
            if(val){
                if(Array.isArray(this.list)){
                    this.list.map(t => {
                        if(t.attachment_url){
                         let text = t.attachment_url
                         let attachment = text.includes('attachment_') ? text.replace(/attachment_/g, '') : text
                         let d = JSON.parse(attachment)
                         if(this.type == 'seeTask') t.description = t.answer
                         if(Array.isArray(d) && d.length > 0)  t.downList = d
                        }
                    });
                }
            }
            console.log(this.list,'this.list',this.studentInfo)
        }
    },
    methods: {
        closeModal(val) {
            this.$emit('close-modal', val)
        },
        submission(){
            let d = null, url = null;
            if(this.type == 'seeTask'){
                d = this.list[this.list.length-1];
                if(d) d.student_homework_answer_id = d.id
                url = 'product/homework/mark'
            }
            postData(url,d).then((res) => {
                if(res.res_code == 1){
                    this.$Message.success(res.msg)
                }
            })
        },
    }
}
</script>

<style lang="less" scoped>
/deep/ .ivu-modal-body{
    padding: 19.8px 40px 40px 40px;
}
.job-details{
    margin-top: 10px;
    letter-spacing: 1.14px;
    line-height: 26px;
}
.batch{
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    width: 100%;
    .batch-type{
        width: inherit
    }
    .batch-marign{
        margin-left: 20px;
    }
    .batch-main{
      display: flex;
      flex-direction: column;
      margin-bottom: 20px;
      .batch-name{
          text-align: center;
      }
    }
}
.batch-img{
    width: 50px;
    height: 50px;
    border-radius: 25px;
    margin-bottom: 6px;
}
/deep/ .ivu-radio-group-item{
    font-family: PingFangSC-Regular;
    font-size: 16px;
    color: #474C63;
}
/deep/ .ivu-radio-inner{
    width: 24px;
    height: 24px;
}
/deep/.ivu-radio-inner:after {
    width: 14px;
    height: 14px;
}
/deep/.ivu-radio-inner:after {
    position: absolute;
    left: 4px;
    top: 4px;
    border-radius: 8px;
}
.radio-type{
    margin-top: 30px;
    width: 100%;
    display: flex;
    line-height: 36px;
}
/deep/ .ivu-input-number{
    width: 80px !important
}
.submission{
    display: flex;
    justify-content: center;
    width: 100%
}
.marking-text{
    margin-left: 20px;
}
.branch{
    margin-left: 10px;
}
.textarea{
    margin-top: 30px;
}
/deep/.ivu-btn{
    width: 200px;
    margin-top: 50px;
}
.task-list{
    margin-top: 20px;
}
.student-info{
    display: inline-flex;
}
.student-name{
    margin-left: 10px;
    display: flex;
    flex-direction: column;
}
</style>
