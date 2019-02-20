<template>
    <div class='project-header1'>
        <Row class='header-container' type='flex' justify='space-between' align='middle'>
            <Col :span="6" class="project-list" v-if="!noSelect">
                <div class='title'>
                    <Icon class="md-menu" type="md-menu"/>
                    <Select v-model="project_id" placeholder="请选择" @on-change="handleCheckProjectId" disabled>
                        <Option v-for="item in projects" :key="item.id" :label="item.name" :value="item.id">
                        </Option>
                    </Select>
                </div>
            </Col>
            <Col :span="noSelect ? !showAdd ? 24 : 18 :!showAdd? 18 : 12">
                <div class="st-title">{{m_title}}</div>
            </Col>
            <Col :span="6" v-if='showAdd'>
                <Button class='btn-add' type='primary' icon="md-add" v-if='showAdd' @click="addClickHandler">
                    {{addText}}
                </Button>
                <Poptip ref="teacherList" placement="bottom-end" width="500" trigger="click"
                        popper-class='teacher-list'>
                    <Row slot="title" class='teacher-list-head'>
                        <div class='head'>全部证书</div>
                        <Button class="teacher-list-head-btn" type='text' icon='md-add' @click='addCertificateHandle'>
                            添加
                        </Button>
                    </Row>
                    <div slot="content" class='teacher-list-container'>
                        <Row type='flex'>
                            <Col v-for='item in certificateListData' :key="item.id" :span='4'>
                                <teacher-head :tid='item.id' :img-url='item.img_url' :teacher-name='item.name' :type="1"/>
                            </Col>
                        </Row>
                    </div>
                    <Button class='btn-teacher' type='text' v-if="type === 1">证书设置</Button>
                </Poptip>
            </Col>
        </Row>
    </div>
</template>
<script>
  import { get_certificate_list } from '../api/modules/tools_product.js'
  import TeacherItem from './TeacherItem'
  import { Dialog } from '../views/dialogs'
  import { ADD_CERTIFICATE } from '../views/dialogs/types'
  import { mapActions, mapState, mapGetters } from 'vuex';


  export default {
    mixins: [Dialog],
    data() {
      return {
        m_title: this.title,
        isSelected: false,
        // certificateListData: []
      }
    },
    components: { 'teacher-head': TeacherItem },
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
      addText: {
        type: String
      },
      type: {
        type: Number,
        default: 0
      }
    },
    computed: {
      ...mapState({
        certificateListData:state => state.production.certificate_list
      }),
      projects() {
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
    mounted(){
      this.get_certificate_list()
      // get_certificate_list().then(res => {
      //   this.certificateListData = res.data.data
      // })
    },
    methods: {
      ...mapActions([ 'get_certificate_list' ]),
      addClickHandler() {
        this.$emit('addClick');
      },
      addCertificate() {
        this.$emit('addCert')
      },
      handleCheckProjectId(v) {
        if (this.isSelected) {
          this.$emit('reRenderList', v);
          this.isSelected = true;
        }
      },
      addCertificateHandle() {
        this.handleSelModal(ADD_CERTIFICATE);
      }
    }
  }
</script>
<style lang="scss" scoped>
    /deep/ .ivu-btn > .ivu-icon {
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

                .md-menu {
                    color: #ffffff;
                    font-size: 24px;
                    margin-right: 10px;
                    line-height: 32px;
                }

                /deep/ .ivu-select-selection {
                    border: none;
                    background-color: #333333;
                    color: #ffffff;
                    font-weight: 600;

                    div {
                        span {
                            font-size: 14px !important;
                        }
                    }
                }
            }

            .project-list {
                text-align: left;
            }

            .st-title {
                color: #fff;
                font-weight: 600;
                font-size: 14px;
            }

            .btn-add {
                background-color: #3DAAFF;
                color: #ffffff;
                border-color: #3DAAFF;
                font-weight: 600;
            }
        }
    }

    .btn-teacher {
        color: #ffffff;

        i {
            margin-right: 5px;
        }
    }

    .teacher-list-head{
        display: flex;
        text-align: center;
        justify-content: center;
    }
    .teacher-list-head-btn{
        position: absolute;
        right: 0;
        top: 50%;
        transform: translateY(-50%);
    }

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
        }

        .teacher-list-container {
            padding: 30px 0;
        }
    }

</style>
