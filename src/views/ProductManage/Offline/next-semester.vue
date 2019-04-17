<template>
    <div class='manage-offline-course'>
        <SeeModal :show="seeModal" :details="details" @close-modal="closeModal1" />
        <screen :btn-type="btnType" :types="6" :title="title" btnName="添加学期" @handleBack="handleBack" @handleClick="addOfflineSemesterHandler"/>
        <div class="offline-item" v-for="(t,i) in dataList" :key="i">
            <div class="offline-item-title offline-title">
                <p>{{t.title}}</p>
                <div class="offline-item-title-right"> 
                    <span>{{t.student_num}}人预约</span>
                    <span>开课日期: {{t.start_time}}</span>
                    <span>报名截止: {{t.register_end_time}}</span>
                </div>
            </div>
            <div class="offline-item-title offline-item-de">
                <p>{{t.description}}</p>
                <div class="offline-item-btn">
                    <Button class="item-btn" @click="see(i,t)" type="text">查看预约</Button>
                    <Button class="item-btn" @click="editOfflineSemester(i,t)" type="text">编辑</Button>
                    <Button class="item-btn" @click="copyItem(i,t)" type="text">复制</Button>
                    <Button class="item-btn" @click="sendOfflineCourseHandler(i,t)" type="text">发送</Button>
                    <Button class="item-btn" @click="deleteOfflineSemester(i,t)" type="text">删除</Button>
                </div>
            </div>
        </div>
        <Page :current="page_num" :total="page_conut" :page-size="pageSize" @on-change="pageList"></Page>
    </div>
</template>

<script>
    import SaveOrder from '../../../components/SaveOrder'
    import screen from '../../../components/ScreenFrame'
    import { Dialog } from '../../dialogs';
    import * as types from '../../dialogs/types';
    import { mapActions, mapState } from 'vuex'
    import { Config } from '../../../config/base'
    import postData from '../../../api/postData.js'
    import setAuthMixins from '../setAuthMixins'
    import SeeModal from "./see-modal.vue";
    export default {
        mixins: [Dialog, setAuthMixins],
        components: { 'save-order': SaveOrder, screen, SeeModal },
        data() {
            return {
                seeModal: false,
                dirty: false,
                isdelete: false,
                deleteData: null,
                courseNums: 12,
                showModal: false,
                detailData: {},
                subjectList: [],
                subject_id: JSON.parse(localStorage.getItem('OffLineClassTheme')).id,
                title: JSON.parse(localStorage.getItem('OffLineClassTheme')).title,
                theme: JSON.parse(localStorage.getItem('OffLineClassTheme')),
                current: 1,
                total: null,
                pageSize: 4,
                page_num: 1,
                details: {},
                term_row: null,
            }
        },
        computed: {
            ...mapState({
                offline_curriculum_detail1: state => state.offline_curriculum.offline_curriculum_detail,
                page_conut: state => state.offline_curriculum.page_conut,
            }),
            dataList() {
                return this.$store.state.offline_curriculum.offline_term_list;
            },
        },
        methods: {
            ...mapActions([ 'delete_offline_term', 'get_offline_curriculum_detail']),
            handleBack() {
                this.$router.replace({name: 'open-product'})
            },
            closeModal1(){
                this.seeModal = false
            },
            see(index, row){
                console.log(row,'dd');
                this.details = row
                this.seeModal = true
            },
            //复制
            copyItem(index, row){
                this.$Modal.confirm({
                    title: '提示',
                    content: '确定你要复制该学期？',
                    onOk: () => {
                        postData('product/curriculum_offline_term/copyTerm',{term_id: row.id}).then((res) => {
                            if(res.res_code === 1){
                                this.getList()
                                this.$Message.success(res.msg);
                            }
                        })
                    },
                    onCancel: () => {}
                });
            },
            sendOfflineCourseHandler(index, row) {
                this.handleSelModal(types.SEND_OFFLINE_COURSE, {row: row});
            },
            editOfflineSemester(index, row) {
                postData('product/curriculum_offline_term/getTermAndCurriculums', {term_id: row.id}).then((res) => {
                    if(res.res_code == 1){
                    let d = res.data
                    this.handleSelModal(types.ADD_OFFLINE_SEMESTER, { type: 2, row: d,page_size: this.pageSize,
                    page_num: this.page_num, offlineCurriculums: d.offlineCurriculums})
                    }
                })
            },
            addOfflineSemesterHandler() {
                this.handleSelModal(types.ADD_OFFLINE_SEMESTER, { type: 1, page_size: this.pageSize,
                page_num: this.page_num, offlineCurriculums: this.subjectList})
            },
            deleteOfflineSemester(index, row) {
                var vm = this;
                if (row.can_delete == 0) {
                    this.$Modal.info({ title: '提示', content: '<p>无法删除该学期!</p >' });
                } else {
                    this.$Modal.confirm({
                        title: '提示',
                        content: '<p>确定您要删除该学期?</p >',
                        onOk: () => {
                            vm.delete_offline_term({ index, row });
                        },
                    });
                }
            },
            setData(){
                return {
                    subject_id: JSON.parse(localStorage.getItem('OffLineClassTheme')).id,
                    page_size: this.pageSize,
                    page_num: this.page_num,
                }
            },
            rowExpandHandler(row) {
                this.$store.dispatch('get_offline_curriculum_list', { page_size: this.pageSize,
                    page_num: this.page_num,term_underline_id: row.id})
            },
            manageSignupHandler(index, row) {
                this.$router.replace({ name: 'offline-course-manage-signup', params: { id: row.id } })
            },
            pageList(val){
                this.page_num = val;
                this.getList()
            },
            getList(){
                this.$store.dispatch('get_offline_term_list', this.setData());
            },
            getSubjectCurriculumList(){
                postData('product/curriculum_offline/getSubjectCurriculumList',{subject_id: this.theme.id}).then((res) => {
                    if(res.res_code==1) this.subjectList = res.data
                    if(this.subjectList.length>0){
                        this.subjectList.map((t) => {
                            t.class_start_time = null
                            t.class_address = null
                        })
                    }
                })
            },
        },
        mounted() {
            this.getSubjectCurriculumList()
            this.getList()
        }
    }
</script>
<style scoped lang="less">
    .manage-offline-course{
        position: relative;
        height: 100%;
        /deep/ .ivu-page{
            position: absolute;
            right: 0;
            left: 0;
            bottom: 0;
            margin: 0 auto;
        }
    }
    /deep/.ivu-btn-text{
        font-family: PingFangSC-Medium;
        font-size: 16px;
        color: #4098FF;
        letter-spacing: 0;
    }
    /deep/.prop_key_0>.ivu-table-cell>span{
        display: none
    }
    .pos{
        position: absolute;
        right: 0; 
    }
    .offline-item{
        margin: 40px;
        padding: 30px 40px;
        border: 1px solid #ddd;
        display: flex;
        flex-direction: column;
        .offline-item-title{
            display: flex;
            position: relative;
            .offline-item-title-right{
                .pos;
                span{
                    margin-left: 20px;
                }
            }
        }
        .offline-title{
            font-family: PingFangSC-Medium;
            font-size: 18px;
        }
        .offline-item-de{
            margin-top: 20px;
            height: 40px;
            align-items: center;
            .offline-item-btn{
               .pos;
               /deep/.item-btn{
                   padding: 0;
                   margin-left: 20px;
               }
            }
        }
    }
</style>
