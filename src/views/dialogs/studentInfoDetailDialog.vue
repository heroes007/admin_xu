<template>
    <Modal :transfer=false title='学员信息' v-model="studentInfoDetailDialog" :width="800" :closable="false" :footer-hide="true" @on-cancel="handleRemoveModal(remove)"  :mask-closable="false">
        <div slot="header"></div>
        <base-input :baseInputWidth="800" @closedialog="handleClose">
            <Row slot="body">
                 <Icon class="close" @click="handleClose" type="ios-close" />
                <!-- <span class="dscj-webfont-remove-sign"></span> -->
                <Tabs @on-click='changeTabHandler' :value='activeName'>
                    <TabPane label="基础信息" name="name1">
                        <Form  ref="form" :model="form1" :label-width="80">
                            <FormItem label="选择项目">
                                <Select v-model="form1.project_id" placeholder="请选择项目" disabled>
                                    <Option v-for="item in projectList" :key="item.id" :label="item.name" :value="item.id"></Option>
                                </Select>
                           </FormItem>
                            <FormItem label="真实姓名">
                                <Input v-model="form1.realname" placeholder="请输入学员真实姓名"></Input>
                           </FormItem>
                            <FormItem label="选择学段">
                                <Select v-model="form1.grade_id" placeholder="请选择学段">
                                    <Option v-for="item in gradeList" :key="item.id" :label="item.name" :value="item.id"></Option>
                                </Select>
                           </FormItem>
                            <FormItem label="选择学科">
                                <Select v-model="form1.subject_id" placeholder="请选择学科">
                                    <Option v-for="item in subjectList" :key="item.id" :label="item.name" :value="item.id"></Option>
                                </Select>
                           </FormItem>
                            <FormItem label="开课时间">
                                <DatePicker type="daterange" placeholder="选择日期" style="width: 200px" v-model="form1.start_school_time" :transfer="true"></DatePicker>
                           </FormItem>
                            <FormItem label="毕业时间">
                                 <DatePicker type="daterange" placeholder="选择日期" style="width: 200px" v-model="form1.finish_school_time" :transfer="true"></DatePicker>
                           </FormItem>
                            <FormItem label="离校时间">
                                 <DatePicker type="daterange" placeholder="选择日期" style="width: 200px" v-model="form1.leave_school_time" :transfer="true"></DatePicker>
                           </FormItem>
                            <FormItem label="学员类型">
                                <Select v-model="form1.type" placeholder="请选择学员类型">
                                    <Option label="普通" value="1"></Option>
                                    <Option label="协议" value="2"></Option>
                                    <Option label="个人返钱" value="3"></Option>
                                    <Option label="个人不返钱" value="4"></Option>
                                    <Option label="内部账号" value="-1"></Option>
                                </Select>
                           </FormItem>
                            <FormItem label="选择导师">
                                <Select v-model="form1.tutor_user_id" placeholder="请选择导师">
                                    <Option v-for="item in teachers" :key="item.id" :label="item.nickname" :value="item.user_id"></Option>
                                </Select>
                           </FormItem>
                            <FormItem label="选择学管">
                                <Select v-model="form1.xg_user_id" placeholder="请选择学管">
                                    <Option v-for="item in studentManagers" :key="item.id" :label="item.nickname" :value="item.user_id"></Option>
                                </Select>
                           </FormItem>
                            <FormItem label="状态">
                                <Select v-model="form1.state" placeholder="请选择学员状态">
                                    <Option label="正常" value="1"></Option>
                                    <Option label="毕业" value="2"></Option>
                                    <Option label="退学" value="3"></Option>
                                    <Option label="延缓" value="4"></Option>
                                    <Option label="删除" value="-1"></Option>
                                </Select>
                           </FormItem>
                            <FormItem label="特殊类型">
                                <Select v-model="form1.is_test_user" placeholder="请选择学员特殊类型">
                                    <Option label="正式学员" :value="0"></Option>
                                    <Option label="测试学员" :value="1"></Option>
                                </Select>
                           </FormItem>
                            <FormItem class="btn-content" :label-width='0'>
                                <Button  @click="deleteStudent(form1.student_id)">删除学员</Button>
                                <Button type="primary" class="sub-btn" @click="saveHandler">保存</Button>
                           </FormItem>
                        </Form>
                    </TabPane>
                    <TabPane label="报名信息" name="name2">
                         <Row class='empty-msg' type='flex' justify='center' align='middle' v-if='form2.user_id === 0'>
                         该用户没有报名信息
                        </Row>
                        <Form ref="form2" :model="form2" :label-width="80" class="add-teacher-form" v-if='form2.user_id !== 0'>
                            <FormItem label="ID">
                                <Input v-model="form2.user_id" disabled></Input>
                           </FormItem>
                            <FormItem label="姓名">
                                <Input v-model="form2.realname" placeholder="请输入考生真实姓名"></Input>
                           </FormItem>
                            <FormItem label="电话">
                                <Input v-model="form2.phone" placeholder="请输入考生电话"></Input>
                           </FormItem>
                            <FormItem label="选择学段">
                                <Select v-model="form2.grade_id" placeholder="请选择学段">
                                    <Option v-for="item in gradeList" :key="item.id" :label="item.name" :value="item.id"></Option>
                                </Select>
                           </FormItem>
                            <FormItem label="选择学科">
                                <Select v-model="form2.subject_id" placeholder="请选择学科">
                                    <Option v-for="item in subjectList" :key="item.id" :label="item.name" :value="item.id"></Option>
                                </Select>
                           </FormItem>
                            <FormItem label="面试结果" v-if='form2.interview_state === 1'>
                                <Select v-model="form2.interview_result" placeholder="请选择学段">
                                    <Option v-for="item in interviewResultList" :key="item.id" :label="item.name" :value="item.id"></Option>
                                </Select>
                           </FormItem>
                            <FormItem label="笔试成绩">
                                <Input v-model="form2.written_result" placeholder="请输入考生笔试成绩"></Input>
                           </FormItem>
                            <FormItem label="出生年月">
                                <DatePicker type="daterange" placeholder="选择日期" style="width: 200px" v-model="form2.birth" :transfer="true"></DatePicker>
                           </FormItem>
                            <FormItem label="邮箱">
                                <Input v-model="form2.email" placeholder="请输入考生邮箱"></Input>
                           </FormItem>
                            <FormItem label="所在院校">
                                <Input v-model="form2.school" placeholder="请输入考生所在院校"></Input>
                           </FormItem>
                            <FormItem label="所学专业">
                                <Input v-model="form2.school_subject" placeholder="请输入考生所学专业"></Input>
                           </FormItem>
                            <FormItem label="在读年级">
                                <Input v-model="form2.school_grade" placeholder="请输入考生在读年级"></Input>
                           </FormItem>
                            <FormItem label="期望就业城市" :label-width='100'>
                                <Input v-model="form2.ex_citys" placeholder="请输入考生期望就业城市"></Input>
                           </FormItem>
                            <FormItem class="btn-content" :label-width='0'>
                                <Button type="primary" class="sub-btn" @click="saveHandler2" :v-if='false'>保存</Button>
                           </FormItem>
                        </Form>
                    </TabPane>
                    <TabPane label="线上课" name="name3">
                        <Row>
                            <Row class='query-header' type='flex' justify="space-between" align='middle'>
                                <h3>已完成：{{totalProgress}}%</h3>
                                <Button type='text' @click='clearVideoLog'>清除观看记录</Button>
                                <Select v-model="form3.product_id" placeholder="请选择项目" @on-change='changeProductHandler'>
                                    <Option v-for="item in form3.productList" :key="item.id" :label="item.title" :value="item.id"></Option>
                                </Select>
                            </Row>

                            <Row class="body-top" v-if="true">
                                <Row v-for="item in form3.dataList" :key="item.id" class="course-item">
                                    <Col :span="4">
                                        <div class="avator"><img :src="headerImage(item.teacher_img)" alt=""></div>
                                        <p>{{item.teacher_name}}</p>
                                    </Col>
                                    <Col :span="12">
                                        <p class="title">{{item.title}}</p>
                                        <p class="progress">
                                            <span :style="{'width': handleResultProgress(item.content_count, item.complete_video_test_ids, item.see_video_ids,item.see_pdf_ids,item.see_img_ids,item.see_html_ids,item.see_audio_ids).progress }"></span>
                                            <span class="specific">{{handleResultProgress(item.content_count, item.complete_video_test_ids, item.see_video_ids,item.see_pdf_ids,item.see_img_ids,item.see_html_ids,item.see_audio_ids).specific}}</span>
                                        </p>
                                    </Col>
                                    <Col :span="4">
                                        <!--<span>{{item.unlock ? '已解锁'  : '未解锁'}}</span>-->
                                        <i :class="{'xght-webfont-lock':!item.unlock,'xght-webfont-play-sign':!handleResultProgress(item.content_count, item.complete_video_test_ids, item.see_video_ids,item.see_pdf_ids,item.see_img_ids,item.see_html_ids,item.see_audio_ids).allFinish && item.unlock,'xght-webfont-ok-sign':handleResultProgress(item.content_count, item.complete_video_test_ids, item.see_video_ids,item.see_pdf_ids,item.see_img_ids,item.see_html_ids,item.see_audio_ids).allFinish}"></i>
                                    </Col>
                                    <Col :span="4">
                                        <Button type='primary' @click='unlockTest(item)'>解锁测验</Button>
                                    </Col>
                                </Row>
                            </Row>
                        </Row>
                    </TabPane>
                    <TabPane label="线下课" name="name4">
                        <Row class='query-header' type='flex' align='middle'>
                                <h3>剩余报名次数：{{form6.real_count}}</h3>
                                <InputNumber v-model="form6.remain_count" @on-change="changeRemainCountHandler" :min="0"></InputNumber>
                            </Row>
                            <Row class='empty-msg' type='flex' justify='center' align='middle' v-if='form6.dataList.length === 0'>
                             该用户没有线下课
                            </Row>
                             <Row v-for="item in form6.dataList" :key="item.id" class="course-item" v-if='form6.dataList.length > 0'>
                            <Col :span="16" :offset='2'>
                                <p class="title">{{item.name}}</p>
                            </Col>
                            </Row>
                    </TabPane>
                    <TabPane label="任务" name="name5">
                        <Row class="body-top" v-if="true">
                            <Row class='empty-msg' type='flex' justify='center' align='middle' v-if='form4.dataList.length === 0'>
                                该用户没有任务
                            </Row>
                            <Row v-for="item in form4.dataList" :key="item.id" class="course-item" v-if='form4.dataList.length > 0'>
                                <Col :span="16">
                                    <p class="title">{{item.name}}</p>
                                </Col>
                                <Col :span="4">
                                    <span>{{item.unlock ? '已发送'  : '未发送'}}</span>
                                </Col>
                                <Col :span="4">
                                    <span>{{item.state === 1 ? '未上传'  : item.state === 2 ? '未批阅' : '已通过'}}</span>
                                </Col>
                            </Row>
                        </Row>
                    </TabPane>
                    <TabPane label="作业" name="name6">
                        <Row class="body-top" v-if="true">
                            <Row class='empty-msg' type='flex' justify='center' align='middle' v-if='form5.dataList.length === 0'>
                                该用户没有作业
                            </Row>
                            <Row v-for="item in form5.dataList" :key="item.id" class="course-item" v-if='form5.dataList.length > 0'>
                                <Col :span="16">
                                    <p class="title">{{item.name}}</p>
                                </Col>
                                <Col :span="4">
                                    <span>{{item.state === 1 ? '未上传'  : item.state === 2 ? '未批阅' : '已通过'}}</span>
                                </Col>
                            </Row>
                        </Row>
                    </TabPane>
                </Tabs>
            </Row>
        </base-input>
    </Modal>
