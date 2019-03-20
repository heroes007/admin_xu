<template>
    <div class='manage-production-view'>
        <!-- <header-component title='行业资讯' :type='0' :showAdd='true' addText='创建文章' @addClick='addNewsHandler'></header-component> -->
        <screen :types="10" selectType1 btnType title="行业资讯" btnName="创建文章" @handleClick="addNewsHandler" style="background:#ffffff"/>
        <FormModal :detail-data="tableRow"  :show-modal='show' :form-list="formList" @close="closeModal" :title="modalTitle" :upload-btn="false" :rule-validate="rules" ></FormModal>
        <!-- <Row>
            <Form :inline="true" :model="formInline" class="find-by-term">
                <FormItem  :label-width="0">
                    <Select v-model="formInline.state" placeholder="选择状态" @on-change='changeFilterHandler' style="width: 200px;
                    background: #F0F0F7;
                    border-radius: 100px;
                    ">
                        <Option v-for="item in stateList" :key="item.id" :label="item.name" :value="item.id"></Option>
                    </Select>
                </FormItem>
                    <FormItem label="" style="
                        margin: 0 auto;
                        text-align: center;
                        width: 73%;
                    ">
                        <Row style="
                        font-family: PingFangSC-Medium;
                        font-size: 18px;
                        color: #474C63;
                        letter-spacing: 0;
                        line-height:40px;
                        ">
                            行业资讯
                        </Row>
                    </FormItem>
                <FormItem  label="" style="float:right;margin-right40px">
                    <Button @click="addNewsHandler()"
                    type="primary" style="
                        width:130px;
                        height:36px;
                        background: #4098FF;
                        border-radius: 4px;
                        font-family: PingFangSC-Regular;
                        font-size: 16px;
                        color: #FFFFFF;
                        letter-spacing: 0;
                        text-align: center;
                        margin-right:20px
                    ">创建文章</Button>
                </FormItem>
            </Form>
        </Row> -->
        <data-list class='data-list light-header' @edit='editHandler' @delete='deleteHandler' :table-data='dataList'
                   :header-data='dataHeader' :column-formatter='listColumnFormatter'
                   :column-formatter-data='listColumnFormatterData'></data-list>
        <Row class='pager' type='flex' justify='end' align='middle'>
            <Page @on-change="handleCurrentChange" :current="curPage" :page-size='20' :total="total"></Page>
        </Row>
    </div>
</template>


