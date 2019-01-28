
//登录
export const LOGIN_SUCCESS = 'LOGIN_SUCCESS'
export const LOGIN_FAILED = 'LOGIN_FAILED'
export const LOGOUT_USER = 'LOGOUT_USER'

//用户信息
export const USERINFO_LOADED = 'USERINFO_LOADED'
export const USERINFO_NULL = 'USERINFO_NULL'
export const USERINFO_SETTED = 'USERINFO_SETTED'

//测试
export const TEST_MESSAGE_LOADING = 'TEST_MESSAGE_LOADING'
export const TEST_MESSAGE_LOADED = 'TEST_MESSAGE_LOADED'

//科目相关
export const SUBJECT_LIST_LOADING = 'SUBJECT_LIST_LOADING'
export const SUBJECT_LIST_LOADED = 'SUBJECT_LIST_LOADED'

//学段相关
export const GRADE_LIST_LOADING = 'GRADE_LIST_LOADING'
export const GRADE_LIST_LOADED = 'GRADE_LIST_LOADED'

//分站相关
export const DEALER_LIST_LOADING = 'DEALER_LIST_LOADING'
export const DEALER_LIST_LOADED = 'DEALER_LIST_LOADED'

//权限相关
export const ROLE_LOADED = 'ROLE_LOADED';
export const ROLE_LIST_LOADED = 'ROLE_LIST_LOADED';
export const ROLE_LIST_LOADING = 'ROLE_LIST_LOADING';

//学员相关
export const STUDENT_LIST_LOADED = 'STUDENT_LIST_LOADED';
export const STUDENT_PAGE_DATA_SETTED = 'STUDENT_PAGE_DATA_SETTED';
export const SEARCH_STUDENT_LOADING = 'SEARCH_STUDENT_LOADING';
export const SEARCH_STUDENT_LOADED = 'SEARCH_STUDENT_LOADED';
export const STUDENT_SHOW_LOADING = 'STUDENT_SHOW_LOADING';
export const STUDENT_ADDED = 'STUDENT_ADDED';
export const STUDENT_EDITED = 'STUDENT_EDITED';
export const STUDENT_COUNT_LOADED = 'STUDENT_COUNT_LOADED';
export const SEND_STUDENT_ONLINE_CURRICULUM = 'SEND_STUDENT_ONLINE_CURRICULUM';
export const QUERY_STUDENT_BY_OFFLINE_TERM = 'QUERY_STUDENT_BY_OFFLINE_TERM';
//项目相关
export const QUERY_PROJECT_LIST = 'QUERY_PROJECT_LIST';
export const CHANGE_SELECTED_PROEJCT_ID = 'CHANGE_SELECTED_PROEJCT_ID';
export const SAVE_STATIC_ONLINE_PROJECT_ID = 'SAVE_STATIC_ONLINE_PROJECT_ID';
export const SAVE_STATIC_OFFLINE_PROJECT_ID = 'SAVE_STATIC_OFFLINE_PROJECT_ID';
export const SAVE_STATIC_TASK_PROJECT_ID = 'SAVE_STATIC_TASK_PROJECT_ID';
export const PROJECT_LIST_LOADING = 'PROJECT_LIST_LOADING';

//任务相关
export const TASK_SHOW_LOADING = 'TASK_SHOW_LOADING';
export const TASK_CATEGORY_LIST_LOADED = 'TASK_CATEGORY_LIST_LOADED';
export const TASK_CATEGORY_ADDED = 'TASK_CATEGORY_ADDED';
export const TASK_CATEGORY_EDITED = 'TASK_CATEGORY_EDITED';
export const TASK_CATEGORY_DELETED = 'TASK_CATEGORY_DELETED';
export const TASK_LIST_LOADED = 'TASK_LIST_LOADED';
export const TASK_ADDED = 'TASK_ADDED';
export const TASK_EDITED = 'TASK_EDITED';
export const TASK_DELETED = 'TASK_DELETED';
export const TASK_USERLIST_TY_TID = 'TASK_USERLIST_TY_TID';
export const MY_ASSIGNMENT_LOADED = 'MY_ASSIGNMENT_LOADED';
export const MY_ASSIGNMENT_LOADING = 'MY_ASSIGNMENT_LOADING';
export const READOVER_TASK = 'READOVER_TASK';

//用户管理相关
export const USER_LIST_LOADED = 'USER_LIST_LOADED';
export const USER_PAGE_DATA_SETTED = 'USER_PAGE_DATA_SETTED';
export const USER_GET_TEACHERS = 'USER_GET_TEACHERS';
export const USER_GET_STUDENT_MANAGERS = 'USER_GET_STUDENT_MANAGERS';
export const USER_ROLE_CHANGED = 'USER_ROLE_CHANGED';

