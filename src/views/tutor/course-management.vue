<template>
 <div>
    <screen :types="12" size-title1="管理课程" selectType2 :size-num1="16"  select2Placeholder="请选择课程"  :select2="selectList1" @selectChange2="selectChange2" />
    <div class="course-list">
        <Card class="course-main">
            <div class="course-main-item">
               <div class="course-item-de">
                  <p>这是课程名称癌症病人理与症状干预…</p>
               </div>
            </div>
             <div class="course-main-item">
                <h3>A high quality UI Toolkit based on Vue.js</h3>
            </div>
        </Card>
    </div>
 </div>
</template>

<script>
  import screen from '../../components/ScreenFrame.vue'
  export default {
    components: { screen },
    data(){
        return{
            selectList1: [
                { id: 'all', title: '全部课程' },
                { id: 1, title: '线上自学' },
                { id: 2, title: '线上集中'},
                { id: 3, title: '线下集中' },
            ],
        }
    },
    methods: {
        toLink(){
            this.$router.push('/job-list')
        },
        selectChange2(v){
            console.log(v);
        }
    },
    mounted() {

    }
  }
</script>
<style lang="less" scoped>
.course-list{
    padding: 20px 30px;
    .course-main{
        width: 100%;
        margin-bottom: 20px;
        .course-main-item{
            display: flex;
            flex-direction: column;
            .course-item-de{
                display: inline-flex;
            }
        }
    }
}
</style>
