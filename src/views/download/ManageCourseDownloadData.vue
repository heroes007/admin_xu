<template>
    <div class='manage-course-download-data'>
        <!-- <header-component title="课程资料" :type='0' :showAdd='true' addText='添加课程资料' @addClick='addClickHandler'/> -->
        <screen :types="2" sizeTitle1="资料总数" :sizeNum1="courseNums" btnName="添加资料" @inputChange="manageEdit" @handleClick="addClickHandler" :btnType="true"/>
        <data-list class='data-list light-header' @delete='deleteHandler' @download='downloadMsg' @edit='addClickHandler2' :isStripe='false' :table-data='dataList'
          :header-data='dataHeader' :columnComboData='columnComboData' :comboModelList='comboDataList'></data-list>
    </div>
</template>

<script>
  import BaseList from '../../components/BaseList'
  import Header from '../../components/ProjectHeader'
  import { mapActions, mapState, mapGetters } from 'vuex'
  import { Dialog } from '../dialogs'
  import { ADD_DOWNLOAD_DATA } from '../dialogs/types'
  import { doTimeFormat } from '../../components/Util'
  import { Config } from '../../config/base'
  import screen from '../../components/ScreenFrame'
  export default {
    mixins: [Dialog],
    components: { 'header-component': Header, 'data-list': BaseList ,screen},
    data() {
      return {
        searchData: '',
        loadingInstance: null,
        showPopper: false,
        searchResult: {
          code_name: '',
          user_id: 0,
          nickname: '',
          realname: '',
          phone: '',
          use_time: null,
          state: 1
        },
        courseNums:12
      }
    },
    computed: {
      ...mapState({
        // isLoading: state => state.download_data.isLoading,
        dataList: state => state.download_data.course_download_data_list,
        query_online_course_list: state => state.online_curriculum.online_curriculum_list,
        projectId: state => state.project.select_project_id
      }),
      comboDataList() {
        var r = [];
        var v = []
        for (var i = 0; i < this.dataList.length; i++) {
          v = [];
          for (var j = 0; j < this.dataList[i].pre_curriculum.length; j++) {
            v.push(this.dataList[i].pre_curriculum[j]);
          }
          r.push(v);
        }
        return r;
      },
      categoryList() {
        return this.$store.state.task.task_category_list;
      },
      columnComboData() {
        return [this.query_online_course_list];
      },
      columnComboModel() {
        var result = [];
        var value = []
        for (var i = 0; i < this.dataList.length; i++) {
          value = [];
          for (var j = 0; j < this.dataList[i].pre_curriculum.length; j++) {
            value.push(this.dataList[i].pre_curriculum[j]);
          }
          result.push({data: value});
        }
        return result;
      },
      dataHeader() {
        return [
          {
            sort: true,
            label: '序号',
            width: 100
          },
          {
            prop: 'name',
            label: '资料名称',
            align: 'left',
            width: 500
          },
          // {
          //   prop: 'download_url',
          //   label: '下载链接',
          //   width: 700
          // },
          {
            label: '绑定课程',
            prop: 'pre_curriculum',
            useCombo: true,
            comboListIndex: 0,
            listLabel: 'title',
            listValue: 'curriculum_id',
            actionName: 'change_course_download_data_pre_curriculum'
          },
          {
            label: '操作',
            minwidth: 300,
            groupBtn: [
            //   {
            //   isSwitch: true,
            //   switchKey: 'is_valid',
            //   onText: '启用',
            //   offText: '停用',
            //   disableText: '失效',
            //   actionName: 'change_public_download_data_valid'
            // },
            {
              text: '下载',
              prop:'download_url',
              param: 'download',
              // isIcon: true
            },
            {
              text: '编辑',
              param: 'edit',
              // isIcon: true
            },
            {
              text: '删除',
              param: 'delete',
              // isIcon: true
            }
            ]
          }
        ]
      }
    },
    watch: {
      // isLoading(val) {
      //   if (val) {
      //     this.loadingInstance = this.$LoadingY({message: "加载中，请稍后", show: true});
      //     setTimeout(() => {
      //       this.loadingInstance.close();
      //     }, Config.base_timeout);
      //   } else {
      //     if (this.loadingInstance) this.loadingInstance.close();
      //   }
      // }
    },
    methods: {
      ...mapActions([ 'get_online_curriculum_list', 'get_curriculum_donwload_data_list', 'delete_download_data' ]),
      addClickHandler() {
        this.handleSelModal(ADD_DOWNLOAD_DATA, 1);
      },
      addClickHandler2() {
        this.handleSelModal(ADD_DOWNLOAD_DATA, 0);
      },
      manageEdit(){
        console.log("课程资料搜索");
      },
      deleteHandler(index, row) {
        this.$Modal.confirm({
          title: '提示',
          content: '<p>是否确定删除该资料？</p>',
          onOk: () => {
            this.delete_download_data(row.id);
          },
        });
      },
      downloadMsg(row){
        // window.open(this.dataList[row].download_url)
      }
    },
    mounted() {
      setTimeout(()=>{
        console.log(this.dataList,'this.dataList');
      },1000)
      this.get_online_curriculum_list({project_id: this.projectId});
      this.get_curriculum_donwload_data_list({project_id: this.projectId});
    }
  }
</script>
<style scope lang='scss'>
    .manage-course-download-data {
        .data-list {
            .base-list-row {
                height: 65px;
                &.invalid-row {
                    background-color: #FBFBFB;
                }
            }
        }
    }

</style>
