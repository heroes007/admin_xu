<template>
    <div class='task-category-item' @click="selectItem" :class="{'active': selected}">
        <div class='head'>
            <div class='mask'>
                <div class='bg'></div>
                <!-- <i class='el-icon-view' @click.stop="editHandler"></i> -->
                <Icon v-if="showClose" class='md-close-circle' @click.stop="deleteHandler" type="md-close-circle"/>
                <!--<i v-show="type == 1" :class="{'work_icon': !selected, 'work_icon1': selected }"></i>-->
                <!--<i v-show="type == 0" :class="{'task_icon2': !selected, 'task_icon': selected}"></i>-->
                <Icon v-show="type == 1" type="md-filing" size="24" :color="selected ? '#409eff' : '#999999'" />
                <Icon v-show="type == 0" type="md-bookmarks" size="24"  :color="selected ? '#409eff' : '#999999'" />
            </div>
        </div>
        <p class='name'>{{name}}</p>
    </div>
</template>

<script>
  import defaultHeader from '../assets/img/side-menu/default-header.jpg'
  import {Dialog} from '../views/dialogs'

  export default {
    mixins: [Dialog],
    props: {
      name: {
        type: String,
        default: ''
      },
      cid: {
        type: Number,
        required: true
      },
      type: {
        type: Number,
        required: true
      },
      selected: {
        type: Boolean,
        required: true
      },
      showClose: {
        type: Boolean,
        default: false
      }
    },
    methods: {
      deleteHandler() {
        this.$Modal.confirm({
          title: '提示',
          content: '<p>是否确定删除该分类？</p>',
          onOk: () => {
            this.$store.dispatch('delete_task_category', {
              task_category_id: this.cid
            })
          },
        });
      },
      selectItem() {
        this.$emit('select', this.cid);
      }
      // editHandler() {
      //     this.handleSelModal(ADD_TASK_CATEGORY, {
      //         cid: this.cid
      //     });
      // }
    }
  }
</script>
<style lang='scss'>
    .icon {
        position: absolute;
        left: 0;
        top: 50%;
        transform: translateY(-25%);
        width: 23px;
        height: 23px;
    }

    .work_icon {
        @extend .icon;
        background: url('../assets/img/task/work_icon.png') no-repeat;
    }

    .task_icon2 {
        @extend .icon;
        background: url('../assets/img/task/task_icon2.png') no-repeat;
    }

    .task_icon {
        @extend .icon;
        background: url('../assets/img/task/task_icon.png') no-repeat;
    }

    .work_icon1 {
        @extend .icon;
        background: url('../assets/img/task/work_icon1.png') no-repeat;
    }


    .task-category-item {
        padding: 6px 20px;
        cursor: pointer;
        border-radius: 4px;
        margin: 0 10px;
        display: flex;
        align-items: center;

        .mask {
            position: relative;
            width: 23px;
            height: 23px;
            display: inline-block;
            margin-right: 6px;
        }
    }

    .active {
        border: 1px solid #3DAAFF;

        p {
            color: #3DAAFF;
        }

        .icon1 {
            background-color: blue;
        }
    }
</style>
