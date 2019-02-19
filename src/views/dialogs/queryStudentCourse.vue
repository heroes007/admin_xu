<template>
    <el-dialog title="查看线上课" v-model="queryStudentCourse" @close="handleRemoveModal(remove)" size="auto" :closeOnClickModal="false"
        :show-close="false">
        <base-input @closedialog="handleClose">
            <Row slot="header" type='flex' justify='space-between' align='middle'>
                <h3>已完成：{{totalProgress}}%</h3>
                <Button type='text' @click='clearVideoLog'>清除观看记录</Button>
            </Row>
            <Row slot="body">
                <Row class="body-top" v-if="true">
                    <Row v-for="item in dataList" :key="item.id" class="course-item">
                        <Col :span="4">
                            <div class="avator"><img :src="headerImage(item.teacher_img)" alt=""></div>
                            <p>{{item.teacher_name}}</p>
                        </Col>
                        <Col :span="12">
                            <p class="title">{{item.title}}</p>
                            <p class="progress">
                                <span :style="{'width': handleResultProgress(item.video_total_count, item.complete_video_test_ids, item.see_video_ids).progress }"></span>
                                <span class="specific">{{handleResultProgress(item.video_total_count, item.complete_video_test_ids, item.see_video_ids).specific}}</span>
                            </p>
                        </Col>
                        <Col :span="4">
                            <!--<span>{{item.unlock ? '已解锁'  : '未解锁'}}</span>-->
                            <i :class="{'xght-webfont-lock':!item.unlock,'xght-webfont-play-sign':!handleResultProgress(item.video_total_count, item.complete_video_test_ids, item.see_video_ids).allFinish && item.unlock,'xght-webfont-ok-sign':handleResultProgress(item.video_total_count, item.complete_video_test_ids, item.see_video_ids).allFinish}"></i>
                        </Col>
                        <Col :span="4">
                            <Button type='primary' @click='unlockTest(item)'>解锁测验</Button>
                        </Col>
                    </Row>
                    <Row>
                        <Button type="primary" class="ok-btn" @click="queryOk">确认</Button>
                    </Row>
                </Row>
            </Row>
        </base-input>
        </el-dialog>
</template>

<script>
    import BaseInput from '../../components/BaseInput'
    import {
        RemoveModal
    } from './mixins'
    import UploadPanel from '../../components/UploadPanel'
    import {
        get_student_detail,
        clear_online_curriculum_record
    } from '../../api/modules/tools_student'
    import {
        Config
    } from '../../config/base'
    import {
        get_student_online_curriculum
    } from '../../api/modules/tools_student'
    import {
        unlock_curriculum_video_test
    } from '../../api/modules/tools_curriculum'

    import defaultAvator from '../../assets/img/side-menu/default-header.jpg'
    export default {
        mixins: [RemoveModal],
        props: {
            remove: {
                type: String
            },
            payload: {}
        },
        components: {
            'base-input': BaseInput
        },
        data() {
            return {
                queryStudentCourse: true,
                dataList: [],
            }
        },
        methods: {
            clearVideoLog() {
                this.$confirm('此操作无法还原，是否确认清除学员线上课观看记录？', '提示', {
                    type: 'warning'
                }).then(() => {
                    clear_online_curriculum_record(this.payload.project_id, this.payload.user_id).then(res => {
                        this.$store.commit('STUDENT_SHOW_LOADING')
                        get_student_online_curriculum({
                            user_id: this.payload.user_id,
                            project_id: this.payload.project_id
                        }).then(res => {
                            if (res.data.res_code == 1) {
                                this.dataList = res.data.msg;
                                this.$store.commit('SEND_STUDENT_ONLINE_CURRICULUM');
                            }
                        })
                        this.$alert('清除成功！', '提示', {
                            confirmButtonText: '确定',
                            callback: action => { }
                        });
                    })
                }).catch(() => { });
            },
            handleClose() {
                this.queryStudentCourse = false;
            },
            handleUploadComplete(url) {
                this.form.img_url = url;
            },
            queryOk() {
                this.queryStudentCourse = false;
            },
            headerImage(v) {
                if (v) {
                    return v
                } else {
                    return defaultAvator
                }
            },
            handleResultProgress(total, tested, learned) {
                var a = learned ? JSON.parse(learned).length : 0;
                var b = tested ? JSON.parse(tested).length : 0;
                var c = total ? total : 0;
                var _total = a + b;
                if (_total > total) {
                    _total = total;
                }
                var d = (_total / c) * 100 + '%';
                var e = _total + '/' + c;
                return {
                    progress: d,
                    specific: e,
                    allFinish: _total === c
                }
            },
            unlockTest(item) {
                unlock_curriculum_video_test(this.payload.user_id, item.curriculum_id).then(res => {
                    if (res.data.res_code === 1) {
                        this.$alert('解锁测验成功!', '提示', {
                            confirmButtonText: '确定',
                            callback: action => { }
                        });
                    }
                    else {
                        this.$alert('解锁测验失败：' + res.data.res_code, '提示', {
                            confirmButtonText: '确定',
                            callback: action => { }
                        });
                    }
                })
            }
        },
        mounted() {
            this.$store.commit('STUDENT_SHOW_LOADING')
            get_student_online_curriculum({
                user_id: this.payload.user_id,
                project_id: this.payload.project_id
            }).then(res => {
                if (res.data.res_code == 1) {
                    this.dataList = res.data.msg;
                    this.$store.commit('SEND_STUDENT_ONLINE_CURRICULUM');
                }
            })
        },
        computed: {
            totalProgress() {
                var finishCount = 0;
                var totalCount = 0;
                for (var i = 0; i < this.dataList.length; i++) {
                    totalCount += this.dataList[i].video_total_count ? this.dataList[i].video_total_count : 0;
                    finishCount += this.dataList[i].see_video_ids ? JSON.parse(this.dataList[i].see_video_ids).length : 0;
                    finishCount += this.dataList[i].complete_video_test_ids ? JSON.parse(this.dataList[i].complete_video_test_ids).length : 0;
                }

                finishCount = finishCount * 100;

                return Math.floor(finishCount / totalCount);
            }
        }
    }

