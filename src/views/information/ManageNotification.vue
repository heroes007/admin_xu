<template>
    <div class='manage-notification'>
        <header-component :type="0" :showAdd="activeName == tabName ? true : false" addText="添加通知" title="通知管理" @addClick="createNotificationHandler()"/>
        <Tabs v-model="activeName" @on-click="handleClick" value='notification'>
            <TabPane class='notification-content' label="通知" name="notification">
                <data-list class='data-list' :table-data='notificationList' :header-data='notificationHeader' :column-formatter='listColumnFormatter' @send='sendHandler' @delete='deleteHandler' @edit='editHandler'/>
            </TabPane>
            <TabPane class='message-content' label="私信" name="chat" disabled>
                <Row class='message-content-container' type='flex' align='top'>
                    <Col :span='10'>
                        <Row class='group_header' type='flex'>
                            <Col class='active'>全部学员</Col>
                            <Col>小组学员</Col>
                        </Row>
                        <data-list class='student-list' :can-select='true' :is-stripe='false' @rowClick='rowClickHandler' :table-data='studentList'
                            :header-data='studentHeader' :show-header='false' :column-formatter='studentlistColumnFormatter' :column-formatter-data='studentlistColumnFormatterData' />
                    </Col>
                    <Col class='message-list' v-if='selectStudent'>
                        <div class='message-wrap' ref="mwrapper">
                            <div class='message-detail'>
                                <div class='message-item' v-for='(item, index) in messageList'>
                                    <Row class='time' type='flex' justify='center' align='middle' v-if='getTimeShow(item, index)'><span>{{getTimeStr(item.time)}}</span></Row>
                                    <Row class='message-detail-content'>
                                        <img :src='getHeadImg(item)' />
                                        <p><span>{{item.from_user_id === selectStudent.user_id?selectStudent.realname:'我'}}：</span>{{item.content}}</p>
                                    </Row>
                                </div>
                            </div>
                        </div>
                        <Input type="textarea" :autosize='false' placeholder="请输入内容" v-model="messageContent"></Input>
                        <Button class='btn-submit' type='primary' @click='sendMsg'>发送</Button>
                    </Col>
                </Row>
            </TabPane>
        </Tabs>
    </div>
</template>

<script>
    import Header from '../../components/ProjectHeader'
    import BaseList from '../../components/BaseList'
    import { mapActions, mapState, mapGetters } from 'vuex'
    import { Dialog } from '../dialogs'
    import { ADD_NOTIFICATION, } from '../dialogs/types'
    import { doTimeFormat } from '../../components/Util'
    import { Config } from '../../config/base'
    import { send_by_project_id } from '../../api/modules/tools_sys_msg'
    import defaultHeader from '../../assets/img/side-menu/default-header.jpg'
    // const server = require('socket.io-client')('http://api2.laoshi123.com:4006');
    export default {
        mixins: [Dialog],
        components: { 'header-component': Header, 'data-list': BaseList },
        data() {
            return {
                messageContent: '',
                activeName: 'notification',
                noSelect:true,
                tabName: 'notification'
            }
        },
        computed: {
            ...mapState({
                notificationLoading: state => state.notification.isLoading,
                messageLoading: state => state.message.isLoading,
                notificationList: state => state.notification.notification_list,
                studentList: state => state.message.student_list,
                userInfo: state => state.auth.userInfo,
                subjectList: state => state.subject.subject_list,
                gradeList: state => state.grade.grade_list,
                projectId: state => state.project.select_project_id,
                doUpdate: state => state.message.select_msg_update
            }),
            ...mapGetters({ messageList: 'message_list', selectStudent: 'message_select_student' }),
            isLoading() {
                return this.notificationLoading || this.messageLoading;
            },
            notificationHeader() {
                return [{
                    prop: 'id',
                    label: 'ID',
                    width: 80
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
                    label: '创建时间',
                    width: 120
                },
                {
                    prop: '',
                    label: '操作',
                    groupBtn: [{
                        text: '编辑',
                        param: 'edit'
                    }, {
                        text: '发送',
                        param: 'send'
                    }, {
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
                return [this.gradeList, this.subjectList];
            }
        },
        watch: {
            isLoading(val) {
               if (val) {
                   this.loadingInstance = this.$LoadingY({message: "加载中，请稍后",show: true})
                    setTimeout(() => {
                        this.loadingInstance.close()
                    }, Config.base_timeout);
                }else if(this.loadingInstance) this.loadingInstance.close()
            },
            messageList(val) {
                this.updateWrapper();
            },
            doUpdate(val) {
                this.updateWrapper();
            }
        },
        methods: {
            ...mapActions([ 'get_notification_list', 'delete_notification', 'get_project_list','get_message_student_list',
            'get_private_msg_list', 'send_private_msg', 'add_private_msg', 'get_grade_list', 'get_subject_list' ]),
            updateWrapper() {
                var vm = this;
                setTimeout(function () {
                    var wrapper = vm.$refs.mwrapper;
                    if (wrapper) wrapper.scrollTop = wrapper.scrollHeight;
                }, 100)
            },
            createNotificationHandler() {
                this.handleSelModal(ADD_NOTIFICATION);
            },
            sendHandler(index, row) {
              this.$Modal.confirm({
                title: '提示',
                content: '确定要发送该通知吗!',
                onOk: () => {
                  send_by_project_id(this.projectId, row.id)
                },
              });
            },
            deleteHandler(index, row) {
              this.$Modal.confirm({
                title: '提示',
                content: '确定要删除该通知吗!',
                onOk: () => {
                  this.delete_notification(row.id);
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
            this.get_notification_list();
            this.get_grade_list();
            this.get_subject_list();
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
</style>
