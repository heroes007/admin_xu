<template>
<el-dialog title="课程列表" :show-close="false" v-model="selectCurriculumDialog" @close="handleRemoveModal(remove)" size="auto" :closeOnClickModal="false">
    <base-input @closedialog="handleClose">
        <Row slot="body">
            <Row class="body-top">
                
                    <data-list class='data-list light-header' @changeSelect='changeRowSelectHandler' :table-data='dataList'
            :header-data='dataHeader'></data-list>
            </Row>
            <Row>
                <el-button type="primary" class="ok-btn" @click="addHandler">添加</el-button>
            </Row>
        </Row>
    </base-input>
</el-dialog>
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
        this.loadingInstance = Loading.service({
            text:'加载中，请稍后',
                    fullscreen: true
                });
                setTimeout(() => {
                    this.loadingInstance.close();
                }, Config.base_timeout);
       get_list(this.projectId).then(res => {
                if(res.data.res_code === 1)
                {
                    this.dataList = [];
                    var founded = false;
                    for(var i=0;i<res.data.msg.length;i++)
                    {
                        res.data.msg[i].is_select = false;
                        founded = false;
                        for(var j=0;j<this.payload.list.length;j++)
                        {
                            if(res.data.msg[i].curriculum_id === this.payload.list[j].curriculum_id)
                            {
                                founded = true;
                                break;
                            }
                        }
                        if(!founded)
                            this.dataList.push(res.data.msg[i]);
                    }
                }
                this.loadingInstance.close();
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
            for(var i=0;i<this.dataList.length;i++)
            {
                if(this.dataList[i].is_select)
                {
                    result.push(this.dataList[i].curriculum_id);
                    datas.push(this.dataList[i]);
                }
            }
            
            if(result.length === 0)
            {
                this.$alert('请选择至少一个课程！', '提示', {
                                        confirmButtonText: '确定',
                                        callback: action => { }
                                    });
            }
            else
            {
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
<style lang="scss">
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
    .el-dialog {
        width: 600px;
        background: none;

        .body-top {
            padding-bottom: 10px;
        }

        .el-dialog__header {
            background: #333333;
            border-radius: 4px 4px 0 0;
            padding: 16px;
        }
        .el-dialog__body {
            padding: 0;
            background: #fff;
            border-radius: 0 0 4px 4px;
        }
         .ok-btn {
                background: #FB843E;
                border-radius: 4px;
                width: 200px;
                height: 36px;
                border: 0;
                margin: 30px 0;
            }
    }
}
</style>
