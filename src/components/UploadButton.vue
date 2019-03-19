<template>
    <div contentEditable="false">
        <div v-if="imgtypes">
            <img class="uploadImg" src="../assets/icons/icon/upload.png" @click='handleStartUploadFile'/>
            <input type="file" ref="input" class="el-upload__input" @change="handleUploadChange" :accept="type">
        </div>
        <div v-else class='el-upload__inner' contentEditable="false">
            <img v-if="iconType" :src="iconType"  @click='handleStartUploadFile' style="cursor: pointer"/>
            <Button v-else type='primary' @click='handleStartUploadFile'>{{text}} </Button>
            <input type="file" ref="input" class="el-upload__input" @change="handleUploadChange" :accept="type">
        </div>
    </div>
</template>
<script>
    import { get_sign } from '../api/modules/ali_oss'
    import { Config } from '../config/base'
    import axios from 'axios'

    export default{
        data(){
            return{
                resultUrl:'',
                fileName: ''
            }
        },
        props:{
            imgtypes: {
                type: Number,
                default: 0
            },
            type:{
                type:String,
                default:'*'
            },
            bucket:{
                type:String,
                default:'dscj-img'
            },
            dir:{
                type:String,
                default:'wenda'
            },
            text:{
                type:String,
                default:'上传文件'
            },
            host:{
                type:String,
                default:Config.ossHost
            },
            iconType: {
              type:String,
              default: ''
            }
        },
        methods: {
            handleStartUploadFile() {
                this.$refs.input.click();
            },
            handleUploadChange(event) {
                var filename = event.target.value.substring(event.target.value.lastIndexOf("\\") + 1, event.target.value.length);
                this.fileName = filename;
                this.handleGetassignKey(event.target.files[0]);
            },
            handleUploadFile(formData, url, headers) {
                // TODO 上传到OSS上
                let vm = this;
                axios({
                    method: 'POST',
                    url: url,
                    data: formData,
                }).then(res => {
                  this.resultUrl = url + '/' + this.resultUrl;
                    this.$emit('uploadcomplete',{name: this.fileName, url: this.resultUrl});
                    var f = this.$refs.input;
                    if(f.value){
                        var form = document.createElement('form'), ref = f.nextSibling;
                        form.appendChild(f);
                        form.reset();
                        if(ref && ref.parentNode) ref.parentNode.insertBefore(f,ref);
                    }
                });
            },
            handleGetassignKey(fileItem) {
                var date = new Date();
                date = date.toGMTString();
                get_sign(fileItem.type, date, this.bucket, this.dir, fileItem.name, 'POST').then(res => {
                    if (res.data.res_code == 1) {
                        const formData = new FormData();
                        this.resultUrl = res.data.data.filename;
                        formData.append('key', res.data.data.filename);
                        formData.append('OSSAccessKeyId', res.data.data.accessKeyID);
                        formData.append('success_action_status', '200');
                        formData.append('signature', res.data.data.sign);
                        formData.append('policy', res.data.data.policyBase64);
                        formData.append('file', fileItem);
                        this.handleUploadFile(
                                formData,
                                encodeURI(this.host)
                        );
                    }
                })
            }
        },
        mounted() {

        }
    }
</script>
<style scoped>
.uploadImg{
  cursor: pointer;
  width: 60px;
  height: 60px;
}
</style>

