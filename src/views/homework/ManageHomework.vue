<template>
    <div class='manage-homework-view'>
        <header-component title='查看任务包'></header-component>
        <el-row class='sub-header' type='flex' justify='space-between' align='middle'>
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>任务管理</el-breadcrumb-item>
                <el-breadcrumb-item>查看任务包</el-breadcrumb-item>
                <el-breadcrumb-item>{{tabIndex === 0?'线下任务':'线上作业'}}</el-breadcrumb-item>
            </el-breadcrumb>
            <el-button class='btn-add' type='text' @click='addHomework()'>添加新任务</el-button>
            <el-dialog title="设置任务" v-model="dialogVisible" size="small" :close-on-click-modal='false' :close-on-press-escape='false' custom-class='add-homework-view'>
                <el-row class='tab-bar' type='flex' align='middle'>
                    <el-col class='tab-item' :class="{'active':!data.auto}" v-if='!isEdit || (isEdit && !data.auto)'>
                        <div @click='data.auto = false'>
                            线下任务
                        </div>
                    </el-col>
                    <el-col class='tab-item' :class="{'active':data.auto}" v-if='!isEdit || (isEdit && data.auto)'>
                        <div @click='data.auto = true'>
                            线上作业
                        </div>
                    </el-col>
                    <el-col>
                        <div></div>
                    </el-col>
                </el-row>
                <el-row type='flex' justify='center' class='data-container'>
                    <div class='data-inputs'>
                        <el-row class='input-rows' type='flex' justify='left' align='middle'>
                            <span class='m-label'>{{data.auto?'作业':'任务'}}名称</span>
                            <el-input placeholder='请输入任务名称' v-model='data.task_name'>
                                </el-input>
                        </el-row>
                        <el-row class='input-rows' type='flex' justify='left' align='middle'>
                            <span class='m-label'>上传格式</span>
                            <el-select v-model="data.upload_type" multiple placeholder="请选择上传格式">
                                <el-option
                                        label="视频"
                                        value="0">
                                </el-option>
                                <el-option
                                        label="文本"
                                        value="1">
                                </el-option>
                                <el-option
                                        label="图片"
                                        value="2">
                                </el-option>
                                <el-option
                                        label="音频"
                                        value="3">
                                </el-option>
                            </el-select>
                            <span class='m-label'>（多选）</span>
                        </el-row>
                        <el-row class='input-rows' type='flex' justify='left' align='middle' v-if='!data.auto'>
                            <span class='m-label'>{{data.auto?'作业':'任务'}}分类</span>
                            <el-select v-model="data.task_category_id" placeholder="请选择分类">
                                <el-option
                                        v-for="item in categories" :key="item.id"
                                        :label="item.name"
                                        :value="item.id">
                                </el-option>
                            </el-select>
                        </el-row>
                        <el-row class='input-rows' type='flex' justify='left' align='middle' v-if='!data.auto'>
                            <span class='m-label'>所属学段</span>
                            <el-select v-model="data.period_id" placeholder="请选择学科">
                                <el-option
                                        v-for="item in periods" :key="item.id"
                                        :label="item.name"
                                        :value="item.id">
                                </el-option>
                            </el-select>
                        </el-row>
                        <el-row class='input-rows' type='flex' justify='left' align='middle' v-if='!data.auto'>
                            <span class='m-label'>所属学科</span>
                            <el-select v-model="data.subject_id" placeholder="请选择学科">
                                <el-option
                                        v-for="item in subjects" :key="item.id"
                                        :label="item.name"
                                        :value="item.id">
                                </el-option>
                            </el-select>
                        </el-row>
                        <el-row class='input-rows' type='flex' justify='left' align='middle'>
                            <span class='m-label'>{{data.auto?'作业':'任务'}}要求</span>
                            <el-input
                                    class='desc'
                                    type="textarea"
                                    :autosize="{ minRows: 2, maxRows: 4}"
                                    placeholder="请输入具体要求"
                                    v-model="data.task_require">
                            </el-input>
                        </el-row>
                        <!--<el-row class='input-rows' type='flex' justify='left' align='middle' v-if='!isEdit'>-->
                        <!--<span class='m-label'>自动触发</span>-->
                        <!--<el-switch-->
                        <!--v-model="data.auto"-->
                        <!--off-color='#cecece'-->
                        <!--on-color="#69BA6D">-->
                        <!--</el-switch>-->
                        <!--</el-row>-->
                        <el-row class='input-rows' type='flex' justify='left' align='middle' v-if='data.auto && !isEdit'>
                            <span class='m-label'>完成课程</span>
                            <el-select v-model="data.auto_curriculum_id" placeholder="请选择课程">
                                <el-option
                                        v-for="item in courses" :key="item.id"
                                        :label="item.title"
                                        :value="item.curriculum_id">
                                </el-option>
                            </el-select>
                        </el-row>
                        <!--<el-row class='input-rows' type='flex' justify='left' align='middle' v-if='!isEdit'>-->
                            <!--<span class='m-label'>上传次数</span>-->
                            <!--<el-input-number v-model="data.upload_count" :min='1'></el-input-number>-->
                        <!--</el-row>-->
                        <!--<el-row class='input-rows' type='flex' justify='left' align='middle' v-if='!isEdit'>-->
                            <!--<span class='m-label'>间隔天数</span>-->
                            <!--<el-input-number v-model="data.interval_days" :disabled='data.upload_count == 1'></el-input-number>-->
                            <!--<span v-if='data.upload_count == 1'>上传次数为1时，间隔天数只能为0</span>-->
                        <!--</el-row>-->
                        <!--<el-row class='input-rows' type='flex' justify='left' align='middle' v-if='!data.auto && !isEdit'>-->
                            <!--<span class='m-label'>开始时间</span>-->
                            <!--<el-date-picker-->
                                    <!--v-model="data.start_time"-->
                                    <!--type="date"-->
                                    <!--placeholder="选择日期"-->
                                    <!--:picker-options="pickerOptions">-->
                            <!--</el-date-picker>-->
                        <!--</el-row>-->
                        <!--<el-row class='input-rows' type='flex' justify='left' align='middle' v-if='!data.auto && !isEdit'>-->
                            <!--<span class='m-label'>选择学员</span>-->
                            <!--<el-date-picker-->
                                    <!--v-model="student_search_date"-->
                                    <!--type="daterange"-->
                                    <!--placeholder="选择学员入学时间"-->
                                    <!--style="width: 220px">-->
                            <!--</el-date-picker>-->
                            <!--<span class='m-label gray' v-if='student_search_date'>已选{{data.to_user_ids.length}}学员</span>-->
                        <!--</el-row>-->
                        <!--<el-row class='input-rows' type='flex' justify='right' align='middle' v-show='!data.auto && student_search_date && !isEdit'>-->
                            <!--<user-list v-on:listChange='listChangeHandler' :searchRange='student_search_date'></user-list>-->
                        <!--</el-row>-->
                        <el-row class='btns' type='flex' justify='center' align='middle'>
                            <el-button @click='submit'>提交</el-button>
                        </el-row>
                    </div>
                </el-row>
            </el-dialog>
        </el-row>

        <el-row class='data-container'>
            <div class='list'>
                <el-row class='data-tab' type='flex'>
                    <el-col class='header-item' v-bind:class="{'active':tabIndex == 0}">
                        <div @click='changeTab(0)'>
                            线下任务
                        </div>
                    </el-col>
                    <el-col class='header-item' v-bind:class="{'active':tabIndex == 1}">
                        <div @click='changeTab(1)'>
                            线上作业
                        </div>
                    </el-col>
                    <el-col>
                    </el-col>
                </el-row>
                <el-row class='data-header' type='flex'>
                    <el-col>
                        ID
                    </el-col>
                    <el-col>
                        布置日期
                    </el-col>
                    <el-col>
                        任务名称
                    </el-col>
                    <el-col v-if='tabIndex === 1'>
                        触发条件（完成课程）
                    </el-col>
                    <el-col>
                        布置人
                    </el-col>
                    <el-col>
                        操作
                    </el-col>
                </el-row>
                <el-row class='data-item bg-gray' type='flex' v-for='item in list' :key="item.id">
                    <el-col>
                        {{item.task_id}}
                    </el-col>
                    <el-col>
                        {{item.update_time | zonetime}}
                    </el-col>
                    <el-col>
                        <p>{{item.name}}</p>
                    </el-col>
                    <el-col v-if='tabIndex === 1'>
                        <p>{{item.title}}</p>
                    </el-col>
                    <el-col>
                        {{item.nickname}}
                    </el-col>
                    <el-col>
                        <el-button type='text' v-if='tabIndex == 1'>
                            <!--<a :href="'/dashboard/add-homework/' + item.task_id ">编辑</a>-->
                            <a @click='editHomework(item)'>编辑</a>/<a @click='deleteHomework(item)'>删除</a>
                        </el-button>
                        <el-button type='text' v-if='tabIndex == 0'>
                            <!--<a :href="'/dashboard/add-homework/' + item.task_id ">编辑</a>-->
                            <a @click='editHomework(item)'>编辑</a></a>
                        </el-button>
                    </el-col>
                </el-row>
                <el-row class='pager' type='flex' justify='end' align='middle'>
                    <el-pagination
                          @size-change="handleSizeChange"
                          @current-change="handleCurrentChange"
                          :current-page="curPage"
                          :page-sizes="[10, 20, 50, 100]"
                          :page-size="pageSize"
                          layout="sizes, prev, pager, next"
                          :total="total">
                        </el-pagination>
                </el-row>
            </div>
        </el-row>
    </div>
