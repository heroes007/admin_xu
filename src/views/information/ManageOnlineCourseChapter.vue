<template>
    <div class='manage-online-course-chapter'>
        <header-component :show-add='false' />
        <Row class='course-name' type='flex' justify='space-between' align='middle'>
            <div>
                <h2>课程：{{curriculumName}}</h2>
            </div>
            <div>
                <Button type='text' @click='backClickHandler'>返回</Button>
            </div>
        </Row>
        <div class='chapter-container'>
            <div class='scroll-wrap'>
                <div class='chapter-list'>
                    <div class='chapter-item' v-for='(item,index) in chapterList'>
                        <div @click="toggleListShow(index)">
                            <Row class='chapter-title' type='flex' justify='space-between' align='middle'>
                                <div>
                                    <span>第{{index + 1}}章</span>
                                    <h3>{{item.group_name}}</h3>
                                </div>
                                <div>
                                    <i class='el-icon-arrow-down' v-if='showListState[index] == 0'></i>
                                    <i class='el-icon-arrow-up' v-else-if='showListState[index] == 1'></i>
                                </div>
                            </Row>
                        </div>
                        <data-list @edit='editHandler' @moveUp='moveUpHandler' @moveDown='moveDownHandler' @delete='deleteHandler' class='data-list light-header'
                            :table-data='item.classList' :header-data='dataHeader' :column-formatter='listColumnFormatter' :column-formatter-data='listColumnFormatterData' :is-stripe='false'
                            v-show='showListState[index] == 1 && item.classList.length > 0'></data-list>
                            <Row class='chapter-btns' type='flex' justify='space-between' align='middle' v-if='showListState[index] == 1 || (index == chapterList.length - 1 && !newChapterData.showAddChapter)'>
                                <div>
                                    <Button type='text' icon='plus' v-if='index == chapterList.length - 1 && !newChapterData.showAddChapter' @click.stop='addChapterHandler'>添加章节</Button>
                                </div>
                                <Row type='flex' align='middle' v-if='showListState[index] == 1'>
                                    <Button type='text' @click="addVideo(item)">添加视频</Button>
                                    <div class='line'></div>
                                    <Button type='text' @click="addTest(item)">添加测验</Button>
                                    <!--<div class='line'></div>
                                    <Button type='text' @click="handleSelModal('video-manage')">添加问卷</Button>-->
                                </Row>
                            </Row>
                    </div>
                    <div class='chapter-item' v-if='newChapterData.showAddChapter'>
                        <Row class='chapter-title' type='flex' justify='space-between' align='middle'>
                            <div>
                                <span>第{{chapterList.length + 1}}章</span>
                                <input v-model="newChapterData.group_name" placeholder="请输入章节名称" @click.stop/>
                            </div>
                            <div>
                                <i class='el-icon-arrow-up'></i>
                            </div>
                        </Row>
                        <Row class='chapter-btns' type='flex' justify='space-between' align='middle'>
                            <div>
                                <span class='warning'>请至少添加一个视频或测验，否则章节信息将无法保存成功。取消添加请点击返回。</span>
                            </div>
                            <Row type='flex' align='middle'>
                                <Button type='text' @click="addVideo()">添加视频</Button>
                                <div class='line'></div>
                                <Button type='text' @click="addTest()">添加测验</Button>
                                <!--<div class='line'></div>
                                <Button type='text' @click="handleSelModal('video-manage')">添加问卷</Button>-->
                            </Row>
                        </Row>
                    </div>
                </div>
            </div>
        </div>
        <save-order v-if='dirty' @saveOrder='saveOrderHandler' @cancelChange='resetOrder' />
    </div>
</template>

