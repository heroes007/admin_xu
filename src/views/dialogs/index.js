import Vue from 'vue';
import addCourseDialog from './addCourseDialog.vue';
import addOfflineCourseDialog from './addOfflineCourseDialog.vue';
import addOfflineSemesterDialog from './addOfflineSemesterDialog.vue';
import addTeacherDialog from './addTeacherDialog.vue';
import addQuestionDialog from './addTestContentDialog.vue';
import teacherManageDialog from './teacherManageDialog.vue';
import videoManageDialog from './videoManageDialog.vue';
import editVideoDialog from './editVideoDialog.vue';
import notificationDialog from './notificationDialog.vue';
import addTaskCategoryDialog from './addTaskCategoryDialog.vue';
import addHomeworkDialog from './addHomeworkDialog.vue';
import addTaskDialog from './addTaskDialog.vue';
import manulActiveDialog from './manulActiveDialog.vue';
import addStudentDialog from './addStudentDialog.vue';
import queryStudentCourse from './queryStudentCourse.vue';
import sendOfflineCourse from './sendOfflineCourse.vue';
import queryStudentOfflineCourse from './queryStudentOfflineCourse.vue';
import queryStudentTask from './queryStudentTask.vue';
import addTaskAssignment from './addTaskAssignmentDialog.vue';
import editOfflineSignup from './editOfflineSignup.vue';
import addNotification from './addNotificationDialog.vue';
import addRemeedCode from './addRedeemCodeDialog.vue';
import remeedCodeDetail from './redeemCodeDetailDialog.vue';
import managePlatform from './managePlatform.vue';
import addDownloadDataDialog from './addDownloadDataDialog.vue';
import addUserDialog from './addUserDialog.vue';
import recruitDetailDialog from './recruitDetailDialog.vue';
import interviewTeacherArrangementDialog from './interviewTeacherArrangementDialog.vue';
import addInterviewCommentDialog from './addInterviewCommentDialog.vue';
import studentInfoDetailDialog from './studentInfoDetailDialog.vue';
import addProductionDialog from './addProductionDialog.vue';
import selectCourseDialog from './selectCourseDialog.vue';
import addProductionGroupDialog from './addProductionGroupDialog.vue';
import selectProductionDialog from './selectProductionDialog.vue';
import addNewsDialog from './addNewsDialog.vue';
import editProtocol from './editProtocol.vue';

import store from '../../store';

