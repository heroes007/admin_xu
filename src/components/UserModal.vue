<template>
  <Modal v-model="show" :title="title" :width="590" @on-cancel="closeModal"  :mask-closable=false :footer-hide="true" >
      <div v-if="uploadFlie" class="upload-flie">
           <Upload action="//jsonplaceholder.typicode.com/posts/" :data="uploadData" @on-success="uploadSuccess">
                <div class="modal-upload-flie">
                    <img class="upload-flie-img" src="/static/icon/upload.png"/>
                    <p>点击上传</p>
                </div>
            </Upload>
      </div>
       <Form ref="formValidate" :model="formItem" :label-width="100" :rules="ruleValidate ? ruleValidate : {}">
           <div v-for="(t,index) in formList" :key="index">
                <FormItem v-if="t.type==='input'" :label="t.name" :prop="t.field">
                    <Input v-model="formItem[t.field]" :placeholder="'‘请输入'+t.name"></Input>
                </FormItem>
                <FormItem v-if="t.type==='textarea'" :label="t.name" :prop="t.field">
                     <Input type="textarea" v-model="formItem[t.field]" :placeholder="'‘请输入'+t.name"></Input>
                </FormItem>
                 <FormItem v-if="t.type==='select'" :label="t.name" :prop="t.field">
                    <Select v-model="formItem[t.field]">
                        <Option v-if="t.selectList[0] === 'jurisdiction'" v-for="(m,i) in projectList" :key="i" :value="m.id">{{m.name}}</Option>
                        <Option v-else v-for="(m,i) in t.selectList" :key="i" :value="m[t.selectField[0]]">{{m[t.selectField[0]]}}</Option>
                    </Select>
                </FormItem>
           </div>
        </Form>
        <p class="modal-text">* 获得九划后台所有操作权限</p>
        <div class="foot-btn">
             <Button class="btn-orange" type="primary" @click="handleSubmit('formValidate')">保存</Button>
        </div>
    </Modal>
</template>
<script>
import { mapState } from 'vuex'
export default {
    props:{
        showModal: {
            type: Boolean,
            default: false
        },
        title: {
          type: String,
          default: ''
        },
        detailData: {
          type: Object,
          default: () => {}
        },
        // [
        //     { type: 'input', name: '真实姓名',  field: 'realname'},
        //     { type: 'select', name: '管理权限', field: 'jurisdiction' ,
        //     selectList: [
        //         // { value: 'New York', label: 'New York'}
        //     ],
        //     selectField: [
        //         // 'value','label'
        //         ]
        //     }
        // ]
       formList: {
          type: Array,
          default: []
       },
       ruleValidate: {
          type: Object,
          default: {}
       },
       uploadFlie: {
            type: Boolean,
            default: false
       }
    },
    data (){
        return{
            show: false,
            formItem: {},
            uploadData: {}
        }
    },
    computed: {
        ...mapState({ projectList: state => state.project.project_list })
    },
    watch:{
        showModal(_new){
            this.ModalState(_new)
        },
        detailData(_new){
            this.formItem = _new
        }
    },
    methods: {
        closeModal(){
            this.show = false;
            this.$emit("close")
        },
        ModalState(_new){
            this.show = _new
            console.log(this.projectList);
        },
        handleSubmit(name){
            this.$refs[name].validate((valid) => {
                if (valid) {
                    this.$Message.success('Success!');
                    this.closeModal()
                } else {
                    this.$Message.error('Fail!');
                }
            })
        },
        uploadSuccess(response, file){
            console.log(response, file)
        }
    }
}
</script>
<style lang="less" scoped>
/deep/ .ivu-modal-header{background: #fff !important; padding: 0 !important;}
/deep/ .ivu-modal-close .ivu-icon-ios-close{ color:#9397AD !important; }
/deep/ .ivu-modal-header-inner{
    font-family: PingFangSC-Regular !important;
    font-size: 20px !important;
    color: #474C63 !important;
    height: 70px;
    line-height: 70px;
}
/deep/ .ivu-modal-body{
    padding: 40px;
}
.modal-text{
     margin-left: 100px; 
     font-family: PingFangSC-Regular;
    font-size: 14px;
    color: #F54802;
}
.btn-orange{
    width: 150px;
}
.foot-btn{ display: flex; justify-content: center;margin-top: 30px; }
.upload-flie{ display: flex; justify-content: center; }
.modal-upload-flie{
    width: 118px;
    height: 118px;
    background: #F0F0F7;
    border-radius: 100px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
}
.upload-flie-img{ width: 40px;height: 35px; }
</style>

