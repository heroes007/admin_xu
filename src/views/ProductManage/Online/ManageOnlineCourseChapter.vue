<template>
    <div class='manage-online-course-chapter'>
        <screen :types="6" btn-name="添加章节" @handleClick="handleClick" @handleBack="handleBack" :title="screenTitle"
                :btn-type="btnType"/>
        <div class='chapter-container'>
            <div class='scroll-wrap'>
                <div class='chapter-list'>
                    <div class='chapter-item' v-for='(item,index) in chapterList'>
                        <div>
                            <Row class='chapter-title' type='flex' justify='space-between' align='middle'>
                                <div style="display: flex;align-items: center">
                                    <span class="row-title">第{{setIndex(index + 1)}}章</span>
                                    <Input v-model="item.group_name" @on-change="editorNote(item, index)"
                                           @on-blur="outInput(index)" @on-focus="showDataState(index)" class="textInput"
                                           style="width: 300px;"/>
                                </div>
                                <div style="margin-right: 25px;">
                                    <Button v-if='showListState[index] == 0' type="text"
                                            @click="toggleListShow(index,item)">展开
                                    </Button>
                                    <Button v-else-if='showListState[index] == 1' type="text"
                                            @click="toggleListShow(index)">收起
                                    </Button>
                                    <Button v-if="btnType" type='text' @click="addVideo(item,index)">添加视频</Button>
                                    <Button v-if="btnType" type='text' @click="addTest(item, index)">添加测验</Button>
                                    <Button v-if="btnType" type='text' @click="addCase(item, index)">添加案例</Button>
                                    <Button v-if="btnType" type='text' @click="moveUpList(item, index)">上移</Button>
                                    <Button v-if="btnType" type='text' @click="moveDownList(item, index)">下移</Button>
                                    <Button v-if="btnType" type="text" @click="deleteText(item, index)">删除</Button>
                                </div>
                            </Row>
                        </div>
                        <data-list @edit='editHandler' @moveUp='moveUpHandler' @moveDown='moveDownHandler'
                                   @delete='deleteHandler' class='data-list light-header' :order-num="index"
                                   :table-data='item.children' :header-data='dataHeader' :is-stripe='false'
                                   v-if='showListState[index] == 1 && item.hasOwnProperty("children") && item.children.length > 0'></data-list>
                    </div>
                    <div class='chapter-item' v-if='newChapterData.showAddChapter'>
                        <Row class='chapter-title' type='flex' justify='space-between' align='middle'>
                            <div style="display: flex;align-items: center">
                                <span class="row-title">第{{setIndex(chapterList.length + 1)}}章</span>
                                <Input v-model="newChapterData.group_name"
                                       @on-enter.stop="saveChapter(newChapterData,true,1)"
                                       @on-blur.stop="saveChapter(newChapterData,true)" placeholder="请输入章节名称"
                                       @on-focus="showDataState(chapterList.length)" class="textInput"
                                       style="width: 300px;"/>
                            </div>
                        </Row>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import screen from '../../../components/ScreenFrame'
    import BaseList from '../../../components/BaseList'
    import postData from '../../../api/postData'
    import {doTimeFormat} from '../../../components/Util'
    import {Dialog} from '../../dialogs'
    import {VIDEO_MANAGE, ADD_QUESTION} from '../../dialogs/types'
    import {Config} from '../../../config/base'
    import {doSortFormatCatalogList} from '../../../components/Util'
    import updateVideoGroupName from '../../../api/modules/onlineCourseChapter'
    import setAuthMixins from '../setAuthMixins'

    export default {
        mixins: [Dialog, setAuthMixins],
        components: {'data-list': BaseList, screen},
        data() {
            return {
                dirty: false,
                showListState: {},
                newChapterData: {
                    showAddChapter: false,
                    group_name: '',
                    group_orderby: -1
                },
                isInited: false,
                isChapterInited: false,
                curriculumItem: {},
                screenTitle: '',
                isTrue: true,
            }
        },
        computed: {
            dataHeader() {
                let d = {
                    label: '操作', width: 450, groupBtn: [
                        {text: '编辑', param: 'edit'},
                        {text: '上移', param: 'moveUp'},
                        {text: '下移', param: 'moveDown'},
                        {text: '删除', param: 'delete'}]
                };
                let da = [
                    {label: '顺序', width: 130, prop: 'node_number'},
                    {prop: 'group_name', label: '小节名称', align: 'left'},
                ]
                if (this.btnType) da.push(d)
                return da
            },
            listColumnFormatter() {
                return [
                    {columnName: 'create_time', doFormat: doTimeFormat},
                    {
                        columnName: 'mix_role',
                        dataIndex: 0,
                        dataProp: 'id',
                        dataValue: 'name'
                    },
                ]
            },
            isLoading() {
                return this.$store.state.online_curriculum.showChapterLoading;
            },
            curriculumName() {
                var curriculumList = this.$config.copy(this.$store.state.online_curriculum.online_curriculum_list, []);
                if (Array.isArray(curriculumList) && curriculumList.length > 0) {
                    var curriculumId = this.$route.params.id;
                    for (var i = 0; i < curriculumList.length; i++) {
                        if (curriculumList[i].curriculum_id == curriculumId) return curriculumList[i].title;
                    }
                }
                return '';
            },
            chapterList() {
                var curriculumList = this.$config.copy(this.$store.state.online_curriculum.online_curriculum_list, []);
                if (Array.isArray(curriculumList) && curriculumList.length > 0) {
                    var curriculumId = this.$route.params.id;
                    curriculumList.map((t, i) => {
                        if (t.children && t.children.length > 0) {
                            t.children.map((m, k) => {
                                m.node_number = '第' + (k + 1) + '节'
                            })
                        }
                    })
                }
                return curriculumList || [];
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
                if (Array.isArray(list)) {
                    if (list.length === 0) {
                        this.newChapterData.showAddChapter = true;
                        this.newChapterData.group_orderby = 1;
                    } else {
                        this.newChapterData.showAddChapter = false;
                        this.newChapterData.group_orderby = list[list.length - 1].group_orderby + 1;
                        this.newChapterData.group_name = '';
                    }
                    this.setChapterShowState();
                }
            },
            curriculumList(val) {
                if (!this.isInited) this.initChapter();
            },
            $route(to, from) {
                if (this.$route.name == "online-course-chapter") this.getLists()
            }
        },
        beforeDestroy() {
            this.setChapter = null;
            this.saveChapter = null;
            this.showDataState = null;
            this.editorNote = null;
            this.openModal = null;
            this.moveHandler = null;
            this.moveUpHandler = null;
            this.moveDownHandler = null;
            this.deleteHandler = null;
            this.initChapter = null;
            this.setChapterShowState = null;
            this.addVideo = null;
            this.addTest = null;
            this.deleteHandler = null;
            this.editHandler = null;
        },
        methods: {
            saveChapter2(t, i) {
            },
            setIndex(n) {
                return this.$config.ArabiaToSimplifiedChinese(n)
            },
            setChapter(t, i) {
                let d = {}
                d.curriculum_id = +this.$route.params.id
                d.curriculum_online_id = +this.$route.params.id
                if (i === true) {
                    d.group_name = t.group_name
                } else {
                    d = t
                    delete d.duration
                    delete d.video_url
                }
                if (d.group_name) this.$store.dispatch('add_online_curriculum_chapter', d)
                else this.$Message.warning('请输入章节的名称');
            },
            saveChapter(t, i, type) {
                if (this.isTrue) this.setChapter(t, i);
                if (type) {
                    this.isTrue = false
                    setTimeout(() => {
                        this.isTrue = true;
                    }, 500)
                }
            },
            handleClick(val) {
                this.newChapterData.showAddChapter = true;
            },
            handleBack() {
                // if (this.dirty) this.resetOrder();
                this.$router.replace({name: 'open-product'});
            },
            showDataState(i) {
                // this.showListState[i] = 0
                document.querySelectorAll('.ivu-input')[i].style.backgroundColor = '#fff'
                this.$set(this.showListState, i, 0);
            },
            outInput(index) {
                document.querySelectorAll('.ivu-input')[index].style.backgroundColor = '#FBFBFB'
            },
            editorNote(val, nums) {
                let d = {
                    id: val.id,
                    group_name: val.group_name
                }
                updateVideoGroupName(d).then((res) => {
                    if (res.data.res_code === 1) {
                        // this.$Message.success(res.data.msg);
                    }
                })
            },
            openModal(modal, row, type) {
                let item = type == 1 ? {video_id: row.video_id} : {video_test_id: row.video_test_id}
                this.handleSelModal(modal, {
                    curriculum_id: row.curriculum_id,
                    group_name: row.group_name,
                    group_orderby: row.group_orderby,
                    ...item
                });
            },
            moveHandler(row, type) {
                this.dirty = true;
                this.$store.dispatch('change_online_curriculum_chapter_orderby', {
                    curriculum_id: this.$route.params.id,
                    dir: type,
                    catalog_id: row.catalog_id,
                    group_orderby: row.group_orderby
                });
            },
            moveUpHandler(i, row, index) {
                if (i == 0) {
                    this.$Modal.info({
                        title: '提示',
                        content: '无法上移'
                    });
                } else {
                    this.$store.dispatch('change_online_curriculum_list', {id: row.id, i, direction: 0, index})
                }
            },
            moveDownHandler(i, row, index) {
                if (i == this.chapterList[index].children.length - 1) {
                    this.$Modal.info({
                        title: '提示',
                        content: '无法下移'
                    });
                } else {
                    this.$store.dispatch('change_online_curriculum_list', {id: row.id, i, direction: 1, index})
                }
            },
            deleteHandler(index, row) {
                var val = {
                    id: row.id,
                    curriculum_online_id: parseInt(this.$route.params.id)
                }
                this.$config.deleteModal(() => {
                    this.$store.dispatch('delete_online_curriculum_catalog', val)
                })
            },
            toggleListShow(index, t) {
                this.showListState[index] = 1 - this.showListState[index];
            },
            addChapterHandler() {
                this.newChapterData.showAddChapter = true;
            },
            initChapter() {
                this.screenTitle = this.$route.params.title
                this.newChapterData.showAddChapter = false;
                this.dirty = false;
                this.$store.dispatch('get_online_curriculum_chapter_list', {curriculum_online_id: parseInt(this.$route.params.id)})
                // if (this.chapterList.length === 0) this.$store.dispatch('get_online_curriculum_chapter_list', {curriculum_online_id: parseInt(this.$route.params.id)})
                // else this.setChapterShowState();
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
                        if (this.showListState[i] == undefined) this.$set(this.showListState, i, 0);
                    }
                }
            },
            addVideo(item, index) {
                if (!item) {
                    this.$Modal.info({title: '提示', content: '<p>请先添加章节名称</p>'});
                } else {
                    this.handleSelModal(VIDEO_MANAGE, {
                        curriculum_online_id: +this.$route.params.id,
                        curriculum_id: item.curriculum_id,
                        parent_id: item.id,
                        group_name: item.group_name,
                        group_orderby: item.group_orderby,
                        orderby: item.orderby + 1,
                        i: index,
                        type: 0
                    });
                }
            },
            // 测验操作
            addTest(item, index) {
                if (!item) {
                    this.$Modal.info({title: '提示', content: '<p>请先添加章节名称</p>'});
                } else {
                    this.handleSelModal(ADD_QUESTION, {
                        curriculum_online_id: parseInt(this.$route.params.id),
                        curriculum_data: item,
                        group_orderby: item.id,
                        section_id: '',
                        i: index,
                        type: 1,
                        modalTitle: '添加测验'
                        // curriculum_catalog_id: item.id,
                        // curriculum_id: item.curriculum_id,
                        // orderby: item.orderby + 1,
                        // list_index: index,
                        // group_name: item.group_name,
                    });
                }
            },
            // 测验案例
            addCase(item, index) {
                if (!item) {
                    this.$Modal.info({title: '提示', content: '<p>请先添加章节名称</p>'});
                } else {
                    this.handleSelModal(ADD_QUESTION, {
                        curriculum_online_id: parseInt(this.$route.params.id),
                        curriculum_data: item,
                        group_orderby: item.id,
                        section_id: '',
                        i: index,
                        type: 2,
                        modalTitle: '添加案例'
                        // curriculum_catalog_id: item.id,
                        // curriculum_id: item.curriculum_id,
                        // orderby: item.orderby + 1,
                        // list_index: index,
                        // group_name: item.group_name,
                    });
                }
            },
            //删除测验
            deleteText(item, index) {
                if (item.children.length) {
                    this.$Modal.confirm({
                        title: '提示',
                        content: '是否删除该章节',
                        onOk: () => {
                            postData('product/curriculum_online_catalog/delete', {curriculum_catalog_id: item.id}).then(res => {
                                if (res.res_code == 1) {
                                    this.getLists()
                                }
                            })
                        },
                    });
                } else {
                    postData('product/curriculum_online_catalog/delete', {curriculum_catalog_id: item.id}).then(res => {
                        if (res.res_code == 1) {
                            this.getLists()
                        }
                    })
                }
            },
            editHandler(i, row) {
                if (row.type === 0) {
                    this.handleSelModal(VIDEO_MANAGE, {
                        ...row,
                        video_edit: true,
                        curriculum_catalog_id: row.id,
                        curriculum_online_id: parseInt(this.$route.params.id),
                    })
                } else {
                    this.handleSelModal(ADD_QUESTION, {
                        curriculum_online_id: parseInt(this.$route.params.id),
                        section_id: row.id,
                        type: row.type,
                        modalTitle: row.type == 2 ? '编辑案例' : '编辑测验'
                    });
                }
            },
            moveUpList(item, index) {
                let data = {
                    catalog_id: item.id,
                    direction: 0
                }
                if(index == 0) {
                    this.$Message.info('无法上移')
                }else{
                    postData('/product/curriculum_online_catalog/moveChapter', data).then(res => {
                        if(res.res_code == 1) {
                            this.$store.dispatch('change_online_curriculum_orderby', {index, dir: 0});
                        }
                    })
                }
            },
            moveDownList(item, index) {
                let data = {
                    catalog_id: item.id,
                    direction: 1
                }
                if(index == this.chapterList.length - 1) {
                    this.$Message.info('无法下移')
                }else{
                    postData('/product/curriculum_online_catalog/moveChapter', data).then(res => {
                        if(res.res_code == 1) {
                            this.$store.dispatch('change_online_curriculum_orderby', {index, dir: 1});
                        }
                    })
                }
            },
            getLists() {
                this.initChapter();
            }
        },
        mounted() {
            $OnLine.$on('OnLine', (i) => {
                this.showListState[i] = 1
            })
            this.getLists()
        }
    }
