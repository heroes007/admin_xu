<template>
    <Tabs value="manage">
        <TabPane label="管理列表" name="manage">
            <screen :types="1" size-title1="管理总数" :size-num1="23" btn-name="添加管理" :select1="selectList" :select2="selectList"
                    @selectChange1="selectChange1"  @selectChange2="selectChange2" @inputChange="inputChange" @handleClick="handleClick"/>
        </TabPane>
        <TabPane label="机构列表" name="product">标签二的内容</TabPane>
        <TabPane label="导师列表" name="teacher">标签三的内容</TabPane>
        <TabPane label="学员列表" name="user"><student/></TabPane>
    </Tabs>
</template>

<script>
    import student from '../student/ManageStudent'
    import screen from '../../components/ScreenFrame'
  export default {
    name: "index",
    components: {screen, student},
    data(){
      return {
        selectList:[
          {
            value:'all',
            label:'全部机构'
          },
          {
            value:'zj',
            label:'浙江医院'
          },
          {
            value:'bj',
            label:'北京医院'
          },
        ]
      }
    },
    methods:{
      selectChange1(val){
        console.log(val)
      },
      selectChange2(val){
        console.log(val)
      },
      inputChange(val){
        console.log(val)
      },
      handleClick(){
        console.log('open modal')
      }
    }
  }
</script>

<style scoped lang="scss">

</style>
