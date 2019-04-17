<template>
    <div>
        <ExchangeContent title="兑换内容" :show-modal="exchangeContentShow" :list="exchangeContentList"
                         @close="exchangeContentClose" @selectChecked="exchangeContentChecked"/>
        <Modal :class="modalBody ? 'modal-class2' : 'modal-class'" v-model="show" :title="title" :width="modalWidth" @on-cancel="closeModal" :mask-closable=false
               :footer-hide="true">
            <div v-if="uploadFlie" class="upload-flie">
                <Upload ref="upload" :show-upload-list="false" action="http://dscj-app.oss-cn-qingdao.aliyuncs.com"
                        :format="['jpg','jpeg','png']" :data="uploadData"
                        accept="image/jpeg,image/png,image/jpg,image/bmp"
                        :before-upload="handleBeforeUpload" :on-format-error="handleFormatError">
                    <div v-if="!img_url" class="modal-upload-flie">
                        <img class="upload-flie-img" src="../assets/icons/icon/upload.png"/>
                        <p>点击上传</p>
                    </div>
                    <img v-if="img_url" class="upload-flie-img-2" :src="img_url"/>
                </Upload>
            </div>
            <Form ref="formValidate" :model="formItem" :label-width="80" :rules="ruleValidate ? ruleValidate : {}" :style="styleRule">
                <div v-for="(t,index) in formList" :key="index">
                    <FormItem v-if="t.type==='input'" :label="t.name" :prop="t.field">
                        <Input v-model="formItem[t.field]" :placeholder="'请输入'+t.name"></Input>
                    </FormItem>
                    <FormItem v-if="t.type==='password'" :label="t.name" :prop="t.field">
                        <Input type="password" v-model="formItem[t.field]" :placeholder="'请输入'+t.name"></Input>
                    </FormItem>
                    <FormItem v-if="t.type==='inputTab'" :label="t.name" :prop="t.field">
                        <Input disabled :value="t.content"></Input>
                    </FormItem>
                    <FormItem v-if="t.type==='textarea'" :label="t.name" :prop="t.field">
                        <Input type="textarea" :rows="6" v-model="formItem[t.field]"
                               :placeholder="'请输入'+t.name"></Input>
                    </FormItem>
                    <!-- input-number -->
                    <FormItem v-if="t.type==='input-number'" :label="t.name" :prop="t.field">
                        <InputNumber :disabled="t.disable" :min='1' v-model="formItem[t.field]"
                                     :placeholder="'请输入'+t.name"></InputNumber>
                    </FormItem>
                    <!-- 处理兑换码 -- 兑换内容 exchange_content -->
                    <FormItem v-if="t.type==='select'&&t.selectList.length>0&&t.exchange_content" :label="t.name"
                              :prop="t.field">
                        <Select class="exchange-content-select" v-model="formItem[t.field]"
                                @on-open-change="exchangeContentOpen" :placeholder="'请选择'+t.name">
                            <Option v-for="(m,i) in t.selectList" :key="i" :value="m[t.selectField[0]]">
                                {{m[t.selectField[1]]}}
                            </Option>
                        </Select>
                    </FormItem>
                    <FormItem v-else-if="t.type==='select'&&t.selectChange" :label="t.name" :prop="t.field"
                              :class="t.clas ? t.clas: ''">
                        <Select v-model="formItem[t.field]" :placeholder="'请选择'+t.name" :disabled="t.disable"
                                @on-change="selectChangeList">
                            <Option v-for="(m,i) in t.selectList" :key="i" :value="m[t.selectField[0]]">
                                {{m[t.selectField[1]]}}
                            </Option>
                        </Select>
                    </FormItem>
                    <FormItem v-else-if="t.type==='select'&&t.selectList.length>0&&t.change" :label="t.name" :prop="t.field">
                        <Select v-model="formItem[t.field]" :placeholder="'请选择'+t.name" :disabled="t.disable">
                            <Option v-for="(m,i) in (t.line == 1 ? t.selectList[0] : t.selectList[1])" :key="i" :value="m[t.selectField[0]]">
                                {{m[t.selectField[1]]}}
                            </Option>
                        </Select>
                    </FormItem>
                    <FormItem v-else-if="t.type==='select'&&t.selectList.length>0" :label="t.name" :prop="t.field"
                              :class="t.clas ? t.clas: ''">
                        <Select v-model="formItem[t.field]" :placeholder="'请选择'+t.name" :disabled="t.disable"
                                @on-change="selectChange">
                            <Option v-for="(m,i) in t.selectList" :key="i" :value="m[t.selectField[0]]">
                                {{m[t.selectField[1]]}}
                            </Option>
                        </Select>
                    </FormItem>
                    <!-- date datetime -->
                    <FormItem v-if="t.type == 'date'" :label="t.name" :prop="t.field">
                        <DatePicker class="form-item-date" type="date" v-model="formItem[t.field]"
                                    :format="handleDateType(t)" :placeholder="handlePlaceholder(t)"></DatePicker>
                    </FormItem>
                    <!-- switch-datetimerange-->
                    <FormItem v-if="(t.type==='switch-datetimerange')" :label="t.name" :prop="handleField(t,1)">
                        <Switch class="form-item-swtich" size="large" v-if="t.switchList&&t.switchList.length>0"
                                v-model="formItem[handleField(t,0)]" @on-change="switchChange">
                            <span slot="open">{{t.switchList[0]}}</span>
                            <span slot="close">{{t.switchList[1]}}</span>
                        </Switch>
                        <DatePicker class="form-item-date" v-if="handleDateShow(t)" :type="handleType(t)"
                                    :format="handleDateType(t)" v-model="formItem[handleField(t,1)]"
                                    :value="formItem[handleField(t,1)]"
                                    :placeholder="handlePlaceholder(t)"></DatePicker>
                    </FormItem>
                    <!--富文本编辑器-->
                    <FormItem v-if="(t.type==='upload')" :label="t.name" :label-width="t.name ? 100 : 0" :prop="t.field" class="upload" ref="formInput">
                        <new-editor style="width: 100%;" @get-content="getContent" :content="content"/>
                        <div style="display: flex">
                            <down-loading :formData="downList"/>
                            <upload-btn v-if="uploadBtn"  text="上传附件" class="upload-img" bucket="jhyl-static-file"
                                        @uploadcomplete="uploadImg" :maxFileSize="300"/>
                        </div>
                    </FormItem>
                    <!--数组表单,针对线下课-->
                    <div class="offline-course" v-for="(it, ins) in t.list"  v-if="(t.type === 'array')">
                        <div class="offline-course-title">
                            <div class="offline-course-num">课程{{ins + 1 < 10 ? '0' + (ins + 1) : (ins + 1)}}</div>
                            <div class="offline-course-delete" @click="deleteList(it, ins)">
                                <img class="offline-course-delete-img" :src="rubbishIcon" alt="">
                                <div class="offline-course-delete-font">删除</div>
                            </div>
                        </div>
                        <div style="display: flex; flex-wrap: wrap">
                            <FormItem v-for="(item, index) in it" :label="item.name" :prop="item.field + item.index" :key="index"  style="margin-right: 10px;">
                                <Input v-if="(item.type === 'input')" v-model="formItem[item.field + item.index]" :placeholder="'请输入'+item.name" style="width: 320px;"></Input>
                                <Select v-if="(item.type === 'select')" v-model="formItem[item.field + item.index]" :placeholder="'请选择'+item.name" :disabled="item.disable"
                                        @on-change="selectChange" style="width: 250px;">
                                    <Option v-for="(m,i) in item.selectList" :key="i" :value="m[item.selectField[0]]">
                                        {{m[item.selectField[1]]}}
                                    </Option>
                                </Select>
                            </FormItem>
                        </div>
                    </div>
                </div>
            </Form>
            <p v-if="modalText2" class="modal-text">* {{modalText2}}</p>
            <div class="foot-btn">
                <Button v-if="isAdd" type="primary" ghost class="add-course" @click="addCourse">添加课程</Button>
                <Button class="btn-orange" type="primary" @click="handleSubmit('formValidate')">保存</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
    import {get_sign} from '../api/modules/ali_oss'
    import axios from 'axios'
    import ExchangeContent from './ExchangeContent'
    import uploadBtn from '../components/UploadButton'
    import downLoading from './DownLoading'
    import iconFont from '../assets/icons/icon/font.png'
    import iconColor from '../assets/icons/icon/color.png'
    import iconCopy from '../assets/icons/icon/photo.png'
    import rubbishIcon from '../assets/img/rubbish.png'
    import newEditor from './NewEditor'
    const ossHost = 'http://jhyl-static-file.oss-cn-hangzhou.aliyuncs.com';

    export default {
        components: {ExchangeContent, uploadBtn, downLoading, newEditor},
        props: {
            modalBody: {
                type: Boolean,
                default: false
            },
            modalFalse: {
                type: Boolean,
                default: false
            },
            showModal: {
                type: Boolean,
                default: false
            },
            dateTimes: {
                type: Boolean,
                default: false
            },
            //控制上传附件按钮
            uploadBtn: {
                type: Boolean,
                default: false
            },
            title: {
                type: String,
                default: ''
            },
            detailData: {
                type: Object,
                default: () => {
                }
            },
            modalText: {
                type: String,
                default: ''
            },
            formList: {
                type: Array,
                default: []
            },
            ruleValidate: {
                type: Object,
                default: {}
            },
            uploadFlie: {
                type: Boolean,
                default: false
            },
            maxFileSize: {
                type: Number,
                default: 0
            },
            styleRule: {
                type: String,
                default: ''
            },
            modalWidth: {
                type: Number,
                default: 645
            },
            isAdd: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                content: '',
                descriptionHtml: '',
                iconFont, iconColor, iconCopy,rubbishIcon,
                exchangeContentShow: false,
                exchangeContentList: [],
                show: false,
                formItem: {},
                copyFormItem: {},
                uploadData: {},
                img_url: '',
                resourse_url: '',
                fileSize: null,
                uploadConfig: {
                    bucket: 'jhyl-static-file',
                    dir: 'user_task',
                    type: 1
                },
                downList: [],
                fontList: [
                    {
                        name: '标题',
                        size: 32,
                        weight: true
                    },
                    {
                        name: '小标题',
                        size: 24
                    },
                    {
                        name: '正文',
                        size: 16
                    },
                ],
                colorList: [
                    {
                        name: '红色',
                        color: '#f00'
                    },
                    {
                        name: '绿色',
                        color: '#0f0'
                    },
                    {
                        name: '蓝色',
                        color: '#00f'
                    },
                ],
                color: '',
                modalText2: '',
            }
        },
        watch: {
            modalText(_new) {
                this.modalText2 = _new
            },
            showModal(_new) {
                this.ModalState(_new)
                this.$nextTick(() => {
                    if (_new) {
                        this.formItem = this.dateTimes ? this.detailData : this.$config.copy(this.detailData, {})
                        if (this.formItem.upload) this.downList = this.formItem.upload
                        else this.downList = []
                        if (this.formItem.uploading) {
                            this.content = this.formItem.uploading
                            // this.descriptionHtml = this.formItem.uploading
                            // this.descriptionHtml = this.descriptionHtml.replace('class="form-message"', '')
                        } else this.descriptionHtml = ''
                        if (this.formItem.hasOwnProperty('img_url')) {
                            this.img_url = this.formItem.img_url
                        } else this.img_url = ''
                        if (this.formItem.hasOwnProperty('password')) {
                            this.formItem.password = this.formItem.password.slice(0, 6)
                        }
                        this.copyFormItem = this.$config.copy(this.formItem, {});
                        this.modalText2 = this.modalText;
                    } else this.$refs.formValidate.resetFields()
                })
            },
            show(val) {
                if (!val) {
                    if (this.content) this.content = ''
                }else {
                    if(JSON.stringify(this.detailData) == '{}') {
                        this.$nextTick(() => {
                            this.$refs.formValidate.resetFields()
                        })
                    }
                }
            },
            detailData(_new) {
                this.detailData = _new
            },
            formList(_new) {
                this.formList = _new
            },
        },
        methods: {
            deleteList(item, index) {
                this.$emit('delete-list', index)
            },
            getContent(val) {
                this.content = val
            },
            selectChange(val) {
                // if (val == 'online') this.formList[2].line = 1
                // else if (val == 'underline') this.formList[2].line = 0
                if (this.modalText2) {
                    if (val == 3) this.modalText2 = '获得所属机构后台发布产品及动态等操作权限'
                    if (val == 4) this.modalText2 = '获得所属机构后台批阅作业等操作权限'
                }
            },
            selectChangeList(val) {
              this.$emit('change-list', val)
            },
            handleDateType(t) {
                return t.type.includes('time') ? 'yyyy/MM/dd HH:mm' : 'yyyy/MM/dd'
            },
            overImg(val) {
                console.log(val);
            },
            handleDateShow(t) {
                return t.type === 'switch-datetimerange' ? !this.formItem[this.handleField(t, 0)] : true
            },
            handlePlaceholder(t) {
                return t.type === 'switch-datetimerange' ? '请选择' + t.name + '范围' : '请选择' + t.name
            },
            handleType(t) {
                return t.type === 'switch-datetimerange' ? 'datetimerange' : t.type
            },
            handleField(t, n) {
                return t.type === 'switch-datetimerange' ? t.field[n] : t.field
            },
            closeModal() {
                this.show = false;
                // this.formItem = {};
                this.$refs.formValidate.resetFields();
                this.$emit("close");
            },
            handleFormatError(file) {
                this.$Message.warning('请上传图片');
            },
            switchChange(_new) {

            },
            exchangeContentChecked(t) {
                this.formItem[this.formList[2].field] = t.id
            },
            exchangeContentClose() {
                this.exchangeContentShow = false
            },
            exchangeContentOpen(v) {
                this.exchangeContentShow = true
                this.exchangeContentList = this.formList[2].selectList
            },
            ModalState(_new) {
                this.show = _new
            },
            handleBeforeUpload(file) {
                this.fileSize = file.size / (1024 * 1024);
                if (this.maxFileSize > 0 && this.fileSize > this.maxFileSize) {
                    this.$Modal.info({
                        title: '提示',
                        content: '文件过大',
                        onOk: () => {
                        }
                    });
                    return;
                }
                this.handleGetassignKey(file);
                return false
            },
            handleFormData() {
                if (this.uploadFlie) this.formItem.img_url = this.img_url
                if (this.content) this.formItem.uploading = this.content
                if (this.downList && this.downList.length > 0) this.formItem.downList = this.downList
                if (this.formItem.hasOwnProperty('password')) {
                    if (this.copyFormItem.password === this.formItem.password) {
                        delete this.formItem.password
                    }
                }
                let d = this.$config.copy(this.formItem, {})
                let close = () => {
                    if (!this.modalFalse) this.closeModal()
                }
                (async () => {
                    await this.$emit('from-submit', this.formItem)
                    await close()
                })()
            },
            setCourse() {
                this.formItem.offlineCurriculums = []
                for(let i = 0; i < this.formList[2].list.length; i++) {
                    this.formItem.offlineCurriculums.push({})
                }
                for(let item in this.formItem) {
                    let index = item.substring(item.length - 1)
                    let name = item.substring(item.length - 1, 0)
                    this.formItem.offlineCurriculums.forEach((item1, index1) => {
                        if(index == index1) {
                            item1[name] = this.formItem[name + index]
                        }
                    })
                }
            },
            handleSubmit(name) {
                let d = this.$refs.inputStyle && this.$refs.inputStyle[0].innerText || this.imgUrl
                this.$refs[name].validate((valid) => {
                    if (valid) {
                        if (this.formList.length === 3 && this.formList[2].type === 'upload' && !d) this.$Message.warning('请输入文章正文');
                        else if (this.uploadFlie && !this.img_url) this.$Message.warning('请上传头像');
                        else if (this.formList.length > 4 && this.formList[4].type === 'switch-datetimerange') {
                            if (!this.formItem.isswitch && !this.formItem.effective_time[0]) this.$Message.info('请选择有效时间');
                            else this.handleFormData()
                        } else {
                            if(this.$refs.formInput){
                                if(this.content) this.handleFormData()
                                else this.$Message.info('请输入作业描述')
                            }
                            else {
                                if(this.styleRule) {
                                    this.setCourse()
                                    this.handleFormData()
                                }
                                else this.handleFormData()
                            }
                        }
                    }
                })
            },
            // 上传到oss上
            handleUploadFile(form_data, url) {
                var vm = this;
                axios({
                    method: 'POST',
                    url: url,
                    data: form_data,
                    onUploadProgress: function (progressEvent) {
                        var progress = Math.round(progressEvent.lengthComputable ? progressEvent.loaded *
                            100 / progressEvent.total : 0);
                        vm.percentage = progress;
                    },
                }).then(res => {
                    this.img_url = url + '/' + this.resourse_url;
                });
            },
            // 从oss上获取assignKey;
            handleGetassignKey(file_item, insert) {
                var date = new Date(); //dscj-app,user_task
                date = date.toGMTString();
                get_sign(file_item.type, date, this.uploadConfig.bucket, this.uploadConfig.dir, file_item.name, 'POST')
                    .then(res => {
                        if (res.data.res_code == 1) {
                            const formData = new FormData();
                            this.resourse_url = res.data.data.filename;
                            formData.append('key', res.data.data.filename);
                            formData.append('OSSAccessKeyId', res.data.data.accessKeyID);
                            formData.append('success_action_status', '200');
                            formData.append('signature', res.data.data.sign);
                            formData.append('policy', res.data.data.policyBase64);
                            formData.append('file', file_item);
                            this.handleUploadFile(formData, encodeURI(ossHost));
                        }
                    })
            },
            uploadImg(val) {
                this.downList.push(val)
                this.formItem.downList = this.downList
            },
            addImg(val) {
                var img = new Image()
                img.src = val.url
                img.style.width = '100%'
                img.style.display = 'block'
                this.$refs.inputStyle[0].appendChild(img)
                this.imgUrl = val.url
            },
            handleDrop(val) {
                this.$refs.inputStyle[0].style.fontSize = val + 'px'
                if (val == 32) this.$refs.inputStyle[0].style.fontWeight = 'bold'
                else this.$refs.inputStyle[0].style.fontWeight = 'normal'
            },
            handleDrop1(val) {
                this.$refs.inputStyle[0].style.color = val
            },
            addCourse() {
                this.$emit('add-course', this.formList[2].list.length)
            }
        },
    }
