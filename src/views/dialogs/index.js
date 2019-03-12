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
import addCertificateDialog from './addCertificateDialog.vue';
import addHouner from './addHouner.vue';
import sendHouner from './sendHouner.vue';
import readOver from './readOver.vue';

import store from '../../store';

export var Dialog = {
    methods: {
        handleSelModal(el_name, payload) {
            let inits = (com) => {
                return  initVue({
                    el_name,
                    payload,
                    component: com
                })
            }
            switch (el_name) {
                case 'add-course':
                    inits(addCourseDialog);
                    break;
                case 'add-offline-course':
                    inits(addOfflineCourseDialog);
                    break;
                case 'add-offline-semester':
                    inits(addOfflineSemesterDialog);
                    break;
                case 'add-teacher':
                    inits(addTeacherDialog);
                    break;
                case 'add-certificate':
                    inits(addCertificateDialog);
                    break
                case 'add-question':
                    inits(addQuestionDialog);
                    break;
                case 'teacher-manage':
                    inits(teacherManageDialog);
                    break;
                case 'video-manage':
                    inits(videoManageDialog);
                    break;
                case 'edit-video':
                    inits(editVideoDialog);
                    break;
                case 'notification':
                    inits(notificationDialog);
                    break;
                case 'add-task-category':
                    inits(addTaskCategoryDialog);
                    break;
                case 'add-homework':
                    inits(addHomeworkDialog);
                    break;
                case 'add-task':
                    inits(addTaskDialog);
                    break;
                case 'manul-active':
                    inits(manulActiveDialog);
                    break;
                case 'add-student':
                    inits(addStudentDialog);
                    break;
                case 'query-student-course':
                    inits(queryStudentCourse);
                    break;
                case 'query-student-offline-course':
                    inits(queryStudentOfflineCourse);
                    break;
                case 'query-student-task':
                    inits(queryStudentTask);
                    break;
                case 'send-offline-course':
                    inits(sendOfflineCourse);
                    break;
                case 'add-task-assignment':
                    inits(addTaskAssignment);
                    break;
                case 'edit-offline-signup':
                    inits(editOfflineSignup);
                    break;
                case 'add-notification':
                    inits(addNotification);
                    break;
                case 'add-remeed-code':
                    inits(addRemeedCode);
                    break;
                case 'remeed-code-detail':
                    inits(remeedCodeDetail);
                    break;
                case 'manage-platform':
                    inits(managePlatform);
                    break;
                case 'add-download-data':
                    inits(addDownloadDataDialog);
                    break;
                case 'add-user':
                    inits(addUserDialog);
                    break;
                case 'recruit-detail':
                    inits(recruitDetailDialog);
                    break;
                case 'interview-teacher-arrangement':
                    inits(interviewTeacherArrangementDialog);
                    break;
                case 'add-interview-comment':
                    inits(addInterviewCommentDialog);
                    break;
                case 'student-info-detail':
                    inits(studentInfoDetailDialog);
                    break;
                case 'add-production':
                    inits(addProductionDialog);
                    break;
                case 'add-production-group':
                    inits(addProductionGroupDialog);
                    break;
                case 'select-curriculum':
                    inits(selectCourseDialog);
                    break;
                case 'select-production':
                    inits(selectProductionDialog);
                    break;
                case 'add-news':
                    inits(addNewsDialog);
                    break;
                case 'edit-protocol':
                    inits(editProtocol);
                    break;
                case 'add-houner':
                    inits(addHouner);
                    break;
                case 'send-houner':
                    inits(sendHouner);
                    break;
                case 'read-over':
                    inits(readOver);
                    break;
            }
        }
    }
}
function initVue({ el_name, payload, component}) {
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