</template>

<script>
    import BaseInput from '../../components/BaseInput'
    import UploadButton from '../../components/UploadButton'
    import {
        RemoveModal
    } from './mixins'
    import {
        mapState,
        mapActions
    } from 'vuex'
    import UploadPanel from '../../components/UploadPanel'
    import { get_student_detail,delete_student } from '../../api/modules/tools_student'
    import { get_list } from '../../api/modules/tools_product'
    import { get_catalog } from '../../api/modules/tools_curriculum_catalog'
    import {
        get_student_online_curriculum,
        new_version_get_student_online_curriculum,
        new_version_clear_online_curriculum_record
    } from '../../api/modules/tools_student'
    import {
    get_student_offline_curriculum_list,
    add_offline_term_count,
    sub_offline_term_count
} from '../../api/modules/tools_offline_curriculum'
    import {
        get_student_task_list,
        get_student_work_list
    } from '../../api/modules/tools_task'
    import {
        get_signup_info_by_userid,
        update_signup_info
    } from '../../api/modules/exam'
        import {
        unlock_curriculum_video_test,
        new_version_unlock_curriculum_video_test
    } from '../../api/modules/tools_curriculum'

    import defaultAvator from '../../assets/img/side-menu/default-header.jpg'
    import { doSortFormatCatalogList } from '../../components/Util'
    import { Loading } from 'element-ui'
    import { Config } from '../../config/base'
    import {
        MPop
    } from '../../components/MessagePop'
    export default {
        mixins: [RemoveModal, MPop],
        props: {
            remove: {
                type: String
            },
            payload: {

            }
        },
        components: {
            'base-input': BaseInput,
            'upload-button': UploadButton,
            'upload-panel': UploadPanel
        },
        data() {
            return {
                studentInfoDetailDialog: true,
                activeName: 'name1',
                form1: {
                    project_id: this.$store.state.project.select_project_id,
                    grade_id: 0,
                    subject_id: 0,
                    user_id: '',
                    nickname: '',
                    state: '',
                    type: '',
                    tutor_user_id: '',
                    xg_user_id: '',
                    is_send_offline_term: '',
                    offline_term_id: '',
                    realname: '',
                    is_test_user: 0
                },
                form2: {
                    user_id: 0,
                    realname: '',
                    phone: '',
                    grade_id: 0,
                    subject_id: 0,
                    written_result: 0,
                    interview_state: 0,
                    interview_result: 0,
                    birth: null,
                    email: '',
                    school: '',
                    school_subject: '',
                    school_grade: '',
                    ex_citys: ''
                },
                form3: {
                    dataList: [],
                    product_id:null,
                    productList:[]
                },
                form4: {
                    dataList: []
                },
                form5: {
                    dataList: []
                },
                form6:{
                    dataList:[],
                    remain_count:0,
                    real_count:0
                },
                loadingInstance: null
            }
        },
        computed: {
            ...mapState({
                projectList: state => state.project.project_list,
                subjectList: state => state.subject.subject_list,
                gradeList: state => state.grade.grade_list,
                teachers: state => state.user.getTeachers,
                studentManagers: state => state.user.getStudentManagers,
                roleList: state => state.roles.role_list,
                interviewResultList: state => state.recruit.result_list
            }),
            totalProgress() {
                var finishCount = 0;
                var totalCount = 0;

                if(!this.form3.product_id)
                    return 0;
                for (var i = 0; i < this.form3.dataList.length; i++) {
                    totalCount += this.form3.dataList[i].content_count ? this.form3.dataList[i].content_count : 0;
                    finishCount += this.form3.dataList[i].see_video_ids ? JSON.parse(this.form3.dataList[i].see_video_ids).length : 0;
                    finishCount += this.form3.dataList[i].see_pdf_ids ? JSON.parse(this.form3.dataList[i].see_pdf_ids).length : 0;
                    finishCount += this.form3.dataList[i].see_img_ids ? JSON.parse(this.form3.dataList[i].see_img_ids).length : 0;
                    finishCount += this.form3.dataList[i].see_html_ids ? JSON.parse(this.form3.dataList[i].see_html_ids).length : 0;
                    finishCount += this.form3.dataList[i].see_audio_ids ? JSON.parse(this.form3.dataList[i].see_audio_ids).length : 0;
                    finishCount += this.form3.dataList[i].complete_video_test_ids ? JSON.parse(this.form3.dataList[i].complete_video_test_ids).length : 0;
                }

                finishCount = finishCount * 100;

                if(totalCount === 0)
                    return 0;

                return Math.floor(finishCount / totalCount);
            }
        },
        methods: {
            ...mapActions([
                'edit_student',
                'get_grade_list',
                'get_subject_list',
                'get_teachers',
                'get_student_managers',
                'get_role'

            ]),
            changeProductHandler(){
                this.showloading();
                new_version_get_student_online_curriculum({
                        product_id:this.form3.product_id,
                        user_id: this.payload.user_id,
                        project_id: this.payload.project_id
                    }).then(res => {
                        if (res.data.res_code == 1) {
                            this.form3.dataList = res.data.msg;
                            this.loadingInstance.close();
                        }
                    })
            },
            changeRemainCountHandler(v) {
                // this.showloading();
                if(v > this.form6.real_count){
                    add_offline_term_count(this.payload.user_id).then(res => {
                        if (res.data.res_code === 1) {
                            this.form6.real_count = v;
                            this.loadingInstance.close();
                        }
                    })
                }else{
                    sub_offline_term_count(this.payload.user_id).then(res => {
                        if (res.data.res_code === 1) {
                            this.form6.real_count = v;
                            this.loadingInstance.close();
                        }
                    })
                }
            },
            changeTabHandler(tab, event) {
                if (tab.index === '1' && this.form2.user_id === 0) {

                    this.showloading();
                    get_signup_info_by_userid(this.payload.user_id).then(res => {

                        if (res.data.res_code === 1) {
                            this.form2 = res.data.msg;
                            this.form2.user_id = this.payload.user_id;
                            this.loadingInstance.close();
                        }
                        else
                        {
                            this.loadingInstance.close();
                        }
                    })
                }
                else if (tab.index === '2' && this.form3.dataList.length === 0) {
                    this.showloading();
                    // get_student_online_curriculum({
                    // new_version_get_student_online_curriculum({
                    //     product_id:this.form3.product_id,
                    //     user_id: this.payload.user_id,
                    //     project_id: this.payload.project_id
                    // }).then(res => {
                    //     if (res.data.res_code == 1) {
                    //         this.form3.dataList = res.data.msg;
                    //         this.loadingInstance.close();
                    //     }
                    // })
                }
                else if (tab.index === '3' && this.form6.dataList.length === 0) {
                    this.showloading();
                    get_student_offline_curriculum_list(this.payload.user_id,this.payload.project_id).then(res => {
                        if (res.data.res_code == 1) {
                            this.form6.dataList = res.data.msg.offline_terms;
                            this.form6.remain_count = res.data.msg.remain_count;
                            this.form6.real_count = this.form6.remain_count;
                            this.loadingInstance.close();
                        }
                    })
                }
                else if (tab.index === '4' && this.form4.dataList.length === 0) {
                    this.showloading();
                    get_student_task_list(this.payload.project_id, this.payload.user_id).then(res => {
                        if (res.data.res_code == 1) {
                            this.form4.dataList = res.data.msg;
                            this.loadingInstance.close();
                        }
                    })
                }
                else if (tab.index === '5' && this.form5.dataList.length === 0) {
                    this.showloading();
                    get_student_work_list(this.payload.project_id, this.payload.user_id).then(res => {
                        if (res.data.res_code == 1) {
                            this.form5.dataList = res.data.msg;
                            this.loadingInstance.close();
                        }
                    })
                }
            },
            showloading(){
                this.loadingInstance = this.$LoadingY({message: "加载中，请稍后",show: true});
                setTimeout(() => {
                    this.loadingInstance.close();
                }, Config.base_timeout);
            },
            saveHandler() {
                this.edit_student(this.form1);
            },
            saveHandler2() {
                this.showloading();
                update_signup_info(this.form2.id, this.form2).then(res => {
                    if (res.data.res_code == 1) {
                        this.loadingInstance.close();
                        this.showPop('保存成功');
                    }
                })
            },
            handleClose() {
                this.studentInfoDetailDialog = false;
            },
            headerImage(v) {
                if (v) {
                    return v
                } else {
                    return defaultAvator
                }
            },
            handleResultProgress(total, tested, learned1, learned2, learned3, learned4, learned5) {
                // console.log(total, tested, learned);
                var a1 = learned1 ? JSON.parse(learned1).length : 0;
                var a2 = learned2 ? JSON.parse(learned2).length : 0;
                var a3 = learned3 ? JSON.parse(learned3).length : 0;
                var a4 = learned4 ? JSON.parse(learned4).length : 0;
                var a5 = learned5 ? JSON.parse(learned5).length : 0;
                var a = a1 + a2 + a3 + a4 + a5;
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
                new_version_unlock_curriculum_video_test(this.payload.user_id, item.curriculum_id, this.form3.product_id).then(res => {
                    if (res.data.res_code === 1) {
                           this.$Modal.info({
                            title: '提示',
                            content: '解锁测验成功',
                            onOk: () => {}
                         });
                    } else {
                        this.$Modal.info({
                            title: '提示',
                            content: '解锁测验失败：' + res.data.res_code,
                            onOk: () => {}
                         });
                    }
                })
            },
            handleUploadComplete(url) {
                this.form.img_url = url;
            },
            deleteStudent(student_id){
                this.$Modal.confirm({
                    title: '提示',
                    content: '此操作无法还原，是否确认删除该学员？',
                    onOk: () => {
                        delete_student(student_id).then(rs => {
                        this.$Modal.info({
                            title: '提示',
                            content: '删除成功！',
                            onOk: () => {
                            this.studentInfoDetailDialog = false;
                            }
                        });
                        });
                    }
                });
            },
            clearVideoLog() {
                    this.$Modal.confirm({
                    title: '提示',
                    content: '此操作无法还原，是否确认清除学员线上课观看记录？',
                    onOk: () => {
                          new_version_clear_online_curriculum_record(this.form3.product_id, this.payload.user_id).then(res => {
                        this.showloading();
                        new_version_get_student_online_curriculum({
                            user_id: this.payload.user_id,
                            project_id: this.payload.project_id,
                            product_id:this.form3.product_id
                        }).then(res => {
                            if (res.data.res_code == 1) {
                                this.form3.dataList = res.data.msg;
                                this.loadingInstance.close();
                            }
                        })
                         this.$Modal.info({
                            title: '提示',
                            content: '清除成功！',
                            onOk: () => {}
                        });
                    })
                    }
                })
            }
        },
        mounted() {
            this.get_grade_list();
            this.get_subject_list();
            this.get_teachers();
            this.get_student_managers();
            this.get_role();

            var vm = this;

            this.form1.user_id = this.payload.user_id;
            this.form1.nickname = this.payload.nickname;

        get_list({project_id:this.payload.project_id,page_index:0,page_size:99999,state:[0,1,2]}).then(res => {
            if(res.data.res_code === 1)  this.form3.productList = res.data.msg.products;
        })
        if (this.payload.id) {
                this.loadingInstance = this.$LoadingY({message: "加载中，请稍后",show: true})
                setTimeout(() => {
                    this.loadingInstance.close();
                }, Config.base_timeout);
                get_student_detail(this.payload.id).then(res => {
                    if (res.data.res_code === 1) {
                        this.form1 = res.data.msg;
                        this.form1.student_id = this.payload.id;
                        this.form1.user_id = this.payload.user_id;
                        this.form1.nickname = this.payload.nickname;
                        this.form1.start_school_time = res.data.msg.start_school_time;
                        this.form1.finish_school_time = res.data.msg.finish_school_time;
                        this.form1.leave_school_time = res.data.msg.leave_school_time;
                        this.form1.state = String(res.data.msg.state);
                        this.form1.type = String(res.data.msg.type);
                        this.form1.tutor_user_id = res.data.msg.tutor_user_id == 0 ? '' : res.data.msg.tutor_user_id;
                        this.form1.xg_user_id = res.data.msg.xg_user_id;
                        this.form1.realname = res.data.msg.realname;
                        this.form1.is_test_user = res.data.msg.is_test_user;
                        this.form1._fn = function(){
                            vm.showPop('保存成功');
                        }
                       if(this.loadingInstance) this.loadingInstance.close();
                    }
                })
            }
        }
    }
