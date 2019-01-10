<template>
<div class='manage-student-view'>
    <header-component title='查看学员' @reRenderList="reRenderList"  :showAdd='true' addText='创建学员' @addClick='addStudentHandler'></header-component>
    <!--<Row class='sub-header' type='flex' justify='space-between' align='middle'>-->
    <!--<el-breadcrumb separator="/">-->
    <!--<el-breadcrumb-item>学员管理</el-breadcrumb-item>-->
    <!--<el-breadcrumb-item>查看学员</el-breadcrumb-item>-->
    <!--</el-breadcrumb>-->
    <!--<el-button class='btn-add' type='text' @click='dialogVisible=true'>添加新学员</el-button>-->
    <!--<el-dialog title="添加学员" v-model="dialogVisible" size="small" :close-on-click-modal='false' :close-on-press-escape='false' custom-class='add-student-view'>-->
    <!--<Row class='search-bar' type='flex' justify='center' align='middle'>-->
    <!--<el-input placeholder="请输入用户名" v-model="searchData">-->
    <!--<el-select v-model="searchType" slot="prepend" placeholder="请选择">-->
    <!--<el-option label="用户名" value="nickname"></el-option>-->
    <!--<el-option label="手机号" value="phone"></el-option>-->
    <!--</el-select>-->
    <!--<el-button slot="append" type='text' @click='searchStudent'>搜索</el-button>-->
    <!--</el-input>-->
    <!--</Row>-->
    <!--<Row class='result' type='flex' justify='center' align='middle' v-if='initData'>-->
    <!--<Row type='flex' justify='center' align='middle' v-if='isLoading'>-->
    <!--<i class='el-icon-loading'></i>-->
    <!--</Row>-->
    <!--<div class='data-form' v-if='!isLoading'>-->
    <!--<Row class='user-info' type='flex' justify='start' align='middle' v-if='searchResult'>-->
    <!--搜索结果：ID:<span>{{searchResult.user_id}}</span>用户名:<span>{{searchResult.nickname}}</span>注册手机:<span>{{searchResult.phone}}</span>-->
    <!--</Row>-->
    <!--<Row class='user-info' type='flex' justify='start' align='middle' v-if='!searchResult'>-->
    <!--搜索结果：<span>{{resultMsg}}</span>-->
    <!--</Row>-->
    <!--<Row class='user-data' type='flex' justify='start' align='middle' v-if='searchResult'>-->
    <!--学员真实姓名：-->
    <!--<el-input placeholder='请输入内容' v-model='user.realname'></e-input>-->
    <!--</Row>-->
    <!--<Row class='user-data' type='flex' justify='start' align='middle' v-if='searchResult'>-->
    <!--入学时间：-->
    <!--<el-date-picker-->
    <!--v-model="user.start_school_time"-->
    <!--type="date"-->
    <!--placeholder="选择日期">-->
    <!--</el-date-picker>-->
    <!--</Row>-->
    <!--&lt;!&ndash;<Row class='user-data' type='flex' justify='start' align='middle' v-if='searchResult'>&ndash;&gt;-->
    <!--&lt;!&ndash;报名期数：&ndash;&gt;-->
    <!--&lt;!&ndash;<el-input-number v-model="user.times"></el-input-number>&ndash;&gt;-->
    <!--&lt;!&ndash;</Row>&ndash;&gt;-->
    <!--<Row class='user-data' type='flex' justify='start' align='middle' v-if='searchResult'>-->
    <!--所属学段：-->
    <!--<el-select v-model="user.period_id" placeholder="请选择学段">-->
    <!--<el-option-->
    <!--v-for="item in periods"-->
    <!--:label="item.name"-->
    <!--:value="item.id">-->
    <!--</el-option>-->
    <!--</el-select>-->
    <!--</Row>-->
    <!--<Row class='user-data' type='flex' justify='start' align='middle' v-if='searchResult'>-->
    <!--所属学科：-->
    <!--<el-select v-model="user.subject_id" placeholder="请选择学科">-->
    <!--<el-option-->
    <!--v-for="item in subjects"-->
    <!--:label="item.name"-->
    <!--:value="item.id">-->
    <!--</el-option>-->
    <!--</el-select>-->
    <!--</Row>-->
    <!--<Row class='user-data desc' type='flex' justify='start' align='middle' v-if='searchResult'>-->
    <!--学员备注：-->
    <!--<el-input placeholder='请输入内容' v-model='user.more'></e-input>-->
    <!--</Row>-->
    <!--<Row class='user-data' type='flex' justify='start' align='middle' v-if='searchResult'>-->
    <!--学员类型：-->
    <!--<el-select v-model="user.type" placeholder="请选择学员类型">-->
    <!--<el-option-->
    <!--label="普通"-->
    <!--value="1">-->
    <!--</el-option>-->
    <!--<el-option-->
    <!--label="协议"-->
    <!--value="2">-->
    <!--</el-option>-->
    <!--<el-option-->
    <!--label="个人"-->
    <!--value="3">-->
    <!--</el-option>-->
    <!--</el-select>-->
    <!--</Row>-->
    <!--<Row class='user-data' type='flex' justify='center' align='middle' v-if='searchResult'>-->
    <!--<el-button @click='setStudent'>确认</el-button>-->
    <!--</Row>-->
    <!--</div>-->
    <!--</Row>-->
    <!--</el-dialog>-->
    <!--</Row>-->
    <!--<Row class='data-container'>-->
    <!--<div class='list'>-->
    <!---->
    <!--</div>-->
    <!--</Row>-->
    <Row>
        <el-form :inline="true" :model="formInline" class="find-by-term">
            <el-form-item label="类型" label-width="40px">
                <el-select v-model="formInline.is_test_user" placeholder="请选择类型" @change='changeFilterHandler'>
                    <el-option label="全部" :value="-1"></el-option>
                    <el-option label="正式" :value="0"></el-option>
                    <el-option label="测试" :value="1"></el-option>
                </el-select>
            </el-form-item>
             <el-form-item label="学段" label-width="40px">
                <el-select multiple v-model="formInline.grade_id" placeholder="请选择学段" @change='changeFilterHandler'>
                    <el-option v-for="item in gradeList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="学科" label-width="40px">
                <el-select multiple v-model="formInline.subject_id" placeholder="请选择学科" @change='changeFilterHandler'>
                    <el-option v-for="item in subjectList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="状态" label-width="40px">
                <el-select multiple v-model="formInline.state_id" placeholder="请选择学员状态" @change='changeFilterHandler'>
                    <el-option v-for="item in stateList" :key="item.id" :label="item.name" :value="item.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="产品" label-width="40px">
                <el-select v-model="formInline.product_id" placeholder="请选择产品" @change='changeFilterHandler'>
                    <el-option v-for="item in productList" :key="item.id" :label="item.title" :value="item.id"></el-option>
                </el-select>
            </el-form-item>
        </el-form>
    </Row>
    <Row>
        <el-form :inline='true' :model='formInline' class='find-by-term'>
            <el-form-item>
                <Row>
                    <Col :span="10">
                        <el-select class="select-user" v-model="formInline.classify" placeholder="">
                            <el-option label="手机号" value="phone"></el-option>
                            <el-option label="昵称" value="username"></el-option>
                            <el-option label="真实姓名" value="realname"></el-option>
                            <el-option label="用户ID" value="user_id"></el-option>
                        </el-select>
                    </Col>
                    <Col :span="14">
                        <el-input v-model="formInline.classifyValue" placeholder="请输入搜索内容"></el-input>
                    </Col>
                </Row>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onSubmit">查询</el-button>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="onClear">清除</el-button>
            </el-form-item>
        </el-form>
    </Row>
    <Row class='total-num' type='flex' justfy='start' align='middle'>
        <span>当前学员 {{total}} 人</span>
    </Row>
    <!--<keep-alive>-->
    <data-list class='data-list light-header' @showDetail='showDetailHandler' @queryHomework='queryHomeworkHandler' @queryTask='queryTaskHandler' @queryOffline='queryOfflineHandler' @query='queryHandler' @edit='editHandler' :table-data='dataList' :header-data='dataHeader' :column-formatter='listColumnFormatter' :column-formatter-data='listColumnFormatterData'
        ></data-list>
    <!--</keep-alive>-->
    <back-to-top />
    <Row class='pager' type='flex' justify='end' align='middle'>
        <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="curPage" :page-size="pageSize" layout="sizes, prev, pager, next" :total="total">
        </el-pagination>
    </Row>
