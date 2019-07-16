<template>
    <div>
        <ExchangeContent title="兑换内容" :show-modal="exchangeContentShow" :list="exchangeContentList"
                         @close="exchangeContentClose" @selectChecked="exchangeContentChecked"/>
        <Modal :class="flowY ? 'flowY' : modalPadding ? modalPadding : handleFloor == 2 ? 'modal-class3' : modalBody ? 'modal-class2' : 'modal-class'" v-model="show" :title="title" :width="modalWidth"
               @on-cancel="closeModal" :mask-closable=false
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
            <Form ref="formValidate" :model="formItem" :label-width="labelWidths ? labelWidths : 80"
                  :label-position="labelWidths ? 'left' : 'right'" :rules="ruleValidate ? ruleValidate : {}"
                  :style="styleRule" class="form-class">
                <div v-for="(t,index) in formList" :key="index" style="display: inline">
                    <FormItem v-if="t.type==='input'" v-show="t.isShow ? t.isShow == 1 : true" :label="t.name"
                              :prop="t.field">
                        <template v-if="t.double" slot="label"><span style="letter-spacing: 26px">{{t.name[0]}}</span>{{t.name[1]}}</template>
                        <Input v-model="formItem[t.field]" :placeholder="'请输入'+t.name"></Input>
                    </FormItem>
                    <FormItem v-if="t.type==='password'" :label="t.name" :prop="t.field">
                        <Input type="password" v-model="formItem[t.field]" :placeholder="'请输入'+t.name"></Input>
                    </FormItem>
                    <FormItem v-if="t.type==='inputTab'" :label="t.name" :prop="t.field">
                        <Input disabled :value="t.content"></Input>
                    </FormItem>
                    <FormItem v-if="t.type==='textarea'" v-show="t.isShow ? t.isShow == 1 : true" :label="t.name"
                              :prop="t.field">
                        <template v-if="t.double" slot="label"><span style="letter-spacing: 26px">{{t.name[0]}}</span>{{t.name[1]}}</template>
                        <Input type="textarea" :maxlength="t.maxlength" :rows="6" v-model="formItem[t.field]"
                               :placeholder="'请输入'+ t.name"></Input>
                        <div v-if="t.maxlength" class="font-num">
                            {{formItem[t.field]&&formItem[t.field].length ? formItem[t.field]&&formItem[t.field].length : '0'}}/{{t.maxlength}}
                        </div>
                    </FormItem>
                    <!-- input-number -->
                    <FormItem v-if="t.type==='input-number'" :prop="t.field" :class="t.class ? t.class : t.clas ? t.clas: ''" v-show="t.isShow ? t.isShow == 1 : true">
                        <template v-if="t.double" slot="label"><span style="letter-spacing: 26px">{{t.name[0]}}</span>{{t.name[1]}}</template>
                        <template v-else slot="label"><span :class="handleClass(t)">{{t.name}}</span></template>
                        <InputNumber :disabled="t.disable" :min='0' v-model="formItem[t.field]"
                                     :placeholder="'请输入'+t.name" ref="minuteInput"></InputNumber>
                        <div v-if="t.isMin" style="display: inline-block;position: absolute;left: 130px;top: 3px;cursor: text" @click="minuteInput">分钟</div>
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
                    <!--下拉框触发change事件-->
                    <FormItem v-else-if="t.type==='select'&&t.selectChange" :prop="t.field" :label="t.name"
                              :class="t.clas ? t.clas: ''" v-show="t.isShow ? t.isShow == 1 : true">
                        <template v-if="t.double" slot="label"><span style="letter-spacing: 26px">{{t.name[0]}}</span>{{t.name[1]}}</template>
                        <Select v-model="formItem[t.field]" :placeholder="'请选择'+t.name" :disabled="t.disable"
                                @on-change="selectChangeList(formItem[t.field], t)">
                            <Option v-for="(m,i) in t.selectList" :key="i" :value="m[t.selectField[0]]">
                                {{m[t.selectField[1]]}}
                            </Option>
                        </Select>
                    </FormItem>
                    <FormItem v-else-if="t.type==='select'&&t.selectList.length>0&&t.change" :prop="t.field"
                              :label="t.name">
                        <Select v-model="formItem[t.field]" :placeholder="'请选择'+t.name" :disabled="t.disable">
                            <Option v-for="(m,i) in (t.line == 1 ? t.selectList[0] : t.selectList[1])" :key="i"
                                    :value="m[t.selectField[0]]" :disabled="m.disabled">
                                {{m[t.selectField[1]]}}
                            </Option>
                        </Select>
                    </FormItem>
                    <FormItem v-else-if="t.type==='select'&&t.selectList.length>0"
                              v-show="t.isShow ? t.isShow == 1 : true" :prop="t.field"
                              :class="t.clas ? t.clas: ''">
                        <template v-if="t.double" slot="label"><span style="letter-spacing: 26px">{{t.name[0]}}</span>{{t.name[1]}}</template>
                        <template v-else slot="label"><span :class="handleSelectClass(t)">{{t.name}}</span></template>
                        <Select v-model="formItem[t.field]" :placeholder="'请选择'+t.name" :disabled="t.disable"
                                @on-change="selectChange">
                            <Option v-for="(m,i) in t.selectList" :key="i" :value="m[t.selectField[0]]">
                                {{m[t.selectField[1]]}}
                            </Option>
                        </Select>
                    </FormItem>
                    <!--多选框-->
                    <FormItem v-if="t.type==='multiple'" :prop="t.field" :label="t.name" v-show="t.isShow ? t.isShow == 1 : true" class="select-multiple">
                        <Select v-model="formItem[t.field]" :placeholder="'请选择'+t.name" multiple @on-change="multipleChange(formItem[t.field], t.field)">
                            <Option v-for="(m,i) in t.selectList" :key="i" :value="m[t.selectField[0]]">
                                {{m[t.selectField[1]]}}
                            </Option>
                        </Select>
                        <slot name="multiple"></slot>
