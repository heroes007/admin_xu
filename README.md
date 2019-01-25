# dscj-admin-xg

> vue2.0 全家桶启动模板
Vue2.0+vue-router2.0+Vuex2.0+Vue-resource+element-ui

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:4000
npm run dev

# build for production with minification
npm run build
```
# 启动网站
cd server && npm run server



### bug

##### 2.线上课 - 编辑章节：没有获取数据
##### 3.查看学员 - 查看详情：保存接口超时


##### 4.招生管理：数据操作无法测试
##### 5.我是导师 - 我的指导：无数据


#产品流程

#线上课
1 创建产品                               ####产品状态 --- 编辑中
2 添加讲师     （可选）                   ####产品状态 --- 编辑中
3 添加课程资料 -- 启用课程资料（可选）       ####产品状态 --- 编辑中
4 添加公共资料 -- 启用公共资料（可选）       ####产品状态 --- 编辑中
5 添加 线上课  （可选）                    ####产品状态 --- 编辑中
6 产品信息 -- 查看 -- 添加 -- 课程列表      ####产品状态 --- 编辑中
7 改 -- 产品状态 -- 正常                  ####产品状态 --- 正常


#线下课
1 添加/复制学期
2 添加课程
3 启用线下课
4 发送学期 -- 发送线下课

#任务包
1 添加分类
2 创建 -- 创建任务
3 激活 -- 手动激活/定时激活

#权限
1 查看用户 -- 编辑  -- 分配权限
2 创建学员
3 查看学员  -- 查看详情 -- 线上课 -- 解锁测验
