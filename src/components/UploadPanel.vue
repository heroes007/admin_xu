<template>
    <Row class="upload-panel">
        <Icon class="icon-colse" v-if="close&&!is_show" type="md-close-circle" @click="closeModal" />
        <Row class="upload-space" v-show="is_show" :style="{width: panelOptions.panelWidth + 'px', height: panelOptions.panelHeight + 'px'}">
            <input type="file" style="font-size: 1.2em; padding: 10px 0;" @change="handleChangeMedia" />
            <!--<Icon class="md-cloud-upload" :size=56 type="md-cloud-upload" />-->
            <img class="md-cloud-upload" src="../../static/icon/upload.png" alt="">
            <div class="el-dragger__text">将文件拖到此处，或<em>点击上传</em></div>
        </Row>
        <!-- <vue-cropper v-show="isCropper && !is_show" ref='cropper' :guides="true" :view-mode="2" :drag-mode="crop" :auto-crop-area="1" :min-container-width="250" :min-container-height="180" :background="true" :rotatable="true" :src="this.imgSrc" alt="Source Image" :imgStyle="{width: '100%', height: '200px' }">
    </vue-cropper> -->
        <Row class="img" v-if="type=='image'&&!is_show">
            <img :src="resourse_url?resourse_url:resultUrl" alt="" />
            <input type="file" accept="*" style="font-size: 1.2em; padding: 10px 0;" @change="handleChangeMedia" />
        </Row>
        <span style="display: none">{{resultUrl}}</span>
        <Row class="video" v-if="type=='video'&&!is_show">
            <video :src="resourse_url?resourse_url:resultUrl" controls="controls" autoplay/>
            <input type="file" accept="*" style="font-size: 1.2em; padding: 10px 0;" @change="handleChangeMedia" />
        </Row>
        <div class="file-require">
            <slot name="file-require"></slot>
        </div>
        <!-- <Row class="uploaded-files-container" v-show="resultUrl">
      <Row class="uploaded-file"><span class="el-icon-document"></span>{{file_name}}</Row>
    </Row> -->
    </Row>
</template>

