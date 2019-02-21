#!/bin/bash
echo "开始清空项目"
npm run clean
echo "开始编译项目!"
npm run build
echo "开始上传静态资源到OSS!"
distPath="./server/dist"
ossPath="oss://tlw-web-static-file/tlw-wx-egg/"
ossutile64 cp $distPath $ossPath -r -u
echo "上传结束！"
echo "结束已存在项目！"
npm stop
echo "重新启动项目！"
npm start