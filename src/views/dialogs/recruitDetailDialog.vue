<template>
<Modal :transfer=false title="报名详情" width="700px" :footer-hide="true" :mask-closable="false" v-model="recruitDetailDialog" @on-cancel="handleRemoveModal(remove)" >
    <base-input @closedialog="handleClose">
        <Row slot="body">
            <Row class="body-top">
                <Form ref="form" :model="form" :label-width="100" class="add-teacher-form">
                    <FormItem label="ID">
                         <Input v-model="form.user_id" disabled></Input>
                   </FormItem>
                    <FormItem label="姓名">
                         <Input v-model="form.realname" placeholder="请输入考生真实姓名"></Input>
                   </FormItem>
                    <FormItem label="电话">
                         <Input v-model="form.phone" placeholder="请输入考生电话"></Input>
                   </FormItem>
                    <FormItem label="选择学段">
                        <Select v-model="form.grade_id" placeholder="请选择学段">
                            <Option v-for="item in gradeList" :key="item.id" :label="item.name" :value="item.id"></Option>
                        </Select>
                   </FormItem>
                    <FormItem label="选择学科" >
                        <Select v-model="form.subject_id" placeholder="请选择学科">
                            <Option v-for="item in subjectList" :key="item.id" :label="item.name" :value="item.id"></Option>
                        </Select>
                   </FormItem>
                    <!--<FormItem label="笔试成绩">
                         <Select v-model="form.written_result" placeholder="请选择学段">
                            <Option v-for="item in written_results" :key="item.id" :label="item.name" :value="item.id"></Option>
                        </Select>
                   </FormItem>-->
                    <FormItem label="笔试成绩">
                         <Input v-model="form.written_result" placeholder="请输入考生笔试成绩"></Input>
                   </FormItem>
                    <FormItem label="出生年月">
                        <DatePicker v-model="form.birth" type="date" placeholder="选择日期">
                        </DatePicker>
                   </FormItem>
                    <FormItem label="邮箱">
                         <Input v-model="form.email" placeholder="请输入考生邮箱"></Input>
                   </FormItem>
                    <FormItem label="所在院校">
                         <Input v-model="form.school" placeholder="请输入考生所在院校"></Input>
                   </FormItem>
                    <FormItem label="所学专业">
                         <Input v-model="form.school_subject" placeholder="请输入考生所学专业"></Input>
                   </FormItem>
                     <FormItem label="在读年级">
                         <Input v-model="form.school_grade" placeholder="请输入考生在读年级"></Input>
                   </FormItem>
                     <FormItem label="期望就业城市" >
                         <Input v-model="form.ex_citys" placeholder="请输入考生期望就业城市"></Input>
                   </FormItem>
                    <FormItem v-if="form.certificate" label="验证图片">
                         <img class="certificateImg" :src="form.certificate"/>
                   </FormItem>
                    <!--<FormItem class="btn-content">
                        <Button type="primary" class="sub-btn" @click="saveHandler" :v-if='false'>保存</Button>
                   </FormItem>-->
                </Form>
            </Row>
        </Row>
    </base-input>
</Modal>
</template>

<script>
import BaseInput from '../../components/BaseInput'
import BaseList from '../../components/BaseList'
import { RemoveModal } from './mixins'
import UploadPanel from '../../components/UploadPanel'
import { get_signup_info } from '../../api/modules/exam'
import { Loading } from 'element-ui'
import { Config } from '../../config/base'
import { mapState } from 'vuex'
export default {
    mixins: [RemoveModal],
    props: {
        remove: {
            type: String
        },
        payload: {}
    },
    components: {
        'base-input': BaseInput,
        'data-list': BaseList
    },
    data() {
        return {
            recruitDetailDialog: true,
            form: {
                user_id:0,
                realname:'',
                phone:'',
                grade_id:0,
                subject_id:0,
                written_result:0,
                birth:null,
                email:'',
                school:'',
                school_subject:'',
                school_grade:'',
                ex_citys:'',
                certificate:'',
                _fn: null
            },
            searchType:'phone',
            searchData:'',
            userList:[],
            loadingInstance: null,
            isSend: false
        }
    },
    computed: {
        ...mapState({
            subjectList:state => state.subject.subject_list,
            gradeList:state => state.grade.grade_list,
            written_results:state => state.recruit.result_list
        })
    },
    methods: {
        saveHandler() {
            if (this.payload.sid) {
                this.$store.dispatch('edit_student', this.form);
            } else {
                var formInline = this.form;
                this.$store.dispatch('add_student', formInline);
                formInline.callback = () => {
                  this.handleClose();
                  setTimeout(()=>{
                     this.$Modal.info({
                        title: '提示',
                        content: '成功创建学员!'
                     });
                  }, 800)
                }
            }
        },
        handleClose() {
            this.recruitDetailDialog = false;
        }
    },
    mounted() {
        this.$store.dispatch('get_grade_list');
        this.$store.dispatch('get_subject_list');
        var vm = this;
        this.form._fn = function() {
            vm.handleClose();
        };
        this.loadingInstance = this.$LoadingY({message: "加载中，请稍后",show: true})
        setTimeout(() => {
            this.loadingInstance.close();
        }, Config.base_timeout);
        get_signup_info(this.payload).then(res => {
            if (res.data.res_code === 1) {
                this.form = res.data.msg;
                this.form._fn = function() {
                    vm.handleClose();
                };
                if(this.loadingInstance) this.loadingInstance.close();
            }
        })
    }
}
</script>
<style lang="scss" scoped>
    /deep/ .ivu-modal-body{ width: 80%; margin-left: 10%; }
    .certificateImg { width: 100% }
</style>
