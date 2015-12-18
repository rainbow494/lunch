var gulp = require('gulp');
var del = require('del');
var replace = require('gulp-replace');
var jshint = require('gulp-jshint');
var argv = require('yargs').argv;
var secrets = require('../encrpty/secrets.json');

path = {
    backendPath : '../backend',
    website : '../website',
    distPath : '../dist',
    debug_distPath : '../debug-dist'
};

function setDebugEnv() {
    secrets.aws.hostname = 'localhost';
    path.distPath = path.debug_distPath;
}

if (argv.debug) {
    setDebugEnv();
}
/////////////////////////////////////////////////////////////////

gulp.task('lint', function () {
    gulp.src(['*.js', '!node_modules/**'], {
        cwd : path.backendPath
    })
    .pipe(jshint())
    .pipe(jshint.reporter('default'));
});

gulp.task('clean-debug', function (done) {
    return del(['**',
            '!backend',
            '!backend/node_module',
            '!backend/node_modules/**',
            '!website',
            '!website/bower_components',
            '!website/bower_components/**'], {
        cwd : path.distPath
    });
});

gulp.task('clean', function () {
    return del(['**'], {
        cwd : path.distPath
    });
});

gulp.task('backend', function () {
    // Minify and copy all JavaScript (except vendor scripts)
    // with sourcemaps all the way down
    return gulp.src(['**', '!node_modules/**'], {
        cwd : path.backendPath
    })
    .pipe(replace('<mailgun.api_key>', secrets.mailgun.api_key))
    .pipe(replace('<mailgun.domain>', secrets.mailgun.domain))
    .pipe(replace('<aws.hostname>', secrets.aws.hostname))
    .pipe(replace('<aws.webserver.port>', secrets.aws.webserver.port))
    .pipe(replace('<aws.mailserver.port>', secrets.aws.mailserver.port))
    .pipe(replace('<mongodb.hostname>', secrets.mongodb.hostname))
    .pipe(replace('<mongodb.port>', secrets.mongodb.port))
    .pipe(replace('<mongodb.dbname>', secrets.mongodb.dbname))
    .pipe(gulp.dest(path.distPath + '/backend'));
});

gulp.task('website', function () {
    // Minify and copy all JavaScript (except vendor scripts)
    // with sourcemaps all the way down
    return gulp.src(['**', '!bower_components/**'], {
        cwd : path.website
    })
    .pipe(replace('<aws.hostname>', secrets.aws.hostname))
    .pipe(replace('<aws.webserver.port>', secrets.aws.webserver.port))
    .pipe(gulp.dest(path.distPath + '/webSite'));
});

gulp.task('default',
    gulp.series('clean', 'backend', 'website'));

gulp.task('debug',
    gulp.series('clean-debug', 'backend', 'website'));

gulp.task('debug-watch', function () {
    setDebugEnv();
    
    var watcher_backend = gulp.watch(['*.js', '!node_modules/**'], {
            cwd : path.backendPath
        }, gulp.series('backend'));
        
    watcher_backend.on('change', function (event) {
        console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
    });

    var watcher_website = gulp.watch(['**', '!bower_components/**'], {
            cwd : path.website
        }, gulp.series('website'));
        
    watcher_website.on('change', function (event) {
        console.log('File ' + event.path + ' was ' + event.type + ', running tasks...');
    });
})
