<template>
    <div >
        <Tabs @on-click="tabs" v-model="online">
            <TabPane label="线上课" v-if="item1" name="online">
                <online/>
            </TabPane>
            <TabPane label="线下课" v-if="item2" name="offline">
                <offline/>
            </TabPane>
            <TabPane label="作业" v-if="item3" name="task">
                <task/>
            </TabPane>
            <TabPane label="资料" v-if="item4" name="course">
                <course/>
            </TabPane>
            <TabPane label="证书" v-if="item5" name="houner">
                <houner/>
            </TabPane>
        </Tabs>
    </div>
</template>

<script>
  import online from '../../information/ManageOnlineCourse'
  import offline from '../../information/ManageOfflineList'
  import task from '../../information/ManageTask'
  import course from '../../download/ManageCourseDownloadData'
  import houner from '../../information/ManageHouner'

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
          item5: false,
      }
    },
    methods:{
        tabs(name){
            localStorage.setItem('onlinePane',name)
        },
        setAuth(){
            if(localStorage.getItem('PERSONALDETAILS')){
               let d = JSON.parse(localStorage.getItem('PERSONALDETAILS'));
               this.item1 = true;
               this.item2 = true;
               this.item3 = true;
               this.item4 = true;
               this.item5 = true;
               if(d.role_id === 4){
                    this.item1 = false;
                    this.item2 = false;
                    this.item3 = true;
                    this.item4 = false;
                    this.item5 = false;
                    this.online = localStorage.getItem('onlinePane')
               }
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

<style scoped lang="scss">

</style>
