<template>
    <div class='manage-notification'>
        <FormModal :detail-data="tableRow"  :show-modal='show' :form-list="formList" @close="closeModal" :title="modalTitle" :rule-validate="rules" ></FormModal>
        <screen :types="10" title="全站通知" btnType btnName="添加通知" @handleClick="createNotificationHandler" style="background:#ffffff"/>
            <data-list class='data-list' :table-data='notificationList' :header-data='notificationHeader' :column-formatter='listColumnFormatter'
                       @send='sendHandler' @delete='deleteHandler' @edit='editHandler'/>
    </div>
</template>

<script>
    import BaseList from '../../../components/BaseList'
    import { mapActions, mapState, mapGetters } from 'vuex'
    import { Dialog } from '../../dialogs'
    import { ADD_NOTIFICATION, } from '../../dialogs/types'
    import { doTimeFormat } from '../../../components/Util'
    import { Config } from '../../../config/base'
    import defaultHeader from '../../../assets/img/side-menu/default-header.jpg'
    import FormModal from '../../../components/FormModal'
    import FormModalMixin from '../../UserManage/Mixins/FormModalMixin'
    import screen from '../../../components/ScreenFrame'
    export default {
        mixins: [Dialog,FormModalMixin],
        components: { 'data-list': BaseList,screen,FormModal },
        data() {
            return {
                messageContent: '',
                activeName: 'notification',
                noSelect:true,
                tabName: 'notification',
                tableRow: {},
                modalTitle: '创建通知',
                show: false,
                formList: [
                    { type: 'upload',name:'通知', field: 'uploading' }
                ],
                rules:{
                    uploading: [{ required: true, message: '请输入课程介绍'} ],
                },
            }
        },
        computed: {
            ...mapState({
                notificationLoading: state => state.notification.isLoading,
                messageLoading: state => state.message.isLoading,
                notificationList: state => state.notification.notification_list,
                studentList: state => state.message.student_list,
                userInfo: state => state.auth.userInfo,
                projectId: state => state.project.select_project_id,
                doUpdate: state => state.message.select_msg_update
            }),
            ...mapGetters({ messageList: 'message_list', selectStudent: 'message_select_student' }),
            isLoading() {
                return this.notificationLoading || this.messageLoading;
            },
            notificationHeader() {
                return [
                //     {
                //     prop: 'id',
                //     label: 'ID',
                //     width: 80
                // },
                {
                    label:"序号",
                    width: 80,
                    sort:true
                },
                {
                    prop: 'content',
                    label: '通知内容',
                    width: 650,
                    limit: 30,
                    hideOverflow: true,
                    actionName: 'modify_notification_'
                },
                {
                    prop: 'create_time',
                    label: '发送时间',
                    width: 120
                },
                {
                    prop: 'create_time',
                    label: '创建人',
                    width: 120
                },
                {
                    prop: '',
                    label: '操作',
                    groupBtn: [
                    {
                        text: '发送',
                        param: 'send'
                    },
                     {
                        text: '编辑',
                        param: 'edit'
                    },
                    {
                        text: '删除',
                        param: 'delete'
                    }]
                }]
            },
            studentHeader() {
                return [{
                    prop:'unread_count',
                    label:'',
                    badge:true
                },{
                    prop: '',
                    label: '姓名',
                    width: 100,
                mixColumn: true,
                mixFunc: (function(data) {
                    if(data.realname)
                        return data.realname;
                    else
                        return data.nickname;
                })
                }, {
                    prop: 'subject_id',
                    label: '学科',
                    width: 80
                }, {
                    prop: 'grade_id',
                    label: '学段',
                    width: 80
                }, {
                    prop: 'times',
                    label: '学期',
                }]
            },
            listColumnFormatter() {
                return [{ columnName: 'create_time', doFormat: doTimeFormat }]
            },
            studentlistColumnFormatter() {
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
            studentlistColumnFormatterData() {
                return [this.gradeList, []];
            }
        },
        watch: {
            // isLoading(val) {
            //    if (val) {
            //        this.loadingInstance = this.$LoadingY({message: "加载中，请稍后",show: true})
            //         setTimeout(() => {
            //             this.loadingInstance.close()
            //         }, Config.base_timeout);
            //     }else if(this.loadingInstance) this.loadingInstance.close()
            // },
            messageList(val) {
                this.updateWrapper();
            },
            doUpdate(val) {
                this.updateWrapper();
            }
        },
        methods: {
            ...mapActions(['get_project_list','get_message_student_list',
            'get_private_msg_list', 'send_private_msg', 'add_private_msg' ]),
            updateWrapper() {
                var vm = this;
                setTimeout(function () {
                    var wrapper = vm.$refs.mwrapper;
                    if (wrapper) wrapper.scrollTop = wrapper.scrollHeight;
                }, 100)
            },
            createNotificationHandler() {
                // this.handleSelModal(ADD_NOTIFICATION);
                this.show = true
            },
            sendHandler(index, row) {
              this.$Modal.confirm({
                title: '提示',
                content: '确定要发送该通知吗!',
                onOk: () => {

                },
              });
            },
            deleteHandler(index, row) {
              this.$Modal.confirm({
                title: '提示',
                content: '确定要删除该通知吗!',
                onOk: () => {
                    
                },
              });
            },
            editHandler(index, row) {
                this.handleSelModal(ADD_NOTIFICATION, row);
            },
            handleClick() {},
            rowClickHandler(row) {
                this.messageContent = '';
                this.get_private_msg_list(row.user_id);
            },
            getHeadImg(item) {
                if (item.from_user_id === this.selectStudent.user_id) return this.selectStudent.head_img_url ? this.selectStudent.head_img_url : defaultHeader
                else return this.userInfo.head_img_url ? this.userInfo.head_img_ur : defaultHeader;
            },
            getTimeShow(item, index) {
                if (index === 0) return true;
                else {
                    if (new Date(item.time).getDate() === new Date(this.messageList[index - 1].time).getDate()) return false;
                    return true;
                }
            },
            getTimeStr(time) {
                return doTimeFormat(time);
            },
            sendMsg() {
                if (!this.messageContent) {
                  this.$Modal.info({
                    title: '提示',
                    content: '不能发送空消息！'
                  });
                }
                else {
                    this.send_private_msg({ from_user_id: this.userInfo.user_id, to_user_id: this.selectStudent.user_id, content: this.messageContent });
                }
            }
        },
        mounted() {
            var vm = this;
            if (this.$store.state.project.project_list.length === 0) {
                this.get_project_list({
                    callback(v) {
                        vm.get_message_student_list(v);
                    }
                });
            } else {
                this.get_message_student_list(this.projectId);
            }

            // server.on('connect', () => {
            //     console.log(server.id); // 'G5p5...'
            // });
            // server.on(this.userInfo.user_id, data => {
            //     if(this.selectStudent)
            //     {
            //        if (data.from_user_id === this.selectStudent.user_id)
            //             this.add_private_msg(data);
            //     }
            // });
            // server.on('disconnect', res => {
            //     console.log('disconnect')
            //     server.disconnect();
            //     server.close();
            // });
            // server.on('error', error => {
            //     console.log(error);
            // })
        }
    }

</script>
<style scoped lang='scss'>
    /deep/ .ivu-tabs-nav .ivu-tabs-tab:hover{ color: #3DAAFF }
    /deep/ .ivu-tabs-tab {
        text-align: center;
        line-height: 40px;
        margin-bottom: 0;
        font-size: 18px;
    }
    .manage-notification {
        .data-list {
            .base-list-row {
                .cell {
                    .el-button {
                        &:last-child {
                            margin-left: 5px;
                        }
                    }
                }
            }
            thead {
                tr {
                    height: 60px;
                    th {
                        .cell {
                            font-size: 16px;
                            color: #757575;
                            letter-spacing: 0;
                        }
                    }
                }
            }
        }
        .student-list {
            .base-list-row {
                background-color: #F6F6F6;
                td {
                    &:last-child {
                        border-right: 1px solid #dfe6ec;
                    }
                }
                &.current-row {
                    td {
                        background-color: #ffffff;
                        &:last-child {
                            border-right-color: #ffffff;
                        }
                    }
                }
            }
        }
    }
    /deep/ .ivu-table-cell div{
        /*justify-content: space-around;*/
        justify-content: center;
    }
    /deep/ .form-message{
        width: 580px;
        height: 500px;
    }
</style>
