<template>
    <div >
        <Tabs value="online">
            <TabPane label="线上课" name="online">
                <online/>
            </TabPane>
            <TabPane label="线下课" name="offline">
                <offline/>
            </TabPane>
            <TabPane label="作业" name="task">
                <task/>
            </TabPane>
            <TabPane label="资料" name="course">
                <course/>
            </TabPane>
            <TabPane label="证书" name="houner">
                <houner/>
            </TabPane>
        </Tabs>
    </div>
</template>

<script>
  import sideMenu from '../../../components/SideMenuForProject'
  import online from '../../information/ManageOnlineCourse'
  import offline from '../../information/ManageOfflineCourse'
  import task from '../../information/ManageTask'
  import course from '../../download/ManageCourseDownloadData'
  import houner from '../../information/ManageHouner'

  export default {
    name: "OpenProduct",
    components: {sideMenu, online, offline, task, course, houner},
    data(){
      return{

      }
    },
    methods:{

    }
  }
</script>

<style scoped lang="scss">

</style>