</template>

<style lang="scss">
    .manage-homework-view {
        .btn-add {
            color: #5fa137;
        }
        .data-container {
            background-color:#ffffff;
            margin:0 20px 20px 20px;
            border:1px solid #cecece;
            .list {
                .data-tab {
                    height:48px;

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
                            a {
                                color:#5fa137;
                                font-size:14px;
                            }
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
                .pager {
                    margin:30px 0;
                    padding-right:40px;

                    .el-pagination {
                        button {
                            &.disabled {
                                background-color:#f1f1f1;
                                border-color:#cecece;
                                color:#adadad;
                            }
                        }
                        .el-pager {
                            li {
                                &.active {
                                    background-color:#5fa137;
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    //添加框
    .add-homework-view {
        .tab-bar {
            margin:0 20px;
            background-color:#ffffff;
            .el-col {
                border-top:1px solid transparent;
                &.tab-item {
                    width:120px;
                    border-top-color: #cecece;
                }

                line-height:48px;
                border-bottom:1px solid #cecece;

                div {
                    height:48px;
                    border-left:1px solid #cecece;
                    cursor:pointer;
                }

                &.active {
                    color:#5fa137;
                    border-bottom-color:transparent;
                }
            }
        }
        .data-container {
            border-top:0;
            margin:0 20px 20px;
            padding:10px;
            background-color:#ffffff;
            .data-inputs {
                .input-rows {
                    margin-bottom:20px;
                    font-size:14px;
                    &.input-container {
                        margin-bottom:0;
                    }
                    .desc {

                        textarea {
                            width:380px;
                            height:56px;
                            resize:none;
                        }

                    }
                    .m-label {
                        font-size:14px;
                        color:#353535;
                        margin:0 20px;
                        &.gray {
                            color:#858585;
                        }
                    }

                }
                .btns {
                    margin:56px 0;
                    .el-button {
                        width:64px;

                        &:last-child {
                            width:140px;
                            background-color:#7cb853;
                            color:#ffffff;
                        }
                    }
                }
            }
        }
    }
</style>

<script>
    import Header from '../../components/Header'
    import UserList from '../../components/UserList'
    import api from '../../api/modules/config'
    import { update_task, add_task, get_task_by_id, get_task_category_list } from '../../api/modules/task'
    import { get_list } from '../../api/modules/curriculum'
    export default{
        data(){
            return{
                tabIndex:0,
                data:{
                    task_name:'',
                    task_category_id:1,
                    subject_id:1,
                    period_id:1,
                    task_require:'',
                    upload_type:[],
                    start_time:'',
                    upload_count:0,
                    interval_days:0,
                    auto:false,
                    is_auto:0,
                    auto_curriculum_id:87,
                    to_user_ids:[]
                },
                isEdit:false,
                categories:[],
                courses:[],
                student_search_date:'',
                pickerOptions:{
                    disabledDate(time) {
                        return time.getTime() < Date.now() - 8.64e7;
                    }
                },
                dialogVisible:false
            }
        },
        methods:{
            changeTab(index){
                this.tabIndex = index;
                this.$store.dispatch('get_task_list', {curPage: 1, pageSize: 10, is_auto:this.tabIndex});
            },
            handleSizeChange(val) {
                if (val !== this.pageSize) {
                    this.$store.dispatch('get_task_list', {curPage: this.curPage, pageSize: val, is_auto:this.tabIndex});
                }

            },
            handleCurrentChange(val) {
                if (val && val !== this.curPage) {
                    this.$store.dispatch('get_task_list', {curPage: val, pageSize: this.pageSize, is_auto:this.tabIndex});
                }
            },
            getData() {
                var page;
                var size;
                if (this.list.length === 0) {

                    page = 1;
                    size = 10;
                }
                else
                {
                    page = this.curPage;
                    size = this.pageSize;
                }
                this.$store.dispatch('get_task_list', {curPage: page, pageSize: size, is_auto:this.tabIndex});
            },
            addHomework(){
                this.data.task_name = '';
                this.data.subject_id = 1;
                this.data.period_id = 1;
                this.data.upload_type = [];
                this.data.task_require = '';
                this.data.is_auto = this.tabIndex;
                this.data.auto = this.data.is_auto === 0?false:true;
                this.data.auto_curriculum_id = 87;
                this.isEdit = false;
                this.dialogVisible = true;
            },
            editHomework(item) {
                get_task_by_id(item.task_id).then((res) =>
                {
                    if (res.data.res_code === 1) {
                        this.data = res.data.msg[0];
                        this.data.upload_type = JSON.parse(this.data.upload_type);
                        if (typeof this.data.upload_type == 'number') {
                            this.data.upload_type = [this.data.upload_type.toString()];
                        }
                        if (this.data.is_auto === 1) {
                            this.$set(this.data, 'auto', true);
                        }
                        else {
                            this.$set(this.data, 'auto', false);
                        }
                        this.isEdit = true;
                        this.dialogVisible = true;
                    }
                })
            },
            submit(){
                if(this.isEdit)
                {
                    update_task(this.data).then((res) => {
                    if(res.data.res_code === 1)
                    {
                        alert('保存任务成功！');
                        this.$router.push({name:'manage-homework'});
                    }
                    else
                    {
                        alert('保存任务失败，' + res.data.msg);
                    }
                    this.$store.dispatch('get_task_list',{curPage:1, pageSize:10, ia_auto:this.data.is_auto});
                });
                }
                else
                {
                    this.data.is_auto = this.data.auto?1:0;
                    add_task(this.data).then((res) => {
                    if(res.data.res_code === 1)
                    {
                        alert('保存任务成功！');
                        this.$router.push({name:'manage-homework'});
                    }
                    else
                    {
                        alert('保存任务失败，' + res.data.msg);
                    }
                    this.$store.dispatch('get_task_list',{curPage:1, pageSize:10, ia_auto:this.data.is_auto});
                });
                }
            },
            uploadTimeChange(val) {
                this.data.upload_count = val;
            },
            intervalChange(val) {
                this.data.interval_days = val
            },
            listChangeHandler(val) {
                this.data.to_user_ids = val;
            }
        },
        mounted() {
            this.getData();
            this.$store.dispatch('get_subject_list');
            if(this.periods.length === 0)
                this.$store.dispatch('get_period_list');
            if(this.$route.params.id)
            {
                get_task_by_id(this.$route.params.id).then((res) => {
                if(res.data.res_code === 1)
                {
                    this.data = res.data.msg[0];
                    this.data.upload_type = JSON.parse(this.data.upload_type);
                    if(typeof this.data.upload_type == 'number')
                    {
                        this.data.upload_type = [this.data.upload_type.toString()];
                    }
                    if(this.data.is_auto === 1)
                    {
                        this.$set(this.data,'auto',true);
                    }
                    else
                    {
                        this.$set(this.data,'auto',false);
                    }
                }
            });
            }

            get_task_category_list().then((res) => {
                if(res.data.res_code === 1)
                {
                    this.categories = res.data.msg;
                }
            });
            get_list(3, 0,0,0,999).then((res) => {
                if(res.data.res_code === 1)
                {
                    this.courses = res.data.msg;
                }
            });
        },
        computed:{
            subjects() {
                return this.$store.state.subject.subject_list;
            },
            periods() {
                return this.$store.state.period.period_list;
            },
            autoCompute(){
                return this.data.auto;
            },
            uploadCountCompute(){
                return this.data.upload_count;
            },
            list(){
                return this.$store.state.task.task_list;
            },
            pageSize(){
                return this.$store.state.task.pageSize;
            },
            curPage(){
                return this.$store.state.task.curPage;
            },
            total(){
                return this.$store.state.task.total;
            }
        },
        watch: {
            autoCompute(val){
                this.student_search_date = '';
                this.data.to_user_ids = [];
                this.data.auto_curriculum_id = 87;
            },
            uploadCountCompute(val) {
                if(val === 1)
                {
                    this.data.interval_days = 0;
                }
            }
        },
        components:{
            'header-component':Header,
            'user-list':UserList
        }
    }
</script>