</script>
<style scoped lang="less">
    /deep/ .ivu-table-header {
        display: none;
    }

    /deep/ .ivu-input {
        border: none;
        background-color: #FBFBFB;
        font-size: 16px !important;
    }

    /deep/ .ivu-icon {
        font-size: 24px
    }

    /deep/ .ivu-btn-text:focus {
        box-shadow: none;
    }

    .textInput {
        margin-left: 40px;
        width: 300px;
        font-family: PingFangSC-Medium;
        color: #474C63;
        letter-spacing: 0;
    }

    .row-title {
        font-family: PingFangSC-Medium;
        font-size: 16px;
        color: #474C63;
        letter-spacing: 0;
    }

    .manage-online-course-chapter {
        height: 100%;

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

                    + .handle-component {
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
            height: calc(100% - 66px);
            top: 0;
            z-index: 0;
            pointer-events: none;

            .scroll-wrap {
                overflow-y: auto;
                height: 100%;
                width: 100%;
                pointer-events: auto;
            }
        }

        .chapter-list {
            .chapter-item {
                .chapter-title {
                    min-width: 1070px;
                    padding: 0 40px;
                    background-color: #FBFBFB;
                    border: 1px solid #E5E5E5;
                    height: 60px;

                    /deep/ .ivu-btn-text {
                        border: none !important;
                        font-family: PingFangSC-Regular;
                        font-size: 16px;
                    }

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
                        color: #3DAAFF;
                    }

                    .el-button {
                        font-size: 14px;
                        color: #3B3B3B;
                        letter-spacing: 0;

                        &:hover {
                            color: #3DAAFF;
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
