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

//db.detail.remove({});
//db.counters.remove({});
// Create Detail Collection
db.counters.ensureIndex({_id:1}, {unique:true});
db.counters.insert({_id: 'detail_seq', seq: 0});

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
//db.detail.insert({_id: getNextSequence('yuki_detail_seq'), amount: '0', update:(new Date(Date.now() - tzoffset)).toISOString().slice(0,-1).split('T')[0] });
db.detail.insert({_id: getNextSequence('detail_seq'), name:'yuki', amount: -10, date:new Date('2015-12-01')});
db.detail.insert({_id: getNextSequence('detail_seq'), name:'yuki', amount: -15, date:new Date('2015-12-02')});

db.detail.insert({_id: getNextSequence('detail_seq'), name:'nick', amount: -12, date:new Date('2015-12-17')});
db.detail.insert({_id: getNextSequence('detail_seq'), name:'nick', amount: -12, date:new Date('2015-12-18')});
db.detail.insert({_id: getNextSequence('detail_seq'), name:'nick', amount: -12, date:new Date('2015-12-19')});
db.detail.insert({_id: getNextSequence('detail_seq'), name:'nick', amount: -30, date:new Date('2015-12-20')});
db.detail.insert({_id: getNextSequence('detail_seq'), name:'nick', amount: -19, date:new Date('2015-12-21')});
db.detail.insert({_id: getNextSequence('detail_seq'), name:'nick', amount: -32, date:new Date('2015-12-22')});
db.detail.insert({_id: getNextSequence('detail_seq'), name:'nick', amount: -22, date:new Date('2015-12-23')});
db.detail.insert({_id: getNextSequence('detail_seq'), name:'nick', amount: -15, date:new Date('2015-12-24')});
db.detail.insert({_id: getNextSequence('detail_seq'), name:'nick', amount: -12, date:new Date('2015-12-26')});
db.detail.insert({_id: getNextSequence('detail_seq'), name:'nick', amount: 200, date:new Date('2015-12-26')});

//db.tmp.remove({});
db.detail.aggregate([{$group:{_id: "$name",totalAmount: { $sum: "$amount" }}},{ $out : "tmp" }]);

// Normal solution : left join, need add if statement to handle unmatched rows.
// db.lunch.find().forEach(function (userAccount) {
    // //print(tojson(userAccount));
    // //print(userAccount.name);
    // var ret = db.tmp.findOne({ _id: userAccount.name }, { totalAmount: 1 });
    
    // if (ret)
    // {
        // print(tojson(ret));
        // userAccount.account = ret.totalAmount;
        // db.lunch.save(userAccount);
    // }
// });

// Better solution : right join, without unmatched rows.
db.tmp.find().forEach(function(ret){
        //print(tojson(ret));
       db.lunch.findAndModify({
            query:{name:ret._id},
            update:{$set :{account:ret.totalAmount}}
       });
});

/* jshint ignore:end */