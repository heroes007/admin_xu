#!/bin/bash
echo "开始编译项目!"
npm run test
echo "开始上传静态资源到OSS!"
distPath="./server/dist"
ossPath="oss://jhyl-static-file/met_admin_test/dist"
ossutil64 cp $distPath $ossPath -r -u
echo "上传结束！"
echo "重新启动项目！"
pm2 restart met_admin