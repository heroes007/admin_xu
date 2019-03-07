<template>
<Modal :transfer=false :title="payload === 0?'添加推荐资料':'课程资料上传'" v-model="addDownloadDataDialog" @on-cancel="handleRemoveModal(remove)" :mask-closable="false"  :footer-hide="true">
    <base-input @closedialog="handleClose">
        <Row slot="body">
            <Row class="body-top" v-if="true">
                <Form ref="form" :model="form" :label-width="70" class="add-teacher-form">
                    <FormItem label="资料名称">
                        <Input v-model="form.name" placeholder="请输入分类名称"></Input>
                   </FormItem>
                    <FormItem label="学科" v-if='payload === 0'>
                                <Select v-model="form.subject_id" placeholder="请选择学科">
                                    <Option v-for="item in query_subject_list" :key="item.id" :label="item.name" :value="item.id"></Option>
                                </Select>
                           </FormItem>
                    <FormItem label="学段" v-if='payload === 0'>
                                <Select v-model="form.grade_id" placeholder="请选择学段">
                                    <Option v-for="item in query_grade_list" :key="item.id" :label="item.name" :value="item.id"></Option>
                                </Select>
                           </FormItem>
                    <FormItem :label-width='0'>
                        <file-uploader :filters="dataFilters" maxFileCount="1"
                                    :maxFileSize="30000"  @uploadComplete="uploadComplete"
                                    bucket="dscj-static-file" :dir='getDir()'/>
                   </FormItem>
                    <FormItem class="btn-content" :label-width='0'>
                        <Button type="primary" class="sub-btn" @click="saveHandler">完成</Button>
                   </FormItem>
                </Form>
            </Row>
        </Row>
    </base-input>
</Modal>
</template>
<script>
import BaseInput from '../../components/BaseInput'
import { RemoveModal } from './mixins'
import UploadPanel from '../../components/UploadPanel'
import Uploader from '../../components/Upload'
import { get_category_by_id } from '../../api/modules/tools_task'
import { Config } from '../../config/base'
import { doTimeFormat } from '../../components/Util'
import { mapState, mapActions } from 'vuex'
import { MPop } from '../../components/MessagePop'
export default {
    mixins: [RemoveModal,MPop],
    props: {
        remove: {
            type: String
        },
        payload: {}
    },
    components: {
        'base-input': BaseInput,
        'file-uploader': Uploader
    },
    computed:{
         ...mapState({
            projectId:state => state.project.select_project_id,
            query_grade_list: state => state.grade.grade_list,
            query_subject_list: state => state.subject.subject_list,
            }),
        dataFilters(){
            var str = ['doc','pdf','zip'];
            return str;
        },
    },
    data() {
        return {
            addDownloadDataDialog: true,
            form: {
                project_id:1,
                name:'',
                subject_id:null,
                grade_id: null,
                download_url:'',
                type:0
            },
            loadingInstance: null
        }
    },
    methods: {
        ...mapActions([ 'add_course_download_data', 'add_public_download_data' ]),
        getDir() {
            if(this.payload === 0) return 'datacenter/public/' + doTimeFormat(new Date().toString());
            return 'datacenter/curriculum/' + doTimeFormat(new Date().toString());
         },
        uploadComplete(id,result) {
            this.form.download_url = result.url;
        },
        saveHandler() {
           if(this.payload === 0) this.add_public_download_data(this.form);
           else this.add_course_download_data(this.form);
        },
        handleClose() {
            this.addDownloadDataDialog = false;
        }
    },
    mounted() {
        var vm = this;
        this.form._fn = function() {
            vm.handleClose();
            vm.showPop('添加成功！',1000);
        };
        this.form.project_id = this.projectId;
        this.form.type = this.payload;
        if(this.form.type === 0){
            this.form.grade_id = 0;
            this.form.subject_id = 0;
        }
    }
}
</script>
<style lang="scss">
    #add-download-data-container {
        @import "base.scss";
        input,
        textarea {
            resize: none;
            outline: none;
        }
        .close-dialog-panel {
            position: absolute;
            top: -70px;
            right: -13.5px;
            z-index: 99999;
            font-size: 30px;
            cursor: pointer;
            &:before {
                // color: #fff;
                color: #757575;
            }
        }
    }
    .btn-content{
        text-align: center;
    }
    .sub-btn{
        width: 170px;
    }
</style>
