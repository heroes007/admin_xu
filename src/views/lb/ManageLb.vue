<template>
    <div class='manage-student-view'>
        <header-component title='查看广告' :noSelect="noSelect"></header-component>
        <Row class='sub-header' type='flex' justify='space-between' align='middle'>
            <el-breadcrumb separator="/">
                <el-breadcrumb-item>广告图管理</el-breadcrumb-item>
                <el-breadcrumb-item>查看广告</el-breadcrumb-item>
            </el-breadcrumb>
            <el-button class='btn-add' type='text' @click='addLb()'>添加广告图</el-button>
            <el-dialog title="广告信息" v-model="dialogVisible" size="small" :close-on-click-modal='false' :close-on-press-escape='false' custom-class='add-student-view'>
                <Row class='result' type='flex' justify='center' align='middle'>
                    <div class='data-form'>
                        <Row class='user-data' type='flex' justify='start' align='middle'>
                            广告名称：
                            <el-input placeholder='请输入内容' v-model='lbData.name'></el-input>
                        </Row>
                        <Row class='user-data update-img' type='flex' justify='start' align='middle'>
                            广告图片：
                            <img v-if="lbData.img_url.url" :src='lbData.img_url.url'>
                            <btn-upload text='上传图片' type='image/gif, image/jpeg, image/png' bucket='dscj-app' dir='lb' @uploadcomplete='uploadImgComplete'></btn-upload>
                        </Row>
                        <Row class='user-data' type='flex' justify='start' align='middle'>
                            跳转地址：
                            <el-input placeholder='请输入内容' v-model='lbData.redirect_url'></el-input>
                        </Row>
                        <Row class='user-data' type='flex' justify='start' align='middle'>
                            显示位置：
                            <el-select v-model="lbData.position" placeholder="请选择学科">
                                <el-option
                                        v-for="item in positionList" :key="item.id"
                                        :label="item.label"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                        </Row>
                        <Row class='user-data' type='flex' justify='start' align='middle'>
                            分享标题：
                            <el-input placeholder='请输入内容' v-model='lbData.share_title'></el-input>
                        </Row>
                        <Row class='user-data' type='flex' justify='start' align='middle'>
                            分享描述：
                            <el-input placeholder='请输入内容' v-model='lbData.share_desc'></el-input>
                        </Row>
                        <Row class='user-data update-img' type='flex' justify='start' align='middle'>
                            分享图片：
                            <img v-if="lbData.share_img_url.url" :src='lbData.share_img_url.url'>
                            <btn-upload text='上传图片' type='image/gif, image/jpeg, image/png' bucket='dscj-app' dir='lb' @uploadcomplete='uploadShareImgComplete'></btn-upload>
                        </Row>
                        <Row class='user-data' type='flex' justify='start' align='middle'>
                            分享链接：
                            <el-input placeholder='请输入内容' v-model='lbData.share_url'></el-input>
                        </Row>
                        <Row class='user-data' type='flex' justify='start' align='middle'>
                            排序序号：
                            <el-input-number v-model="lbData.orderby"></el-input-number>
                        </Row>
                        <Row class='user-data' type='flex' justify='start' align='middle'>
                            上线状态：
                            <el-select v-model="lbData.state" placeholder="请选择学科">
                                <el-option
                                        v-for="item in stateList" :key="item.id"
                                        :label="item.label"
                                        :value="item.value">
                                </el-option>
                            </el-select>
                        </Row>
                        <Row class='user-data' type='flex' justify='center' align='middle'>
                            <el-button @click='submit'>保存</el-button>
                        </Row>
                    </div>
                </Row>
            </el-dialog>
        </Row>
        <Row class='data-container'>
            <div class='list'>
                <Row class='data-header' type='flex'>
                    <Col>
                        广告名称
                    </Col>
                    <Col>
                        显示位置
                    </Col>
                    <Col>
                        状态
                    </Col>
                    <Col>
                        操作
                    </Col>
                </Row>
                <Row class='data-item bg-gray' type='flex' v-for='item in list' :key="item.id">
                    <Col>
                        {{item.name}}
                    </Col>
                    <Col>
                        {{item.position}}
                    </Col>
                    <Col>
                        {{item.state === 1?'上线中':'已下线'}}
                    </Col>
                    <Col>
                        <el-button type='text'>
                            <a @click='editLb(item)'>编辑</a>
                        </el-button>
                    </Col>
                </Row>
                <Row class='pager' type='flex' justify='end' align='middle'>
                    <el-pagination
                            @size-change="handleSizeChange"
                            @current-change="handleCurrentChange"
                            :current-page="curPage"
                            :page-sizes="[1,10, 20, 50, 100]"
                            :page-size="pageSize"
                            layout="sizes, prev, pager, next"
                            :total="total">
                    </el-pagination>
                </Row>
            </div>
        </Row>
    </div>
</template>

