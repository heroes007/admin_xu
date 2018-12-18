<template>
<el-dialog title="手动激活" :show-close="false" v-model="manulActiveDialog" @close="handleRemoveModal(remove)" size="auto" :closeOnClickModal="false">
    <base-input @closedialog="handleClose">
        <el-row slot="body">
    <el-row class='search-bar' type='flex' justify='center' align='middle'>
                <el-input placeholder="请输入用户名" v-model="searchData">
                    <el-select v-model="searchType" slot="prepend" placeholder="请选择">
                        <el-option label="ID" value="id"></el-option>
                        <el-option label="昵称" value="nickname"></el-option>
                        <el-option label="姓名" value="realname"></el-option>
                        <el-option label="手机号" value="phone"></el-option>
                    </el-select>
                    <el-button slot="append" type='text' @click='searchStudent'>搜索</el-button>
                </el-input>
     </el-row>
            <el-table ref="table" :data="queryTaskUserList" style="width: 100%" @selection-change="handleSelectionChange">
                <el-table-column label="ID" width="80">
                    <template slot-scope="props">{{ props.row.user_id }}
</template>
  </el-table-column>
  <el-table-column
    prop="nickname"
    label="昵称">
  </el-table-column>
  <el-table-column
    prop="realname"
    label="姓名">
  </el-table-column>
  <el-table-column
    prop="phone"
    label="注册手机"
    show-overflow-tooltip>
  </el-table-column>
  <el-table-column
    label="学科"
    show-overflow-tooltip>
    <template slot-scope="props">
 {{handleSubjectTransformIdToName(props.row.subject_id)}}
</template>
  </el-table-column>
  <el-table-column
    label="学段"
    show-overflow-tooltip>
    <template slot-scope="props">
 {{handleGradeTransformIdToName(props.row.grade_id)}}
</template>
  </el-table-column>
  <el-table-column
    width="80"
    type="selection">
  </el-table-column>
</el-table>
        <el-row>
          <el-col :span="21">
            <el-pagination
               @size-change="handleSizeChange"
               @current-change="handleCurrentChange"
               :current-page="curPage"
               :page-size="pageSize"
               layout="prev, pager"
               small
               :total="totalNum">
             </el-pagination>
          </el-col>
          <el-col :span="3">
              <el-checkbox class="check-all" v-model="checked" @change="handleSelectedAll">全选</el-checkbox>
          </el-col>
        </el-row>
          <el-row class="btns">
            <el-button class="send-btn" @click="handleSendTask">发送</el-button>
          </el-row>
          </el-row>
      </base-input>
  </el-dialog>
</template>

<script>
import BaseInput from '../../components/BaseInput'
import UploadPanel from '../../components/UploadPanel'
import {
    RemoveModal
} from './mixins'
import {
    get_userlist_by_tid,
    send_task
} from '../../api/modules/tools_task.js'
export default {
    mixins: [RemoveModal],
    props: {
        remove: {
            type: String
        },
        payload: {}
    },
    data() {
        return {
            searchType:'phone',
            searchData:'',
            manulActiveDialog: true,
            multipleSelection: [],
            curPage:0,
            checked:false
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
            // get_userlist_by_tid(this.payload.row.id, this.$store.state.project.select_project_id, this.payload.row.grade_id, this.payload.row.subject_id).then(res => {
            //     this.tableData3 = res.data.msg;
            // })
            this.$store.dispatch('get_userlist_by_tid', {
                task_id: this.payload.row.id,
                project_id: this.$store.state.project.select_project_id,
                grade_id: this.payload.row.grade_id,
                subject_id: this.payload.row.subject_id,
                page_size: this.$store.state.task.page_size,
                page_index: 0,
                phone:'',
                username:'',
                realname:'',
                userid:''
            })
        },
        handleSelectedAll() {
            this.$refs.table.$children[6].toggleAllSelection();
        },
        handleGradeTransformIdToName(v) {
            var name = ''
            this.$store.state.grade.grade_list.map(item => {
                if (item.id == v) {
                    name = item.name
                }
            })
            return name;
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
        handleCurrentChange(val) {
            var phone = '';
            var username = '';
            var realname = '';
            var id = '';
            switch(this.searchType)
            {
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
                page_size: this.pageSize,
                page_index: val - 1,
                phone:phone,
                username:username,
                realname:realname,
                userid:id
            })
        },
        handleSendTask() {
            var list = [];
            this.multipleSelection.map(item => {
                list.push(item.user_id)
            });
            if (list.length > 0) {
                send_task(this.payload.row.id, this.$store.state.project.select_project_id, list).then(res => {
                    console.log(res);
                    if (res.data.res_code == 1) {
                        this.$alert('任务包发送成功!', '提示', {
                            confirmButtonText: '确定',
                            callback: action => {}
                        });
                        this.handleQueryList();
                    }
                })
            } else {
                alert('请选择要发送任务的学生!')
            }
        },
        searchStudent(){
            var phone = '';
            var username = '';
            var realname = '';
            var id = '';
            switch(this.searchType)
            {
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
                page_size: this.$store.state.task.page_size,
                page_index: 0,
                phone:phone,
                username:username,
                realname:realname,
                userid:id
            })
        }
    },
    computed: {
        queryTaskUserList() {
            return this.$store.state.task.task_user_list
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
    },
    components: {
        'base-input': BaseInput,
        'upload-panel': UploadPanel
    },
}
</script>