</script>
<style lang="scss">
    #query-student-course-container {
        @import "base.scss";
        input,
        textarea {
            resize: none;
            outline: none;
        }
        .close-dialog-panel {
            position: absolute;
            top: -102px;
            right: -13.5px;
            z-index: 99999;
            font-size: 30px;
            cursor: pointer;
            &:before {
                // color: #fff;
                color: #757575;
            }
        }
        .el-dialog {
            width: 600px;
            background: none;
            .el-dialog__header {
                background: #333333;
                border-radius: 4px 4px 0 0;
                padding: 16px;
            }
            .el-dialog__body {
                margin-bottom: -20px;
                background-color: #fff;
                border-radius: 0 0 4px 4px;
                padding-bottom: 10px;
                .el-form-item__label {
                    font-size: 14px;
                    color: #141111;
                    letter-spacing: 0;
                }
                .el-date-editor--date {
                    width: 100%;
                }
            }
            .course-item {
                padding-bottom: 10px;
                padding-top: 10px;
                display: -webkit-box;
                /* 老版本语法: Safari 3.1-6,  iOS 6-, Android browser, older WebKit browsers.  */
                display: -moz-box;
                /* 老版本语法: Firefox 19- (buggy but mostly works) */
                display: -ms-flexbox;
                /* 混合版本语法: IE 10 */
                display: -webkit-flex;
                /* 新版本语法： Chrome 21+ */
                display: flex;
                /* 新版本语法： Opera 12.1, Firefox 22+ */
                align-items: center;
                /*老版本语法*/
                -webkit-box-align: center;
                -moz-box-align: center;
                /*混合版本语法*/
                -ms-flex-align: center;
                .avator {
                    display: inline-block;
                    width: 40px;
                    height: 40px;
                    overflow: hidden;
                    border-radius: 50% 50%;
                    img {
                        width: 100%;
                    }
                    +p {
                        text-align: center;
                        margin: 0;
                        font-size: 12px;
                    }
                }
                &:hover {
                    background-color: #fbfbfb;
                }
                p {
                    text-align: left;
                }
                i {
                    font-size: 18px;
                    &.xght-webfont-ok-sign {
                        color: #5FA137;
                    }
                }
                .title {
                    width: 300px;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                }
                .progress {
                    width: 300px;
                    height: 10px;
                    border: 1px solid #E5E5E5;
                    position: relative;
                    background: #F6F6F6;
                    span:first-child {
                        position: absolute;
                        left: 0;
                        top: 0;
                        display: inline-block;
                        height: 100%;
                        background-color: #79BC51;
                    }
                    .specific {
                        display: inline-block;
                        position: absolute;
                        top: -4px;
                        right: -50px;
                    }
                }
                .el-button {
                    background-color: #FB843E;
                    border: 0;
                }
            }
            .ok-btn {
                background: #FB843E;
                border-radius: 4px;
                width: 200px;
                height: 36px;
                border: 0;
                margin-top: 30px;
            }
        }
    }
</style>
