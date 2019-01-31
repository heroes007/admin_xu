<template>
    <Modal :transfer=false title="手动激活" width="700px" :footer-hide="true" v-model="manulActiveDialog" @on-cancel="handleRemoveModal(remove)"
               :mask-closable="false">
        <base-input @closedialog="handleClose">
            <Row slot="body">
                <Row class='search-bar' type='flex' justify='center' align='middle'>
                    <Input placeholder="请输入搜索内容" v-model="searchData">
                        <Select v-model="searchType" slot="prepend" placeholder="请选择">
                            <Option label="ID" value="id"></Option>
                            <Option label="昵称" value="nickname"></Option>
                            <Option label="姓名" value="realname"></Option>
                            <Option label="手机号" value="phone"></Option>
                        </Select>
                        <Button slot="append" type='text' @click='searchStudent'>搜索</Button>
                    </Input>
                </Row>
                <Table class="table" ref="table" :data="queryTaskUserList" @on-select-all="handleSelectedAll" :columns="courseColumns" style="width: 100%"
                   @on-selection-change="handleSelectionChange"></Table>
                <Row class="course-page">
                    <Page @on-page-size-change="handleSizeChange" @on-change="handleCurrentChange" :current="curPage"
                          :page-size="pageSize" size="small"   :total="totalNum"></Page>
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
  import { RemoveModal } from './mixins'
  import { get_userlist_by_tid, send_task } from '../../api/modules/tools_task.js'
  let tooltips = { ellipsis: true, tooltip: true }
  export default {
    mixins: [RemoveModal],
    components: { 'base-input': BaseInput, 'upload-panel': UploadPanel },
    props: {
      remove: {
        type: String
      },
      payload: {}
    },
    data() {
      return {
        searchType: 'phone',
        searchData: '',
        manulActiveDialog: true,
        multipleSelection: [],
        checked: false,
        courseColumns: [
                    {
                        title: 'ID',
                        key: 'user_id'
                    },
                    {
                        title: '昵称',
                        key: 'nickname',
                        ...tooltips
                    },
                     {
                        title: '姓名',
                        key: 'realname',
                        ...tooltips
                    },
                    {
                        title: '注册手机',
                        key: 'phone',
                        width: 120,
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
    mounted() {
      this.handleQueryList();
    },
    methods: {
      handleSubjectTransformIdToName(v) {
        var name = ''
        this.$store.state.subject.subject_list.map(item => {
          if (item.id == v) {
            name = item.name
          }
        })
        return name;
      },
      handleQueryList() {
        this.$store.dispatch('get_userlist_by_tid', {
          task_id: this.payload.row.id,
          project_id: this.$store.state.project.select_project_id,
          grade_id: this.payload.row.grade_id,
          subject_id: this.payload.row.subject_id,
          page_size: this.$store.state.task.page_size,
          page_index: 0,
          phone: '',
          username: '',
          realname: '',
          userid: ''
        })
      },
      handleTableToName(d,v){
            var name = ''
            d.map(item => {
                if (item.id == v) name = item.name
            })
            return name;
      },
      handleSelectedAll(val) {
        this.multipleSelection = val
      },
      handleClose() {
        this.manulActiveDialog = false;
      },
      handleSelectionChange(val) {
        this.multipleSelection = val;
      },
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
      },
      handleData(v){
        let [phone, username, realname, id] = ['', '', '', ''];
        switch (this.searchType) {
          case 'phone':
            phone = this.searchData;
            break;
          case 'nickname':
            username = this.searchData;
            break;
          case 'realname':
            realname = this.searchData;
            break;
          case 'id':
            id = this.searchData;
            break;
        }
        this.$store.dispatch('get_userlist_by_tid', {
          task_id: this.payload.row.id,
          project_id: this.$store.state.project.select_project_id,
          grade_id: this.payload.row.grade_id,
          subject_id: this.payload.row.subject_id,
          page_size: v ? this.pageSize : this.$store.state.task.page_size,
          page_index: v ? val - 1 : 0,
          phone, username, realname, userid: id
        })
      },
      handleCurrentChange(val) {
        this.handleData(val);
      },
      handleSendTask() {
        var list = [];
        this.multipleSelection.map(item => {
          list.push(item.user_id)
        });
        if (list.length > 0) {
          send_task(this.payload.row.id, this.$store.state.project.select_project_id, list).then(res => {
            if (res.data.res_code == 1) {
               this.$Modal.info({
                    title: '提示',
                    content: '任务包发送成功!',
                    onOk: () => {}
                });
              this.handleQueryList();
            }
          })
        } else {
           this.$Message.warning('请选择要发送任务的学生!');
        }
      },
      searchStudent() {
        this.handleData();
      }
    },
    computed: {
      queryTaskUserList() {
           let _d = this.$store.state.task.task_user_list
           console.log(_d)
           _d.map((it) => {
               it.subject_name = this.handleTableToName(this.$store.state.subject.subject_list,it.subject_id)
               it.grade_name = this.handleTableToName(this.$store.state.grade.grade_list,it.grade_id)
           })
           return _d
      },
      pageSize() {
        return this.$store.state.task.page_size
      },
      curPage() {
        return this.$store.state.task.cur_page
      },
      totalNum() {
        return this.$store.state.task.total_num
      }
    }
  }
</script>

<style lang="scss" scoped>
/deep/ .ivu-modal-body{
    padding: 16px 0 0 0;
}
/deep/th, /deep/.ivu-table-cell>span{
    font-size: 14px !important
}
/deep/.ivu-table th { height: 50px; }
/deep/ .ivu-tooltip-rel>span{ font-size: 14px !important }
/deep/ .send-btn{
    background: #FB843E;
    border: 1px solid #F06B1D;
    border-radius: 4px;
    width: 200px;
    height: 36px;
    border: none;
    outline: none;
    color: #fff;
}
/deep/ .ivu-input-group-prepend { width: 20% }
.btns {
    padding-top: 20px;
    padding-bottom: 20px;
    display: flex;
    justify-content: center;
    .send-btn {
        background: #FB843E;
        border: 1px solid #F06B1D;
        border-radius: 4px;
        width: 200px;
        height: 36px;
        border: none;
        outline: none;
        color: #fff;
    }
}
.course-page{
  display: flex;
  justify-content: center;
}
.course-page,.table{
    margin-top: 20px;
}

</style>
