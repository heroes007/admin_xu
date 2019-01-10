/**
 * Created by lesonli on 2016/11/16.
 */
<template>
<!-- <div class='c-header'> -->
<!--<header-component/>-->
<!-- <Row>
        <Col :span="4">
            <i class='el-icon-menu'></i>
            <el-select v-model="project_id" placeholder="请选择" @change="handleCheckProjectId">
                <el-option v-for="item in projects" :label="item.name" :value="item.id">
                </el-option>
            </el-select>
        </Col>
        <Col :span="20">
            <div>{{m_title}}</div>
      </Col>
    </Row> -->
<!--<other-component/>-->
<!-- </div> -->
<div class='project-header1'>
    <Row class='header-container' type='flex' justify='space-between' align='middle'>
        <Col :span="6" class="project-list" v-if="!noSelect">
            <div class='title'>
                <i class='el-icon-menu'></i>
                <el-select v-model="project_id" placeholder="请选择" @change="handleCheckProjectId" disabled>
                    <el-option v-for="item in projects" :key="item.id" :label="item.name" :value="item.id">
                    </el-option>
                </el-select>
            </div>
        </Col>
        <Col :span="noSelect ? !showAdd ? 24 : 18 :!showAdd? 18 : 12">
            <div class="st-title">{{m_title}}</div>
        </Col>
        <Col :span="6" v-if='showAdd'>
             <el-button class='btn-add' type='primary' icon="plus" v-if='showAdd' @click="addClickHandler">
                    {{addText}}
                </el-button>
        </Col>
    </Row>
</div>
</template>
<script>
export default {
    data() {
        return {
            m_title: this.title,
            isSelected: false
        }
    },
    props: {
        title: {
            type: String,
            required: true
        },
        noSelect: {

        },
            showAdd: {
                type: Boolean,
                default: false
            },
            addText:{
                type:String
            }
    },
    computed: {
      projects(){
        return this.$store.state.project.project_list;
      },
      project_id: {
          set(v) {
              this.$emit('reRenderList', v)
              this.$store.dispatch('change_selected_project_id', v)
          },
          get() {
              return this.$store.state.project.select_project_id;
          }
      }
    },
    methods: {
        addClickHandler() {
                this.$emit('addClick');
            },
        handleCheckProjectId(v) {
          if(this.isSelected){
            this.$emit('reRenderList', v);
            this.isSelected = true;
          }

        }
    }
}
</script>
<style lang="scss">
// .c-header {
//     // background-color: #546573;
//     height: 60px;
//     background-color: #333333;
//     /*border-top-right-radius:10px;*/
//     // div {
//     //     width: 100%;
//     //     height: 60px;
//     //     line-height: 60px;
//     //     color: #ffffff;
//     //     font-size: 18px;
//     // }
// }

.teacher-list {
    border-radius: 4px;
    &.el-popover[x-placement^=bottom] {
        .popper__arrow {
            &:after {
                border-bottom-color: #e5e5e5;
            }
        }
    }

    .teacher-list-head {
        background-color: #e5e5e5;
        height: 60px;
        position: relative;
        .head {
            line-height: 60px;
            font-size: 18px;
            color: #141111;
            letter-spacing: 0;
            text-align: center;
        }
        .el-button {
            position: absolute;
            font-size: 14px;
            top: 12px;
            right: 11px;
            color: #F06B1D;
            letter-spacing: 0;
        }
    }
    .teacher-list-container {
        padding: 30px 0;
    }
}
.project-header1 {
    height: 60px;
    background-color: #333333;
    padding-left: 25px;
    .header-container {
        height: 100%;
        .title {
            color: #ffffff;

            i {
                color: #ffffff;
            }

            input {
                border: 0;
                border-radius: 0;
                background-color: #333333;
                color: #ffffff;
            }
        }
        .project-list{
          text-align: left;
        }
        .st-title{
          color: #fff;
        }
        .btn-add {
                    background-color: #F06B1D;
                    color:#ffffff;
                    border-color: #F06B1D;
                }
    }
}
</style>
