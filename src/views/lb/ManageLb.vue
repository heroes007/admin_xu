    <template>
    <div class='manage-student-view'>
        <!-- <Row class='sub-header' type='flex' justify='space-between' align='middle'> -->
            <Modal v-model="showModal"  :mask-closable='false' :footer-hide="true" @on-cancel="close"  width="654">
                <div slot="header" class="modal-header">
                    <div>添加广告图</div>
                </div>
                <Form :model="lbData" :label-width="80">
                    <FormItem label="广告名称">
                        <Input v-model="lbData.name" placeholder="请输入广告名称"></Input>
                    </FormItem>
                     <FormItem label="显示位置">
                         <Input placeholder="首页轮播/课程页轮播" disabled></Input>
                         <!-- <Input v-if="adutplace == '首页广告'" placeholder="首页广告" disabled></Input> -->
                         <!-- <Input v-else placeholder="课程广告" disabled></Input> -->
                    </FormItem>
                     <FormItem label="跳转页面">
                        <Input v-model="lbData.redirect_url" placeholder="请输入跳转页面"></Input>
                    </FormItem>
                     <FormItem label="上传广告">
                         <UploadPanel ref="upload_panel" :resourse="lbData.img_url" :upload-config="uploadConfig" @uploadcomplete="handleDefaultUploadComplete">
                                <span slot="file-require">* 只能上传 jpg/png 文件，建议尺寸1400*360px</span>
                         </UploadPanel>
                    </FormItem>
                     <Row class='user-data' type='flex' justify='center' align='middle'>
                            <Button style="margin-top:60px" type="primary" @click='submit'>保存</Button>
                     </Row>
                </Form>
            </Modal>
        <!-- </Row> -->
        <Tables :is-serial=true @operation1="edit" @operation2="batchDownload" :column="columns1" :table-data="list" />
        <Row class='pager' type='flex' justify='end' align='middle'>
            <Page  @on-change="handleCurrentChange" :current="current" :page-size="pageSize" :total="total">
            </Page>
        </Row>
    </div>
</template>
<script>
    import Header from '../../components/Header'
    import UploadBtn from '../../components/UploadButton'
    import {Config} from '../../config/base'
    import screen from '../../components/ScreenFrame'
    import Tables from '../../components/tables.vue'
    import postData from '../../api/postData.js'
    import UploadPanel from '../../components/UploadPanel'
    export default{
        components: { 'header-component': Header, 'btn-upload': UploadBtn , screen, Tables, UploadPanel},
        props: {
            type: {
                type: Boolean,
                default: false
            }
        },
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
                current: 1,
                total: null,
                pageSize: 12,
                lbData2: {
                    name:'',
                    position: null,
                    img_url: '',
                    redirect_url: ''
                },
                lbData: {},
                searchData:'',
                searchType:'phone',
                showModal: false,
                uploadData:{
                    action:Config.ossHost,
                    headers:{},
                    multiple:false,
                    name:''
                },
                uploadConfig: {
                    bucket: 'dscj-app',
                    dir: 'user_task',
                    type: 1
                },
                headImg: '',
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
            edit(row,index){
              this.addLb()
              this.lbData = row;
              this.isEdit = true
            },
            batchDownload(row,index){
                postData('/platform/banner/removeBanner',{id: row.id}).then((res) => {
                     if(res.res_code == 1)  this.getList()
                })
            },
            uploadShareImgComplete(url) {
                this.lbData.share_img_url = url;
            },
            close(){
                this.lbData = this.lbData2;
                this.showModal = false
            },
            setSubmit(){
                 this.lbData.position = this.type ? 1 : 2;
                 let url = this.isEdit ? '/platform/banner/modifyBanner' : '/platform/banner/addBanner'
                 postData(url,this.lbData).then((res) => {
                     if(res.res_code == 1){
                        this.$Message.warning(res.msg);
                        this.getList()
                     }
                 })
                  this.close()
            },
            submit(){
               this.setSubmit()
            },
            handleCurrentChange(v){
                this.current = vl;
                this.getList()
            },
            addLb() {
                this.showModal = true;
                this.isEdit = false
                this.adutplace = '首页广告';
            },
            addNew() {
                this.showModal = true;
                this.isEdit = false
                this.adutplace = '课程广告';
            },
            handleDefaultUploadComplete(url) {
                this.lbData.img_url = url;
            },
            getList(){
                let d = {
                position: this.type ? 1 : 2,
                page_size: this.pageSize,
                page_num: this.current,
                }
                postData('/platform/banner/getBannerListAdmin', d).then((res) => {
                    this.list = res.data.list
                    this.total = res.data.count
                })
            },
        },
        mounted() {
           this.getList()
           this.lbData = this.lbData2
        }
    }
</script>

<style scoped lang="scss">
     /deep/ .ivu-input[disabled]{
          background-color: #F0F0F7;
          color: #474C63
     }
     .manage-student-view{
         height: 100% !important;
         position: relative;
     }
     /deep/.img>img{height: 250px !important;}
     /deep/ .ivu-modal-body{
         padding: 50px;
     }
     .uploadP1{
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: #9397AD;
        letter-spacing: 0;
    }
    .uploadText{
        font-family: PingFangSC-Medium;
        font-size: 14px;
        color: #4098FF;
        letter-spacing: 0;
    }
    .uploadP2{
         font-family: PingFangSC-Regular;
        font-size: 14px;
        color: #F54802;
        letter-spacing: 0;
        margin:0 auto;
        padding-top:10px;
    }
    .update-img>img { width: 120px !important}
    // .ivu-input-wrapper{
    //     width: calc(100% - 70px) !important;
    // }
    // .ivu-select{
    //     width: calc(100% - 70px) !important;
    // }
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
    // /deep/ .ivu-input-number{
    //     width: calc(100% - 70px) !important;
    // }
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
    // /deep/.ivu-input{
    //     width: 460px;
    //     height: 34px;
    //     background: #FFFFFF;
    //     border: 1px solid #C8CCDD;
    //     border-radius: 4px !important;
    //     font-family: PingFangSC-Regular;
    //     font-size: 16px !important;
    //     color: #9397AD;
    //     letter-spacing: 0;
    //     padding-left: 15px;
    // }
</style>