<script>
    import Header from '../../components/ProjectHeader'
    import BaseList from '../../components/BaseList'
    import SaveOrder from '../../components/SaveOrder'
    import { doTimeFormat } from '../../components/Util'
    import { Dialog } from '../dialogs'
    import { VIDEO_MANAGE, ADD_QUESTION } from '../dialogs/types'
    import { Config } from '../../config/base'
    import { doSortFormatCatalogList } from '../../components/Util'
    export default {
        mixins: [Dialog],
        data() {
            return {
                data: [
                    { id: 1, title: '老师也要学点管理学', createtime: '2016-10-27T02:51:43.000Z', grade: 1, subject: 1 },
                    { id: 2, title: '好老师，懂孩子', createtime: '2016-10-27T02:51:43.000Z', grade: 1, subject: 1 }
                ],
                dirty: false,
                showListState: {},
                newChapterData: {
                    showAddChapter: false,
                    group_name: '',
                    group_orderby: -1
                },
                isInited: false,
                isChapterInited: false
            }
        },
        computed: {
            roleList() {
                return this.$store.state.roles.role_list;
            },
            dataHeader() {
                return [
                    { label: '排序', width: 90, sort: true },
                    {
                        prop: '', label: '小节名称', mixColumn: true, mixFunc: (function (data) {
                            return data.video_title ? data.video_title : '' + data.video_test_title ? data.video_test_title : '';
                        })
                    },
                    {
                        prop: '',
                        label: '观看权限',
                        width: 200,
                        mixColumn: true,
                        useFormatter:true,
                        mixprop:'mix_role',
                        mixFunc: (function (data) {
                            var roles;
                            if (data.type === 0) {
                                roles = data.video_role;
                            }
                            else if (data.type === 1) {
                                roles = data.video_test_role;
                            }
                            return roles;
                        })
                    },
                    { prop: 'create_time', label: '创建时间', width: 200 },
                    {
                        label: '操作', width: 350, groupBtn: [{ text: '编辑', param: 'edit' },
                        { text: 'el-icon-caret-top', param: 'moveUp', hoverShow: true, isIcon: true },
                        { text: 'el-icon-caret-bottom', param: 'moveDown', hoverShow: true, isIcon: true },
                        { text: 'el-icon-delete', param: 'delete', hoverShow: true, isIcon: true }]
                    }
                ]
            },
            listColumnFormatter() {
                return [{ columnName: 'create_time', doFormat: doTimeFormat },
                {
                columnName: 'mix_role',
                dataIndex: 0,
                dataProp: 'id',
                dataValue: 'name'
            }, ]
            },
            listColumnFormatterData() {
                return [this.roleList];
            },
            isLoading() {
                return this.$store.state.online_curriculum.showChapterLoading;
            },
            curriculumName() {
                var curriculumList = this.$store.state.online_curriculum.online_curriculum_list;
                var curriculumId = this.$route.params.id;

                for (var i = 0; i < curriculumList.length; i++) {
                    if (curriculumList[i].curriculum_id == curriculumId) {
                        return curriculumList[i].title;
                    }
                }
                return '';
            },
            chapterList() {
                var curriculumList = this.$store.state.online_curriculum.online_curriculum_list;
                var curriculumId = this.$route.params.id;
                for (var i = 0; i < curriculumList.length; i++) {
                    if (curriculumList[i].curriculum_id == curriculumId) {
                        return doSortFormatCatalogList(curriculumList[i].chapterList);
                    }
                }
                return [];
            },
            curriculumList() {
                return this.$store.state.online_curriculum.online_curriculum_list;
            }
        },
        watch: {
            isLoading(val) {
               this.$config.IsLoading(val);
            },
            chapterList(list) {

                if (list.length === 0) {
                    this.newChapterData.showAddChapter = true;
                    this.newChapterData.group_orderby = 1;
                }
                else {
                    this.newChapterData.showAddChapter = false;
                    this.newChapterData.group_orderby = list[list.length - 1].group_orderby + 1;
                    this.newChapterData.group_name = '';
                }

                this.setChapterShowState();
            },
            curriculumList(val) {
                if (!this.isInited)
                    this.initChapter();
            }
        },
        methods: {
            editHandler(index, row) {
                if (row.type === 0) {
                    this.handleSelModal(VIDEO_MANAGE, {
                        curriculum_id: row.curriculum_id,
                        group_name: row.group_name,
                        group_orderby: row.group_orderby,
                        video_id: row.video_id
                    });
                }
                else if (row.type === 1) {
                    this.handleSelModal(ADD_QUESTION, {
                        curriculum_id: row.curriculum_id,
                        group_name: row.group_name,
                        group_orderby: row.group_orderby,
                        video_test_id: row.video_test_id
                    });
                }
            },
            moveUpHandler(index, row) {
                this.dirty = true;
                this.$store.dispatch('change_online_curriculum_chapter_orderby', { curriculum_id: this.$route.params.id, dir: 0, catalog_id: row.catalog_id, group_orderby: row.group_orderby });
            },
            moveDownHandler(index, row) {
                this.dirty = true;
                this.$store.dispatch('change_online_curriculum_chapter_orderby', { curriculum_id: this.$route.params.id, dir: 1, catalog_id: row.catalog_id, group_orderby: row.group_orderby });
            },
            deleteHandler(index, row) {
                if (this.dirty) {
                  this.$Modal.confirm({
                    title: '提示',
                    content: '<p>您已修改小节排序，是否放弃保存</p>',
                    onOk: () => {
                      this.resetOrder();
                      this.showDeleteConfirm(row.curriculum_id, row.catalog_id);
                    },
                  });
                }
                else {
                    this.showDeleteConfirm(row.curriculum_id, row.catalog_id);
                }
            },
            showDeleteConfirm(curriculum_id, catalog_id) {
              this.$Modal.confirm({
                title: '提示',
                content: '<p>是否确定删除该小节？</p>',
                onOk: () => {
                  this.$store.dispatch('delete_online_curriculum_catalog', { curriculum_id: curriculum_id, catalog_id: catalog_id })
                },
              });
            },
            toggleListShow(index) {
                this.showListState[index] = 1 - this.showListState[index];
            },
            addChapterHandler() {
                this.newChapterData.showAddChapter = true;
            },
            saveOrderHandler() {
                this.$store.dispatch('save_online_curriculum_chapter_orderby', { curriculum_id: this.$route.params.id })
            },
            resetOrder() {
                this.$store.dispatch('reset_online_curriculum_chapter_orderby', { curriculum_id: this.$route.params.id })
                this.dirty = false;
            },
            backClickHandler() {
                if (this.dirty)
                    this.resetOrder();
                this.$router.replace({ name: 'online-course' });
            },
            initChapter() {
                this.newChapterData.showAddChapter = false;
                this.dirty = false;
                if (this.chapterList.length === 0) {
                    this.$store.dispatch('get_online_curriculum_chapter_list', { curriculum_id: this.$route.params.id })
                }
                else {
                    this.setChapterShowState();
                }
                this.isInited = true;
            },
            setChapterShowState() {
                var i;
                if (!this.isChapterInited && this.chapterList.length > 0) {
                    for (i = 0; i < this.chapterList.length; i++) {
                        this.$set(this.showListState, i, 0);
                    }
                    this.isChapterInited = true;
                }
                if (this.showListState[this.chapterList.length - 1] == undefined) {
                    for (i = 0; i < this.chapterList.length; i++) {
                        if (this.showListState[i] == undefined)
                            this.$set(this.showListState, i, 1);
                    }
                }
            },
            addVideo(item) {
                if (!item) {
                    if (this.newChapterData.group_name) {
                        this.handleSelModal(VIDEO_MANAGE, {
                            curriculum_id: parseInt(this.$route.params.id),
                            group_name: this.newChapterData.group_name,
                            group_orderby: this.newChapterData.group_orderby,
                            orderby: 1
                        })
                    }
                    else {
                      this.$Modal.info({
                        title: '提示',
                        content: '<p>请先添加章节名称</p>'
                      });
                    }
                }
                else {
                    this.handleSelModal(VIDEO_MANAGE, {
                        curriculum_id: item.curriculum_id,
                        group_name: item.group_name,
                        group_orderby: item.group_orderby,
                        orderby: item.classList[item.classList.length - 1].orderby + 1
                    });
                }

            },
            addTest(item) {
                if (!item) {
                    if (this.newChapterData.group_name) {
                        this.handleSelModal(ADD_QUESTION, {
                            curriculum_id: parseInt(this.$route.params.id),
                            group_name: this.newChapterData.group_name,
                            group_orderby: this.newChapterData.group_orderby,
                            orderby: 1
                        })
                    }
                    else {
                      this.$Modal.info({
                        title: '提示',
                        content: '<p>请先添加章节名称</p>'
                      });
                    }
                }
                else {
                    this.handleSelModal(ADD_QUESTION, {
                        curriculum_id: item.curriculum_id,
                        group_name: item.group_name,
                        group_orderby: item.group_orderby,
                        orderby: item.classList[item.classList.length - 1].orderby + 1
                    });
                }
            }
        },
        mounted() {
            if (this.$store.state.online_curriculum.online_curriculum_list.length === 0) {
                this.$store.dispatch('get_online_curriculum_list', { project_id: this.$store.state.project.select_project_id });
            }
            else {
                this.initChapter();
            }
            this.$store.dispatch('get_role_list');
        },
        components: {
            'header-component': Header,
            'data-list': BaseList,
            'save-order': SaveOrder
        }
    }