</script>
<style lang="less" scoped>
    .form-item-date{
        /deep/ .ivu-btn{
            display: inline-block !important;
        }
    }
    .modal-class{
        /deep/.ivu-modal-body {
            padding: 50px;
        }
    }
    .modal-class2{
        /deep/.ivu-modal-body {
            padding: 30px 25px;
        }
    }
    /deep/ .ivu-modal-header {
        background: #fff !important;
        padding: 0 !important;
    }

    /deep/ .ivu-modal-close .ivu-icon-ios-close {
        color: #9397AD !important;
    }

    /deep/ .ivu-modal-header-inner {
        font-family: PingFangSC-Regular !important;
        font-size: 20px !important;
        color: #474C63 !important;
        height: 70px;
        line-height: 70px;
    }

    .modal-text {
        margin-left: 100px;
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: #F54802;
    }

    .btn-orange {
        width: 150px;
    }

    .foot-btn {
        display: flex;
        justify-content: center;
        margin-top: 30px;
    }

    .upload-flie {
        display: flex;
        justify-content: center;
        margin-bottom: 20px;
    }

    .modal-upload-flie {
        width: 118px;
        height: 118px;
        background: #F0F0F7;
        border-radius: 100px;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
    }

    .upload-flie-img {
        width: 40px;
        height: 35px;
    }

    .upload-flie-img-2 {
        width: 118px;
        height: 118px;
        border-radius: 100px
    }

    /deep/ .ivu-form-item-content {
        display: flex;
    }

    .form-item-swtich {
        width: 80px;
        height: 34px;
        margin-right: 20px;
        line-height: 34px;
    }

    /deep/ .ivu-switch:after {
        width: 30px;
        height: 30px;
    }

    /deep/ .ivu-form-item-label {
        font-size: 16px
    }

    .form-item-date {
        flex: 1
    }

    /deep/ .ivu-switch-inner {
        left: 36px;
    }

    /deep/ .ivu-switch-checked .ivu-switch-inner {
        left: 12px;
    }

    /deep/ .ivu-switch-large.ivu-switch-checked:after {
        left: 48px;
    }

    .form-item-other {
        padding-left: 30px;
    }

    .exchange-content-select /deep/ .ivu-select-dropdown {
        display: none !important;
    }

    /*/deep/ .ivu-modal-wrap{ display: flex;align-items: center; }*/
    /*/deep/ .ivu-modal{top: 0}*/
    .upload {
        /deep/ .ivu-input {
            height: 400px;
        }

        /deep/ .ivu-form-item-content {
            flex-direction: column
        }
    }

    .upload-img {
        margin-top: 10px;
    }

    .form-message {
        padding: 0 15px;
        width: 475px;
        height: 300px;
        border: 1px solid #d7dde4;
        outline: none;
        overflow: hidden;
        overflow-y: auto;
        font-size: 16px;
    }

    .up-img {
        margin-right: 10px;
    }

    .drop-box {
        width: 10px;
        height: 10px;
        display: inline-block;
        margin-right: 10px;
    }

    /deep/ .ivu-input[disabled] {
        font-family: PingFangSC-Regular;
        color: #474C63;
    }

    .form-editor {
        display: flex;
        margin-top: 15px;
    }

    .add-course{
        text-align: center;
        color: #4098ff;
        font-size: 16px;
        cursor: pointer;
        width: 150px;
        margin-right: 20px;
    }

    .offline-course{
        background: #F7F7F7;
        margin-bottom: 15px;
    }

    .offline-course-title{
        display: flex;
        justify-content: space-between;
        padding: 15px 15px;

        .offline-course-num{
            font-family: PingFangSC-Medium;
            font-size: 16px;
            color: #474C63;
            letter-spacing: 0;
        }

        .offline-course-delete{
            cursor: pointer;
            display: flex;
            align-items: center;

            .offline-course-delete-img{
                width: 13px;
                height: 14px;
                margin-right: 4px;
            }

            .offline-course-delete-font{
                opacity: 0.5;
                font-family: PingFangSC-Regular;
                font-size: 14px;
                color: #474C63;
                letter-spacing: 0;
            }
        }
    }
</style>
