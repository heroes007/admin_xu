<template>
    <div class='manage-task'>
        <FormModal :detail-data="tableRow" @from-submit="saveHomework" :show-modal='show' :form-list="formList"
                   @close="closeModal" :title="modalTitle" :rule-validate="rules" uploadBtn>
            <!--<div slot="form-other">-->
            <!--<Form >-->
            <!--<FormItem label="作业描述">-->
            <!--<text-editor ref='content_editor' :content='contentData' />-->
            <!--</FormItem>-->
            <!--<FormItem  label="上传附件" >-->
            <!--<file-uploader :filters="dataFilters" maxFileCount="1"-->
            <!--:maxFileSize="30000"  @uploadComplete="uploadComplete"-->
            <!--bucket="dscj-static-file" :dir='getDir()'/>-->
            <!--</FormItem>-->
            <!--</Form>-->
            <!--</div>-->
        </FormModal>

        <!-- <header-component title="任务包" :type='3' :showAdd='true' @addTaskCategory='addTaskCategory' @reRenderList="reRenderListHandler" @manageEdit="manageEdit" /> -->
        <screen :types="2" sizeTitle1="作业总数" :sizeNum1="courseNums" btnName="添加作业" @inputChange="manageEdit"
                @handleClick="addTaskCategory" :btnType="true"/>
        <!-- <div class="category-list">
            <category-item v-for='(item, index) in categoryList' :key="index" :showClose="showClose" :name='item.name' :cid='item.id' :type='item.type'
                           :selected='getSelected(item.id, item.type)' @select='changeCategory(item)'/>
        </div>
        <div class="create-panel">
            <Button @click="addTask()">创建</Button>
        </div> -->

        <data-list @edit='editHandler' @delete='deleteHandler' @doActive='doActiveHandler'
                   class='data-list light-header' :table-data='dataList' :table-height='listHeight'
                   @marking="marking" :header-data='dataHeader' :column-formatter='listColumnFormatter'
                   @statistics="statistics" :column-formatter-data='listColumnFormatterData'></data-list>
        <!--<div class='manage-online-course'></div>-->
        <page-list :current="current" :total="pageTotal" :page-size="pageSize" @page-list="pageList"/>

    </div>
</template>

