<template>
    <div class='manage-public-download-data'>
        <header-component :type='0' :showAdd='true' addText='添加公共资料' @addClick='addClickHandler'/>
        <data-list class='data-list light-header' @delete='deleteHandler' :isStripe='false' :table-data='dataList'
          :header-data='dataHeader' :column-formatter='listColumnFormatter' :column-formatter-data='listColumnFormatterData'></data-list>
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
  export default {
    mixins: [Dialog],
    components: { 'header-component': Header, 'data-list': BaseList },
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
        }
      }
    },
    computed: {
      ...mapState({
        isLoading: state => state.download_data.isLoading,
        dataList: state => state.download_data.public_download_data_list,
        projectId: state => state.project.select_project_id,
        gradeList: state => state.grade.grade_list,
        subjectList: state => state.subject.subject_list,
      }),
      listColumnFormatter() {
        return [{
          columnName: 'grade_id',
          dataIndex: 0,
          dataProp: 'id',
          dataValue: 'name'
        }, {
          columnName: 'subject_id',
          dataIndex: 1,
          dataProp: 'id',
          dataValue: 'name'
        }]
      },
      listColumnFormatterData() {
        return [this.gradeList, this.subjectList];
      },
      dataHeader() {
        return [
          {
            prop: 'name',
            label: '资料',
            width: 200
          }, {
            prop: 'download_url',
            label: '下载链接',
            width: 700
          }, {
            prop: 'subject_id',
            label: '学科',
            width: 80
          }, {
            prop: 'grade_id',
            label: '学段'
          },
          {
            label: '操作',
            minwidth: 300,
            groupBtn: [{
              isSwitch: true,
              switchKey: 'is_valid',
              onText: '启用',
              offText: '停用',
              disableText: '失效',
              actionName: 'change_public_download_data_valid'

            }, {
              text: 'ios-trash-outline',
              param: 'delete',
              isIcon: true
            }]
          }
        ]
      }
    },
    watch: {
      isLoading(val) {
        if (val) {
          this.loadingInstance = this.$LoadingY({message: "加载中，请稍后", show: true})
          setTimeout(() => {
            this.loadingInstance.close()
          }, Config.base_timeout);
        } else if (this.loadingInstance) this.loadingInstance.close()
      }
    },
    methods: {
      ...mapActions([ 'get_subject_list', 'get_grade_list', 'get_public_donwload_data_list', 'delete_download_data' ]),
      addClickHandler() {
        this.handleSelModal(ADD_DOWNLOAD_DATA, 0);
      },
      deleteHandler(index, row) {
        this.$Modal.confirm({
          title: '提示',
          content: '是否确定删除该资料？',
          onOk: () => {
            this.delete_download_data(row.id)
          },
          onCancel: () => {}
        });
      }
    },
    mounted() {
      this.get_subject_list();
      this.get_grade_list();
      this.get_public_donwload_data_list({project_id: this.projectId});
    }
  }
</script>
<style lang='scss'>

</style>