<style lang="scss">
#manul-active-container {
    @import "base.scss";
    $checkbox_active_color: #5FA137;
    input,
    textarea {
        resize: none;
        outline: none;
    }
    .search-bar {
            margin: 30px 0;
            .el-input-group {
                width: 340px;
                .el-input__inner {
                    height: 26px;
                }
                .el-input-group__append {
                    background-color: #7ab854;

                    .el-button {
                        height: 100%;
                        width: 60px;
                        color: #ffffff;
                        font-size: 14px;
                    }
                }
                .el-input-group__prepend {
                    background-color: #7ab854;

                    .el-select {
                        height: 100%;
                        width: 90px;
                        color: #ffffff;
                        font-size: 14px;
                    }

                    i {
                        color:#ffffff;
                    }
                }
            }
        }
    .close-dialog-panel {
        position: absolute;
        top: -40px;
        right: 13.5px;
        z-index: 99999;
        font-size: 30px;
        cursor: pointer;
        &:before {
            // color: #fff;
            color: #757575;
        }
    }
    .el-checkbox__inner {
        display: inline-block;
        position: relative;
        border: 1px solid #bfcbd9;
        border-radius: 4px;
        box-sizing: border-box;
        width: 18px;
        height: 18px;
        background-color: #fff;
        z-index: 1;
        transition: border-color 0.25s cubic-bezier(.71,-.46,.29,1.46),background-color 0.25s cubic-bezier(.71,-.46,.29,1.46);
        border-color: #979797;
        background-color: transparent;
        &:hover {
            border-color: #979797;
        }
    }
    .is-checked {
        .el-checkbox__inner {
            border-color: $checkbox_active_color;
            background-color: $checkbox_active_color;
        }
    }

    .el-dialog {
        width: 700px;
        background: none;
        .el-pagination {
            text-align: right;
            margin-right: 10px;
            margin-top: 10px;
            li.active {
                border-color: $checkbox_active_color;
                background-color: $checkbox_active_color;
            }
            li:hover{
              color: $checkbox_active_color;
            }
        }
        .check-all {
            margin-top: 15px;
        }
        .body-top {
            padding-bottom: 10px;
        }
        .el-dialog__header {
            background: #333333;
            border-radius: 4px 4px 0 0;
            padding: 16px;
        }
        .el-table__header {
            th {
                height: 60px;
                background: #FBFBFB;
                border-bottom: 1px solid #E5E5E5;
                text-align: center;
                font-weight: 400;
                .cell {
                    background: none;
                    font-size: 16px;
                    color: #757575;
                    letter-spacing: 0;
                }
            }
            .el-table-column--selection {
                .el-checkbox__input {
                    display: none;
                }
                .cell {
                    text-align: center;
                    &::before {
                        content: '选项';
                        font-size: 16px;
                        color: #757575;
                        letter-spacing: 0;
                        width: 40px;
                        display: inline-block;
                    }
                }
            }
        }
        .el-table__body-wrapper {
            margin-top: 19px;
            border-top: 1px solid #E5E5E5;
            td {
                height: 60px;
                // &:hover {
                //     background: none;
                // }
            }
            tr {
                &:hover {
                    td {
                        background: #F6F6F6;
                    }
                }
            }
        }
        .el-dialog__body {
            padding: 0;
            background: #fff;
            border-radius: 0 0 4px 4px;
            .el-icon-upload {
                margin-top: 30px;
            }
            .el-form-item__label {
                font-size: 14px;
                color: #141111;
                letter-spacing: 0;
            }
            .file-require {
                margin-top: 45px;
            }
            .course-description {
                margin-top: 45px;
                textarea {
                    background: #FFFFFF;
                    border: 1px solid #E5E5E5;
                    border-radius: 0;
                    font-size: 14px;
                    // color: #999999;
                    letter-spacing: 0;
                    line-height: 14px;
                }
            }
        }
        .btns {
            padding-top: 20px;
            padding-bottom: 20px;
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
    }
}
</style>