</script>
<style lang="scss" scoped>
/deep/ .ivu-tabs-bar{ height: 50px ;}
/deep/ .ivu-tabs-nav .ivu-tabs-tab{ height: 50px; line-height: 34px; font-size: 16px}
/deep/ .ivu-tabs-nav .ivu-tabs-tab:hover{ color: #FC7643 }
    .close{
    position: absolute;
    right: 7px;
    top: 7px;
    font-size: 31px;
    z-index: 3000;
    }
    /deep/.ivu-modal-header{
        display: none;
    };
    /deep/ .ivu-modal-body{ padding: 0; }
    /deep/  .ivu-form{
              width: 80%;
              margin: 20px auto;
    }
    /deep/ .btn-content {
        display: flex;
        justify-content: center;
    }
     .sub-btn {
        background: #FB843E;
        border-radius: 4px;
        width: 200px;
        height: 36px;
        border: 0;
    }
    /deep/ .ivu-tabs-tabpane{ padding: 0px 30px; }
    #student-info-detail-container {
        @import "base.scss";
        input,
        textarea {
            resize: none;
            outline: none;
        }
        .close-dialog-panel {
            position: absolute;
            top: 10px;
            right: 13.5px;
            z-index: 99999;
            font-size: 30px;
            cursor: pointer;
            &:before {
                // color: #fff;
                color: #757575;
            }
        }
        .el-dialog {
            .el-dialog__title {
                font-weight: 500;
            }
            .el-dialog__header {
                display: none;
            }
            .el-dialog__body {
                padding: 0;
                .el-tabs--border-card {
                    border: none;
                    background: none;
                }
                .el-form-item__label {
                    font-size: 14px;
                    color: #141111;
                    letter-spacing: 0;
                }
                .el-tabs__header {
                    background: #333333;
                    border-radius: 4px 4px 0 0;
                    height: 50px;
                    .el-tabs__item:first-child {
                        margin-left: 0;
                        border-top-left-radius: 4px;
                    }
                    .el-tabs__item {
                        font-size: 16px;
                        letter-spacing: 0;
                        color: #fff;
                        height: 51px;
                        line-height: 51px;
                        padding: 0 30px;
                    }
                    .is-active {
                        font-size: 16px;
                        color: #141111;
                        letter-spacing: 0;
                    }
                }
                .el-tabs__content {
                    border-radius: 0 0 4px 4px;
                    background: #fff;
                    padding: 0;
                }
                .el-form {
                    width: 80%;
                    margin: 20px auto;
                    input {
                        border: 1px solid #CCCCCC;
                    }
                    .upload-form {
                        text-align: left;
                        margin-bottom: 0;
                        .el-radio-group {
                            margin-top: 50px;
                        }
                    }

                }
                .query-header {
                    padding:0 30px;
                    h3 {
                        margin-right: 30px;
                    }
                    .el-input-number {
                        display: inline-block;
                        width: 74px;
                        height: 34px;
                        .el-input-number__decrease {
                                border:0;
                            }
                        .el-input-number__increase {
                            border:0;
                        }
                        .el-input {
                            display: none;
                        }
                    }
                }
                .body-top {
                    padding:0 30px;
                }
                                    .empty-msg {
                        margin: 30px;
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
                .has-video-form {
                    width: 100%;
                    margin: 0;
                    .el-form-item:first-child {
                        width: 80%;
                        margin: 20px auto;
                    }
                    .course-list {
                        .el-form-item__content {
                            margin-left: 0 !important;
                            line-height: 0;
                        }
                        .el-collapse-item__header__arrow {
                            position: absolute;
                            right: 18px;
                            margin-top: 15px;
                        }
                        .el-collapse-item__header {
                            padding-left: 20px;
                            text-align: left;
                            font-size: 16px;
                            color: #141111;
                            letter-spacing: 0;
                            i {
                                color: #CCCCCC;
                                transform: rotateZ(90deg);
                            }
                        }
                        .is-active {
                            i {
                                transform: rotateZ(-90deg);
                            }
                        }
                        .course-item {
                            margin-right: 8px;
                            font-size: 14px;
                            margin-left: -6px;
                            color: #3B3B3B;
                            letter-spacing: 0;
                            .el-icon-star-on {
                                margin-right: 10px;
                                margin-left: 4px;
                            }
                            .el-checkbox-group {
                                text-align: right;
                            }
                            .Col-18 {
                                text-align: left;
                            }
                        }
                    }
                }
                .btns {
                    padding-top: 10px;
                    padding-bottom: 8px;
                    .el-form-item__content {
                        margin-left: 0 !important;
                        el-button {
                            margin-left: 0;
                        }
                    }
                }
            }
        }
    }
</style>
