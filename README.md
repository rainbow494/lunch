# Transfinder Shanghai Team Lunch Project
----

## This Week Planed Feature
- 其他
    - 让favicon正常显示

- 用户管理
    - 页面验证失败后未跳转到登录页面
    - 禁止非管理员查看他人账号
    - 禁止非管理员查看Edit / Manager 页面

## Planed Feature
- 用户管理
    - 修改密码后登出
    - 权限如何正确分组？？？
    - 修改权限
    - 增加新用户

- 通过api重启服务
- 通过api下载日志

- 邮件
	- 动态修改邮件发送时间
    - 可修改模板

- 账目管理
    - 点击人数 / 算出价格
    - 数据备份
    - 数据导入
    - 数据库自动备份

- CI
    - gulp无法监视sever下子目录内文件

- 其它
    - 利用github hook自动部署
    - GIS
    - 移动端
    - 配置

## Feature
- User Management
    - Login / Logout
    - Reset Mail / Password
    - Send Weekly Report Immediately
- Lunch Account Management
    - Input/Edit Lunch Account
    - Display Lunch Accounts' summary
    - Display Lunch Account's Detail by Grid & Chart (with daily temperature)
- Schedule
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
