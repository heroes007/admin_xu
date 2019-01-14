<template>
    <div class='grade-homework-view'>
        <header-component title='批阅任务包'></header-component>
        <el-breadcrumb separator="/">
          <el-breadcrumb-item>任务管理</el-breadcrumb-item>
          <el-breadcrumb-item>批阅任务包</el-breadcrumb-item>
          <el-breadcrumb-item>{{typeStr}}</el-breadcrumb-item>
          <el-breadcrumb-item>{{tabIndex === 0?'未批阅':tabIndex === 1?'已批阅':'未上传'}}</el-breadcrumb-item>
        </el-breadcrumb>
        <Row class='data-container'>
            <Row class='type-list' type='flex' justify='center' align='middle'>
                <Col v-for='(item, key) in categories' :key="item.id">
                    <div class='type-item' @click='changeType(key)'>
                        <p>{{item.name}}</p>
                    </div>
                </Col>
            </Row>
            <div class='list'>
                <Row class='data-tab' type='flex'>
                    <Col class='header-item' v-bind:class="{'active':tabIndex == 0}">
                        <div @click='changeTab(0)'>
                            未批阅
                        </div>
                    </Col>
                    <Col class='header-item' v-bind:class="{'active':tabIndex == 1}">
                        <div @click='changeTab(1)'>
                            已批阅
                        </div>
                    </Col>
                    <Col class='header-item' v-bind:class="{'active':tabIndex == 2}">
                        <div @click='changeTab(2)'>
                            未上传
                        </div>
                    </Col>
                    <Col>
                    </Col>
                </Row>
                <Row class='data-header' type='flex' align='middle'>
                    <Col>
                        任务名称
                    </Col>
                    <Col>
                        学员名称
                    </Col>
                    <Col>
                        应交日期
                    </Col>
                    <Col v-if='tabIndex === 0 || tabIndex === 1'>
                        上传日期
                    </Col>
                    <Col v-if='tabIndex === 1'>
                        批阅日期
                    </Col>
                    <Col>
                        查看任务
                    </Col>
                    <Col v-if='tabIndex === 1'>
                        批阅老师
                    </Col>
                    <Col v-if='tabIndex === 0 || tabIndex === 1'>
                        操作
                    </Col>
                    <Col v-if='tabIndex === 2'>
                        布置老师
                    </Col>
                    <Col v-if='tabIndex === 2'>
                        <Select v-model="filterSubject" placeholder="所属学科">
                            <Option
                                    v-for="item in subjects" :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                            </Option>
                        </Select>
                    </Col>
                </Row>
                <Row class='data-item bg-gray' type='flex' v-for='item in list' :key="item.id">
                    <Col class='work-name'>
                        <p>{{item.task_name}}</p>
                    </Col>
                    <Col class='student-name'>
                        {{item.student_realname}}
                    </Col>
                    <Col class='dead-line'>
                        {{item.expect_task_time | zonetime}}
                    </Col>
                    <Col class='upload-time' v-if='tabIndex === 0 || tabIndex === 1'>
                        {{item.upload_time | zonetime}}
                    </Col>
                    <Col class='grade-time' v-if='tabIndex === 1'>
                        2016-11-01
                    </Col>
                    <Col class='work-name'>
                        查看
                    </Col>
                    <Col class='teacher-name' v-if='tabIndex === 1 ||  tabIndex === 2'>
                        {{item.teacher_name}}
                    </Col>
                    <Col class='subject' v-if='tabIndex === 2'>
                        {{item.subject_name}}
                    </Col>
                    <Col class='handle' v-if='tabIndex === 0 || tabIndex === 1'>
                        批阅|毕业
                    </Col>
                </Row>
            </div>
        </Row>
    </div>
</template>

<style lang="scss">
    .grade-homework-view {
        .data-container {
            background-color:#ffffff;
            margin:0 20px 20px 20px;
            border:1px solid #cecece;

            .type-list {
                padding:40px;
                .Col {
                    height:120px;
                    width:120px;
                    margin:0 20px;
                    .type-item {
                        position:relative;
                        width:100%;
                        height:100%;
                        border:1px solid #f46170;
                        border-radius:50%;
                        //line-height:180px;
                        cursor:pointer;
                        text-align:center;
                        p {
                            margin-top:70%;
                            line-height:1.2;
                        }
                    }
                }
            }

            .list {
                .data-tab {
                    height:48px;
                    border-top:1px solid #cecece;
                    .Col {
                        line-height:48px;
                        border-bottom:1px solid #cecece;
                    }
                    .header-item {
                        width:120px;
                        border-right:1px solid #cecece;
                        cursor:pointer;

                        &.active {
                            color:#5fa137;
                            border-bottom-color:transparent;
                        }
                    }
                }
                .data-header {
                    height:50px;
                    .Col {
                        line-height:50px;
                        .el-select {
                            .el-input {
                                .el-input__inner {
                                    border:0;
                                    font-size: 16px;
                                    color:#2c3e50;
                                }
                            }
                        }
                    }
                }
                .data-item {
                    height:60px;
                    border-top:1px solid #cecece;

                    &.bg-gray {
                        background-color:#fbfbfb;
                    }

                    .Col {
                        line-height:60px;
                        .el-button {
                            color:#5fa137;
                            font-size:14px;
                        }
                        p {
                            margin:0;
                            display: -webkit-box;
                            white-space: normal;
                            -webkit-box-orient: vertical;
                            overflow: hidden;
                            -webkit-line-clamp: 1;
                        }
                    }
                }
            }
        }
    }
</style>

<script>
    import Header from '../../components/Header'
    import SubjectFilter from '../../components/SubjectFilter.vue'
    import api from '../../api/modules/config'
    import { get_no_read_over_list, get_read_over_list, get_no_upload_list, get_task_category_list } from '../../api/modules/task'

    export default{
        data(){
            return{
                tabIndex:0,
                type:0,
                categories:[],
                list:[],
                filterSubject:0,
            }
        },
        methods:{
            changeTab(index){
                this.tabIndex = index;
                this.getData();
            },
            changeType(type){
                this.type = type;
                this.getData();
            },
            getData() {
                var apiHost = '';

                switch(this.tabIndex) {
                    case 0:
                        apiHost = get_no_read_over_list;
                        break;
                    case 1:
                        apiHost = get_read_over_list;
                        break;
                    case 2:
                        apiHost = get_no_upload_list;
                        break;
                }

                apiHost(this.categories[this.type].id,0,999,'task_name','ASC',this.filterSubject == 0?'':this.filterSubject).then((res) => {
                    if(res.data.res_code === 1)
                    {
                        this.list = res.data.msg;
                    }
                });
            }
        },
        components:{
            'header-component':Header,
            'subject-filter':SubjectFilter
        },
        computed: {
            typeStr(){
                if(this.categories[this.type])
                    return this.categories[this.type].name;
                else
                    return '';
            },
            subjects() {
                var result = [{name:'全部',id:'0'}]
                result = result.concat(this.$store.state.subject.subject_list);
                return result;
            }
        },
        watch: {
            filterSubject(){
                this.getData();
            }
        },
        mounted() {
            get_task_category_list().then((res) => {
                if(res.data.res_code === 1)
                {
                    this.categories = res.data.msg;
                    this.getData();
                }
            });
            this.$store.dispatch('get_subject_list');
        }
    }
</script>