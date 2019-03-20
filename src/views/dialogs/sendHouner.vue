<template>
    <Modal title="颁发证书" :transfer=false :width=700 :show-close="false" v-model="sendOfflineCourse"
           @on-cancel="handleRemoveModal(remove)" :mask-closable="false" :footer-hide="true">
        <base-input @closedialog="handleClose">
            <Row  slot="header" class='search-bar' type='flex' align='middle'>
                <Select v-model="searchType" placeholder="请选择" style="width: 165px;margin-left: 20px;">
                    <Option label="已完成培训" value="nickname"></Option>.
                    <Option label="未完成培训" value="phone"></Option>
                </Select>
                <Input placeholder="请输入用户名" v-model="searchData"> </Input>
            </Row>
           <Row slot="body">
                <Table class="table" ref="table" :data="queryOfflineUserList" @on-select-all="handleSelectedAll"
                       :columns="courseColumns" style="width: 100%" @on-selection-change="handleSelectionChange">
                </Table>
                <Row class="course-page">
                    <Page @on-change="handleCurrentChange" :current="curPage"
                       size="small" :page-size="pageSize" :total="totalNum"></Page>
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
            key: 'user_id'
          },
          {
            title: '姓名',
            key: 'nickname',
            ...tooltips
          },
          {
            title: '手机号',
            key: 'phone',
            ...tooltips
          },
          {
            title: '科室',
            key: 'subject_name'
          },
          {
            title: '班级',
            key: 'grade_name',
          },
          {
            title: '完成率',
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
        let _d = this.$store.state.offline_curriculum.offline_term_student
        _d.map((it) => {
          it.subject_name = this.handleTableToName(this.$store.state.subject.subject_list, it.subject_id)
          it.grade_name = this.handleTableToName(this.$store.state.grade.grade_list, it.grade_id)
        })
        return _d
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
        //   if (item.id == v) name = item.name
        })
        return name;
      },
      handleQueryList() {
        this.$store.dispatch('get_students_by_offline_term', {
        //   offline_term_id: this.payload.row.id,
          page_index: this.pageIndex,
          page_size: this.pageSize,
          subject_id: '',
          grade_id: '',
          phone: '',
          username: ''
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
          offline_term_id: this.payload.row.id,
          page_index: val,
          page_size: this.pageSize,
          subject_id: '',
          grade_id: '',
          phone: '',
          username: ''
        })
      },
      handleSendTask() {
        var list = [];
        if (this.multipleSelection && this.multipleSelection.length > 0) {
          this.multipleSelection.map(item => {
            list.push(item.user_id)
          });
        }
        if (list.length > 0) {
          send_student_offline_curriculum({offline_term_id: this.payload.row.id, user_id: list}).then(res => {
            if (res.data.res_code == 1) {
              this.$Modal.info({
                title: '提示',
                content: '线下课发送成功!',
              });
              this.handleQueryList();
            }
          })
        } else {
          this.$Message.warning('请选择要发送线下课的学生!');
        }
      },
      searchStudent() {
        var phone = '';
        var username = '';
        var id = '';
        switch (this.searchType) {
          case 'phone':
            phone = this.searchData;
            break;
          case 'nickname':
            username = this.searchData;
            break;
          case 'id':
            id = this.searchData;
            break;
        }
        this.$store.dispatch('get_students_by_offline_term', {
          offline_term_id: this.payload.row.id,
          page_index: 0,
          page_size: this.pageSize,
          subject_id: this.payload.row.subject_id,
          grade_id: this.payload.row.grade_id,
          phone: phone,
          username: username,
          userid: id
        })
      }
    }
  }
</script>
<style lang="scss" scoped>
    /deep/ .ivu-input-wrapper{
      margin-left: 15px;
    }
    /deep/ .ivu-input{
       border-radius: 18px !important
    }
    /deep/ .ivu-select-selection{
        border-radius: 18px
    }
    .search-bar{
      height: 60px;
      background: #F0F0F7;
    }
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
    /deep/.ivu-select {
       width: 160px;
       height: 36px;
       border-radius: 18px;
    }
    /deep/ .ivu-input-wrapper{
       width: 349px;
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
        padding-top: 20px;
        padding-bottom: 20px;
        display: flex;
        justify-content: center;
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
    .course-page, .table {
        margin-top: 20px;
    }
    /deep/ .ivu-modal-body {
        padding: 0;
    }
</style>
