<template>
    <div >
        <Tabs @on-click="tabs" v-model="online">
            <TabPane label="线上自学" v-if="item1" name="product1">
                <online />
            </TabPane>
            <TabPane label="线下集中" v-if="item2" name="product2">
                <offline />
            </TabPane>
            <TabPane label="作业" v-if="item3" name="product3">
                <task />
            </TabPane>
            <TabPane label="资料" v-if="item4" name="product4">
                <course />
            </TabPane>
            <TabPane label="证书" v-if="item5" name="product5">
                <houner />
            </TabPane>
        </Tabs>
    </div>
</template>

<script>
  import online from '../Online/ManageOnlineCourse'
  import offline from '../Offline/ManageOfflineList'
  import task from '../Task/ManageTask'
  import course from '../Course/ManageCourseDownloadData'
  import houner from '../Houner/ManageHouner'

  export default {
    name: "OpenProduct",
    components: { online, offline, task, course, houner},
    data(){
      return{
          online: '',
          item1: false,
          item2: false,
          item3: false,
          item4: false,
          item5: false
      }
    },
    methods:{
        tabs(name){
            this.online = name
            localStorage.setItem('onlinePane', name)
        },
        setAuth(){
            if(localStorage.getItem('PERSONALDETAILS')){
               this.item1 = true;
               this.item2 = true;
               this.item3 = true;
               this.item4 = true;
               this.item5 = true;
            }
        }
    },
    mounted(){
        this.setAuth()
        if(localStorage.getItem('onlinePane')){
            this.online = localStorage.getItem('onlinePane')
        }
    }
  }
</script>

<style scoped lang="less">

</style>
