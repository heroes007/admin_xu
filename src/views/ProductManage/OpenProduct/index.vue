<template>
    <div >
        <Tabs @on-click="tabs" v-model="online">
            <TabPane label="线上课" v-if="item1" name="product1">
                <online v-if="pane1" />
            </TabPane>
            <TabPane label="线下课" v-if="item2" name="product2">
                <offline v-if="pane2" />
            </TabPane>
            <TabPane label="作业" v-if="item3" name="product3">
                <task v-if="pane3" />
            </TabPane>
            <TabPane label="资料" v-if="item4" name="product4">
                <course v-if="pane4" />
            </TabPane>
            <TabPane label="证书" v-if="item5" name="product5">
                <houner v-if="pane5" />
            </TabPane>
        </Tabs>
    </div>
</template>

<script>
  import online from '../Online/ManageOnlineCourse'
  import offline from '../Offline/ManageOfflineList'
  import task from '../task/ManageTask'
  import course from '../course/ManageCourseDownloadData'
  import houner from '../houner/ManageHouner'

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
          pane1: true,
          pane2: false,
          pane3: false,
          pane4: false,
          pane5: false
      }
    },
    methods:{
        tabs(name){
            localStorage.setItem('onlinePane',name)
            let n = +name.replace(/[^0-9]/ig,"");
            if(this['item'+n]) this['pane'+n] = true
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
                    this.pane3 = true;
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
            this.tabs(this.online)
        }
    }
  }
</script>

<style scoped lang="scss">

</style>
