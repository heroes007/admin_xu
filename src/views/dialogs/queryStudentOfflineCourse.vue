<template>
<el-dialog title="查看线下课" v-model="queryStudentCourse" @close="handleRemoveModal(remove)" size="auto" :closeOnClickModal="false" :show-close="false">
    <base-input @closedialog="handleClose">
        <Row slot="body">
            <Row class="body-top" v-if="true">
                <Row type='flex' justify='center' align='middle' v-if='dataList.length === 0'>
                    该用户没有线下课
                </Row>
                <Row v-for="item in dataList" :key="item.id" class="course-item" v-if='dataList.length > 0'>
                    <!--<Col :span="4">
                        <div class="avator"><img :src="headerImage(item.teacher_img)" alt=""></div>
                        <p>{{item.teacher_name}}</p>
                    </Col>-->
                    <Col :span="16">
                        <p class="title">{{item.title}}</p>
                        <!--<p class="progress">
                          <span :style="{'width': handleResultProgress(item.video_total_count, item.see_video_ids).progress }"></span>
                          <span class="specific">{{handleResultProgress(item.video_total_count, item.see_video_ids).specific}}</span>
                        </p>-->
                    </Col>
                    <!--<Col :span="4">
                      <span>{{item.unlock ? '已解锁'  : '未解锁'}}</span>
                    </Col>-->
                </Row>
                <Row>
                    <Button type="primary" class="ok-btn" @click="queryOk">确认</Button>
                </Row>
            </Row>
        </Row>
    </base-input>
</el-dialog>
</template>

<script>
import BaseInput from '../../components/BaseInput'
import {
    RemoveModal
} from './mixins'
import UploadPanel from '../../components/UploadPanel'
import {
    get_student_detail
} from '../../api/modules/tools_student'
import {
    Loading
} from 'element-ui'
import {
    Config
} from '../../config/base'
import {
    get_student_offline_curriculum_list
} from '../../api/modules/tools_offline_curriculum'
import defaultAvator from '../../assets/img/side-menu/default-header.jpg'
export default {
    mixins: [RemoveModal],
    props: {
        remove: {
            type: String
        },
        payload: {}
    },
    components: {
        'base-input': BaseInput
    },
    data() {
        return {
            queryStudentCourse: true,
            dataList: [],
        }
    },
    methods: {
        handleClose() {
            this.queryStudentCourse = false;
        },
        handleUploadComplete(url) {
            this.form.img_url = url;
        },
        queryOk() {
            this.queryStudentCourse = false;
        },
        headerImage(v) {
            if (v) {
                return v
            } else {
                return defaultAvator
            }
        },
        handleResultProgress(total, learned){
            var resultTotal = total ? total : 0;
            return {
              progress: (learned && JSON.parse(learned).length / resultTotal) * 100 + '%',
              specific: learned && JSON.parse(learned).length + '/' + resultTotal
            }
        }
    },
    mounted() {
        this.$store.commit('STUDENT_SHOW_LOADING')
        get_student_offline_curriculum_list(this.payload.user_id,this.payload.project_id).then(res => {
            if (res.data.res_code == 1) {
                this.dataList = res.data.msg;
            }
        })
    }
}
</script>
<style lang="scss">
#query-student-offline-course-container {
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
    .el-dialog {
        width: 600px;
        background: none;

        .el-dialog__header {
            background: #333333;
            border-radius: 4px 4px 0 0;
            padding: 16px;
        }

        .el-dialog__body {
            margin-bottom: -20px;
            background-color: #fff;
            border-radius: 0 0 4px 4px;
            padding-bottom: 10px;
            .el-form-item__label {
                font-size: 14px;
                color: #141111;
                letter-spacing: 0;
            }
            .el-date-editor--date {
                width: 100%;
            }
        }
        .course-item {
            padding-bottom: 10px;
            padding-top: 10px;
            display: -webkit-box;
            /* 老版本语法: Safari 3.1-6,  iOS 6-, Android browser, older WebKit browsers.  */
            display: -moz-box;
            /* 老版本语法: Firefox 19- (buggy but mostly works) */
            display: -ms-flexbox;
            /* 混合版本语法: IE 10 */
            display: -webkit-flex;
            /* 新版本语法： Chrome 21+ */
            display: flex;
            /* 新版本语法： Opera 12.1, Firefox 22+ */
            align-items: center;
            /*老版本语法*/
            -webkit-box-align: center;
            -moz-box-align: center;
            /*混合版本语法*/
            -ms-flex-align: center;
            .avator {
                display: inline-block;
                width: 40px;
                height: 40px;
                overflow: hidden;
                border-radius: 50% 50%;
                img {
                    width: 100%;
                }
                +p{
                  text-align: center;
                  margin: 0;
                  font-size: 12px;
                }
            }
            &:hover{
              background-color: #fbfbfb;
            }
            p {
                text-align: left;
            }
            .title {
                width: 300px;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
            }
            .progress{
              width: 300px;
              height: 10px;
              border: 1px solid #E5E5E5;
              position: relative;
              background: #F6F6F6;
              span:first-child{
                position: absolute;
                left: 0;
                top: 0;
                display: inline-block;
                height: 100%;
                background-color: #79BC51;
              }
              .specific{
                display: inline-block;
                position: absolute;
                top: -4px;
                right: -50px;
              }
            }
        }
        .ok-btn {
            background: #FB843E;
            border-radius: 4px;
            width: 200px;
            height: 36px;
            border: 0;
            margin-top: 30px;
        }
    }
}
</style>
