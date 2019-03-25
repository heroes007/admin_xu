import Vue from 'vue';
import addCourseDialog from './addCourseDialog.vue';
import addOfflineCourseDialog from './addOfflineCourseDialog.vue';
import addOfflineSemesterDialog from './addOfflineSemesterDialog.vue';
import addTeacherDialog from './addTeacherDialog.vue';
import addQuestionDialog from './addTestContentDialog.vue';
import videoManageDialog from './videoManageDialog.vue';
import addTaskCategoryDialog from './addTaskCategoryDialog.vue';
import addHomeworkDialog from './addHomeworkDialog.vue';
import addTaskDialog from './addTaskDialog.vue';
import manulActiveDialog from './manulActiveDialog.vue';
import addStudentDialog from './addStudentDialog.vue';
import sendOfflineCourse from './sendOfflineCourse.vue';
import addTaskAssignment from './addTaskAssignmentDialog.vue';
import addNotification from './addNotificationDialog.vue';
import addRemeedCode from './addRedeemCodeDialog.vue';
import addDownloadDataDialog from './addDownloadDataDialog.vue';
import addUserDialog from './addUserDialog.vue';
import addInterviewCommentDialog from './addInterviewCommentDialog.vue';
import addProductionDialog from './addProductionDialog.vue';
import addProductionGroupDialog from './addProductionGroupDialog.vue';
import addNewsDialog from './addNewsDialog.vue';
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
                case 'video-manage':
                    inits(videoManageDialog);
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
                case 'send-offline-course':
                    inits(sendOfflineCourse);
                    break;
                case 'add-task-assignment':
                    inits(addTaskAssignment);
                    break;
                case 'add-notification':
                    inits(addNotification);
                    break;
                case 'add-remeed-code':
                    inits(addRemeedCode);
                    break;
                case 'add-download-data':
                    inits(addDownloadDataDialog);
                    break;
                case 'add-user':
                    inits(addUserDialog);
                    break;
                case 'add-interview-comment':
                    inits(addInterviewCommentDialog);
                    break;
                case 'add-production':
                    inits(addProductionDialog);
                    break;
                case 'add-production-group':
                    inits(addProductionGroupDialog);
                    break;
                case 'add-news':
                    inits(addNewsDialog);
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