<script>
    import Header from '../../components/ProjectHeader'
    import TaskCategoryItem from '../../components/TaskCategoryItem.vue'
    import BaseList from '../../components/BaseList'
    import {Dialog} from '../dialogs'
    import {ADD_TASK_CATEGORY, ADD_TASK, NOTIFICATION, MANUL_ACTIVE} from '../dialogs/types'
    import {doTimeFormat} from '../../components/Util'
    import {mapActions, mapState} from 'vuex'
    import {Config} from '../../config/base'
    import {taskHeadData} from './consts'
    import screen from '../../components/ScreenFrame'
    import FormModal from '../../components/FormModal'
    import FormModalMixin from '../UserManage/Mixins/FormModalMixin'
    import Editor from '../../components/Editor'
    import Uploader from '../../components/Upload'
    import pageMixin from '../mixins/pageMixins'
    import pageList from '../../components/Page'
    import postData from '../../api/postData'

    export default {
        mixins: [Dialog, FormModalMixin, pageMixin],
        components: {
            'header-component': Header,
            'data-list': BaseList,
            'category-item': TaskCategoryItem,
            screen,
            FormModal,
            'text-editor': Editor,
            'file-uploader': Uploader,
            pageList
        },
        data() {
            return {
                curricumList: [],
                dirty: false,
                loadingInstance: null,
                selectCategory: 12,
                selectedType: 1,
                isInited: false,
                showClose: false,
                courseNums: 12,
                show: false,
                modalTitle: '',
                tableRow: {},
                tableRowData: {},
                formList: [
                    {type: 'input', name: '作业名称', field: 'realname'},
                    {
                        type: 'select',
                        name: '作业类型',
                        disable: false,
                        field: 'jurisdiction',
                        selectList: [{id: 'online', name: '线上作业'}, {id: 'underline', name: '线下作业'}],
                        selectField: ['id', 'name']
                    },
                    {
                        type: 'select', name: '绑定课程', field: 'binding_course', disable: false,
                        selectList: [], selectField: ['id', 'title']
                    },
                    {type: 'upload', name: '作业描述', field: 'uploading'}
                ],
                rules: {
                    realname: [{required: true, message: '请输入作业名称', trigger: 'blur'}],
                    jurisdiction: [{required: true, message: '请选择作业类型'}],
                    binding_course: [{required: true, message: '请选择绑定课程'}],
                    // uploading: [{ required: true, message: '请输入课程介绍'} ],
                },
                contentData: ''
            }
        },
        computed: {
            // isLoading() {
            //   return this.$store.state.task.showLoading;
            // },
            listHeight() {
                return window.innerHeight - 60 - 50 - 70;
            },
            pageTotal() {
                return this.$store.state.task.total;
            },
            categoryList() {
                return this.$store.state.task.task_category_list;
            },
            dataHeader() {
                let v = this.selectedCategory && this.selectedCategory.type
                return taskHeadData(v)
            },
            listColumnFormatter() {
                return [{
                    columnName: 'create_time',
                    doFormat: doTimeFormat
                }, {
                    columnName: 'grade_id',
                    dataIndex: 0,
                    dataProp: 'id',
                    dataValue: 'name'
                }, {
                    columnName: 'subject_id',
                    dataIndex: 1,
                    dataProp: 'id',
                    dataValue: 'name'
                }, {
                    columnName: 'activity_type',
                    dataIndex: 2,
                    dataProp: 'id',
                    dataValue: 'name'
                },
                ]
            },
            listColumnFormatterData() {
                return [this.gradeList, this.subjectList, this.$store.state.task.activityTypeList, this.stateList];
            },
            dataList() {
                if (!this.selectedCategory) return [];
                return this.selectedCategory.task_list;
            },
            selectedCategory() {
                for (var i = 0; i < this.categoryList.length; i++) {
                    if (this.categoryList[i].id === this.selectCategory) return this.categoryList[i];
                }
                return undefined;
            },
            subjectList() {
                return this.$store.state.subject.subject_list;
            },
            gradeList() {
                return this.$store.state.grade.grade_list;
            },
            ...mapState({
                dataFilters() {
                    var str = ['doc', 'pdf', 'zip'];
                    return str;
                },
                dataList: state => state.task.task_category_list,
                // curricumList: state => state.task.curricum_list
            })
        },
        watch: {
            // isLoading(val) {
            //   if (val) {
            //     this.loadingInstance = this.$LoadingY({message: "加载中，请稍后",show: true})
            //     setTimeout(() => {
            //       this.loadingInstance.close()
            //     }, Config.base_timeout);
            //   }else{
            //     if(this.loadingInstance) this.loadingInstance.close()
            //     this.dirty = false
            //   }
            // },
            categoryList(val) {
                if (val.length !== 0) this.checkInit();
            }
        },
        methods: {
            ...mapActions(['delete_task']),
            addTaskCategory() {
                this.tableRow = {}
                this.show = true
                this.formList[1].disable = false
                this.formList[2].disable = false
                this.modalTitle = "添加作业"
                let v = JSON.parse(localStorage.getItem("PRODUCTINFO")).id
                this.$store.dispatch('get_curriculumlist_list', {product_id: v})
                this.formList[2].selectList = this.curricumList
                // this.handleSelModal(ADD_TASK_CATEGORY, { orderby: this.categoryList.length + 1 });
                //  console.log(this.dataList);
            },
            manageEdit(v) {
                // this.showClose = v;
              this.keyword = v
              this.initData()
            },
            reRenderListHandler(v) {
                if (this.$store.state.project.project_list.length > 0) {
                    this.$store.dispatch('get_task_category_list', {project_id: v})
                    this.$store.dispatch('get_task_list', {task_category_id: this.selectCategory});
                }
            },
            getSelected(id, type) {
                if (this.selectCategory === id) return true;
                return false;
            },
            checkInit() {
                if (!this.isInited) {
                    this.selectCategory = this.categoryList[0].id;
                    this.selectedType = this.categoryList[0].type;
                    this.$store.dispatch('get_task_list', {task_category_id: this.selectCategory});
                    this.isInited = true;
                }
            },
            statistics(index, row) {
                console.log(row, '统计');
            },
            marking(index, row) {
                this.$router.push({
                  path: `open-product/${row.id}/marking-homework`
                })
                localStorage.setItem('MarkingHomework', JSON.stringify(row))
            },
            editHandler(index, row) {
                this.show = true;
                this.formList[1].disable = true
                this.formList[2].disable = true
                this.modalTitle = '编辑作业';
                let v = JSON.parse(localStorage.getItem("PRODUCTINFO")).id
                this.$store.dispatch('get_curriculumlist_list', {product_id: v})
                this.formList[2].selectList = this.curricumList
                this.tableRow.realname = row.title
                this.tableRow.uploading = row.description
                this.tableRow.jurisdiction = row.type
                this.tableRow.binding_course = row.curriculum_id
                this.tableRow.upload = row.attachment_url ? JSON.parse(row.attachment_url) : row.attachment_url
                    this.$store.dispatch("change_homework_id", row.id)
              // this.handleSelModal(ADD_TASK, { separage: this.selectedCategory, type: 2, index, row, selectedType: this.selectedType });
            },
            deleteHandler(index, row) {
                var vm = this;
                this.$Modal.confirm({
                    title: '提示',
                    content: '<p>您确定要删除该任务吗?</p>',
                    onOk: () => {
                        this.delete_task(row.id)
                    },
                });
            },
            addTask() {
                if (this.categoryList.length > 0) {
                    this.handleSelModal(ADD_TASK, {
                        separage: this.selectedCategory || this.categoryList[0].id,
                        type: 1,
                        selectedType: this.selectedType
                    })
                } else {
                    this.$Modal.info({itle: '提示', content: '<p>请先添加分类！</p>'});
                }
            },
            deleteCourseHandler(index, row) {
            },
            doActiveHandler(index, row) {
                if (row.activity_type == 1) this.handleSelModal(MANUL_ACTIVE, {row})
            },
            changeCategory(item) {
                if (this.selectCategory !== item.id) {
                    this.selectCategory = item.id;
                    this.selectedType = item.type;
                    for (var i = 0; i < this.categoryList.length; i++) {
                        if (this.categoryList[i].id === this.selectCategory) {
                            if (this.categoryList[i].task_list.length === 0) {
                                this.$store.dispatch('get_task_list', {task_category_id: this.selectCategory});
                            }
                            break;
                        }
                    }
                }
            },
            uploadComplete(id, result) {
                this.form.download_url = result.url;
            },
            getDir() {
                if (this.payload === 0) return 'datacenter/public/' + doTimeFormat(new Date().toString());
                return 'datacenter/curriculum/' + doTimeFormat(new Date().toString());
            },
            saveHomework(val) {
                if (this.modalTitle == "添加作业") {
                    this.$store.dispatch('add_task_category', val);
                  this.initData()

                } else {
                    this.$store.dispatch('edit_task_category', val);
                  this.initData()

                }
            },
            initData() {
              this.$store.dispatch('get_task_category_list', {
                    page: {page_size: this.pageSize, page_num: this.current},
                    keyword: this.keyword
                })
            }
        },
        mounted() {
            this.$store.dispatch('get_grade_list');
            this.$store.dispatch('get_subject_list');
            // var vm = this;
            this.initData()
            // curricumList
          postData('product/curriculum_online/pulldown_get_list', {
                product_id: JSON.parse(localStorage.getItem('PRODUCTINFO')).id,
            }).then(res => {
                this.curricumList = res.data
            })
            // if (this.$store.state.project.project_list.length === 0) {
            //   this.$store.dispatch('get_project_list', {
            //     callback(v) {
            //       vm.$store.dispatch('get_task_category_list', { project_id: v })
            //     }
            //   });
            // } else {
            //   this.$store.dispatch('get_task_category_list', {
            //     project_id: this.$store.state.project.select_project_id
            //   })
            // }
            // if (this.categoryList.length === 0) {
            //   this.$store.dispatch('get_task_category_list', {
            //       project_id: this.$store.state.project.select_project_id
            //   })
            // } else this.checkInit();
        }
    }

</script>
<style scoped lang='scss'>
    /deep/ .ivu-btn-text {
        font-family: PingFangSC-Medium;
        font-size: 16px;
        color: #4098FF;
        letter-spacing: 0;
    }

    .category-list {
        display: flex;
        flex-wrap: wrap
    }

    .task-category-item {
        margin-bottom: 10px;
    }

    .manage-task {
        .category-list {
            padding-top: 20px;
            padding-bottom: 20px;
            background-color: #FBFBFB;
        }
        .create-panel {
            padding-top: 10px;
            padding-bottom: 10px;
            text-align: right;
            button {
                margin-right: 30px;
                background: #3DAAFF;
                border-radius: 2px;
                padding: 3px 15px;
                font-size: 14px;
                color: #FFFFFF;
                letter-spacing: 0;
                border: none;
                outline: none;
                line-height: 20px;
            }
        }
    }

</style>
