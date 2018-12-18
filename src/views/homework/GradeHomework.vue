<template>
    <div class='grade-homework-view'>
        <header-component title='批阅任务包'></header-component>
        <el-breadcrumb separator="/">
          <el-breadcrumb-item>任务管理</el-breadcrumb-item>
          <el-breadcrumb-item>批阅任务包</el-breadcrumb-item>
          <el-breadcrumb-item>{{typeStr}}</el-breadcrumb-item>
          <el-breadcrumb-item>{{tabIndex === 0?'未批阅':tabIndex === 1?'已批阅':'未上传'}}</el-breadcrumb-item>
        </el-breadcrumb>
        <el-row class='data-container'>
            <el-row class='type-list' type='flex' justify='center' align='middle'>
                <el-col v-for='(item, key) in categories' :key="item.id">
                    <div class='type-item' @click='changeType(key)'>
                        <p>{{item.name}}</p>
                    </div>
                </el-col>
            </el-row>
            <div class='list'>
                <el-row class='data-tab' type='flex'>
                    <el-col class='header-item' v-bind:class="{'active':tabIndex == 0}">
                        <div @click='changeTab(0)'>
                            未批阅
                        </div>
                    </el-col>
                    <el-col class='header-item' v-bind:class="{'active':tabIndex == 1}">
                        <div @click='changeTab(1)'>
                            已批阅
                        </div>
                    </el-col>
                    <el-col class='header-item' v-bind:class="{'active':tabIndex == 2}">
                        <div @click='changeTab(2)'>
                            未上传
                        </div>
                    </el-col>
                    <el-col>
                    </el-col>
                </el-row>
                <el-row class='data-header' type='flex' align='middle'>
                    <el-col>
                        任务名称
                    </el-col>
                    <el-col>
                        学员名称
                    </el-col>
                    <el-col>
                        应交日期
                    </el-col>
                    <el-col v-if='tabIndex === 0 || tabIndex === 1'>
                        上传日期
                    </el-col>
                    <el-col v-if='tabIndex === 1'>
                        批阅日期
                    </el-col>
                    <el-col>
                        查看任务
                    </el-col>
                    <el-col v-if='tabIndex === 1'>
                        批阅老师
                    </el-col>
                    <el-col v-if='tabIndex === 0 || tabIndex === 1'>
                        操作
                    </el-col>
                    <el-col v-if='tabIndex === 2'>
                        布置老师
                    </el-col>
                    <el-col v-if='tabIndex === 2'>
                        <el-select v-model="filterSubject" placeholder="所属学科">
                            <el-option
                                    v-for="item in subjects" :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                            </el-option>
                        </el-select>
                    </el-col>
                </el-row>
                <el-row class='data-item bg-gray' type='flex' v-for='item in list' :key="item.id">
                    <el-col class='work-name'>
                        <p>{{item.task_name}}</p>
                    </el-col>
                    <el-col class='student-name'>
                        {{item.student_realname}}
                    </el-col>
                    <el-col class='dead-line'>
                        {{item.expect_task_time | zonetime}}
                    </el-col>
                    <el-col class='upload-time' v-if='tabIndex === 0 || tabIndex === 1'>
                        {{item.upload_time | zonetime}}
                    </el-col>
                    <el-col class='grade-time' v-if='tabIndex === 1'>
                        2016-11-01
                    </el-col>
                    <el-col class='work-name'>
                        查看
                    </el-col>
                    <el-col class='teacher-name' v-if='tabIndex === 1 ||  tabIndex === 2'>
                        {{item.teacher_name}}
                    </el-col>
                    <el-col class='subject' v-if='tabIndex === 2'>
                        {{item.subject_name}}
                    </el-col>
                    <el-col class='handle' v-if='tabIndex === 0 || tabIndex === 1'>
                        批阅|毕业
                    </el-col>
                </el-row>
            </div>
        </el-row>
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
                .el-col {
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
                    .el-col {
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
                    .el-col {
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

                    .el-col {
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