<script>
  import Header from '../../components/Header'
  import SubjectFilter from '../../components/SubjectFilter'
  import BaseList from '../../components/BaseList'
  import BackToTop from '../../components/BackToTop'
  import {MPop} from '../../components/MessagePop'
  import api from '../../api/modules/config'
  import {set_user_student_mrzx} from '../../api/modules/student'
  import {send_interview_msg} from '../../api/modules/exam'
  import {Loading} from 'element-ui'
  import {Dialog} from '../dialogs'
  import {ADD_NEWS} from '../dialogs/types'
  import {Config} from '../../config/base'
  import {mapState, mapActions, mapGetters} from 'vuex'
  import {doDateFormat, doTimeFormat, reunitPrice} from '../../components/Util'
  import screen from '../../components/ScreenFrame'
  import FormModal from '../../components/FormModal'
  import FormModalMixin from '../UserManage/Mixins/FormModalMixin'
  export default {
    mixins: [Dialog, MPop,FormModalMixin],
    data() {
      return {
        loadingInstance: null,
        curPage: 1,
        formInline: {
          state: null
        },
        pageSize: 20,
        tableRow: {},
        show: false,
        formList: [
            { type: 'input', name: '文章标题',  field: 'textname'},
            { type: 'textarea', name:'文章摘要',field:  'textdesc'},
            { type: 'upload', name: '文章正文', field: 'uploading' }
        ],
        modalTitle: '创建文章',
        rules:{
            textname: [{ required: true, message: '请输入文章标题', trigger: 'blur' } ],
            textdesc: [{ required: true, message: '请输入文章摘要'}],
            uploading: [{ required: true, message: '请输入文章正文'} ],
        },
      }
    },

    methods: {
      ...mapActions([
        'get_news_list',
        'delete_news'
      ]),
      addNewsHandler() {
        // this.handleSelModal(ADD_NEWS);
        this.show = true
      },
      editHandler(index, row) {
        this.handleSelModal(ADD_NEWS, row.id);
      },
      deleteHandler(index, row) {
        var vm = this;
        this.$Modal.confirm({
          title: '提示',
          content: '<p>是否确认删除该产品？</p>',
          onOk: () => {
            this.delete_news({
              id: row.id, _fn: function () {
                vm.showPop('删除成功！');
              }
            })
          },
        });
      },
      handleCurrentChange(val) {
        this.curPage = val;
        this.getData();
      },
      changeFilterHandler() {
        this.curPage = 1;
        this.getData();
      },
      getData() {
        var data = {
          page_index: this.curPage - 1,
          page_size: 20,
          state: this.formInline.state
        }
        this.get_news_list(data);
        ;
      }
    },
    mounted() {
      this.getData();
    },
    watch: {
      // isLoading(val) {
      //   this.$config.IsLoading(val);
      // }
    },
    computed: {
      ...mapState({
        isLoading: state => state.news.isLoading,
        dataList: state => state.news.news_list,
        total: state => state.news.total,
        stateList: state => state.news.state_list
      }),
      dataHeader() {
        return [{
          label: '序号',
          width: 90,
          sort: true
        },
        {
          prop: 'title',
          label: '新闻标题'
        },
        {
          prop: 'count',
          label: '浏览量',
          width: 100
        },
        {
          prop: 'create_time',
          label: '状态',
        },
        {
          prop: 'create_time',
          label: '发布时间',
          width: 160
        },
         {
          prop: 'create_time',
          label: '发布人',
        },
        {
          label: '操作',
          width: 320,
          groupBtn: [
        //     {
        //     isSwitch: true,
        //     switchKey: 'is_valid',
        //     onText: '启用',
        //     offText: '停用',
        //     disableText: '失效',
        //     actionName: 'change_news_valid'
        //   },
            {
            text: '下架',
            param: 'edit'
            },
          {
            text: '编辑',
            param: 'edit'
          }, {
            text: '删除',
            param: 'delete',
            // isIcon: true
          }]
        }]
      },
      listColumnFormatter() {
        return [
          {
            columnName: 'create_time',
            doFormat: doTimeFormat
          }
        ]
      },
      listColumnFormatterData() {
        return [];
      }
    },
    components: {
      'header-component': Header,
      'subject-filter': SubjectFilter,
      'data-list': BaseList,
      'back-to-top': BackToTop,
      screen,
      FormModal
    }
  }

