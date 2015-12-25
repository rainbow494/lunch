/* jshint ignore:start */
// Create Master Collection
db.lunch.ensureIndex({name:1}, {unique:true});
db.lunch.insert({name:'yuki', account: 0});
db.lunch.insert({name:'nick', account: 0});
db.lunch.insert({name:'tony', account: 0});
db.lunch.insert({name:'weipu', account: 0});
db.lunch.insert({name:'chen', account: 0});
db.lunch.insert({name:'paul', account: 0});

// db.lunch.update({name:'yuki'},{$set: {account: 53}});
// db.lunch.update({name:'nick'},{$set: {account: -244.5}});
// db.lunch.update({name:'tony'},{$set: {account: -34.5}});
// db.lunch.update({name:'weipu'},{$set: {account: -49.5}});
// db.lunch.update({name:'chen'},{$set: {account: 29}});
// db.lunch.update({name:'paul'},{$set: {account: 0}});

db.lunch.update({name:'yuki'},{$set: {mail: '86158131@qq.com'}});
db.lunch.update({name:'nick'},{$set: {mail: '372486150@qq.com'}});
db.lunch.update({name:'tony'},{$set: {mail: '340414647@qq.com'}});
db.lunch.update({name:'weipu'},{$set: {mail: '94178875@qq.com'}});
db.lunch.update({name:'chen'},{$set: {mail: 'chenhao.gao@hotmail.com'}});
db.lunch.update({name:'paul'},{$set: {mail: 'rainbow494@qq.com'}});

//Todo : add index of table

//db.yuki_detail.remove({});

// Create Detail Collection
db.counters.ensureIndex({_id:1}, {unique:true});
db.counters.insert({_id: 'yuki_detail_seq', seq: 0});

function getNextSequence(name) {
   var ret = db.counters.findAndModify(
          {
            query: { _id: name },
            update: { $inc: { seq: 1 } },
            new: true
          }
   );

   return ret.seq;
};
//tzoffset = (new Date()).getTimezoneOffset() * 60000;
//db.yuki_detail.insert({_id: getNextSequence('yuki_detail_seq'), amount: '0', update:(new Date(Date.now() - tzoffset)).toISOString().slice(0,-1).split('T')[0] });
db.detail.insert({_id: getNextSequence('yuki_detail_seq'), name:'yuki', amount: -10, date:new Date('2015-12-01')});

db.detail.aggregate([{$group:{_id: "$name",totalAmount: { $sum: "$amount" }}},{ $out : "tmp" }]);

db.lunch.find().forEach(function (userAccount) {
    var tmp = db.tmp.find({ _id: userAccount.name }, { totalAmount: 1 });
        userAccount.account = tmp.totalAmount;
        db.lunch.save(userAccount);
});


db.tmp.find().forEach(function(tmp){
       db.lunch.findAndModify({
            query:{name:tmp._id},
            update:{account:tmp.totalAmount}
       });
});
/* jshint ignore:end */