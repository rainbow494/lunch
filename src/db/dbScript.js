/* jshint ignore:start */
// Create Master Collection
db.lunch.ensureIndex({name:1}, {unique:true});
db.lunch.insert({name:'nick', account: 0});
db.lunch.insert({name:'tony', account: 0});
db.lunch.insert({name:'weipu', account: 0});
db.lunch.insert({name:'paul', account: 0});
db.lunch.insert({name:'ted', account: 0});
db.lunch.insert({name:'leo', account: 0});
// db.lunch.update({name:'yuki'},{$set: {account: 53}});

db.lunch.update({name:'nick'},{$set: {mail: 'weihuan.wang@transfinder.com'}});
db.lunch.update({name:'tony'},{$set: {mail: 'tony.chen@transfinder.com'}});
db.lunch.update({name:'weipu'},{$set: {mail: 'weipu.zhao@transfinder.com'}});
db.lunch.update({name:'paul'},{$set: {mail: 'rainbow494@qq.com'}});

db.lunch.update({name:'ted'},{$set: {mail: 'kai.li@transfinder.com'}});
db.lunch.update({name:'leo'},{$set: {mail: 'chenjie.deng@transfinder.com'}});

// db.detail.remove({});
// db.detail.insert(name:'nick', amount: -15, date:new Date('2015-12-24')});
// db.detail.insert(name:'nick', amount: -12, date:new Date('2015-12-26')});

db.weather.insert({date:new Date('2016-02-11'), high:18, low:14, 'text':'rainy'});
db.weather.insert({date:new Date('2016-02-12'), high:20, low:14, 'text':'cloudy'});
db.weather.insert({date:new Date('2016-02-13'), high:19, low:4, 'text':'light rainy'});

db.system.js.save(
    {
        _id:"updateLunchAmount",
        value:function (name) {
            db.detail.aggregate([{$group:{_id: "$name",totalAmount: { $sum: "$amount" }}},{ $out : "tmp" }]);

            // Better solution : right join, without unmatched rows.
            db.tmp.find().forEach(function(ret){
                    //print(tojson(ret));
                   db.lunch.findAndModify({
                        query:{name:ret._id},
                        update:{$set :{account:ret.totalAmount}}
                   });
            });
        }
    }
);

db.loadServerScripts();

// Upgrade Detail Collection
// db.detail.find().forEach(function(doc){
//     doc._id=ObjectId(); db.detail_new.insert(doc);
// });
// db.detail_new.renameCollection("detail", true);

// Create Detail Collection
// db.counters.remove({});
// db.counters.ensureIndex({_id:1}, {unique:true});
// db.counters.insert({_id: 'detail_seq', seq: 0});
// db.system.js.save(
//     {
//         _id:"getNextSequence",
//         value:function (name) {
//             var ret = db.counters.findAndModify(
//                   {
//                     query: { _id: name },
//                     update: { $inc: { seq: 1 } },
//                     new: true
//                   }
//            );
//            return ret.seq;
//         }
//     }
// );
// tzoffset = (new Date()).getTimezoneOffset() * 60000;
// // db.detail.insert({_id: getNextSequence('yuki_detail_seq'), amount: '0', update:(new Date(Date.now() - tzoffset)).toISOString().slice(0,-1).split('T')[0] });
// db.loadServerScripts();

/* jshint ignore:end */