<!--                        <div>{{formItem[t.field]}}</div>-->
                    </FormItem>
                    <!-- date datetime -->
                    <FormItem v-if="t.type == 'date'" :label="t.name" :prop="t.field">
                        <DatePicker class="form-item-date" type="date" v-model="formItem[t.field]"
                                    :format="handleDateType(t)" :placeholder="handlePlaceholder(t)"></DatePicker>
                    </FormItem>
                    <!-- 选择日期及时间-->
                    <FormItem v-if="t.type == 'datetime'" :label="t.name" :prop="t.field" :class="t.clas ? t.clas: ''">
                        <DatePicker class="form-item-datetime" type="datetime" format="yyyy/MM/dd HH:mm" :placeholder="'请选择' + t.name"  v-model="formItem[t.field]"></DatePicker>
                    </FormItem>
                    <!-- switch-datetimerange-->
                    <FormItem class="form-labels" v-if="(t.type==='switch-datetimerange')" :label="t.name"
                              :prop="handleField(t,1)">
                        <template slot="label"><span :class="handleClass(t)">{{t.name}}</span></template>
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
                    <!--上传封面-->
                    <FormItem v-if="t.type == 'uploadPanel'" v-show="t.isShow ? t.isShow == 1 : true" ref="upload"
                              :label="t.name ? t.name : '展示封面'" required>
                        <upload-panel ref="upload_panel" :resourse="formItem[t.field]" :upload-config="uploadConfig"
                                      :panelOptions="panelOptions"
                                      @uploadcomplete="handleDefaultUploadComplete" :maxFileSize="2"
                                      types="image/gif, image/jpeg, image/png">
                            <span slot="file-require" class="font-hint">*只能上传jpg/png文件，且图片比例为3:2，建议尺寸480*320px</span>
                        </upload-panel>
                    </FormItem>
                    <!-- 新上传封面-->
                    <FormItem  v-if="t.type == 'uploadBtn'" v-show="t.isShow ? t.isShow == 1 : true" ref="upload"
                               :label="t.name ? t.name : '展示封面'" required>
                        <template v-if="t.double" slot="label"><span style="letter-spacing: 26px">{{t.name[0]}}</span>{{t.name[1]}}</template>
                        <div>
                            <div class="demo-file">
                                <div v-if="formItem[t.field]" class="demo-carousel">
                                    <img @click="deleteImgList(0)" src="../assets/img/close-icon.png"
                                         class="upload-img-main-icon"/>
                                    <!-- <Icon @click="deleteImgList(0)" class="upload-img-main-icon" type="ios-close-circle" /> -->
                                    <img class="upload-img-item" :src="formItem[t.field]"/>
                                </div>
                                <div class="demo-file-key" v-else>
                                    <img src="../assets/img/img-video.png"/>
                                    <p>展示图片或视频</p>
                                </div>
                            </div>
                            <div class="upload-btn-flex">
                                <p class="upload-img-text">
                                    *只支持jpg/png图片，建议尺寸768*432px，且大小不超过2M</p>
                                <upload-btn text="上传" :imgtypes="imgType" bucket="jhyl-static-file"
                                            @handle-close="handleFileClose" @uploadcomplete="uploadcomplete"
                                            :type="fileType" :maxFileSize="[2, 300]"/>
                            </div>
                        </div>
                    </FormItem>
                    <!-- 上传视频 -->
                    <FormItem v-if="t.type == 'uploadVideo'" ref="upload" label="上传视频" required>
                        <upload-panel ref="upload_panel" :resourse="formItem[t.field]"
                                      :upload-config="uploaderConfigVideo"
                                      @vedioTime="videoTime" @uploadcomplete="handleDefaultUploadCompleteVideo"
                                      :maxFileSize="300" types="video/mp4,video/mov,video/avi">
                            <span slot="file-require" class="font-hint">*只能上传mp4/mov/avi文件，且不超过300M</span>
                        </upload-panel>
                    </FormItem>
                    <!--富文本编辑器-->
                    <FormItem v-if="(t.type==='upload')" v-show="t.isShow ? t.isShow == 1 : true" :label="t.name"
                              :label-width="t.name ? 80 : 0" :prop="t.field" class="upload" ref="formInput">
                        <new-editor
                                :style=" t.small ? 'height: 340px;' : t.showAll == 1 ? 'height: auto' : 'height: 500px;'"
                                @get-content="getContent" :content="content" editor-id="editorId" @editor-change="editorChange"/>
                        <div style="height: 32px;">
                            <div v-if="t.showAll" @click="showContent(t.showAll)" class="show-content">{{t.showAll == 1 ? '收起↑' : '展开全文↓'}}</div>
                        </div>
                        <div style="display: flex">
                            <down-loading :formData="downList"/>
                            <upload-btn v-if="uploadBtn" text="上传附件" class="upload-img" bucket="jhyl-static-file"
                                        @uploadcomplete="uploadImg" :maxFileSize="300"/>
                        </div>
                    </FormItem>
                    <!--直播布局-->
                    <FormItem v-if="t.type == 'localLive'" :label="t.name" required class="select-multiple">
                        <div style="display: flex">
                            <div @click="liveClick(t.field, 1)" class="local-live" :style="`border: 1px solid ${formItem[t.field]  == '1' ? '#4098ff' : '#fff'};`">
                                <div class="local-live-left">文档 </div>
                                <div class="local-live-right-top" style="">视频</div>
                                <div class="local-live-right-bottom"></div>
                            </div>
                            <div @click="liveClick(t.field, 3)" class="local-live" :style="`border: 1px solid ${formItem[t.field]  == '3' ? '#4098ff' : '#fff'};margin-left: 20px;`">
                                <div class="local-live-left">视频</div>
                                <div class="local-live-right"></div>
                            </div>
                        </div>
                        <div class="live-hint">* 课程创建成功，不得修改直播布局</div>
                    </FormItem>
                    <!--数组表单,针对线下课-->
                    <div v-if="(t.type === 'array')" class="offline-course" v-for="(it, ins) in t.list" :key="ins">
                        <div class="offline-course-title">
                            <div class="offline-course-num">课程{{ins + 1 < 10 ? '0' + (ins + 1) : (ins + 1)}}</div>
                            <div class="offline-course-delete" @click="deleteList(it, ins)">
                                <img class="offline-course-delete-img" :src="rubbishIcon" alt="">
                                <div class="offline-course-delete-font">删除</div>
                            </div>
                        </div>
                        <div style="display: flex; flex-wrap: wrap">
                            <FormItem v-for="(item, index) in it" :label="item.name" :prop="item.field + item.index"
                                      :key="index" style="margin-right: 10px;">
                                <Input v-if="(item.type === 'input')" v-model="formItem[item.field + item.index]"
                                       :placeholder="'请输入'+item.name" style="width: 320px;"></Input>
                                <Select v-if="(item.type === 'select')" v-model="formItem[item.field + item.index]"
                                        :placeholder="'请选择'+item.name" :disabled="item.disable"
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
            <p v-if="modalText2" class="modal-text">{{modalText2}}</p>
            <div class="foot-btn">
                <Button v-if="isAdd" type="primary" ghost class="add-course" @click="addCourse">添加课程</Button>
                <Button v-if="handleFloor && handleFloor == '2'" class="btn-pre" type="text" @click="handleLast">上一步</Button>
                <Button v-if="handleFloor && handleFloor == '1'" class="btn-orange" type="primary" @click="handleSubmit('formValidate')">下一步</Button>
                <Button v-else class="btn-orange" type="primary" @click="handleSubmit('formValidate')">{{btnName ? btnName : '保存'}}
                </Button>
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
    import NewEditor from './NewEditor'
    import uploadPanel from './UploadPanel'
    const ossHost = 'http://jhyl-static-file.oss-cn-hangzhou.aliyuncs.com';

    export default {
        components: {ExchangeContent, uploadBtn, downLoading, NewEditor, uploadPanel},
        props: {
            labelWidths: {
                type: Number,
                default: null
            },
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
            },
            handleFloor: {
                type: Number,
                default: null
            },
            btnName: {
                type: String,
                default: ''
            },
            panelOptions: {
                type: Object,
                default: function () {
                    return {
                        panelWidth: 465,
                        panelHeight: 310,
                    }
                }
            },
            modalPadding: {
                type: String
            },
            multipleList: {
                type: Array
            },
            flowY: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                content: '',
                editorId: 'form-modal-new-editer' + Math.floor(Math.random() * 10000 + 1),
                descriptionHtml: '',
                iconFont, iconColor, iconCopy, rubbishIcon,
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
                uploaderConfigVideo: {
                    bucket: 'jhyl-static-file',
                    dir: 'mspx',
                    time: true,
                    type: 2
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
                imgType: 1,
                fileType: 'image/png,image/jpg',
                multipleName: ''
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
                    this.$emit('modal-close')
                } else {
                    if (JSON.stringify(this.detailData) == '{}') {
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
            multipleList(_new) {
                let arr = []
                _new.forEach(item => {
                    arr.push(item.id)
                })
                if(this.formItem[this.multipleName].length > _new.length) this.formItem.product_ids = arr
            }
        },
        methods: {
            handleSelectClass(t) {
                if (this.labelWidths) return this.handleClass(t)
                return t.name.length == 2 ? 'form-label' : ''
            },
            videoTime(v) {
                this.formItem.duration = v
            },
            handleClass(t) {
                return t.name.length == 4 && this.labelWidths ? 'form-label-2' : ''
            },
            deleteList(item, index) {
                this.$emit('delete-list', index)
            },
            getContent(val) {
                this.content = val
            },
            selectChange(val) {
                // if (val == 'online') this.formList[2].line = 1
                // else if (val == 'underline') this.formList[2].line = 0
            },
            selectChangeList(val, t) {
                if(t.changeNum) this.$emit(`change-list${t.changeNum}`, val)
                else this.$emit('change-list', val)
            },
            handleDateType(t) {
                return t.type.includes('time') ? 'yyyy/MM/dd HH:mm' : 'yyyy/MM/dd'
            },
            overImg(val) {
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
                    await this.handleFloor && this.handleFloor == 1 ? this.$emit('handle-next') : this.$emit('from-submit', this.formItem)
                    await this.handleFloor && this.handleFloor == 1 ? () => {} : close()
                })()
            },
            setCourse() {
                this.formItem.offlineCurriculums = []
                for (let i = 0; i < this.formList[2].list.length; i++) {
                    this.formItem.offlineCurriculums.push({})
                }
                for (let item in this.formItem) {
                    let index = item.substring(item.length - 1)
                    let name = item.substring(item.length - 1, 0)
                    this.formItem.offlineCurriculums.forEach((item1, index1) => {
                        if (index == index1) {
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
                        } else if (this.formList.length == 5 && this.formList[3].type == 'uploadPanel' && !this.formItem.img_default) {
                            this.$Message.info('请上传封面')
                        } else if (this.formList.length == 3 && this.formList[2].type == 'uploadVideo' && !this.formItem.video_url) {
                            this.$Message.info('请上传视频')
                        } else if (this.formList.length == 2 && this.formList[1].field == 'product' && !this.formItem.product) {
                            this.$Message.info('该机构下无产品，请重选机构')
                        } else if(this.formList.length == 4 && this.formList[3].field == 'img_url' && !this.formItem.img_url){
                            this.$Message.info('请上传封面')
                        } else if(this.formList.length == 10 && this.formList[8].field == 'img_url' && !this.formItem.img_url){
                            this.$Message.info('请上传封面')
                        } else if(this.formList.length == 7 && this.formList[2].field == 'start_time' && this.formItem.start_time.getTime() < new Date().getTime()){
                            this.$Message.info('开始时间不能小于当前时间')
                        }else{
                            if (this.$refs.formInput) {
                                if (this.content && this.content != '<p><br></p>') {
                                    this.handleFormData()
                                }
                                else {
                                    if ((this.handleFloor && this.handleFloor == '1') || !this.handleFloor) this.handleFormData()
                                    else this.$Message.info('请输入内容描述')
                                }
                            } else {
                                if (this.styleRule) {
                                    this.setCourse()
                                    this.handleFormData()
                                } else this.handleFormData()
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
            },
            // 下一步操作
            handleNext() {
                this.$emit('handle-next')
            },
            //上一步操作
            handleLast() {
                this.$emit('handle-last')
            },
            handleDefaultUploadCompleteVideo(url) {
                this.formItem.video_url = url;
                this.$forceUpdate()
            },
            handleDefaultUploadComplete(url) {
                this.formItem.img_default = url;
                this.$forceUpdate()
            },
            showContent(val) {
                this.$emit('showContent', val)
            },
            editorChange() {
                this.$emit('editor-change')
            },
            handleFileClose() {
                this.$Message.warning('最多上传1张图片')
            },
            uploadcomplete(val) {
                this.formItem.img_url = val.url;
                this.$forceUpdate()
            },
            deleteImgList() {
                this.formItem.img_url = '';
                this.$forceUpdate()
            },
            multipleChange(val, name) {
                this.multipleName = name
                this.$emit('multiple-change', val)
            },
            liveClick(field, num) {
                if(this.detailData.layout) {
                    this.$Message.info('无法修改布局')
                }else{
                    this.formItem[field] = num
                    this.$forceUpdate()
                }
            },
            minuteInput() {
                // console.log(this.$refs.minuteInput);
                // this.$refs.minuteInput[0].focus()
                if(document.querySelectorAll('.ivu-input-number-input').length == 1) document.querySelectorAll('.ivu-input-number-input')[0].focus()
            }
        },
    }
</script>
<style lang="less" scoped>
    /deep/ .upload-panel {
        width: 100%;
    }

    .form-item-date {
        /deep/ .ivu-btn {
            display: inline-block !important;
        }
    }

    .form-item-datetime {
        /deep/ .ivu-btn {
            display: inline-block !important;
        }
    }

    .form-label-2 {
        letter-spacing: 3px
    }

    .modal-class {
        /deep/ .ivu-modal-body {
            padding: 50px;
        }
    }

    .modal-class2 {
        /deep/ .ivu-modal-body {
            padding: 30px 25px;
        }
    }

    .modal-class3 {
        /deep/ .ivu-modal-body {
            padding: 0 0 30px 0;
        }
        /deep/ .w-e-text-container{
            /*padding: 0 30px;*/
            overflow-y: auto;
        }
        /deep/ .w-e-toolbar{
            padding: 0 30px;
        }
    }

    .flowY{
        /deep/ .ivu-modal-body {
            padding: 30px ;
        }
        /deep/ .w-e-text-container{
            /*padding: 0 30px;*/
            overflow-y: auto;
        }
        /deep/ .w-e-toolbar{
            padding: 0 30px;
        }
    }

    .modal-class4 {
        /deep/ .ivu-modal-body {
            padding: 10px 50px 40px 50px;
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
        margin-left: 80px;
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: #F54802;
    }

    .btn-orange {
        width: 150px;
    }

    .btn-last {
        margin-right: 20px;
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

    .add-course {
        text-align: center;
        color: #4098ff;
        font-size: 16px;
        cursor: pointer;
        width: 150px;
        margin-right: 20px;
    }

    .offline-course {
        background: #F7F7F7;
        margin-bottom: 15px;
    }

    .offline-course-title {
        display: flex;
        justify-content: space-between;
        padding: 15px 15px;

        .offline-course-num {
            font-family: PingFangSC-Medium;
            font-size: 16px;
            color: #474C63;
            letter-spacing: 0;
        }

        .offline-course-delete {
            cursor: pointer;
            display: flex;
            align-items: center;

            .offline-course-delete-img {
                width: 13px;
                height: 14px;
                margin-right: 4px;
            }

            .offline-course-delete-font {
                opacity: 0.5;
                font-family: PingFangSC-Regular;
                font-size: 14px;
                color: #474C63;
                letter-spacing: 0;
            }
        }
    }

    .font-hint {
        color: #F54802;
    }

    .font-num {
        display: inline-block;
        position: absolute;
        top: 102px;
        right: 18px;
    }

    /deep/ .w-e-text {
        overflow: hidden;
        overflow-y: auto;
        padding: 0 30px;
        height: auto !important;
        min-height: 100%;
    }

    .show-content {
        cursor: pointer;
        width: 80px;
        text-align: center;
        float: right;
        margin-right: 10px;

        &:hover {
            color: rgb(57, 76, 93);
        }
    }
    /deep/ .w-e-toolbar{
        border: none !important;
    }
    /deep/ .md-cloud-upload{
        margin-top: 100px !important;
    }
    /deep/ .ivu-input-number-input[disabled]{
        color: #657180
    }
    .demo-file {
        width: 465px;
        height: 310px;
        margin-bottom: 20px;
        border: 1px solid #d7dde4;

        p {
            color: #d6dbe2;
        }
    }
    .demo-carousel {
        width: 465px;
        height: 310px;
    }
    .upload-img-main-icon {
        color: #fff;
        position: absolute;
        right: 0;
    }
    .upload-img-item {
        width: 100%;
        height: 100%;
    }
    .demo-file-key {
        width: 465px;
        height: 310px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
    .upload-btn-flex {
        display: flex;

        .upload-img-text {
            font-family: PingFangSC-Regular;
            font-size: 12px;
            color: #9397AD;
            letter-spacing: 0.18px;
            line-height: 20px;
            text-align: left;
            margin-right: 35px;
        }
    }
    .btn-pre {
        color: #474C63;
        width: 150px;
        height: 38px;
        background: #FFFFFF;
        border: 1px solid #9397AD;
        border-radius: 4px;
        margin-right: 10px;
    }
    .local-left{
        width: 265px;
        display: inline-block;
    }
    .local-right{
        width: 265px;
        display: inline-block;
        margin-left: 10px;
    }
    .form-class{
        /deep/ .ivu-modal-wrap{
            display: inline-block !important;
        }
    }
    .local-live{
        width: 220px;
        height: 140px;
        padding: 4px;
        cursor: pointer;

        .local-live-left{
            float: left;
            background-color:#e8e8e8;
            width: 160px;
            height: 130px;
            display: flex;
            align-items: center;
            justify-content: center
        }
        .local-live-right-top{
            float: right;
            background-color:#e8e8e8;
            width: 46px;
            height: 40px;
            margin-bottom: 4px;
            display: flex;
            align-items: center;
            justify-content: center
        }
        .local-live-right-bottom{
            float: right;
            background-color:#e8e8e8;
            width: 46px;
            height: 86px;
        }
        .local-live-right{
            float: right;
            width:46px;
            height: 130px;
            background-color:#e8e8e8;
        }
    }
    /deep/ .ivu-tag-checked{
        display: none;
    }
    /deep/ .ivu-select-multiple .ivu-select-selection{
        height: 36px;
    }
    .select-multiple{
        /deep/ .ivu-form-item-content{
            display: block;
        }
    }
    .live-hint{
        font-family: PingFangSC-Regular;
        font-size: 14px;
        color: #F54802;
        letter-spacing: 0.25px;
        margin-top: 5px;
    }
</style>
