
<template>
<Modal :transfer=false title="添加测验" v-model="addTestContentDialog" :footer-hide="true" @on-cancel="handleRemoveModal(remove)" size="auto" :mask-closable="false" :styles="{width: '920px'}">
    <base-input @closedialog="handleClose" :baseInputWidth="900">
        <Row slot="body">
            <Form :inline="true" :model="formInline1" class="row1-test-form" :label-width="80">
                <FormItem label="测验名称">
                    <Input v-model="formInline1.title" placeholder="请输入测验的名称" :disabled='isEdit'></Input>
               </FormItem>
                <FormItem label="测验权限">
                    <Select v-model="formInline1.video_test_roles" placeholder="选择测验权限" :disabled='isEdit' multiple>
                        <Option v-for="item in roleList" :key="item.id" :label="item.role_name" :value="item.role_id">
                        </Option>
                    </Select>
               </FormItem>
                <FormItem class="save-test">
                    <Button type="primary" @click="handleSaveTest" class="save-test-btn" v-if='!isEdit'>保存测验</Button>
                    <Button @click="handleEditTest" class="edit-test-btn" v-if='isEdit'>编辑测验</Button>
               </FormItem>
            </Form>
            <Form :inline="true" :model="formInline2" class="row2-test-form" :label-width="80">
                <Row class="row2-top">
                    <Col :span="12" class="col2-left">
                        <FormItem label="题干名称">
                            <Input type="textarea" :rows="5" placeholder="请输入内容" v-model="formInline2.body">
                            </Input>
                        </FormItem>
                        <FormItem label="选项数量">
                            <Select v-model="formInline2.select_count" placeholder="选项数量">
                                <Option label="2" value="2"></Option>
                                <Option label="3" value="3"></Option>
                                <Option label="4" value="4"></Option>
                                <Option label="5" value="5"></Option>
                                <Option label="6" value="6"></Option>
                            </Select>
                       </FormItem>
                        <FormItem label="排列序号">
                            <InputNumber v-model="formInline2.orderby" :min="1" ></InputNumber>
                       </FormItem>
                    </Col>
                    <Col :span="12" class="col2-right">
                        <FormItem v-for='item in answerList' :key="item.id">
                            <Col :span="6">
                                    <Checkbox v-model="item.answer">{{item.name}}</Checkbox>
                            </Col>
                            <Col :span="18">
                                <Input placeholder="请输入内容" v-model="item.desc">
                                </Input>
                            </Col>
                       </FormItem>
                        <!-- <span style="clear: left"></span> -->
                        <FormItem class="save-test-item">
                            <Button @click="cancelSaveHandler" class="cancel-test-item-btn">取消</Button>
                            <Button type="primary" @click="saveTestDetailHandler" class="save-test-item-btn">保存题干</Button>
                       </FormItem>
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
            </Form>
        </Row>
    </base-input>
</Modal>
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
          this.$Modal.confirm({
            title: '提示',
            content: '<p>是否确定删除该题目？</p>',
            onOk: () => {
              delete_test_detail(row.id).then(res => {
                if(res.data.res_code === 1)
                {
                  this.dataList.splice(index,1);
                  // this.$alert('删除成功。', '提示', {
                  //   confirmButtonText: '确定'})
                  this.$Modal.info({
                    title: '提示',
                    content: '删除成功。'
                  });
                  this.clearDetail();
                }
              })
            },
          });
        },
        cancelSaveHandler(){
            this.clearDetail();
        },
        saveTestDetailHandler(){
            if(this.formInline1.video_test_id === 0)
            {
              this.$Modal.info({
                title: '提示',
                content: '请先保存测验，再添加题干。'
              });
            }
            else if(this.formInline1.video_test_roles.length === 0)
            {
                // this.$alert('请选择测验权限', '提示', {
                //                         confirmButtonText: '确定',
                //                         callback: action => { }
                //                     });
              this.$Modal.info({
                title:  '提示',
                content: '请选择测验权限',
                onOk: () => {
                  action => { }
                },
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
                            // this.$alert('保存成功。', '提示', {
                            //     confirmButtonText: '确定'})
                          this.$Modal.info({
                            title: '提示',
                            content: '保存成功。'
                          });
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
                          this.$Modal.info({
                            title: '提示',
                            content: '添加成功。'
                          });
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
    .row1-test-form{
        display: flex;
        align-items: center;
        justify-content: space-around;
    }
    .row2-test-form{
        background-color: #FBFBFB;
        padding-top: 40px;


        .col2-left{
            display: flex;
            flex-direction: column;
            height: 100%;
        }
        .col2-right{

        }
    }
</style>
