
<template>
<el-dialog title="添加测验" v-model="addTestContentDialog" :show-close="false" @close="handleRemoveModal(remove)" size="auto" :closeOnClickModal="false">
    <base-input @closedialog="handleClose" :baseInputWidth="900">
        <Row slot="body">
            <el-form :inline="true" :model="formInline1" class="row1-test-form" label-width="80px">
                <el-form-item label="测验名称">
                    <el-input v-model="formInline1.title" placeholder="请输入测验的名称" :disabled='isEdit'></el-input>
                </el-form-item>
                <el-form-item label="测验权限">
                    <el-select v-model="formInline1.video_test_roles" placeholder="选择测验权限" :disabled='isEdit' multiple>
                        <el-option v-for="item in roleList" :key="item.id" :label="item.role_name" :value="item.role_id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item class="save-test">
                    <el-button type="primary" @click="handleSaveTest" class="save-test-btn" v-if='!isEdit'>保存测验</el-button>
                    <el-button type="" @click="handleEditTest" class="edit-test-btn" v-if='isEdit'>编辑测验</el-button>
                </el-form-item>
            </el-form>
            <el-form :inline="true" :model="formInline2" class="row2-test-form" label-width="80px">
                <Row class="row2-top">
                    <Col :span="12" class="col2-left">
                        <el-form-item label="题干名称">
                            <el-input type="textarea" :rows="5" placeholder="请输入内容" v-model="formInline2.body">
                            </el-input>
                        </el-form-item>
                        <el-form-item label="选项数量">
                            <el-select v-model="formInline2.select_count" placeholder="选项数量">
                                <el-option label="2" value="2"></el-option>
                                <el-option label="3" value="3"></el-option>
                                <el-option label="4" value="4"></el-option>
                                <el-option label="5" value="5"></el-option>
                                <el-option label="6" value="6"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="排列序号">
                            <el-input-number v-model="formInline2.orderby" :min="1" ></el-input-number>
                        </el-form-item>
                    </Col>
                    <Col :span="12" class="col2-right">
                        <el-form-item v-for='item in answerList' :key="item.id">
                            <Col :span="4">
                                <el-checkbox-group v-model="item.answer">
                                    <el-checkbox :label="item.name"></el-checkbox>
                                </el-checkbox-group>
                            </Col>
                            <Col :span="20">
                                <el-input placeholder="请输入内容" v-model="item.desc">
                                </el-input>
                            </Col>
                        </el-form-item>
                        <!-- <span style="clear: left"></span> -->
                        <el-form-item class="save-test-item">
                            <el-button type="" @click="cancelSaveHandler" class="cancel-test-item-btn">取消</el-button>
                            <el-button type="primary" @click="saveTestDetailHandler" class="save-test-item-btn">保存题干</el-button>
                        </el-form-item>
                    </Col>
                </Row>
                <Row class="quetion-list">
                    <data-list @edit='editHandler'
                               @delete='deleteHandler'
                               class='data-list light-header'
                               :table-data='dataList'
                               :header-data='dataHeader'
                               :column-formatter='listColumnFormatter'
                               :is-stripe='false'></data-list>
                </Row>
            </el-form>
        </Row>
    </base-input>
</el-dialog>
</template>

