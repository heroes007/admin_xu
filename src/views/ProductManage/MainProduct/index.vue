<template>
    <div class='dashboard-view'>
        <Row type='flex' class='col-container'>
            <Col class='menu-bar'>
                <sideMenu/>
            </Col>
            <Col class='sub-view'>
               <router-view />
            </Col>
        </Row>
    </div>
</template>

<script>
  import sideMenu from '../../../components/SideMenuForProject'
  import online from '../../information/ManageOnlineCourse'
  import offline from '../../information/ManageOfflineCourse'
  import task from '../../information/ManageTask'
  import course from '../../download/ManageCourseDownloadData'

  export default {
    name: "MainProduct",
    components: {sideMenu, online, offline, task, course}
  }
</script>

<style scoped lang="scss">
    body {
        background-color: #333333;
    }

    .dashboard-view {
        box-sizing: border-box;
        width: 100%;
        height: 100%;
        background-color: #ffffff;

        .col-container {
            height: 100%;
            flex-wrap: nowrap !important;

            .menu-bar {
                height: 100%;
                max-width: 260px;
                min-width: 260px;
                min-height: 800px;
                background-color: #333333;
                box-shadow: 2px 0 10px 0 rgba(51, 51, 51, 0.06);
                overflow-y: auto;
            }

            .sub-view {
                background-color: #ffffff;
                position: relative;
                min-height: 100vh;
                width: calc(100% - 260px);
                padding-bottom: 50px;
            }
        }
    }
</style>
