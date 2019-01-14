<template>
<div class='project-header1'>
    <Row class='header-container' type='flex' justify='space-between' align='middle'>
        <Col :span="6" class="project-list" v-if="!noSelect">
            <div class='title'>
                <Icon class="md-menu" type="md-menu" />
                <Select v-model="project_id" placeholder="请选择" @change="handleCheckProjectId" disabled>
                    <Option v-for="item in projects" :key="item.id" :label="item.name" :value="item.id">
                    </Option>
                </Select>
            </div>
        </Col>
        <Col :span="noSelect ? !showAdd ? 24 : 18 :!showAdd? 18 : 12">
            <div class="st-title">{{m_title}}</div>
        </Col>
        <Col :span="6" v-if='showAdd'>
             <Button class='btn-add' type='primary' icon="md-add" v-if='showAdd' @click="addClickHandler"> {{addText}} </Button>
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
        noSelect: {},
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
<style lang="scss" scoped>
/deep/ .ivu-btn > .ivu-icon{
    line-height: normal;
}
.project-header1 {
    height: 60px;
    background-color: #333333;
    padding-left: 25px;
    .header-container {
        height: 100%;
        .title {
            color: #ffffff;
            display: inline-flex;
            .md-menu{
                color: #ffffff;
                font-size: 24px;
                margin-right: 10px;
                line-height: 32px;
            }
            /deep/ .ivu-select-selection{
                border: none;
                background-color: #333333;
                color: #ffffff;
                font-weight: 600;
                div{
                    span{
                       font-size: 14px !important;
                    }
                }
            }
        }
        .project-list{
          text-align: left;
        }
        .st-title{
          color: #fff;
          font-weight: 600;
          font-size: 14px;
        }
        .btn-add {
            background-color: #F06B1D;
            color:#ffffff;
            border-color: #F06B1D;
            font-weight: 600;
        }
    }
}
</style>