//广告管理相关
export const LB_LIST_LOADED = 'LB_LIST_LOADED';
export const LB_PAGE_DATA_SETTED = 'LB_PAGE_DATA_SETTED';

//线下课
export const OFFLINE_TERM_LIST_LOADING = 'OFFLINE_TERM_LIST_LOADING';
export const OFFLINE_TERM_LIST_LOADED = 'OFFLINE_TERM_LIST_LOADED';
export const OFFLINE_CURRICULUM_LIST_LOADING = 'OFFLINE_CURRICULUM_LIST_LOADING';
export const OFFLINE_CURRICULUM_LIST_LOADED = 'OFFLINE_CURRICULUM_LIST_LOADED';
export const OFFLINE_CURRICULUM_ADDING = 'OFFLINE_CURRICULUM_ADDING';
export const OFFLINE_CURRICULUM_ADDED = 'OFFLINE_CURRICULUM_ADDED';
export const OFFLINE_CURRICULUM_DELETING = 'OFFLINE_CURRICULUM_DELETING';
export const OFFLINE_CURRICULUM_DELETED = 'OFFLINE_CURRICULUM_DELETED';
export const OFFLINE_CURRICULUM_EADITING = 'OFFLINE_CURRICULUM_EADITING';
export const OFFLINE_CURRICULUM_EADITED = 'OFFLINE_CURRICULUM_EADITED';
export const OFFLINE_SEMESTER_ADDING = 'OFFLINE_SEMESTER_ADDING';
export const OFFLINE_SEMESTER_ADDED = 'OFFLINE_SEMESTER_ADDED';
export const OFFLINE_SEMESTER_DELETING = 'OFFLINE_SEMESTER_DELETING';
export const OFFLINE_SEMESTER_DELETED = 'OFFLINE_SEMESTER_DELETED';
export const OFFLINE_SEMESTER_EADITING = 'OFFLINE_SEMESTER_EADITING';
export const OFFLINE_SEMESTER_EADITED = 'OFFLINE_SEMESTER_EADITED';
export const OFFLINE_CURRICULUM_DETAIL = 'OFFLINE_CURRICULUM_DETAIL';
export const OFFLINE_LOADING_CURRICULUM_DETAIL = 'OFFLINE_LOADING_CURRICULUM_DETAIL';
export const RECEIPT_LIST_LOADED = 'RECEIPT_LIST_LOADED';
export const OFFLINE_COURSE_RECEIPT_EADITED = 'OFFLINE_COURSE_RECEIPT_EADITED';
export const OFFLINE_TERM_VALID_UPDATED = 'OFFLINE_TERM_VALID_UPDATED';
//线上课
export const ONLINE_CURRICULUM_LIST_LOADING = 'ONLINE_CURRICULUM_LIST_LOADING';
export const ONLINE_CURRICULUM_LIST_LOADED = 'ONLINE_CURRICULUM_LIST_LOADED';
export const ONLINE_CURRICULUM_CHAPTER_LOADING = 'ONLINE_CURRICULUM_CHAPTER_LOADING';
export const ONLINE_CURRICULUM_CHAPTER_LOADED = 'ONLINE_CURRICULUM_CHAPTER_LOADED';
export const ONLINE_CURRICULUM_CHANGE_ORDERBY = 'ONLINE_CURRICULUM_CHANGE_ORDERBY';
export const ONLINE_CURRICULUM_RESET_ORDERBY = 'ONLINE_CURRICULUM_RESET_ORDERBY';
export const ONLINE_CURRICULUM_ORDERBY_SAVING = 'ONLINE_CURRICULUM_ORDERBY_SAVING';
export const ONLINE_CURRICULUM_ORDERBY_SAVED = 'ONLINE_CURRICULUM_ORDERBY_SAVED';
export const ONLINE_CURRICULUM_CHAPTER_CHANGE_ORDERBY = 'ONLINE_CURRICULUM_CHAPTER_CHANGE_ORDERBY';
export const ONLINE_CURRICULUM_CHAPTER_ORDERBY_SAVING = 'ONLINE_CURRICULUM_CHAPTER_ORDERBY_SAVING';
export const ONLINE_CURRICULUM_CHAPTER_ORDERBY_SAVED = 'ONLINE_CURRICULUM_CHAPTER_ORDERBY_SAVED';
export const ONLINE_CURRICULUM_RESET_CHAPTER_ORDERBY = 'ONLINE_CURRICULUM_RESET_CHAPTER_ORDERBY';
export const ONLINE_CURRICULUM_ADDING = 'ONLINE_CURRICULUM_ADDING';
export const ONLINE_CURRICULUM_ADDED = 'ONLINE_CURRICULUM_ADDED';
export const ONLINE_CURRICULUM_DELETING = 'ONLINE_CURRICULUM_DELETING';
export const ONLINE_CURRICULUM_DELETED = 'ONLINE_CURRICULUM_DELETED';
export const ONLINE_CURRICULUM_EDITING = 'ONLINE_CURRICULUM_EDITING';
export const ONLINE_CURRICULUM_EDITED = 'ONLINE_CURRICULUM_EDITED';
export const ONLINE_CURRICULUM_CHAPTER_SHOW_LOADING = 'ONLINE_CURRICULUM_CHAPTER_SHOW_LOADING';
export const ONLINE_CURRICULUM_VIDEO_ADDED = 'ONLINE_CURRICULUM_VIDEO_ADDED';
export const ONLINE_CURRICULUM_VIDEO_EDITED = 'ONLINE_CURRICULUM_VIDEO_EDITED';
export const ONLINE_CURRICULUM_CATALOG_DELETED = 'ONLINE_CURRICULUM_CATALOG_DELETED';
export const ONLINE_CURRICULUM_TEST_ADDED = 'ONLINE_CURRICULUM_TEST_ADDED';
export const ONLINE_CURRICULUM_TEST_EDITED = 'ONLINE_CURRICULUM_TEST_EDITED';