</script>
<style scoped lang='scss'>
    .manage-online-course-chapter {
        .course-name {
            height: 60px;
            background-color: #ffffff;
            padding: 0 40px;
            h2 {
                font-size: 16px;
                color: #141111;
                letter-spacing: 0;
                font-weight: 400;
            }
        }
        .data-list {
            .base-list-row {
                .handle-component {
                    margin-right: 30px;
                    +.handle-component {
                        margin-right: 2px;
                    }
                    &:last-child {
                        margin-left: 50px;
                    }
                }
            }
        }
        .chapter-container {
            box-sizing: border-box;
            width: 100%;
            height: 100%;
            top: 0;
            padding-top: 120px;
            position: absolute;
            z-index: 0;
            pointer-events: none;
            .scroll-wrap {
                overflow-y: scroll;
                height: 100%;
                width: 100%;
                pointer-events: auto;
            }
        }
        .chapter-list {
            .chapter-item {
                .chapter-title {
                    padding: 0 40px;
                    background-color: #FBFBFB;
                    border: 1px solid #E5E5E5;
                    height: 60px;
                    span,
                    h3 {
                        font-size: 16px;
                        color: #141111;
                        letter-spacing: 0;
                        font-weight: 400;
                        display: inline-block;
                    }
                    input {
                        outline: 0;
                        font-size: 16px;
                        color: #141111;
                        letter-spacing: 0;
                        border: 0;
                        background-color: transparent;
                    }
                    i {
                        color: #cccccc;
                        cursor: pointer;
                    }
                }
                .chapter-btns {
                    margin-top: 25px;
                    padding: 0 40px;
                    .warning {
                        font-size: 14px;
                        color: #F06B1D;
                    }
                    .el-button {
                        font-size: 14px;
                        color: #3B3B3B;
                        letter-spacing: 0;
                        &:hover {
                            color: #F06B1D;
                        }
                    }
                    .line {
                        width: 1px;
                        background-color: #e5e5e5;
                        height: 14px;
                        display: inline-block;
                        margin: 0 8px;
                    }
                }
            }
        }
        .save-order {
            position: absolute;
            right: 100px;
            top: 70px;
        }
    }
</style>
