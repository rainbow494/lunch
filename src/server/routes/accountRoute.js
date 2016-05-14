
express = require('express');
var router = express.Router();

var passport = require('passport');
var Lunch = require('../models/lunch');

// var isAuthenticated = function (req,res,next) {
//     if (req.isAuthenticated()) return next();
//     res.redirect('/login');
// };
//
// router.post('/api/lunch/*', isAuthenticated ,function(req, res, next){
//     // req.next();
// });

// var isAuthenticated = function (req,res,next) {
//     if (req.isAuthenticated()) return next();
//     res.redirect(203, {'redirect page:': 'http://<aws.hostname>:<aws.webserver.port>/login'});
// };
//
// var isAdmin = function (req,res,next) {
//     if (req.isAuthenticated() && req.user.isAdmin()) return next();
//     res.redirect(203, {'redirect page:': 'http://<aws.hostname>:<aws.webserver.port>/login'});
// };

// router.get('/api/user/*', isAuthenticated ,function(req, res, next){
//     next();
// });
//
// router.post('/api/user/*', isAdmin ,function(req, res, next){
//     next();
// });

// router.get('/backdoor', function (req, res, next) {
//     Lunch.findByUsername('yuki').then(function(sanitizedUser){
//         if (sanitizedUser){
//             sanitizedUser.setPassword('1', function(){
//                 sanitizedUser.save();
//                 return res.status(200).json({msg: 'password reset successful'});
//             });
//         } else {
//             res.status(200).json({status: 0, msg: 'This user does not exist'});
//         }
//     },function(err){
//         console.log(err);
//     });
// });

// how to use passportjs https://segmentfault.com/a/1190000002926232
router.get('/api/user/register', function (req, res, next) {
    // var username = req.body.username || 'aa';
    // var password = req.body.password || '1';
    // Lunch.register(new Lunch({ username : username }), password, function(err, account) {
    //         if (err) {
    //             console.log(JSON.stringify(err));
    //             res.redirect('/');
    //             return;
    //         }
    //
    //         passport.authenticate('local')(req, res, function () {
    //             res.redirect('/');
    //         });
    //     });
});

router.post('/api/user/setPassword', function (req, res, next) {
    var username = req.body.username;
    var password = req.body.password;
    Lunch.findByUsername(username).then(function(sanitizedUser){
        if (sanitizedUser){
            sanitizedUser.setPassword(password, function(){
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