</script>
<style lang="scss">
    .el-tooltip__popper {
        &.is-light {
            background: #FFFFFF;
            border: 1px solid #E7E8EA;
            box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.12), 0 0 6px 0 rgba(0, 0, 0, 0.04);

            .more-tip {
                max-width: 278px;
                line-height: 1.2;
                font-size: 14px;
                color: #2e3e47;

                & + .popper__arrow {
                    border-top-color: #E7E8EA;

                    &:after {
                        //border-top-color:#E7E8EA;
                    }
                }
            }
        }
    }

    .manage-production-view {
        .base-list-container {
            .base-list-row {
                height: 60px;

                .cell {
                    .el-button {
                        margin-right: 2px;

                        &:last-child {
                            margin-left: 10px;
                        }
                    }
                }
            }
        }

        .find-by-term {
            padding-top: 18px;
            // padding-bottom: 17px;
            text-align: left;
            margin-left: 20px;

            .el-input__inner {
                border-radius: 0;
                background: #FFFFFF;
                border: 1px solid #E5E5E5;
            }

            .el-form-item__label {
                font-size: 14px;
                color: #141111;
                letter-spacing: 0;
            }

            .el-select {
                width: 300px;

                &.select-user {
                    width: 100%;

                    .el-input__inner {
                        border-right: 0;
                    }
                }
            }

            button {
                background: #3DAAFF;
                border: 1px solid #3DAAFF;
                border-radius: 4px;
                width: 100px;
                height: 36px;
            }
        }

        .pager {
            margin: 30px 0;
            padding-right: 40px;

            .el-pagination {
                button {
                    &.disabled {
                        background-color: #ebebec;
                        border-color: #b0b3c5;
                        color: #8b9fa9;
                    }
                }

                .el-pager {
                    li {
                        &.active {
                            background-color: #8b9fa9;
                        }
                    }
                }
            }
        }

        .btn-add {
            color: #5fa137;
        }

        .data-container {
            background-color: #ffffff;
            margin: 0 20px 20px;

            .list {
                .data-header {
                    height: 50px;

                    .Col {
                        line-height: 50px;
                    }
                }

                .data-item {
                    height: 40px;
                    border-top: 1px solid #cecece;

                    &.bg-gray {
                        background-color: #fbfbfb;
                    }

                    .Col {
                        line-height: 40px;

                        .el-button {
                            a {
                                color: #5fa137;
                                font-size: 14px;
                            }
                        }

                        p {
                            margin: 0;
                            display: -webkit-box;
                            white-space: normal;
                            -webkit-box-orient: vertical;
                            overflow: hidden;
                            -webkit-line-clamp: 1;
                        }
                    }
                }

                .pager {
                    margin: 30px 0;
                    padding-right: 40px;

                    .el-pagination {
                        button {
                            &.disabled {
                                background-color: #ebebec;
                                border-color: #b0b3c5;
                                color: #8b9fa9;
                            }
                        }

                        .el-pager {
                            li {
                                &.active {
                                    background-color: #8b9fa9;
                                }
                            }
                        }
                    }
                }
            }
        }

        .back-to-top {
            top: 80%;
            right: 20px;
        }
    }

    //添加框
    .add-student-view {
        .img {
            margin-top: 100px;

            img {
                width: 150px;
                height: 150px;
            }
        }

        .title {
            margin-top: 25px;

            h1 {
                font-size: 28px;
                color: #2e3e47;
                font-weight: 200;
                font-family: MicrosoftYaHei;
                margin: 0;
            }
        }

        .search-bar {
            margin-top: 40px;

            .el-input-group {
                width: 380px;

                .el-input__inner {
                    height: 46px;
                }

                .el-input-group__append {
                    background-color: #7ab854;

                    .el-button {
                        height: 100%;
                        width: 80px;
                        color: #ffffff;
                        font-size: 16px;
                    }
                }

                .el-input-group__prepend {
                    background-color: #7ab854;

                    .el-select {
                        height: 100%;
                        width: 110px;
                        color: #ffffff;
                        font-size: 16px;
                    }

                    i {
                        color: #ffffff;
                    }
                }
            }
        }

        .result {
            margin: 15px 0 76px;

            .data-form {
                width: 550px;
                background-color: #ffffff;
                // border: 1px solid #EBEBEC;
                border-radius: 6px;
                padding: 20px 0;

                .user-info {
                    font-size: 14px;
                    margin-bottom: 24px;
                    border-bottom: 1px solid #EBEBEC;
                    padding: 0 20px;

                    span {
                        color: #7ab854;
                        margin-right: 15px;
                    }
                }

                .user-data {
                    font-size: 14px;
                    margin-bottom: 15px;
                    padding: 0 20px;

                    .el-button {
                        width: 140px;
                        height: 36px;
                        background-color: #7ab854;
                        color: #ffffff;
                    }

                    &.desc {
                        width: 100%;

                        .el-input {
                            width: 330px;
                        }
                    }
                }
            }
        }
    }
</style>
