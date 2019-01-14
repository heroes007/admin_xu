<template>
    <div class='manage-offline-course-signup-view'>
        <Row class='header' type='flex' align='middle' justify='space-between'>
            <div>
                <span class='title'>{{termData.name}}</span>
                <span><i class='xght-webfont-user'></i>共{{total}}人参加</span>
            </div>
            <div>
                <Button type='text' @click='backClickHandler'>返回</Button>
            </div>
        </Row>
        <Row>
            <Form :inline="true" :model="formInline" class="find-by-term">
                <FormItem label="截止日期" label-width="102px">
                    <el-date-picker
      v-model="deadline"
      type="date"
      placeholder="选择日期"
      :picker-options="pickerOptions"
      ref='date_picker'
      @change='changeDeadlineHandler'>
    </el-date-picker>
               </FormItem>
                <FormItem>
                    <Row>
                        <Col :span="10">
                            <Select class="select-user" v-model="formInline.classify" placeholder="">
                                <Option label="手机号" value="phone"></Option>
                                <Option label="姓名" value="name"></Option>
                            </Select>
                        </Col>
                        <Col :span="14">
                            <Input v-model="formInline.classifyValue" placeholder="请输入搜索内容"></Input>
                        </Col>
                    </Row>
               </FormItem>
                <FormItem>
                    <Button type="primary" @click="onSubmit">查询</Button>
               </FormItem>
                <FormItem>
                    <Button type="primary" @click="onClear">清除</Button>
               </FormItem>
            </Form>
        </Row>
        <data-list class='data-list light-header' :table-data='dataList' :header-data='dataHeader' :column-formatter='listColumnFormatter'
            :column-formatter-data='listColumnFormatterData' @edit='editHandler'></data-list>
    </div>
</template>



