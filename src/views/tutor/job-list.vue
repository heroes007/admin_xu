<template>
    <div>
        <tutor-modal :details="details" :type="types" @preservation-success="preservationSuccess" :student-info="studentList" :show="show" @close-modal="closeModal" :title="modalTitle"/>
        <screen :types="13" :selectType2="true" :select4="selectList" :title="title" @handleBack="handleBack"/>
        <div class="state">
            <Select v-model="stateValue" class="state-select" @on-change="selectChange">
                <Option v-for="item in stateSelect" :key="item.id" :value="item.id">{{item.title}}</Option>
            </Select>
            <div class="state-btn" @click="checkTitle">
                <img class="state-img" :src="checkImg" alt="">
                <div class="state-check font-regular6">查看题目</div>
            </div>
            <div class="state-data">
                <div v-for="(item, index) in numList" :key="index" class="state-data-box">
                    <div>
                        <span class="state-data-box-num font-regular1">{{item.num}}</span>
                        <span class="state-data-box-unit">{{item.unit}}</span>
                    </div>
                    <div class="state-data-box-title">{{item.title}}</div>
                </div>
            </div>
        </div>
        <div class="batch">
            <div class="batch-title">选项</div>
            <Button class="batch-download" type="primary" ghost @click="downloadAttachments">下载附件</Button>
            <Button class="batch-read" type="primary" @click="Marking" ghost>批阅</Button>
        </div>
        <tables :tabel-height="tableHeight" :column="column" :table-data="list" @operation1="see" @select-tables="selectTables" @on-select-all="selectTablesAll"/>
        <page-list  :current="current" :total="total" :page-size="pageSize" @page-list="pageList"/>
    </div>
</template>

