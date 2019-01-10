<template>
    <div class='add-homework-view'>
        <header-component title='设置任务包'></header-component>
        <el-breadcrumb separator="/">
          <el-breadcrumb-item>任务管理</el-breadcrumb-item>
          <el-breadcrumb-item>设置任务包</el-breadcrumb-item>
            <el-breadcrumb-item>{{data.auto?'线上作业':'线下任务'}}</el-breadcrumb-item>
        </el-breadcrumb>
        <Row class='tab-bar' type='flex' align='middle'>
            <Col class='tab-item' :class="{'active':!data.auto}" v-if='!isEdit || (isEdit && !data.auto)'>
                <div @click='data.auto = false'>
                    线下任务
                </div>
            </Col>
            <Col class='tab-item' :class="{'active':data.auto}" v-if='!isEdit || (isEdit && data.auto)'>
                <div @click='data.auto = true'>
                    线上作业
                </div>
            </Col>
            <Col>
                <div></div>
            </Col>
        </Row>
        <Row type='flex' justify='center' class='data-container'>
            <div class='data-inputs'>
                <Row class='input-rows' type='flex' justify='left' align='middle'>
                    <span class='m-label'>{{data.auto?'作业':'任务'}}名称</span>
                    <el-input placeholder='请输入任务名称' v-model='data.task_name'></el-input>
                </Row>
                <Row class='input-rows' type='flex' justify='left' align='middle'>
                    <span class='m-label'>{{data.auto?'作业':'任务'}}分类</span>
                    <el-select v-model="data.task_category_id" placeholder="请选择分类">
                        <el-option
                          v-for="item in categories" :key="item.id"
                          :label="item.name"
                          :value="item.id">
                        </el-option>
                      </el-select>
                </Row>
                <Row class='input-rows' type='flex' justify='left' align='middle'>
                    <span class='m-label'>所属学科</span>
                    <el-select v-model="data.subject_id" placeholder="请选择学科">
                        <el-option
                          v-for="item in subjects" :key="item.id"
                          :label="item.name"
                          :value="item.id">
                        </el-option>
                      </el-select>
                </Row>
                <Row class='input-rows' type='flex' justify='left' align='middle'>
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
                </Row>
                <Row class='input-rows' type='flex' justify='left' align='middle'>
                    <span class='m-label'>{{data.auto?'作业':'任务'}}要求</span>
                    <el-input
                      class='desc'
                      type="textarea"
                      :autosize="{ minRows: 2, maxRows: 4}"
                      placeholder="请输入具体要求"
                      v-model="data.task_require"></el-input>
                </Row>
                <!--<Row class='input-rows' type='flex' justify='left' align='middle' v-if='!isEdit'>-->
                    <!--<span class='m-label'>自动触发</span>-->
                    <!--<el-switch-->
                      <!--v-model="data.auto"-->
                      <!--off-color='#cecece'-->
                      <!--on-color="#69BA6D">-->
                    <!--</el-switch>-->
                <!--</Row>-->
                <Row class='input-rows' type='flex' justify='left' align='middle' v-if='data.auto && !isEdit'>
                    <span class='m-label'>完成课程</span>
                    <el-select v-model="data.auto_curriculum_id" placeholder="请选择课程">
                        <el-option
                          v-for="item in courses" :key="item.id"
                          :label="item.title"
                          :value="item.curriculum_id">
                        </el-option>
                      </el-select>
                </Row>
                <Row class='input-rows' type='flex' justify='left' align='middle' v-if='!isEdit'>
                    <span class='m-label'>上传次数</span>
                    <el-input-number v-model="data.upload_count" :min='1'></el-input-number>
                </Row>
                <Row class='input-rows' type='flex' justify='left' align='middle' v-if='!isEdit'>
                    <span class='m-label'>间隔天数</span>
                    <el-input-number v-model="data.interval_days" :disabled='data.upload_count == 1'></el-input-number>
                    <span v-if='data.upload_count == 1'>上传次数为1时，间隔天数只能为0</span>
                </Row>
                <Row class='input-rows' type='flex' justify='left' align='middle' v-if='!data.auto && !isEdit'>
                    <span class='m-label'>开始时间</span>
                    <el-date-picker
                          v-model="data.start_time"
                          type="date"
                          placeholder="选择日期"
                          :picker-options="pickerOptions">
                    </el-date-picker>
                </Row>
                <Row class='input-rows' type='flex' justify='left' align='middle' v-if='!data.auto && !isEdit'>
                    <span class='m-label'>选择学员</span>
                    <el-date-picker
                          v-model="student_search_date"
                          type="daterange"
                          placeholder="选择学员入学时间"
                          style="width: 220px">
                        </el-date-picker>
                    <span class='m-label gray' v-if='student_search_date'>已选{{data.to_user_ids.length}}学员</span>
                </Row>
                <Row class='input-rows' type='flex' justify='right' align='middle' v-show='!data.auto && student_search_date && !isEdit'>
                    <user-list v-on:listChange='listChangeHandler' :searchRange='student_search_date'></user-list>
                </Row>
                <Row class='btns' type='flex' justify='center' align='middle'>
                    <el-button @click='submit'>提交</el-button>
                </Row>
            </div>
        </Row>
    </div>
</template>

<style lang="scss">
    .add-homework-view {
        .tab-bar {
            margin:0 20px;
            background-color:#ffffff;
            .Col {

                &.tab-item {
                    width:120px;
                    border-top:1px solid #cecece;
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
    import NumberInout from '../../components/NumberInput'
    import UserList from '../../components/UserList'
    import api from '../../api/modules/config'
    import { update_task, add_task, get_task_by_id, get_task_category_list } from '../../api/modules/task'
    import { get_list } from '../../api/modules/curriculum'

    export default{
        data(){
            return{
                data:{
                    task_name:'',
                    task_category_id:1,
                    subject_id:1,
                    task_require:'',
                    upload_type:[],
                    start_time:'',
                    upload_count:0,
                    interval_days:0,
                    auto:false,
                    is_auto:0,
                    auto_curriculum_id:0,
                    to_user_ids:[]
                },
                categories:[],
                courses:[],
                student_search_date:'',
                pickerOptions:{
                  disabledDate(time) {
                    return time.getTime() < Date.now() - 8.64e7;
                  }
                }
            }
        },
        components:{
            'header-component':Header,
            'number-input':NumberInout,
            'user-list':UserList
        },
        methods:{
            submit(){
                if(this.isEdit)
                {
                    update_task(data).then((res) => {
                        if(res.data.res_code === 1)
                        {
                            alert('保存任务成功！');
                            this.$router.push({name:'manage-homework'});
                        }
                        else
                        {
                            alert('保存任务失败，' + res.data.msg);
                        }
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
        computed:{
            subjects() {
                return this.$store.state.subject.subject_list;
            },
            autoCompute(){
                return this.data.auto;
            },
            uploadCountCompute(){
                return this.data.upload_count;
            },
            isEdit(){
                if(this.$route.params.id)
                {
                    return true;
                }
                return false;
            }
        },
        watch: {
            autoCompute(val){
                this.student_search_date = '';
                this.data.to_user_ids = [];
                this.data.auto_curriculum_id = 0;
            },
            uploadCountCompute(val) {
                if(val === 1)
                {
                    this.data.interval_days = 0;
                }
            }
        },
        mounted () {
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
            get_list(3, 0, 0, 0, 999).then((res) => {
              if(res.data.res_code === 1)
              {
                  this.courses = res.data.msg;
              }
          });
            this.$store.dispatch('get_subject_list');
        },
    }
</script>