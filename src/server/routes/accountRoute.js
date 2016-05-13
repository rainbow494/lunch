
express = require('express');
var router = express.Router();

var passport = require('passport');
var Account = require('../models/account');


// var isAuthenticated = function (req,res,next) {
//     if (req.isAuthenticated()) return next();
//     res.redirect('/login');
// };
//
// router.post('/api/lunch/*', isAuthenticated ,function(req, res, next){
//     // req.next();
// });

// how to use passportjs https://segmentfault.com/a/1190000002926232
router.get('/register', function (req, res, next) {
    Account.register(new Account({ username : 'dl_admin' }), 'dl123', function(err, account) {
            if (err) {
                console.log(JSON.stringify(err));
                res.redirect('/');
                return;
            }

            //console.log(JSON.stringify(account));
            passport.authenticate('local')(req, res, function () {
                res.redirect('/');
            });
        });
    // renderRegisterPage()
    // .then(page=>res.send(page));

});

router.get('/setPassword', function (req, res, next) {
    Account.findByUsername('tf_admin').then(function(sanitizedUser){
        if (sanitizedUser){
            sanitizedUser.setPassword('1', function(){
                sanitizedUser.save();
                return res.status(200).json({msg: 'password reset successful'});
            });
        } else {
            res.status(200).json({status: 0, msg: 'This user does not exist'});
        }
    },function(err){
        console.log(err);
    });
});

// router.post('/register', function(req, res) {
//     Account.register(new Account({ username : req.body.username }), req.body.password, function(err, account) {
//         if (err) {
//             //console.log(JSON.stringify(err));
//             // renderRegisterPage({error: err.message})
//             // .then(page=>res.send(page));
//             return;
//         }
//
//         //console.log(JSON.stringify(account));
//         passport.authenticate('local')(req, res, function () {
//             // res.redirect(urlRouter.HOST);
//         });
//     });
// });

router.get('/login', function(req, res) {
    // console.log('login page open');
    if (!req.isAuthenticated())
        res.redirect('/login.html');
    else
        res.redirect('/');
});

router.post(
    '/login',
    passport.authenticate('local',
        {
            successRedirect: '/',
            failureRedirect: '/login.html'
        }),
    function(req, res) {

    }
);

router.get('/logout', function(req, res) {
    req.logout();
    console.log('back to home page');
    res.redirect('/');
});

router.get('/api/verify', function(req, res) {
    if (req.isAuthenticated())
        res.json(req.user.username);
    else
        res.json(false);
});

module.exports = router;
