#!/bin/bash
echo "开始编译项目!"
npm run build
echo "开始上传静态资源到OSS!"
distPath="./server/dist"
ossPath="oss://tlw-web-static-file/met_admin/dist"
ossutile64 cp $distPath $ossPath -r -u
echo "上传结束！"
echo "重新启动项目！"
pm2 restart met_admin