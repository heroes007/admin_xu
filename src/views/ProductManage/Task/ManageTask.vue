<template>
    <div class='manage-task'>
        <FormModal :detail-data="tableRow" @from-submit="saveHomework" :show-modal='show' :form-list="formList"
                   @close="closeModal" :title="modalTitle" :rule-validate="rules" uploadBtn>
        </FormModal>

        <screen :types="2" sizeTitle1="作业总数" :sizeNum1="pageTotal" btnName="添加作业" @inputChange="manageEdit"
                @handleClick="addTaskCategory" :btnType="true"/>

        <data-list @edit='editHandler' @delete='deleteHandler' @doActive='doActiveHandler'
                   class='data-list light-header' :table-data='dataList' :table-height='listHeight'
                   @marking="marking" :header-data='dataHeader' :column-formatter='listColumnFormatter'
                   @statistics="statistics" :column-formatter-data='listColumnFormatterData'></data-list>

        <page-list :current="current" :total="pageTotal" :page-size="pageSize" @page-list="pageList"/>
    </div>
</template>

<script>
    import TaskCategoryItem from '../../../components/TaskCategoryItem.vue'
    import BaseList from '../../../components/BaseList'
    import {Dialog} from '../../dialogs'
    import { MANUL_ACTIVE} from '../../dialogs/types'
    import {doTimeFormat} from '../../../components/Util'
    import {mapActions, mapState} from 'vuex'
    import {Config} from '../../../config/base'
    import {taskHeadData} from './consts'
    import screen from '../../../components/ScreenFrame'
    import FormModal from '../../../components/FormModal'
    import FormModalMixin from '../../UserManage/Mixins/FormModalMixin'
    import Editor from '../../../components/Editor'
    import Uploader from '../../../components/Upload'
    import pageMixin from '../../mixins/pageMixins'
    import pageList from '../../../components/Page'
    import postData from '../../../api/postData'

    export default {
        mixins: [Dialog, FormModalMixin, pageMixin],
        components: {
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
                        selectField: ['id', 'name'], selectChange: true
                    },
                    {
                        type: 'select', name: '绑定课程', field: 'binding_course', disable: false,
                        selectList: [], selectField: ['id', 'title'], change: true, line: 1
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
                return [[], this.subjectList, this.$store.state.task.activityTypeList, this.stateList];
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

        },
        methods: {
            ...mapActions(['delete_task']),
            addTaskCategory() {
                this.getListLine()
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
            getSelected(id, type) {
                if (this.selectCategory === id) return true;
                return false;
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
                if(row.type == "underline") this.formList[2].line = 0
                else this.formList[2].line = 1
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
            // addTask() {
            //     if (this.categoryList.length > 0) {
            //         this.handleSelModal(ADD_TASK, {
            //             separage: this.selectedCategory || this.categoryList[0].id,
            //             type: 1,
            //             selectedType: this.selectedType
            //         })
            //     } else {
            //         this.$Modal.info({itle: '提示', content: '<p>请先添加分类！</p>'});
            //     }
            // },
            deleteCourseHandler(index, row) {
            },
            doActiveHandler(index, row) {
                if (row.activity_type == 1) this.handleSelModal(MANUL_ACTIVE, {row})
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
                 (async () => {
                     await  this.$store.dispatch('add_task_category', val);
                     await this.initData()
                 })()
                } else {
                 (async () => {
                     await  this.$store.dispatch('edit_task_category', val);
                     await this.initData()
                  })()
                }
            },
            initData() {
              this.$store.dispatch('get_task_category_list', {
                    page: {page_size: this.pageSize, page_num: this.current},
                    keyword: this.keyword
                })
            },
            getListLine(){
              postData('product/curriculum_online/pulldown_get_list', {
                product_id: JSON.parse(localStorage.getItem('PRODUCTINFO')).id,
              }).then(res => {
                this.curricumList[0] = res.data
              })
              postData('product/curriculum_online/pulldown_get_offline_list', {
                product_id: JSON.parse(localStorage.getItem('PRODUCTINFO')).id,
              }).then(res => {
                this.curricumList[1] = res.data
              })
              console.log(this.curricumList,'this.curricumList')
            }
        },
        mounted() {
            // this.$store.dispatch('get_subject_list');
            // var vm = this;
            this.initData()
            // curricumList
            this.getListLine()
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
