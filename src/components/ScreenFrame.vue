<template>
    <div class="screen" :style="(types == 4 || types == 8 || types == 9) ? backgroundColor:''">
        <div v-if="types == 6 || types == 7 || types == 8 || types == 9" class="back" @click="handleBack">
            <img class="back-img" src="../../static/icon/back.png" alt="">
            <div class="back-title">返回</div>
        </div>
        <Select v-if="types !== 1 && types && types !== 6 && types !== 7 && types !== 9 && selectType1 && isSuper" v-model="valueSelect1" @on-change="selectChange1" class="select-list">
            <Option v-for="(item,i) in select" :value="item.id " :key="i">{{ item.title }}</Option>
        </Select>
        <Select v-if="types == 4 || types == 5 || types == 10 && selectType2" v-model="valueSelect2" @on-change="selectChange2" class="select-list">
            <Option v-for="item in select2" :value="item.id" :key="item.id">{{ item.title }}</Option>
        </Select>
        <Input v-if="types && types !== 6 && types !== 7 && types !== 9 && types != 10" v-model="valueInput" :placeholder="placehodle ? placehodle : placehodleInput" @on-change="inputChange" class="input">
            <Icon type="md-search" slot="prefix" />
        </Input>
        <div v-if="types == 5 && radioType && isSuper" class="money-student" @click="moneyStudent">
            <Icon :color="iconColor" size="20" type="md-radio-button-on" />
            <span class="money-student-content">付费学员</span>
        </div>
        <div v-if="types && types !== 6 && types !== 7"  class="all-size">
            <span class="all-content">{{sizeTitle1}}</span>
            <span class="all-num">{{sizeNum1}}</span>
        </div>
        <div v-if="types ==3 || types ==5 || types ==8 && isSuper" class="money-size">
            <span class="all-content">{{sizeTitle2}}</span>
            <span class="all-num">{{sizeNum2}}</span>
        </div>
        <div v-if="types == 6 || types == 7 || types == 9 || types == 10" class="title">
            <div>{{title}}</div>
        </div>
        <Button v-if="types && types !== 5 && types !== 7 && types !== 8 && types !== 9 && btnType" class="btn" type="primary" @click="handleClick">{{btnName}}</Button>
        <p class="code_name_text" v-if="types == 8">{{codeName}}</p>
    </div>
</template>

<script>
  import postData from '../api/postData'
  export default {
    name: "ScreenFrame",
    data() {
      return {
        valueSelect1: '',
        valueSelect2: '',
        valueInput: '',
        placehodleInput: '搜索用户名/姓名/手机号',
        iconColor: '#9397AD',
        backgroundColor: 'background: #fff',
        isSuper: false,
        select: [{id: '', title:'全部机构'}]
      }
    },
    props:{
      //types=1：搜索框+数量+按钮； types=2：下拉框+搜索框+数量+按钮； types=3：下拉框+搜索框+数量*2+按钮； types=4：下拉框*2+搜索框+数量+按钮；
      //types=5：下拉框*2+搜索框+付费学员+数量*2； types=6：返回+标题+按钮； types=7：返回+标题； types=8 兑换码--使用记录
      //type = 10 下拉框+标题+按钮
      types: {
        type: Number,
        required: true,
      },
      // 控制 select
      selectType1: {
        type: Boolean,
        default: false
      },
      selectType2: {
        type: Boolean,
        default: false
      },
      radioType: {
        type: Boolean,
        default: false
      },
      // 控制按钮 的 显示隐藏
      btnType: {
        type: Boolean,
        default: false
      },
      select1: {
        type: Array
      },
      select2: {
        type: Array
      },
      sizeTitle1: {
        type: String
      },
      sizeNum1: {
        type: Number
      },
      sizeTitle2: {
        type: String
      },
      sizeNum2: {
        type: Number
      },
      btnName:{
        type: String
      },
      title:{
        type: String
      },
      placehodle: {
         type: String
      },
      codeName: {
         type: String,
         default: ''
      },
    },
    mounted() {
      // if(this.select1 && this.select1.length) this.valueSelect1 = this.select1[0].value
      if(this.select2 && this.select2.length) this.valueSelect2 = this.select2[0].value
      this.isSuper = JSON.parse(localStorage.getItem('PERSONALDETAILS')).role_id == 1 ? true : false
      postData('components/getOrganization').then((res) => {
        console.log(res,'res')
        this.select = [...this.select, ...res.data]
      })
    },
    methods:{
      // 付费学员返回事件，click触发，选中返回true
      moneyStudent(){
        this.iconColor = this.iconColor == '#9397AD' ? "#4098ff" : "#9397AD"
        this.$emit('moneyStudent', this.iconColor == '#9397AD' ? 'YES' : 'NO')
      },
      //一个下拉框，change触发，返回value
      selectChange1(val){
        this.$emit('selectChange1', val)
      },
      //第二个下拉框，change触发，返回value
      selectChange2(val){
        this.$emit('selectChange2', val)
      },
      //输入事件，change触发，返回model
      inputChange(){
        this.$emit('inputChange', this.valueInput)
      },
      //按钮，click触发事件
      handleClick(){
        this.$emit('handleClick')
      },
      //返回按钮触发事件
      handleBack(){
        this.$emit('handleBack')
      }
    }
  }
