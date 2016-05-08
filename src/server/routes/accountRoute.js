
express = require('express');
var router = express.Router();

var passport = require('passport');
var Account = require('../models/account');


// how to use passportjs https://segmentfault.com/a/1190000002926232
router.get('/register', function (req, res, next) {

    Account.register(new Account({ username : 'tf_admin' }), 'jackjack', function(err, account) {
            if (err) {
                console.log(JSON.stringify(err));
                return;
            }

            //console.log(JSON.stringify(account));
            passport.authenticate('local')(req, res, function () {
                res.redirect(urlRouter.HOST);
            });
        });
    // renderRegisterPage()
    // .then(page=>res.send(page));

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

// router.get('/login', function(req, res) {
//     console.log('login page open');
//     // renderLoginPage()
//     // .then(page=>res.send(page));
//     //res.render('login', { user : req.user });
//     res.redirect('/');
// });

router.post('/login', passport.authenticate('local', { successRedirect: '/', failureRedirect: '/login' }));
// router.post('/login', passport.authenticate('local'), function(req, res) {
//     res.redirect(urlRouter.HOST);
// });

router.get('/logout', function(req, res) {
    req.logout();
    console.log('back to home page');
    res.redirect('/');
});

module.exports = router;