</div>
</template>



<script>
import Header from '../../components/Header'
import SubjectFilter from '../../components/SubjectFilter'
import BaseList from '../../components/BaseList'
import BackToTop from '../../components/BackToTop'
import api from '../../api/modules/config'
import {
    set_user_student_mrzx
} from '../../api/modules/student'
import {
    Loading
} from 'element-ui'
import {
    Dialog
} from '../dialogs'
import { doDateFormat, doTimeFormat } from "../../components/Util";
import {
    ADD_STUDENT,
    QUERY_STUDENT_COURSE,
    QUERY_STUDENT_OFFLINE_COURSE,
    QUERY_STUDENT_TASK,
    STUDENT_INFO_DETAIL
} from '../dialogs/types'
import {
    Config
} from '../../config/base'
export default {
    mixins: [Dialog],
    data() {
        return {
            user: {
                user_id: 0,
                realname: '',
                subject_id: 1,
                period_id: 1,
                start_school_time: '',
                times: 0,
                more: '',
                type: '1'
            },
            formInline: {
                grade_id: [],
                subject_id: [],
                state_id:[],
                is_test_user:0,
                classify: 'phone',
                classifyValue: '',
                product_id:null,
            },
            loadingInstance: null,
            searchData: '',
            searchType: 'phone',
            initData: false,
            dialogVisible: false,
            isChange: false,
            isSelected: false,
            listData: [{
                id: 1,
                name: '啊啊啊',
                realname: '翟云志',
                enrolltime: '2016-10-27T02:51:43.000Z',
                subject: '语文',
                phone: '13146278838',
                date_column: ['enrolltime']
            }, {
                id: 2,
                name: '啊啊啊',
                realname: '翟云志',
                enrolltime: '2016-07-29T10:54:28.000Z',
                subject: '语文',
                phone: '13146278838',
                date_column: ['enrolltime']
            }]
        }
    },

    methods: {
        showDetailHandler(index,row){
            this.handleSelModal(STUDENT_INFO_DETAIL,row)
        },
        addStudentHandler(){
            this.handleSelModal(ADD_STUDENT, { showList:true })
        },
        changeFilterHandler(){
            var formData = this.getData();
          this.$store.dispatch('get_student_list', formData);
        },
        getData(){
            var formData = {
              is_test_user:this.formInline.is_test_user,
              project_id: this.$store.state.project.select_project_id,
            grade_id: this.formInline.grade_id,
            subject_id: this.formInline.subject_id,
            states:this.formInline.state_id,
            product_id:this.formInline.product_id
          }
          formData[this.formInline.classify] = this.formInline.classifyValue;
          return formData;
        },
        handleSizeChange(val) {
            if (val !== this.pageSize) {
                var data = this.getData();
                data.curPage = this.curPage;
                data.pageSize = val;
                // this.$store.dispatch('get_student_list', {
                //     curPage: this.curPage,
                //     pageSize: val,
                //     project_id: this.$store.state.project.select_project_id
                // });
                this.$store.dispatch('get_student_list', data);
            }
        },
        onSubmit() {
        //   var formData = {
        //       is_test_user:this.formInline.is_test_user,
        //       project_id: this.$store.state.project.select_project_id
        //     // grade_id: this.formInline.grade_id,
        //     // subject_id: this.formInline.subject_id,
        //     // project_id: this.$store.state.project.select_project_id

        //   }
        //   formData[this.formInline.classify] = this.formInline.classifyValue;
        var formData = this.getData();
          this.$store.dispatch('get_student_list', formData);
        },
        onClear() {
            this.formInline.classifyValue = '';
            this.formInline.is_test_user = 0;
            this.formInline.product_id = null;
            // var formData = {
            //     project_id: this.$store.state.project.select_project_id,
            //     is_test_user:this.formInline.is_test_user
            // // grade_id: this.formInline.grade_id,
            // // subject_id: this.formInline.subject_id,
            // // project_id: this.$store.state.project.select_project_id

            // }
            // formData[this.formInline.classify] = this.formInline.classifyValue;
             var formData = this.getData();
            this.$store.dispatch('get_student_list', formData);
        },
        handleCurrentChange(val) {
            // console.log(val,this.curPage)
            // if (val && val !== this.curPage) {
             var   data = this.getData();
                data.curPage = val;
                data.pageSize = this.pageSize;
            this.$store.dispatch('get_student_list', data);
            // }
        },
        searchStudent() {
            if (!this.initData)
                this.initData = true;
            this.$store.dispatch('search_userinfo_by_nickname_or_phone', {
                searchType: this.searchType,
                searchData: this.searchData
            });
        },
        reRenderList(v) {
            if (this.$store.state.project.project_list.length > 0 && this.dataList.length === 0) {
                // this.$store.dispatch('get_student_list', {
                //     no_group: 0,
                //     project_id: v,
                //     is_test_user:0
                // });
                var   data = this.getData();
                data.no_group = 0;
                data.is_test_user = 0;
                data.project_id = v
            this.$store.dispatch('get_student_list', data);
            }
        },
        setStudent() {
            this.user.user_id = this.searchResult.user_id;
            set_user_student_mrzx(this.user).then((res) => {
                if (res.data.res_code === 1) {
                    alert('保存成功！');
                    this.$store.dispatch('get_student_list', {
                        curPage: 1,
                        pageSize: 100000,
                        is_test_user:0
                    });
                } else {
                    alert('保存失败，' + res.data.msg);
                }
            });
        },
        editData(index) {
            this.$notify({
                title: '提示',
                message: '<p>显示按钮</p><button>保存</button>',
                duration: 0
            })
        },
        deleteData(index) {},
        change() {
            this.listData.unshift(this.listData.pop());
        },
        editHandler(index, row) {
            this.handleSelModal(ADD_STUDENT, {
                type: 2,
                user_id: row.user_id,
                nickname: row.nickname,
                sid: row.id
            });
        },
        // provideCourse(index, row){
        //   this.$confirm('是否给该学员添加线上课？', '提示', {
        //       type: 'info'
        //   }).then(() => {
        //       this.$store.dispatch('send_student_online_curriculum', {user_id: row.user_id, project_id: row.project_id});
        //   }).catch(() => {});
        //
        // },
        queryHandler(index, row) {
            // get_student_online_curriculum({user_id: row.user_id, project_id: row.project_id}).then(res => {
            //   if(res.data.res_code == 1){
            //     console.log(res.data.msg);
            //   }
            // })
            this.handleSelModal(QUERY_STUDENT_COURSE, row)
        },
        queryOfflineHandler(index, row)
        {
            this.handleSelModal(QUERY_STUDENT_OFFLINE_COURSE, row)
        },
        queryTaskHandler(index, row)
        {
            this.handleSelModal(QUERY_STUDENT_TASK, {project_id:row.project_id,user_id:row.user_id,type:0});
        },
        queryHomeworkHandler(index, row)
        {
            this.handleSelModal(QUERY_STUDENT_TASK, {project_id:row.project_id,user_id:row.user_id,type:1})
        }
    },
    mounted() {
        var vm = this;
        if (!this.$store.state.project.project_list || this.$store.state.project.project_list == 'token错误' || this.$store.state.project.project_list.length === 0) {
            this.$store.dispatch('get_project_list', {
                callback(v) {
                    if (vm.$store.state.student.student_list.length === 0) {
                        // vm.$store.dispatch('get_student_list', {
                        //     no_group: 0,
                        //     project_id: v,
                        //     is_test_user:0
                        // });
                                        var   data = vm.getData();
                data.no_group = 0;
                data.is_test_user = 0;
                data.project_id = v
            vm.$store.dispatch('get_student_list', data);
                    }
                                vm.$store.dispatch('get_production_list',{
            project_id: v,
            page_index: 0,
            page_size: 999,
        })
                }
            });
        } else {
            if(this.dataList.length === 0)
            {
                // this.$store.dispatch('get_student_list', {
                //     no_group: 0,
                //     project_id: this.$store.state.project.select_project_id,
                //     is_test_user:0
                // });
                                var   data = this.getData();
                data.no_group = 0;
                data.is_test_user = 0;
                data.project_id = this.$store.state.project.select_project_id;
            this.$store.dispatch('get_student_list', data);
            }
            this.$store.dispatch('get_production_list',{
            project_id: this.$store.state.project.select_project_id,
            page_index: 0,
            page_size: 999,
        })
        }

        // if(this.$store.state.subject.subject_list.length === 0)
        // {
        this.$store.dispatch('get_subject_list');
        // }

        // if(this.$store.state.grade.grade_list.length === 0){
        this.$store.dispatch('get_grade_list')
            // }

    },
    watch: {
        isLoading(val) {
            if (val) {
                this.loadingInstance = Loading.service({
                    text:'加载中，请稍后',
                    fullscreen: true
                });
                setTimeout(() => {
                    this.loadingInstance && this.loadingInstance.close();
                }, Config.base_timeout);
            } else {
                this.loadingInstance && this.loadingInstance.close();
                this.dirty = false;
            }
        }
    },
    computed: {
        list() {
            return this.$store.state.student.student_list;
        },
        pageSize() {
            return this.$store.state.student.pageSize;
        },
        curPage() {
            return this.$store.state.student.curPage;
        },
        total() {
            return this.$store.state.student.total;
        },
        isLoading() {
            return this.$store.state.student.showLoading;
        },
        searchResult() {
            return this.$store.state.student.search_result;
        },
        resultMsg() {
            return this.$store.state.student.search_msg;
        },
        dataHeader() {
            return [{
                prop: 'user_id',
                label: '用户ID',
                width: 80
            }, {
                prop: 'nickname',
                label: '昵称',
                width: 150
            }, {
                prop: 'realname',
                label: '真实姓名',
                width: 100
            },{
                prop: 'phone',
                label: '手机号',
                width: 130
            },{
                prop: 'roles',
                label: '权限'
            }, {
                prop: 'product_id',
                label: '产品',
                width:160
            }, {
                prop: 'grade_id',
                label: '学段',
                width: 80,
                // useFilter:true
            }, {
                prop: 'subject_id',
                label: '学科',
                width: 80,
                // useFilter:true
            }, {
                prop: 'state',
                label: '学员状态',
                width: 100,
                // useFilter:true
            },{
                prop: 'create_time',
                label: '入学时间',
                width: 130
            }, {
                prop: 'times',
                label: '学期',  
                width: 80
            }, {
                label: '操作',
                width:120,
                groupBtn: [{
                    text:'查看详情',
                    param:'showDetail'
                //     text: '编辑',
                //     param: 'edit'
                // },{
                //     text: '查看线上课',
                //     param: 'query',
                //     hoverShow: true
                // },{
                //     text: '查看线下课',
                //     param: 'queryOffline',
                //     hoverShow: true
                // }, {
                //     text: '查看任务',
                //     param: 'queryTask',
                //     hoverShow: true
                // },{
                //     text: '查看作业',
                //     param: 'queryHomework',
                //     hoverShow: true
                }]
            }]
        },
        listColumnFormatter() {
            return [{
                columnName: 'grade_id',
                dataIndex: 0,
                dataProp: 'id',
                dataValue: 'name'
            },{
              columnName: "create_time",
              doFormat: doTimeFormat
            }, {
                columnName: 'subject_id',
                dataIndex: 1,
                dataProp: 'id',
                dataValue: 'name'
            }, {
                columnName: 'state',
                dataIndex: 2,
                dataProp: 'id',
                dataValue: 'name'
            }, {
                columnName: 'roles',
                dataIndex: 3,
                dataProp: 'role_id',
                dataValue: 'role_name'
            }, {
                columnName: 'product_id',
                dataIndex: 4,
                dataProp: 'id',
                dataValue: 'title'
            }]
        },
        listColumnFormatterData() {
            return [this.gradeList, this.subjectList, this.stateList, this.$store.state.roles.role_list,this.productList];
        },
        dataList() {
            return this.$store.state.student.student_list;
        },
        subjectList() {
            return this.$store.state.subject.subject_list;
        },
        gradeList() {
            return this.$store.state.grade.grade_list;
        },
        stateList(){
            return this.$store.state.student.stateList;
        },
        productList(){
            return this.$store.state.production.production_list;
        },
        listHeight(){
            return window.innerHeight - 60 - 20 - 97;
        }
    },
    components: {
        'header-component': Header,
        'subject-filter': SubjectFilter,
        'data-list': BaseList,
        'back-to-top':BackToTop
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

.manage-student-view {
    .base-list-container {
        .base-list-row {
            .cell {
                .el-button{
                    margin-right: 2px;
                    &:last-child {
                        margin-left: 10px;
                    }
                }
            }
        }
    }
    .find-by-term {
        padding-top: 22px;
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
        .el-select{
            width:300px;

            &.select-user{
                width:100%;
          .el-input__inner{
            border-right: 0;
          }
        }
        }
        button {
            background: #FB843E;
            border: 1px solid #F06B1D;
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
        right:20px;
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
            border: 1px solid #EBEBEC;
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