export var Dialog = {
    methods: {
        handleSelModal(el_name, payload) {
            switch (el_name) {
                case 'add-course':
                    initVue({
                        el_name,
                        payload,
                        component: addCourseDialog
                    });
                    break;
                case 'add-offline-course':
                    initVue({
                        el_name,
                        payload,
                        component: addOfflineCourseDialog
                    });
                    break;
                case 'add-offline-semester':
                    initVue({
                        el_name,
                        payload,
                        component: addOfflineSemesterDialog
                    });
                    break;
                case 'add-teacher':
                    initVue({
                        el_name,
                        payload,
                        component: addTeacherDialog
                    });
                    break;
                case 'add-question':
                    initVue({
                        el_name,
                        payload,
                        component: addQuestionDialog
                    });
                    break;
                case 'teacher-manage':
                    initVue({
                        el_name,
                        payload,
                        component: teacherManageDialog
                    });
                    break;
                case 'video-manage':
                    initVue({
                        el_name,
                        payload,
                        component: videoManageDialog
                    });
                    break;
                case 'edit-video':
                    initVue({
                        el_name,
                        payload,
                        component: editVideoDialog
                    });
                    break;
                case 'notification':
                    initVue({
                        el_name,
                        payload,
                        component: notificationDialog
                    });
                    break;
                case 'add-task-category':
                    initVue({
                        el_name,
                        payload,
                        component: addTaskCategoryDialog
                    });
                    break;
                case 'add-homework':
                    initVue({
                        el_name,
                        payload,
                        component: addHomeworkDialog
                    });
                    break;
                case 'add-task':
                    initVue({
                        el_name,
                        payload,
                        component: addTaskDialog
                    });
                    break;
                case 'manul-active':
                    initVue({
                        el_name,
                        payload,
                        component: manulActiveDialog
                    });
                    break;
                case 'add-student':
                    initVue({
                        el_name,
                        payload,
                        component: addStudentDialog
                    });
                    break;
                case 'query-student-course':
                    initVue({
                      el_name,
                      payload,
                      component: queryStudentCourse
                    })
                    break;
                case 'query-student-offline-course':
                    initVue({
                      el_name,
                      payload,
                      component: queryStudentOfflineCourse
                    })
                    break;
                case 'query-student-task':
                    initVue({
                      el_name,
                      payload,
                      component: queryStudentTask
                    })
                    break;
                case 'send-offline-course':
                    initVue({
                      el_name,
                      payload,
                      component: sendOfflineCourse
                    })
                    break;
                case 'add-task-assignment':
                    initVue({
                      el_name,
                      payload,
                      component: addTaskAssignment
                    })
                    break;
                case 'edit-offline-signup':
                    initVue({
                      el_name,
                      payload,
                      component: editOfflineSignup
                    })
                    break;
                case 'add-notification':
                    initVue({
                      el_name,
                      payload,
                      component: addNotification
                    })
                    break;
                case 'add-remeed-code':
                    initVue({
                      el_name,
                      payload,
                      component: addRemeedCode
                    })
                    break;
                case 'remeed-code-detail':
                    initVue({
                      el_name,
                      payload,
                      component: remeedCodeDetail
                    })
                    break;
                case 'manage-platform':
                    initVue({
                        el_name,
                        payload,
                        component: managePlatform
                    })
                    break;
                case 'add-download-data':
                    initVue({
                        el_name,
                        payload,
                        component: addDownloadDataDialog
                    })
                    break;
                case 'add-user':
                    initVue({
                        el_name,
                        payload,
                        component: addUserDialog
                    })
                    break;
                case 'recruit-detail':
                    initVue({
                        el_name,
                        payload,
                        component: recruitDetailDialog
                    })
                    break;
                case 'interview-teacher-arrangement':
                    initVue({
                        el_name,
                        payload,
                        component: interviewTeacherArrangementDialog
                    })
                    break;
                case 'add-interview-comment':
                    initVue({
                        el_name,
                        payload,
                        component: addInterviewCommentDialog
                    })
                    break;
                case 'student-info-detail':
                    initVue({
                        el_name,
                        payload,
                        component: studentInfoDetailDialog
                    })
                    break;
                case 'add-production':
                    initVue({
                        el_name,
                        payload,
                        component: addProductionDialog
                    })
                    break;
                case 'add-production-group':
                    initVue({
                        el_name,
                        payload,
                        component: addProductionGroupDialog
                    })
                    break;
                case 'select-curriculum':
                    initVue({
                        el_name,
                        payload,
                        component: selectCourseDialog
                    })
                    break;
                case 'select-production':
                    initVue({
                        el_name,
                        payload,
                        component: selectProductionDialog
                    })
                    break;
                case 'add-news':
                    initVue({
                        el_name,
                        payload,
                        component: addNewsDialog
                    })
                    break;
                case 'edit-protocol':
                    initVue({
                        el_name,
                        payload,
                        component: editProtocol
                    });
                    break;
            }
        }
    }
}

function initVue({
    el_name,
    payload,
    component
}) {
    var element = document.createElement('div');
    element.id = `${el_name}-container`;
    element.innerHTML = `<${el_name}-dialog :remove='removeNodeName' :payload='childPayload'></${el_name}-dialog>`;
    Vue.component(`${el_name}-dialog`, component);
    document.getElementById('app').appendChild(element);
    new Vue({
        data: {
            removeNodeName: element.id,
            childPayload: payload
        },
        store
    }).$mount(element);
}
