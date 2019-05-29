<template>
    <div ref="NewEditorBox" class="box">
        <div :id="editorId" class="h100"></div>
    </div>
</template>

<script>
    import axios from 'axios'
    import E from './wangEditor'
    import {get_sign} from '../api/modules/ali_oss'
    const ossHost = 'http://jhyl-static-file.oss-cn-hangzhou.aliyuncs.com';
    export default {
        name: "NewEditor",
        data() {
            return {
                editorHtml: null,
                resourse_url: '',
                img_url: '',
                host: 'http://jhyl-static-file.oss-cn-hangzhou.aliyuncs.com',
                uploadConfig: {
                    bucket: 'jhyl-static-file',
                    dir: 'user_task',
                    type: 1
                },
                editor: '',
                fileSize: null,
            }
        },
        props: {
            content: {
                type: String,
                default: ''
            },
            editorId: {
                type: String,
                default: 'div'
            }
        },
        watch:{
            content(val) {
                this.editor.txt.html(val)
            }
        },
        beforeDestroy(){
            this.setEditor = null;
            this.handleUploadFile = null;
            this.handleGetassignKey = null;
            this.resourse_url = ''
        },
        methods: {
            handleUploadFile(form_data, url, insert) {
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
                    if(insert) {
                        insert(this.img_url)
                    }
                });
            },
            handleGetassignKey(file_item, insert) {
                this.fileSize = file_item.size / (1024 * 1024);
                if (this.fileSize > 2) {
                    this.$Modal.info({
                        title: '提示',
                        content: `文件不能超过2M`,
                        onOk: () => {
                        }
                    });
                    return;
                }
                var date = new Date();
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
                            this.handleUploadFile(formData, encodeURI(ossHost), insert);
                        }
                    })
            },
            selectText(){
                if(document.Selection){       
                    //ie浏览器
                    return document.selection.createRange().text;     	 
                }else{    
                    //标准浏览器
                    return window.getSelection().toString(); 
                }	 
            },
            handleSize(v){
                if(v.includes('x-small')) return 12
                else if(v.includes('small')) return 13
                else if(v.includes('xx-large')) return 32
                else if(v.includes('x-large')) return 24
                else if(v.includes('large')) return 18
                else return 16
            },
            setEditor(){
                let vm = this
                this.editorHtml = this.content;
                this.editor = new E(`#${this.editorId}`)
                this.editor.customConfig.menus = ['fontSize', 'redo', 'bold', 'underline', 'foreColor', 'image', 'justify', 'list']
                this.editor.customConfig.customUploadImg = function (files, insert) {
                    vm.handleGetassignKey(files[0], insert)
                }
                this.editor.customConfig.pasteTextHandle = function (content) {
                    // content 即粘贴过来的内容（html 或 纯文本），可进行自定义处理然后返回
                    return `<div style="font-size: 16px;">${content}</div>`
                }
                this.editor.customConfig.showLinkImg = false
                this.editor.customConfig.onchange = function (html) {
                    vm.editorHtml = html
                }
                this.$refs.NewEditorBox.addEventListener('mouseleave', function () {
                    let text = vm.editorHtml ? vm.editorHtml : vm.content
                    vm.$emit('get-content',  `<div style="font-size: 16px;">${text}</div>`)
                })
                let doc = document.getElementById(this.editorId)
                let size = 16
                doc.onmousemove = function(){
                    let html1 = null
                    let text = vm.editor.txt.html()
                    if(document.Selection){       
                        //ie浏览器
                        html1 = document.selection.createRange().text;     	 
                    }else{    
                        //标准浏览器
                        html1 = window.getSelection().toString();	 
                    }	
                    if(text.includes(html1)){
                        let t2 = document.querySelectorAll('.w-e-menu')[1];
                        let d = text.split('</span>')
                        d.forEach((v,i) => {
                            if(v.includes(html1)){
                                if(v.includes('font-size')){
                                  size = vm.handleSize(v)
                                  t2.innerHTML = size
                                }else{
                                    t2.innerHTML = 16
                                }                             
                            }
                        });
                    }
                };  
                this.editor.customConfig.zIndex = 0
                this.editor.create()
                let t2 = document.querySelectorAll('.w-e-menu')[1];
                t2.innerHTML = size
                this.editor.txt.html(this.content)
            }
        },
        mounted() {
            this.setEditor()
        },
    }
</script>

<style scoped>
    .box{
        min-width: 400px;
    }
    .h100{
        height: 100%;
        font-size: 16px
    }
    /deep/ .w-e-text-container{
        height: calc(100% - 44px) !important;
    }
</style>
