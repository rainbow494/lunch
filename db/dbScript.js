db.lunch.ensureIndex({name:1}, {unique:true})
db.lunch.insert({name:'yuki', account: 0});
db.lunch.insert({name:'nick', account: 0});
db.lunch.insert({name:'tony', account: 0});
db.lunch.insert({name:'weipu', account: 0});
db.lunch.insert({name:'chen', account: 0});
db.lunch.insert({name:'paul', account: 0});


db.lunch.update({name:'yuki'},{$set: {account: 53}});
db.lunch.update({name:'nick'},{$set: {account: -244.5}});
db.lunch.update({name:'tony'},{$set: {account: -34.5}});
db.lunch.update({name:'weipu'},{$set: {account: -49.5}});
db.lunch.update({name:'chen'},{$set: {account: 29}});
db.lunch.update({name:'paul'},{$set: {account: 0}});

db.lunch.update({name:'yuki'},{$set: {mail: '86158131@qq.com'}});
db.lunch.update({name:'nick'},{$set: {mail: '372486150@qq.com'}});
db.lunch.update({name:'tony'},{$set: {mail: '340414647@qq.com'}});
db.lunch.update({name:'weipu'},{$set: {mail: '94178875@qq.com'}});
db.lunch.update({name:'chen'},{$set: {mail: 'chenhao.gao@hotmail.com'}});
db.lunch.update({name:'paul'},{$set: {mail: 'rainbow494@qq.com'}});