<script>
    import BaseList from '../../components/BaseList'
    import BackToTop from '../../components/BackToTop'
    import api from '../../api/modules/config'
    import {
    mapActions,
    mapState
} from 'vuex'
    import {
        Loading
    } from 'element-ui'
    import {
        Dialog
    } from '../dialogs'
    import {
        EDIT_OFFLINE_SIGNUP
    } from '../dialogs/types'
    import {
        doTimeFormat
    } from '../../components/Util'
    import {
        Config
    } from '../../config/base'

    export default {
        mixins: [Dialog],
        data() {
            return {
                loadingInstance: null,
                searchData: '',
                searchType: 'phone',
                initData: false,
                dialogVisible: false,
                formInline: {
                    classify: 'phone',
                    classifyValue: '',
                    signupDeadline:null
                },
            }
        },

        methods: {
            ...mapActions([
            'edit_offline_term',
            'get_offline_course_receipt_list',
            'get_city_list'
        ]),
            onSubmit() {
                var formData = {
              offline_term_id:this.$route.params.id
          }
          formData[this.formInline.classify] = this.formInline.classifyValue;
                this.get_offline_course_receipt_list(formData)
            },
            onClear() {
                this.get_offline_course_receipt_list({ offline_term_id: this.$route.params.id })
            },
            queryTaskHandler(index, row) {
                this.handleSelModal(QUERY_STUDENT_TASK, row)
            },
            editHandler(index, row) {
                this.handleSelModal(EDIT_OFFLINE_SIGNUP, row)
            },
            backClickHandler() {
                this.$router.replace({ name: 'offline-course' });
            },
            changeDeadlineHandler(){
            }
        },
        mounted() {
            this.get_city_list();
            this.get_offline_course_receipt_list({ offline_term_id: this.$route.params.id })
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
             ...mapState({
            total: state => state.offline_curriculum.receipt_total,
            isLoading: state => state.offline_curriculum.showLoading || state.city.is_loading_list,
            dataList: state => state.offline_curriculum.receipt_list,
            sexList: state => state.auth.sex_list,
            cityList: state => state.city.city_list
        }),
            dataHeader() {
                return [
                    {
                        label: '序号',
                        width: 90,
                        sort: true
                    }, {
                        prop: 'name',
                        label: '姓名',
                        width: 100
                    }, {
                        prop: 'sex',
                        label: '性别',
                        width: 80
                    }, {
                        prop: 'idcard',
                        label: '身份证号',
                        width: 130
                    }, {
                        prop: 'phone',
                        label: '联系电话',
                        width: 150
                    }, {
                        prop: 'email',
                        label: 'E-mail'
                    }, {
                        prop: 'estimate_set_out_province_id',
                        label: '预计出发省',
                        width: 140,
                        useFilter: true
                    }, {
                        prop: 'estimate_set_out_city_id',
                        label: '预计出发城市',
                        width: 140
                    }, {
                        prop: 'estimate_set_out_time',
                        label: '预计出发时间',
                        width: 120,
                        useSort: true
                    }, {
                        label: '操作',
                        width:120,
                        groupBtn: [{
                            text: '修改',
                            param: 'edit'
                        }]
                    }]
            },
            listColumnFormatter() {
                return [{
                    columnName: 'estimate_set_out_time',
                    doFormat: doTimeFormat
                }, {
                    columnName: 'sex',
                    dataIndex: 0,
                    dataProp: 'id',
                    dataValue: 'name'
                }, {
                    columnName: 'estimate_set_out_city_id',
                    dataIndex: 2,
                    dataProp: 'id',
                    dataValue: 'name'
                }, {
                    columnName: 'estimate_set_out_province_id',
                    dataIndex: 1,
                    dataProp: 'id',
                    dataValue: 'name'
                }]
            },
            listColumnFormatterData() {
                return [this.sexList, this.privinceList, this.cityList];
            },
            privinceList() {
                var provinceList = [];
                for (var i = 0; i < this.cityList.length; i++) {
                    if (this.cityList[i].parent_id === 0) {
                        provinceList.push(this.cityList[i]);
                    }
                }
                return provinceList;
            },
            termData() {
                for (var i = 0; i < this.$store.state.offline_curriculum.offline_term_list.length; i++) {
                    if (this.$store.state.offline_curriculum.offline_term_list[i].id == this.$route.params.id) {

                        return this.$store.state.offline_curriculum.offline_term_list[i];
                    }
                }
                return { name: '', ex_time:null};
            },
            deadline:{
                get:function(){
                    return this.termData.ex_time;
                },
                set:function(v){
                    this.formInline.signupDeadline = v;
                    if(new Date(this.termData.start_time).getTime() - this.formInline.signupDeadline.getTime() < (14 * 24 * 60 * 60 * 1000))
                    {
                        this.$confirm('截止日期距开课日期小于14天，是否继续？', '提示', {
                    type: 'warning'
                }).then(() => {
                    this.edit_offline_term({ offline_term_id: this.$route.params.id, ex_time:this.formInline.signupDeadline });
                }).catch(() => {});
                    }
                    else {
                        this.edit_offline_term({ offline_term_id: this.$route.params.id, ex_time:this.formInline.signupDeadline });
                    }
                }
            },
        pickerOptions(){
            var vm = this;
            if(this.termData.start_time)
            {
                return {
                    disabledDate(time) {
                        return time.getTime() >= new Date(vm.termData.start_time).getTime();
                    }
                }
            }
            return {

            }
        }
        },
        components: {
            'data-list': BaseList,
            'back-to-top': BackToTop
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
    
    .el-table-filter {
        height: 100vh;
        overflow-y: auto;
    }
    
    .manage-offline-course-signup-view {
        .base-list-container {
            .base-list-row {
                .cell {
                    .el-button {
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
            .select-user {
                .el-input__inner {
                    border-right: 0;
                }
            }
            .el-input__inner {
                border-radius: 0;
                background: #FFFFFF;
                border: 1px solid #E5E5E5;
            }
            .el-form-item__label {
                font-size: 16px;
                color: #141111;
                letter-spacing: 0;
            }
            .el-form-item__content {}
            button {
                background: #FB843E;
                border: 1px solid #F06B1D;
                border-radius: 4px;
                width: 100px;
                height: 36px;
            }
            .btn-edit-deadline {
                background-color: transparent;
                color: #FB843E;
                width: 43px;
                padding: 0;
            }
            .el-date-editor {
                // display: none;
                &.el-input {
                    // width: 20px;
.el-input__inner {
                    // display: none;
                }

                i {
                    display: none;
                }
                }
            }
        }
        .header {
            height: 60px;
            background-color: #333333;
            font-size: 16px;
            color: #FFFFFF;
            letter-spacing: 0;
            div {
                text-align: left;
                padding: 0 40px;
                &:last-child {
                    text-align: right;
                }
                .title {
                    border-right: 1px solid rgba(255,255,255,0.5);
                    padding-right: 20px;
                    margin-right: 20px;
                }
                .el-button {
                    color: #ffffff;
                    font-size: 16px;
                }
            }
        }
    }
</style>