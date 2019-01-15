<template>
    <Modal  title="产品协议" :width="600" :footer-hide=true v-model="selectCurriculumDialog" @on-cancel="handleRemoveModal(remove)">
    <base-input @closedialog="handleClose">
        <Row slot="body">
            <Row class="body-top">
               <data-list class='data-list light-header' @changeSelect='changeRowSelectHandler' :table-data='dataList'
            :header-data='dataHeader'></data-list>
            </Row>
            <Row class="elRow">
                <Button type="primary" class="ok-btn" @click="addHandler">添加</Button>
            </Row>
        </Row>
    </base-input>
</Modal>
</template>
<!-- task_id = 19 -->
<script>
import BaseInput from '../../components/BaseInput'
import UploadPanel from '../../components/UploadPanel'
import Editor from '../../components/Editor'
import BaseList from '../../components/BaseList'
import {
   get_list
} from '../../api/modules/tools_curriculum'
import {
    RemoveModal
} from './mixins'
import {
    mapActions,
    mapState
} from 'vuex';
import { Loading } from 'element-ui'
import { Config } from '../../config/base'
    import {
    MPop
} from '../../components/MessagePop'
export default {
    mixins: [RemoveModal,MPop],
    props: {
        remove: {
            type: String
        },
        payload: {}
    },
    data() {
        return {
            selectCurriculumDialog: true,
            dataList:[],
            loadingInstance:null
        }
    },
    mounted() {
        this.loadingInstance = this.$LoadingY({message: "加载中，请稍后",show: true})
                setTimeout(() => {
                    this.loadingInstance.close();
                }, Config.base_timeout);
       get_list(this.projectId).then(res => {
                if(res.data.res_code === 1){
                    this.dataList = [];
                    var founded = false;
                    for(var i=0;i<res.data.msg.length;i++){
                        res.data.msg[i].is_select = false;
                        founded = false;
                        for(var j=0;j<this.payload.list.length;j++){
                            if(res.data.msg[i].curriculum_id === this.payload.list[j].curriculum_id){
                                founded = true;
                                break;
                            }
                        }
                        if(!founded) this.dataList.push(res.data.msg[i]);
                    }
                }
               if(this.loadingInstance) this.loadingInstance.close();
            })
    },
    computed: {
        ...mapState({
            projectId:state => state.project.select_project_id
        }),
        dataHeader() {
             return [
                 { 
                    label: '排序', 
                    width: 90, 
                    sort: true 
                }, {
                    prop: 'teacher_name',
                    label: '讲师',
                    width: 150
                }, {
                    prop: 'title',
                    label: '课程名称',
                },  {
                    label: '操作',
                    width: 120,
                    groupBtn: [{
                        text: '',
                        param: 'changeSelect',
                        switchKey:'is_select',
                        useCheckBox:true
                    }]
                }]
        }
    },
    methods: {
        ...mapActions([
            'add_production_curriculums'
        ]),
        changeRowSelectHandler(index,row) {

        },
        handleClose() {
            this.selectCurriculumDialog = false;
        },
        addHandler(formName) {
            var result = [];
            var datas = []
            for(var i=0;i<this.dataList.length;i++){
                if(this.dataList[i].is_select){
                    result.push(this.dataList[i].curriculum_id);
                    datas.push(this.dataList[i]);
                }
            }
            if(result.length === 0){
                  this.$Modal.confirm({
                    title: '提示',
                    content: '请选择至少一个课程！',
                    onOk: () => {}
                });
            }else{
                var vm = this;
                this.add_production_curriculums({id:this.payload.productionId,curriculums:result,curriculumData:datas,_fn:function(){
                     vm.handleClose();
                    vm.showPop('添加成功！');
                }})
            }
        }
    },
    components: {
        'base-input': BaseInput,
        'upload-panel': UploadPanel,
        'text-editor':Editor,
        'data-list': BaseList,
    },
}
</script>
<style lang="scss" scoped>
/deep/.ivu-btn{
     border-radius: 4px;
        width: 200px !important;
        height: 36px;
        border: 0;
        margin: 30px 0;
}
#select-curriculum-container {
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
    .body-top {
        padding-bottom: 10px;
    }
}
</style>
