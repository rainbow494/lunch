# Transfinder Shanghai Team Lunch Project
----

## This Week Planed Feature
- 用户管理
    - Lunch与Account集成为一张表
    - 个人用户登录/查看

## Planed Feature
- 发送测试邮件
    - 解决跨域问题(目前支持api测试)
    - 立即发送报告

- 用户管理
    - 修改密码
    - 修改权限
    - 增加新用户

- 邮件
    - 可修改模板

- 账目管理
    - 点击人数 / 算出价格
    - 数据备份
    - 数据导入
    - 数据库自动备份

- CI
    - <aws.mailserver.port>无法通过gulp替换
    - gulp无法监视sever下子目录内文件

- 其它
    - 利用github hook自动部署
    - GIS
    - 移动端
    - 配置

## Feature
- User Management
- Login / Logout
- Input/Edit Lunch Account
- Display Lunch Accounts' summary
- Display Lunch Account's Detail by Grid & Chart (with daily temperature)
- Send Weekly Report Each Friday Afternoon

## Quick Start
- PreInstall
    - mongoDB
    - nodejs
    - nodemon
    - node-inspector
    - gulp

- Build Debug Environment
    - Init DB
        - run ```src/db/dbScript.js``` in ```MongoDB```

    - Build
        - open ```./src/encrpty/```
        - change ```secrets-template.json``` to ```secrets.json``` and update parameter by yours
        - open ```./src/```
        - run ```npm install ```
        - run ```npm run build```

    - Run & Debug
        - open ```./src/build_debug/webSite/```
        - run ```bower install ```
        - open ```./src/build_debug/server/```
        - run ```npm install ```
        - open ```./src/```
        - run ```npm run watch``` for watch code change
        - in same path but new cmd, run ```npm run start``` for run server
        - in same path but new cmd, run ```node-inspector``` for debug (open new chrome and input http://127.0.0.1:8080/?port=5858)

----

## Scaffolding

- Front End
    - Bootstarp
    - Jquery
    - KnockoutJS

- BackEnd
    - Nodejs
        - bluebird
        - cron
        - mailgun

- WebApi
    - mailgun

- DataBase
    - MongoDB

- Test
    - mocha

- CI
    - Building
        - gulp
    - travis-ci
    - AWS CodeDeploy

- Deployment Environment
    - AWS-EC2-Ubuntu