<script>
import BaseInput from '../../components/BaseInput'
import BaseList from '../../components/BaseList'
import { get_detail, get_test_detail_list, add_test_detail, update_test_detail, delete_test_detail } from '../../api/modules/tools_video_test'
import {
    RemoveModal
} from './mixins'
    import {
    MPop
} from '../../components/MessagePop'
export default {
    mixins: [RemoveModal,MPop],
    props: {
        remove: {
            type: String
        },
        payload:{
        }
    },
    components: {
        'base-input': BaseInput,
        'data-list':BaseList
    },
    data() {
        return {
            addTestContentDialog: true,
            formInline1: {
                video_test_id:0,
                title: '',
                video_test_roles: [0],
                curriculum_id:'',
                group_orderby:0,
                group_name:'',
                orderby:0
            },
            formInline2: {
                video_test_detail_id:0,
                body: '',
                select_count: -1,
                orderby: 1,
                answerList: [],
                result: [],
                content:''
            },
            dataList: [
            ],
            isEdit:false
        }
    },
    watch:{
        selectTestDetailId(val){
            if(val !== 0)
            {
                var detail;
                var i;
                for(i=0;i<this.dataList.length;i++)
                {
                    if(this.dataList[i].id === val)
                    {
                        detail = this.dataList[i];
                        break;
                    }
                }

                var detailData = JSON.parse(detail.content);

                this.formInline2.body = detailData.body;
                this.setSelectCount(detail.select_count);
                this.formInline2.orderby = detail.orderby;
                for(i=0;i<detailData.answerList.length;i++)
                {
                    this.formInline2.answerList[i].answer =  detailData.answerList[i].answer;
                    this.formInline2.answerList[i].desc =  detailData.answerList[i].desc;
                }
            }
        },
        selectCount(val){
            var labelList = ['A','B','C','D','E','F','G'];
            if(this.formInline2.answerList.length === 0)
            {
                for(var i=0;i<val;i++)
                {
                    this.formInline2.answerList.push({name:labelList[i],index:i,desc:'',answer:false});
                }
            }
            else
            {
                if(this.formInline2.answerList.length > val)
                {
                    while(this.formInline2.answerList.length > val)
                    {
                        this.formInline2.answerList.pop();
                    }
                }
                else
                {
                    while(this.formInline2.answerList.length < val)
                    {
                        this.formInline2.answerList.push({name:labelList[this.formInline2.answerList.length],index:this.formInline2.answerList.length,desc:'',answer:false})
                    }
                }
            }
        },
        newVideoTestId(val){
            if(this.formInline1.video_test_id === 0)
            {
                this.formInline1.video_test_id = val;
            }
        }
    },
    computed:{
        answerList(){
          return this.formInline2.answerList;
        },
        selectTestDetailId(){
            return this.formInline2.video_test_detail_id;
        },
        selectCount(){
          return this.formInline2.select_count;
        },
        roleList(){
            return this.$store.state.roles.role_list;
        },
        dataHeader(){
            return [
                {label:'排序',width:90,sort:true},
                {prop:'content',label:'题干名称'},
                {width:200,label:'操作',groupBtn:[{text:'编辑',param:'edit'},{text:'删除',param:'delete'}]}
            ]
        },
        listColumnFormatter(){
            return[{columnName:'content',doFormat:function(val){
                var data = JSON.parse(val);
                return data.body;
            }}]
        },
        newVideoTestId(){
            return this.$store.state.online_curriculum.newVideoTestId;
        }
    },
    methods: {
        setSelectCount(val){
            var labelList = ['A','B','C','D','E','F','G'];
            this.formInline2.answerList = [];
            for(var i=0;i<val;i++)
            {
                this.formInline2.answerList.push({name:labelList[i],index:i,desc:'',answer:false});
            }
            this.formInline2.select_count = val;
        },
        handleClose() {
            this.addTestContentDialog = false;
        },
        handleSubmit() {

        },
        handleSaveTest() {
            if(this.payload.video_test_id)
            {
                this.$store.dispatch('edit_online_curriculum_test',this.formInline1)
            }
            else
            {
                this.$store.dispatch('add_online_curriculum_test',this.formInline1)
            }
            this.isEdit = true;
        },
        handleEditTest(){
          this.isEdit = !this.isEdit;
        },
        editHandler(index,row) {
            this.formInline2.video_test_detail_id = row.id;
        },
        deleteHandler(index,row) {
            this.$confirm('是否确定删除该题目？','提示',{type:'info'}).then(()=> {
                delete_test_detail(row.id).then(res => {
                    if(res.data.res_code === 1)
                    {
                        this.dataList.splice(index,1);
                        this.$alert('删除成功。', '提示', {
                            confirmButtonText: '确定'})
                        this.clearDetail();
                    }
                })
            }).catch(() => {});
        },
        cancelSaveHandler(){
            this.clearDetail();
        },
        saveTestDetailHandler(){
            if(this.formInline1.video_test_id === 0)
            {
                this.$alert('请先保存测验，再添加题干。', '提示', {
                    confirmButtonText: '确定'})
            }
            else if(this.formInline1.video_test_roles.length === 0)
            {
                this.$alert('请选择测验权限', '提示', {
                                        confirmButtonText: '确定',
                                        callback: action => { }
                                    });
            }
            else
            {
                this.formInline2.result = [];
                for(var i=0;i<this.formInline2.answerList.length;i++)
                {
                    if(this.formInline2.answerList[i].answer)
                    {
                        this.formInline2.result.push(i);
                    }
                }
                this.formInline2.result = JSON.stringify(this.formInline2.result);
                this.formInline2.content = JSON.stringify({body:this.formInline2.body,answerList:this.formInline2.answerList});

                if(this.formInline2.video_test_detail_id > 0)
                {
                    update_test_detail(this.formInline2.video_test_detail_id,this.formInline2).then(res => {
                        if(res.data.res_code === 1)
                        {

                            for(var i=0;i<this.dataList.length;i++)
                            {
                                if(this.dataList[i].id === this.formInline2.video_test_detail_id)
                                {
                                    this.dataList[i].content = this.formInline2.content;
                                    this.dataList[i].orderby = this.formInline2.orderby;
                                    this.dataList[i].result = this.formInline2.result;
                                    this.dataList[i].select_count = this.formInline2.select_count;
                                    break;
                                }
                            }
                            this.$alert('保存成功。', '提示', {
                                confirmButtonText: '确定'})
                        }
                    })
                }
                else
                {
                    add_test_detail(this.formInline1.video_test_id,this.formInline2).then(res => {
                        if(res.data.res_code === 1)
                        {
                            this.dataList.push({id:res.data.msg,
                                content:this.formInline2.content,
                                orderby:this.formInline2.orderby,
                                result:this.formInline2.result,
                                select_count:this.formInline2.select_count,
                                video_test_id:this.formInline1.video_test_id})
                            this.$alert('添加成功。', '提示', {
                                confirmButtonText: '确定'})
                        }
                    })
                }
            }
        },
        clearDetail(){
            this.formInline2.video_test_detail_id = 0;
            this.formInline2.body = '';
            this.formInline2.answerList = [];
            this.setSelectCount(0);
            this.setSelectCount(4);
            this.formInline2.orderby = this.dataList.length > 0?this.dataList[this.dataList.length - 1].orderby + 1:1;
        }
    },
    mounted(){
        this.$store.dispatch('get_role_list');  
        this.formInline1.curriculum_id = this.payload.curriculum_id;
        this.formInline1.group_name = this.payload.group_name;
        this.formInline1.group_orderby = this.payload.group_orderby;
        this.formInline1.orderby = this.payload.orderby;
        this.formInline2.select_count = 4;
        if(this.payload.video_test_id)
        {
            this.formInline1.video_test_id = this.payload.video_test_id;
            this.isEdit = true;
            get_detail(this.payload.video_test_id).then(res => {
                if(res.data.res_code === 1)
                {
                    this.formInline1.video_test_id = this.payload.video_test_id;
                    this.formInline1.title = res.data.msg.video_test[0].title;
                    this.formInline1.video_test_roles = res.data.msg.role?res.data.msg.role:[];
                }
            })
            get_test_detail_list(this.payload.video_test_id).then(res => {
                if(res.data.res_code === 1)
                {
                    this.dataList = res.data.msg;
                    this.clearDetail();
                }
            })
        }
        else
        {
            this.formInline2.orderby = 1;
        }
    }
}
</script>
<style lang="scss">
#add-question-container {
    @import "base.scss";
    input,
    textarea {
        resize: none;
        outline: none;
    }
    .el-dialog {
        .el-dialog__header {
            background: #333333;
            border-radius: 4px 4px 0 0;
            padding: 16px;
        }
        .el-dialog__body {
            padding: 0;
            background: #fff;
            border-radius: 0 0 4px 4px;

            .row1-test-form {
                // height: 97px;
                border-bottom: 1px solid #E5E5E5;
                background: #fff;
                margin-top: 31px;
                padding-bottom: 18px;
                label {
                    font-size: 14px;
                    color: #141111;
                    letter-spacing: 0;
                }
                .el-input {
                    width: 250px;
                    height: 36px;
                    input {
                        border-radius: none;
                    }
                }
                .el-input__inner {
                    border-radius: 0;
                }
                .save-test{
                  .el-form-item__content{
                    margin-left: 30px !important;
                  }
                }
                .save-test-btn {
                    background: #FB843E;
                    border: 1px solid #F06B1D;
                    border-radius: 4px;
                    width: 80px;
                    height: 26px;
                    line-height: 0;
                    padding-left: 10px;
                }
                .edit-test-btn {
                    border: 1px solid #CCCCCC;
                    border-radius: 4px;
                    width: 80px;
                    height: 26px;
                    line-height: 0;
                    padding-left: 10px;
                }
            }
            .row2-test-form {
                .row2-top {
                    background: #FBFBFB;
                    height: 345px;
                    // border-bottom: 1px solid #E5E5E5;
                    padding-top: 40px;
                }
                .quetion-list {
                    overflow: hidden;
                    width: 100%;
                    thead {
                        > tr > th:first-child {
                            text-align: right;

                        }

                        th {
                            background-color: #fff;
                            .cell {
                                font-size: 14px;
                                color: #757575;
                                letter-spacing: 0;
                                background: #fff;
                            }
                        }
                    }
                    tbody {
                        > tr > td:first-child {
                            text-align: right;
                        }
                        td {
                            text-align: left;
                            .cell {
                                font-size: 14px;
                                color: #141111;
                                letter-spacing: 0;
                                line-height: 20px;
                            }
                            .el-button--text {
                                span {
                                    font-size: 14px;
                                    color: #757575;
                                    letter-spacing: 0;
                                }
                            }
                        }
                        tr {
                            height: 40px;
                            border-bottom: 1px solid #E5E5E5;
                        }
                    }
                }
                .col2-left {
                    label {
                        font-size: 14px;
                        color: #141111;
                        letter-spacing: 0;
                    }
                    .el-input__inner,
                    .el-textarea__inner,
                    .el-input-number{
                        background: #FFFFFF;
                        border: 1px solid #E5E5E5;
                        width: 300px;
                        border-radius: 0;
                    }
                }
                .col2-right {

                  .el-form-item{
                    margin-bottom: 25px;
                  }
                    .el-form-item__content {
                        margin-left: -100px !important;
                    }
                    .el-input__inner {
                        background: #FFFFFF;
                        border: 1px solid #E5E5E5;
                        width: 356px;
                        height: 36px;
                        border-radius: 0;
                    }
                    .save-test-item{
                      position: absolute;
                    }
                    .save-test-item-btn {
                        background: #FB843E;
                        border: 1px solid #F06B1D;
                        border-radius: 4px;
                        width: 80px;
                        height: 26px;
                        line-height: 0;
                        padding-left: 10px;
                        position: absolute;
                        bottom: -90px;
                        right: -20px;
                    }
                    .cancel-test-item-btn {
                        border: 1px solid #CCCCCC;
                        border-radius: 4px;
                        width: 80px;
                        height: 26px;
                        line-height: 0;
                        padding-left: 10px;
                        position: absolute;
                        bottom: -90px;
                        right: 70px;
                    }
                }
            }
        }
        .data-list {
            thead {
                tr {
                    height: 60px;
                }
            }
            .base-list-row {
                height: 60px;
                .el-button {
                    margin-left: 0;
                    &:last-child {
                    margin-left: 0;
                }
                }
            }
        }
    }
    .close-dialog-panel {
        position: absolute;
        top: -40px;
        right: 13.5px;
        z-index: 99999;
        font-size: 30px;
        cursor: pointer;
        &:before {
            // color: #fff;
            color: #757575;
        }
    }
}
</style>