//讲师
export const TEACHER_LIST_LOADING = 'TEACHER_LIST_LOADING';
export const TEACHER_LIST_LOADED = 'TEACHER_LIST_LOADED';
export const TEACHER_ADDING = 'TEACHER_ADDING';
export const TEACHER_ADDED = 'TEACHER_ADDED';
export const TEACHER_SHOW_LOADING = 'TEACHER_SHOW_LOADING';
export const TEACHER_EDITED = 'TEACHER_EDITED';
export const TEACHER_DELETED = 'TEACHER_DELETED';

//城市相关
export const CITY_LIST_LOADING = 'CITY_LIST_LOADING';
export const CITY_LIST_LOADED = 'CITY_LIST_LOADED';

//通知相关
export const NOTIFICATION_SHOW_LOADING = 'NOTIFICATION_SHOW_LOADING';
export const NOTIFICATION_LOADED = 'NOTIFICATION_LOADED';
export const MODIFY_NOTIFICATION_NEED_LIMIT = 'MODIFY_NOTIFICATION_NEED_LIMIT';
export const MODIFY_NOTIFICATION_SHOW_ALL = 'MODIFY_NOTIFICATION_SHOW_ALL';
export const NOTIFICATION_LIST_LOADED = 'NOTIFICATION_LIST_LOADED';
export const NOTIFICATION_ADDED = 'NOTIFICATION_ADDED';
export const NOTIFICATION_UPDATED= 'NOTIFICATION_UPDATED';
export const NOTIFICATION_DELETED= 'NOTIFICATION_DELETED';

//私信相关
export const MESSAGE_SHOW_LOADING = 'MESSAGE_SHOW_LOADING';
export const MESSAGE_SHOW_LOADED = 'MESSAGE_SHOW_LOADED';
export const MESSAGE_STUDENT_LIST_LOADED = 'MESSAGE_STUDENT_LIST_LOADED';
export const MESSAGE_LIST_LOADED = 'MESSAGE_LIST_LOADED';
export const MESSAGE_ADDED = 'MESSAGE_ADDED';
export const MESSAGE_SELECT_STUDENT_CHANGE = 'MESSAGE_SELECT_STUDENT_CHANGE';
export const UNREAD_COUNT_LOADED = 'UNREAD_COUNT_LOADED';
export const UNREAD_COUNT_ADDED = 'UNREAD_COUNT_ADDED';

//兑换码相关
export const REDEEM_CODE_SHOW_LOADING = 'REDEEM_CODE_SHOW_LOADING';
export const CODE_VALID_UPDATED = 'CODE_VALID_UPDATED';
export const REDEEM_CODE_GROUP_LOADED = 'REDEEM_CODE_GROUP_LOADED';
export const REDEEM_CODE_GROUP_ADDED = 'REDEEM_CODE_GROUP_ADDED';

// 平台更新
export const PLATFORM_UPDATE_LOADING = 'PLATFORM_UPDATE_LOADING';
export const PLATFORM_UPDATE_LOADED = 'PLATFORM_UPDATE_LOADED';
export const PLATFORM_EDIT_LOADED = 'PLATFORM_EDIT_LOADED';
export const PLATFORM_LOADED = 'PLATFORM_LOADED';