</script>

<style scoped lang="scss">
    .screen{
        height: 66px;
        background: #F0F0F7;
        display: flex;
        align-items: center;
        position: relative;
    }
    /deep/ .ivu-select-selection{
        border-radius: 100px;
        height: 36px;
        padding-left: 15px;
    }
    /deep/ .ivu-select-placeholder{
        font-size: 16px !important;
    }
    .input{
        width: 300px;
        height: 36px;
        margin-left: 10px;
    }
    /deep/ .ivu-input{
        border-radius: 100px !important;
        padding-left: 40px;
        font-size: 16px !important;
    }
    /deep/ .ivu-input-prefix{
        margin-left: 10px;
    }
    /deep/ .ivu-icon-md-search{
        font-size: 20px;
    }
    .money-student{
        width: 130px;
        height: 36px;
        background-color: #fff;
        display: flex;
        align-items: center;
        border-radius: 100px;
        margin-left: 10px;
        cursor: pointer;
        &:hover{
            .money-student-content{
                color: #4098ff;
            }
        }
        /deep/ .ivu-icon-md-radio-button-on{
            margin-left: 16px;
        }
        .money-student-content{
            margin-left: 10px;
            font-family: PingFangSC-Regular;
            font-size: 16px;
            color: #474C63;
            letter-spacing: 0;
        }
    }
    .all-size{
        margin-left: 20px;
    }
    .money-size{
        border-left: 1px solid #CDCED3;
        margin-left: 12px;
        padding-left: 12px;
    }
    .all-content{
        font-family: PingFangSC-Regular;
        font-size: 16px;
        color: #474C63;
        letter-spacing: 0;
    }

    .all-num{
        font-family: PingFangSC-Regular;
        font-size: 16px;
        color: #4098FF;
        letter-spacing: 0;
        margin-left: 10px;
    }
    .all-list{
        margin-right: 12px;
    }
    .btn{
        width: 110px;
        height: 36px;
        position: absolute;
        right: 34px;
    }
    .select-list{
        width:200px;
        margin-left: 21px;
    }
    .back{
        display: flex;
        justify-content: center;
        align-items: center;
        margin-left: 40px;
        cursor: pointer;
        .back-img{
            width: 23px;
            height: 19px;
        }
        .back-title{
            margin-left: 10px;
            font-family: PingFangSC-Regular;
            font-size: 16px;
            color: #474C63;
            letter-spacing: 0;
        }
    }
    .title{
        font-family: PingFangSC-Medium;
        font-size: 18px;
        color: #474C63;
        letter-spacing: 0;
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
    }
    .code_name_text{
      font-family: PingFangSC-Regular;
      font-size: 16px;
      color: #474C63;
      position: absolute;
      right: 40px;
    }
</style>
