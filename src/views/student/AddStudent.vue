<template>
    <div class='add-student-view'>
        <header-component title='添加学员'></header-component>
        <Row class='img' type='flex' justify='center' align='middle'>
            <img src='../../assets/img/pic-search.png'>
        </Row>
        <Row class='title' type='flex' justify='center' align='middle'>
            <h1>添加学员</h1>
        </Row>
        <Row class='search-bar' type='flex' justify='center' align='middle'>
            <Input placeholder="请输入用户名" v-model="searchData">
                <Select v-model="searchType" slot="prepend" placeholder="请选择">
                    <Option label="用户名" value="nickname"></Option>
                    <Option label="手机号" value="phone"></Option>
                </Select>
                <Button slot="append" type='text' @click='searchStudent'>搜索</Button>
            </Input>
        </Row>
        <Row class='result' type='flex' justify='center' align='middle' v-if='initData'>
            <Row type='flex' justify='center' align='middle' v-if='isLoading'>
                <i class='el-icon-loading'></i>
            </Row>
            <div class='data-form' v-if='!isLoading'>
                <Row class='user-info' type='flex' justify='start' align='middle' v-if='searchResult'>
                    搜索结果：ID:<span>{{searchResult.user_id}}</span>用户名:<span>{{searchResult.nickname}}</span>注册手机:<span>{{searchResult.phone}}</span>
                </Row>
                <Row class='user-info' type='flex' justify='start' align='middle' v-if='!searchResult'>
                    搜索结果：<span>{{resultMsg}}</span>
                </Row>
                <Row class='user-data' type='flex' justify='start' align='middle' v-if='searchResult'>
                    学员真实姓名：
                    <Input placeholder='请输入内容' v-model='user.realname'></Input>
                </Row>
                <Row class='user-data' type='flex' justify='start' align='middle' v-if='searchResult'>
                    入学时间：
                    <el-date-picker
                            v-model="user.start_school_time"
                            type="date"
                            placeholder="选择日期">
                    </el-date-picker>
                </Row>
                <Row class='user-data' type='flex' justify='start' align='middle' v-if='searchResult'>
                    报名期数：
                    <el-input-number v-model="user.times"></el-input-number>
                </Row>
                <Row class='user-data' type='flex' justify='start' align='middle' v-if='searchResult'>
                    所属学科：
                    <Select v-model="user.subject_id" placeholder="请选择学科">
                        <Option
                                v-for="item in subjects" :key="item.id"
                                :label="item.name"
                                :value="item.id">
                        </Option>
                    </Select>
                </Row>
                <Row class='user-data desc' type='flex' justify='start' align='middle' v-if='searchResult'>
                    学员备注：
                    <Input placeholder='请输入内容' v-model='user.more'></Input>
                </Row>
                <Row class='user-data' type='flex' justify='start' align='middle' v-if='searchResult'>
                    学员类型：
                    <Select v-model="user.type" placeholder="请选择学员类型">
                        <Option label="普通" value="1"> </Option>
                        <Option label="协议" value="2"> </Option>
                        <Option label="个人" value="3"> </Option>
                    </Select>
                </Row>
                <Row class='user-data' type='flex' justify='center' align='middle' v-if='searchResult'>
                    <Button @click='setStudent'>确认</Button>
                </Row>
            </div>
        </Row>
    </div>
</template>

<style lang="scss">
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
                        color:#ffffff;
                    }
                }
            }
        }
        .result {
            margin:15px 0 76px;
            .data-form {
                width:550px;
                background-color: #ffffff;
                border: 1px solid #EBEBEC;
                border-radius: 6px;
                padding: 20px 0;
                .user-info {
                    font-size: 14px;
                    margin-bottom:24px;
                    border-bottom: 1px solid #EBEBEC;
                    padding:0 20px;
                    span {
                        color:#7ab854;
                        margin-right:15px;
                    }
                }
                .user-data {
                    font-size: 14px;
                    margin-bottom:15px;
                    padding:0 20px;

                    .el-button {
                        width: 140px;
                        height: 36px;
                        background-color: #7ab854;
                        color:#ffffff;
                    }

                    &.desc {
                        width: 100%;
                        .el-input {
                            width:330px;
                        }
                    }
                }
            }
        }
    }
</style>

<script>
    import Header from '../../components/Header'
    import api from '../../api/modules/config'
    import { set_user_student_mrzx } from '../../api/modules/student'

    export default{
        data(){
            return {
                user: {
                    user_id: 0,
                    realname:'',
                    subject_id:0,
                    start_school_time:'',
                    times:0,
                    more:'',
                    type:1
                },
                searchData:'',
                searchType:'phone',
                initData:false
            }
        },
        methods:{
          searchStudent(){
              if(!this.initData)
                this.initData = true;
              this.$store.dispatch('search_userinfo_by_nickname_or_phone',{searchType:this.searchType,searchData:this.searchData});
          },
          setStudent() {
              this.user.user_id = this.searchResult.user_id;
              set_user_student_mrzx(this.user).then((res) => {
                  if(res.data.res_code === 1)
                  {
                      alert('保存成功！');
                      this.$store.dispatch('get_student_list',{curPage:1,pageSize:10});
                  }
                  else
                  {
                      alert('保存失败，' + res.data.msg);
                  }
              });
          }
        },
        computed:{
            subjects() {
                return this.$store.state.subject.subject_list;
            },
            isLoading() {
                return this.$store.state.student.isLoading;
            },
            searchResult(){
                return this.$store.state.student.search_result;
            },
            resultMsg(){
                return this.$store.state.student.search_msg;
            }
        },
        mounted(){
            this.$store.dispatch('get_subject_list');
        },
        components: {
            'header-component': Header
        }
    }
</script>