<script>
    import VueCropper from 'vue-cropperjs'
    import { get_sign } from '../api/modules/ali_oss'
    import axios from 'axios'
    const ossHostImage = 'http://dscj-app.oss-cn-qingdao.aliyuncs.com/';
    const ossHostVideo = 'http://dscj-video.oss-cn-beijing.aliyuncs.com/';
    const ossHostApp = 'http://dscj-static-file.oss-cn-qingdao.aliyuncs.com/';
    import { get_video_source } from '../api/modules/tools_video'
    export default {
        props: {
            panelOptions: {
                type: Object,
                default: function () {
                    return {
                        panelWidth: '100%',
                        panelHeight: 250
                    }
                }
            },
            uploadConfig: {
                type: Object,
                default: function () {
                    return {
                        bucket: 'dscj-app',
                        dir: 'user_task',
                        type: 1
                    }
                }
            },
            resourse: {},
            close: {
                type: Boolean,
                default: false
            }
        },
        data() {
            return {
                teacherManageDialog: true,
                form: {
                    teacher_name: '',
                    teacher_description: '',
                },
                imgSrc: '',
                file_name: '',
                upload_address: '',
                file_list: [],
                show_file_name: false,
                percentage: 0,
                form_data: null,
                is_show: true,
                type: '',
                resourse_url: '',
                fullscreenLoading: null
            }
        },
        computed: {
            resultUrl() {
                var result = this.resourse;
                if (/\.(gif|jpg|jpeg|png|GIF|JPG|PNG)/.test(this.resourse)) {
                    this.type = 'image';
                    this.is_show = false;
                }
                if (/\.(mp4|wav|mov)/.test(this.resourse)) {
                    this.type = 'video';
                    this.is_show = false;
                    // if(result.indexOf('http') < 0)
                    //     result = 'http://video.laoshi123.com/' + this.resourse;
                }
                return result;
            }
        },
        methods: {
            handleSave() {
                //获取剪切后的图片对象并且上传到服务器
                this.$refs.cropper.getCroppedCanvas().toBlob(blob => {
                    blob.name = this.file_name
                    this.handleGetassignKey(blob);
                })
            },
            closeModal(){
                this.is_show = true;
                // this.resourse_url = '';
                // this.resultUrl = ''
                this.$emit('uploadcomplete', "");
            },
            //通过插件显示图片
            handleChangeMedia(e) {
                 this.fullscreenLoading = this.$LoadingY({message: "",show: true})
                // const file = e.target.files[0];
                // if(this.isCropper){
                //   this.is_show = false;
                // }
                // if (!file.type.includes('image/')) {
                //     alert('Please select an image file');
                //     return;
                // }
                //
                // if (typeof FileReader === 'function') {
                //     // FileReader H5的属性；
                //     const reader = new FileReader();
                //
                //     reader.onload = (event) => {
                //         this.imgSrc = event.target.result;
                //         // rebuild cropperjs with the updated source
                //         this.$refs.cropper.replace(event.target.result);
                //     };
                //
                //     reader.readAsDataURL(file);
                // } else {
                //     alert('Sorry, FileReader API not supported');
                // }
                this.handleUploadChange(e);
            },
            // 获取图片名称
            handleUploadChange(event) {
                var filename = event.target.value.substring(event.target.value.lastIndexOf("\\") + 1, event.target.value
                    .length);
                this.show_file_name = true;
                this.file_name = filename;
                if (this.handleCheckMedia(event)) {
                    this.handleGetassignKey(event.target.files[0]);
                }
            },
            handleCheckMedia(event) {
                // if (this.uploadConfig.type == 1) {
                //     if (!(event.target.files[0].type.indexOf('image') < 0)) {
                //         this.type = 'image';
                //         return true;
                //     } else {
                //         alert('只能上传图片！');
                //         return false;
                //     }
                // } else if (this.uploadConfig.type == 2) {
                //     if (!(event.target.files[0].type.indexOf('video') < 0)) {
                //         this.type = 'video';
                //         return true;
                //     } else {
                //         alert('只能上传视频！');
                //         return false;
                //     }
                // }

                var _type = this.uploadConfig.type;
                // debugger;
                // console.log(event.target.files[0].type);
                switch (_type) {
                    case 0:
                        this.type = event.target.files[0].type;
                        return true;
                    case 1:
                        if (!(event.target.files[0].type.indexOf('image') < 0)) {
                            this.type = 'image';
                            return true;
                        } else {
                            this.$Message.warning('只能上传图片！');
                            if(this.fullscreenLoading) this.fullscreenLoading.close()
                            return false;
                        }
                    case 2:
                        if (!(event.target.files[0].type.indexOf('video') < 0)) {
                            this.type = 'video';
                            return true;
                        } else {
                            this.$Message.warning('只能上传视频！');
                            if(this.fullscreenLoading) this.fullscreenLoading.close()
                            return false;
                        }
                    case 3:
                        if (!(event.target.files[0].name.indexOf('.apk') < 0)) {
                            this.type = 'apk';
                            return true;
                        } else {
                            this.$Message.warning('请上传apk后缀文件,请重试');
                            if(this.fullscreenLoading) this.fullscreenLoading.close()
                            return false;
                        }
                    case 4:
                        if (!(event.target.files[0].type.indexOf('video') < 0)) {
                            this.type = 'video';
                            return true;
                        } else {
                            this.$Message.warning('只能上传视频！');
                            if(this.fullscreenLoading) this.fullscreenLoading.close()
                            return false;
                        }
                }
            },
            // 上传到oss上
            handleUploadFile(form_data, url, fileItem) {
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
                    var result;
                    switch (this.uploadConfig.type) {
                        case 0:
                            result = url + this.resourse_url;
                            this.resourse_url = url + this.resourse_url;
                            break;
                        case 1:
                            result = url + this.resourse_url;
                            // result = encodeURI(url + this.resourse_url).replace('dscj-app.oss-cn-qingdao.aliyuncs.com','file.laoshi123.com');
                            this.resourse_url = url + this.resourse_url;
                            this.is_show = false;
                            break;
                        case 2:
                            result = 'http://video.laoshi123.com/' + this.resourse_url;
                            this.resourse_url = URL.createObjectURL(fileItem);
                            this.is_show = false;
                            break;
                        case 3:
                            result = encodeURI(url + this.resourse_url).replace('dscj-static-file.oss-cn-qingdao.aliyuncs.com','file.laoshi123.com');
                            this.resourse_url = url + this.resourse_url;
                            this.is_show = false;
                            break;
                        case 4:
                            result = encodeURI(url + this.resourse_url).replace('dscj-static-file.oss-cn-qingdao.aliyuncs.com','file.laoshi123.com');
                            this.resourse_url = url + this.resourse_url;
                            this.is_show = false;
                            break;
                    };

                    this.$emit('getuploadfile', {
                        name: this.file_name,
                        url: result
                    });
                    this.$emit('uploadcomplete', result);
                    if(this.fullscreenLoading) this.fullscreenLoading.close()
                });
            },
            // 从oss上获取assignKey;
            handleGetassignKey(file_item) {
                var date = new Date(); //dscj-app,user_task
                date = date.toGMTString();
                get_sign(file_item.type, date, this.uploadConfig.bucket, this.uploadConfig.dir, file_item.name, 'POST')
                    .then(res => {
                        if (res.data.res_code == 1) {
                            const formData = new FormData();
                            this.resourse_url = res.data.msg.filename;
                            formData.append('key', res.data.msg.filename);
                            formData.append('OSSAccessKeyId', res.data.msg.accessKeyID);
                            formData.append('success_action_status', '200');
                            formData.append('signature', res.data.msg.sign);
                            formData.append('policy', res.data.msg.policyBase64);
                            formData.append('file', file_item);
                            switch (this.uploadConfig.type) {
                                case 0:
                                    this.handleUploadFile(formData, encodeURI(ossHostImage));
                                    break;
                                case 1:
                                    this.handleUploadFile(formData, encodeURI(ossHostImage));
                                    break;
                                case 2:
                                    this.handleUploadFile(formData, encodeURI(ossHostVideo), file_item);
                                    break;
                                case 3:
                                    this.handleUploadFile(formData, encodeURI(ossHostApp));
                                    break;
                                case 4:
                                    this.handleUploadFile(formData, encodeURI(ossHostApp));
                                    break;
                            };

                        }
                    })
            },
        }
    }
