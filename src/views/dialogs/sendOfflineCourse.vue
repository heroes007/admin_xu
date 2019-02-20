<template>
    <Modal title="发送线下课" :transfer=false :width=700 :show-close="false" v-model="sendOfflineCourse"
           @on-cancel="handleRemoveModal(remove)" :mask-closable="false" :footer-hide="true">
        <base-input @closedialog="handleClose">
            <Row slot="body">
                <Row class='search-bar' type='flex' justify='center' align='middle'>
                    <Input placeholder="请输入用户名" v-model="searchData">
                        <Select v-model="searchType" slot="prepend" placeholder="请选择">
                            <Option label="ID" value="id"></Option>
                            <Option label="昵称" value="nickname"></Option>.
                            <Option label="手机号" value="phone"></Option>
                        </Select>
                        <Button slot="append" type='text' @click='searchStudent'>搜索</Button>
                    </Input>
                </Row>
                <Table class="table" ref="table" :data="queryOfflineUserList" @on-select-all="handleSelectedAll"
                       :columns="courseColumns" style="width: 100%" @on-selection-change="handleSelectionChange">
                </Table>
                <Row class="course-page">
                    <Page @on-page-size-change="handleSizeChange" @on-change="handleCurrentChange" :current="curPage"
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
            title: 'ID',
            key: 'user_id'
          },
          {
            title: '姓名',
            key: 'nickname',
            ...tooltips
          },
          {
            title: '注册手机',
            key: 'phone',
            ...tooltips
          },
          {
            title: '学科',
            key: 'subject_name'
          },
          {
            title: '学段',
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
          if (item.id == v) name = item.name
        })
        return name;
      },
      handleQueryList() {
        this.$store.dispatch('get_students_by_offline_term', {
          offline_term_id: this.payload.row.id,
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
      handleSizeChange(val) {},
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
    .btns {
        padding-top: 20px;
        padding-bottom: 20px;

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
        padding: 16px 0px 0px 0px;
    }
</style>
