<template>
<div class='task-category-item' @click="selectItem" :class="{'active': selected}">
    <div class='head'>
        <div class='mask'>
            <div class='bg'></div>
            <!-- <i class='el-icon-view' @click.stop="editHandler"></i> -->
            <i v-if="showClose" class='el-icon-circle-cross' @click.stop="deleteHandler"></i>
            <i v-show="type == 1" :class="{'work_icon': !selected, 'work_icon1': selected }"></i>
            <i v-show="type == 0" :class="{'task_icon2': !selected, 'task_icon': selected}"></i>
        </div>
    </div>
    <p class='name'>{{name}}</p>
</div>
</template>

<script>
import defaultHeader from '../assets/img/side-menu/default-header.jpg'
import {
    Dialog
} from '../views/dialogs'
import {
    ADD_TASK_CATEGORY
} from '../views/dialogs/types'
export default {
    mixins: [Dialog],
    data() {
        return {

        }
    },
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
    computed: {},
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
.icon{
  position: absolute;
  bottom: -54px;
  right: 20px;
  width: 23px;
  height: 23px;
}

.work_icon{
  @extend .icon;
  background: url('../assets/img/task/work_icon.png') no-repeat;
}

.task_icon2{
  @extend .icon;
  background: url('../assets/img/task/task_icon2.png') no-repeat;
}

.task_icon{
  @extend .icon;
  background: url('../assets/img/task/task_icon.png') no-repeat;
}

.work_icon1{
  @extend .icon;
  background: url('../assets/img/task/work_icon1.png') no-repeat;
}

.task-category-item {
    display: inline-block;
    // width: 110px;
    padding: 0 25px 0 25px;
    height: 50px;
    background: #FFFFFF;
    border: 1px solid #757575;
    border-radius: 4px;
    margin-left: 15px;
    margin-right: 15px;
    position: relative;
    cursor: pointer;
    p {
        font-size: 14px;
        color: #757575;
        letter-spacing: 0;
        line-height: 20px;
    }
    .head {
        position: absolute;
        width: 100%;
        .mask {
            .el-icon-circle-cross {
                position: absolute;
                right: 15px;
                top: -10px;
                font-size: 20px;
                color: #757575;
            }
        }
    }

}
.active {
    border: 1px solid #F06B1D;
    p {
        color: #F06B1D;
    }
    .icon1{
      background-color: blue;
    }
}
</style>
