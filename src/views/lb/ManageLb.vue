    <template>
    <div class='manage-student-view'>
        <!-- <header-component title='广告图' :noSelect="noSelect"></header-component> -->
        <screen :types="6" title="广告图" btnName="添加广告图" @handleClick="addLb"/>
        <!-- <Button class='btn-add' type='text' @click='addLb()'>添加广告图</Button> -->
        <Row class='sub-header' type='flex' justify='space-between' align='middle'>
            <!-- <Breadcrumb separator="/">
                <BreadcrumbItem>广告图管理</BreadcrumbItem>
                <BreadcrumbItem>查看广告</BreadcrumbItem>
            </Breadcrumb> -->
            <Modal :transfer=false v-model="dialogVisible" size="small" :mask-closable='false' :footer-hide="true" class='add-student-view' width="800">
                <div slot="header" class="modal-header">
                    <div>广告信息</div>
                </div>
                <Row class='result' type='flex' justify='center' align='middle'>
                    <div class='data-form'>
                        <Row class='user-data' type='flex' justify='start' align='middle'>
                            <span>广告名称：</span>
                            <Input placeholder='请输入内容' v-model='lbData.name'></Input>
                        </Row>
                        <Row class='user-data update-img' type='flex' justify='start' align='middle'>
                            广告图片： <img style="width: 120px;" v-if="lbData.img_url.url" :src='lbData.img_url.url'>
                            <btn-upload text='上传图片' type='image/gif, image/jpeg, image/png' bucket='dscj-app' dir='lb' @uploadcomplete='uploadImgComplete'></btn-upload>
                        </Row>
                        <Row class='user-data' type='flex' justify='start' align='middle'>
                            跳转地址： <Input placeholder='请输入内容' v-model='lbData.redirect_url'></Input>
                        </Row>
                        <!--<Row class='user-data' type='flex' justify='start' align='middle'>-->
                            <!--显示位置：-->
                            <!--<Select v-model="lbData.position" placeholder="请选择学科">-->
                                <!--<Option v-for="item in positionList" :key="item.id" :label="item.label" :value="item.value"></Option>-->
                            <!--</Select>-->
                        <!--</Row>-->
                        <!--<Row class='user-data' type='flex' justify='start' align='middle'>-->
                            <!--分享标题： <Input placeholder='请输入内容' v-model='lbData.share_title'></Input>-->
                        <!--</Row>-->
                        <!--<Row class='user-data' type='flex' justify='start' align='middle'>-->
                            <!--分享描述： <Input placeholder='请输入内容' v-model='lbData.share_desc'></Input>-->
                        <!--</Row>-->
                        <!--<Row class='user-data update-img' type='flex' justify='start' align='middle'>-->
                            <!--分享图片：<img v-if="lbData.share_img_url.url" :src='lbData.share_img_url.url'>-->
                            <!--<btn-upload text='上传图片' type='image/gif, image/jpeg, image/png' bucket='dscj-app' dir='lb' @uploadcomplete='uploadShareImgComplete'></btn-upload>-->
                        <!--</Row>-->
                        <!--<Row class='user-data' type='flex' justify='start' align='middle'>-->
                            <!--分享链接：<Input placeholder='请输入内容' v-model='lbData.share_url'></Input>-->
                        <!--</Row>-->
                         <Row class='user-data' type='flex' justify='start' align='middle'>
                            排序序号：<InputNumber v-model="lbData.orderby"></InputNumber>
                        </Row>
                        <Row class='user-data' type='flex' justify='start' align='middle'>
                            上线状态：
                            <Select v-model="lbData.state" placeholder="请选择学科">
                                <Option v-for="item in stateList" :key="item.id" :label="item.label" :value="item.value"></Option>
                            </Select>
                        </Row>
                        <Row class='user-data' type='flex' justify='center' align='middle'>
                            <Button type="primary" @click='submit'>保存</Button>
                        </Row>
                    </div>
                </Row>
            </Modal>
        </Row>
        <Table :columns="columns1" :data="list">
            <template slot-scope="{ row, index }" slot="action">
                <Button type="text" size="small" class="btn-text" @click="editLb(row)">编辑</Button>
                <Button type="text" size="small" class="btn-text" @click="deleteLb(row)">删除</Button>
            </template>
        </Table>
        <Row class='pager' type='flex' justify='end' align='middle'>
            <Page @on-page-size-change="handleSizeChange"  @on-change="handleCurrentChange" :current="curPage"
                :page-size-opts="[10, 20, 50, 100]" :page-size="pageSize" show-sizer :total="total">
            </Page>
        </Row>
    </div>