//资料管理
export const DOWNLOAD_SHOW_LOADING = 'DOWNLOAD_SHOW_LOADING';
export const PUBLIC_DOWNLOAD_LIST_LOADED = 'PUBLIC_DOWNLOAD_LIST_LOADED';
export const CURRICULUM_DOWNLOAD_LIST_LOADED = 'CURRICULUM_DOWNLOAD_LIST_LOADED';
export const DOWNLOAD_CHANGE_PRE_CURRICULUM = 'DOWNLOAD_CHANGE_PRE_CURRICULUM';
export const DOWNLOAD_DATA_VALID_UPDATED = 'DOWNLOAD_DATA_VALID_UPDATED';
export const COURSE_DOWNLOAD_DATA_ADDED = 'COURSE_DOWNLOAD_DATA_ADDED';
export const PUBLIC_DOWNLOAD_DATA_ADDED = 'PUBLIC_DOWNLOAD_DATA_ADDED';
export const DOWNLOAD_DATA_DELETED = 'DOWNLOAD_DATA_DELETED';
export const SET_DOWNLOAD_CHANGE_PRE_GUARD = 'SET_DOWNLOAD_CHANGE_PRE_GUARD';

//面试管理
export const RECRUIT_SHOW_LOADING = 'RECRUIT_SHOW_LOADING';
export const RECRUIT_LIST_LOADED = 'RECRUIT_LIST_LOADED';
export const RECRUIT_INTERVIEW_STATE_UPDATED = 'RECRUIT_INTERVIEW_STATE_UPDATED';
export const RECRUIT_INTERVIEW_TIME_UPDATED = 'RECRUIT_INTERVIEW_TIME_UPDATED';
export const RECRUIT_INTERVIEW_RESULT_UPDATED = 'RECRUIT_INTERVIEW_RESULT_UPDATED';
export const RECRUIT_DROPPED = 'RECRUIT_DROPPED';

//产品管理
export const PRODUCTION_SHOW_LOADING = 'PRODUCTION_SHOW_LOADING';
export const PRODUCTION_LIST_LOADED = 'PRODUCTION_LIST_LOADED';
export const PRODUCTION_VALID_UPDATED = 'PRODUCTION_VALID_UPDATED';
export const PRODUCTION_ADDED = 'PRODUCTION_ADDED';
export const PRODUCTION_UPDATED = 'PRODUCTION_UPDATED';
export const PRODUCTION_DELETED = 'PRODUCTION_DELETED';
export const PRODUCTION_CURRICULUMS_LOADED = 'PRODUCTION_CURRICULUMS_LOADED';
export const PRODUCTION_CURRICULUMS_ADDED = 'PRODUCTION_CURRICULUMS_ADDED';
export const PRODUCTION_CURRICULUMS_DELETED = 'PRODUCTION_CURRICULUMS_DELETED';
export const PRODUCTION_CHANGE_PRE_GUARD = 'PRODUCTION_CHANGE_PRE_GUARD';
export const PRODUCTION_CHANGE_PRE_CURRICULUM = 'PRODUCTION_CHANGE_PRE_CURRICULUM';
export const CUR_PRODUCTION_SETTED = 'CUR_PRODUCTION_SETTED';

//产品组合
export const PRODUCTION_GROUP_SHOW_LOADING = 'PRODUCTION_GROUP_SHOW_LOADING';
export const PRODUCTION_GROUP_LIST_LOADED = 'PRODUCTION_GROUP_LIST_LOADED';
export const PRODUCTION_GROUP_VALID_UPDATED = 'PRODUCTION_GROUP_VALID_UPDATED';
export const PRODUCTION_GROUP_ADDED = 'PRODUCTION_GROUP_ADDED';
export const PRODUCTION_GROUP_UPDATED = 'PRODUCTION_GROUP_UPDATED';
export const PRODUCTION_GROUP_DELETED = 'PRODUCTION_GROUP_DELETED';
export const PRODUCTION_GROUP_PRODUCTS_LOADED = 'PRODUCTION_GROUP_PRODUCTS_LOADED';
export const PRODUCTION_GROUP_PRODUCTS_ADDED = 'PRODUCTION_GROUP_PRODUCTS_ADDED';

//清除store
export const REDEEM_CODE_CLEAR ='REDEEM_CODE_CLEAR';
export const STUDENT_CLEAR ='STUDENT_CLEAR';
export const PRODUCTION_CLEAR = 'PRODUCTION_CLEAR';

//设备相关
export const DEVICE_TYPE_SETTED = 'DEVICE_TYPE_SETTED'

//点师动态相关
export const NEWS_LIST_LOADED = 'NEWS_LIST_LOADED'
export const NEWS_SHOW_LOADING = 'NEWS_SHOW_LOADING'
export const NEWS_ADDED = 'NEWS_ADDED'
export const NEWS_UPDATED = 'NEWS_UPDATED'
export const NEWS_DELETED = 'NEWS_DELETED'