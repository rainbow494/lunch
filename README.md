# Transfinder Shanghai Team Lunch Project
----

## Feature
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
