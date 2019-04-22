<template>
 <div class="course-management">
    <screen :types="12" size-title1="管理课程" selectType2 :size-num1="list.length"  select2Placeholder="请选择课程"  :select2="selectList1" @selectChange2="selectChange2" />
    <div class="course-list" v-if="list.length>0">
        <Card class="course-main" v-for="(t,i) in list" :key="i" @click.native="rowClick(t.id)">
            <div class="course-main-item">
               <div class="course-item-de">
                  <p class="font-regular3 text-ellipsis course-item-title">{{t.title}}</p>
                  <div class="item-right">
                      <p class="course-item"><span class="font-regular1" v-text="t.curr_finish_count"></span><span v-if="t.join_count||t.join_count==0" class="font-regular5">/{{t.join_count}}</span></p>
                      <p class="course-item"><span class="font-regular1" v-text="t.complete_hw_count"></span><span v-if="t.join_count||t.join_count==0" class="font-regular5">/{{t.join_count}}</span></p>
                      <!-- <p class="course-item"><span class="font-regular1">13</span><span class="font-regular5">/24</span></p> -->
                      <p><span class="item-badge">{{t.no_see_count}}</span><span>作业</span></p>
                  </div>
               </div> 
               <div class="course-item-de course-item-de2">
                  <div class="course-item-title course-flex">
                      <span class="course-item-type" :class="t.curriculum_type">{{t.curriculum_name}}</span>
                      <p class="course-item-title2 text-ellipsis font-regular5">{{t.parent_title}}</p>
                  </div>
                  <div class="item-right item-right2">
                      <p class="course-item"><span class="font-regular5">结课学员</span></p>
                      <p class="course-item"><span class="font-regular5">完成作业</span></p>
                      <!-- <p class="course-item"><span class="font-regular5">问答总数</span></p> -->
                      <!-- <p><span class="item-badge">0</span><span>提问</span></p> -->
                  </div>
               </div> 
            </div>
        </Card>
    </div>
 </div>
</template>

<script>
  import screen from '../../components/ScreenFrame.vue'
  import postData from '../../api/postData.js'
  export default {
    components: { screen },
    data(){
        return{
            selectList1: [
                { id: 'all', title: '全部课程' },
                { id: 'online_self', title: '线上自学' },
                { id: 'online_concentrate', title: '线上集中'},
                { id: 'offline_concentrate', title: '线下集中' },
            ],
            list: []
        }
    },
    methods: {
        selectChange2(v){
            let d = v == 'all' ? '' : v;
            this.getList(d)
        },
        rowClick(id){
            this.$router.push({name: 'job-list', params: {id}})
        },
        getList(d){
            postData('tutor/getCurriculumList', {curriculum_type: d || ''}).then((res) => {
              if(res.res_code == 1)  this.list = res.data
              if(this.list.length>0){
                this.list.map((t) => {
                    this.selectList1.forEach((d) => {
                        if(t.curriculum_type == d.id) t.curriculum_name = d.title
                    })
                })
              }
            })
        }
    },
    mounted() {
        this.getList()
    }
  }
</script>
<style lang="less" scoped>
.course-management{
    height: 100%;
    .course-list{
        padding: 20px 30px;
        height: calc(100% - 66px);
        overflow: hidden;
        overflow-y: auto;
        .course-main{
            width: 100%;
            margin-bottom: 20px;
            .course-main-item{
                display: flex;
                flex-direction: column;
                .course-item-de2 {
                    margin-top: 10px;
                }
                .course-item-de{
                    display: inline-flex;
                    position: relative;
                    .course-item-title{
                        width: 43.9%;
                        text-align: left;
                        .online_self{
                           background: #ecf4f1;
                           color: #4098FF;
                        }
                        .offline_concentrate{
                           background: #fef5e7;
                           color: #FFA003;
                        }
                        .course-item-type{
                            padding: 0 7px;
                            border-radius: 18px;
                            font-family: PingFangSC-Medium;
                            font-size: 14px;
                            letter-spacing: 0.13px;
                            white-space: nowrap;
                        }
                        .course-item-title2{
                            margin-left: 10px;
                            text-align: left;
                        }
                    }
                   .course-flex{
                        display: inline-flex;
                    }
                    .item-right2{ margin-right: 76px; }
                    .item-right{
                        position: absolute;
                        right: 0;
                        display: inline-flex;
                        .course-item { 
                            margin-left: 30px; 
                            text-align: center;
                            width: 57px;
                        }
                        .item-badge{
                            background: #F54802;
                            font-family: PingFangSC-Medium;
                            font-size: 14px;
                            color: #FFFFFF;
                            letter-spacing: 0.18px;
                            border-radius: 18px;
                            padding: 0 5px;
                            margin-left: 24px;
                            margin-right: 5px;
                            height: 20px;
                        }
                    }
                }
            }
        }
    }
}
/deep/ .ivu-card-body{
    padding: 20px 18px;
}
</style>