</script>
<style lang="scss" scoped>
    .icon-colse{
        position: absolute;
        z-index: 1000;
        right: 0;
        color: white;
        font-size: 20px;
    }
    /deep/ .md-cloud-upload{
        margin-top: 70px;
    }
    .upload-panel {
        .file-require {
            font-size: 12px;
            color: #757575;
            letter-spacing: 0;
            line-height: 20px;
            text-align: left;
            margin-top: 10px;
        }
        .img {
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            border: 1px solid #d3d3d3;
            background: #fff;
            img {
                width: 100%;
                height: 100%;
            }
            input{
                width: 100%;
                height: 74% !important;
            }
        }
        .video {
            @extend .img;
            video {
                width: 100%;
            }
        }

        .upload-space {
            height: 250px;
            background: #F6F6F6;
            border: 1px solid #CCCCCC;
            display: block;
            text-align: center;
            .el-dragger__text {
                font-size: 14px;
                color: #757575;
                letter-spacing: 0;
                line-height: 14px;
                margin-top: 20px;
                em {
                    margin-left: 5px;
                    font-size: 14px;
                    color: #3DAAFF;
                    letter-spacing: 0;
                    line-height: 14px;
                }
            }

            .el-icon-upload {
                font-size: 4em;
                color: #999999;
                margin-top: 40px;
            }
        }
        input[type=file] {
            width: 100%;
            height: 200px;
            position: absolute;
            top: 0;
            right: 0;
            margin: 0;
            padding: 0;
            cursor: pointer;
            opacity: 0;
            filter: alpha(opacity=0);
        }
        .uploaded-files-container {
            margin-top: 40px;
            text-align: left;
            .uploaded-file {
                padding-left: 9px;
                padding-right: 9px;
                display: inline-block;
                height: 30px;
                line-height: 30px;
                border: 1px solid #ccc;
                border-radius: 4px;
                span {
                    margin-right: 10px;
                }
            }
        }
    }
</style>
