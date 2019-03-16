    <template>
    <div class='manage-student-view'>
        <!-- <header-component title='广告图' :noSelect="noSelect"></header-component> -->
        <!-- <screen :types="6" title="广告图" btnName="添加广告图" @handleClick="addLb"/> -->
        <!-- <Button class='btn-add' type='text' @click='addLb()'>添加广告图</Button> -->
        <!-- <Button class="add-advert" type="primary" @click='addLb()'>添加广告</Button> -->
        <Row class='sub-header' type='flex' justify='space-between' align='middle'>
            <!-- <Breadcrumb separator="/">
                <BreadcrumbItem>广告图管理</BreadcrumbItem>
                <BreadcrumbItem>查看广告</BreadcrumbItem>   
            </Breadcrumb> -->
            <Modal v-model="dialogVisible" size="small" :mask-closable='false' :footer-hide="true" class='add-student-view' width="654">
                <div slot="header" class="modal-header">
                    <div>添加广告图</div>
                </div>
                <Row class='result' type='flex' justify='center' align='middle'>
                    <div class='data-form'>
                        <Row class='user-data' type='flex' justify='start' align='middle'>
                           <Col span="4">广告名称：</Col> 
                            <Col span="13">
                                <Input placeholder='请输入广告名称' v-model='lbData.name'></Input>
                            </Col>
                        </Row>
                        <Row class='user-data'  type='flex' justify='start' align='middle'>
                            <Col span="4">显示位置：</Col> 
                            <Col span="13">
                                <Input v-if="adutplace == '首页广告'" placeholder="首页广告" disabled v-model='lbData.redirect_url'></Input>
                                <Input v-else placeholder="课程广告" disabled v-model='lbData.redirect_url'></Input>
                            </Col>
                        </Row>
                        <Row class='user-data' type='flex' justify='start' align='middle'>
                            <Col span="4">跳转页面：</Col> 
                            <Col span="13">
                                  <Input placeholder='请输入连接' v-model='lbData.redirect_url'></Input>
                            </Col>
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
                         <!-- <Row class='user-data' type='flex' justify='start' align='middle'>
                            排序序号：<InputNumber v-model="lbData.orderby"></InputNumber>
                        </Row>
                        <Row class='user-data' type='flex' justify='start' align='middle'>
                            上线状态：
                            <Select v-model="lbData.state" placeholder="请选择学科">
                                <Option v-for="item in stateList" :key="item.id" :label="item.label" :value="item.value"></Option>
                            </Select>
                        </Row> -->
                        <Row class='user-data update-img' type='flex' justify='start' align='middle'>
                            <!-- 上传广告： <img style="width: 120px;" v-if="lbData.img_url.url" :src='lbData.img_url.url'> -->
                            <Col span="4">上传广告：</Col> 
                            <Col span="13" >
                                <Upload ref="upload"  action="http://dscj-app.oss-cn-qingdao.aliyuncs.com/" :format="['jpg','jpeg','png']" :data="uploadData"
                                        :before-upload="uploadImgComplete" :on-format-error="handleFormatError" style="width:460px;height:180px;background: #FFFFFF;
                                        border: 1px solid #C8CCDD;
                                        border-radius: 4px;">
                                    <div v-if="!headImg" class="modal-upload-flie" style="
                                        padding: 38px 118px;
                                    ">
                                        <img style="
                                            padding: 0 55px;
                                        " class="upload-flie-img" src="/static/icon/upload.png"/>
                                        <div style="display:flex">
                                             <p style="
                                             font-family: PingFangSC-Regular;
                                            font-size: 14px;
                                            color: #9397AD;
                                            letter-spacing: 0;
                                             ">将文件拖到此处或</p>
                                            <span style="
                                            font-family: PingFangSC-Medium;
                                            font-size: 14px;
                                            color: #4098FF;
                                            letter-spacing: 0;
                                            ">点击上传</span>
                                        </div>
                                    </div>
                                    <img v-if="headImg" class="upload-flie-img-2" :src="headImg"/>
                                </Upload>
                              
                            </Col>
                              <p style="
                                font-family: PingFangSC-Regular;
                                font-size: 14px;
                                color: #F54802;
                                letter-spacing: 0;
                                margin:0 auto;
                                padding-top:10px;
                                ">* 只能上传 jpg/png 文件，建议尺寸1400*360px</p>
                            <!-- <btn-upload text='上传图片' type='image/gif, image/jpeg, image/png' bucket='dscj-app' dir='lb' @uploadcomplete='uploadImgComplete'></btn-upload> -->
                        </Row>
                        <Row class='user-data' type='flex' justify='center' align='middle'>
                            <Button style="
                                margin-top:60px
                            " type="primary" @click='submit'>保存</Button>
                        </Row>
                    </div>
                </Row>
            </Modal>
        </Row>
        <!-- <Table :columns="columns1" :data="list">
            <template slot-scope="{ row, index }" slot="action">
                <Button type="text" size="small" class="btn-text" @click="editLb(row)">编辑</Button>
                <Button type="text" size="small" class="btn-text" @click="deleteLb(row)">删除</Button>
            </template>
        </Table> -->
        <Tables :is-serial=true @operation1="batchDownload" @operation2="edit"   @table-swtich="swtichChange" :column="columns1" :table-data="list" />
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
    import { get_detail, update_lb, add_lb, delete_lb, get_all_bl } from '../../api/modules/tools_lb'
    import screen from '../../components/ScreenFrame'
    import Tables from '../../components/tables.vue'
    

    export default{
        components: { 'header-component': Header, 'btn-upload': UploadBtn ,screen,Tables},
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
                      title:'创建人',
                      key:'man'
                  },
                  {
                    title: '操作',
                    width: 420,
                    slot: 'operation',
                    operation_state: true,
                    operation: [['编辑','operation1'], ['删除','operation2']],
                  },
                ],
                list:[],
                adutplace:'首页广告'
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
                this.adutplace = '首页广告';
            },
            addNew() {
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
                this.adutplace = '课程广告';
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
            get_all_bl().then(res => {
                console.log(res);
                this.list = res.data.data.list
            })
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
        background-color: #fff;
        border-radius: 6px 6px 0 0;
        padding: 20px !important;

    }
    .modal-header{
        font-family: PingFangSC-Regular;
        font-size: 20px;
        color: #474C63;
        letter-spacing: 0;
        text-align: center;
        padding:  8px 0;
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
        margin-top: 32px !important;
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
        // width: 550px;
        // background-color: #ffffff;
        // border: 1px solid #EBEBEC;
        // border-radius: 6px;
        // padding: 20px 0;
    }
    .add-student-view .result .data-form .user-data {
        margin-bottom: 15px;
        padding: 0 20px;
        font-family: PingFangSC-Regular;
        font-size: 16px;
        color: #474C63;
        letter-spacing: 0;
    }
    .add-advert{
        width: 130px;
        height: 36px;
        background: #4098FF;
        border-radius: 4px;
        font-family: PingFangSC-Regular;
        font-size: 16px;
        color: #FFFFFF;
        letter-spacing: 0;
        text-align: center;
        position: absolute;
        top:-48px;
        right: 39px;
    }
    /deep/.ivu-modal-close .ivu-icon-ios-close{
        font-size: 48px !important;
    }
    /deep/.ivu-input{
        width: 460px;
        height: 34px;
        background: #FFFFFF;
        border: 1px solid #C8CCDD;
        border-radius: 4px !important;
        font-family: PingFangSC-Regular;
        font-size: 16px !important;
        color: #9397AD;
        letter-spacing: 0;
        padding-left: 15px;
    }
</style>