<script>
    import tables from '../../components/tables'
    import screen from '../../components/ScreenFrame'
    import checkImg from '../../assets/img/check.jpg'
    import pageList from '../../components/Page'
    import pageMixins from '../mixins/pageMixins'
    import postData from '../../api/postData'
    import tutorModal from './modal/tutor-modal'
    export default {
        components: {tables, screen, pageList, tutorModal},
        mixins: [pageMixins],
        data() {
            return {
                column: [
                    {title: '选项', type: 'selection', width: 100 },
                    {title: '姓名', key: 'realname', minWidth: 100 },
                    {title: '作业附件', slot: 'accessory', minWidth: 200, align: 'left' },
                    {title: '提交日期', key: 'submit_time', minWidth: 180, align: 'left'},
                    {title: '批阅', key: 'state', slot: 'state-item', stateKey: 'mark_state', minWidth: 100},
                    {
                        title: '评分', key: '', minWidth: 100,
                        render: (h, params) => {
                            return h('span', params.row.score + '分')
                        }
                    },
                    {
                        title: '操作',
                        minWidth: 100,
                        slot: 'operation',
                        align: 'left',
                        operation: [['查看','operation1']],
                    }
                ],
                list: [],
                details: null,
                selectList: [
                    {id: 1, title: '作业'},
                    // {id: 2, title: '问答'},
                    // {id: 3, title: '课程'},
                ],
                title: '课程名称癌症病人的心理护理与症状干预',
                stateValue: null,
                stateSelect: [
                    {id: 'all', title: '全部'},
                    {id: 2, title: '未批阅'},
                    {id: 0, title: '未通过'},
                ],
                numList: [
                    {num: null, unit: '人', title: '交作业'},
                    {num: null, unit: '人', title: '未批阅'},
                    {num: null, unit: '人', title: '未通过'},
                    {num: null, unit: '人', title: '已通过'},
                    {num: null, unit: '次', title: '复审'},
                ],
                tableHeight: null,
                mark_state: '',
                show: false,
                modalTitle: '',
                selectionList: [],
                types: '',
                studentList: [],
                arrList: [],
                checkImg,
            }
        },
        methods: {
            setShowModal(text,details,type){
                this.show = true
                this.modalTitle = text
                this.details = details
                this.types = type
            },
            see(val) {
                postData('product/homework/mark_get_list', {student_homework_id: val.id}).then((res) => {
                    if(res.res_code == 1){
                        let d = res.data.select_result
                        if(d.length>0){
                            d.map((t) => { t.title = res.data.homework_detail[0].title })
                        }
                        this.setShowModal('查看作业', d, 'seeTask')
                        this.studentList = res.data.student_detail
                    }
                })
            },
            selectTables(selection, row) {
                this.selectionList = selection
            },
            checkTitle() {
                postData('product/homework/get_detail', {item_id: this.$route.query.id, curriculum_type: this.$route.query.curriculum_type}).then(res => {
                    let val = res.data
                    this.setShowModal('查看题目', val, 'subject')
                })
            },
            selectTablesAll(selection, row) {
                this.selectionList = selection
            },
            handleBack() {
                this.$router.go(-1)
            },
            Marking(){
                let len = this.selectionList.length
                if(len > 0) {
                    let str = ''
                    this.selectionList.map((t) => {
                        str += t.mark_state
                    })
                    if(str.includes('0')||str.includes('1'))  this.$Message.warning('已批阅的作业不能再批阅')
                    else this.setShowModal(`批阅作业（${len}人）`, this.selectionList, 'batch')
                }
                else  this.$Message.warning('请选择学员');
            },
            getList() {
                let data = {
                    page_size: this.pageSize,
                    page_num: this.current,
                    curr_term_id: +this.$route.query.id,
                    curriculum_type: this.$route.query.curriculum_type,
                    mark_state: this.mark_state
                }
                postData('/tutor/getHomeworkByCurr', data).then(res => {
                    if(res.res_code == 1){
                    res.data.list.forEach(item => {
                        let d = item.attachment_url ? JSON.parse(item.attachment_url) : []
                        item.accessory = d && d.length>0 ? d[0].attachment_name : ''
                        item.state = item.mark_state == 0 ? '未通过' : item.mark_state == 1 ? '已通过' : '未批阅'
                        // item._disabled = item.mark_state === 2 ? false : true
                        item.score = item.mark_state == 2 ? '未评' : item.score
                    })
                    this.list = res.data.list
                    this.total = res.data.count
                    this.numList[0].num = res.data.submit_count
                    this.numList[1].num = res.data.unmark_count
                    this.numList[2].num = res.data.unpass_count
                    this.numList[3].num = res.data.pass_count
                    this.numList[4].num = res.data.review_count
                    }
                })
            },
            selectChange(val) {
                this.mark_state = val == 'all' ? '' : val
                this.getList()
            },
            closeModal(val) {
                this.show = val
            },
            preservationSuccess(){
                this.getList()
            },
            accessDown(){
                if (this.selectionList.length > 0) {
                    let data = {
                        dir_name: this.selectionList.length > 1 ? this.$route.query.title + " - 作业" : '',
                        homeworks: this.arrList
                    }
                    console.log(data);
                }
            },
            downloadAttachments(){
                (async () => {
                    await this.getFileName()
                    await this.accessDown()
                })()
            },
            getFileName() {
                if (this.selectionList.length > 0) {
                    this.arrList= []
                    this.selectionList.forEach((item, index) => {
                        postData('product/homework/mark_get_list', {student_homework_id: item.id}).then(res => {
                            let arr = []
                            res.data.select_result.forEach((item1, index1) => {
                                if(JSON.parse(item1.attachment_url).length) {
                                    JSON.parse(item1.attachment_url).forEach((item2, index2) => {
                                        if(index1 < res.data.select_result.length - 1){
                                            arr.push({
                                                file_name: item2.attachment_name.slice(0, item2.attachment_name.length - item2.attachment_name.split('.')[item2.attachment_name.split('.').length - 1].length - 1) + ' - 未通过（' + (index2+1) +')' + '.' + item2.attachment_name.split('.')[item2.attachment_name.split('.').length - 1],
                                                attachment_url: item2.attachment_url
                                            })
                                        }else{
                                            arr.push({
                                                file_name: item2.attachment_name ,
                                                attachment_url: item2.attachment_url
                                            })
                                        }
                                    })
                                }
                                if(index1 < res.data.select_result.length - 1) {
                                    arr.push({
                                        txt_name: '作业内容 - 未通过（' + (index1 + 1) + ')',
                                        txt_content: item1.answer
                                    })
                                }else{
                                    arr.push({
                                        txt_name: '作业内容',
                                        txt_content: item1.answer
                                    })
                                }
                            })
                            this.arrList.push({
                                child_name: this.selectionList[index].realname,
                                files: arr
                            })
                        })
                    })
                } else this.$Message.warning('请选择学员')
            }
        },
        mounted() {
            this.pageSize = 10
            this.tableHeight = window.innerHeight - 260
            this.stateValue = this.stateSelect[0].id
            this.title = this.$route.query.title
            this.getList()
        }
    }
</script>

<style lang="less" scoped>
    .screen{
        background-color: #fff;
    }
    /deep/ .ivu-select-selection{
        border-radius: 100px;
        height: 36px;
        padding-left: 15px;
    }
    /deep/ .ivu-select-selection{
        background: #EEEEF6;
    }
    .state{
        background-color: #fff;
        border-top: 1px solid #F0F0F7;
        height: 80px;
        display: flex;
        align-items: center;
        position: relative;
        .state-select{
            width: 120px;
            border-radius: 18px;
            margin-left: 40px;
        }
        .state-btn{
            display: flex;
            align-items: center;
            cursor: pointer;
            margin-left: 30px;
        }
        .state-img{
            height: 24px;
            width: 24px;
        }

        .state-check{
            margin-left: 5px;
            letter-spacing: 2px;
        }

        .state-data{
            display: flex;
            position: absolute;
            right: 40px;
        }

        .state-data-box{
            margin-left: 30px;

            &-unit{
                font-size: 14px;
                color: #4098FF;
            }

            &-title{
                font-size: 14px;
                color: #8C9095;
            }
        }
    }
    .batch{
        text-align: left;
        display: flex;
        border-top: 1px solid #F0F0F7;
        background-color:#fff;
        height: 60px;
        align-items: center;

        &-title{
            margin-left: 36px;
            font-size: 16px
        }

        &-download{
            margin-left: 40px;
            width: 100px;
            height: 30px;
        }

        &-read{
            margin-left: 10px;
            width: 100px;
            height: 30px;
        }
    }
</style>
