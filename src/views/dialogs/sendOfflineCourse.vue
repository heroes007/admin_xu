<template>
    <Modal title="发送学期" :transfer=false :width=700 :show-close="false" v-model="sendOfflineCourse"
           @on-cancel="handleRemoveModal(remove)" :mask-closable="false" :footer-hide="true">
        <base-input @closedialog="handleClose">
            <Row slot="header" class='search-bar' type='flex' justify='center' align='middle'>
                <Select v-model="searchType" placeholder="请选择" style="width: 200px;margin-left: 20px;">
                    <Option label="用户名" value="username"></Option>
                    <Option label="姓名" value="realname"></Option>.
                    <Option label="手机号" value="phone"></Option>
                </Select>
                <Input prefix="ios-search" placeholder="搜索用户名/姓名/手机号" v-model="searchData" @on-change="searchStudent" style="width: 350px;margin-left: 15px;">
                    <!-- <Button slot="append" type='text' @click='searchStudent'>搜索</Button> -->
                </Input>
            </Row>
            <Row slot="body">
                <Table class="table" ref="table" :data="queryOfflineUserList" @on-select-all="handleSelectedAll"
                       :columns="courseColumns" style="width: 100%" @on-selection-change="handleSelectionChange">
                </Table>
                <Row class="course-page">
                    <Page @on-change="handleCurrentChange" :current="curPage" :page-size="pageSize" :total="totalNum"></Page>
                </Row>
                <Row class="btns">
                    <Button class="send-btn" @click="handleSendTask">发送</Button>
                </Row>
            </Row>
        </base-input>
    </Modal>
</template>
<script>

  import BaseInput from '../../components/BaseInput'
  import UploadPanel from '../../components/UploadPanel'
  import {RemoveModal} from './mixins'
  import {send_student_offline_curriculum} from '../../api/modules/tools_student'

  let tooltips = {ellipsis: true, tooltip: true}

  export default {
    mixins: [RemoveModal],
    props: {
      remove: {
        type: String
      },
      payload: {}
    },
    components: {'base-input': BaseInput, 'upload-panel': UploadPanel},
    data() {
      return {
        sendOfflineCourse: true,
        multipleSelection: [],
        searchType: 'phone',
        searchData: '',
        curPage: 1,
        checked: false,
        courseColumns: [
          {
            title: '用户名',
            key: 'username',
             ...tooltips
          },
          {
            title: '姓名',
            key: 'realname',
            ...tooltips
          },
          {
            title: '手机号',
            key: 'phone',
            ...tooltips
          },
          {
            title: '科室',
            key: 'department_name'
          },
          {
            title: '班级',
            key: 'grade_name',
          },
          {
            type: 'selection'
          }
        ]
      }
    },
    computed: {
      queryOfflineUserList() {
        return this.$store.state.offline_curriculum.offline_term_student
      },
      pageSize() {
        return this.$store.state.offline_curriculum.page_size
      },
      pageIndex() {
        return this.$store.state.offline_curriculum.page_index
      },
      totalNum() {
        return this.$store.state.offline_curriculum.total_num
      }
    },
    mounted() {
      this.handleQueryList();
    },
    methods: {
      handleTableToName(d, v) {
        var name = ''
        d.map(item => {
          if (item.id == v) name = item.name
        })
        return name;
      },
      handleQueryList() {
        this.$store.dispatch('get_students_by_offline_term', {
          product_id: JSON.parse(localStorage.getItem('PRODUCTINFO')).id,
          term_id: this.payload.row.id,
          page_num: this.pageIndex,
          page_size: this.pageSize,
        })
      },
      handleSelectedAll(val) {
        this.multipleSelection = val
      },
      handleClose() {
        this.sendOfflineCourse = false;
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      handleCurrentChange(val) {
        this.$store.dispatch('get_students_by_offline_term', {
          subject_id: JSON.parse(localStorage.getItem('OffLineClassTheme')).id,
          page_num: this.pageIndex,
          page_size: this.pageSize,
        })
      },
      handleSendTask() {
        var list = [];
        if (this.multipleSelection && this.multipleSelection.length > 0) {
          this.multipleSelection.map(item => {
            list.push(item.student_id)
          });
        }
        if (list.length > 0) {
          send_student_offline_curriculum({term_id:this.payload.row.id,term_underline_id: this.payload.row.id, student_id_arr: JSON.stringify(list)}).then(res => {
            if (res.data.res_code == 1) {
              this.$Message.warning('线下课发送成功!');
              this.handleQueryList();
            }
          })
        } else {
          this.$Message.warning('请选择要发送线下课的学生!');
        }
      },
      searchStudent() {
        let d = {
            type: this.searchType,
            search: this.searchData
        }
        this.$store.dispatch('get_students_by_offline_term', {
          subject_id: JSON.parse(localStorage.getItem('OffLineClassTheme')).id,
          page_num: this.pageIndex,
          page_size: this.pageSize,
          ...d
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
    /deep/ th, /deep/ .ivu-table-cell > span {
        font-size: 14px !important
    }
    /deep/ .ivu-table th {
        height: 50px;
    }
    /deep/ .ivu-tooltip-rel > span {
        font-size: 14px !important
    }
    /deep/ .send-btn {
        background: #3DAAFF;
        border: 1px solid #3DAAFF;
        border-radius: 4px;
        width: 200px;
        height: 36px;
        border: none;
        outline: none;
        color: #fff;
    }
    /deep/ .ivu-input-group-prepend {
        width: 20%
    }
    /deep/.ivu-modal-header{background-color: #ffffff !important;padding: 22px 16px;}
    /deep/.ivu-modal-header-inner{
    font-family: PingFangSC-Regular;
    font-size: 20px !important;
    color: #474C63 !important;
    letter-spacing: 0;
    }
    /deep/ .ivu-modal-close .ivu-icon-ios-close { color:#9397AD !important;font-size: 42px !important;}
    /deep/ .ivu-form-item{margin-bottom: 15px;}
    .btns {
        padding: 40px 0;
        display: flex;
        justify-content:center;

        .send-btn {
            background: #3DAAFF;
            border: 1px solid #3DAAFF;
            border-radius: 4px;
            width: 200px;
            height: 36px;
            border: none;
            outline: none;
            color: #fff;
        }
    }
    .course-page {
        margin-top: 20px;
    }
    /deep/ .ivu-modal-body {
        padding: 0
    }
    .search-bar{
        height: 60px;
        background: #F0F0F7;
        width: 100%;
        display: flex;
        justify-content: left;
    }
    /deep/ .ivu-select-selection{
        border-radius: 100px;
        padding: 0 10px;
    }
    /deep/ .ivu-input{
        border-radius: 100px !important;
    }
</style>