</template>
<script>
    import Header from '../../components/Header'
    import UploadBtn from '../../components/UploadButton'
    import {Config} from '../../config/base'
    import { get_detail, update_lb, add_lb, delete_lb } from '../../api/modules/tools_lb'
    import screen from '../../components/ScreenFrame'

    export default{
        components: { 'header-component': Header, 'btn-upload': UploadBtn ,screen},
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
                    position:'web_home',
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
                noSelect: true,
                loadingInstance: null,
                columns1:[
                  {
                    title: '广告名称',
                    key: 'name'
                  },
                  {
                    title: '显示位置',
                    key: 'position'
                  },
                  {
                    title: '状态',
                    key: 'state'
                  },
                  {
                    title: '操作',
                    slot: 'action'
                  },
                ]
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
                if (val !== this.pageSize) this.$store.dispatch('get_lb_list', {curPage: this.curPage, pageSize: val});
            },
            handleCurrentChange(val) {
                if (val && val !== this.curPage) this.$store.dispatch('get_lb_list', {curPage: val, pageSize: this.pageSize});
            },
            searchStudent(){
                if(!this.initData) this.initData = true;
                this.$store.dispatch('search_userinfo_by_nickname_or_phone',{searchType:this.searchType,searchData:this.searchData});
            },
            handleRemove(file, fileList) {},
            handlePreview(file) {},
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
                // this.loadingInstance = this.$LoadingY({message: "加载中，请稍后",show: true})
                setTimeout(() => {
                    this.loadingInstance.close();
                }, Config.base_timeout);
                get_detail(item.ad_id).then((res) => {
                    if(this.loadingInstance) this.loadingInstance.close();
                    if(res.data.res_code === 1){
                        this.lbData = res.data.msg[0];
                        this.lbData.img_url = res.data.msg[0].img_url ? JSON.parse(res.data.msg[0].img_url) : '';
                        this.lbData.share_img_url = res.data.msg[0].share_img_url ? JSON.parse(res.data.msg[0].share_img_url) : '';
                        this.lbData.ad_id = res.data.msg[0].id;
                        this.dialogVisible = true;
                        this.isEdit = true;
                    }
                });
            },
            deleteLb(item){
              console.log(item)
              delete_lb({lb_id: item.ad_id}).then(res => {
                this.hanleIsEditRes(res.data, 1)
              })
            },
            hanleIsEditRes(res, n){
              if(n) console.log(n)
                 if(res.res_code === 1){
                    this.$store.dispatch('get_lb_list', {curPage: this.curPage, pageSize: this.pageSize});
                    this.dialogVisible = false;
                    n ? this.$Message.success('删除广告成功！') : this.$Message.success('保存广告成功！');
                }else n ? this.$Message.success('删除广告失败！') : this.$Message.warning('保存广告失败：' + res.msg);
            },
          submit(){
            this.lbData.img_url = this.lbData.img_url ? JSON.stringify(this.lbData.img_url) : '';
            this.lbData.share_img_url = this.lbData.share_img_url ? JSON.stringify(this.lbData.share_img_url) : '';
            if(this.isEdit){
              update_lb(this.lbData).then((res) => {
                if(res.data) {
                  this.hanleIsEditRes(res.data)
                  this.lbData.img_url = this.lbData.img_url ? JSON.parse(this.lbData.img_url) : '';
                  this.lbData.share_img_url = this.lbData.share_img_url ? JSON.parse(this.lbData.share_img_url) : '';
                }
              })
            }else{
              add_lb(this.lbData).then((res) => {
                if(res.data) {
                  this.hanleIsEditRes(res.data)
                  this.lbData.img_url = this.lbData.img_url ? JSON.parse(this.lbData.img_url) : '';
                  this.lbData.share_img_url = this.lbData.share_img_url ? JSON.parse(this.lbData.share_img_url) : '';
                }
              })
            }
          }
        },
        mounted() {
            if (this.list.length === 0)  this.$store.dispatch('get_lb_list', {curPage: 1, pageSize: 10})
        },
        computed: {
            list(){
              let list = this.$store.state.lb.lb_list.map((e,i) => {
                let user = Object.assign({},e);
                if(e.state) user.state = '上线中'
                else user.state = '已下线'
                return user
              })
              return list;
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
        }
    }
</script>

<style scoped lang="scss">
    .update-img>img { width: 120px !important}
    .ivu-input-wrapper{
        width: calc(100% - 70px) !important;
    }
    .ivu-select{
        width: calc(100% - 70px) !important;
    }
    .ivu-modal-header{
        background-color: #546573;
        border-radius: 6px 6px 0 0;
        padding: 20px !important;

    }
    .modal-header{
        font-size: 16px;
        font-weight: 700;
        text-align: center;
        color: #fff;
    }
    .ivu-icon-ios-close{
        color: #bfcbd9 !important;

        &:hover{
            color: #4098ff !important;
        }
    }
    .ivu-btn-primary{
        width: 140px;
    }
    .add-student-view{
        width: 50%;
    }
    .btn-add{
        position: absolute;
        right: 40px;
        color: #3DAAFF;
    }
    .result{
        margin: 32px 0 !important;
    }
    /deep/ .ivu-input-number{
        width: calc(100% - 70px) !important;
    }
    /deep/ .ivu-table-cell{
        font-size: 16px;
        color: #657180;
        text-align: center;
    }
    /deep/ .ivu-table th{
        text-align: center;
    }
    /deep/ .ivu-select-single .ivu-select-selection .ivu-select-selected-value{
        font-size: 14px;
    }
    .btn-text{
        color: #3DAAFF;
        font-size: 14px;
    }
    /deep/ .ivu-input-number{
        width: calc(100% - 70px) !important;
    }
    .add-student-view .result .data-form {
        width: 550px;
        background-color: #ffffff;
        border: 1px solid #EBEBEC;
        border-radius: 6px;
        padding: 20px 0;
    }
    .add-student-view .result .data-form .user-data {
        font-size: 14px;
        margin-bottom: 15px;
        padding: 0 20px;
    }
</style>
