<template>
<div class='manage-course-download-data'>
    <header-component :type='0' :showAdd='true' addText='添加课程资料' @addClick='addClickHandler'/>
    <data-list class='data-list light-header' @delete='deleteHandler' :isStripe='false' :table-data='dataList' :header-data='dataHeader' :columnComboData='columnComboData' :comboModelList='comboDataList'></data-list>
</div>
</template>

<script>
import BaseList from '../../components/BaseList'
import Header from '../../components/ProjectHeader'
import {
        mapActions,
        mapState,
        mapGetters
    } from 'vuex'
import {
    Dialog
} from '../dialogs'
import {
    ADD_DOWNLOAD_DATA
} from '../dialogs/types'
import {
    Loading
} from 'element-ui'
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
            searchData:'',
            loadingInstance: null,
            showPopper:false,
            searchResult:{
                code_name:'',
                user_id:0,
                nickname:'',
                realname:'',
                phone:'',
                use_time:null,
                state:1
            }
        }
    },
    computed: {
         ...mapState({
                isLoading:state => state.download_data.isLoading,
                dataList:state => state.download_data.course_download_data_list,
                query_online_course_list: state => state.online_curriculum.online_curriculum_list,
                projectId:state => state.project.select_project_id
            }),
            comboDataList(){
                var r = [];
                var v = []
                for(var i=0;i<this.dataList.length;i++)
                {
                    v= [];
                    for(var j=0;j<this.dataList[i].pre_curriculum.length;j++)
                    {
                        v.push(this.dataList[i].pre_curriculum[j]);
                    }
                    r.push(v);
                }
                return r;
            },
        categoryList() {
            return this.$store.state.task.task_category_list;
        },
        columnComboData(){
            return [this.query_online_course_list];
        },
        columnComboModel(){
            var result = [];
            var value = []
            for(var i=0;i<this.dataList.length;i++)
            {
                value = [];
                for(var j=0;j<this.dataList[i].pre_curriculum.length;j++)
                {
                    value.push(this.dataList[i].pre_curriculum[j]);
                }
                result.push({data:value});
            }
            return result;
        },
        dataHeader() {
            return [
                {
                    prop:'name',
                    label:'资料',
                    width:200
                },{
                    prop:'download_url',
                    label:'下载链接',
                    width:700
                },{
                    label:'前置课',
                    prop:'pre_curriculum',
                    useCombo:true,
                    comboListIndex:0,
                    listLabel:'title',
                    listValue:'curriculum_id',
                    actionName:'change_course_download_data_pre_curriculum'
                },
            {
                label: '操作',
                minwidth:300,
                groupBtn: [ {
                    isSwitch:true,
                    switchKey:'is_valid',
                    onText:'启用',
                    offText:'停用',
                    disableText:'失效',
                    actionName:'change_public_download_data_valid'

                }, {
                        text: 'el-icon-delete',
                        param: 'delete',
                        isIcon: true
                    }]
            }
            ]
        }
    },
    watch: {
        isLoading(val) {
            if (val) {
                this.loadingInstance = Loading.service({
                    text:'加载中，请稍后',
                    fullscreen: true
                });
                setTimeout(() => {
                    this.loadingInstance.close();
                }, Config.base_timeout);
            } else {
                this.loadingInstance.close();
            }
        }
    },
    methods: {
        ...mapActions([
            'get_online_curriculum_list',
            'get_curriculum_donwload_data_list',
            'delete_download_data'
        ]),
        addClickHandler(){
             this.handleSelModal(ADD_DOWNLOAD_DATA,1);
        },
        deleteHandler(index ,row){
            this.$confirm('是否确定删除该资料？', '提示', {
                        type: 'warning'
                    }).then(() => {
                        this.delete_download_data(row.id);
                    }).catch(() => { });
        }
    },
    mounted() {
        this.get_online_curriculum_list({project_id: this.projectId});
        this.get_curriculum_donwload_data_list({project_id: this.projectId});
    },
    components: {
        'header-component':Header,
        'data-list': BaseList
    }
}
</script>
<style lang='scss'>
.manage-course-download-data {
    .data-list {
        .base-list-row {
            height: 65px;
            &.invalid-row {
                background-color:  #FBFBFB;
            }
            .handle-component {
                .el-button {
                    &.btn-export {
border: 1px solid #333333;
border-radius: 22px;
width: 56px;
height:22px;
padding: 0;
                    }
                }
            }
        }
    }
}
</style>