<style lang="scss">
    .el-tooltip__popper {
        &.is-light {
            background: #FFFFFF;
            border: 1px solid #E7E8EA;
            box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.12), 0 0 6px 0 rgba(0, 0, 0, 0.04);
            .more-tip {
                max-width: 278px;
                line-height: 1.2;
                font-size: 14px;
                color: #2e3e47;

                & + .popper__arrow {
                    border-top-color: #E7E8EA;
                    &:after {
                        //border-top-color:#E7E8EA;
                    }
                }
            }
        }
    }

    .manage-student-view {
        .btn-add {
            color: #5fa137;
        }
        .data-container {
            background-color: #ffffff;
            margin: 0 20px 20px 20px;
            .list {
                .data-header {
                    height: 50px;
                    .Col {
                        line-height: 50px;
                    }
                }
                .data-item {
                    height: 40px;
                    border-top: 1px solid #cecece;

                    &.bg-gray {
                        background-color: #fbfbfb;
                    }

                    .Col {
                        line-height: 40px;
                        .el-button {
                            a {
                                color: #5fa137;
                                font-size: 14px;
                            }
                        }
                        p {
                            margin: 0;
                            display: -webkit-box;
                            white-space: normal;
                            -webkit-box-orient: vertical;
                            overflow: hidden;
                            -webkit-line-clamp: 1;
                        }
                    }
                }
                .pager {
                    margin: 30px 0;
                    padding-right: 40px;

                    .el-pagination {
                        button {
                            &.disabled {
                                background-color: #ebebec;
                                border-color: #b0b3c5;
                                color: #8b9fa9;
                            }
                        }
                        .el-pager {
                            li {
                                &.active {
                                    background-color: #8b9fa9;
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    //添加框
    .add-student-view {
        .img {
            margin-top: 100px;
            img {
                width: 150px;
                height: 150px;
            }
        }
        .title {
            margin-top: 25px;
            h1 {
                font-size: 28px;
                color: #2e3e47;
                font-weight: 200;
                font-family: MicrosoftYaHei;
                margin: 0;
            }
        }
        .search-bar {
            margin-top: 40px;
            .el-input-group {
                width: 380px;
                .el-input__inner {
                    height: 46px;
                }
                .el-input-group__append {
                    background-color: #7ab854;

                    .el-button {
                        height: 100%;
                        width: 80px;
                        color: #ffffff;
                        font-size: 16px;
                    }
                }
                .el-input-group__prepend {
                    background-color: #7ab854;

                    .el-select {
                        height: 100%;
                        width: 110px;
                        color: #ffffff;
                        font-size: 16px;
                    }

                    i {
                        color:#ffffff;
                    }
                }
            }
        }
        .result {
            margin:15px 0 76px;
            .data-form {
                width:550px;
                background-color: #ffffff;
                border: 1px solid #EBEBEC;
                border-radius: 6px;
                padding: 20px 0;
                .user-info {
                    font-size: 14px;
                    margin-bottom:24px;
                    border-bottom: 1px solid #EBEBEC;
                    padding:0 20px;
                    span {
                        color:#7ab854;
                        margin-right:15px;
                    }
                }
                .update-img{
                    img{
                        width: 120px;
                    }
                }
                .user-data {
                    font-size: 14px;
                    margin-bottom:15px;
                    padding:0 20px;
                    white-space: nowrap;

                    .el-input {
                        width: 100%;
                    }

                    .el-button {
                        width: 140px;
                        height: 36px;
                        background-color: #7ab854;
                        color:#ffffff;
                    }

                    &.desc {
                        width: 100%;
                        .el-input {
                            width:330px;
                        }
                    }
                }
            }
        }
    }
</style>

<script>
    import Header from '../../components/Header'
    import UploadBtn from '../../components/UploadButton'
    import api from '../../api/modules/config'
    import {Config} from '../../config/base'
    import { get_sign } from '../../api/modules/ali_oss'
    import { get_detail, update_lb, add_lb } from '../../api/modules/tools_lb'
    import { Loading } from 'element-ui';


    export default{
        data(){
            return {
                positionList:[
                    {label:'点师成金APP首页轮播',value:'apphome'},
                    {label:'点师成金APP首页广告',value:'apphomead'},
                    {label:'官网首页',value:'web_home'},
                    {label:'教资APP首页',value:'licence'},
                    {label:'教资官网首页',value:'web_licence'}
                ],
                stateList:[
                    {label:'上线中',value:1},
                    {label:'已下线',value:0}
                ],
                lbData: {
                    ad_id:null,
                    name:'',
                    img_url:'',
                    redirect_url:'',
                    position:'apphome',
                    share_title:'',
                    share_desc:'',
                    share_img_url:'',
                    share_url:'',
                    orderby:1,
                    state:1
                },
                searchData:'',
                searchType:'phone',
                dialogVisible:false,
                uploadData:{
                    action:Config.ossHost,
                    headers:{},
                    multiple:false,
                    name:''
                },
                isEdit: false,
                noSelect: true
            }
        },
        methods: {
            uploadShareImgComplete(url) {
                this.lbData.share_img_url = url;
            },
            uploadImgComplete(url) {
                this.lbData.img_url = url;
            },
            handleSizeChange(val) {
                if (val !== this.pageSize) {
                    this.$store.dispatch('get_lb_list', {curPage: this.curPage, pageSize: val});
                }

            },
            handleCurrentChange(val) {
                if (val && val !== this.curPage) {
                    this.$store.dispatch('get_lb_list', {curPage: val, pageSize: this.pageSize});
                }
            },
            searchStudent(){
                if(!this.initData)
                    this.initData = true;
                this.$store.dispatch('search_userinfo_by_nickname_or_phone',{searchType:this.searchType,searchData:this.searchData});
            },
            handleBeforeUpload(file) {
                console.log(file)
                get_sign(file.type,new Date(),'dscj-app','questions',file.name,'put').then((res) => {
                    console.log(res)
                })
                return false;
            },
            handleRemove(file, fileList) {
                console.log(file, fileList);
            },
            handlePreview(file) {
                console.log(file);
            },
            addLb() {
                this.lbData.ad_id = null;
                this.lbData.name = '';
                this.lbData.img_url = '';
                this.lbData.redirect_url = '';
                this.lbData.position = 'apphome';
                this.lbData.share_title = '';
                this.lbData.share_desc = '';
                this.lbData.share_img_url = '';
                this.lbData.share_url = '';
                this.lbData.orderby = 1;
                this.lbData.state = 1;
                this.dialogVisible = true;
                this.isEdit = false;
            },
            editLb(item) {
                var loadingInstance = Loading.service({text:'加载中，请稍后',fullscreen:true});
                setTimeout(() => {
                    loadingInstance.close();
                }, Config.base_timeout);
                get_detail(item.ad_id).then((res) => {
                    loadingInstance.close();
                    if(res.data.res_code === 1)
                    {

                        this.lbData = res.data.msg[0];
                        this.lbData.img_url = res.data.msg[0].img_url ? JSON.parse(res.data.msg[0].img_url) : '';
                        this.lbData.share_img_url = res.data.msg[0].share_img_url ? JSON.parse(res.data.msg[0].share_img_url) : '';
                        this.lbData.ad_id = res.data.msg[0].id;
                        this.dialogVisible = true;
                        this.isEdit = true;
                    }
                });
            },
            submit(){
                this.lbData.img_url = this.lbData.img_url ? JSON.stringify(this.lbData.img_url) : '';
                this.lbData.share_img_url = this.lbData.share_img_url ? JSON.stringify(this.lbData.share_img_url) : '';
                if(this.isEdit)
                {
                    update_lb(this.lbData).then((res) => {
                        if(res.data.res_code === 1)
                        {
                            this.$store.dispatch('get_lb_list', {curPage: this.curPage, pageSize: this.pageSize});
                            this.dialogVisible = false;
                            alert('保存广告成功！');
                        }
                        else
                        {
                            alert('保存广告失败：' + res.data.msg);
                        }
                    })
                }
                else
                {
                    add_lb(this.lbData).then((res) => {
                    if(res.data.res_code === 1)
                    {
                        this.$store.dispatch('get_lb_list', {curPage: this.curPage, pageSize: this.pageSize});
                        this.dialogVisible = false;
                        alert('保存广告成功！');
                    }
                    else
                    {
                        alert('保存广告失败：' + res.data.msg);
                    }
                })
                }
            }
        },
        mounted() {
            if (this.list.length === 0) {
                this.$store.dispatch('get_lb_list', {curPage: 1, pageSize: 10})
            }


//             var getFlagArrs = function (m, n) {
//     if(!n || n < 1) {
//         return [];
//     }
 
//     var resultArrs = [],
//         flagArr = [],
//         isEnd = false,
//         i, j, leftCnt;
 
//     for (i = 0; i < m; i++) {
//         flagArr[i] = i < n ? 1 : 0;
//     }
 
//     resultArrs.push(flagArr.concat());
 
//     while (!isEnd) {
//         leftCnt = 0;
//         for (i = 0; i < m - 1; i++) {
//             if (flagArr[i] == 1 && flagArr[i+1] == 0) {
//                 for(j = 0; j < i; j++) {
//                     flagArr[j] = j < leftCnt ? 1 : 0;
//                 }
//                 flagArr[i] = 0;
//                 flagArr[i+1] = 1;
//                 var aTmp = flagArr.concat();
//                 resultArrs.push(aTmp);
//                 if(aTmp.slice(-n).join("").indexOf('0') == -1) {
//                     isEnd = true;
//                 }
//                 break;
//             }
//             flagArr[i] == 1 && leftCnt++;
//         }
//     }
//     return resultArrs;
// }

// console.log(getFlagArrs(12,5));

// var data = [{name:'翟',data:(1 | 2 )},{name:'杜锐'}]

        },
        computed: {
            list(){
                return this.$store.state.lb.lb_list;
            },
            pageSize(){
                return this.$store.state.lb.pageSize;
            },
            curPage(){
                return this.$store.state.lb.curPage;
            },
            total(){
                return this.$store.state.lb.total;
            },
            isLoading() {
                return this.$store.state.lb.isLoading;
            },
            searchResult(){
                return this.$store.state.lb.search_result;
            },
            resultMsg(){
                return this.$store.state.lb.search_msg;
            }
        },
        components: {
            'header-component': Header,
            'btn-upload':UploadBtn
        }
    }
</script>
