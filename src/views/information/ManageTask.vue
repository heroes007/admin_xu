<template>
    <div class='manage-task'>
        <header-component title="任务包" :type='3' :showAdd='true' @addTaskCategory='addTaskCategory' @reRenderList="reRenderListHandler" @manageEdit="manageEdit" />
        <div class="category-list">
            <category-item v-for='(item, index) in categoryList' :key="index" :showClose="showClose" :name='item.name' :cid='item.id' :type='item.type'
                           :selected='getSelected(item.id, item.type)' @select='changeCategory(item)'/>
        </div>
        <div class="create-panel">
            <Button @click="addTask()">创建</Button>
        </div>
        <data-list @edit='editHandler' @delete='deleteHandler' @doActive='doActiveHandler'
                   class='data-list light-header' :table-data='dataList'
                   :header-data='dataHeader' :column-formatter='listColumnFormatter'
                   :column-formatter-data='listColumnFormatterData'></data-list>
        <div class='manage-online-course'></div>
    </div>
</template>

<script>
  import Header from '../../components/ProjectHeader'
  import TaskCategoryItem from '../../components/TaskCategoryItem.vue'
  import BaseList from '../../components/BaseList'
  import { Dialog } from '../dialogs'
  import { ADD_TASK_CATEGORY, ADD_TASK, NOTIFICATION, MANUL_ACTIVE } from '../dialogs/types'
  import { doTimeFormat } from '../../components/Util'
  import { mapActions } from 'vuex'
  import { Config } from '../../config/base'
  import { taskHeadData } from './consts'
  export default {
    mixins: [Dialog],
    components: { 'header-component': Header, 'data-list': BaseList, 'category-item': TaskCategoryItem },
    data() {
      return {
        dirty: false,
        loadingInstance: null,
        selectCategory: -1,
        selectedType: 0,
        isInited: false,
        showClose: false
      }
    },
    computed: {
      // isLoading() {
      //   return this.$store.state.task.showLoading;
      // },
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
        }]
      },
      listColumnFormatterData() {
        return [this.gradeList, this.subjectList, this.$store.state.task.activityTypeList];
      },
      dataList() {
        if (!this.selectedCategory) return [];
        return this.selectedCategory.task_list;
      },
      selectedCategory() {
        for (var i = 0; i < this.categoryList.length; i++) {
          if (this.categoryList[i].id === this.selectCategory)  return this.categoryList[i];
        }
        return undefined;
      },
      subjectList() {
        return this.$store.state.subject.subject_list;
      },
      gradeList() {
        return this.$store.state.grade.grade_list;
      },
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
      ...mapActions([ 'delete_task' ]),
      addTaskCategory() {
        this.handleSelModal(ADD_TASK_CATEGORY, { orderby: this.categoryList.length + 1 });
      },
      manageEdit(v) {
        this.showClose = v;
      },
      reRenderListHandler(v) {
        if (this.$store.state.project.project_list.length > 0) {
          this.$store.dispatch('get_task_category_list', { project_id: v })
          this.$store.dispatch('get_task_list', { task_category_id: this.selectCategory });
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
          this.$store.dispatch('get_task_list', { task_category_id: this.selectCategory });
          this.isInited = true;
        }
      },
      editHandler(index, row) {
        this.handleSelModal(ADD_TASK, { separage: this.selectedCategory, type: 2, index, row, selectedType: this.selectedType });
      },
      deleteHandler(index, row) {
        var vm = this;
        this.$Modal.confirm({
          title: '提示',
          content: '<p>您确定要删除该任务吗?</p>',
          onOk: () => {
            this.delete_task({ task_category_id: this.selectCategory, task_id: row.id, is_del_ut: 1 })
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
          this.$Modal.info({ itle: '提示', content: '<p>请先添加分类！</p>' });
        }
      },
      deleteCourseHandler(index, row) {},
      doActiveHandler(index, row) {
        if (row.activity_type == 1) this.handleSelModal(MANUL_ACTIVE, { row })
      },
      changeCategory(item) {
        if (this.selectCategory !== item.id) {
          this.selectCategory = item.id;
          this.selectedType = item.type;
          for (var i = 0; i < this.categoryList.length; i++) {
            if (this.categoryList[i].id === this.selectCategory) {
              if (this.categoryList[i].task_list.length === 0) {
                this.$store.dispatch('get_task_list', { task_category_id: this.selectCategory });
              }
              break;
            }
          }
        }
      }
    },
    mounted() {
      var vm = this;
      if (this.$store.state.project.project_list.length === 0) {
        this.$store.dispatch('get_project_list', {
          callback(v) {
            vm.$store.dispatch('get_task_category_list', { project_id: v })
          }
        });
      } else {
        this.$store.dispatch('get_task_category_list', {
          project_id: this.$store.state.project.select_project_id
        })
      }
      if (this.categoryList.length === 0) {
        // this.$store.dispatch('get_task_category_list', {
        //     project_id: this.$store.state.project.select_project_id
        // })
      } else this.checkInit();
      this.$store.dispatch('get_grade_list');
      this.$store.dispatch('get_subject_list');
    }
  }

</script>
<style scoped lang='scss'>
    .category-list { display: flex;flex-wrap: wrap }
    .task-category-item{ margin-bottom: 10px; }
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
